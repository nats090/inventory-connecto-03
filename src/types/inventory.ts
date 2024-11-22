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

export interface Sale {
  id: string;
  user_id: string;
  item_name: string;
  quantity_reduced: number;
  earned: number;
  category: string;
  timestamp: string;
}

export interface Activity {
  id: string;
  user_id: string;
  action: string;
  details: string;
  timestamp: string;
}