import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('reviews') // Tag for grouping in Swagger
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'read',
    resource: 'reviews',
  })
  @ApiOperation({ summary: 'Fetch All Reviews' })
  async findAll() {
    return await this.reviewService.findAll();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'read',
    resource: 'reviews',
  })
  @ApiOperation({ summary: 'Fetch Reviews of Login User' })
  async getReviewsByUserId(@CurrentUser() user: User) {
    return this.reviewService.findReviewsByUserId(user);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Fetch Reviews of Particular Product' })
  async findByProductId(@Param('productId') productId: number) {
    return this.reviewService.findReviewsByProductId(productId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'own',
    action: 'create',
    resource: 'reviews',
  })
  @ApiOperation({ summary: 'Give a review about particular product' })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.createReview(createReviewDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'delete',
    resource: 'reviews',
  })
  @ApiOperation({ summary: 'Delete the existing Review' })
  async deleteReview(@Param('id') id: number) {
    return this.reviewService.deleteReview(id);
  }
}
