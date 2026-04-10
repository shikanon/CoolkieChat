import React from 'react';
import { Sparkles } from 'lucide-react';
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
      <div className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-50 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl opacity-50" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-pink-600">生日拼接画</h2>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <div className="h-px w-8 bg-current" />
              <p className="text-xs uppercase tracking-widest font-bold">A Mosaic of Memories</p>
              <div className="h-px w-8 bg-current" />
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-pink-100 to-rose-100 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-[12px] border-white bg-white p-1 group transition-all duration-700 hover:scale-[1.02] hover:shadow-pink-200/50">
              <img 
                src="/photo/mosaic_generated.jpg" 
                alt="Birthday Mosaic" 
                className="w-full h-auto object-contain cursor-zoom-in transition-all duration-700 group-hover:brightness-90"
                onClick={() => window.open('/photo/mosaic_generated.jpg', '_blank')}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center pointer-events-none">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Sparkles className="text-white" size={32} />
                  </div>
                  <p className="bg-white text-pink-600 font-bold px-10 py-4 rounded-2xl shadow-2xl tracking-widest uppercase text-sm">
                    点击查看高清大图
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-10 text-gray-400 italic text-sm">
            每一张照片都是一个小小的像素，拼凑出我们最真挚的祝福
          </p>
        </div>
      </div>
    </div>
  );
};

export default BirthdayHome;
