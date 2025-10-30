export interface ApiResponse<T> {
  message: string;
  data: T;
  meta: Record<string, any>;
}

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  command?: () => void;
  items?: MenuItem[];
}
