import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  type Producto,
} from '../services/productosService';

export default function ProductManagement() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { nombre: '', precio: '', stock: '' };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { cargarProductos(); }, []);

  async function cargarProductos() {
    try {
      setLoading(true); setError(null);
      setProducts(await obtenerProductos());
    } catch {
      setError('No se pudo conectar con la API. Verifica que el servidor esté corriendo en http://localhost:8080');
    } finally { setLoading(false); }
  }

  const resetForm = () => setFormData(emptyForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setProducts([...products, await crearProducto({
        nombre: formData.nombre,
        precio: parseFloat(formData.precio) || 0,
        stock: parseInt(formData.stock) || 0,
      })]);
      resetForm(); setShowAddModal(false);
    } catch (err: any) { alert('Error al crear producto: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (product: Producto) => {
    setEditingProduct(product);
    setFormData({ nombre: product.nombre, precio: product.precio.toString(), stock: product.stock.toString() });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setSaving(true);
      const actualizado = await actualizarProducto(editingProduct.id, {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio) || 0,
        stock: parseInt(formData.stock) || 0,
      });
      setProducts(products.map(p => p.id === editingProduct.id ? actualizado : p));
      resetForm(); setShowEditModal(false); setEditingProduct(null);
    } catch (err: any) { alert('Error al actualizar: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await eliminarProducto(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) { alert('Error al eliminar: ' + err.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Gestión de Productos</h1>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16a34a] transition-colors">
          <Plus className="w-5 h-5" /> Agregar Producto
        </button>
      </div>

      {loading && <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Cargando productos...</div>}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div>
            <p className="text-red-700 font-medium">Error de conexión</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button onClick={cargarProductos} className="mt-2 text-sm text-[#1E3A8A] underline">Reintentar</button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-6">
          {products.length === 0 ? <p className="text-center text-gray-500 py-8">No hay productos registrados.</p> : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Nombre</th>
                  <th className="pb-3">Precio</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-4 text-sm">{product.id}</td>
                    <td className="py-4 text-sm">{product.nombre}</td>
                    <td className="py-4 text-sm">
                      <span className="px-2 py-1 bg-[#22C55E] text-white text-xs rounded">${product.precio.toFixed(2)}</span>
                    </td>
                    <td className="py-4 text-sm">{product.stock}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="px-3 py-1 bg-[#1E3A8A] text-white text-xs rounded hover:bg-[#1e40af]">Editar</button>
                        <button onClick={() => handleDelete(product.id)} className="px-3 py-1 bg-[#EF4444] text-white text-xs rounded hover:bg-[#dc2626]">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Agregar Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <CamposProducto formData={formData} setFormData={setFormData} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16a34a] disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Editar Producto</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <CamposProducto formData={formData} setFormData={setFormData} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingProduct(null); resetForm(); }} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16a34a] disabled:opacity-50">{saving ? 'Actualizando...' : 'Actualizar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CamposProducto({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
        <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="Ej: Balón de Fútbol" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio <span className="text-red-500">*</span></label>
        <input type="number" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="0.00" min="0" step="0.01" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock <span className="text-red-500">*</span></label>
        <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" placeholder="0" min="0" required />
      </div>
    </>
  );
}