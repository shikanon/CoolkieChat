import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = 2026;
  const birthdayDate = '4月10日';

  return (
    <footer className="py-16 px-4 bg-gradient-to-t from-pink-50 to-white border-t border-pink-100">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-4 text-pink-500">
          <Heart className="fill-pink-500 animate-pulse" size={32} />
          <div className="h-px w-20 bg-pink-200" />
          <span className="text-xl font-serif italic font-bold">煜琦</span>
          <div className="h-px w-20 bg-pink-200" />
          <Heart className="fill-pink-500 animate-pulse" size={32} />
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-800 tracking-widest">
            致煜琦的生日祝福
          </p>
          <p className="text-lg text-pink-600 font-medium italic">
            —— 来自亲友的爱 ——
          </p>
        </div>

        <div className="pt-6 text-gray-400 text-sm flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span>🎂 2026年{birthdayDate}</span>
            <span>|</span>
            <span>Made with Love ❤️</span>
          </div>
          <p className="max-w-xs mx-auto">
            愿你在新的一岁里，眼里有星辰大海，心中有繁花似锦，永远做一个幸福的小公主。
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
