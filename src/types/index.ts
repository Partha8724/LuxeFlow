export interface ProductVariant {
  sku: string;
  size?: string;
  color?: string;
  priceModifier?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'GBP';
  images: string[];
  category: string;
  status: 'active' | 'out_of_stock';
  supplier: 'CJ' | 'Spocket' | 'Direct';
  externalId?: string;
  variants?: ProductVariant[];
}

export interface UserProfile {
  uid: string;
  role: 'ADMIN' | 'SELLER' | 'BUYER';
  email: string;
  region: 'UK' | 'USA' | 'GLOBAL';
}
