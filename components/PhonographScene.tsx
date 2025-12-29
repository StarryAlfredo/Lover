import React, { useState } from 'react';
import { MusicDisc } from '../types';
import { MUSIC_DISCS } from '../constants';
import { ArrowRight, Music, RefreshCcw } from 'lucide-react';

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

  // Click handler for mobile or easier interaction
  const placeDisc = (disc: MusicDisc) => {
    setPlacedDisc(disc);
    // Small delay to allow visual placement before playing
    setTimeout(() => {
        setIsPlaying(true);
        onMusicSelect(disc);
    }, 500);
  };

  const resetPlayer = () => {
    setIsPlaying(false);
    setPlacedDisc(null);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between bg-[#FDF6E3] relative overflow-hidden p-6 select-none">
      
      {/* Background Decor (Cartoon Clouds/Shapes) */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-200 rounded-full opacity-50 blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-50 blur-xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <div className="z-10 text-center mt-8">
        <h1 className="text-3xl md:text-4xl font-['Special_Elite'] text-slate-700 mb-2">
          New Year's Melody
        </h1>
        <p className="text-slate-500 text-sm font-serif italic">
          {placedDisc ? "Now Playing: " + placedDisc.title : "Drag a record to the player"}
        </p>
      </div>

      {/* Main Turntable Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative">
        
        {/* The Player Base */}
        <div 
            className={`relative w-72 h-72 md:w-80 md:h-80 bg-[#FF8C69] rounded-3xl shadow-[0_20px_0_rgba(200,100,80,1)] border-4 border-white transition-transform duration-300 ${isDraggingOver ? 'scale-105' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Turntable Platter */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#2D3748] rounded-full shadow-inner flex items-center justify-center">
                {/* Spindle */}
                <div className="w-4 h-4 bg-gray-300 rounded-full z-20 shadow-md"></div>
                
                {/* Placed Record */}
                {placedDisc && (
                    <div className={`absolute inset-0 rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                        {/* Vinyl Black */}
                        <div className="w-[95%] h-[95%] bg-black rounded-full shadow-xl flex items-center justify-center">
                            {/* Label */}
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${placedDisc.color} border-4 border-white flex items-center justify-center`}>
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                            {/* Grooves highlight */}
                            <div className="absolute inset-0 rounded-full border border-white/10 w-[80%] h-[80%] m-auto"></div>
                            <div className="absolute inset-0 rounded-full border border-white/10 w-[60%] h-[60%] m-auto"></div>
                        </div>
                    </div>
                )}

                {/* Drop Hint */}
                {!placedDisc && (
                    <div className={`absolute inset-0 border-4 border-dashed border-white/30 rounded-full pointer-events-none transition-opacity ${isDraggingOver ? 'opacity-100' : 'opacity-0'}`}></div>
                )}
            </div>

            {/* Tone Arm Base */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-[#E2E8F0] rounded-full shadow-md z-10 border-2 border-white"></div>
            
            {/* Tone Arm */}
            <div 
                className={`absolute top-10 right-10 w-6 h-40 bg-white rounded-full shadow-lg origin-top z-20 transition-transform duration-1000 ease-in-out border border-gray-200`}
                style={{ transform: isPlaying ? 'rotate(25deg)' : 'rotate(0deg)' }}
            >
                {/* Needle Head */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-14 bg-[#F6AD55] rounded-lg border-2 border-white"></div>
            </div>

            {/* Buttons on Player */}
            <div className="absolute bottom-4 left-4 flex gap-2">
                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            </div>
            
             {/* Music Notes Animation */}
             {isPlaying && (
                <div className="absolute -top-10 left-10 pointer-events-none">
                     <Music className="text-slate-600 w-8 h-8 animate-float" />
                </div>
            )}
             {isPlaying && (
                <div className="absolute -top-4 right-20 pointer-events-none" style={{ animationDelay: '0.5s' }}>
                     <Music className="text-slate-600 w-6 h-6 animate-float" />
                </div>
            )}
        </div>

        {/* Change Disc Button */}
        {placedDisc && (
            <button 
                onClick={resetPlayer}
                className="mt-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full shadow-sm"
            >
                <RefreshCcw size={14} /> Change Record
            </button>
        )}
      </div>

      {/* Record Rack / Selection Area */}
      <div className={`w-full max-w-2xl bg-white/50 backdrop-blur-sm rounded-t-3xl p-6 transition-transform duration-500 ${placedDisc ? 'translate-y-full opacity-50' : 'translate-y-0'}`}>
        <p className="text-center text-slate-500 mb-4 text-xs font-bold tracking-widest uppercase">My Collection</p>
        <div className="flex justify-center gap-4 md:gap-8 overflow-x-auto pb-4">
            {MUSIC_DISCS.map((disc) => (
                <div 
                    key={disc.id}
                    draggable={!placedDisc}
                    onDragStart={(e) => handleDragStart(e, disc)}
                    onClick={() => !placedDisc && placeDisc(disc)}
                    className="flex-shrink-0 cursor-pointer group relative"
                >
                    {/* Record Jacket/Sleeve */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded shadow-lg border-2 border-slate-100 group-hover:-translate-y-4 transition-transform duration-300 relative overflow-hidden">
                        {/* Record sticking out slightly */}
                        <div className="absolute top-1/2 -right-8 w-24 h-24 bg-black rounded-full transform -translate-y-1/2 group-hover:-right-4 transition-all">
                             <div className={`absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-br ${disc.color}`}></div>
                        </div>
                        
                        {/* Cover Art (Simple Color Blocks) */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${disc.color} opacity-20`}></div>
                        <div className="absolute bottom-2 left-2 font-['Special_Elite'] text-xs text-slate-700 leading-tight">
                            {disc.title}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Next Button (Appears when music is playing) */}
      {isPlaying && (
        <div className="absolute bottom-8 right-8 animate-fade-in-up z-50">
          <button
            onClick={onNext}
            className="flex items-center gap-2 bg-[#FF8C69] hover:bg-[#ff7b52] text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
          >
            Start <ArrowRight size={20} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PhonographScene;