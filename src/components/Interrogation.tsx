import { AlertTriangle, X } from 'lucide-react'
import type { ICase, IDialogueTree, IPerson } from '../types'
import { useEffect, useState } from 'react'

interface IInterrogationProps {
	interrogationMode: boolean
	suspects: IPerson[]
	witnesses: IPerson[]
	startInterrogation: (personId: string) => void
	selectedPerson: string | null
	currentCase: ICase
	toggleContradictionMode: () => void
	contradictionMode: boolean
	closeInterrogation: () => void
	selectedResponses: string[]
	checkContradiction: () => void
	selectResponse: (responseId: string) => void
	askQuestion: (personId: string, treeId: string) => void
}

const Interrogation = ({
	interrogationMode,
	startInterrogation,
	suspects,
	witnesses,
	currentCase,
	selectedPerson,
	toggleContradictionMode,
	contradictionMode,
	closeInterrogation,
	selectedResponses,
	checkContradiction,
	selectResponse,
	askQuestion,
}: IInterrogationProps) => {
	const [person, setPerson] = useState<IPerson | null>(null)
	const [askedTrees, setAskedTrees] = useState<IDialogueTree[]>([])
	const [availableTrees, setAvailableTrees] = useState<IDialogueTree[]>([])

	useEffect(() => {
		const person = currentCase.people.find((p) => p.id === selectedPerson)
		if (person) {
			setPerson(person)
		}
	}, [currentCase, selectedPerson])

	useEffect(() => {
		if (!person) return
		const askedTrees = person.dialogueTrees.filter((t) => t.asked)
		setAskedTrees(askedTrees)
	}, [person])

	useEffect(() => {
		if (!person) return
		const availableTrees = person.dialogueTrees.filter((tree) => {
			if (tree.asked) return false

			if (tree.requiresEvidence) {
				const evidence = currentCase.evidence.find(
					(e) => e.id === tree.requiresEvidence
				)
				if (!evidence?.analyzed) return false
			}

			if (tree.requiresPerson && tree.requiresResponse) {
				const requiredPerson = currentCase.people.find(
					(p) => p.id === tree.requiresPerson
				)
				const requiredTree = requiredPerson?.dialogueTrees.find((t) =>
					t.responses.some((r) => `${t.id}-${r.id}` === tree.requiresResponse)
				)
				if (!requiredTree?.asked) return false
			}

			return true
		})
		setAvailableTrees(availableTrees)
	}, [person, currentCase])

	return (
		<>
			{!interrogationMode && (
				<div>
					<h2 className='text-2xl font-bold mb-6'>Interrogation Room</h2>

					{suspects.length > 0 && (
						<div className='mb-8'>
							<h3 className='text-xl font-semibold mb-4 text-red-400'>
								Suspects
							</h3>
							<div className='space-y-4'>
								{suspects.map((person) => (
									<div
										key={person.id}
										className={`bg-gray-800 p-6 rounded border ${
											person.interviewed
												? 'border-orange-500'
												: 'border-gray-700'
										}`}
									>
										<div className='flex justify-between items-start mb-3'>
											<div>
												<h4 className='text-xl font-semibold'>{person.name}</h4>
												<p className='text-sm text-gray-400'>
													{person.age} years old | {person.occupation}
												</p>
												<p className='text-xs text-gray-500'>
													{person.relationship}
												</p>
											</div>
											{person.interviewed && (
												<span className='text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded'>
													INTERVIEWED
												</span>
											)}
										</div>
										<p className='text-sm text-gray-300 italic mb-4'>
											"{person.initialStatement}"
										</p>
										<button
											onClick={() => startInterrogation(person.id)}
											className='bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded transition-all'
										>
											{person.interviewed
												? 'Continue Interrogation'
												: 'Begin Interrogation'}
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{witnesses.length > 0 && (
						<div>
							<h3 className='text-xl font-semibold mb-4 text-blue-400'>
								Witnesses
							</h3>
							<div className='space-y-4'>
								{witnesses.map((person) => (
									<div
										key={person.id}
										className={`bg-gray-800 p-6 rounded border ${
											person.interviewed ? 'border-blue-500' : 'border-gray-700'
										}`}
									>
										<div className='flex justify-between items-start mb-3'>
											<div>
												<h4 className='text-xl font-semibold'>{person.name}</h4>
												<p className='text-sm text-gray-400'>
													{person.occupation}
												</p>
												<p className='text-xs text-gray-500'>
													{person.relationship}
												</p>
											</div>
											{person.interviewed && (
												<span className='text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded'>
													INTERVIEWED
												</span>
											)}
										</div>
										<p className='text-sm text-gray-300 italic mb-4'>
											"{person.initialStatement}"
										</p>
										<button
											onClick={() => startInterrogation(person.id)}
											className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-all'
										>
											{person.interviewed
												? 'Continue Interview'
												: 'Interview Witness'}
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{interrogationMode && selectedPerson && person && (
				<div>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h2 className='text-2xl font-bold'>
								Interrogating: {person.name}
							</h2>
							<p className='text-gray-400'>
								{person.type === 'suspect' ? 'Suspect' : 'Witness'} |{' '}
								{person.occupation}
							</p>
						</div>
						<div className='flex gap-3'>
							{!!person.contradictions.length && (
								<button
									onClick={toggleContradictionMode}
									className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${
										contradictionMode
											? 'bg-red-600 hover:bg-red-700'
											: 'bg-gray-700 hover:bg-gray-600'
									}`}
								>
									<AlertTriangle className='w-4 h-4' />
									{contradictionMode ? 'Cancel' : 'Find Contradictions'}
								</button>
							)}
							<button
								onClick={closeInterrogation}
								className='flex items-center gap-2 text-gray-400 hover:text-white'
							>
								<X className='w-5 h-5' />
								End
							</button>
						</div>
					</div>

					<div className='bg-gray-800 p-6 rounded border border-gray-700 mb-6'>
						<h3 className='font-semibold mb-2'>Initial Statement:</h3>
						<p className='text-gray-300 italic'>"{person.initialStatement}"</p>
					</div>

					{contradictionMode && (
						<div className='bg-red-900/20 border border-red-500 p-6 rounded mb-6'>
							<h3 className='font-semibold mb-3 text-red-400'>
								Contradiction Detection Mode
							</h3>
							<p className='text-sm text-gray-300 mb-4'>
								Select two responses that contradict each other. Selected:{' '}
								{selectedResponses.length}/2
							</p>
							{selectedResponses.length === 2 && (
								<button
									onClick={checkContradiction}
									className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded'
								>
									Check for Contradiction
								</button>
							)}
						</div>
					)}

					{askedTrees.length > 0 && (
						<div className='mb-8'>
							<h3 className='text-xl font-semibold mb-4'>
								Previous Responses:
							</h3>
							<div className='space-y-4'>
								{askedTrees.map((tree) => (
									<div
										key={tree.id}
										className='bg-gray-800 p-4 rounded border border-green-500'
									>
										<p className='font-semibold mb-2'>Q: {tree.question}</p>
										{tree.responses.map((response) => {
											const responseId = `${tree.id}-${response.id}`
											const isSelected = selectedResponses.includes(responseId)

											return (
												<div
													key={response.id}
													onClick={() =>
														contradictionMode && selectResponse(responseId)
													}
													className={`p-3 rounded mt-2 ${
														contradictionMode
															? isSelected
																? 'bg-red-700 cursor-pointer'
																: 'bg-gray-700 cursor-pointer hover:bg-gray-600'
															: 'bg-gray-700'
													}`}
												>
													<p className='text-sm text-gray-300 italic'>
														"{response.text}"
													</p>
													{response.revealsDetail && (
														<p className='text-xs text-yellow-400 mt-2'>
															💡 {response.revealsDetail}
														</p>
													)}
												</div>
											)
										})}
									</div>
								))}
							</div>
						</div>
					)}

					<div>
						<h3 className='text-xl font-semibold mb-4'>Available Questions:</h3>
						{availableTrees.length === 0 ? (
							<p className='text-gray-400'>
								No more questions available at this time. Collect more evidence
								or interrogate other people.
							</p>
						) : (
							<div className='space-y-4'>
								{availableTrees.map((tree) => (
									<div
										key={tree.id}
										className='bg-gray-800 p-4 rounded border border-gray-700'
									>
										<p className='font-semibold mb-3'>{tree.question}</p>
										<button
											onClick={() => askQuestion(person.id, tree.id)}
											className='bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm transition-all'
										>
											Ask Question
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{person.contradictions.some((c) => c.caught) && (
						<div className='mt-8 bg-green-900/20 border border-green-500 p-6 rounded'>
							<h3 className='font-semibold mb-3 text-green-400'>
								Contradictions Caught:
							</h3>
							{person.contradictions
								.filter((c) => c.caught)
								.map((contr) => (
									<div
										key={contr.id}
										className='bg-gray-800 p-3 rounded mb-2'
									>
										<p className='text-sm text-gray-300'>{contr.description}</p>
									</div>
								))}
						</div>
					)}
				</div>
			)}
		</>
	)
}

export default Interrogation
