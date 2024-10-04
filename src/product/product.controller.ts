import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { ACGuard, UseRoles } from 'nest-access-control';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('products') // Tag for grouping in Swagger
@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'create',
    resource: 'products',
  })
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productsService.create(createProductDto);
  }

  
  @Get()
  @ApiOperation({ summary: 'Fetch all Products and Filter Products' })
  @ApiQuery({
    name: 'sort',
    required: false,
    description:
      'Sort order (e.g., "-name" for descending or "name" for ascending).',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Enter Category Id like 1',
  })
  @ApiQuery({
    name: 'productName',
    required: false,
    description: 'Enter Product name like t-shirt',
  })
  async getProducts(
    @Query('sort') sort?: string,
    @Query('categoryId') categoryId?: number,
    @Query('productName') productName?: string,
  ) {
    return this.productsService.findAll(sort, categoryId, productName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch 1 Product with productId' })
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'update',
    resource: 'products',
  })
  @ApiOperation({ summary: 'Update the existing product' })
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'update',
    resource: 'products',
  })
  @ApiOperation({ summary: 'Update the existing product stock' })
  updateStock(
    @Param('id') id: number,
    @Body() updateProductStockDto: UpdateProductStockDto,
  ) {
    return this.productsService.updateStock(id, updateProductStockDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'delete',
    resource: 'products',
  })
  @ApiOperation({ summary: 'Delete the existing product' })
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
