import { useState } from 'react'
import { useCaseStore } from '../../store/case'
import { useEvidenceStore } from '../../store/evidence'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import TextDecodingGame from '../../components/TextDecodingGame'
import { toast } from 'react-toastify'

const ScenePage = () => {
	const { currentCase, setCases, cases, setCurrentCase } = useCaseStore(
		(state) => state
	)
	const { availableEvidence } = useEvidenceStore()
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

	const collectEvidence = (evidenceId: string) => {
		if (!currentCase) return

		const updatedEvidence = currentCase.evidence.map((e) =>
			e.id === evidenceId ? { ...e, collected: true } : e
		)

		const updatedCase = { ...currentCase, evidence: updatedEvidence }
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
		setCurrentCase(updatedCase)
	}

	const examineLocation = (locationId: string) => {
		if (!currentCase) return

		setSelectedLocation(locationId)
		if (
			currentCase.scene.find((location) => location.id === locationId)?.examined
		)
			return

		const updatedScene = currentCase.scene.map((loc) =>
			loc.id === locationId ? { ...loc, examined: true } : loc
		)

		const updatedCase = { ...currentCase, scene: updatedScene }
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
		setCurrentCase(updatedCase)
	}

	if (!currentCase) return null

	return (
		<div className='flex-1 w-full h-full flex flex-col bg-gray-900 text-gray-100'>
			<Header />
			<Navigation />
			<div className='flex-1 w-full flex flex-col justify-start max-w-7xl mx-auto p-8'>
				<TextDecodingGame
					// solution='Meet garden'
					// solution='eeMee'
					solution='Meet me in the garden'
					// solution='Meet'
					onSolved={() => toast.success('You did it!')}
				/>
				<h2 className='text-2xl font-bold mb-6'>Crime Scene Locations</h2>
				<div className='grid md:grid-cols-2 gap-6'>
					{currentCase.scene.map((location) => (
						<div
							key={location.id}
							className={`bg-gray-800 p-6 rounded border ${
								location.examined ? 'border-green-500' : 'border-gray-700'
							}`}
						>
							<div className='flex justify-between items-start mb-3'>
								<h3 className='text-xl font-semibold'>{location.name}</h3>
								{location.examined && (
									<span className='text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded'>
										EXAMINED
									</span>
								)}
							</div>
							<p className='text-gray-300 mb-4'>{location.description}</p>
							{(!location.examined ||
								(selectedLocation !== location.id && location.examined)) && (
								<button
									onClick={() => examineLocation(location.id)}
									className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-all'
								>
									{!location.examined ? 'Examine Location' : 'Re-examine'}
								</button>
							)}

							{selectedLocation === location.id && (
								<div className='mt-4 pt-4 border-t border-gray-700'>
									<h4 className='font-semibold mb-2'>Available Evidence:</h4>
									<div className='space-y-2'>
										{location.evidenceIds.map((evId) => {
											const evidence = availableEvidence.find(
												(e) => e.id === evId
											)
											if (!evidence) return null
											return (
												<div
													key={evId}
													className='bg-gray-700 p-3 rounded flex justify-between items-center gap-x-2'
												>
													<div>
														<p className='font-semibold text-sm'>
															{evidence.name}
														</p>
														<p className='text-xs text-gray-400'>
															{evidence.description}
														</p>
														{evidence.unlockedBy && (
															<p className='text-xs text-yellow-500 mt-1'>
																🔓 Newly discovered!
															</p>
														)}
													</div>
													{!evidence.collected ? (
														<button
															onClick={() => collectEvidence(evId)}
															className='bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs'
														>
															Collect
														</button>
													) : (
														<span className='shrink-0 text-xs text-green-500'>
															✓ Collected
														</span>
													)}
												</div>
											)
										})}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ScenePage
