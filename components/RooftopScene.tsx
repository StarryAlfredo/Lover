import React, { useState, useEffect, useRef } from 'react';
import { SHOOTING_STAR_MESSAGES } from '../constants';
import { ShootingStarData } from '../types';
import { Sparkles, TreePine } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const TOTAL_STARS_NEEDED = 10;

const RooftopScene: React.FC<Props> = ({ onNext }) => {
  const [collectedCount, setCollectedCount] = useState(0);
  const [shootingStars, setShootingStars] = useState<ShootingStarData[]>([]);
  const [activeMessage, setActiveMessage] = useState<{id: number, text: string, x: number, y: number} | null>(null);
  const [treeGrown, setTreeGrown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate background static stars once using lazy initialization
  const [staticStars] = useState(() => Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    top: Math.random() * 60, // Only top 60% of screen
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
  })));

  // Spawner for shooting stars
  useEffect(() => {
    if (collectedCount >= TOTAL_STARS_NEEDED) return;

    const interval = setInterval(() => {
      const id = Date.now();
      const message = SHOOTING_STAR_MESSAGES[Math.floor(Math.random() * SHOOTING_STAR_MESSAGES.length)];
      
      const newStar: ShootingStarData = {
        id,
        top: Math.random() * 40,
        left: Math.random() * 80 + 20, // Start more towards the right
        message
      };

      setShootingStars(prev => [...prev, newStar]);

      // Remove star after animation if missed
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id));
      }, 2500); 

    }, 3000); // New star every 3 seconds

    return () => clearInterval(interval);
  }, [collectedCount]);

  const handleStarClick = (e: React.MouseEvent, star: ShootingStarData) => {
    e.stopPropagation();
    // Don't double collect
    setShootingStars(prev => prev.filter(s => s.id !== star.id));
    
    // Show message
    setActiveMessage({
        id: star.id,
        text: star.message,
        x: e.clientX,
        y: e.clientY
    });

    setCollectedCount(prev => {
        const newCount = prev + 1;
        if (newCount >= TOTAL_STARS_NEEDED) {
            setTimeout(() => setTreeGrown(true), 1500);
        }
        return newCount;
    });

    // Hide message after a bit
    setTimeout(() => setActiveMessage(null), 2000);
  };

  const progressPercentage = Math.min((collectedCount / TOTAL_STARS_NEEDED) * 100, 100);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      
      {/* Moon */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-slate-200 shadow-[0_0_50px_rgba(255,255,255,0.5)] opacity-80"></div>

      {/* Static Stars */}
      {staticStars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      {/* Shooting Stars (Interactive) */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          onClick={(e) => handleStarClick(e, star)}
          className="absolute cursor-pointer z-20 group animate-shooting"
          style={{ top: `${star.top}%`, left: `${star.left}%` }}
        >
          {/* Hitbox */}
          <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center">
             <div className="w-2 h-2 bg-yellow-200 rounded-full shadow-[0_0_10px_#fff]"></div>
          </div>
        </div>
      ))}

      {/* Active Message Popup */}
      {activeMessage && (
        <div 
            className="absolute z-50 pointer-events-none animate-float"
            style={{ top: activeMessage.y - 60, left: activeMessage.x - 100 }}
        >
            <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg shadow-xl text-sm font-serif max-w-[200px] text-center border border-slate-300 transform -rotate-2">
                {activeMessage.text}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/90"></div>
            </div>
            
            {/* Fly to collector animation visual */}
            <div className="fixed w-4 h-4 bg-yellow-400 rounded-full shadow-lg transition-all duration-1000 ease-in-out"
                 style={{ 
                     top: activeMessage.y, 
                     left: activeMessage.x,
                     transform: `translate(${window.innerWidth - activeMessage.x - 50}px, ${window.innerHeight - activeMessage.y - 50}px) scale(0)`
                 }}
            ></div>
        </div>
      )}

      {/* Rooftop Silhouette */}
      <div className="absolute bottom-0 w-full h-[40%] z-10">
        {/* Roof shape */}
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full text-black fill-current">
            <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,192C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>

        {/* Two Men Silhouette */}
        <div className="absolute bottom-[20%] left-[20%] md:left-[30%] w-64 h-64 opacity-90">
             {/* Using a simplified SVG composition for two figures sitting */}
             <svg viewBox="0 0 200 200" className="w-full h-full fill-black drop-shadow-lg">
                <g transform="translate(20, 50)">
                   {/* Person 1 */}
                   <circle cx="40" cy="30" r="15" />
                   <path d="M40,50 Q20,100 30,130 L10,140 L40,150 L70,140 Z" />
                   
                   {/* Person 2 leaning */}
                   <circle cx="85" cy="35" r="15" />
                   <path d="M85,55 Q100,100 90,130 L70,140 L95,150 L120,140 Z" />
                </g>
             </svg>
        </div>
      </div>

      {/* Collector UI */}
      <div className="absolute bottom-8 right-8 z-30 flex flex-col items-end gap-2">
        {treeGrown ? (
            <button 
              onClick={onNext}
              className="animate-pulse bg-emerald-700 hover:bg-emerald-600 text-white p-4 rounded-full shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all transform hover:scale-110 flex items-center justify-center"
            >
               <TreePine size={40} />
               <span className="absolute -top-12 whitespace-nowrap bg-white/10 px-2 py-1 rounded text-xs">Click the Tree</span>
            </button>
        ) : (
            <div className="bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-slate-700">
                <div className="text-slate-300 text-xs mb-1 text-right">Collect Stardust</div>
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="text-right text-yellow-400 text-xs mt-1 font-mono">
                    {collectedCount} / {TOTAL_STARS_NEEDED}
                </div>
            </div>
        )}
      </div>

      {/* The Constellation Tree Effect (Visualizes when full) */}
      {collectedCount > 0 && (
          <div className="absolute bottom-8 right-8 pointer-events-none transition-all duration-1000" style={{ opacity: treeGrown ? 0 : 0.5 }}>
              <Sparkles className="text-yellow-400 w-6 h-6 animate-spin-slow" />
          </div>
      )}

    </div>
  );
};

export default RooftopScene;