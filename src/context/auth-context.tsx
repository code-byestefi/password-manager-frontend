/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse, VerificationResponse } from '../types/auth';
import api from '../lib/axios';
import axios from 'axios';


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    updateUserProfile: (data: Partial<User>) => void;
    verifyEmail: (email: string, code: string) => Promise<VerificationResponse>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });



    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<AuthResponse>('/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);
            
            setUser({
                email: response.data.email,
                name: response.data.name,
                enabled: true
            });

            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
        try {
            console.log('Iniciando registro...');
            const response = await api.post<AuthResponse>('/auth/register', {
                name,
                email,
                password
            });
            
            console.log('Respuesta del registro:', response.data);

            if (!response.data.requiresVerification) {
                localStorage.setItem('token', response.data.token);
                setUser({
                    email: response.data.email,
                    name: response.data.name,
                    enabled: true
                });
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }

            return response.data;
        } catch (error) {
            console.error('Error en registro:', error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al registrar usuario');
        }
    };


    const verifyEmail = async (email: string, code: string): Promise<VerificationResponse> => {
        try {
            const response = await api.post<VerificationResponse>('/auth/verify', {
                email,
                code
            });
            
            if (response.data.verified) {
                // Si la verificación es exitosa, actualizar el estado del usuario
                setUser(prev => prev ? { ...prev, enabled: true } : null);
            }
            
            return response.data;
        } catch (error) {
            console.error('Error en verificación:', error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Error al verificar el código');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    useEffect(() => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }, [user]);


    const updateUserProfile = (data: Partial<User>) => {
    setUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...data };
        // Actualizar en localStorage
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
    });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            updateUserProfile,
            verifyEmail
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};