import { useEffect } from 'react'
import { useCaseStore } from './store/case'
import { toast } from 'react-toastify'
import { useEvidenceStore } from './store/evidence'
import { useCaseTimerStore } from './store/caseTimer'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES_PATHS } from './consts/routes'
import { CASE_PAGES } from './consts/router'

function App() {
	const {
		currentCase,
		setIsNewsReaded,
		cases,
		setCases,
		setAvailablePeople,
		setCurrentCase,
	} = useCaseStore((state) => state)
	const { setAvailableEvidence } = useEvidenceStore()
	const { timeRemaining, timerActive, resumeTimer } = useCaseTimerStore()
	const navigate = useNavigate()
	const { pathname } = useLocation()

	useEffect(() => {
		if (timerActive && timeRemaining === 0) {
			toast.error("Time's up! Submit your solution.", { autoClose: false })
			navigate(ROUTES_PATHS.SOLUTION)
		}
	}, [timerActive, timeRemaining])

	useEffect(() => {
		const isOnCasePage = CASE_PAGES.includes(pathname)
		if (timeRemaining && timeRemaining > 0 && isOnCasePage) {
			resumeTimer() // resumes ticking from persisted value
		}
	}, [])

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

	// useEffect(() => {
	// 	const checkBreakingNews = () => {
	// 		if (!currentCase || !currentCase.breakingNews) return

	// 		const analyzedCount = currentCase.evidence.filter(
	// 			(e) => e.analyzed
	// 		).length
	// 		const interviewedCount = currentCase.people.filter(
	// 			(p) => p.interviewed
	// 		).length

	// 		const updatedNews = currentCase.breakingNews.map((news) => {
	// 			if (news.revealed) return news

	// 			if (news.triggerCondition.startsWith('evidence-analyzed-')) {
	// 				const requiredCount = parseInt(news.triggerCondition.split('-')[2])
	// 				if (analyzedCount >= requiredCount) {
	// 					setIsNewsReaded(false)
	// 					return { ...news, revealed: true }
	// 				}
	// 			}

	// 			if (news.triggerCondition.startsWith('person-interviewed-')) {
	// 				const requiredCount = parseInt(news.triggerCondition.split('-')[2])
	// 				if (interviewedCount >= requiredCount) {
	// 					setIsNewsReaded(false)
	// 					return { ...news, revealed: true }
	// 				}
	// 			}

	// 			return news
	// 		})

	// 		const updatedCase = { ...currentCase, breakingNews: updatedNews }
	// 		setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
	// 		setCurrentCase(updatedCase)
	// 	}
	// 	checkBreakingNews()
	// }, [currentCase?.breakingNews, currentCase?.evidence])

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
