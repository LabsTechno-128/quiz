import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    buyPrice: number;

    @Column()
    sellPrice: number;

    @Column({ nullable: true })
    offerPrice: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
