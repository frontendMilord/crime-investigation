import { Clock, Home, Newspaper } from 'lucide-react'
import type { IBreakingNews, ICase, ViewType } from '../types'
import { formatTime } from '../utils'

interface IHeaderProps {
	timeRemaining: number | null
	timerActive: boolean
	revealedNews: IBreakingNews[]
	setView: (view: ViewType) => void
	currentCase: ICase
}

const Header = ({
	revealedNews,
	timeRemaining,
	timerActive,
	setView,
	currentCase,
}: IHeaderProps) => {
	return (
		<div className='bg-gray-800 border-b border-gray-700 p-4'>
			<div className='max-w-7xl mx-auto flex justify-between items-center'>
				<div>
					<h1 className='text-xl font-bold text-red-500'>
						{currentCase.title}
					</h1>
					<p className='text-sm text-gray-400'>Victim: {currentCase.victim}</p>
				</div>
				<div className='flex items-center gap-4'>
					{revealedNews.length > 0 && (
						<div className='flex items-center gap-2 text-yellow-500 animate-pulse'>
							<Newspaper className='w-5 h-5' />
							<span className='text-sm font-semibold'>
								{revealedNews.length} Breaking News
							</span>
						</div>
					)}
					{timerActive && timeRemaining !== null && (
						<div
							className={`flex items-center gap-2 ${
								timeRemaining < 300 ? 'text-red-500' : 'text-yellow-500'
							}`}
						>
							<Clock className='w-5 h-5' />
							<span className='font-mono text-lg'>
								{formatTime(timeRemaining)}
							</span>
						</div>
					)}
					<button
						onClick={() => setView('menu')}
						className='text-gray-400 hover:text-white flex items-center gap-2'
					>
						<Home className='w-4 h-4' />
						Exit Case
					</button>
				</div>
			</div>
		</div>
	)
}

export default Header
