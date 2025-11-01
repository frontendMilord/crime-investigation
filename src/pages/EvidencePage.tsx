import { Beaker, Loader } from 'lucide-react'
import type { IEvidenceAnalyzedIn } from '../types'
import { useState } from 'react'
import { useCaseStore } from '../store/case'
import Navigation from '../components/Navigation'
import Header from '../components/Header'

const EvidencePage = () => {
	const { currentCase, setCases, cases, collectedEvidence } = useCaseStore(
		(state) => state
	)
	const [evidenceResultsAnalyzedIn, setEvidenceResultsAnalyzedIn] = useState<
		IEvidenceAnalyzedIn[]
	>([])

	const analyzeEvidence = (evidenceId: string) => {
		if (!currentCase) return

		const updatedEvidence = currentCase.evidence.map((e) =>
			e.id === evidenceId ? { ...e, analyzed: true } : e
		)

		const updatedCase = { ...currentCase, evidence: updatedEvidence }
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	}

	if (!currentCase) return null

	return (
		<div className='flex-1 w-full h-full flex flex-col bg-gray-900 text-gray-100'>
			<Header />
			<Navigation />
			<div className='flex-1 w-full flex flex-col justify-start max-w-7xl mx-auto p-8'>
				<h2 className='text-2xl font-bold mb-6'>Evidence Locker</h2>
				{!collectedEvidence.length ? (
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
										className='bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-all flex items-center gap-2 cursor-pointer'
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

								{!!evidenceResultsAnalyzedIn.length &&
									evidenceResultsAnalyzedIn.find(
										(e) => e.id === evidence.id
									) && (
										<div className='bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-all flex items-center gap-2'>
											<Loader className='w-4 h-4 animate-spin' />
											Analyzing in Lab
										</div>
									)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default EvidencePage
