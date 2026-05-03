import { Link } from 'react-router-dom';

export default function Navbar() {
  const logoUrl = "/logo.svg";

  return (
    <nav className="bg-white border-b-4 border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform">
              <img src={logoUrl} alt="FlashMind Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#312E81]">
              FlashMind
            </span>
          </Link>
          
          <div className="hidden sm:flex space-x-2">
            <Link to="/dashboard" className="text-gray-500 hover:text-[#4F46E5] hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
              我的乐园
            </Link>
            <button className="text-gray-500 hover:text-[#4F46E5] hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
              个人中心
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
