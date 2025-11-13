import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
    findAll(
        @Query('category') category?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll(category, search);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product found' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.findOne(id);
    }

    @Get('by-ids/bulk')
    @ApiOperation({ summary: 'Get multiple products by IDs' })
    @ApiQuery({ name: 'ids', type: [String] })
    @ApiResponse({ status: 200, description: 'Products found' })
    findMany(@Query('ids') ids: string | string[]) {
        const idArray = Array.isArray(ids) ? ids : [ids];
        return this.productsService.findMany(idArray);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete product' })
    @ApiResponse({ status: 204, description: 'Product deleted successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.remove(id);
    }

    @Patch(':id/stock')
    @ApiOperation({ summary: 'Update product stock' })
    @ApiResponse({ status: 200, description: 'Stock updated successfully' })
    updateStock(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('quantity') quantity: number,
    ) {
        return this.productsService.updateStock(id, quantity);
    }
}