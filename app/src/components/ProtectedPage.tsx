import { useState } from 'react';

interface ProtectedPageProps {
  children: React.ReactNode;
}

export const ProtectedPage = ({ children }: ProtectedPageProps) => {
  // Estado inicial basado en sessionStorage (evita renders innecesarios)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('temp_auth') === 'true';
  });
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Credenciales desde variables de entorno
  const VALID_USERNAME = import.meta.env.VITE_TEMP_USERNAME || 'admin';
  const VALID_PASSWORD = import.meta.env.VITE_TEMP_PASSWORD || 'temporal123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('temp_auth', 'true');
    } else {
      setError('Usuario o contraseña incorrectos');
      setPassword('');
    }
  };

  // Si está autenticado, mostrar el contenido real
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Si no está autenticado, mostrar formulario de login
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Acceso Restringido
            </h1>
            <p className="text-slate-600 text-sm">
              Ingresá tus credenciales para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                placeholder="Ingresá tu usuario"
                required
                autoComplete="username"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                placeholder="Ingresá tu contraseña"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Ingresar
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Grupo Baigorria - Acceso Temporal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};