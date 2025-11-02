export interface LoginRequest{
        username : string;
        password : string;
}

export interface RegisterRequest{
        username : string;
        password : string;
        email : string;
        firstName : string;
        lastName : string;
        phone : string;
        address : string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface LoginResponse {
  username: string;
  roleType : string;
  customerId: number | null;
  jwt: string;
}

export interface RawLoginResponse {
  message?: string;
  data?: LoginResponse;
}

