import React, { useState, useEffect } from 'react';
import OpeningAnimation from './components/OpeningAnimation';
import MosaicView from './components/MosaicView';
import PersonalInfo from './components/PersonalInfo';
import PhotoAlbum from './components/PhotoAlbum';
import BlessingWall from './components/BlessingWall';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';
import { Gift, Heart, User, Camera, MessageCircle, Star } from 'lucide-react';

const Birthday: React.FC = () => {
  const [step, setStep] = useState<'animation' | 'mosaic' | 'main'>('animation');
  const [scrolled, setScrolled] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnimationComplete = () => {
    setStep('mosaic');
    window.scrollTo(0, 0);
  };

  const handleEnterMain = () => {
    setStep('main');
    window.scrollTo(0, 0);
  };

  const navItems = [
    { id: 'personal', label: '专属信息', icon: <User size={18} /> },
    { id: 'album', label: '照片相册', icon: <Camera size={18} /> },
    { id: 'blessings', label: '朋友祝福', icon: <MessageCircle size={18} /> },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (step === 'animation') {
    return <OpeningAnimation onComplete={handleAnimationComplete} />;
  }

  if (step === 'mosaic') {
    return <MosaicView onEnter={handleEnterMain} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-pink-100 selection:text-pink-600">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-pink-500 p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
              <Gift size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400">
              煜琦
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-2 font-medium hover:text-pink-500 transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => scrollToSection('blessings')}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            送祝福
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-pink-50">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-100/50 to-white" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <h1 className="text-[20vw] font-serif italic font-bold text-pink-500 select-none">
              Birthday
            </h1>
          </div>
          <div className="relative z-10 text-center space-y-4 px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h2 className="text-pink-500 font-bold tracking-[0.3em] text-sm md:text-base">HAPPY BIRTHDAY TO</h2>
            <h1 className="text-5xl md:text-7xl font-serif italic font-bold text-gray-900 drop-shadow-sm">
              煜琦
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
              在这个充满爱的日子里，我们为你打造了专属的生日乐园。愿你永远眼里有光，心中有梦。
            </p>
            <div className="flex justify-center gap-2 pt-4">
              <span className="animate-bounce">🎂</span>
              <span className="animate-bounce delay-150">🍓</span>
              <span className="animate-bounce delay-300">🐱</span>
              <span className="animate-bounce delay-450">✨</span>
            </div>
          </div>
        </div>

        <PersonalInfo />
        
        {/* Mosaic Image in Main Content as well */}
        <div className="py-16 px-4 bg-pink-50/30">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-serif italic font-bold text-pink-600 mb-8">生日拼接画</h2>
            <div className="relative overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-white p-4 group">
              <img 
                src="/photo/mosaic_generated.jpg" 
                alt="Birthday Mosaic" 
                className="w-full h-auto object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                onClick={() => window.open('/photo/mosaic_generated.jpg', '_blank')}
              />
              <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                  点击查看原图大样
                </p>
              </div>
            </div>
          </div>
        </div>

        <PhotoAlbum />
        <BlessingWall />
      </main>

      <Footer />
      <MusicPlayer />

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

      {/* Mobile Bottom Navigation (optional but good for UX) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-pink-50 z-40 px-6 py-3 flex justify-between items-center shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors"
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Birthday;

