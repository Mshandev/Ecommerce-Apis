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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDTO } from './dto/remove-from-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('carts') // Tag for grouping in Swagger
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'cart',
  })
  @ApiOperation({ summary: 'Fetch Login User Cart data' })
  async getUserCart(@CurrentUser() user: User) {
    return await this.cartService.getUserCart(user);
  }

  @Post('add')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'create',
    resource: 'cart',
  })
  @ApiOperation({ summary: 'Add Product to Cart' })
  async addToCart(
    @Body() createCartItemDto: CreateCartDto,
    @CurrentUser() user: User,
  ) {
    return this.cartService.addToCart(createCartItemDto, user);
  }

  @Delete('remove')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'delete',
    resource: 'cart',
  })
  @ApiOperation({ summary: 'Remove Product from Cart' })
  async removeFromCart(
    @Body() removeCartDto: RemoveFromCartDTO,
    @CurrentUser() user: User,
  ) {
    return this.cartService.removeFromCart(removeCartDto, user);
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'update',
    resource: 'cart',
  })
  @ApiOperation({ summary: 'Update Product quantity existing in Cart' })
  async updateItemQuantityFromCart(
    @Body() updateCartDto: UpdateCartDto,
    @CurrentUser() user: User,
  ) {
    return this.cartService.updateCart(updateCartDto, user);
  }
}
