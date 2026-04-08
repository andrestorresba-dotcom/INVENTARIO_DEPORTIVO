import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const pieData = [
  { id: 'balones', name: 'Balones', value: 35, color: '#1E3A8A' },
  { id: 'ropa', name: 'Ropa', value: 25, color: '#F97316' },
  { id: 'accesorios', name: 'Accesorios', value: 40, color: '#22C55E' },
];

const barData = [
  { id: 'balones-bar', name: 'Balones', value: 65 },
  { id: 'ropa-bar', name: 'Ropa', value: 45 },
  { id: 'accesorios-bar', name: 'Accesorios', value: 30 },
];

export default function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">Reportes y Consultas</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha: 01/01/2022 a 31/01/2022
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                defaultValue="2022-01-01"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
              <input
                type="date"
                defaultValue="2022-01-31"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto:
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]">
              <option>Todos</option>
              <option>Balones</option>
              <option>Ropa</option>
              <option>Accesorios</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-[#1E3A8A]">Productos Más Vendidos</h2>
            <button className="px-3 py-1 text-sm text-[#1E3A8A] border border-[#1E3A8A] rounded hover:bg-[#1E3A8A] hover:text-white transition-colors">
              Inventario Actual
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-6">
            {pieData.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-[#1E3A8A] mb-6">Inventario Actual</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1E3A8A" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total de Ventas</h3>
          <p className="text-3xl font-bold text-[#1E3A8A]">$12,450</p>
          <p className="text-sm text-[#22C55E] mt-1">↑ 12% vs mes anterior</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">Productos Vendidos</h3>
          <p className="text-3xl font-bold text-[#1E3A8A]">140</p>
          <p className="text-sm text-[#22C55E] mt-1">↑ 8% vs mes anterior</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">Categoría Más Popular</h3>
          <p className="text-3xl font-bold text-[#1E3A8A]">Accesorios</p>
          <p className="text-sm text-gray-600 mt-1">40% del total</p>
        </div>
      </div>
    </div>
  );
}