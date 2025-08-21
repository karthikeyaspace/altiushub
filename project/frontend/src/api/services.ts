import apiClient from './axios';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  owner: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface ProductData {
  name: string;
  description?: string;
  owner_id: number;
}

export interface ApiError {
  error: string;
}

export const authService = {
  signup: async (userData: SignupData): Promise<User> => {
    const response = await apiClient.post('/signup/', userData);
    return response.data;
  }
};

export const userService = {
  getUserProfile: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/user/${userId}/`);
    return response.data;
  },
};

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products/');
    return response.data;
  },

  addProduct: async (productData: ProductData): Promise<Product> => {
    const response = await apiClient.post('/add_product/', productData);
    return response.data;
  },
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
