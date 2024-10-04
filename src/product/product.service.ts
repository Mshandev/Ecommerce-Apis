import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Repository } from 'typeorm';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = this.productsRepository.create({
      ...createProductDto,
      category,
    });

    return this.productsRepository.save(newProduct);
  }

  async findAll(
    sort?: string,
    categoryId?: number,
    productName?: string,
  ): Promise<Product[]> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    // Join category for filtering
    queryBuilder
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.reviews', 'reviews');

    // Filter by category if categoryId is provided
    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    // Filter by product name if productName is provided
    if (productName) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${productName}%`,
      });
    }

    // Sort if sort parameter is provided
    if (sort) {
      const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
      const sortField = sort.replace('-', ''); // Remove the '-' for field name
      queryBuilder.orderBy(`product.${sortField}`, sortOrder);
    }
    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'reviews'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async reduceStock(productId: number, quantity: number) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Not enough stock for product: ${product.name}`,
      );
    }

    product.stock -= quantity;

    return await this.productsRepository.save(product);
  }

  async updateStock(
    productId: number,
    updateProductStockDto: UpdateProductStockDto,
  ) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.stock = updateProductStockDto.stock;

    return await this.productsRepository.save(product);
  }
}
