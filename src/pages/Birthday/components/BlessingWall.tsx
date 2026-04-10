import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Trash2 } from 'lucide-react';

interface Blessing {
  id: string;
  nickname: string;
  content: string;
  avatar?: string;
  time: number;
}

const BlessingWall: React.FC = () => {
  const [blessings, setBlessings] = useState<Blessing[]>([]);
  const [newBlessing, setNewBlessing] = useState({ nickname: '', content: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Initial sample blessings
    const friendQuotes = [
      "风很温柔，花很浪漫，你很特别。",
      "我攒了好多年的温柔和可爱，现在都只想给你。",
      "万物皆有裂痕，那是光照进来的地方，而你是我的光。",
      "想和你看遍人间烟火，走遍每个角落。",
      "你是我所有浪漫的开端。",
      "山野万里，你是我藏在微风里的欢喜。",
      "与你相遇，好幸运。",
      "你是我疲惫生活中唯一的英雄梦想。",
      "想和你，一屋两人，三餐四季。",
      "你是我漫漫余生里，斩钉截铁的梦想。",
      "世界一般，但你超值。",
      "温柔是人间宝藏，而你是我。",
      "想把所有美好，都和你关联起来。",
      "你是我一眼心动，也是来日方长。"
    ];

    const initialBlessings: Blessing[] = friendQuotes.map((content, index) => ({
      id: `initial-${index}`,
      nickname: `小${String.fromCharCode(65 + index)}`, // 小A, 小B, 小C...
      content: content,
      time: Date.now() - 1000 * 60 * 60 * (index + 1)
    }));

    const stored = localStorage.getItem('birthday_blessings_v2'); // Use a new key to force update
    if (stored) {
      setBlessings(JSON.parse(stored));
    } else {
      setBlessings(initialBlessings);
      localStorage.setItem('birthday_blessings_v2', JSON.stringify(initialBlessings));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlessing.nickname || !newBlessing.content) return;

    const blessing: Blessing = {
      id: Date.now().toString(),
      nickname: newBlessing.nickname,
      content: newBlessing.content,
      time: Date.now()
    };

    const updated = [blessing, ...blessings];
    setBlessings(updated);
    localStorage.setItem('birthday_blessings_v2', JSON.stringify(updated));
    setNewBlessing({ nickname: '', content: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = blessings.filter(b => b.id !== id);
    setBlessings(updated);
    localStorage.setItem('birthday_blessings_v2', JSON.stringify(updated));
  };

  const formatTime = (time: number) => {
    const date = new Date(time);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <section id="blessings" className="py-20 px-4 md:px-10 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-4xl font-bold text-pink-600 flex items-center gap-3">
            <MessageCircle className="text-pink-600" />
            朋友祝福墙
            <span className="text-sm bg-pink-200 text-pink-700 px-3 py-1 rounded-full font-medium">
              {blessings.length} 条祝福
            </span>
          </h2>
          
          <button 
            onClick={() => setShowForm(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold flex items-center gap-2"
          >
            <Send size={20} />
            送上祝福
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blessings.map((blessing) => (
            <div 
              key={blessing.id}
              className="bg-white p-6 rounded-3xl shadow-md border border-pink-100 hover:-translate-y-2 transition-transform relative group"
            >
              <button 
                onClick={() => handleDelete(blessing.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold text-xl">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{blessing.nickname}</h3>
                  <p className="text-xs text-gray-400">{formatTime(blessing.time)}</p>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed italic">
                “{blessing.content}”
              </p>
              
              <div className="mt-4 flex justify-end">
                <span className="text-pink-300">❤️</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Blessing Form */}
      {showForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowForm(false)}
        >
          <div 
            className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-pink-600 mb-6 text-center">写下你的生日祝福</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">你的昵称</label>
                <input 
                  autoFocus
                  required
                  className="w-full bg-pink-50 border border-pink-100 rounded-2xl px-4 py-3 text-gray-800 outline-none focus:border-pink-400 transition-colors"
                  placeholder="请输入昵称..."
                  value={newBlessing.nickname}
                  onChange={e => setNewBlessing({ ...newBlessing, nickname: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">祝福语</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-pink-50 border border-pink-100 rounded-2xl px-4 py-3 text-gray-800 outline-none focus:border-pink-400 transition-colors resize-none"
                  placeholder="写下最真诚的祝福吧..."
                  value={newBlessing.content}
                  onChange={e => setNewBlessing({ ...newBlessing, content: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all"
              >
                提交祝福
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlessingWall;
