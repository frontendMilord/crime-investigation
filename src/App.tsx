import { useEffect, useRef } from 'react'
import { useCaseStore } from './store/case'
import { toast } from 'react-toastify'
import { useEvidenceStore } from './store/evidence'
import { useCaseTimerStore } from './store/caseTimer'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES_PATHS } from './consts/routes'
import { CASE_PAGES } from './consts/router'
import type { IEvidence } from './types'

function App() {
	const {
		currentCase,
		setIsNewsReaded,
		cases,
		setCases,
		setAvailablePeople,
		setCurrentCase,
		setCollectedEvidence,
	} = useCaseStore((state) => state)
	const {
		setAvailableEvidence,
		availableEvidence,
		totalTimeLeft,
		resumeProcessing,
	} = useEvidenceStore()
	const { timeRemaining, timerActive, resumeTimer } = useCaseTimerStore()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const prevAnalyzedEvidence = useRef<IEvidence[] | null>(
		availableEvidence.filter((e) => e.analyzed)
	)

	useEffect(() => {
		if (timerActive && timeRemaining === 0 && currentCase?.id) {
			toast.error("Time's up! Submit your solution.", { autoClose: false })
			localStorage.removeItem(`timeRemaining-${currentCase?.id}`)
			navigate(ROUTES_PATHS.SOLUTION)
		}
	}, [timerActive, timeRemaining, currentCase?.id])

	useEffect(() => {
		const isOnCasePage = CASE_PAGES.includes(pathname)
		if (timeRemaining && timeRemaining > 0 && isOnCasePage) {
			resumeTimer() // resumes ticking from persisted value
		}
	}, [pathname, timeRemaining])

	useEffect(() => {
		const checkBreakingNews = () => {
			if (!currentCase || !currentCase.breakingNews) return

			const analyzedCount = currentCase.evidence.filter(
				(e) => e.analyzed
			).length
			const interviewedCount = currentCase.people.filter(
				(p) => p.interviewed
			).length

			let isNewsRevealedStatusChanged = false

			const updatedNews = currentCase.breakingNews.map((news) => {
				if (news.revealed) return news

				if (news.triggerCondition.startsWith('evidence-analyzed-')) {
					const requiredCount = parseInt(news.triggerCondition.split('-')[2])
					if (analyzedCount >= requiredCount && !news.revealed) {
						setIsNewsReaded(false)
						isNewsRevealedStatusChanged = true
						return { ...news, revealed: true }
					}
				}

				if (news.triggerCondition.startsWith('person-interviewed-')) {
					const requiredCount = parseInt(news.triggerCondition.split('-')[2])
					if (interviewedCount >= requiredCount && !news.revealed) {
						setIsNewsReaded(false)
						isNewsRevealedStatusChanged = true
						return { ...news, revealed: true }
					}
				}

				return news
			})

			if (isNewsRevealedStatusChanged) {
				const updatedCase = { ...currentCase, breakingNews: updatedNews }
				setCases(cases.map((c) => (c.id === currentCase.id ? updatedCase : c)))
				setCurrentCase(updatedCase)
				console.log('news', updatedCase.breakingNews)
			}
		}
		checkBreakingNews()
	}, [currentCase, cases])

	useEffect(() => {
		const getAvailablePeople = () => {
			if (!currentCase) return []

			return currentCase.people.filter((person) => {
				if (person.available) return true
				if (person.availability) {
					const unlockEvidence = currentCase.evidence.find(
						(e) => e.id === person.availability
					)
					if (unlockEvidence?.analyzed && !person.available) {
						person.available = true
						const updatedCase = {
							...currentCase,
							people: [
								...currentCase.people.map((p) =>
									p.id === person.id ? { ...person, available: true } : p
								),
							],
						}
						setCurrentCase(updatedCase)
						setCases(
							cases.map((c) => (c.id === currentCase.id ? updatedCase : c))
						)
					}
					return unlockEvidence?.analyzed || false
				}
				return false
			})
		}
		setAvailablePeople(getAvailablePeople())
	}, [currentCase, cases])

	useEffect(() => {
		if (!currentCase) return
		setCollectedEvidence(currentCase.evidence.filter((e) => e.collected))
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
			prevAnalyzedEvidence.current = result.filter((e) => e.analyzed)
		}
		getAvailableEvidence()
	}, [currentCase])

	useEffect(() => {
		if (!availableEvidence.length) return
		const analyzedEvidence = availableEvidence.filter(
			(evidence) => evidence.analyzed
		)
		const newAnalyzedEvidence = analyzedEvidence.find(
			(e) => !prevAnalyzedEvidence?.current?.find((aE) => aE.id === e.id)
		)
		if (newAnalyzedEvidence) {
			toast.warning(`Evidence "${newAnalyzedEvidence.name}" has been analyzed!`)
			prevAnalyzedEvidence.current = analyzedEvidence
		}
	}, [availableEvidence])

	useEffect(() => {
		if (!totalTimeLeft) return
		const isOnCasePage = CASE_PAGES.includes(pathname)
		if (isOnCasePage) {
			resumeProcessing()
		}
	}, [totalTimeLeft, pathname])

	return <></>
}

export default App
