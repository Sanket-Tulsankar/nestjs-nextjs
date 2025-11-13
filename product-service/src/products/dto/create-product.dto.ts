import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsArray, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Laptop', description: 'Product name' })
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    name: string;

    @ApiPropertyOptional({ example: 'High-performance laptop', description: 'Product description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 999.99, description: 'Product price' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 'Electronics', description: 'Product category' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    category: string;

    @ApiProperty({ example: 50, description: 'Stock quantity' })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiPropertyOptional({ example: 'LAP-001', description: 'Stock keeping unit' })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiPropertyOptional({ example: true, description: 'Product availability' })
    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean;

    @ApiPropertyOptional({ example: ['electronics', 'laptop'], description: 'Product tags' })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}