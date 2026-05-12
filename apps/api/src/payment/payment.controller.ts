import { Controller, Post, Get, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import express from 'express';
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
  async success(@Body() body: any, @Res() res: express.Response) {
    console.log('Payment Success Callback Received:', body);
    const redirectUrl = await this.paymentService.processSuccess(body);
    console.log('Redirecting to:', redirectUrl);
    return res.redirect(redirectUrl);
  }

  @Post('fail')
  async fail(@Body() body: any, @Res() res: express.Response) {
    console.log('Payment Fail Callback Received:', body);
    const redirectUrl = await this.paymentService.processFail(body);
    console.log('Redirecting to:', redirectUrl);
    return res.redirect(redirectUrl);
  }

  @Post('cancel')
  async cancel(@Body() body: any, @Res() res: express.Response) {
    console.log('Payment Cancel Callback Received:', body);
    const redirectUrl = await this.paymentService.processCancel(body);
    console.log('Redirecting to:', redirectUrl);
    return res.redirect(redirectUrl);
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
