import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { OrderService } from 'src/order/order.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly orderService: OrderService,
  ) {}

  async createReview(createReviewDto: CreateReviewDto, user: User) {
    const { productId, rating, comment } = createReviewDto;

    // Check if the product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    // Verify if the user has purchased the product and if the order is completed
    const hasPurchased = await this.orderService.hasPurchasedProduct(
      user.id,
      productId,
    );
    if (!hasPurchased) {
      throw new ForbiddenException(
        'You can only review products that you have purchased.',
      );
    }

    const review = this.reviewRepository.create({
      rating,
      comment,
      user: { id: user.id }, // Set user relationship
      product, // Set product relationship
    });

    return await this.reviewRepository.save(review);
  }

  async findReviewsByProductId(productId: number) {
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user'], // Optionally fetch user details
    });
    if (reviews.length === 0) {
      throw new NotFoundException('No Review Found');
    }

    return reviews;
  }

  async findReviewsByUserId(user: User) {
    const reviews = await this.reviewRepository.find({
      where: { user: { id: user.id } },
      relations: ['product'], // Optionally fetch product details
    });

    // Check if the reviews array is empty
    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found for this user.');
    }

    return reviews;
  }

  async deleteReview(reviewId: number) {
    const result = await this.reviewRepository.delete(reviewId);

    if (result.affected === 0) {
      throw new NotFoundException('Review not found');
    }

    return { message: 'Review deleted successfully' };
  }
  async findAll() {
    try {
      const reviews = await this.reviewRepository.find({
        relations: ['user', 'product'],
      });

      if (!reviews || reviews.length === 0) {
        throw new NotFoundException('No reviews found');
      }

      return reviews;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to fetch reviews');
      }
    }
  }
}
