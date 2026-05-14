import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders() {
    return this.orderRepository.find({
      relations: ['items', 'items.product', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');
    order.status = status as any;
    await this.orderRepository.save(order);

    // Fetch and return full order with relations
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user'],
    });
  }
}
