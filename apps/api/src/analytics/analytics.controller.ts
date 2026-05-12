import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as RoleEnum } from '../user/enums/user-roles.enum';

@Controller('analytics')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard-stats')
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('sales-report')
  async getSalesReport() {
    return this.analyticsService.getSalesChartData();
  }

  @Get('category-distribution')
  async getCategoryDistribution() {
    return this.analyticsService.getCategoryDistribution();
  }

  @Get('recent-orders')
  async getRecentOrders() {
    return this.analyticsService.getRecentOrders();
  }
}
