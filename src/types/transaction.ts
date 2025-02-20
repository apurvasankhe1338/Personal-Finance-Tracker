
export type Category =
  | "Food"
  | "Transport"
  | "Housing"
  | "Entertainment"
  | "Shopping"
  | "Healthcare"
  | "Education"
  | "Utilities"
  | "Others";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
}

export interface Budget {
  category: Category;
  amount: number;
}
