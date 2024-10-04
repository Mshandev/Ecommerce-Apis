import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateCartDto } from './create-cart.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto extends CreateCartDto {
  @ApiProperty({
    description: 'The quantity of product to update',
    example: 5,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
