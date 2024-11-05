// src/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { getImageUrl } from '../utils/image';

interface ProfileResponse {
  name: string;
  email: string;
  profileImage: string | null;
}

interface Profile extends Omit<ProfileResponse, 'profileImage'> {
  profileImage: string | null;
  profileImageUrl: string | null;
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get<ProfileResponse>('/api/profile');
      return {
        ...data,
        profileImageUrl: getImageUrl(data.profileImage)
      } as Profile;
    }
  });
}