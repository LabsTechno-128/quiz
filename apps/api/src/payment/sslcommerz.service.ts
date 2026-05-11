import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SslCommerzService {
  private readonly logger = new Logger(SslCommerzService.name);
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isLive: boolean;
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.storeId = this.configService.get<string>('SSLCOMMERZ_STORE_ID') ?? "";
    this.storePassword = this.configService.get<string>('SSLCOMMERZ_STORE_PASSWORD') ?? "";
    this.isLive = this.configService.get<string>('SSLCOMMERZ_IS_LIVE') === 'true';
    this.apiUrl = this.isLive
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';
  }

  async initPayment(data: {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_city: string;
    cus_postcode: string;
    cus_country: string;
    cus_phone: string;
    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;
  }) {
    try {
      const payload = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        ...data,
      };

      const formData = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/gwprocess/v4/api.php`, formData.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('SSLCommerz Init Payment Error', error.response?.data || error.message);
      throw error;
    }
  }

  async validatePayment(val_id: string) {
    try {
      const url = `${this.apiUrl}/validator/api/validationserverphp.php?val_id=${val_id}&store_id=${this.storeId}&store_passwd=${this.storePassword}&format=json`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      this.logger.error('SSLCommerz Validate Payment Error', error.response?.data || error.message);
      throw error;
    }
  }
}
