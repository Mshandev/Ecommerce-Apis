import { RolesBuilder } from 'nest-access-control';

export enum UserRoles {
  Admin = 'admin',
  Customer = 'customer',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(UserRoles.Admin)
  .readAny('users')
  .createAny('users')
  .updateAny('users')
  .deleteAny('users');

roles
  .grant(UserRoles.Admin)
  .createAny('categories')
  .updateAny('categories')
  .deleteAny('categories');

roles
  .grant(UserRoles.Admin)
  .createAny('products')
  .updateAny('products')
  .deleteAny('products');

roles
  .grant(UserRoles.Customer)
  .readOwn('cart')
  .createOwn('cart')
  .deleteOwn('cart')
  .updateOwn('cart');

roles
  .grant(UserRoles.Customer)
  .readOwn('orders')
  .createOwn('orders')
  .grant(UserRoles.Admin)
  .readAny('orders')
  .updateAny('orders')
  .deleteAny('orders');

roles
  .grant(UserRoles.Customer)
  .createOwn('reviews')
  .readOwn('reviews')
  .grant(UserRoles.Admin)
  .readAny('reviews')
  .updateAny('reviews')
  .deleteAny('reviews');
