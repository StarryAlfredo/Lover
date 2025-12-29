import React, { useState } from 'react';
import { MusicDisc } from '../types';
import { MUSIC_DISCS } from '../constants';
import { Disc3, Play, Music } from 'lucide-react';

interface Props {
  onMusicSelect: (disc: MusicDisc) => void;
  onNext: () => void;
}

const PhonographScene: React.FC<Props> = ({ onMusicSelect, onNext }) => {
  const [selectedDiscId, setSelectedDiscId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelect = (disc: MusicDisc) => {
    setSelectedDiscId(disc.id);
    setIsPlaying(true);
    onMusicSelect(disc);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#2c1810] relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }}>
      </div>

      <div className="z-10 text-center mb-8">
        <h1 className="text-4xl font-serif text-amber-100 mb-2 tracking-widest opacity-80">Memories</h1>
        <p className="text-amber-300 text-sm italic">Select a record to begin our journey</p>
      </div>

      {/* Phonograph Visual */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12 flex items-center justify-center">
        {/* Horn */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-full transform rotate-45 opacity-80 blur-sm"></div>
        
        {/* Base Table */}
        <div className={`w-full h-full rounded-full bg-black border-8 border-amber-900 shadow-2xl flex items-center justify-center relative ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
           {/* Vinyl Grooves */}
           <div className="w-[90%] h-[90%] rounded-full border border-gray-800 flex items-center justify-center">
             <div className="w-[80%] h-[80%] rounded-full border border-gray-800 flex items-center justify-center">
                <div className="w-[70%] h-[70%] rounded-full border border-gray-800"></div>
             </div>
           </div>
           
           {/* Center Label */}
           <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${selectedDiscId ? MUSIC_DISCS.find(d => d.id === selectedDiscId)?.color : 'from-red-700 to-red-900'} border-4 border-amber-100 flex items-center justify-center`}>
              <Music className="text-white/50 w-8 h-8" />
           </div>
        </div>

        {/* Tone Arm */}
        <div className={`absolute -right-4 top-0 w-4 h-32 bg-gray-400 origin-top transform transition-all duration-1000 ${isPlaying ? 'rotate-12' : '-rotate-45'}`}>
          <div className="w-6 h-8 bg-gray-600 absolute bottom-0 -left-1 rounded"></div>
        </div>
      </div>

      {/* Disc Selection */}
      <div className="flex gap-6 z-10">
        {MUSIC_DISCS.map((disc) => (
          <button
            key={disc.id}
            onClick={() => handleSelect(disc)}
            className={`group relative flex flex-col items-center transition-all duration-300 ${selectedDiscId === disc.id ? 'scale-110 -translate-y-2' : 'hover:scale-105'}`}
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${disc.color} shadow-lg flex items-center justify-center border-2 ${selectedDiscId === disc.id ? 'border-amber-200' : 'border-transparent'}`}>
              <Disc3 className="text-white w-8 h-8 opacity-80" />
            </div>
            <span className="mt-2 text-xs text-amber-100 font-serif tracking-wider">{disc.title}</span>
            {selectedDiscId === disc.id && (
               <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      {selectedDiscId && (
        <button
          onClick={onNext}
          className="mt-12 px-8 py-3 bg-amber-100 text-amber-900 font-serif text-lg rounded shadow-xl hover:bg-white transition-all duration-500 animate-fade-in-up flex items-center gap-2 z-10"
        >
          <Play className="w-4 h-4 fill-current" />
          Play & Continue
        </button>
      )}
    </div>
  );
};

export default PhonographScene;
