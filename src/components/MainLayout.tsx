import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, Package, Users, ArrowLeftRight, FileText, Bell, HelpCircle, ChevronDown } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: Home },
    { path: '/dashboard/productos', label: 'Productos', icon: Package },
    { path: '/dashboard/usuarios', label: 'Usuarios', icon: Users },
    { path: '/dashboard/procesos', label: 'Procesos', icon: ArrowLeftRight },
    { path: '/dashboard/reportes', label: 'Reportes', icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Top Header */}
      <header className="bg-[#1E3A8A] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#22C55E] p-1.5 rounded">
            <Home className="w-5 h-5" />
          </div>
          <span className="font-bold">SportInventory</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">U</span>
            </div>
            <button className="flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1E3A8A] min-h-[calc(100vh-56px)] p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full mt-8 px-4 py-3 bg-[#EF4444] text-white rounded-lg hover:bg-[#dc2626] transition-colors"
          >
            Cerrar Sesión
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}