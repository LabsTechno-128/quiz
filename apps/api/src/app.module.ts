import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import dataSource from 'src/config/typeORM.config';
import { AttachmentsModule } from './attachments/attachments.module';
import { ArticlesModule } from './articles/articles.module';
import { QuizModule } from './quiz/quiz.module';
import { BannersModule } from './banners/banners.module';
import { QuestionModule } from './question/question.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => dataSource(configService),
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    AttachmentsModule,
    ArticlesModule,
    QuizModule,
    BannersModule,
    QuestionModule,
    LeaderboardModule,
    ProductModule,
    PaymentModule,
    OrderModule

  ],
})
export class AppModule { }
