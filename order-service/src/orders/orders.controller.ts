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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'Products not found' })
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders' })
    @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
    @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
    findAll(@Query('status') status?: OrderStatus) {
        return this.ordersService.findAll(status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    @ApiResponse({ status: 200, description: 'Order found' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.ordersService.findOne(id);
    }

    @Get(':id/with-products')
    @ApiOperation({ summary: 'Get order with product details' })
    @ApiResponse({ status: 200, description: 'Order with products found' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findOneWithProducts(@Param('id', ParseUUIDPipe) id: string) {
        return this.ordersService.findOneWithProducts(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update order' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateOrderDto: UpdateOrderDto,
    ) {
        return this.ordersService.update(id, updateOrderDto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update order status' })
    @ApiResponse({ status: 200, description: 'Order status updated' })
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('status') status: OrderStatus,
    ) {
        return this.ordersService.updateStatus(id, status);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete order' })
    @ApiResponse({ status: 204, description: 'Order deleted successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.ordersService.remove(id);
    }
}