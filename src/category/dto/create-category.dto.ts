import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of category',
    example: 'Electronics',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of category',
    example: 'Devices, gadgets, and accessories.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
