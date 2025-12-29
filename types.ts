export enum Scene {
  PHONOGRAPH = 0,
  TYPEWRITER = 1,
  ROOFTOP = 2,
  FINALE = 3
}

export interface MusicDisc {
  id: string;
  title: string;
  color: string;
  src: string; // URL for audio
}

export interface StarNote {
  id: string;
  x: number;
  y: number;
  message: string;
  collected: boolean;
}

export interface ShootingStarData {
  id: number;
  top: number;
  left: number;
  message: string;
}
