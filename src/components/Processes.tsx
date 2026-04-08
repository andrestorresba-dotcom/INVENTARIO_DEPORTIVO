import { useState } from 'react';
import { Plus } from 'lucide-react';

const initialHistory = [
  { id: 1, tipo: 'Entrada', producto: 'Balón de Futbol', cantidad: 20, fecha: '15/01/2024', usuario: 'Admin' },
  { id: 2, tipo: 'Salida', producto: 'Camiseta Deportiva', cantidad: 10, fecha: '14/01/2024', usuario: 'Carlos' },
  { id: 3, tipo: 'Entrada', producto: 'Zapatillas Running', cantidad: 15, fecha: '14/01/2024', usuario: 'Admin' },
  { id: 4, tipo: 'Salida', producto: 'Raqueta de Tenis', cantidad: 5, fecha: '13/01/2024', usuario: 'Maria' },
  { id: 5, tipo: 'Entrada', producto: 'Balón de Baloncesto', cantidad: 12, fecha: '13/01/2024', usuario: 'Admin' },
];

export default function Processes() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [processType, setProcessType] = useState('Entrada');
  const [history, setHistory] = useState(initialHistory);
  const [viewingProcess, setViewingProcess] = useState<any>(null);

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este proceso?')) {
      setHistory(history.filter(h => h.id !== id));
    }
  };

  const handleView = (process: any) => {
    setViewingProcess(process);
    setShowViewModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Procesos (Entradas / Salidas)</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16a34a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Registrar Proceso
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#22C55E] text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Entradas este mes</div>
              <div className="text-3xl font-bold">47</div>
            </div>
            <div className="text-5xl opacity-20">📥</div>
          </div>
        </div>
        <div className="bg-[#EF4444] text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Salidas este mes</div>
              <div className="text-3xl font-bold">30</div>
            </div>
            <div className="text-5xl opacity-20">📤</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]">
              <option>Todos</option>
              <option>Entrada</option>
              <option>Salida</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]">
              <option>Todos</option>
              <option>Balón de Futbol</option>
              <option>Camiseta Deportiva</option>
              <option>Zapatillas Running</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors">
            Filtrar
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold text-[#1E3A8A] mb-4">Historial de Movimientos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Producto</th>
                <th className="pb-3">Cantidad</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Usuario</th>
                <th className="pb-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 text-white text-xs rounded font-medium ${
                        item.tipo === 'Entrada' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                      }`}
                    >
                      {item.tipo === 'Entrada' ? '🟢 Entrada' : '🔴 Salida'}
                    </span>
                  </td>
                  <td className="py-4 text-sm">{item.producto}</td>
                  <td className="py-4 text-sm font-medium">{item.cantidad}</td>
                  <td className="py-4 text-sm text-gray-600">{item.fecha}</td>
                  <td className="py-4 text-sm text-gray-600">{item.usuario}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleView(item)}
                        className="px-3 py-1 bg-[#1E3A8A] text-white text-xs rounded hover:bg-[#1e40af]"
                      >
                        Ver
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
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

      {/* Add Process Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Registrar Proceso</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value="Entrada"
                      checked={processType === 'Entrada'}
                      onChange={(e) => setProcessType(e.target.value)}
                      className="w-4 h-4 text-[#22C55E] focus:ring-[#22C55E]"
                    />
                    <span className="text-sm">🟢 Entrada</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value="Salida"
                      checked={processType === 'Salida'}
                      onChange={(e) => setProcessType(e.target.value)}
                      className="w-4 h-4 text-[#EF4444] focus:ring-[#EF4444]"
                    />
                    <span className="text-sm">🔴 Salida</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  required
                >
                  <option value="">Seleccionar producto</option>
                  <option>Balón de Futbol</option>
                  <option>Camiseta Deportiva</option>
                  <option>Zapatillas Running</option>
                  <option>Raqueta de Tenis</option>
                  <option>Balón de Baloncesto</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Campo obligatorio</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  placeholder="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Debe ser mayor a 0</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones (opcional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  rows={3}
                  placeholder="Notas adicionales..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddModal(false);
                  }}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    processType === 'Entrada'
                      ? 'bg-[#22C55E] hover:bg-[#16a34a]'
                      : 'bg-[#EF4444] hover:bg-[#dc2626]'
                  }`}
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Process Modal */}
      {showViewModal && viewingProcess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Detalles del Proceso</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <span
                  className={`inline-block px-3 py-1 text-white text-sm rounded font-medium ${
                    viewingProcess.tipo === 'Entrada' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                  }`}
                >
                  {viewingProcess.tipo === 'Entrada' ? '🟢 Entrada' : '🔴 Salida'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <p className="text-gray-900">{viewingProcess.producto}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <p className="text-gray-900 font-semibold">{viewingProcess.cantidad} unidades</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <p className="text-gray-900">{viewingProcess.fecha}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario Responsable</label>
                <p className="text-gray-900">{viewingProcess.usuario}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingProcess(null);
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