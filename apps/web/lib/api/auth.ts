'use client';

import apiClient from './client';
import type { CreateUserDto, LoginDto } from '@repo/types';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phoneNumber: string | null;
  };
}

export interface SignUpResponse {
  id: string;
  email: string;
  name: string;
  phoneNumber: string | null;
  verified: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export const authApi = {

  async login(credentials: LoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },


  async signUp(userData: CreateUserDto): Promise<SignUpResponse> {
    const response = await apiClient.post<SignUpResponse>(
      '/auth/signin',
      userData
    );
    return response.data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.get('/auth/verify-email', {
      params: { token },
    });
    return response.data;
  },
};

