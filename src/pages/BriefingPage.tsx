import { Clock, Home } from 'lucide-react'
import { formatTime } from '../utils'
import { useCaseStore } from '../store/case'
import { ROUTES_PATHS } from '../consts/routes'
import { useNavigate } from 'react-router-dom'
import { useCaseTimerStore } from '../store/caseTimer'

const BriefingPage = () => {
	const { currentCase } = useCaseStore((state) => state)
	const { startTimer } = useCaseTimerStore()
	const navigate = useNavigate()

	const beginInvestigation = () => {
		if (currentCase?.breakingNews) {
			startTimer()
		}
		navigate(ROUTES_PATHS.SCENE)
	}

	if (!currentCase) return null

	return (
		<div className='h-full min-h-screen bg-gray-900 text-gray-100 p-8'>
			<div className='max-w-3xl mx-auto'>
				<div className='mb-6'>
					<button
						onClick={() => navigate(ROUTES_PATHS.BASE)}
						className='text-gray-400 hover:text-white flex items-center gap-2'
					>
						<Home className='w-4 h-4' />
						Back to Cases
					</button>
				</div>

				<h1 className='text-3xl font-bold mb-2 text-red-500'>
					{currentCase.title}
				</h1>
				<p className='text-gray-400 mb-6'>Case Type: {currentCase.type}</p>

				<div className='bg-gray-800 p-6 rounded border border-gray-700 mb-6'>
					<h2 className='text-xl font-semibold mb-3'>Initial Briefing</h2>
					<p className='text-gray-300 leading-relaxed'>
						{currentCase.briefing}
					</p>
				</div>

				{!!currentCase.timeLimit && (
					<div className='bg-yellow-900/20 border border-yellow-500/50 p-4 rounded mb-6'>
						<div className='flex items-center gap-2 text-yellow-500'>
							<Clock className='w-5 h-5' />
							<span className='font-semibold'>
								Time Limit: {formatTime(currentCase.timeLimit)}
							</span>
						</div>
					</div>
				)}

				<button
					onClick={beginInvestigation}
					className='bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold transition-all'
				>
					Begin Investigation
				</button>
			</div>
		</div>
	)
}

export default BriefingPage
