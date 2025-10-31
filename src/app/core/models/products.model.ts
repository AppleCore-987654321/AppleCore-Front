export interface Category {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  details: string;
  price: number;
  stock: number;
  imgUrl: string;
  status: boolean;
  categoryId: number;
  categoryName?: string;
}

export interface UpdateProductRequest extends Omit<Product, 'id'> {
}
