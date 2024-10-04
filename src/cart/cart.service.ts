import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItemsService } from 'src/cart-items/cart-items.service';
import { RemoveFromCartDTO } from './dto/remove-from-cart.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly cartItemsService: CartItemsService,
  ) {}

  private async getUserCartEntity(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product'],
    });
    return cart;
  }

  async addToCart(addToCartDto: CreateCartDto, user: User) {
    let cart = await this.getUserCartEntity(user.id);

    if (!cart) {
      cart = this.cartRepository.create({
        user: { id: user.id },
        cartItems: [],
      });
      await this.cartRepository.save(cart);
    }

    // Add the cart item using CartItemsService
    await this.cartItemsService.addCartItem({
      productId: addToCartDto.productId,
      cartId: cart.id,
    });

    // Return the updated cart with cart items and their products
    return await this.getUserCartEntity(user.id);
  }

  async removeFromCart(removeCartDto: RemoveFromCartDTO,user:User) {
    const {productId } = removeCartDto;

    // Find the user's cart
    const cart = await this.getUserCartEntity(user.id);
    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }
    // Forward the cartId and productId to CartItemsService
    return this.cartItemsService.removeCartItem({
      cartId: cart.id,
      productId,
    });
  }

  async updateCart(updateCartDto: UpdateCartDto,user:User) {
    const { productId, quantity } = updateCartDto;

    // Find the cart associated with the user
    const cart = await this.getUserCartEntity(user.id);
    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }

    // Call CartItemsService to update the quantity of the product
    await this.cartItemsService.updateCartItemQuantity({
      cartId: cart.id,
      productId,
      quantity,
    });

    // Return the updated cart with cart items and their products
    return await this.getUserCartEntity(user.id);
  }

  async getUserCart(user:User) {
    // Reuse the helper method to find the cart associated with the user
    const cart = await this.getUserCartEntity(user.id);
    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }
    return cart;
  }

  async cleanCart(userId: number): Promise<void> {
    // Step 1: Find the user's cart
    const cart = await this.getUserCartEntity(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }

    // Step 2: Forward the cartId to clean the cart items
    await this.cartItemsService.cleanCartItems(cart.id);

    // Step 3: Delete the cart
    await this.cartRepository.delete(cart.id);
  }
}
