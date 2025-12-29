import React, { useState, useRef, useEffect } from 'react';
import { Scene, MusicDisc } from './types';
import PhonographScene from './components/PhonographScene';
import TypewriterScene from './components/TypewriterScene';
import RooftopScene from './components/RooftopScene';
import ScratchCardScene from './components/ScratchCardScene';

const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<Scene>(Scene.PHONOGRAPH);
  const [selectedMusic, setSelectedMusic] = useState<MusicDisc | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicSelect = (disc: MusicDisc) => {
    setSelectedMusic(disc);
    if (audioRef.current) {
      audioRef.current.src = disc.src;
      // Play interaction requires user gesture, which is happening in the scene
      audioRef.current.play().catch(e => console.log("Audio play failed (likely autoplay policy)", e));
      audioRef.current.volume = 0.5;
    }
  };

  const renderScene = () => {
    switch (currentScene) {
      case Scene.PHONOGRAPH:
        return (
          <PhonographScene 
            onMusicSelect={handleMusicSelect}
            onNext={() => setCurrentScene(Scene.TYPEWRITER)}
          />
        );
      case Scene.TYPEWRITER:
        return (
          <TypewriterScene 
            onNext={() => setCurrentScene(Scene.ROOFTOP)}
          />
        );
      case Scene.ROOFTOP:
        return (
          <RooftopScene 
            onNext={() => setCurrentScene(Scene.FINALE)}
          />
        );
      case Scene.FINALE:
        return <ScratchCardScene />;
      default:
        return <div>Unknown Scene</div>;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {renderScene()}
      
      {/* Global Music Control (Hidden but persistent) */}
      <div className="fixed top-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
         {selectedMusic && (
             <div className="flex items-center gap-2 bg-black/30 backdrop-blur text-white px-3 py-1 rounded-full text-xs">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                 {selectedMusic.title}
             </div>
         )}
      </div>
    </div>
  );
};

export default App;
