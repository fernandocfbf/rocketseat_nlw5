import { ReactNode, useContext } from 'react';
import { createContext } from 'react';
import { useState } from 'react';

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
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  clearPlayerState: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;


}

//fernando so serve para salvar o formato
export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContexProviderProps = {
  children: ReactNode,
}

export function PlayerContextProvider({ children }: PlayerContexProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)



  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function play(episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  function clearPlayerState(){
		setEpisodeList([])
    setCurrentEpisodeIndex(0)
	}

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length


  function playNext() {

    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex + 1)
    }

    else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }

  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      playList,
      currentEpisodeIndex,
      play,
      playNext,
      playPrevious,
      togglePlay,
      isPlaying,
      setPlayingState,
      hasNext,
      hasPrevious,
      toggleLoop,
      isLooping,
      toggleShuffle,
      isShuffling,
      clearPlayerState

    }
    }>

      {children}
    </PlayerContext.Provider >
  )

}

export const usePlayer = () =>{
  return useContext(PlayerContext)
}