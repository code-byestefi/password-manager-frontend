export interface User {
  email: string;
  name: string;
  profileImage?: string;
  enabled: boolean; 
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  requiresVerification: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}


export interface VerificationRequest {
  email: string;
  code: string;
}

export interface VerificationResponse {
  verified: boolean;
  message: string;
}