import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly productService: ProductService,
  ) {}

  async findOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.orderItemsRepository.find({
      where: { order: { id: orderId } },
      relations: ['product'], // Assuming you want to fetch the product details as well
    });
  }

  async createOrderItems(
    createOrderItemDtos: CreateOrderItemDto[],
  ): Promise<void> {
    const orderItems = [];

    for (const createOrderItemDto of createOrderItemDtos) {
      // Fetch the product details (including price)
      const product = await this.productService.findOne(
        createOrderItemDto.productId,
      );
      if (!product) {
        throw new Error(
          `Product with ID ${createOrderItemDto.productId} not found.`,
        );
      }
      // Ensure there's enough stock
      if (product.stock < createOrderItemDto.quantity) {
        throw new BadRequestException(
          `Not enough stock for product with ID ${createOrderItemDto.productId}.`,
        );
      }

      // Create a new OrderItem entity
      const orderItem = this.orderItemsRepository.create({
        order: { id: createOrderItemDto.orderId }, // Associate with order
        product: { id: createOrderItemDto.productId }, // Associate with product
        quantity: createOrderItemDto.quantity,
        price: product.price, // Set the product price
      });

      orderItems.push(orderItem);

      // Reduce product stock using ProductService (for order placement)
      await this.productService.reduceStock(
        createOrderItemDto.productId,
        createOrderItemDto.quantity,
      );
    }

    // Save all order items in the database
    await this.orderItemsRepository.save(orderItems);
  }
}
