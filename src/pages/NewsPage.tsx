import { Newspaper } from 'lucide-react'
import type { IBreakingNews } from '../types'
import { useCaseStore } from '../store/case'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Navigation from '../components/Navigation'

const NewsPage = () => {
	const { currentCase } = useCaseStore((state) => state)
	const [revealedNews, setRevealedNews] = useState<IBreakingNews[]>([])

	useEffect(() => {
		if (!currentCase) return
		setRevealedNews(currentCase.breakingNews?.filter((n) => n.revealed) || [])
	}, [currentCase])

	return (
		<div className='flex-1 w-full h-full flex flex-col bg-gray-900 text-gray-100'>
			<Header />
			<Navigation />
			<div className='flex-1 w-full flex flex-col justify-start max-w-7xl mx-auto p-8'>
				<h2 className='text-2xl font-bold mb-6'>Breaking News</h2>
				{revealedNews.length === 0 ? (
					<p className='text-gray-400'>
						No breaking news yet. Continue your investigation to uncover more
						information.
					</p>
				) : (
					<div className='space-y-6'>
						{revealedNews.map((news) => (
							<div
								key={news.id}
								className='bg-gray-800 p-6 rounded border border-yellow-500'
							>
								<div className='flex items-start gap-3 mb-4'>
									<Newspaper className='w-6 h-6 text-yellow-500 shrink-0 mt-1' />
									<div>
										<h3 className='text-xl font-bold text-yellow-500 mb-2'>
											{news.headline}
										</h3>
										<p className='text-gray-300'>{news.content}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default NewsPage
