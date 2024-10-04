import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('orders') // Tag for grouping in Swagger
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'orders',
  })
  @ApiOperation({ summary: 'Fetch All Orders' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'orders',
  })
  @ApiOperation({ summary: 'Fetch Login User Orders' })
  async findByUserId(@CurrentUser() user: User) {
    return this.orderService.findByUserId(user);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'create',
    resource: 'orders',
  })
  @ApiOperation({ summary: 'Place an Order' })
  async placeOrder(@CurrentUser() user: User) {
    return await this.orderService.placeOrder(user);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'update',
    resource: 'orders',
  })
  @ApiOperation({ summary: 'Update Status of Order' })
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }
}
