import type { IPerson } from '../../types'
import { useEffect, useState } from 'react'
import { useCaseStore } from '../../store/case'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import AvailablePeople from './components/AvailablePeople'
import InterrogatingRoom from './components/InterrogatingRoom'

const InterrogationPage = () => {
	const { availablePeople } = useCaseStore((state) => state)
	const [selectedPerson, setSelectedPerson] = useState<IPerson | null>(null)
	const [interrogationMode, setInterrogationMode] = useState(false)

	const startInterrogation = (personId: string) => {
		const person = availablePeople.find((p) => p.id === personId)
		if (!person) return
		setSelectedPerson(person)
		setInterrogationMode(true)
		// setContradictionMode(false)
		// setSelectedResponses([])
	}

	const closeInterrogation = () => {
		setInterrogationMode(false)
		setSelectedPerson(null)
		// setContradictionMode(false)
		// setSelectedResponses([])
	}

	// const toggleContradictionMode = () => {
	// 	setContradictionMode(!contradictionMode)
	// 	setSelectedResponses([])
	// }

	// const selectResponse = (responseId: string) => {
	// 	if (selectedResponses.includes(responseId)) {
	// 		setSelectedResponses(selectedResponses.filter((r) => r !== responseId))
	// 	} else if (selectedResponses.length < 2) {
	// 		setSelectedResponses([...selectedResponses, responseId])
	// 	}
	// }

	// const checkContradiction = () => {
	// 	if (!currentCase || !selectedPerson || selectedResponses.length !== 2)
	// 		return

	// 	const person = currentCase.people.find((p) => p.id === selectedPerson.id)
	// 	if (!person) return

	// 	const contradiction = person.contradictions.find(
	// 		(c) =>
	// 			(c.response1 === selectedResponses[0] &&
	// 				c.response2 === selectedResponses[1]) ||
	// 			(c.response1 === selectedResponses[1] &&
	// 				c.response2 === selectedResponses[0])
	// 	)

	// 	if (contradiction) {
	// 		const updatedPeople = currentCase.people.map((p) => {
	// 			if (p.id === selectedPerson.id) {
	// 				const updatedContradictions = p.contradictions.map((contr) =>
	// 					contr.id === contradiction.id ? { ...contr, caught: true } : contr
	// 				)
	// 				return { ...p, contradictions: updatedContradictions }
	// 			}
	// 			return p
	// 		})

	// 		const updatedCase = { ...currentCase, people: updatedPeople }
	// 		setCurrentCase(updatedCase)
	// 		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))

	// 		toast.success(`Contradiction found! ${contradiction.description}`, {
	// 			autoClose: 10000,
	// 		})
	// 	} else {
	// 		toast('No contradiction found between these statements.')
	// 	}

	// 	setSelectedResponses([])
	// }

	// const askQuestion = (personId: string, treeId: string) => {
	// 	if (!currentCase) return

	// 	const updatedPeople = currentCase.people.map((p) => {
	// 		if (p.id === personId) {
	// 			const updatedTrees = p.dialogueTrees.map((tree) =>
	// 				tree.id === treeId ? { ...tree, asked: true } : tree
	// 			)
	// 			return {
	// 				...p,
	// 				interviewed: true,
	// 				dialogueTrees: updatedTrees,
	// 			}
	// 		}
	// 		return p
	// 	})
	// 	const updatedCase = { ...currentCase, people: updatedPeople }
	// 	setCurrentCase(updatedCase)
	// 	setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	// }

	// useEffect(() => {
	// 	if (!selectedPerson) return
	// 	const askedTrees = selectedPerson.dialogueTrees.filter((t) => t.asked)
	// 	setAskedTrees(askedTrees)
	// }, [selectedPerson])

	// useEffect(() => {
	// 	if (!selectedPerson) return
	// 	const availableTrees = selectedPerson.dialogueTrees.filter((tree) => {
	// 		if (tree.asked) return false

	// 		if (tree.requiresEvidence) {
	// 			const evidence = currentCase?.evidence.find(
	// 				(e) => e.id === tree.requiresEvidence
	// 			)
	// 			if (!evidence?.analyzed) return false
	// 		}

	// 		if (tree.requiresPerson && tree.requiresResponse) {
	// 			const requiredPerson = currentCase?.people.find(
	// 				(p) => p.id === tree.requiresPerson
	// 			)
	// 			const requiredTree = requiredPerson?.dialogueTrees.find((t) =>
	// 				t.responses.some((r) => `${t.id}-${r.id}` === tree.requiresResponse)
	// 			)
	// 			if (!requiredTree?.asked) return false
	// 		}

	// 		return true
	// 	})
	// 	setAvailableTrees(availableTrees)
	// }, [selectedPerson, currentCase])

	useEffect(() => {
		if (!selectedPerson) return
		const person = availablePeople.find((p) => p.id === selectedPerson.id)
		if (!person) return
		setSelectedPerson(person)
	}, [selectedPerson, availablePeople])

	return (
		<div className='flex-1 w-full h-full flex flex-col bg-gray-900 text-gray-100'>
			<Header />
			<Navigation />
			<div className='flex-1 w-full flex flex-col justify-start max-w-7xl mx-auto p-8'>
				{!interrogationMode && (
					<AvailablePeople startInterrogation={startInterrogation} />
				)}

				{interrogationMode && selectedPerson && (
					<InterrogatingRoom
						closeInterrogation={closeInterrogation}
						selectedPerson={selectedPerson}
					/>
				)}
			</div>
		</div>
	)
}

export default InterrogationPage
