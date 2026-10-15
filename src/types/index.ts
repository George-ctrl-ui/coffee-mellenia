export type ProductCategory = 'All' | 'Espresso' | 'Iced Coffee' | 'Latte' | 'Non-Coffee' | 'Pastries';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Completed'
  | 'Cancelled';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in PHP
  category: string;
  imageUrl: string;
  available: boolean;
  featured: boolean;
  ingredients?: string[];
  tastingNotes?: string[];
  roastLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  status: OrderStatus;
  total: number; // calculated server-side in PHP
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactMessageDto {
  id: string;
  createdAt: string;
}
