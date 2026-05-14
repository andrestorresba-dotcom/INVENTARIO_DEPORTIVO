import { Package, TrendingDown, TrendingUp, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { obtenerProductos, crearProducto } from '../services/productosService';

interface RecentEntry {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface RecentExit {
  id: number;
  tipo: string;
  producto: string;
  precio: number;
  fecha: string;
}

const initialRecentExits: RecentExit[] = [
  { id: 1, tipo: '🟢', producto: 'Balón de Futbol', precio: 20, fecha: '15/01/2026' },
  { id: 2, tipo: '🔴', producto: 'Zapatillas Running', precio: 20, fecha: '14/01/2026' },
  { id: 3, tipo: '🔴', producto: 'Zapatillas Running', precio: 10, fecha: '14/01/2026' },
];

export default function Dashboard() {

  const [recentExits, setRecentExits] = useState<RecentExit[]>(initialRecentExits);

  const [showViewModal, setShowViewModal] = useState(false);

  const [viewingExit, setViewingExit] = useState<RecentExit | null>(null);

  const [productos, setProductos] = useState<RecentEntry[]>([]);

  // Cargar productos
  const cargarProductos = async () => {

    try {

      const data = await obtenerProductos();

      console.log("Productos cargados:", data);

      setProductos(data);

    } catch (error) {

      console.error("Error cargando productos:", error);

    }

  };

  // Ejecutar al iniciar
  useEffect(() => {

    cargarProductos();

  }, []);

  // Eliminar salida
  const handleDelete = (id: number) => {

    if (window.confirm('¿Estás seguro de eliminar esta salida?')) {

      setRecentExits(
        recentExits.filter((e: RecentExit) => e.id !== id)
      );

    }

  };

  // Ver salida
  const handleView = (exit: RecentExit) => {

    setViewingExit(exit);

    setShowViewModal(true);

  };

  // Crear producto
  const handleCrearProducto = async () => {

    const nuevoProducto = {

      nombre: "Guayos Nike",
      precio: 250000,
      stock: 15

    };

    try {

      const respuesta = await crearProducto(nuevoProducto);

      console.log("Producto creado:", respuesta);

      alert("Producto creado correctamente");

      // Recargar tabla
      await cargarProductos();

    } catch (error) {

      console.error(error);

      alert("Error al crear producto");

    }

  };

  return (

    <div>

      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">
        Gestión de Productos
      </h1>

      <button
        onClick={handleCrearProducto}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Crear producto
      </button>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="bg-[#1E3A8A] text-white rounded-lg p-6">

          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5" />
            <span className="text-sm opacity-90">
              Total Productos
            </span>
          </div>

          <div className="text-4xl font-bold">
            {productos.length}
          </div>

        </div>

        <div className="bg-[#F97316] text-white rounded-lg p-6">

          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm opacity-90">
              Bajos en Stock
            </span>
          </div>

          <div className="text-4xl font-bold">
            {productos.filter((p) => p.stock < 10).length}
          </div>

        </div>

        <div className="bg-[#22C55E] text-white rounded-lg p-6">

          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm opacity-90">
              Entradas Recientes
            </span>
          </div>

          <div className="text-4xl font-bold">
            {productos.length}
          </div>

        </div>

        <div className="bg-[#EF4444] text-white rounded-lg p-6">

          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm opacity-90">
              Salidas Recientes
            </span>
          </div>

          <div className="text-4xl font-bold">
            {recentExits.length}
          </div>

        </div>

      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Productos */}
        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="font-bold text-[#1E3A8A] mb-4">
            Productos del Backend
          </h2>

          <table className="w-full">

            <thead>

              <tr className="text-left text-sm text-gray-600 border-b">

                <th className="pb-2">ID</th>
                <th className="pb-2">Nombre</th>
                <th className="pb-2">Precio</th>
                <th className="pb-2">Stock</th>

              </tr>

            </thead>

            <tbody>

              {productos.map((entry) => (

                <tr key={entry.id} className="border-b last:border-0">

                  <td className="py-3 text-sm">
                    {entry.id}
                  </td>

                  <td className="py-3 text-sm">
                    {entry.nombre}
                  </td>

                  <td className="py-3 text-sm">
                    ${entry.precio}
                  </td>

                  <td className="py-3 text-sm">
                    {entry.stock}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}