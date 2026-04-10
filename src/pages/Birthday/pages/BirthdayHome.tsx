import React from 'react';
import PersonalInfo from '../components/PersonalInfo';

const BirthdayHome: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-pink-50">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100/50 via-white to-white" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <h1 className="text-[20vw] font-serif italic font-bold text-pink-500 select-none">
            Birthday
          </h1>
        </div>
        <div className="relative z-10 text-center space-y-6 px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="space-y-2">
            <h2 className="text-pink-500 font-bold tracking-[0.4em] text-sm md:text-base uppercase">Happy Birthday To</h2>
            <h1 className="text-6xl md:text-8xl font-serif italic font-bold text-gray-900 drop-shadow-sm">
              煜琦
            </h1>
          </div>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed text-lg italic">
            “在这个充满爱的日子里，我们为你打造了专属的生日乐园。愿你永远眼里有光，心中有梦。”
          </p>
          <div className="flex justify-center gap-4 pt-4 text-3xl">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🎂</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>🍓</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🐱</span>
            <span className="animate-bounce" style={{ animationDelay: '450ms' }}>✨</span>
          </div>
        </div>
      </div>

      {/* Personal Info Section - Integrated directly into Home */}
      <PersonalInfo />

      {/* Mosaic Image Preview */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12 space-y-2">
            <h2 className="text-4xl font-serif italic font-bold text-pink-600">生日拼接画</h2>
            <p className="text-gray-400">点击图片查看高清大样</p>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-pink-50 bg-white p-2 group transition-transform duration-500 hover:scale-[1.01]">
            <img 
              src="/photo/mosaic_generated.jpg" 
              alt="Birthday Mosaic" 
              className="w-full h-auto object-contain cursor-zoom-in transition-transform duration-700 group-hover:brightness-95"
              onClick={() => window.open('/photo/mosaic_generated.jpg', '_blank')}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <p className="bg-white/90 backdrop-blur-sm text-pink-600 font-bold px-8 py-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                查看原图大样
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayHome;
