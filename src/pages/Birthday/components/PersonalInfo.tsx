import React, { useState } from 'react';
import { Cake, Cat, MapPin, Heart, Info, Sparkles } from 'lucide-react';
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
        <h2 className="text-4xl font-bold text-center text-pink-600 mb-12 flex items-center justify-center gap-3">
          <Heart className="fill-pink-600" />
          专属信息
          <Heart className="fill-pink-600" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Nickname & Formal Name */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-pink-100 hover:scale-105 transition-transform">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-100 p-3 rounded-2xl text-pink-500">
                <Heart size={28} />
              </div>
              <div>
                <h3 className="text-pink-600 font-bold text-xl">公主昵称</h3>
                <p className="text-gray-500 text-sm">专属称谓</p>
              </div>
            </div>
            <p className="text-3xl font-serif italic font-bold text-pink-700 mb-2">
              {personalData.nickname}
            </p>
            <p className="text-gray-600">正式称呼: {personalData.formalName}</p>
          </div>

          {/* Birthday */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-pink-100 hover:scale-105 transition-transform">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-2xl text-green-500">
                <Cake size={28} />
              </div>
              <div>
                <h3 className="text-green-700 font-bold text-xl">生日快乐</h3>
                <p className="text-gray-500 text-sm">按时长大</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {personalData.birthday}
            </p>
            <p className="text-pink-500 font-medium">🎂 正在迎接 {calculateAge(personalData.birthday)} 岁的璀璨人生</p>
          </div>

          {/* Hometown Map */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-pink-100 lg:col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-500">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-blue-700 font-bold text-xl">籍贯 & 学习</h3>
                <p className="text-gray-500 text-sm">广州 & 汕头</p>
              </div>
            </div>
            <div className="mb-4">
              <BirthdayMap />
            </div>
            <p className="text-gray-600 text-sm italic text-center">
              从家乡汕头到学府广州，每一步都是成长的印记 🏙️
            </p>
          </div>

          {/* Pets */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-pink-100 col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-500">
                <Cat size={28} />
              </div>
              <div>
                <h3 className="text-orange-700 font-bold text-xl">宠物伙伴</h3>
                <p className="text-gray-500 text-sm">咪咪 & 妮妮</p>
              </div>
            </div>
            <div className="flex gap-4">
              {personalData.pets.map(pet => (
                <button
                  key={pet.name}
                  onClick={() => handlePetClick(pet)}
                  className="flex-1 bg-orange-50 hover:bg-orange-100 p-4 rounded-2xl transition-colors group text-center"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🐱</div>
                  <span className="font-bold text-orange-700">{pet.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cakes */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-pink-100 col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-100 p-3 rounded-2xl text-pink-500">
                <Cake size={28} />
              </div>
              <div>
                <h3 className="text-pink-700 font-bold text-xl">蛋糕喜好</h3>
                <p className="text-gray-500 text-sm">甜蜜味道</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {personalData.cakes.map(cake => (
                <button
                  key={cake}
                  onClick={() => handleCakeClick(cake)}
                  className="px-6 py-3 bg-pink-50 hover:bg-pink-200 text-pink-700 font-medium rounded-full transition-all flex items-center gap-2 hover:shadow-md"
                >
                  <span>{cake === '草莓' ? '🍓' : cake === '樱桃' ? '🍒' : cake === '抹茶' ? '🍵' : cake === '葡萄' ? '🍇' : '🫐'}</span>
                  {cake}
                </button>
              ))}
            </div>
          </div>

          {/* First Meeting */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-8 rounded-3xl shadow-xl text-white col-span-1 md:col-span-2 lg:col-span-1 hover:scale-105 transition-transform">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 className="font-bold text-xl">初次邂逅</h3>
                <p className="text-white/70 text-sm">First Meeting</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">时间</p>
                <p className="text-2xl font-bold">{personalData.firstMeeting.date}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">地点</p>
                <p className="text-xl font-medium flex items-center gap-2">
                  <MapPin size={18} />
                  {personalData.firstMeeting.location}
                </p>
              </div>
              <div className="pt-2">
                <p className="text-sm italic leading-relaxed bg-white/10 p-3 rounded-xl">
                  “{personalData.firstMeeting.remark}”
                </p>
              </div>
            </div>
          </div>

          {/* First Heartbeat */}
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 p-8 rounded-3xl shadow-xl text-white col-span-1 md:col-span-2 lg:col-span-1 hover:scale-105 transition-transform">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Heart size={28} className="fill-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">心动时刻</h3>
                <p className="text-white/70 text-sm">Heartbeat Moment</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">日期</p>
                <p className="text-2xl font-bold">{personalData.firstHeartbeat.date}</p>
              </div>
              <div className="pt-2">
                <p className="text-sm italic leading-relaxed bg-white/10 p-3 rounded-xl">
                  “{personalData.firstHeartbeat.remark}”
                </p>
              </div>
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
