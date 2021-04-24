import { createContext } from 'react';

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string,
}

type PlayerContextData = {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;

}

//fernando so serve para salvar o formato
export const PlayerContext = createContext({} as PlayerContextData)