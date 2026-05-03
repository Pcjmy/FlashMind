import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full animate-in fade-in duration-500">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-gray-500 font-medium">
          <div>&copy; {new Date().getFullYear()} FlashMind 企业版. 内部机密资料。</div>
          <div>v1.0.4-stable</div>
        </div>
      </footer>
    </div>
  );
}
