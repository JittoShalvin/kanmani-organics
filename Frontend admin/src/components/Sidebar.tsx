import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  User, 
  LogOut, 
  Package,
  FileText,
  Info,
  MessageSquare,
  Share2
} from 'lucide-react';
import type { UserData } from '../types/index';

interface SidebarProps {
  user: UserData;
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', id: 'dashboard' },
    { icon: FileText, label: 'Hero', path: '/content', id: 'content' },
    { icon: Package, label: 'Product', path: '/products', id: 'list' },
    { icon: Info, label: 'About', path: '/about', id: 'about' },
    { icon: MessageSquare, label: 'Inquiries', path: '/messages', id: 'messages' },
    { icon: Share2, label: 'Footer', path: '/footer', id: 'footer' },
    { icon: User, label: 'Profile', path: '/profile', id: 'profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img src="/cropped_circle_image.png" className="w-8 h-8 object-contain" alt="Kanmani Logo" />
          <span className="font-bold text-foreground">Kanmani Admin</span>
        </div>
        <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-border flex-col z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <img src="/cropped_circle_image.png" className="w-12 h-12 object-contain" alt="Kanmani Logo" />
            <div>
              <span className="text-xl font-bold text-foreground block leading-none">Kanmani</span>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Admin Panel</span>
            </div>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all group ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-lg glow-primary scale-105'
                    : 'text-muted-foreground hover:bg-secondary hover:text-primary'
                }`}
              >
                <item.icon size={22} className={
                  isActive(item.path) ? '' : 'group-hover:scale-110 transition-transform'
                } />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-border">
          <div className="bg-muted/30 p-4 rounded-2xl mb-4 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm">
               {user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
          >
            <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border z-40 flex items-center justify-around px-6">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`p-2 rounded-xl transition-all ${
               isActive(item.path) ? 'text-primary scale-110 bg-primary/10' : 'text-muted-foreground'
            }`}
          >
            <item.icon size={24} />
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
