import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

export function Layout() {
  const { sidebarOpen } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={cn(
        'transition-all duration-300 ease-in-out',
        sidebarOpen ? 'ml-64' : 'ml-16'
      )}>
        <Navbar />
        <main className="p-6 min-h-[calc(100vh-65px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
