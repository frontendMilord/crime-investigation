import React, { useEffect } from 'react'
import { useCaseStore } from './store/case'
import { toast } from 'react-toastify'

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
	} = useCaseStore((state) => state)

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

	// return <></>
	return <React.Fragment />
}

export default App
