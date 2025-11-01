import { Clock, Home, Newspaper } from 'lucide-react'
import type { IBreakingNews } from '../types'
import { formatTime } from '../utils'
import { useCaseStore } from '../store/case'
import { useNavigate } from 'react-router-dom'
import { ROUTES_PATHS } from '../consts/routes'
import { useEffect, useState } from 'react'
import { useEvidenceStore } from '../store/evidence'

const Header = () => {
	const {
		currentCase,
		isNewsReaded,
		setIsNewsReaded,
		timerActive,
		timeRemaining,
		setCurrentCase,
	} = useCaseStore((state) => state)
	const { setAvailableEvidence } = useEvidenceStore()
	const [revealedNews, setRevealedNews] = useState<IBreakingNews[]>([])

	const navigate = useNavigate()

	useEffect(() => {
		if (!currentCase) return
		setRevealedNews(currentCase.breakingNews?.filter((n) => n.revealed) || [])
	}, [currentCase])

	const onBreakingNewsClick = () => {
		setIsNewsReaded(true)
		navigate(ROUTES_PATHS.NEWS)
	}

	const onExitCaseClick = () => {
		localStorage.clear()
		setCurrentCase(null)
		setAvailableEvidence([])
		navigate(ROUTES_PATHS.BASE)
		window.location.reload()
	}

	if (!currentCase) return null

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
					{!isNewsReaded && revealedNews.length > 0 && (
						<div
							className='flex items-center gap-2 text-yellow-500 animate-pulse cursor-pointer'
							onClick={onBreakingNewsClick}
						>
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
						onClick={onExitCaseClick}
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
