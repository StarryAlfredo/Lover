import React, { useState, useEffect } from 'react';
import { TYPEWRITER_TEXT } from '../constants.js';
import { Scissors } from 'lucide-react';

const TypewriterScene = ({ onNext }) => {
  const [displayedText, setDisplayedText] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const [activeKeyIndex, setActiveKeyIndex] = useState(null);

  // Typewriter text logic
  useEffect(() => {
    if (currentIndex < TYPEWRITER_TEXT.length) {
      const timeout = setTimeout(() => {
        const char = TYPEWRITER_TEXT[currentIndex];
        setDisplayedText(prev => [...prev, char]);
        setCurrentIndex(prev => prev + 1);
        
        // Randomly animate a key press
        const randomKey = Math.floor(Math.random() * 26); // 26 keys
        setActiveKeyIndex(randomKey);
        setTimeout(() => setActiveKeyIndex(null), 100);

      }, 100); // Typing speed
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex]);

  const handleNextClick = () => {
    setIsTearing(true);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  return (
    <div className="relative w-full h-full bg-[#2a2a2a] overflow-hidden flex flex-col items-center justify-end">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4a4a4a,transparent)]"></div>
      </div>

      {/* Paper Container - Coming out of the machine */}
      <div 
        className={`relative z-10 w-[90%] md:w-[600px] transition-all duration-1000 ease-in-out flex flex-col justify-end pb-[140px] md:pb-[180px] h-full
        ${isTearing ? 'translate-y-[150vh] rotate-12 opacity-0' : 'translate-y-0'}`}
      >
        <div className="relative bg-[#fdf6e3] text-stone-800 p-8 md:p-12 shadow-[0_0_20px_rgba(0,0,0,0.3)] min-h-[50vh] transition-all duration-300 origin-bottom">
            {/* Paper Texture */}
            <PaperTexture />
            
            {/* Perforation top */}
            <div className="absolute -top-4 left-0 w-full h-4 bg-[#fdf6e3] [mask-image:linear-gradient(to_right,transparent_50%,black_50%)] [mask-size:20px_100%] opacity-0"></div>

            {/* Text */}
            <TypewriterContent text={displayedText} isTypingComplete={isTypingComplete} showCursor />
        </div>
      </div>

      {/* The Cute 3D Typewriter */}
      <div className="absolute bottom-[-10px] md:bottom-[-20px] left-1/2 -translate-x-1/2 z-30 scale-90 md:scale-100 transition-transform duration-500">
         
         {/* Roller (Platen) - Behind the main body but visible at top */}
         <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-gradient-to-b from-gray-800 to-black rounded-full shadow-inner z-0"></div>

         {/* Main Body */}
         <div className="relative w-[340px] md:w-[500px] h-[220px] bg-gradient-to-b from-[#ff9a9e] to-[#ff6b6b] rounded-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_5px_15px_rgba(255,255,255,0.4),inset_0_-10px_20px_rgba(0,0,0,0.2)] border-b-8 border-[#d64545] flex flex-col items-center pt-8 z-10">
            
            {/* Logo Plate */}
            <div className="w-24 h-6 bg-yellow-400 rounded-full mb-6 shadow-[0_2px_5px_rgba(0,0,0,0.2)] flex items-center justify-center border border-yellow-300">
                <span className="text-[10px] font-bold text-yellow-900 tracking-widest uppercase">LOVE-O-MATIC</span>
            </div>

            {/* Keyboard Well */}
            <div className="w-[85%] h-[120px] bg-[#000000]/20 rounded-[30px] shadow-[inset_0_5px_10px_rgba(0,0,0,0.3)] p-4 flex flex-wrap justify-center gap-2 md:gap-3 content-start relative overflow-hidden">
                
                {/* Keys */}
                {Array.from({length: 26}).map((_, i) => (
                    <div 
                        key={i}
                        className={`
                            relative w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#f0f0f0] shadow-[0_4px_0_#999,0_5px_5px_rgba(0,0,0,0.3)] 
                            transition-transform duration-75 flex items-center justify-center border border-white
                            ${activeKeyIndex === i ? 'translate-y-[4px] shadow-[0_0_0_#999]' : ''}
                        `}
                    >
                        {/* Key Label (fake letters) */}
                        <div className="w-4 h-4 rounded-full bg-[#333] opacity-10"></div>
                    </div>
                ))}
                
                {/* Spacebar */}
                <div className={`
                    absolute bottom-4 w-1/2 h-8 rounded-full bg-[#f0f0f0] shadow-[0_4px_0_#999,0_5px_5px_rgba(0,0,0,0.3)]
                    transition-transform duration-75 border border-white
                    ${activeKeyIndex === 99 ? 'translate-y-[4px] shadow-[0_0_0_#999]' : ''}
                `}></div>
            </div>

            {/* Return Lever (Decoration) */}
            <div className="absolute -left-8 top-12 w-8 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-l-full shadow-lg origin-bottom-right transform -rotate-12 border border-gray-500">
                <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-red-500 shadow-md"></div>
            </div>
            
            {/* Right Knob */}
            <div className="absolute -right-6 top-20 w-10 h-10 bg-gray-800 rounded-full shadow-xl border-r-4 border-gray-600"></div>

         </div>
      </div>

      {/* Button Container (Centered Below Text, Above Machine) */}
      <div className={`absolute bottom-[240px] md:bottom-[260px] z-50 transition-all duration-700 w-full flex justify-center ${isTypingComplete && !isTearing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button 
            onClick={handleNextClick}
            className="group relative bg-white text-rose-500 px-8 py-3 rounded-full shadow-[0_10px_20px_rgba(255,107,107,0.4)] hover:shadow-[0_15px_30px_rgba(255,107,107,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all border-2 border-rose-100 flex items-center gap-2 font-['Ma_Shan_Zheng'] text-xl"
        >
            <Scissors className="w-5 h-5 transform rotate-90" />
            <span>收下这份心意</span>
            <div className="absolute inset-0 rounded-full ring-2 ring-rose-400/30 animate-ping"></div>
        </button>
      </div>

      <style>{`
        @keyframes ink-spread {
            0% { transform: scale(0.8); opacity: 0; filter: blur(2px); }
            60% { transform: scale(1.1); opacity: 1; filter: blur(0); }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-ink {
            display: inline-block;
            animation: ink-spread 0.1s ease-out forwards;
        }
        
        /* Cursor Blink */
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .animate-cursor {
            animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
};

// Sub-component for Paper Texture
const PaperTexture = () => (
    <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply rounded-sm overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="paperNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#paperNoise)" opacity="0.4"/>
        </svg>
    </div>
);

// Sub-component for Text Rendering
const TypewriterContent = ({ text, isTypingComplete, showCursor = false }) => {
    return (
        <div className="font-['Ma_Shan_Zheng'] text-stone-800 text-2xl md:text-3xl leading-loose tracking-wider w-full h-full min-h-[300px]">
            {text.map((char, index) => {
                if (char === '\n') return <br key={index} />;
                return (
                    <span key={index} className="animate-ink relative">
                        {char}
                    </span>
                );
            })}
            {showCursor && !isTypingComplete && (
                <span className="inline-block w-[2px] h-6 md:h-8 bg-stone-800 ml-1 animate-cursor align-middle"></span>
            )}
        </div>
    );
};

export default TypewriterScene;