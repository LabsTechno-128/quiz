import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { User } from '../user/entities/user.entity';
import { Product, ProductType } from '../product/entities/product.entity';
import { SslCommerzService } from './sslcommerz.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly sslCommerzService: SslCommerzService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) { }

  async initPayment(userId: string, productIds: { id: string; quantity: number }[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Calculate Total Amount and Fetch Products
      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of productIds) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.id } });
        if (!product) throw new NotFoundException(`Product ${item.id} not found`);

        const price = product.offerPrice || product.sellPrice;
        totalAmount += Number(price) * item.quantity;

        orderItemsData.push({
          product,
          quantity: item.quantity,
          price: price,
        });
      }

      const tran_id = `TRAN_${uuidv4().split('-')[0].toUpperCase()}_${Date.now()}`;

      // 2. Create Order
      const order = queryRunner.manager.create(Order, {
        user: { id: userId } as User,
        totalAmount,
        status: OrderStatus.PENDING,
      });
      const savedOrder = await queryRunner.manager.save(order);

      // 3. Create Order Items
      for (const itemData of orderItemsData) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          product: itemData.product,
          quantity: itemData.quantity,
          price: itemData.price,
        });
        await queryRunner.manager.save(orderItem);
      }

      // 4. Create Payment record
      const payment = queryRunner.manager.create(Payment, {
        transactionId: tran_id,
        amount: totalAmount,
        status: PaymentStatus.PENDING,
        order: savedOrder,
      });
      await queryRunner.manager.save(payment);

      await queryRunner.commitTransaction();

      // 5. Init SSLCommerz Session
      const backendUrl = this.configService.get<string>('BACKEND_URL');
      const user = await this.dataSource.manager.findOne(User, { where: { id: userId } });

      const sslData = {
        total_amount: totalAmount,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${backendUrl}/payment/success`,
        fail_url: `${backendUrl}/payment/fail`,
        cancel_url: `${backendUrl}/payment/cancel`,
        ipn_url: `${backendUrl}/payment/ipn`,
        cus_name: user?.name || 'Customer',
        cus_email: user?.email || 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: user?.phone || '01700000000',
        shipping_method: 'NO',
        product_name: 'Ecommerce Products',
        product_category: 'Mixed',
        product_profile: 'general',
      };

      const result = await this.sslCommerzService.initPayment(sslData);

      if (result?.status === 'SUCCESS') {
        return { url: result.GatewayPageURL };
      } else {
        throw new BadRequestException('Failed to initiate payment with SSLCommerz');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Payment Initialization Failed', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async processSuccess(data: any) {
    const { tran_id, val_id } = data;

    const payment = await this.paymentRepository.findOne({
      where: { transactionId: tran_id },
      relations: ['order', 'order.user', 'order.items', 'order.items.product'],
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status === PaymentStatus.PAID) return this.getRedirectUrl(PaymentStatus.PAID);

    // Validate with SSLCommerz
    const validationResult = await this.sslCommerzService.validatePayment(val_id);

    if (validationResult?.status === 'VALID' || validationResult?.status === 'AUTHENTICATED') {
      await this.updatePaymentSuccess(payment, validationResult);
      return this.getRedirectUrl(PaymentStatus.PAID);
    } else {
      await this.updatePaymentStatus(payment, PaymentStatus.FAILED, validationResult);
      return this.getRedirectUrl(PaymentStatus.FAILED);
    }
  }

  async processFail(data: any) {
    const { tran_id } = data;
    const payment = await this.paymentRepository.findOne({ where: { transactionId: tran_id } });
    if (payment) await this.updatePaymentStatus(payment, PaymentStatus.FAILED, data);
    return this.getRedirectUrl(PaymentStatus.FAILED);
  }

  async processCancel(data: any) {
    const { tran_id } = data;
    const payment = await this.paymentRepository.findOne({ where: { transactionId: tran_id } });
    if (payment) await this.updatePaymentStatus(payment, PaymentStatus.CANCELLED, data);
    return this.getRedirectUrl(PaymentStatus.CANCELLED);
  }

  async processIpn(data: any) {
    const { tran_id, val_id, status } = data;
    const payment = await this.paymentRepository.findOne({
      where: { transactionId: tran_id },
      relations: ['order', 'order.user', 'order.items', 'order.items.product'],
    });

    if (!payment || payment.status === PaymentStatus.PAID) return;

    if (status === 'VALID') {
      const validationResult = await this.sslCommerzService.validatePayment(val_id);
      if (validationResult?.status === 'VALID') {
        await this.updatePaymentSuccess(payment, validationResult);
      }
    } else {
      await this.updatePaymentStatus(payment, PaymentStatus.FAILED, data);
    }
  }

  private async updatePaymentSuccess(payment: Payment, validationResult: any) {
    payment.status = PaymentStatus.PAID;
    payment.validationId = validationResult.val_id;
    payment.gatewayResponse = validationResult;
    payment.paymentMethod = validationResult.card_type;
    payment.bankTransactionId = validationResult.bank_tran_id;
    payment.storeAmount = validationResult.store_amount;
    payment.cardType = validationResult.card_type;
    payment.cardIssuer = validationResult.card_issuer;
    payment.cardBrand = validationResult.card_brand;
    await this.paymentRepository.save(payment);

    // Update Order Status
    const order = payment.order;
    order.status = OrderStatus.PAID;
    await this.orderRepository.save(order);

  }

  private async updatePaymentStatus(payment: Payment, status: PaymentStatus, gatewayResponse: any) {
    payment.status = status;
    payment.gatewayResponse = gatewayResponse;
    await this.paymentRepository.save(payment);

    const order = await this.orderRepository.findOne({ where: { id: payment.order.id } });
    if (order) {
      order.status = status as unknown as OrderStatus;
      await this.orderRepository.save(order);
    }
  }

  private getRedirectUrl(status: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    return `${frontendUrl}/payment/result?status=${status}`;
  }

  async verifyTransaction(tran_id: string) {
    const payment = await this.paymentRepository.findOne({
      where: { transactionId: tran_id },
      relations: ['order']
    });
    if (!payment) throw new NotFoundException('Transaction not found');
    return payment;
  }
}
