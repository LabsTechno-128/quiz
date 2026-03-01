import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Roles } from '../enums/user-roles.enum';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Answer } from 'src/question/entities/answer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true , nullable:true})
  email: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Roles,
    array: true,
    default: [Roles.USER],
  })
  roles: Roles[];

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'json', nullable: true })
  tokens: {
    accessToken?: string;
    refreshToken?: string;
  };

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ default: false })
  availToSetPassword: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    nullable: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  refreshTokens: RefreshToken[];

 @ManyToMany(() => Answer, (answer) => answer.users, { cascade: true })
  @JoinTable() // ✅ JoinTable শুধুমাত্র একপাশে
  answers: Answer[];
 
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
