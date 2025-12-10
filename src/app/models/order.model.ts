export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  purchaseDate: Date;
  keys: string[]; // IDs de las keys generadas
}

export interface PurchaseOrderItem {
  gameId: number;
  gameTitle: string;
  price: number;
  quantity: number;
}

export interface OrderSummary {
  subtotal: number;
  taxes: number;
  total: number;
  itemCount: number;
}