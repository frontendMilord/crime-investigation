import { Beaker } from 'lucide-react'
import type { ICase, IEvidence } from '../types'

interface IEvidenceProps {
	collectedEvidence: IEvidence[]
	analyzeEvidence: (evidenceId: string) => void
	currentCase: ICase
}

const Evidence = ({
	analyzeEvidence,
	collectedEvidence,
	currentCase,
}: IEvidenceProps) => {
	return (
		<div>
			<h2 className='text-2xl font-bold mb-6'>Evidence Locker</h2>
			{collectedEvidence.length === 0 ? (
				<p className='text-gray-400'>
					No evidence collected yet. Visit the crime scene.
				</p>
			) : (
				<div className='grid md:grid-cols-2 gap-6'>
					{collectedEvidence.map((evidence) => (
						<div
							key={evidence.id}
							className={`bg-gray-800 p-6 rounded border ${
								evidence.analyzed ? 'border-purple-500' : 'border-gray-700'
							}`}
						>
							<div className='flex justify-between items-start mb-3'>
								<h3 className='text-xl font-semibold'>{evidence.name}</h3>
								{evidence.analyzed && (
									<span className='text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded flex items-center gap-1'>
										<Beaker className='w-3 h-3' />
										ANALYZED
									</span>
								)}
							</div>
							<p className='text-sm text-gray-400 mb-2'>
								Found at:{' '}
								{currentCase.scene.find((s) => s.id === evidence.location)
									?.name || evidence.location}
							</p>
							<p className='text-gray-300 mb-4'>{evidence.description}</p>

							{!evidence.analyzed ? (
								<button
									onClick={() => analyzeEvidence(evidence.id)}
									className='bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-all flex items-center gap-2'
								>
									<Beaker className='w-4 h-4' />
									Analyze in Lab
								</button>
							) : (
								<div className='bg-gray-700 p-4 rounded mt-4'>
									<h4 className='font-semibold mb-2 text-purple-400'>
										Lab Analysis:
									</h4>
									<p className='text-sm text-gray-300'>
										{evidence.analysisResult}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Evidence
