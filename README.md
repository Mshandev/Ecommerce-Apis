# Ecommerce Apis - NestJS

This repository hosts the source code for a feature-rich eCommerce application built with NestJS. It includes user authentication, product management, order processing, and role-based access control. The application uses JWT for authentication, Bcrypt for password hashing, Multer for file uploads, and Swagger for API documentation.

## Demo

- Live Preview: [https://blog-apis-nestjs.onrender.com/](https://blog-apis-nestjs.onrender.com/)

## Features

- User and Admin roles
- JWT Authentication
- Password Hashing with Bcrypt
- CRUD Operations for Products, Categories, and Orders
- Login/Signup/Logout/Status
- Swagger API Documentation
- Role-Based Access Control
- Admin: Can create, edit, delete products and categories, and manage orders.
- User: Can browse products, add to cart, and place orders.
- Authenticated APIs for secured access
- REST APIs for interaction with the application
- Database: MySQL with TypeORM

## API Documentation
You can access the full API documentation via Swagger at the root URL of the deployed application:

## Relationships
- User to Cart: One-to-One relationship (A user can have one cart).
- User to Order: One-to-Many relationship (One user can place multiple orders).
- User to Review: One-to-Many relationship (One user can write multiple reviews).
- Cart to CartItem: One-to-Many relationship (One cart can contain multiple cart items).
- Category to Product: One-to-Many relationship (One category can contain multiple products).
- Product to CartItem: One-to-Many relationship (One product can be added to multiple cart items).
- Product to OrderItem: One-to-Many relationship (One product can be included in multiple order items).
- Product to Review: One-to-Many relationship (One product can have multiple reviews).
- Order to OrderItem: One-to-Many relationship (One order can include multiple order items).

## Summary of Entities and Their Relationships
- User
  - One cart
  - Many orders
  - Many reviews

- Cart
  - One user
  - Many cart items

- Category
  - Many products

- Product
  - Many cart items
  - Many order items
  - Many reviews
  - One category

- CartItem
  - One cart
  - One product

- Order
  - One user
  - Many order items

- OrderItem
  - One order
  - One product

- Review
  - One user
  - One product

## Screenshots

![Post](https://i.ibb.co/LnLC9v2/blog-apis-1.png)
- Post Apis

![Categories](https://i.ibb.co/yY9hB5R/blog-apis-2.png)
- Categories And Authentication Apis

## Run Locally

Clone the project

```bash
    git clone https://github.com/Mshandev/Ecommerce-Apis-Nestjs.git
```
Go to the project directory

```bash
    cd Ecommerce-Apis-Nestjs
```
Install dependencies

```bash
    npm install
```

Setup Environment Vaiables

```Make .env file and store environment Variables
  DB_TYPE=mysql
  DB_HOST=YOUR_DB_HOST
  DB_PORT=YOUR_DB_PORT
  DB_USERNAME=YOUR_DB_USER
  DB_PASSWORD=YOUR_DB_PASSWORD
  DB_DATABASE=DB_NAME
  JWT_SECRET=secretkey

 ```

Start the server

```bash
    npm run start:dev
```

## Tech Stack
* [Nestjs](https://nestjs.com/)
* [TypeORM](https://typeorm.io/)
* [MySQL](https://www.mysql.com/)
* [JWT Authentication](https://jwt.io/introduction)
* [Bcrypt](https://www.npmjs.com/package/bcrypt)
* [Swagger for API Documentation](https://swagger.io/)

## Deployment

The application is deployed on Render.

## Contributing

Contributions are always welcome!
Just raise an issue, and we will discuss it.

## Feedback

If you have any feedback, please reach out to me [here](https://www.linkedin.com/in/muhammad-shan-full-stack-developer/)
