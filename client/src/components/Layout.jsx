import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Camera,
  History,
  Lightbulb,
  User,
  LogOut,
  Droplets
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scanner', icon: Camera, label: 'Scan Meal' },
    { path: '/history', icon: History, label: 'Meal History' },
    { path: '/suggestions', icon: Lightbulb, label: 'Suggestions' },
    { path: '/water', icon: Droplets, label: 'Water' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-slate-50/80 font-inter text-slate-800 tracking-tight">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-100/80 flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-20">
        {/* Logo */}
        <div className="p-7 border-b border-slate-50">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-400">
            🥗 NutriTrack
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Track. Improve. Thrive.</p>
        </div>

        {/* User info */}
        <div className="p-5 mx-3 mt-4 border border-slate-100 rounded-2xl bg-slate-50/50 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm shadow-inner cursor-default">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs font-medium text-slate-500 capitalize truncate">{user?.dietType || 'Set diet type'}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-200/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500 transition-colors'} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-5 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full group"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto relative bg-slate-50/50">
        {/* Subtle background ambient mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/20 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-100/20 blur-[120px]"></div>
        </div>
        <div className="relative z-10 min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;