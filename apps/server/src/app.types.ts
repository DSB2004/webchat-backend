export interface TokenType {
  type: 'AUTH_TOKEN' | 'REFRESH_TOKEN';
  email: string;
  id: string;
}

export interface OTPSessionType {
  otp: string;
  email: string;
}
