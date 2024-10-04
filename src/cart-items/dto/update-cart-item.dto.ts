import { CreateCartItemDto } from './create-cart-item.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartItemDto extends CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
