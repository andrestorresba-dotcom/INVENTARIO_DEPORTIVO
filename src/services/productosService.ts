const BASE_URL = "http://localhost:8080/api";
const API_PRODUCTOS = `${BASE_URL}/productos`;
const API_USUARIOS = `${BASE_URL}/usuarios`;

// ─────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export interface ProductoRequest {
  nombre: string;
  precio: number;
  stock: number;
}

/** Modelo completo del Usuario según la API Java */
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  edad: number;
  rol: string;        // "admin" | "user"
  estado: boolean;    // true = activo
  contraseña: string;
}

export interface UsuarioRequest {
  nombre: string;
  correo: string;
  edad: number;
  rol: string;
  estado: boolean;
  contraseña: string;
}

export interface LoginRequest {
  correo: string;
  contraseña: string;
}

// ─────────────────────────────────────────────
// SESIÓN (en memoria – no persiste entre recargas)
// ─────────────────────────────────────────────

let sesionActual: Usuario | null = null;

export function getSesion(): Usuario | null {
  return sesionActual;
}

export function setSesion(usuario: Usuario | null) {
  sesionActual = usuario;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

// ─────────────────────────────────────────────
// AUTENTICACIÓN
// ─────────────────────────────────────────────

/**
 * Llama a POST /api/usuarios/login
 * La API devuelve el UsuarioResponseDTO si las credenciales son correctas,
 * o lanza 400 con mensaje si son inválidas / usuario inactivo.
 */
export async function login(datos: LoginRequest): Promise<Usuario> {
  const response = await fetch(`${API_USUARIOS}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const usuario = await handleResponse<Usuario>(response);
  setSesion(usuario);
  return usuario;
}

export function logout() {
  setSesion(null);
}

// ─────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────

export async function obtenerProductos(): Promise<Producto[]> {
  return handleResponse<Producto[]>(await fetch(API_PRODUCTOS));
}

export async function crearProducto(producto: ProductoRequest): Promise<Producto> {
  return handleResponse<Producto>(
    await fetch(API_PRODUCTOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    })
  );
}

export async function actualizarProducto(id: number, producto: ProductoRequest): Promise<Producto> {
  return handleResponse<Producto>(
    await fetch(`${API_PRODUCTOS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    })
  );
}

export async function eliminarProducto(id: number): Promise<void> {
  return handleResponse<void>(
    await fetch(`${API_PRODUCTOS}/${id}`, { method: "DELETE" })
  );
}

// ─────────────────────────────────────────────
// USUARIOS
// ─────────────────────────────────────────────

export async function obtenerUsuarios(): Promise<Usuario[]> {
  return handleResponse<Usuario[]>(await fetch(API_USUARIOS));
}

export async function crearUsuario(usuario: UsuarioRequest): Promise<Usuario> {
  return handleResponse<Usuario>(
    await fetch(API_USUARIOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    })
  );
}

export async function actualizarUsuario(id: number, usuario: UsuarioRequest): Promise<Usuario> {
  return handleResponse<Usuario>(
    await fetch(`${API_USUARIOS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    })
  );
}

export async function eliminarUsuario(id: number): Promise<void> {
  return handleResponse<void>(
    await fetch(`${API_USUARIOS}/${id}`, { method: "DELETE" })
  );
}