import React, { useState } from 'react';
import { Cake, Cat, MapPin, Heart, Info, Sparkles, Quote } from 'lucide-react';
import BirthdayMap from './BirthdayMap';

const PersonalInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<{ type: string; content: string } | null>(null);

  const personalData = {
    nickname: '琦琦公主',
    formalName: '吴煜琦',
    birthday: '2005年4月10日',
    hometown: '广州 & 汕头',
    pets: [
      { name: '咪咪', desc: '一只活泼可爱、最喜欢黏人的猫咪' },
      { name: '妮妮', desc: '温柔安静的小天使，偶尔调皮捣蛋' }
    ],
    cakes: ['草莓', '樱桃', '抹茶', '葡萄', '蓝莓'],
    firstMeeting: {
      date: '1月2号 下午3:25',
      location: '南巷 日茶夜酒',
      remark: '那一刻，世界仿佛静止，唯有你的笑容最动人。'
    },
    firstHeartbeat: {
      date: '1月18日',
      remark: '我（小名）第一次对煜琦你心动是1月18日。'
    }
  };

  const calculateAge = (birthday: string) => {
    const birthYear = 2005;
    const currentYear = 2026;
    return currentYear - birthYear;
  };

  const handlePetClick = (pet: { name: string; desc: string }) => {
    setShowModal({
      type: 'pet',
      content: `${pet.name}：${pet.desc}`
    });
  };

  const handleCakeClick = (cake: string) => {
    setShowModal({
      type: 'cake',
      content: `煜琦最爱的${cake}口味，甜而不腻，愿生活如蛋糕般甜蜜！`
    });
  };

  return (
    <section id="personal" className="py-20 px-4 md:px-10 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-pink-600 flex items-center justify-center gap-4">
            <Heart className="fill-pink-600 animate-pulse" />
            专属信息
            <Heart className="fill-pink-600 animate-pulse" />
          </h2>
          <div className="flex items-center justify-center gap-2 text-pink-300">
            <div className="h-px w-8 bg-current opacity-30" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold">Exclusive Information</span>
            <div className="h-px w-8 bg-current opacity-30" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Nickname & Formal Name */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-50 p-4 rounded-2xl text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-500">
                <Heart size={28} className="group-hover:fill-current" />
              </div>
              <div>
                <h3 className="text-pink-600 font-bold text-xl tracking-tight">公主昵称</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Exclusive Title</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-4xl font-serif italic font-bold text-pink-700 leading-tight">
                {personalData.nickname}
              </p>
              <div className="h-px w-12 bg-pink-100" />
              <p className="text-gray-500 font-medium">正式称呼: <span className="text-gray-800">{personalData.formalName}</span></p>
            </div>
          </div>

          {/* 2. Birthday */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-50 p-4 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-500">
                <Cake size={28} />
              </div>
              <div>
                <h3 className="text-orange-700 font-bold text-xl tracking-tight">生日快乐</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Growth Timeline</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-3xl font-bold text-gray-800 tracking-tight">
                {personalData.birthday}
              </p>
              <div className="h-px w-12 bg-orange-100" />
              <div className="flex items-center gap-2 text-pink-500 font-semibold bg-pink-50/50 px-4 py-2 rounded-full w-fit">
                <Sparkles size={16} />
                正在迎接 {calculateAge(personalData.birthday)} 岁的璀璨人生
              </div>
            </div>
          </div>

          {/* 3. First Heartbeat (Sentimental) */}
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 p-8 rounded-[2.5rem] shadow-2xl text-white hover:shadow-pink-200/50 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: '300ms' }}>
            <div className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-700">
              <Heart size={120} className="fill-current" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Heart size={28} className="fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl tracking-tight">心动时刻</h3>
                  <p className="text-white/70 text-xs uppercase tracking-widest">Heartbeat Moment</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-1 font-bold">日期</p>
                  <p className="text-3xl font-bold">{personalData.firstHeartbeat.date}</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm italic leading-relaxed bg-white/15 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                    “{personalData.firstHeartbeat.remark}”
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. First Meeting (Sentimental - Span 2) */}
          <div className="bg-gradient-to-br from-pink-600 via-pink-500 to-rose-400 p-8 rounded-[2.5rem] shadow-2xl text-white md:col-span-2 hover:shadow-rose-200/50 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: '400ms' }}>
            <div className="absolute right-10 top-10 text-white/10 group-hover:rotate-12 transition-transform duration-700">
              <Sparkles size={160} />
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl tracking-tight">初次邂逅</h3>
                    <p className="text-white/70 text-xs uppercase tracking-widest">The First Meeting</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1 font-bold">时间</p>
                    <p className="text-2xl font-bold">{personalData.firstMeeting.date}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1 font-bold">地点</p>
                    <p className="text-xl font-bold flex items-center gap-2">
                      <MapPin size={18} />
                      {personalData.firstMeeting.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-2 md:pt-0">
                <div className="bg-white/15 p-6 rounded-[2rem] backdrop-blur-md border border-white/10 shadow-inner relative">
                  <Quote className="absolute -top-3 -left-3 text-white/20 rotate-180" size={32} />
                  <p className="text-lg italic leading-relaxed font-serif">
                    {personalData.firstMeeting.remark}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Pets */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-orange-50 p-4 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-500">
                <Cat size={28} />
              </div>
              <div>
                <h3 className="text-orange-700 font-bold text-xl tracking-tight">宠物伙伴</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Sweet Companions</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {personalData.pets.map(pet => (
                <button
                  key={pet.name}
                  onClick={() => handlePetClick(pet)}
                  className="bg-orange-50/50 hover:bg-orange-100 p-4 rounded-[2rem] transition-all duration-300 group/pet text-center hover:shadow-md border border-orange-100/50"
                >
                  <div className="text-4xl mb-3 group-hover/pet:scale-125 transition-transform duration-500">🐱</div>
                  <span className="font-bold text-orange-700 block text-lg">{pet.name}</span>
                  <span className="text-[10px] text-orange-400 uppercase tracking-tighter">View Details</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Cakes (Span 1) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group lg:col-span-1 animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-pink-50 p-4 rounded-2xl text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-500">
                <Cake size={28} />
              </div>
              <div>
                <h3 className="text-pink-700 font-bold text-xl tracking-tight">蛋糕喜好</h3>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Sweet Cravings</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalData.cakes.map(cake => (
                <button
                  key={cake}
                  onClick={() => handleCakeClick(cake)}
                  className="px-5 py-2.5 bg-pink-50/50 hover:bg-pink-500 hover:text-white text-pink-700 font-semibold rounded-2xl transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:scale-105 border border-pink-100/50"
                >
                  <span className="text-lg">{cake === '草莓' ? '🍓' : cake === '樱桃' ? '🍒' : cake === '抹茶' ? '🍵' : cake === '葡萄' ? '🍇' : '🫐'}</span>
                  <span className="text-sm">{cake}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 7. Hometown Map (Span 2) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group lg:col-span-2 animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: '700ms' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
                <MapPin size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-blue-700 font-bold text-xl tracking-tight">籍贯 & 学习</h3>
                  <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-600 text-[10px] font-bold uppercase tracking-widest">Guangzhou & Shantou</div>
                </div>
                <p className="text-gray-400 text-xs mt-1">从家乡汕头到学府广州，每一步都是成长的印记</p>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden border-4 border-blue-50 shadow-inner">
              <BirthdayMap />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-900/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Pets/Cakes */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowModal(null)}
        >
          <div 
            className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(null)}
            >
              ✕
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="text-pink-500" size={32} />
              </div>
              <p className="text-gray-800 text-lg font-medium leading-relaxed">
                {showModal.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PersonalInfo;
