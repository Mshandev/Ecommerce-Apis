import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from './dto/user-login.dto';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/user-register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: UserLoginDTO) {
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Bad Credentials');
    } else {
      // verify that the passowrd hash matched with the database hash
      if (await this.verifyPassword(loginDto.password, user.password)) {
        const token = await this.jwtService.signAsync({
          email: user.email,
          id: user.id,
        });
        delete user.password;
        return { token, user };
      } else {
        throw new UnauthorizedException('Bad Credentials');
      }
    }
  }

  async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async register(createUserDto: RegisterUserDto) {
    const { email, password } = createUserDto;
    const checkForUser = await this.repo.findOneBy({ email });
    if (checkForUser) {
      throw new BadRequestException(
        'Email is already taken, please choose another one',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.repo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.repo.save(user);

    return user;
  }
}
