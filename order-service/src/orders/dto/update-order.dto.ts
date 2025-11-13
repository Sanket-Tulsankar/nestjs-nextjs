import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../entities/order.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @ApiPropertyOptional({
        enum: OrderStatus,
        description: 'Order status'
    })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;
}