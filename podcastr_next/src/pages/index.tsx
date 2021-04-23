import { useEffect } from 'react'

export default function Home(props) {

	/* SPA
	useEffect(() => {
		fetch('http://localhost:3333/episodes')
			.then(response => response.json())
			.then(data => console.log(data))
	})
	*/
	return (
		<h1>Index</h1>
	)
}

// SSG

export async function getStaticProps() {
	const response = await fetch('http://localhost:3333/episodes')
	const data = await response.json()

	return {
		props: {
			episodes: data,
		},
		revalidate: 60 * 60 * 8
	}
}


/* SSR
executa toda vez que alguém acessa o site

export async function getSeverSideProps(){
const response = await fetch('http://localhost:3333/episodes')
const data = await response.json()

return {
	props:{
		episodes: data,

	}
}
}
*/
