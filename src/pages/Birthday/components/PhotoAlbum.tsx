import React, { useState, useEffect, useRef } from 'react';
import { Camera, ZoomIn, X, Play, MessageSquarePlus, Maximize2, Quote, Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Zoom, Keyboard } from 'swiper/modules';
import { BIRTHDAY_QUOTES } from '../constants/quotes';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/zoom';

const QUOTES = BIRTHDAY_QUOTES;

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  remark: string;
  quote?: string;
  date: string;
}

const PhotoAlbum: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [editingRemark, setEditingRemark] = useState<{ id: string; text: string } | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    // Media files from /public/photo directory based on LS result
    const imageFiles = [
      '20260410-095730.jpg', '20260410-095803.jpg', '20260410-095808.jpg', '20260410-095817.jpg',
      '20260410-095821.jpg', '20260410-095827.jpg', '20260410-095831.jpg', '20260410-095836.jpg',
      '20260410-095840.jpg', '20260410-095844.jpg', '20260410-095848.jpg', '20260410-095853.jpg',
      '20260410-095857.jpg', '20260410-095901.jpg', '20260410-095906.jpg', '20260410-095910.jpg',
      '20260410-095914.jpg', '20260410-095918.jpg', '20260410-095922.jpg', '20260410-095926.jpg',
      '20260410-095930.jpg', '20260410-095933.jpg', '20260410-095937.jpg', '20260410-095941.jpg',
      '20260410-100149.jpg', '20260410-100153.jpg', '20260410-100158.jpg', '20260410-100202.jpg',
      '20260410-100206.jpg', '20260410-100210.jpg', '20260410-100214.jpg', '20260410-100217.jpg',
      '20260410-100221.jpg', '20260410-100224.jpg', '20260410-100228.jpg', '20260410-100232.jpg',
      '20260410-100236.jpg', '20260410-100240.jpg', '20260410-100243.jpg', '20260410-100246.jpg',
      '20260410-100250.jpg', '20260410-100253.jpg'
    ];

    const videoFiles = [
      '飞书20260410-095812.mp4',
      '飞书20260410-095945.qt',
      '飞书20260410-095949.mp4'
    ];

    const initialMedia: MediaItem[] = [
      ...videoFiles.map((file, index) => ({
        id: `v-${index}`,
        url: `/photo/${file}`,
        type: 'video' as const,
        remark: '', // Remove generic placeholder
        quote: QUOTES[index % QUOTES.length],
        date: '2026-04-10'
      })),
      ...imageFiles.map((file, index) => ({
        id: `i-${index}`,
        url: `/photo/${file}`,
        type: 'image' as const,
        remark: '', // Remove generic placeholder
        quote: QUOTES[(index + videoFiles.length) % QUOTES.length],
        date: '2026-04-10'
      }))
    ];

    const stored = localStorage.getItem('birthday_media');
    if (stored) {
      const parsed = JSON.parse(stored) as MediaItem[];
      // Migration: Ensure quote exists and remove "生活点滴" or other generic remarks
      const migrated = parsed.map((item, index) => {
        const newItem = { ...item };
        // If quote is missing, assign one
        if (!newItem.quote) {
          newItem.quote = QUOTES[index % QUOTES.length];
        }
        // If remark is "生活点滴" or generic placeholder, clear it
        if (newItem.remark === '生活点滴' || newItem.remark?.includes('心动瞬间') || newItem.remark?.includes('公主日常')) {
          newItem.remark = '';
        }
        return newItem;
      });
      setMediaItems(migrated);
      localStorage.setItem('birthday_media', JSON.stringify(migrated));
    } else {
      setMediaItems(initialMedia);
      localStorage.setItem('birthday_media', JSON.stringify(initialMedia));
    }
  }, []);

  const handleUpdateRemark = (id: string, newRemark: string) => {
    const updated = mediaItems.map(m => m.id === id ? { ...m, remark: newRemark } : m);
    setMediaItems(updated);
    localStorage.setItem('birthday_media', JSON.stringify(updated));
    setEditingRemark(null);
  };

  return (
    <section id="album" className="py-20 px-4 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-pink-600 mb-12 flex items-center justify-center gap-3">
          <Camera className="text-pink-600" />
          照片相册
          <Camera className="text-pink-600" />
        </h2>

        {/* Featured Swiper Gallery */}
        <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-pink-50 relative group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade, Keyboard]}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            effect="fade"
            keyboard={{ enabled: true }}
            loop={true}
            className="h-[450px] md:h-[650px] w-full"
          >
            {mediaItems.slice(0, 15).map((item) => (
              <SwiperSlide key={`featured-${item.id}`}>
                <div className="relative w-full h-full bg-pink-50">
                  {item.type === 'video' ? (
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img 
                      src={item.url} 
                      alt={item.quote || item.remark}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-10 md:px-20 text-center">
                    <div className="animate-in fade-in zoom-in duration-1000 space-y-8 max-w-4xl">
                      <div className="flex justify-center">
                        <Quote className="text-pink-400/40 rotate-180" size={40} />
                      </div>
                      <p className="text-3xl md:text-5xl lg:text-6xl font-serif italic font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] leading-relaxed">
                        {item.quote}
                      </p>
                      <div className="flex justify-center">
                        <Quote className="text-pink-400/40" size={40} />
                      </div>
                      <div className="flex items-center justify-center gap-4 text-white/70">
                        {item.remark && (
                          <>
                            <div className="h-px w-12 bg-white/30" />
                            <span className="text-sm md:text-lg font-medium tracking-widest uppercase">{item.remark}</span>
                            <div className="h-px w-12 bg-white/30" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaItems.map((item, index) => (
            <div 
              key={item.id}
              className="group relative bg-pink-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-square"
              onClick={() => setActiveMediaIndex(index)}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full relative">
                  <video src={item.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-white/30 backdrop-blur-md p-3 rounded-full">
                      <Play className="text-white fill-white" size={24} />
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={item.url} 
                  alt={item.quote || item.remark}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Full Screen Swiper Viewer */}
      {activeMediaIndex !== null && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/98 backdrop-blur-xl animate-in fade-in duration-300"
        >
          <style>{`
            .swiper-button-next, .swiper-button-prev {
              color: white !important;
              opacity: 0.3;
              transition: opacity 0.3s;
            }
            .swiper-button-next:hover, .swiper-button-prev:hover {
              opacity: 0.8;
            }
            .swiper-pagination-bullet {
              background: white !important;
            }
            .swiper-pagination-bullet-active {
              background: #ec4899 !important;
            }
          `}</style>
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[70] p-2 hover:bg-white/10 rounded-full"
            onClick={() => setActiveMediaIndex(null)}
          >
            <X size={40} />
          </button>

          <div className="w-full h-full">
            <Swiper
              modules={[Navigation, Pagination, Zoom, Keyboard]}
              navigation
              pagination={{ type: 'fraction' }}
              keyboard={{ enabled: true }}
              zoom={true}
              initialSlide={activeMediaIndex}
              onSwiper={(swiper) => swiperRef.current = swiper}
              className="h-full w-full"
            >
              {mediaItems.map((item) => (
                <SwiperSlide key={`viewer-${item.id}`}>
                  <div className="swiper-zoom-container flex flex-col items-center justify-center h-full w-full p-4 md:p-10">
                    <div className="relative max-w-5xl w-full flex justify-center items-center h-full">
                      {item.type === 'video' ? (
                        <video 
                          src={item.url} 
                          className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
                          controls
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img 
                          src={item.url} 
                          alt={item.remark}
                          className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
                        />
                      )}
                    </div>
                    
                    {/* Caption for Lightbox */}
                    <div className="absolute bottom-10 left-0 right-0 text-center text-white px-6 z-10">
                      <div className="max-w-3xl mx-auto space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <Quote className="text-pink-400/40 rotate-180" size={32} />
                          </div>
                          <h2 className="text-2xl md:text-4xl font-serif italic font-bold drop-shadow-md leading-relaxed">
                            {item.quote}
                          </h2>
                          <div className="flex justify-center">
                            <Quote className="text-pink-400/40" size={32} />
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          {editingRemark?.id === item.id ? (
                            <div className="flex gap-2 w-full max-w-md">
                              <input 
                                autoFocus
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white outline-none focus:border-pink-400"
                                value={editingRemark.text}
                                onChange={e => setEditingRemark({ ...editingRemark, text: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && handleUpdateRemark(item.id, editingRemark.text)}
                              />
                              <button 
                                className="bg-pink-500 px-6 py-2 rounded-xl font-bold"
                                onClick={() => handleUpdateRemark(item.id, editingRemark.text)}
                              >
                                保存
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-4">
                              {item.remark && (
                                <p className="text-lg md:text-xl font-medium text-white/80 tracking-wide">{item.remark}</p>
                              )}
                              <button 
                                onClick={() => setEditingRemark({ id: item.id, text: item.remark })}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-pink-300"
                              >
                                <MessageSquarePlus size={20} />
                              </button>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-white/40 text-xs">
                            <div className="h-px w-8 bg-white/20" />
                            <span className="font-medium">{item.date}</span>
                            <div className="h-px w-8 bg-white/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoAlbum;

