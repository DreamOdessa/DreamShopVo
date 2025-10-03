export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  discount?: number; // процент скидки
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // для отображения зачеркнутой цены
  image: string;
  category: 'chips' | 'decorations' | 'syrups' | 'purees' | 'dried_flowers';
  organic: boolean;
  inStock: boolean;
  weight?: string;
  ingredients?: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

