import type { ICase, IEvidence, IPerson } from '../types'

interface IBoardProps {
	currentCase: ICase
	collectedEvidence: IEvidence[]
	analyzedEvidence: IEvidence[]
	availablePeople: IPerson[]
}
const Board = ({
	analyzedEvidence,
	availablePeople,
	collectedEvidence,
	currentCase,
}: IBoardProps) => {
	return (
		<div>
			<h2 className='text-2xl font-bold mb-6'>Case Board</h2>
			<div className='bg-gray-800 p-6 rounded border border-gray-700'>
				<h3 className='text-xl font-semibold mb-4'>Investigation Summary</h3>

				<div className='grid md:grid-cols-3 gap-6 mb-6'>
					<div>
						<h4 className='font-semibold text-green-500 mb-2'>
							Evidence Collected
						</h4>
						<p className='text-3xl font-bold'>
							{collectedEvidence.length}/{currentCase.evidence.length}
						</p>
					</div>
					<div>
						<h4 className='font-semibold text-purple-500 mb-2'>
							Evidence Analyzed
						</h4>
						<p className='text-3xl font-bold'>
							{analyzedEvidence.length}/{collectedEvidence.length}
						</p>
					</div>
					<div>
						<h4 className='font-semibold text-orange-500 mb-2'>
							People Interviewed
						</h4>
						<p className='text-3xl font-bold'>
							{currentCase.people.filter((p) => p.interviewed).length}/
							{availablePeople.length}
						</p>
					</div>
				</div>

				{!analyzedEvidence.length ? (
					<div className='font-semibold mb-2'>No Key Findings found yet</div>
				) : (
					<div className='space-y-4 mb-6'>
						<h4 className='font-semibold mb-2'>Key Findings:</h4>
						{analyzedEvidence.map((ev) => (
							<div
								key={ev.id}
								className='bg-gray-700 p-3 rounded'
							>
								<p className='font-semibold text-sm text-purple-400'>
									{ev.name}
								</p>
								<p className='text-xs text-gray-300'>{ev.analysisResult}</p>
							</div>
						))}
					</div>
				)}

				{!currentCase.people.some(
					(person) => person.contradictions.filter((c) => c.caught).length
				) ? (
					<div className='font-semibold mb-2'>No Contradictions found yet</div>
				) : (
					<div className='space-y-4'>
						<h4 className='font-semibold mb-2'>Contradictions found:</h4>
						{currentCase.people.map((person) =>
							person.contradictions
								.filter((c) => c.caught)
								.map((contr) => (
									<div
										key={`${person.id}-${contr.id}`}
										className='bg-gray-700 p-3 rounded border-l-4 border-red-500'
									>
										<p className='font-semibold text-sm text-red-400'>
											{person.name}
										</p>
										<p className='text-xs text-gray-300'>{contr.description}</p>
									</div>
								))
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default Board
