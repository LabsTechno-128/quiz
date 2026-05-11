import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  transactionId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'BDT' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'jsonb', nullable: true })
  gatewayResponse: any;

  @Column({ nullable: true })
  validationId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  storeAmount: number;

  @Column({ nullable: true })
  bankTransactionId: string;

  @Column({ nullable: true })
  cardType: string;

  @Column({ nullable: true })
  cardIssuer: string;

  @Column({ nullable: true })
  cardBrand: string;

  @OneToOne(() => Order, (order) => order.payment)
  order: Order;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
