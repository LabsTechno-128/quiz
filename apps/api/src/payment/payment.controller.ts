import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InitPaymentDto } from './dto/init-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(JwtAuthGuard)
  @Post('init')
  async initPayment(@Req() req, @Body() body: InitPaymentDto) {
    return this.paymentService.initPayment(req.user.id, body.items);
  }

  @Post('success')
  async success(@Body() body: any) {
    return await this.paymentService.processSuccess(body);

  }

  @Post('fail')
  async fail(@Body() body: any) {
    return await this.paymentService.processFail(body);
  }

  @Post('cancel')
  async cancel(@Body() body: any) {
    return await this.paymentService.processCancel(body);
  }

  @Post('ipn')
  async ipn(@Body() body: any) {
    return this.paymentService.processIpn(body);
  }

  @Get('verify/:transactionId')
  async verify(@Param('transactionId') transactionId: string) {
    return this.paymentService.verifyTransaction(transactionId);
  }
}
