export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface CartItem {
  id: string;
  name: string;
  tamilName?: string;
  category: 'mango' | 'honey' | 'jackfruit';
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  townCity: string;
  district?: string;
  pincode: string;
  notes?: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: CartItem[];
  totalAmount: number;
  mangoTotalKg: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  createdAt: string;
}
