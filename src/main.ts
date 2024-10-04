import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('E-Commerce Application APIs')
    .setDescription(
      `These APIs are part of an e-commerce application. The application includes the following entities:
  
  - [User]: A user can have one role (default is 'customer'). Users can own a [Cart], place [Order]s, and write [Review]s.
  - [Product]: Products belong to [Category] and can be added to [CartItem]s and [OrderItem]s.
  - [Cart]: A [User] can have a [Cart], and the cart contains multiple [CartItem]s.
  - [Order]: Users can place orders that include multiple [OrderItem]s.
  - [Category]: Categories contain multiple products, creating a One-to-Many relationship with [Product].
  - [Review]: Users can write reviews for products. Each [Product] can have multiple reviews, creating a One-to-Many relationship between [Product] and [Review].

  The application uses JWT for authentication and bcrypt for password hashing.
  There are two main roles: [User, Admin]. Admins have full access to manage users, products, categories, and orders, while regular users can view products, place orders, manage their cart, and leave reviews. 
  `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('E-Commerce')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
