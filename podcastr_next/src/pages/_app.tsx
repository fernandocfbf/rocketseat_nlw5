import { Header } from '../components/Header'
import { Player } from '../components/Player'

import '../styles/global.scss'
import styles from '../styles/app.module.scss'
import { PlayerContext } from '../contexts/playerContext'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

	const [episodeList, setEpisodeList] = useState([])
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)

	function togglePlay() {
		setIsPlaying(!isPlaying)
	}

	function play(episode) {
		setEpisodeList([episode])
		setCurrentEpisodeIndex(0)
		setIsPlaying(true)
	}

	return (
		<PlayerContext.Provider value={{
			episodeList,
			currentEpisodeIndex,
			play,
			togglePlay,
			isPlaying
		}}>
			<div className={styles.wrapper}>
				<main>
					<Header></Header>
					<Component {...pageProps} />
				</main>
				<Player></Player>
			</div>
		</PlayerContext.Provider>
	)
}

export default MyApp
