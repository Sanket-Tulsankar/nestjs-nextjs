import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    private readonly productServiceUrl: string;

    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private httpService: HttpService,
        private configService: ConfigService,
    ) {
        this.productServiceUrl = this.configService.get<string>(
            'PRODUCT_SERVICE_URL',
            'http://localhost:3001/api',
        );
    }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        try {
            const idsQuery = createOrderDto.productIds.map(id => `ids=${id}`).join('&');
            const productsResponse = await firstValueFrom(
                this.httpService.get(`${this.productServiceUrl}/products/by-ids/bulk?${idsQuery}`)
            );

            const products = productsResponse.data;

            if (!products || products.length === 0) {
                throw new NotFoundException('No products found with provided IDs');
            }

            const totalAmount = products.reduce(
                (sum: number, product: any) => sum + parseFloat(product.price),
                0
            );

            const order = this.ordersRepository.create({
                ...createOrderDto,
                productDetails: products,
                totalAmount,
                status: OrderStatus.PENDING,
            });

            const savedOrder = await this.ordersRepository.save(order);

            await this.updateProductsStock(createOrderDto.productIds, -1);

            return savedOrder;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                'Failed to create order. Please check product IDs and try again.'
            );
        }
    }

    async findAll(status?: OrderStatus): Promise<Order[]> {
        const query = this.ordersRepository.createQueryBuilder('order');

        if (status) {
            query.andWhere('order.status = :status', { status });
        }

        query.orderBy('order.createdAt', 'DESC');

        return await query.getMany();
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }

    async findOneWithProducts(id: string): Promise<any> {
        const order = await this.findOne(id);

        try {
            const idsQuery = order.productIds.map(id => `ids=${id}`).join('&');
            const productsResponse = await firstValueFrom(
                this.httpService.get(`${this.productServiceUrl}/products/by-ids/bulk?${idsQuery}`)
            );

            return {
                ...order,
                products: productsResponse.data,
            };
        } catch (error) {
            return {
                ...order,
                products: order.productDetails || [],
            };
        }
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id);
        Object.assign(order, updateOrderDto);
        return await this.ordersRepository.save(order);
    }

    async updateStatus(id: string, status: OrderStatus): Promise<Order> {
        const order = await this.findOne(id);
        order.status = status;
        return await this.ordersRepository.save(order);
    }

    async remove(id: string): Promise<void> {
        const order = await this.findOne(id);
        await this.ordersRepository.remove(order);
    }

    private async updateProductsStock(productIds: string[], quantity: number): Promise<void> {
        try {
            const promises = productIds.map(productId =>
                firstValueFrom(
                    this.httpService.patch(
                        `${this.productServiceUrl}/products/${productId}/stock`,
                        { quantity }
                    )
                )
            );
            await Promise.all(promises);
        } catch (error) {
            console.error('Failed to update product stock:', error.message);
        }
    }
}