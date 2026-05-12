import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Order, OrderStatus } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  async getDashboardStats() {
    const totalUsers = await this.userRepo.count();
    const totalProducts = await this.productRepo.count();
    const totalCategories = await this.categoryRepo.count();

    const paidOrders = await this.orderRepo.find({
      where: { status: OrderStatus.PAID },
    });

    const totalSales = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = await this.orderRepo.count();

    return {
      totalUsers,
      totalProducts,
      totalCategories,
      totalSales,
      totalOrders,
    };
  }

  async getSalesChartData() {
    const year = new Date().getFullYear();
    const salesData: any = [];

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    for (let i = 0; i < 12; i++) {
      const startDate = new Date(year, i, 1);
      const endDate = new Date(year, i + 1, 0, 23, 59, 59);

      const monthlyOrders = await this.orderRepo.find({
        where: {
          status: OrderStatus.PAID,
          createdAt: Between(startDate, endDate),
        },
      });

      const amount = monthlyOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

      salesData.push({
        name: months[i],
        sales: amount,
        orders: monthlyOrders.length,
      });
    }

    return salesData;
  }

  async getCategoryDistribution() {
    const categories = await this.categoryRepo.find({
      relations: ['products'],
    });

    return categories.map(cat => ({
      name: cat.name,
      value: cat.products?.length || 0,
    })).filter(item => item.value > 0);
  }

  async getRecentOrders() {
    return this.orderRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 5,
    });
  }
}
