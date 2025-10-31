import { Newspaper } from 'lucide-react'
import type { IBreakingNews } from '../types'

interface INewsProps {
	revealedNews: IBreakingNews[]
}

const News = ({ revealedNews }: INewsProps) => {
	return (
		<div>
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
	)
}

export default News
