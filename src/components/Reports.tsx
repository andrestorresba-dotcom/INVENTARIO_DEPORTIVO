import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { obtenerProductos, type Producto } from '../services/productosService';

const COLORS = ['#1E3A8A', '#F97316', '#22C55E', '#EF4444', '#8B5CF6', '#06B6D4', '#FBBF24'];

interface DatoGrafica {
  name: string;
  value: number;
  color?: string;
}

export default function Reports() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros (visuales, no afectan los datos de la API en esta versión)
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [filtroProducto, setFiltroProducto] = useState('Todos');

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    try {
      setLoading(true); setError(null);
      setProductos(await obtenerProductos());
    } catch {
      setError('No se pudo cargar datos desde la API. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }

  // ── Derivar datos de gráficas ────────────────────────────────────────────

  // Stock actual de cada producto → gráfica de barras
  const barData: DatoGrafica[] = productos.map(p => ({
    name: p.nombre.length > 14 ? p.nombre.slice(0, 14) + '…' : p.nombre,
    value: p.stock,
  }));

  // Distribución de stock → gráfica de pie
  const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
  const pieData: DatoGrafica[] = productos.map((p, i) => ({
    name: p.nombre.length > 14 ? p.nombre.slice(0, 14) + '…' : p.nombre,
    value: p.stock,
    color: COLORS[i % COLORS.length],
  }));

  // KPIs
  const productoMasStock = productos.reduce(
    (max, p) => (p.stock > (max?.stock ?? -1) ? p : max),
    null as Producto | null
  );
  const productoMenosStock = productos.reduce(
    (min, p) => (p.stock < (min?.stock ?? Infinity) ? p : min),
    null as Producto | null
  );
  const valorInventario = productos.reduce((acc, p) => acc + p.precio * p.stock, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Reportes y Consultas</h1>
        <button
          onClick={cargarDatos}
          disabled={loading}
          className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? 'Actualizando...' : '🔄 Actualizar datos'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div>
            <p className="text-red-700 font-medium">Error cargando datos</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button onClick={cargarDatos} className="mt-1 text-sm text-[#1E3A8A] underline">Reintentar</button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
            <select
              value={filtroProducto}
              onChange={e => setFiltroProducto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option>Todos</option>
              {productos.map(p => (
                <option key={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-6 h-80 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
              <div className="h-60 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Gráficas */}
      {!loading && productos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie: Distribución de stock */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold text-[#1E3A8A] mb-6">Distribución de Stock por Producto</h2>
            {totalStock === 0 ? (
              <p className="text-center text-gray-400 py-20">Sin stock registrado</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                      }
                      outerRadius={100}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color ?? COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`${val} uds`, 'Stock']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bar: Stock actual */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold text-[#1E3A8A] mb-6">Inventario Actual (Unidades)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: number) => [`${val} uds`, 'Stock']} />
                <Legend />
                <Bar dataKey="value" fill="#1E3A8A" name="Stock" radius={[4, 4, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!loading && productos.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400 mb-6">
          No hay productos registrados en la API para mostrar reportes.
        </div>
      )}

      {/* KPIs */}
      {!loading && productos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Productos en Inventario</h3>
            <p className="text-3xl font-bold text-[#1E3A8A]">{productos.length}</p>
            <p className="text-sm text-gray-500 mt-1">{totalStock} unidades en total</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">Mayor Stock</h3>
            <p className="text-2xl font-bold text-[#22C55E] truncate">
              {productoMasStock?.nombre ?? '—'}
            </p>
            <p className="text-sm text-gray-500 mt-1">{productoMasStock?.stock ?? 0} unidades</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-600 mb-2">Menor Stock</h3>
            <p className="text-2xl font-bold text-[#EF4444] truncate">
              {productoMenosStock?.nombre ?? '—'}
            </p>
            <p className="text-sm text-gray-500 mt-1">{productoMenosStock?.stock ?? 0} unidades</p>
          </div>
        </div>
      )}

      {/* Tabla detallada */}
      {!loading && productos.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="font-bold text-[#1E3A8A] mb-4">Detalle de Inventario</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Producto</th>
                  <th className="pb-3">Precio</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Valor en inventario</th>
                </tr>
              </thead>
              <tbody>
                {(filtroProducto === 'Todos'
                  ? productos
                  : productos.filter(p => p.nombre === filtroProducto)
                ).map(p => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-3 text-sm text-gray-500">{p.id}</td>
                    <td className="py-3 text-sm font-medium">{p.nombre}</td>
                    <td className="py-3 text-sm">${p.precio.toLocaleString()}</td>
                    <td className="py-3 text-sm">
                      <span className={`font-semibold ${p.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {p.stock}
                      </span>
                      {p.stock < 5 && (
                        <span className="ml-2 text-xs text-red-500">⚠️ Stock bajo</span>
                      )}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      ${(p.precio * p.stock).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td colSpan={4} className="pt-3 text-sm font-bold text-gray-700">Total valor inventario</td>
                  <td className="pt-3 text-sm font-bold text-[#1E3A8A]">${valorInventario.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}