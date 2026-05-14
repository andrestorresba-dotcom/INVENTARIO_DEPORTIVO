import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home } from 'lucide-react';
import { login, setSesion } from '../services/productosService';

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ correo, contraseña: password });
      navigate('/dashboard');
    } catch (err: any) {
      // La API devuelve 400 con mensaje descriptivo
      const msg: string = err.message ?? '';
      if (msg.includes('400')) {
        // Extraer el cuerpo del error si viene embebido en el mensaje
        if (msg.toLowerCase().includes('inactivo')) {
          setError('Tu cuenta está inactiva. Contacta al administrador.');
        } else {
          setError('Usuario o contraseña incorrectos.');
        }
      } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('No se pudo conectar con el servidor. Verifica que la API esté corriendo en http://localhost:8080');
      } else {
        setError('Error al iniciar sesión: ' + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1E3A8A' }}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-[#22C55E] p-2 rounded-lg">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">SportInventory</h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg flex items-start gap-2">
            <span className="text-red-500 text-lg leading-none">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">✉️</span>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => { setCorreo(e.target.value); setError(''); }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#22C55E] text-white font-bold rounded-lg hover:bg-[#16a34a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Ingresa con tu correo y contraseña registrados en el sistema.
          </p>
        </div>
      </div>
    </div>
  );
}