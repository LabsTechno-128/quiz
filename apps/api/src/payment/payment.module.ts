import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SslCommerzService } from './sslcommerz.service';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, OrderItem, Product]),
    HttpModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, SslCommerzService],
  exports: [PaymentService],
})
export class PaymentModule { }
