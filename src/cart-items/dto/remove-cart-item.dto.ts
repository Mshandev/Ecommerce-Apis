import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  cartId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
