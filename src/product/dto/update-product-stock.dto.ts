import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductStockDto {
  @ApiProperty({
    description: 'The stock of product available',
    example: 500,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
