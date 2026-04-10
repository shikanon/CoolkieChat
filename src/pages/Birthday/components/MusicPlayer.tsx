import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            // Remove listeners once played
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
          })
          .catch(err => {
            console.warn('Autoplay failed even after interaction:', err);
          });
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.warn('Auto-play blocked by browser, needs user interaction first.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-white/80 backdrop-blur-md p-3 rounded-3xl shadow-xl border border-pink-100 animate-in slide-in-from-right-10 duration-500">
      <audio 
        ref={audioRef}
        src="/虫儿飞.mp3"
        loop
        autoPlay
        playsInline
      />
      
      <div className="flex items-center gap-2 group relative">
        <div className="hidden group-hover:flex absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white p-2 rounded-xl shadow-lg border border-pink-100 flex-col items-center">
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <span className="text-[10px] text-pink-400 mt-1 font-bold">音量 {Math.round(volume * 100)}%</span>
        </div>
        <button 
          onClick={() => setVolume(v => v === 0 ? 0.5 : 0)}
          className="p-2 hover:bg-pink-50 rounded-full transition-colors text-pink-500"
        >
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <button 
        onClick={togglePlay}
        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${
          isPlaying ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-110' : 'bg-pink-100 text-pink-500'
        }`}
      >
        {isPlaying ? (
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-white animate-pulse" />
            <div className="w-1 h-4 bg-white animate-pulse delay-75" />
            <div className="w-1 h-4 bg-white animate-pulse delay-150" />
          </div>
        ) : (
          <Play size={24} fill="currentColor" />
        )}
      </button>

      {/* Floating Notes */}
      {isPlaying && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="text-pink-400 animate-bounce delay-75 text-xl">♪</div>
          <div className="text-pink-300 animate-bounce delay-150 text-lg absolute left-4 top-2">♫</div>
          <div className="text-pink-200 animate-bounce delay-300 text-xl absolute -left-4 top-4">♩</div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
