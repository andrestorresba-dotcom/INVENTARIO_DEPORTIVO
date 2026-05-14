import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  obtenerProductos,
  actualizarProducto,
  type Producto,
} from '../services/productosService';

export default function Processes() {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [tipo, setTipo] = useState<'Entrada' | 'Salida'>('Entrada');
  const [productoId, setProductoId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);

  // CARGAR PRODUCTOS DESDE API
  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {

      setLoading(true);
      setError('');

      const data = await obtenerProductos();

      setProductos(data);

    } catch (e: any) {

      console.error(e);

      setError(
        e.message ||
        'Error conectando con API'
      );

    } finally {

      setLoading(false);

    }
  }

  // REGISTRAR MOVIMIENTO
  async function registrarMovimiento(e: React.FormEvent) {

    e.preventDefault();

    try {

      const producto = productos.find(
        p => p.id === productoId
      );

      if (!producto) {
        alert('Selecciona un producto');
        return;
      }

      let nuevoStock = producto.stock;

      if (tipo === 'Entrada') {

        nuevoStock += cantidad;

      } else {

        if (cantidad > producto.stock) {
          alert('No hay suficiente stock');
          return;
        }

        nuevoStock -= cantidad;
      }

      // ACTUALIZAR API
      await actualizarProducto(producto.id, {
        nombre: producto.nombre,
        precio: producto.precio,
        stock: nuevoStock,
      });

      // RECARGAR
      await cargarProductos();

      setShowModal(false);

      setCantidad(1);
      setProductoId(0);

      alert('Movimiento registrado correctamente');

    } catch (e: any) {

      console.error(e);

      alert(
        e.message ||
        'Error registrando movimiento'
      );
    }
  }

  // KPIS
  const totalProductos = productos.length;

  const totalStock = productos.reduce(
    (acc, p) => acc + p.stock,
    0
  );

  const valorInventario = productos.reduce(
    (acc, p) => acc + (p.stock * p.precio),
    0
  );

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-3xl font-bold text-[#1E3A8A]">
          Procesos de Inventario
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16a34a] transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Registrar Movimiento
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ❌ {error}
        </div>
      )}

      {/* CARDS */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-[#1E3A8A] text-white rounded-xl p-6 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80 mb-1">
                  Productos Registrados
                </p>

                <h2 className="text-4xl font-bold">
                  {totalProductos}
                </h2>

              </div>

              <div className="text-5xl opacity-20">
                📦
              </div>

            </div>

          </div>

          <div className="bg-[#22C55E] text-white rounded-xl p-6 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80 mb-1">
                  Stock Total
                </p>

                <h2 className="text-4xl font-bold">
                  {totalStock}
                </h2>

              </div>

              <div className="text-5xl opacity-20">
                📈
              </div>

            </div>

          </div>

          <div className="bg-[#F97316] text-white rounded-xl p-6 shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80 mb-1">
                  Valor Inventario
                </p>

                <h2 className="text-3xl font-bold">
                  ${valorInventario.toLocaleString()}
                </h2>

              </div>

              <div className="text-5xl opacity-20">
                💰
              </div>

            </div>

          </div>

        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500 animate-pulse">
          Conectando con API...
        </div>
      )}

      {/* TABLA */}
      {!loading && (

        <div className="bg-white rounded-xl shadow-lg p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-bold text-[#1E3A8A]">
              Inventario en Tiempo Real
            </h2>

            <button
              onClick={cargarProductos}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm"
            >
              🔄 Actualizar
            </button>

          </div>

          {productos.length === 0 ? (

            <div className="text-center py-10 text-gray-400">
              No hay productos registrados
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b text-left text-sm text-gray-600">

                    <th className="pb-4">ID</th>
                    <th className="pb-4">Producto</th>
                    <th className="pb-4">Precio</th>
                    <th className="pb-4">Stock</th>
                    <th className="pb-4">Estado</th>

                  </tr>

                </thead>

                <tbody>

                  {productos.map(producto => (

                    <tr
                      key={producto.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >

                      <td className="py-4 text-gray-500">
                        #{producto.id}
                      </td>

                      <td className="py-4 font-semibold text-gray-800">
                        {producto.nombre}
                      </td>

                      <td className="py-4 text-gray-700">
                        ${producto.precio.toLocaleString()}
                      </td>

                      <td className="py-4">

                        <span className={`font-bold text-lg ${
                          producto.stock <= 5
                            ? 'text-red-500'
                            : 'text-green-600'
                        }`}>
                          {producto.stock}
                        </span>

                      </td>

                      <td className="py-4">

                        {producto.stock <= 5 ? (

                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                            ⚠️ Stock Bajo
                          </span>

                        ) : (

                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                            ✅ Disponible
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold text-[#1E3A8A]">
                Registrar Movimiento
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={registrarMovimiento}
              className="space-y-5"
            >

              {/* TIPO */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Movimiento
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => setTipo('Entrada')}
                    className={`p-3 rounded-xl border transition-all ${
                      tipo === 'Entrada'
                        ? 'bg-[#22C55E] text-white border-[#22C55E]'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    📥 Entrada
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipo('Salida')}
                    className={`p-3 rounded-xl border transition-all ${
                      tipo === 'Salida'
                        ? 'bg-[#EF4444] text-white border-[#EF4444]'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    📤 Salida
                  </button>

                </div>

              </div>

              {/* PRODUCTO */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto
                </label>

                <select
                  value={productoId}
                  onChange={(e) =>
                    setProductoId(Number(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  required
                >

                  <option value={0}>
                    Seleccionar producto
                  </option>

                  {productos.map(producto => (

                    <option
                      key={producto.id}
                      value={producto.id}
                    >
                      {producto.nombre}
                    </option>

                  ))}

                </select>

              </div>

              {/* CANTIDAD */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>

                <input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(Number(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />

              </div>

              {/* BOTONES */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={`flex-1 px-4 py-3 text-white rounded-xl transition-colors ${
                    tipo === 'Entrada'
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

    </div>
  );
}