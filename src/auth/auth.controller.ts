import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { Request, Response } from 'express';
import { RegisterUserDto } from './dto/user-register.dto';
import { User } from 'src/user/entities/user.entity';
import { CurrentUserGuard } from './guards/current-user.guard';
import { CurrentUser } from './decorators/user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth') // Tag for grouping in Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  async userLogin(@Body() userLoginDto: UserLoginDTO, @Res() res: Response) {
    const { token, user } = await this.authService.login(userLoginDto);

    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 }); //max age 2 hours
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.send({ success: true, user });
  }

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  async userRegistration(@Body() createUserDto: RegisterUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('status')
  @UseGuards(CurrentUserGuard)
  @ApiOperation({ summary: 'Current User Status' })
  authStatus(@CurrentUser() user: User) {
    return { status: !!user, user };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout User' })
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication');
    res.clearCookie('IsAuthenticated');
    return res.status(200).send({ success: true });
  }
}
