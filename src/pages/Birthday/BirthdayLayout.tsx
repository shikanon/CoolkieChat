import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';
import { Gift, User, Camera, MessageCircle, Star } from 'lucide-react';

const BirthdayLayout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: '主页', path: '/birthday/home', icon: <Gift size={18} /> },
    { id: 'album', label: '照片相册', path: '/birthday/album', icon: <Camera size={18} /> },
    { id: 'blessings', label: '朋友祝福', path: '/birthday/blessings', icon: <MessageCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-pink-100 selection:text-pink-600">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/birthday/home')}>
            <div className="bg-pink-500 p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
              <Gift size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400">
              煜琦
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link 
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  location.pathname === item.path ? 'text-pink-500' : 'hover:text-pink-500'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <button 
            onClick={() => navigate('/birthday/blessings')}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            送祝福
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      <Footer />

      {/* Floating Easter Egg Button */}
      <button 
        onClick={() => setShowEasterEgg(true)}
        className="fixed bottom-24 right-8 z-50 w-12 h-12 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg flex items-center justify-center animate-bounce hover:scale-110 transition-transform"
        title="惊喜按钮"
      >
        <Star className="fill-white" size={24} />
      </button>

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-pink-500/20 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setShowEasterEgg(false)}
        >
          <div 
            className="bg-white p-10 rounded-[3rem] max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 relative text-center border-4 border-pink-200"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              onClick={() => setShowEasterEgg(false)}
            >
              ✕
            </button>
            <div className="text-6xl mb-6">🎁</div>
            <h3 className="text-3xl font-bold text-pink-600 mb-4">特别的爱给特别的你</h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              煜琦，愿你的21岁像彩虹一样绚烂，像糖果一样甜蜜，像星星一样闪耀。生日快乐，亲爱的琦琦公主！
            </p>
            <button 
              onClick={() => setShowEasterEgg(false)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-10 py-4 rounded-2xl shadow-lg transition-all"
            >
              收下祝福 ❤️
            </button>
            <div className="absolute -top-6 -left-6 text-4xl rotate-[-15deg] animate-pulse">🎂</div>
            <div className="absolute -bottom-6 -right-6 text-4xl rotate-[15deg] animate-pulse">✨</div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-pink-50 z-40 px-6 py-3 flex justify-between items-center shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        {navItems.map(item => (
          <Link 
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === item.path ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BirthdayLayout;
