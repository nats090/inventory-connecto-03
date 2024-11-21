export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
}