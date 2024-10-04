import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderItemService } from 'src/order-item/order-item.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly cartService: CartService, // Assuming you already have this service
    private readonly orderItemsService: OrderItemService, // Assuming you already have this service
  ) {}

  async findAll() {
    return await this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
  }

  async findByUserId(user: User) {
    const orders = await this.orderRepository.find({
      where: { user: { id: user.id } }, // Filter orders by userId
      relations: [
        'orderItems', // Fetch order items
        'orderItems.product', // Fetch product details within order items
      ],
    });

    if (orders.length === 0) {
      throw new NotFoundException(
        `No orders found for user with id ${user.id}.`,
      );
    }

    return orders;
  }

  async placeOrder(user: User) {
    // Step 1: Fetch the user's cart
    const cart = await this.cartService.getUserCart(user);
    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('No items in the cart to place an order.');
    }

    // Step 2: Calculate the total amount
    let totalAmount = 0;
    for (const cartItem of cart.cartItems) {
      totalAmount += cartItem.quantity * cartItem.product.price;
    }

    // Step 3: Create the order
    const order = this.orderRepository.create({
      user: { id: user.id }, // Associate the order with the user
      totalAmount,
      status: 'pending', // Set an initial status for the order
    });

    const savedOrder = await this.orderRepository.save(order);

    // Step 4: Forward cart items and order details to OrderItemsService
    const orderItemsDtos = cart.cartItems.map((cartItem) => ({
      orderId: savedOrder.id,
      productId: cartItem.product.id,
      quantity: cartItem.quantity,
    }));

    await this.orderItemsService.createOrderItems(orderItemsDtos);
    await this.cartService.cleanCart(user.id);
    const orderItems = await this.orderItemsService.findOrderItemsByOrderId(
      savedOrder.id,
    );

    return { ...savedOrder, orderItems };
  }

  async updateOrderStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderDto,
  ): Promise<Order> {
    const { status } = updateOrderStatusDto;

    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    order.status = status; // Update the status
    return await this.orderRepository.save(order); // Save the updated order
  }

  async hasPurchasedProduct(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.orderItems', 'orderItem')
      .where('order.userId = :userId', { userId })
      .andWhere('orderItem.productId = :productId', { productId })
      .getOne();

    return !!order; // Returns true if the order exists, false otherwise
  }
}
