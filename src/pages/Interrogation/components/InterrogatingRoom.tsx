import { AlertTriangle, X } from 'lucide-react'
import type { IDialogueTree, IPerson } from '../../../types'
import { useEffect, useState } from 'react'
import { useCaseStore } from '../../../store/case'
import { toast } from 'react-toastify'

interface IInterrogatingRoomProps {
	selectedPerson: IPerson
	closeInterrogation: () => void
}

const InterrogatingRoom = ({
	closeInterrogation,
	selectedPerson,
}: IInterrogatingRoomProps) => {
	const { currentCase, setCases, setCurrentCase, cases } = useCaseStore()
	const [askedTrees, setAskedTrees] = useState<IDialogueTree[]>([])
	const [availableTrees, setAvailableTrees] = useState<IDialogueTree[]>([])
	const [contradictionMode, setContradictionMode] = useState(false)
	const [selectedResponses, setSelectedResponses] = useState<string[]>([])

	const toggleContradictionMode = () => {
		setContradictionMode(!contradictionMode)
		setSelectedResponses([])
	}

	const selectResponse = (responseId: string) => {
		if (selectedResponses.includes(responseId)) {
			setSelectedResponses(selectedResponses.filter((r) => r !== responseId))
		} else if (selectedResponses.length < 2) {
			setSelectedResponses([...selectedResponses, responseId])
		}
	}

	const checkContradiction = () => {
		if (!currentCase || !selectedPerson || selectedResponses.length !== 2)
			return

		const person = currentCase.people.find((p) => p.id === selectedPerson.id)
		if (!person) return

		const contradiction = person.contradictions.find(
			(c) =>
				(c.response1 === selectedResponses[0] &&
					c.response2 === selectedResponses[1]) ||
				(c.response1 === selectedResponses[1] &&
					c.response2 === selectedResponses[0])
		)

		if (contradiction) {
			const updatedPeople = currentCase.people.map((p) => {
				if (p.id === selectedPerson.id) {
					const updatedContradictions = p.contradictions.map((contr) =>
						contr.id === contradiction.id ? { ...contr, caught: true } : contr
					)
					return { ...p, contradictions: updatedContradictions }
				}
				return p
			})

			const updatedCase = { ...currentCase, people: updatedPeople }
			setCurrentCase(updatedCase)
			setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))

			toast.success(`Contradiction found! ${contradiction.description}`, {
				autoClose: 10000,
			})
		} else {
			toast('No contradiction found between these statements.')
		}

		setSelectedResponses([])
	}

	const askQuestion = (personId: string, treeId: string) => {
		if (!currentCase) return

		const updatedPeople = currentCase.people.map((p) => {
			if (p.id === personId) {
				const updatedTrees = p.dialogueTrees.map((tree) =>
					tree.id === treeId ? { ...tree, asked: true } : tree
				)
				return {
					...p,
					interviewed: true,
					dialogueTrees: updatedTrees,
				}
			}
			return p
		})
		const updatedCase = { ...currentCase, people: updatedPeople }
		setCurrentCase(updatedCase)
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	}

	useEffect(() => {
		if (!selectedPerson) return
		const askedTrees = selectedPerson.dialogueTrees.filter((t) => t.asked)
		setAskedTrees(askedTrees)
	}, [selectedPerson])

	useEffect(() => {
		if (!selectedPerson) return
		const availableTrees = selectedPerson.dialogueTrees.filter((tree) => {
			if (tree.asked) return false

			if (tree.requiresEvidence) {
				const evidence = currentCase?.evidence.find(
					(e) => e.id === tree.requiresEvidence
				)
				if (!evidence?.analyzed) return false
			}

			if (tree.requiresPerson && tree.requiresResponse) {
				const requiredPerson = currentCase?.people.find(
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
	}, [selectedPerson, currentCase])

	return (
		<div>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h2 className='text-2xl font-bold'>
						Interrogating: {selectedPerson.name}
					</h2>
					<p className='text-gray-400'>
						{selectedPerson.type === 'suspect' ? 'Suspect' : 'Witness'} |{' '}
						{selectedPerson.occupation}
					</p>
				</div>
				<div className='flex gap-3'>
					{!!selectedPerson.contradictions.length && (
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
				<p className='text-gray-300 italic'>
					"{selectedPerson.initialStatement}"
				</p>
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

			{!!askedTrees.length && (
				<div className='mb-8'>
					<h3 className='text-xl font-semibold mb-4'>Previous Responses:</h3>
					<div className='space-y-4'>
						{askedTrees.map((tree) => (
							<div
								key={tree.id}
								className='bg-gray-800 p-4 rounded border border-green-500'
							>
								<p className='font-semibold mb-2'>You: {tree.question}</p>
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
						No more questions available at this time. Collect more evidence or
						interrogate other people.
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
									onClick={() => askQuestion(selectedPerson.id, tree.id)}
									className='bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm transition-all'
								>
									Ask Question
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{selectedPerson.contradictions.some((c) => c.caught) && (
				<div className='mt-8 bg-green-900/20 border border-green-500 p-6 rounded'>
					<h3 className='font-semibold mb-3 text-green-400'>
						Contradictions Caught:
					</h3>
					{selectedPerson.contradictions
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
	)
}

export default InterrogatingRoom
