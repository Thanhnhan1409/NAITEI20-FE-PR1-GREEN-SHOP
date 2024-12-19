export interface Category {
  id: string;
  name: string;
  total: number;
  subcategories: Category[];
};
