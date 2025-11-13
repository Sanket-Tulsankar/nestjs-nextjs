import { IsString, IsEmail, IsArray, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({ example: 'John Doe', description: 'Customer full name' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    customerName: string;

    @ApiProperty({ example: 'john@example.com', description: 'Customer email' })
    @IsEmail()
    customerEmail: string;

    @ApiPropertyOptional({ example: '+1234567890', description: 'Customer phone' })
    @IsString()
    @IsOptional()
    customerPhone?: string;

    @ApiProperty({
        example: ['uuid-1', 'uuid-2'],
        description: 'Array of product IDs'
    })
    @IsArray()
    @IsString({ each: true })
    productIds: string[];

    @ApiPropertyOptional({
        example: '123 Main St, Apt 4B',
        description: 'Shipping address'
    })
    @IsString()
    @IsOptional()
    shippingAddress?: string;

    @ApiPropertyOptional({ example: 'New York', description: 'City' })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiPropertyOptional({ example: '10001', description: 'Postal code' })
    @IsString()
    @IsOptional()
    postalCode?: string;

    @ApiPropertyOptional({ example: 'Leave at door', description: 'Order notes' })
    @IsString()
    @IsOptional()
    notes?: string;
}