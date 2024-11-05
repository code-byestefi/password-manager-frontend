import api from '../lib/axios';
import { VerificationRequest, VerificationResponse } from '../types/auth';

export const verificationService = {
  async verifyEmail(data: VerificationRequest): Promise<VerificationResponse> {
    const response = await api.post<VerificationResponse>('/auth/verify', data);
    return response.data;
  },

  async resendCode(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/resend-code', { email });
    return response.data;
  }
};