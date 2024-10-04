import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Updated name of User',
    example: 'Shan',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
