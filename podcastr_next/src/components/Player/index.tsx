import { useContext } from 'react';
import { PlayerContext } from '../../contexts/playerContext';
import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { ObjectFlags } from 'typescript';

export function Player() {

	const { 
		episodeList,
		currentEpisodeIndex,
		isPlaying,
		togglePlay 
	} = useContext(PlayerContext)

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
					<span>00:00</span>
					<div className={styles.slider}>
						{episode ?
							(<Slider
								trackStyle={{ backgroundColor: '#04d361' }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								handleStyle={{ borderColor: '#04d361' }}
							></Slider>)
							: (
								<div className={styles.emptySlider}></div>
							)}
					</div>
					<span>00:00</span>
				</div>

				{episode && (
					<audio
						src={episode.url}
						autoPlay>
					</audio>
				)}

				<div className={styles.buttons}>
					<button type='button' disabled={!episode}>
						<img src='/shuffle.svg' alt='Embaralhar'></img>
					</button>

					<button type='button' disabled={!episode}>
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

					<button type='button' disabled={!episode}>
						<img src='/play-next.svg' alt='Tocar próximo'></img>
					</button>

					<button type='button' disabled={!episode}>
						<img src='/repeat.svg' alt='Repetir'></img>
					</button>
				</div>
			</footer>
		</div >
	);
}