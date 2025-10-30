export interface Customer{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string; // O Date, dependiendo de cómo se maneje en el frontend
}