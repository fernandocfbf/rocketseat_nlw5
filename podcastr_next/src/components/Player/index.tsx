import { useRef, useEffect, useState } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/playerContext';
import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { ObjectFlags } from 'typescript';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'


export function Player() {

	const audioref = useRef<HTMLAudioElement>(null)
	const [progress, setProgress] = useState(0)
	const {
		episodeList,
		currentEpisodeIndex,
		isPlaying,
		isLooping,
		isShuffling,
		togglePlay,
		toggleShuffle,
		toggleLoop,
		setPlayingState,
		playNext,
		playPrevious,
		hasNext,
		hasPrevious,
		clearPlayerState
	} = usePlayer()

	useEffect(() => {

		//se nao tiver referencia, nao executa nada
		if (!audioref.current) {
			return;
		}

		//se isPlaying for true
		else if (isPlaying) {
			audioref.current.play()
		}

		else if (!isPlaying) {
			audioref.current.pause()
		}
	}, [isPlaying])

	function setupProgressListener() {
		audioref.current.currentTime = 0;
		audioref.current.addEventListener("timeupdate", () => {
			setProgress(Math.floor(audioref.current.currentTime))
		})
	}

	function handleSeek(amount: number){
		audioref.current.currentTime = amount
		setProgress(amount)
	}

	function handleEpisodeEnded(){
		if (hasNext){
			playNext()
		}
		else{
			clearPlayerState()
		}
	}

	const episode = episodeList[currentEpisodeIndex]
	return (
		<div className={styles.playerContainer}>
			<header>
				<img src='/playing.svg' alt='Tocando agora'></img>
				<strong>Tocando agora</strong>
			</header>

			{ episode ? (
				<div className={styles.currentEpisode}>
					<Image
						width={592}
						height={592}
						src={episode.thumbnail}
						objectFit='cover'>

					</Image>
					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>)
				:
				(<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>)
			}

			<footer className={!episode ? styles.empty : ""}>
				<div className={styles.progress}>
					<span>{convertDurationToTimeString(progress)}</span>
					<div className={styles.slider}>
						{episode ?
							(<Slider
								max={episode.duration}
								value={progress}
								onChange={handleSeek}
								trackStyle={{ backgroundColor: '#04d361' }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								handleStyle={{ borderColor: '#04d361' }}

							></Slider>)
							: (
								<div className={styles.emptySlider}></div>
							)}
					</div>
					<span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
				</div>

				{episode && (
					<audio
						src={episode.url}
						ref={audioref}
						autoPlay
						onEnded={handleEpisodeEnded}
						loop={isLooping}
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
						onLoadedMetadata={setupProgressListener}
					>
					</audio>
				)}

				<div className={styles.buttons}>
					<button type='button'
						disabled={!episode || episodeList.length === 1}
						onClick={toggleShuffle}
						className={isShuffling ? styles.isActive : ''}>
						<img src='/shuffle.svg' alt='Embaralhar'></img>
					</button>

					<button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
						<img src='/play-previous.svg' alt='Tocar anterior'></img>
					</button>

					<button type='button'
						className={styles.playButton}
						disabled={!episode}
						onClick={togglePlay}>
						{
							isPlaying
								? <img src='/pause.svg' alt='Tocar'></img>
								: <img src='/play.svg' alt='Tocar'></img>

						}

					</button>

					<button type='button' onClick={playNext} disabled={!episode || !hasNext}>
						<img src='/play-next.svg' alt='Tocar próximo'></img>
					</button>

					<button
						type='button'
						disabled={!episode}
						onClick={toggleLoop}
						className={isLooping ? styles.isActive : ''}>
						<img src='/repeat.svg' alt='Repetir'></img>
					</button>
				</div>
			</footer>
		</div >
	);
}