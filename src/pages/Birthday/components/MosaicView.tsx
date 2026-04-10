import React from 'react';
import { ChevronRight, Heart, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MosaicViewProps {
  onEnter: () => void;
}

const MosaicView: React.FC<MosaicViewProps> = ({ onEnter }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div className="fixed inset-0 z-[80] bg-pink-50 flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-1000">
      {/* Loading Overlay */}
      {!imageLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-pink-50/80 backdrop-blur-sm">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500 fill-pink-500 animate-pulse" size={24} />
          </div>
          <p className="mt-6 text-pink-600 font-bold tracking-widest animate-pulse">正在生成专属拼图...</p>
        </div>
      )}

      {/* Header Info */}
      <div className={`absolute top-10 left-0 right-0 z-20 text-center px-4 pointer-events-none transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-pink-500 font-bold tracking-[0.4em] text-xs md:text-sm animate-in slide-in-from-bottom-5">
          MOMENTS COLLECTED FOR YOU
        </h2>
        <h1 className="text-2xl md:text-4xl font-serif italic font-bold text-gray-900 drop-shadow-sm animate-in slide-in-from-bottom-5 delay-200">
          用爱拼凑的每一瞬间
        </h1>
        <p className="text-gray-400 text-xs mt-2 italic animate-in fade-in delay-500">
          双击或双指缩放查看每一个像素中的爱意
        </p>
      </div>

      {/* Full Screen Zoomable Mosaic */}
      <div className="w-full h-full flex items-center justify-center bg-pink-100/30">
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          centerOnInit={true}
          minScale={0.5}
          maxScale={10}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              {/* Floating Controls */}
              <div className={`absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-pink-100 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={() => zoomIn()} className="p-2 hover:bg-pink-50 rounded-xl transition-colors text-pink-500">
                  <ZoomIn size={20} />
                </button>
                <div className="w-px h-4 bg-pink-100" />
                <button onClick={() => zoomOut()} className="p-2 hover:bg-pink-50 rounded-xl transition-colors text-pink-500">
                  <ZoomOut size={20} />
                </button>
                <div className="w-px h-4 bg-pink-100" />
                <button onClick={() => resetTransform()} className="p-2 hover:bg-pink-50 rounded-xl transition-colors text-pink-500">
                  <RotateCcw size={20} />
                </button>
              </div>

              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                <img 
                  src="/photo/mosaic_generated.jpg" 
                  alt="Birthday Mosaic" 
                  onLoad={() => setImageLoaded(true)}
                  className={`max-w-[95vw] max-h-[70vh] w-auto h-auto object-contain shadow-2xl border-4 border-white cursor-move transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Footer Button */}
      <div className={`absolute bottom-10 left-0 right-0 z-20 flex justify-center px-4 transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={onEnter}
          className="group flex items-center gap-4 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-3xl shadow-lg hover:shadow-2xl transition-all active:scale-95 animate-in slide-in-from-bottom-5 delay-700"
        >
          <Heart className="group-hover:fill-white transition-colors" />
          <span className="text-lg md:text-xl font-bold tracking-widest">进入煜琦的生日会</span>
          <Sparkles className="animate-pulse" />
        </button>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />
    </div>
  );
};

export default MosaicView;
