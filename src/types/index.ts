export type UserRole = 'user' | 'manager' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  preferences?: 'veg' | 'non-veg';
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'main' | 'side' | 'dessert' | 'drink';
}

export interface DailyMenu {
  id: string; // YYYY-MM-DD_mealtype
  date: string; // YYYY-MM-DD
  mealType: string;
  items: MenuItem[];
}

export interface Attendance {
  userId: string;
  mealId: string;
  status: 'eating' | 'skipping';
  timestamp: any;
}

export interface Rating {
  userId: string;
  itemId: string;
  mealId: string;
  liked: boolean; // 👍 or 👎
  worthEating: boolean; // Yes/No
  timestamp: any;
}