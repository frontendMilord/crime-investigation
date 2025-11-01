import { useEffect, useState } from 'react'
import type { ICase, ViewType } from './types'
import { defaultCases } from './consts/case'
import Navigation from './components/Navigation'
import Header from './components/Header'
import Scene from './components/Scene'
import Evidence from './components/Evidence'
import News from './components/News'
import Menu from './components/Menu'
import Briefing from './components/Briefing'
import Board from './components/Board'
import Solution from './components/Solution'
import Interrogation from './components/Interrogation'
import Phone from './components/Phone'
import { toast } from 'react-toastify'

function App() {
	const [cases, setCases] = useState<ICase[]>(defaultCases)
	const [currentCaseId, setCurrentCaseId] = useState<string | null>(null)
	const [currentCase, setCurrentCase] = useState<ICase | null>(null)
	const [view, setView] = useState<ViewType>('menu')
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
	const [timerActive, setTimerActive] = useState(false)
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
	const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
	const [interrogationMode, setInterrogationMode] = useState(false)
	const [contradictionMode, setContradictionMode] = useState(false)
	const [selectedResponses, setSelectedResponses] = useState<string[]>([])
	const [isNewsReaded, setIsNewsReaded] = useState(false)
	const [solutionSubmitted, setSolutionSubmitted] = useState(false)
	const [solutionCorrect, setSolutionCorrect] = useState(false)

	useEffect(() => {
		const currentCase = cases.find((c) => c.id === currentCaseId)
		if (currentCase) {
			setCurrentCase(currentCase)
		}
	}, [cases, currentCaseId])

	useEffect(() => {
		if (timerActive && timeRemaining !== null && timeRemaining > 0) {
			const interval = setInterval(() => {
				setTimeRemaining((prev) => (prev !== null ? prev - 1 : null))
			}, 1000)
			return () => clearInterval(interval)
		} else if (timeRemaining === 0) {
			setTimerActive(false)
			alert("Time's up! Case failed.")
		}
	}, [timerActive, timeRemaining])

	const onTabClick = (tab: ViewType) => {
		setView(tab)
		if (tab === 'news') {
			setIsNewsReaded(true)
		}
	}

	const onWrongAnswer = () => {
		setSolutionSubmitted(false)
	}

	const getAvailableEvidence = () => {
		if (!currentCase) return []

		return currentCase.evidence.filter((ev) => {
			if (!ev.hidden) return true
			if (ev.unlockedBy) {
				const unlockEvidence = currentCase.evidence.find(
					(e) => e.id === ev.unlockedBy
				)
				return unlockEvidence?.collected
			}
			return false
		})
	}

	const checkBreakingNews = () => {
		if (!currentCase || !currentCase.breakingNews) return

		const analyzedCount = currentCase.evidence.filter((e) => e.analyzed).length
		const interviewedCount = currentCase.people.filter(
			(p) => p.interviewed
		).length

		const updatedNews = currentCase.breakingNews.map((news) => {
			if (news.revealed) return news

			if (news.triggerCondition.startsWith('evidence-analyzed-')) {
				const required = parseInt(news.triggerCondition.split('-')[2])
				if (analyzedCount >= required) {
					setIsNewsReaded(false)
					return { ...news, revealed: true }
				}
			}

			if (news.triggerCondition.startsWith('person-interviewed-')) {
				const required = parseInt(news.triggerCondition.split('-')[2])
				if (interviewedCount >= required) {
					setIsNewsReaded(false)
					return { ...news, revealed: true }
				}
			}

			return news
		})

		const updatedCase = { ...currentCase, breakingNews: updatedNews }
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	}

	useEffect(() => {
		checkBreakingNews()
	}, [currentCase?.evidence, currentCase?.people])

	const getAvailablePeople = () => {
		if (!currentCase) return []

		return currentCase.people.filter((person) => {
			if (person.available) return true
			if (person.availability) {
				const unlockEvidence = currentCase.evidence.find(
					(e) => e.id === person.availability
				)
				return unlockEvidence?.collected || false
			}
			return false
		})
	}

	const startCase = (caseId: string) => {
		const selectedCase = cases.find((c) => c.id === caseId)
		setCurrentCaseId(caseId)
		setView('briefing')
		setSolutionSubmitted(false)
		setSolutionCorrect(false)

		if (selectedCase?.timeLimit) {
			setTimeRemaining(selectedCase.timeLimit)
		} else {
			setTimeRemaining(null)
		}
	}

	const beginInvestigation = () => {
		setView('scene')
		if (timeRemaining !== null) {
			setTimerActive(true)
		}
	}

	const collectEvidence = (evidenceId: string) => {
		if (!currentCase) return

		const updatedEvidence = currentCase.evidence.map((e) =>
			e.id === evidenceId ? { ...e, collected: true } : e
		)

		const updatedCase = { ...currentCase, evidence: updatedEvidence }
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	}

	const analyzeEvidence = (evidenceId: string) => {
		if (!currentCase) return

		const updatedEvidence = currentCase.evidence.map((e) =>
			e.id === evidenceId ? { ...e, analyzed: true } : e
		)

		const updatedCase = { ...currentCase, evidence: updatedEvidence }
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	}

	const examineLocation = (locationId: string) => {
		if (!currentCase) return

		const updatedScene = currentCase.scene.map((loc) =>
			loc.id === locationId ? { ...loc, examined: true } : loc
		)

		const updatedCase = { ...currentCase, scene: updatedScene }
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
		setSelectedLocation(locationId)
	}

	const startInterrogation = (personId: string) => {
		setSelectedPerson(personId)
		setInterrogationMode(true)
		setContradictionMode(false)
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
		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	}

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

		const person = currentCase.people.find((p) => p.id === selectedPerson)
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
				if (p.id === selectedPerson) {
					const updatedContradictions = p.contradictions.map((contr) =>
						contr.id === contradiction.id ? { ...contr, caught: true } : contr
					)
					return { ...p, contradictions: updatedContradictions }
				}
				return p
			})

			const updatedCase = { ...currentCase, people: updatedPeople }
			setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))

			toast.success(`Contradiction found! ${contradiction.description}`, {
				autoClose: 10000,
			})
		} else {
			toast('No contradiction found between these statements.')
		}

		setSelectedResponses([])
	}

	const closeInterrogation = () => {
		setInterrogationMode(false)
		setSelectedPerson(null)
		setContradictionMode(false)
		setSelectedResponses([])
	}

	const submitSolution = (culpritId: string) => {
		if (!currentCase) return

		const correct = culpritId === currentCase.solution.culprit
		setSolutionCorrect(correct)
		setSolutionSubmitted(true)
		setTimerActive(false)
	}

	const isPhoneRecordsUnlocked = () => {
		if (!currentCase?.phoneRecords?.unlockedBy) return true
		const unlockEvidence = currentCase.evidence.find(
			(e) => e.id === currentCase.phoneRecords?.unlockedBy
		)
		return unlockEvidence?.analyzed || false
	}

	if (view === 'menu') {
		return (
			<Menu
				cases={cases}
				setCases={setCases}
				startCase={startCase}
			/>
		)
	}

	if (!currentCase) return null

	if (view === 'briefing') {
		return (
			<Briefing
				beginInvestigation={beginInvestigation}
				currentCase={currentCase}
				setView={setView}
			/>
		)
	}

	const collectedEvidence = currentCase.evidence.filter((e) => e.collected)
	const analyzedEvidence = currentCase.evidence.filter((e) => e.analyzed)
	const availableEvidence = getAvailableEvidence()
	const availablePeople = getAvailablePeople()
	const phoneUnlocked = isPhoneRecordsUnlocked()
	const revealedNews = currentCase.breakingNews?.filter((n) => n.revealed) || []
	const suspects = availablePeople.filter((p) => p.type === 'suspect')
	const witnesses = availablePeople.filter((p) => p.type === 'witness')

	return (
		<div className='flex-1 w-full h-full flex flex-col  bg-gray-900 text-gray-100'>
			<Header
				currentCase={currentCase}
				setView={setView}
				timeRemaining={timeRemaining}
				timerActive={timerActive}
				revealedNews={revealedNews}
				isNewsReaded={isNewsReaded}
				setIsNewsReaded={setIsNewsReaded}
			/>

			<Navigation
				onTabClick={onTabClick}
				availablePeopleCount={availablePeople.length}
				collectedEvidenceCount={collectedEvidence.length}
				phoneUnlocked={phoneUnlocked}
				revealedNewsCount={revealedNews.length}
				view={view}
				isNewsReaded={isNewsReaded}
				setIsNewsReaded={setIsNewsReaded}
			/>

			{/* Content */}
			<div className='flex-1 w-full flex flex-col justify-start max-w-7xl mx-auto p-8'>
				{view === 'scene' && (
					<Scene
						availableEvidence={availableEvidence}
						examineLocation={examineLocation}
						selectedLocation={selectedLocation}
						collectEvidence={collectEvidence}
						currentCase={currentCase}
					/>
				)}

				{view === 'evidence' && (
					<Evidence
						analyzeEvidence={analyzeEvidence}
						collectedEvidence={collectedEvidence}
						currentCase={currentCase}
					/>
				)}

				{view === 'interrogation' && (
					<Interrogation
						askQuestion={askQuestion}
						checkContradiction={checkContradiction}
						closeInterrogation={closeInterrogation}
						contradictionMode={contradictionMode}
						currentCase={currentCase}
						interrogationMode={interrogationMode}
						selectedPerson={selectedPerson}
						selectedResponses={selectedResponses}
						startInterrogation={startInterrogation}
						suspects={suspects}
						witnesses={witnesses}
						selectResponse={selectResponse}
						toggleContradictionMode={toggleContradictionMode}
					/>
				)}

				{view === 'phone' && (
					<Phone
						currentCase={currentCase}
						phoneUnlocked={phoneUnlocked}
					/>
				)}

				{view === 'news' && <News revealedNews={revealedNews} />}

				{view === 'board' && (
					<Board
						analyzedEvidence={analyzedEvidence}
						availablePeople={availablePeople}
						collectedEvidence={collectedEvidence}
						currentCase={currentCase}
					/>
				)}

				{view === 'solution' && (
					<Solution
						currentCase={currentCase}
						onWrongAnswer={onWrongAnswer}
						setView={setView}
						solutionCorrect={solutionCorrect}
						solutionSubmitted={solutionSubmitted}
						suspects={suspects}
						submitSolution={submitSolution}
					/>
				)}
			</div>
		</div>
	)
}

export default App
