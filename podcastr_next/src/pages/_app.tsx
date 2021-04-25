import { Header } from '../components/Header'
import { Player } from '../components/Player'

import '../styles/global.scss'
import styles from '../styles/app.module.scss'
import { PlayerContext } from '../contexts/playerContext'
import { useState } from 'react'
import { PlayerContextProvider } from '../contexts/playerContext'

function MyApp({ Component, pageProps }) {

	return (
		<PlayerContextProvider>
			<div className={styles.wrapper}>
				<main>
					<Header></Header>
					<Component {...pageProps} />
				</main>
				<Player></Player>
			</div>
		</PlayerContextProvider>
	)
}

export default MyApp
