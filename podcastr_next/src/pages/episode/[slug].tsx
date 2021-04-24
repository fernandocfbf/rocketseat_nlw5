import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import api from '../services/api'
import Link from 'next/link'
import styles from './episode.module.scss'


type Episode = {
	id: string,
	title: string,
	thumbnail: string,
	description: string,
	members: string,
	duration: string,
	durationAsString: string,
	url: string,
	publishedAt: string,
}


type EpisodeProps = {
	episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
	const router = useRouter();

	if(router.isFallback){
		<p>carregando...</p>
	}
	return (
		<div className={styles.episode}>
			<div className={styles.thumbnailContainer}>
				<Link href='/'>
					<button type='button'>
						<img src='/arrow-left.svg' alt='voltar'></img>
					</button>
				</Link>
				<Image
					width={700}
					height={160}
					src={episode.thumbnail}
					objectFit='cover'></Image>

				<button type='button'>
					<img src='/play.svg' alt='Tocar episódio'></img>
				</button>
			</div>

			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.publishedAt}</span>
				<span>{episode.durationAsString}</span>
			</header>

			<div
				className={styles.description}
				dangerouslySetInnerHTML={{ __html: episode.description }}>
			</div>
		</div>
	)
}

//necessário quanto tem o colchete
//retorna quais ep devem ser gerados estáticos
//no momento da build

//fallback: false - retorna 404 se acessou um ep nao gerado estaticamente
//fallback: true - se acessou um ep nao estatico, busca as info e salva uma pagina estatica (funciona do lado do client, precisa de um "carregando")
//fallback: 'blocking' - mesma coisa do true porém a pessoa só navega pra tela quando ela já esta carregada
export const getStaticPaths: GetStaticPaths = async () => {
	
	const { data } = await api.get('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

	//gera apenas os dois primeiros episodios estaticamente
	const paths = data.map(episode =>{
		return{
			params: {
				slug: episode.id
			}
		}
	})
	
	return {
		/*
		paths: [
			{
				params: {
					slug: 'a-importancia-da-contribuicao-em-open-source'
				},
			}
		],
		*/
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps: GetStaticProps = async (ctx) => {
	const { slug } = ctx.params
	const { data } = await api.get(`/episodes/${slug}`)
	const episode = {
		id: data.id,
		title: data.title,
		thumbnail: data.thumbnail,
		members: data.members,
		publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
		duration: Number(data.file.duration),
		durationAsString: convertDurationToTimeString((Number(data.file.duration))),
		description: data.description,
		url: data.file.url
	}

	return {
		props: {
			episode,
		},
		revalidate: 60 * 60 * 24 // 24hours
	}
}