export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  avatar?: string;
  discount?: number; // процент скидки
  isAdmin?: boolean;
  // Новые поля для профиля
  phone?: string;
  city?: string;
  novaPoshtaOffice?: string;
  address?: string;
  establishmentName?: string;
  isPrivatePerson?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // для отображения зачеркнутой цены
  image: string; // основное изображение (для совместимости)
  images?: string[]; // массив изображений (до 5): [главное, hover, галерея1, галерея2, галерея3]
  category: 'chips' | 'decorations' | 'syrups' | 'purees' | 'dried_flowers';
  organic: boolean;
  inStock: boolean;
  isActive?: boolean; // включен/выключен товар (опционально для совместимости)
  isPopular?: boolean; // отображать в популярных на главной (опционально для совместимости)
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
  // Контактная информация
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  // Информация о доставке
  deliveryInfo: {
    city: string;
    deliveryMethod: 'post_office' | 'address' | 'schedule' | 'taxi';
    deliveryDetails: string; // адрес или отделение
  };
  // Информация о получателе
  recipientInfo: {
    establishmentName?: string | null;
    isPrivatePerson: boolean;
  };
  // Информация об оплате
  paymentInfo: {
    paymentMethod: 'cash_on_delivery' | 'card_online' | 'card_on_delivery' | 'bank_transfer';
    contactForClarification: boolean;
  };
  // Старая структура для совместимости
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
  albumImages?: string[]; // images used for CategoryShowcase album
  albumVideos?: string[]; // short silent videos for CategoryShowcase album (mp4/webm)
  showInShowcase?: boolean; // whether this category should appear in the homepage showcase
  isActive: boolean;
  sortOrder: number;
}

