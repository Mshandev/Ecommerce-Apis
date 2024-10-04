import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CartModule } from 'src/cart/cart.module';
import { OrderItemModule } from 'src/order-item/order-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]),CartModule,OrderItemModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService]
})
export class OrderModule {}
