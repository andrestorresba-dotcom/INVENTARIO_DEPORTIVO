import { Package, TrendingDown, TrendingUp, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface RecentEntry {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
}

interface RecentExit {
  id: number;
  tipo: string;
  producto: string;
  precio: number;
  fecha: string;
}

const mockRecentEntries: RecentEntry[] = [
  { id: 1, nombre: 'Balón de Futbol', categoria: 'Balones', cantidad: 20 },
  { id: 2, nombre: 'Camiseta Deportiva', categoria: 'Camiseta', cantidad: 16 },
  { id: 3, nombre: 'Raqueta de Tenis', categoria: 'Accesorios', cantidad: 10 },
];

const initialRecentExits: RecentExit[] = [
  { id: 1, tipo: '🟢', producto: 'Balón de Futbol', precio: 20, fecha: '15/01/2024' },
  { id: 2, tipo: '🔴', producto: 'Zapatillas Running', precio: 20, fecha: '14/01/2024' },
  { id: 3, tipo: '🔴', producto: 'Zapatillas Running', precio: 10, fecha: '14/01/2024' },
];

export default function Dashboard() {
  const [recentExits, setRecentExits] = useState<RecentExit[]>(initialRecentExits);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingExit, setViewingExit] = useState<RecentExit | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta salida?')) {
      setRecentExits(recentExits.filter((e: RecentExit) => e.id !== id));
    }
  };

  const handleView = (exit: RecentExit) => {
    setViewingExit(exit);
    setShowViewModal(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">Gestión de Productos</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1E3A8A] text-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5" />
            <span className="text-sm opacity-90">Total Productos</span>
          </div>
          <div className="text-4xl font-bold">250</div>
        </div>

        <div className="bg-[#F97316] text-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm opacity-90">Bajos en Stock</span>
          </div>
          <div className="text-4xl font-bold">12</div>
        </div>

        <div className="bg-[#22C55E] text-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm opacity-90">Entradas Recientes</span>
          </div>
          <div className="text-4xl font-bold">45</div>
        </div>

        <div className="bg-[#EF4444] text-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm opacity-90">Salidas Recientes</span>
          </div>
          <div className="text-4xl font-bold">30</div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Entries */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1E3A8A]">Últimas Entradas</h2>
            <div className="flex gap-2">
              <button className="w-2 h-2 bg-gray-300 rounded-full"></button>
              <button className="w-2 h-2 bg-gray-300 rounded-full"></button>
              <button className="w-2 h-2 bg-gray-400 rounded-full"></button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="pb-2">ID</th>
                <th className="pb-2">Nombre</th>
                <th className="pb-2">Categoría</th>
                <th className="pb-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentEntries.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0">
                  <td className="py-3 text-sm">{entry.id}</td>
                  <td className="py-3 text-sm">{entry.nombre}</td>
                  <td className="py-3 text-sm">{entry.categoria}</td>
                  <td className="py-3 text-sm">{entry.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Exits */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1E3A8A]">Últimas Salidas</h2>
            <div className="flex gap-2">
              <button className="w-2 h-2 bg-gray-300 rounded-full"></button>
              <button className="w-2 h-2 bg-gray-300 rounded-full"></button>
              <button className="w-2 h-2 bg-gray-400 rounded-full"></button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Producto</th>
                <th className="pb-2">Precio</th>
                <th className="pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recentExits.map((exit) => (
                <tr key={exit.id} className="border-b last:border-0">
                  <td className="py-3 text-sm">{exit.tipo}</td>
                  <td className="py-3 text-sm">{exit.producto}</td>
                  <td className="py-3 text-sm">{exit.precio}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleView(exit)}
                        className="px-3 py-1 bg-[#1E3A8A] text-white text-xs rounded hover:bg-[#1e40af]"
                      >
                        Ver
                      </button>
                      <button 
                        onClick={() => handleDelete(exit.id)}
                        className="px-3 py-1 bg-[#EF4444] text-white text-xs rounded hover:bg-[#dc2626]"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Exit Modal */}
      {showViewModal && viewingExit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Detalles de la Salida</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <p className="text-2xl">{viewingExit.tipo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <p className="text-gray-900">{viewingExit.producto}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <p className="text-gray-900 font-semibold">${viewingExit.precio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <p className="text-gray-900">{viewingExit.fecha}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingExit(null);
                }}
                className="w-full px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}