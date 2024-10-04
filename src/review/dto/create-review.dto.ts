import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Give Rating between 1 to 5',
    example: 4,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'The comment of Review',
    example: 'The quality of the product was amazing. Thank you so much for this amazing product.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    description: 'The Product Id to Review',
    example: 2,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
