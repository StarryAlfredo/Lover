import React, { useRef, useEffect, useState } from 'react';
import { FINAL_MESSAGE } from '../constants.js';
import { RefreshCw } from 'lucide-react';

const ScratchCardScene = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resize = () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Fill with "fog"
        ctx.fillStyle = '#cbd5e1'; // slate-300
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text instruction
        ctx.fillStyle = '#64748b';
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("Rub screen to reveal", canvas.width / 2, canvas.height / 2);
    };
    
    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleScratch = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      // Touch event
      const touches = e.touches;
      if (touches && touches.length > 0) {
        clientX = touches[0].clientX;
        clientY = touches[0].clientY;
      } else {
        return;
      }
    } else {
      // Mouse event
      // Check if mouse is pressed (buttons === 1 is left click)
      const mouseEvent = e;
      if (mouseEvent.buttons !== 1) return;
      clientX = mouseEvent.clientX;
      clientY = mouseEvent.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    calculateScratchPercentage();
  };

  const calculateScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Optimization: check only every 10th pixel to save performance
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    for (let i = 0; i < pixels.length; i += 4 * 10) {
      if (pixels[i + 3] < 128) {
        transparentPixels++;
      }
    }

    const totalPixelsChecked = pixels.length / (4 * 10);
    const percent = (transparentPixels / totalPixelsChecked) * 100;
    
    setScratchedPercent(percent);

    if (percent > 60 && !isRevealed) {
      setIsRevealed(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-lg shadow-2xl overflow-hidden border-8 border-white transform rotate-1">
        
        {/* The Hidden Image */}
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/id/1015/600/800" 
            alt="Secret Memory" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* The Canvas Layer (Scratch Card) */}
        <div ref={containerRef} className={`absolute inset-0 transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
           <canvas 
             ref={canvasRef}
             className="w-full h-full cursor-pointer touch-none"
             onMouseMove={handleScratch}
             onTouchMove={handleScratch}
             onTouchStart={handleScratch}
             onMouseDown={handleScratch}
           ></canvas>
        </div>

        {/* Final Message Overlay */}
        <div className={`absolute bottom-0 left-0 w-full p-8 text-center transition-all duration-1000 transform ${isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <h2 className="text-2xl md:text-3xl font-serif text-white drop-shadow-md leading-relaxed">
             {FINAL_MESSAGE}
           </h2>
           <p className="text-white/80 text-sm mt-4 tracking-widest uppercase">Forever & Always</p>
        </div>
      </div>
      
      {isRevealed && (
          <button onClick={() => window.location.reload()} className="mt-8 text-white/50 hover:text-white flex items-center gap-2 text-sm">
              <RefreshCw size={14} /> Replay
          </button>
      )}
    </div>
  );
};

export default ScratchCardScene;