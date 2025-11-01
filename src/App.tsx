import { useEffect } from 'react'
import { useCaseStore } from './store/case'
import { toast } from 'react-toastify'
import { useEvidenceStore } from './store/evidence'

function App() {
	const {
		currentCase,
		setIsNewsReaded,
		cases,
		setCases,
		timeRemaining,
		setTimeRemaining,
		timerActive,
		setTimerActive,
		setAvailablePeople,
		setCurrentCase,
	} = useCaseStore((state) => state)
	const { setAvailableEvidence } = useEvidenceStore()

	useEffect(() => {
		if (timerActive && timeRemaining !== null && timeRemaining > 0) {
			const interval = setInterval(() => {
				setTimeRemaining(timeRemaining - 1)
			}, 1000)
			return () => clearInterval(interval)
		} else if (timeRemaining === 0) {
			setTimerActive(false)
			toast.error("Time's up! Case failed.", { autoClose: false })
		}
	}, [timerActive, timeRemaining])

	// const checkBreakingNews = () => {
	// 	if (!currentCase || !currentCase.breakingNews) return

	// 	const analyzedCount = currentCase.evidence.filter((e) => e.analyzed).length
	// 	const interviewedCount = currentCase.people.filter(
	// 		(p) => p.interviewed
	// 	).length

	// 	const updatedNews = currentCase.breakingNews.map((news) => {
	// 		if (news.revealed) return news

	// 		if (news.triggerCondition.startsWith('evidence-analyzed-')) {
	// 			const required = parseInt(news.triggerCondition.split('-')[2])
	// 			if (analyzedCount >= required) {
	// 				setIsNewsReaded(false)
	// 				return { ...news, revealed: true }
	// 			}
	// 		}

	// 		if (news.triggerCondition.startsWith('person-interviewed-')) {
	// 			const required = parseInt(news.triggerCondition.split('-')[2])
	// 			if (interviewedCount >= required) {
	// 				setIsNewsReaded(false)
	// 				return { ...news, revealed: true }
	// 			}
	// 		}

	// 		return news
	// 	})

	// 	const updatedCase = { ...currentCase, breakingNews: updatedNews }
	// 	setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	// }

	useEffect(() => {
		const checkBreakingNews = () => {
			if (!currentCase || !currentCase.breakingNews) return

			const analyzedCount = currentCase.evidence.filter(
				(e) => e.analyzed
			).length
			const interviewedCount = currentCase.people.filter(
				(p) => p.interviewed
			).length

			const updatedNews = currentCase.breakingNews.map((news) => {
				if (news.revealed) return news

				if (news.triggerCondition.startsWith('evidence-analyzed-')) {
					const requiredCount = parseInt(news.triggerCondition.split('-')[2])
					if (analyzedCount >= requiredCount) {
						setIsNewsReaded(false)
						return { ...news, revealed: true }
					}
				}

				if (news.triggerCondition.startsWith('person-interviewed-')) {
					const requiredCount = parseInt(news.triggerCondition.split('-')[2])
					if (interviewedCount >= requiredCount) {
						setIsNewsReaded(false)
						return { ...news, revealed: true }
					}
				}

				return news
			})

			const updatedCase = { ...currentCase, breakingNews: updatedNews }
			setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
			setCurrentCase(updatedCase)
		}
		checkBreakingNews()
	}, [currentCase?.evidence, currentCase?.people])

	useEffect(() => {
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
		setAvailablePeople(getAvailablePeople())
	}, [currentCase])

	useEffect(() => {
		const getAvailableEvidence = () => {
			if (!currentCase) return

			const result = currentCase.evidence.filter((ev) => {
				if (!ev.hidden) return true
				if (ev.unlockedBy) {
					const unlockEvidence = currentCase.evidence.find(
						(e) => e.id === ev.unlockedBy
					)
					return unlockEvidence?.analyzed
				}
				return false
			})
			setAvailableEvidence(result)
		}
		getAvailableEvidence()
	}, [currentCase])

	return <></>
}

export default App
