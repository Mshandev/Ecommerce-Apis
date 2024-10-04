import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'The Id of product',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
