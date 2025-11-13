import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 200 })
    customerName: string;

    @Column({ length: 200 })
    customerEmail: string;

    @Column({ length: 20, nullable: true })
    customerPhone: string;

    @Column('simple-array')
    productIds: string[];

    @Column('json', { nullable: true })
    productDetails: any[];

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column('text', { nullable: true })
    shippingAddress: string;

    @Column({ length: 100, nullable: true })
    city: string;

    @Column({ length: 20, nullable: true })
    postalCode: string;

    @Column('text', { nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}