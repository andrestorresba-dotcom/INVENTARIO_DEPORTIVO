import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  type Usuario,
  type UsuarioRequest,
} from '../services/productosService';

// Valor inicial vacío del formulario — todos los campos que exige la API
const FORM_VACIO: UsuarioRequest = {
  nombre:    '',
  correo:    '',
  edad:      0,
  rol:       'user',   // valor por defecto válido para la API
  estado:    true,
  contraseña: '',
};

export default function UserManagement() {
  const [users,            setUsers]            = useState<Usuario[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [apiError,         setApiError]         = useState<string | null>(null);
  const [saving,           setSaving]           = useState(false);

  const [showAdd,          setShowAdd]          = useState(false);
  const [showEdit,         setShowEdit]         = useState(false);
  const [showDelConfirm,   setShowDelConfirm]   = useState(false);

  const [editingUser,      setEditingUser]      = useState<Usuario | null>(null);
  const [userToDelete,     setUserToDelete]     = useState<number | null>(null);
  const [form,             setForm]             = useState<UsuarioRequest>(FORM_VACIO);
  const [formError,        setFormError]        = useState('');

  useEffect(() => { cargarUsuarios(); }, []);

  // ── Carga ──────────────────────────────────────────────────────────────────
  async function cargarUsuarios() {
    try {
      setLoading(true); setApiError(null);
      setUsers(await obtenerUsuarios());
    } catch (e: any) {
      setApiError(e.message ?? 'Error de conexión con la API.');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => { setForm(FORM_VACIO); setFormError(''); };

  // ── Crear ──────────────────────────────────────────────────────────────────
  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.nombre.trim())     { setFormError('El nombre es obligatorio'); return; }
    if (!form.correo.includes('@')) { setFormError('El correo debe contener @'); return; }
    if (form.edad <= 0)          { setFormError('La edad debe ser mayor a 0'); return; }
    if (!form.rol.trim())        { setFormError('El rol es obligatorio'); return; }
    if (!form.contraseña.trim()) { setFormError('La contraseña es obligatoria'); return; }
    try {
      setSaving(true);
      const nuevo = await crearUsuario(form);
      setUsers(prev => [...prev, nuevo]);
      resetForm(); setShowAdd(false);
    } catch (e: any) {
      setFormError(e.message ?? 'Error al crear usuario');
    } finally { setSaving(false); }
  };

  // ── Editar ─────────────────────────────────────────────────────────────────
  const abrirEdit = (u: Usuario) => {
    setEditingUser(u);
    setForm({
      nombre:     u.nombre,
      correo:     u.correo,
      edad:       u.edad,
      rol:        u.rol,
      estado:     u.estado,
      contraseña: u.contraseña,
    });
    setFormError('');
    setShowEdit(true);
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError('');
    if (!form.nombre.trim())     { setFormError('El nombre es obligatorio'); return; }
    if (!form.correo.includes('@')) { setFormError('El correo debe contener @'); return; }
    if (form.edad <= 0)          { setFormError('La edad debe ser mayor a 0'); return; }
    if (!form.rol.trim())        { setFormError('El rol es obligatorio'); return; }
    if (!form.contraseña.trim()) { setFormError('La contraseña es obligatoria'); return; }
    try {
      setSaving(true);
      const actualizado = await actualizarUsuario(editingUser.id, form);
      setUsers(prev => prev.map(u => u.id === editingUser.id ? actualizado : u));
      resetForm(); setShowEdit(false); setEditingUser(null);
    } catch (e: any) {
      setFormError(e.message ?? 'Error al actualizar usuario');
    } finally { setSaving(false); }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleEliminar = async () => {
    if (userToDelete === null) return;
    try {
      await eliminarUsuario(userToDelete);
      setUsers(prev => prev.filter(u => u.id !== userToDelete));
      setShowDelConfirm(false); setUserToDelete(null);
    } catch (e: any) {
      alert('Error al eliminar: ' + e.message);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Gestión de Usuarios</h1>
        <button
          onClick={() => { resetForm(); setShowAdd(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16a34a] transition-colors"
        >
          <Plus className="w-5 h-5" /> Crear Usuario
        </button>
      </div>

      {/* Estado de carga / error */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500 animate-pulse">
          Cargando usuarios desde la API...
        </div>
      )}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div>
            <p className="text-red-700 font-medium">Error de conexión</p>
            <p className="text-red-600 text-sm mt-1">{apiError}</p>
            <button onClick={cargarUsuarios} className="mt-2 text-sm text-[#1E3A8A] underline">
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      {!loading && !apiError && (
        <div className="bg-white rounded-lg shadow p-6">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay usuarios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600 border-b">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Nombre</th>
                    <th className="pb-3 pr-4">Correo</th>
                    <th className="pb-3 pr-4">Edad</th>
                    <th className="pb-3 pr-4">Rol</th>
                    <th className="pb-3 pr-4">Estado</th>
                    <th className="pb-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-4 text-sm text-gray-500 pr-4">{u.id}</td>
                      <td className="py-4 text-sm font-medium pr-4">{u.nombre}</td>
                      <td className="py-4 text-sm pr-4">{u.correo}</td>
                      <td className="py-4 text-sm pr-4">{u.edad}</td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.rol === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.estado
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {u.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirEdit(u)}
                            className="px-3 py-1 bg-[#1E3A8A] text-white text-xs rounded hover:bg-[#1e40af]"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => { setUserToDelete(u.id); setShowDelConfirm(true); }}
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
          )}
        </div>
      )}

      {/* ── Modal: Confirmar eliminar ───────────────────────────────────────── */}
      {showDelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-[#1E3A8A] mb-2">¿Eliminar usuario?</h2>
            <p className="text-sm text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDelConfirm(false); setUserToDelete(null); }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                className="flex-1 px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#dc2626]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Crear ───────────────────────────────────────────────────── */}
      {showAdd && (
        <Modal titulo="Crear Usuario" onClose={() => { setShowAdd(false); resetForm(); }}>
          <form onSubmit={handleCrear} className="space-y-4">
            <CamposFormulario form={form} setForm={setForm} error={formError} />
            <BotonesModal
              onCancel={() => { setShowAdd(false); resetForm(); }}
              saving={saving}
              labelSubmit="Crear"
              labelSaving="Creando..."
            />
          </form>
        </Modal>
      )}

      {/* ── Modal: Editar ──────────────────────────────────────────────────── */}
      {showEdit && (
        <Modal titulo="Editar Usuario" onClose={() => { setShowEdit(false); setEditingUser(null); resetForm(); }}>
          <form onSubmit={handleEditar} className="space-y-4">
            <CamposFormulario form={form} setForm={setForm} error={formError} />
            <BotonesModal
              onCancel={() => { setShowEdit(false); setEditingUser(null); resetForm(); }}
              saving={saving}
              labelSubmit="Actualizar"
              labelSaving="Actualizando..."
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

function Modal({ titulo, onClose, children }: {
  titulo: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1E3A8A]">{titulo}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CamposFormulario({
  form, setForm, error
}: {
  form: UsuarioRequest;
  setForm: React.Dispatch<React.SetStateAction<UsuarioRequest>>;
  error: string;
}) {
  const f = (patch: Partial<UsuarioRequest>) => setForm(prev => ({ ...prev, ...patch }));
  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]";
  const lbl = (text: string, required = true) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Nombre */}
      <div>
        {lbl('Nombre')}
        <input type="text" value={form.nombre}
          onChange={e => f({ nombre: e.target.value })}
          className={inputCls} placeholder="Juan Pérez" required />
      </div>

      {/* Correo */}
      <div>
        {lbl('Correo')}
        <input type="email" value={form.correo}
          onChange={e => f({ correo: e.target.value })}
          className={inputCls} placeholder="juan@ejemplo.com" required />
      </div>

      {/* Edad */}
      <div>
        {lbl('Edad')}
        <input type="number" value={form.edad || ''}
          onChange={e => f({ edad: parseInt(e.target.value) || 0 })}
          className={inputCls} placeholder="25" min="1" required />
      </div>

      {/* Rol — SELECT con las opciones exactas de la API */}
      <div>
        {lbl('Rol')}
        <select value={form.rol} onChange={e => f({ rol: e.target.value })}
          className={inputCls} required>
          <option value="user">user — Acceso limitado</option>
          <option value="admin">admin — Acceso total</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Este campo es obligatorio para la API.
        </p>
      </div>

      {/* Estado */}
      <div>
        {lbl('Estado', false)}
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => f({ estado: !form.estado })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.estado ? 'bg-[#22C55E]' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              form.estado ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
          <span className={`text-sm font-medium ${form.estado ? 'text-green-600' : 'text-red-500'}`}>
            {form.estado ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Contraseña */}
      <div>
        {lbl('Contraseña')}
        <input type="password" value={form.contraseña}
          onChange={e => f({ contraseña: e.target.value })}
          className={inputCls} placeholder="••••••••" required />
        <p className="text-xs text-gray-500 mt-1">
          Esta contraseña se usará para iniciar sesión.
        </p>
      </div>
    </>
  );
}

function BotonesModal({ onCancel, saving, labelSubmit, labelSaving }: {
  onCancel: () => void;
  saving: boolean;
  labelSubmit: string;
  labelSaving: string;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel}
        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
        Cancelar
      </button>
      <button type="submit" disabled={saving}
        className="flex-1 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16a34a] disabled:opacity-50">
        {saving ? labelSaving : labelSubmit}
      </button>
    </div>
  );
}
