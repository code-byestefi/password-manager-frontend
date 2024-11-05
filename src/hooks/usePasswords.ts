import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { Password } from '../types/password'; // Definiremos esto después

export function usePasswords() {
  return useQuery({
    queryKey: ['passwords'],
    queryFn: async () => {
      const { data } = await api.get<Password[]>('/passwords');
      return data;
    }
  });
}