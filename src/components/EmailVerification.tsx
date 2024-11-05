import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock } from 'lucide-react';
import { verificationService } from "../services/verificationService";

export function EmailVerification() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Email no encontrado');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            await verificationService.verifyEmail({ email, code });
            navigate('/login');
        } catch (err) {
            console.error('Error al verificar código:', err);
            setError('Código inválido o expirado');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) return;

        try {
            await verificationService.resendCode(email);
            alert('Se ha enviado un nuevo código a tu email');
        } catch (err) {
            console.error('Error al reenviar código:', err);
            setError('Error al reenviar el código');
        }
    };

    if (!email) {
        navigate('/register');
        return null;
    }

    return (
        <div className="w-full">
            {/* Logo o Ícono */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100">
                    <Lock className="w-8 h-8 text-primary-600" />
                </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Verifica tu email
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Hemos enviado un código de verificación a:<br />
                    <span className="font-medium">{email}</span>
                </p>
            </div>

            {/* Formulario */}
            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 text-center">
                        {error}
                    </div>
                )}

                <div>
                    <label 
                        htmlFor="code"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Código de verificación
                    </label>
                    <input
                        id="code"
                        type="text"
                        required
                        maxLength={6}
                        className="mt-2 block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                        placeholder="Ingresa el código de 6 dígitos"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Ingresa el código de 6 dígitos enviado a tu email
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Verificando...' : 'Verificar código'}
                    </button>

                    <button
                        type="button"
                        onClick={handleResendCode}
                        className="w-full text-sm text-primary-600 hover:text-primary-500"
                    >
                        ¿No recibiste el código? Reenviar
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        ¿Te equivocaste de email?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-primary-600 hover:text-primary-500"
                        >
                            Regresa al registro
                        </Link>
                    </p>
                </div>
            </form>

            {/* Versión móvil de la imagen */}
            <div className="mt-8 text-center md:hidden">
                <img
                    src="/src/assets/safe.png"
                    alt="Safe"
                    className="w-48 h-auto mx-auto opacity-75"
                />
            </div>
        </div>
    );
}