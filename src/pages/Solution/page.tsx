import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCaseStore } from '../../store/case'
import type { IPerson } from '../../types'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import { ROUTES_PATHS } from '../../consts/routes'
import { useCaseTimerStore } from '../../store/caseTimer'

const SolutionPage = () => {
	const { currentCase } = useCaseStore((state) => state)
	const { stopTimer } = useCaseTimerStore()
	const [suspects, setSuspects] = useState<IPerson[]>([])
	const [solutionSubmitted, setSolutionSubmitted] = useState(false)
	const [solutionCorrect, setSolutionCorrect] = useState(false)
	const navigate = useNavigate()

	const onWrongAnswer = () => {
		setSolutionSubmitted(false)
	}

	const submitSolution = (culpritId: string) => {
		if (!currentCase) return

		const correct = culpritId === currentCase.solution.culprit
		setSolutionCorrect(correct)
		setSolutionSubmitted(true)
		stopTimer()
	}

	useEffect(() => {
		setSuspects(
			currentCase?.people.filter((person) => person.type === 'suspect') || []
		)
	}, [currentCase])

	if (!currentCase) return null

	return (
		<div className='flex-1 w-full h-full flex flex-col bg-gray-900 text-gray-100'>
			<Header />
			<Navigation />
			<div className='flex-1 w-full flex flex-col justify-start max-w-7xl mx-auto p-8'>
				<h2 className='text-2xl font-bold mb-6'>Submit Your Solution</h2>

				{!solutionSubmitted ? (
					<div className='bg-gray-800 p-6 rounded border border-gray-700'>
						<h3 className='text-xl font-semibold mb-4'>Who is the culprit?</h3>
						<p className='text-gray-400 mb-6'>
							Review all evidence and select the perpetrator.
						</p>

						<div className='space-y-3'>
							{suspects.map((suspect) => (
								<button
									key={suspect.id}
									onClick={() => submitSolution(suspect.id)}
									className='w-full bg-gray-700 hover:bg-gray-600 p-4 rounded text-left transition-all border border-gray-600 hover:border-red-500'
								>
									<p className='font-semibold'>{suspect.name}</p>
									<p className='text-sm text-gray-400'>
										{suspect.occupation} | {suspect.relationship}
									</p>
								</button>
							))}
						</div>
					</div>
				) : (
					<div
						className={`p-6 rounded border ${
							solutionCorrect
								? 'bg-green-900/20 border-green-500'
								: 'bg-red-900/20 border-red-500'
						}`}
					>
						<h3
							className={`text-2xl font-bold mb-4 ${
								solutionCorrect ? 'text-green-500' : 'text-red-500'
							}`}
						>
							{solutionCorrect ? '✓ CASE CLOSED' : '✗ INCORRECT SOLUTION'}
						</h3>

						{solutionCorrect ? (
							<div>
								<p className='text-gray-300 mb-4'>
									Congratulations! You've successfully solved the case.
								</p>
								<div className='bg-gray-800 p-4 rounded mb-4'>
									<h4 className='font-semibold mb-2'>Case Summary:</h4>
									<p className='text-sm text-gray-300 mb-2'>
										<strong>Culprit:</strong>{' '}
										{
											currentCase.people.find(
												(p) => p.id === currentCase.solution.culprit
											)?.name
										}
									</p>
									<p className='text-sm text-gray-300 mb-2'>
										<strong>Motive:</strong> {currentCase.solution.motive}
									</p>
									<p className='text-sm text-gray-300'>
										<strong>Method:</strong> {currentCase.solution.method}
									</p>
								</div>
								<button
									onClick={() => navigate(ROUTES_PATHS.BASE)}
									className='bg-green-600 hover:bg-green-700 px-6 py-3 rounded transition-all'
								>
									Return to Case Files
								</button>
							</div>
						) : (
							<div>
								<p className='text-gray-300 mb-4'>
									Your solution was incorrect. Review the evidence and try
									again.
								</p>
								<button
									onClick={onWrongAnswer}
									className='bg-red-600 hover:bg-red-700 px-6 py-3 rounded transition-all'
								>
									Try Again
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default SolutionPage
