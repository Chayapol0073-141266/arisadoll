export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  theme: string;
  size: string;
  stock: number;
  image_url: string;
  is_featured: number;
  created_at: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
  custom_text?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
}

export type Category = 'ตุ๊กตาผ้า' | 'ตุ๊กตาแฟนซี' | 'ตุ๊กตาอนิเมะ' | 'ตุ๊กตาสั่งทำพิเศษ' | 'เซตของขวัญ';
