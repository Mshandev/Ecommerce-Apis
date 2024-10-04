import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDTO {
  @ApiProperty({
    description: 'The email of User',
    example: 'example@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of User',
    example: 'Qwerty123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
