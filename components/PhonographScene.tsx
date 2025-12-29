import React, { useState } from 'react';
import { MusicDisc } from '../types';
import { MUSIC_DISCS } from '../constants';
import { ArrowRight, Disc, Music2 } from 'lucide-react';

interface Props {
  onMusicSelect: (disc: MusicDisc) => void;
  onNext: () => void;
}

const PhonographScene: React.FC<Props> = ({ onMusicSelect, onNext }) => {
  const [placedDisc, setPlacedDisc] = useState<MusicDisc | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, disc: MusicDisc) => {
    e.dataTransfer.setData('discId', disc.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const discId = e.dataTransfer.getData('discId');
    const disc = MUSIC_DISCS.find(d => d.id === discId);
    if (disc) {
      placeDisc(disc);
    }
  };

  const placeDisc = (disc: MusicDisc) => {
    setPlacedDisc(disc);
    setTimeout(() => {
        setIsPlaying(true);
        onMusicSelect(disc);
    }, 600);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between bg-[#F2F2F7] relative overflow-hidden select-none">
      
      {/* 1. Dynamic Fluid Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-20%] -left-[10%] w-[90vw] h-[90vw] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
         <div className="absolute top-[10%] -right-[10%] w-[90vw] h-[90vw] bg-cyan-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-[20%] left-[20%] w-[90vw] h-[90vw] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
         {/* Noise overlay for texture */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Header */}
      <div className="z-10 mt-12 text-center space-y-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight drop-shadow-sm font-sans">
          The Melody
        </h1>
        <div className="h-6 flex items-center justify-center">
            {isPlaying && placedDisc ? (
                 <div className="flex items-center gap-2 text-slate-500 text-xs font-medium tracking-widest uppercase animate-fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Now Playing: {placedDisc.title}
                 </div>
            ) : (
                <span className="text-slate-400 text-xs font-medium tracking-widest uppercase">Drag a record to play</span>
            )}
        </div>
      </div>

      {/* 2. Main Center Area: Player */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full gap-12">
        
        {/* The Turntable Chassis */}
        <div 
            className={`relative w-[340px] h-[340px] md:w-[380px] md:h-[380px] bg-white/60 backdrop-blur-3xl rounded-[48px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/40 transition-all duration-500 flex items-center justify-center group
            ${isDraggingOver ? 'scale-105 ring-4 ring-blue-500/20' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Chassis Texture Detail */}
            <div className="absolute inset-4 border border-slate-900/5 rounded-[36px] pointer-events-none"></div>

            {/* The Platter Base (Static) */}
            <div className="relative w-[300px] h-[300px] md:w-[330px] md:h-[330px] rounded-full bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
                 {/* Platter Metal Texture */}
                 <div className="absolute inset-0 rounded-full opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_90deg,transparent_180deg,rgba(255,255,255,0.1)_270deg,transparent_360deg)]"></div>
                 {/* Spindle */}
                 <div className="absolute w-3 h-3 bg-gray-300 rounded-full z-30 shadow-[0_1px_2px_rgba(0,0,0,0.5)] border border-gray-400 bg-gradient-to-tr from-gray-400 to-white"></div>
                
                 {/* The Vinyl Disc (Dynamic) */}
                 {placedDisc && (
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                         {/* Disc Body - The Vinyl Texture */}
                         <div className="w-[95%] h-[95%] bg-[#0a0a0a] rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
                            
                            {/* Grooves (The realistic texture) */}
                            <div className="absolute inset-0 rounded-full" 
                                 style={{ 
                                     background: 'repeating-radial-gradient(#111 0, #111 2px, #262626 3px, #111 4px)' 
                                 }}>
                            </div>

                            {/* Light Reflection (The "X" sheen on vinyl) */}
                            <div className="absolute inset-0 rounded-full opacity-20 bg-[conic-gradient(from_45deg,transparent_0deg,white_20deg,transparent_40deg,transparent_140deg,white_160deg,transparent_180deg,transparent_320deg,white_340deg,transparent_360deg)] mix-blend-overlay filter blur-md"></div>
                            
                            {/* Inner Label */}
                            <div className={`z-10 w-32 h-32 rounded-full bg-gradient-to-br ${placedDisc.color} flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] relative border-4 border-black/80`}>
                                {/* Label Paper Texture */}
                                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                                {/* Center Hole */}
                                <div className="w-3 h-3 bg-black rounded-full"></div>
                                {/* Tiny Text */}
                                <div className="absolute bottom-6 text-[6px] text-white/60 tracking-widest uppercase font-mono">33 RPM • Stereo</div>
                            </div>
                         </div>
                    </div>
                )}
            </div>

            {/* The Tone Arm (Detailed & Realistic) */}
            <div className="absolute -top-6 -right-6 w-32 h-80 pointer-events-none z-40">
                
                {/* 1. Base / Pivot Assembly */}
                <div className="absolute top-10 right-10 w-20 h-20 flex items-center justify-center">
                    {/* Outer Ring */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_white] border border-gray-300 flex items-center justify-center">
                        {/* Inner Bearing */}
                        <div className="w-10 h-10 rounded-full bg-zinc-800 shadow-inner flex items-center justify-center border border-zinc-600">
                             <div className="w-4 h-4 rounded-full bg-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"></div>
                        </div>
                    </div>
                </div>

                {/* 2. The Arm Tube & Counterweight */}
                <div 
                    className="absolute top-[4.5rem] right-[4.5rem] w-8 h-64 origin-top transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ transform: isPlaying ? 'rotate(25deg)' : 'rotate(0deg)' }}
                >
                    {/* Counterweight (Back) */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-zinc-700 rounded-md shadow-lg border-l border-white/20">
                         {/* Texture lines */}
                         <div className="absolute inset-0 flex flex-col justify-center gap-[2px] opacity-30">
                             <div className="w-full h-[1px] bg-white"></div>
                             <div className="w-full h-[1px] bg-white"></div>
                             <div className="w-full h-[1px] bg-white"></div>
                         </div>
                    </div>

                    {/* Arm Tube */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-52 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-300 rounded-full shadow-xl"></div>

                    {/* Headshell (Front) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-black rounded-sm shadow-md flex flex-col items-center justify-end pb-1">
                        <div className="w-4 h-6 bg-zinc-800 rounded mb-1"></div>
                        {/* Needle */}
                        <div className="w-0.5 h-2 bg-yellow-600"></div>
                    </div>
                </div>
            </div>

            {/* Play/Stop Light */}
            <div className="absolute bottom-8 left-8">
                 <div className={`w-3 h-3 rounded-full transition-all duration-500 border border-black/10 ${isPlaying ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-400 shadow-inner'}`}></div>
            </div>
        </div>

        {/* Action Button (Floating below) */}
        <div className={`h-16 flex items-center justify-center transition-all duration-700 transform ${isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
             <button
                onClick={onNext}
                className="group relative overflow-hidden bg-slate-900/90 backdrop-blur-md text-white px-12 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 transition-transform active:scale-95 hover:scale-105"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-3 font-medium tracking-wide">
                    <span>Begin Confession</span>
                    <ArrowRight size={18} className="text-white/80 group-hover:translate-x-1 transition-transform" />
                </div>
             </button>
        </div>

      </div>

      {/* 3. The Dock: Record Collection */}
      <div className="z-20 w-full px-6 pb-10">
        <div className="max-w-xl mx-auto">
            {/* Dock Container */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[32px] p-4 flex justify-center gap-6 items-center">
                
                {MUSIC_DISCS.map((disc) => {
                   const isSelected = placedDisc?.id === disc.id;
                   return (
                    <div 
                        key={disc.id}
                        draggable={!isSelected}
                        onDragStart={(e) => handleDragStart(e, disc)}
                        onClick={() => !isSelected && placeDisc(disc)}
                        className={`group relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                            ${isSelected ? 'opacity-0 scale-0 w-0 mx-0' : 'hover:-translate-y-4 hover:scale-105 opacity-100 w-20 md:w-24'}
                        `}
                    >
                        {/* Record Sleeve/Icon */}
                        <div className={`aspect-square rounded-xl bg-gradient-to-br ${disc.color} shadow-lg group-hover:shadow-2xl flex items-center justify-center relative overflow-hidden ring-1 ring-black/5 transition-all`}>
                            {/* Inner circle hint */}
                            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border border-white/20"></div>
                            <Music2 className="text-white/80 w-8 h-8 drop-shadow-md" />
                            
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/10 pointer-events-none"></div>
                        </div>
                        
                        {/* Title Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="bg-black/80 backdrop-blur text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full whitespace-nowrap shadow-xl">
                                {disc.title}
                            </div>
                        </div>
                    </div>
                   );
                })}

                {/* Reset Button (Only shows when playing) */}
                {placedDisc && (
                    <button 
                    onClick={() => { setIsPlaying(false); setPlacedDisc(null); }}
                    className="w-14 h-14 rounded-full bg-white/50 hover:bg-white/80 border border-white flex items-center justify-center transition-colors shadow-sm animate-fade-in group"
                    title="Change Record"
                    >
                    <Disc className="text-slate-500 w-6 h-6 group-hover:rotate-90 transition-transform" />
                    </button>
                )}
            </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.8s linear infinite; /* 33RPM ish speed */
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PhonographScene;