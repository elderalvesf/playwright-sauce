export interface User {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export const USERS: Record<string, User> = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked:   { username: 'locked_out_user', password: 'secret_sauce' },
  problem:  { username: 'problem_user', password: 'secret_sauce' },
};

export const CHECKOUT_INFO: CheckoutInfo = {
  firstName: 'Elder',
  lastName:  'Freitas',
  zipCode:   '69000-000',
};

export const PRODUCTS = {
  backpack:  'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
} as const;
