export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  certificates: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Receipt {
  orderId: string;
  date: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
  };
}