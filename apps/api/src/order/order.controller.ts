import { Controller, Get, UseGuards, Req, Patch, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles as RolesDecorator } from '../auth/decorators/roles.decorator';
import { Roles } from '../user/enums/user-roles.enum';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req) {
    return this.orderService.getUserOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @Get('all')
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
