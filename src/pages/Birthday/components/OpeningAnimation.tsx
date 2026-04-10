import React, { useEffect, useState, useRef } from 'react';

interface OpeningAnimationProps {
  onComplete: () => void;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 5000); // 5 seconds duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Firework particle effect
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#FF69B4', '#FFB6C1', '#FFD700', '#98FB98', '#87CEFA'];

    class Particle {
      x: number;
      y: number;
      color: string;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.opacity = 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.01;
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function createFirework(x: number, y: number) {
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y));
      }
    }

    let animationId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.05) {
        createFirework(Math.random() * canvas.width, Math.random() * canvas.height);
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].opacity <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      animationId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleComplete = () => {
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleComplete}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-8 animate-in fade-in duration-1000">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-200 drop-shadow-[0_0_15px_rgba(255,105,180,0.5)] font-serif italic">
          煜琦
        </h1>
        
        <div className="flex gap-4 justify-center text-5xl animate-bounce">
          <span>🎂</span>
          <span>🐱</span>
          <span>🍓</span>
          <span>🍒</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-widest animate-pulse">
          生日快乐
        </h2>
      </div>

      <button 
        className="absolute bottom-10 right-10 text-white/50 hover:text-white border border-white/20 px-4 py-2 rounded-full text-sm transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleComplete();
        }}
      >
        跳过动画 Skip
      </button>
    </div>
  );
};

export default OpeningAnimation;
