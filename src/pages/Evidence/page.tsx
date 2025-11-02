import { Beaker, Loader } from 'lucide-react'
import { useCaseStore } from '../../store/case'
import { useEvidenceStore } from '../../store/evidence'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import { formatTime } from '../../utils'

const EvidencePage = () => {
	const { currentCase, setCases, cases, setCurrentCase } = useCaseStore(
		(state) => state
	)
	const {
		availableEvidence,
		sendEvidenceToLab,
		getEvidenceStatus,
		getRemainingTime,
		totalTimeLeft,
		current,
	} = useEvidenceStore()

	const analyzeEvidence = (evidenceId: string) => {
		if (!currentCase) return

		// const updatedEvidence = currentCase.evidence.map((e) =>
		// 	e.id === evidenceId ? { ...e, analyzed: true } : e
		// )

		sendEvidenceToLab(evidenceId)

		// const updatedCase = { ...currentCase, evidence: updatedEvidence }
		// setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
		// setCurrentCase(updatedCase)
	}

	if (!currentCase) return null

	return (
		<div className='flex-1 w-full h-full flex flex-col bg-gray-900 text-gray-100'>
			<Header />
			<Navigation />
			<div className='flex-1 w-full flex flex-col justify-start max-w-7xl mx-auto p-8'>
				<div className='flex gap-x-3 justify-between items-center mb-6'>
					<h2 className='text-2xl font-bold'>Evidence Locker</h2>
					{!!totalTimeLeft && (
						<div className='text-lg font-medium'>
							Total time to process: {formatTime(totalTimeLeft)}
						</div>
					)}
				</div>
				{!availableEvidence.length ? (
					<p className='text-gray-400'>
						No evidence collected yet. Visit the crime scene.
					</p>
				) : (
					<div className='grid md:grid-cols-2 gap-6'>
						{availableEvidence
							.filter((evidence) => evidence.collected)
							.map((evidence) => {
								const status = getEvidenceStatus(evidence.id)
								const time = getRemainingTime(evidence.id)
								return (
									<div
										key={evidence.id}
										className={`bg-gray-800 p-6 flex flex-col rounded border ${
											evidence.analyzed
												? 'border-purple-500'
												: 'border-gray-700'
										}`}
									>
										<div className='flex-1'>
											<div className='flex justify-between items-start mb-3'>
												<h3 className='text-xl font-semibold'>
													{evidence.name}
												</h3>
												{evidence.analyzed && (
													<span className='text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded flex items-center gap-1'>
														<Beaker className='w-3 h-3' />
														ANALYZED
													</span>
												)}
												{status === 'pending' && !!time && (
													<div className='text-purple-500 bg-purple-500/10 px-2 py-1 rounded'>
														{formatTime(time)}
													</div>
												)}
											</div>
											<p className='text-sm text-gray-400 mb-2'>
												Found at:{' '}
												{currentCase.scene.find(
													(s) => s.id === evidence.location
												)?.name || evidence.location}
											</p>
											<p className='text-gray-300 mb-4'>
												{evidence.description}
											</p>
										</div>
										{status === 'available' && !evidence.analyzed && (
											<button
												onClick={() => analyzeEvidence(evidence.id)}
												className='w-fit bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-all flex items-center gap-2 cursor-pointer'
											>
												<Beaker className='w-4 h-4' />
												Analyze in Lab ({formatTime(evidence.timeToProcess)})
											</button>
										)}
										{status === 'analyzed' && evidence.analyzed && (
											<div className='bg-gray-700 p-4 rounded mt-4'>
												<h4 className='font-semibold mb-2 text-purple-400'>
													Lab Analysis:
												</h4>
												<p className='text-sm text-gray-300'>
													{evidence.analysisResult}
												</p>
											</div>
										)}

										{status === 'pending' && !!time && (
											<div
												className={`${
													current?.id === evidence.id
														? 'bg-yellow-600 '
														: 'bg-purple-600/20'
												} px-4 py-2 rounded text-sm transition-all flex items-center gap-2`}
											>
												<Loader className='w-4 h-4 animate-spin' />
												<div>
													{current?.id === evidence.id
														? 'Analyzing in Lab...'
														: 'Waiting in line...'}
												</div>
											</div>
										)}
									</div>
								)
							})}
					</div>
				)}
			</div>
		</div>
	)
}

export default EvidencePage
