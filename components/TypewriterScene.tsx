import React, { useState, useEffect } from 'react';
import { TYPEWRITER_TEXT } from '../constants';
import { ArrowRight } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const TypewriterScene: React.FC<Props> = ({ onNext }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isTearing, setIsTearing] = useState(false);

  useEffect(() => {
    if (currentIndex < TYPEWRITER_TEXT.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + TYPEWRITER_TEXT[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100); // Typing speed
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex]);

  const handleNextClick = () => {
    setIsTearing(true);
    // Delay actual navigation to allow animation to play
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  return (
    <div className="relative w-full h-full bg-stone-800 overflow-hidden flex items-center justify-center">
      
      {/* Visual representation of a typewriter (simplified) */}
      <div className={`absolute bottom-0 w-full h-32 bg-neutral-900 z-20 transition-transform duration-1000 ${isTearing ? 'translate-y-32' : ''}`}>
         {/* Keys */}
         <div className="flex justify-center gap-1 flex-wrap px-4 py-4">
             {Array.from({length: 10}).map((_, i) => (
                 <div key={i} className="w-8 h-8 rounded-full bg-neutral-700 border border-neutral-600 shadow-md"></div>
             ))}
         </div>
      </div>

      {/* The Paper Container - Splits in half during transition */}
      <div className="relative w-full max-w-2xl h-[80vh] flex">
        
        {/* Left Half */}
        <div className={`w-1/2 h-full bg-[#f4e4bc] overflow-hidden transition-transform duration-1000 ease-in-out origin-bottom-left ${isTearing ? '-rotate-12 -translate-x-full opacity-0' : ''} shadow-2xl relative`}>
           {/* Tear edge pattern using CSS radial-gradient or clip-path is tricky, simplified with a jagged border image or simple div */}
           <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-stone-300"></div>
           
           <div className="p-8 md:p-12 font-['Special_Elite'] text-stone-800 text-lg md:text-xl leading-loose whitespace-pre-wrap">
             {displayedText}
             <span className="animate-pulse">|</span>
           </div>
        </div>

        {/* Right Half - Duplicate content but clipped to show the rest, strictly for visual splitting */}
        <div className={`w-1/2 h-full bg-[#f4e4bc] overflow-hidden transition-transform duration-1000 ease-in-out origin-bottom-right ${isTearing ? 'rotate-12 translate-x-full opacity-0' : ''} shadow-2xl relative`}>
            {/* Tear edge */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-stone-300"></div>
            
             {/* We position the text absolutely to match the left side, then clip it or just let the overflow hide naturally since width is 50% */}
             <div className="absolute top-0 left-[-100%] w-[200%] h-full p-8 md:p-12 font-['Special_Elite'] text-stone-800 text-lg md:text-xl leading-loose whitespace-pre-wrap pointer-events-none opacity-0">
               {/* Invisible duplicate to maintain layout logic if needed, but for simple splitting, we might just let the text ride on the left container mostly. 
                   However, to make the tear look real, text needs to split. 
                   Implementing a true text split is complex. 
                   Simplification: Put all text in a central container that looks like one paper, then overlay two 'cover' divs that are invisible, and when tearing, we hide the central and show two halves with pre-rendered text images? 
                   
                   Alternative: Just animate the whole paper down or dissolve. 
                   Let's stick to the prompt: "Paper tearing".
                   
                   Better approach for React: Render the text in a container that *looks* like paper. 
                   When isTearing is true, replace it with two images or divs that move apart.
               */}
             </div>
             
             {/* Visual styling for the "Next" button area which appears on the paper */}
             {isTypingComplete && !isTearing && (
                <div className="absolute bottom-12 right-12">
                  <button 
                    onClick={handleNextClick}
                    className="group flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors font-serif italic"
                  >
                    Next Chapter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
             )}
        </div>
        
        {/* The Actual Text Container (Centered overlay) - Hides when tearing starts */}
        <div className={`absolute inset-0 bg-[#f4e4bc] shadow-xl p-8 md:p-12 transition-opacity duration-200 ${isTearing ? 'opacity-0' : 'opacity-100'}`}>
           {/* Paper Texture */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')` }}></div>
           
           <div className="h-full overflow-y-auto font-['Special_Elite'] text-stone-800 text-lg md:text-xl leading-loose whitespace-pre-wrap">
             {displayedText}
             {!isTypingComplete && <span className="inline-block w-2 h-5 bg-black ml-1 animate-pulse align-middle"></span>}
           </div>

           {isTypingComplete && (
            <div className="absolute bottom-8 right-8 animate-fade-in">
                <button 
                onClick={handleNextClick}
                className="px-6 py-2 border-2 border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-[#f4e4bc] transition-all font-serif rounded uppercase tracking-widest text-sm flex items-center gap-2"
                >
                Continue <ArrowRight size={16} />
                </button>
            </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default TypewriterScene;
