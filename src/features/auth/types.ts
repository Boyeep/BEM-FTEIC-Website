// Auth feature TypeScript types
// Contains request/response interfaces and auth-related data models.

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
}

export interface VerifyEmailRequest {
  code?: string;
  tokenHash?: string;
  type?: "signup" | "email";
  accessToken?: string;
  refreshToken?: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
  accessToken: string;
}
