import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { useCaseStore } from './case'

interface ICaseTimerState {
	timerActive: boolean
	setTimerActive: (timerActive: boolean) => void
	timeRemaining: number | null
	setTimeRemaining: (timeRemaining: number | null) => void
	tick: () => void
	startTimer: () => void
	resumeTimer: () => void
	stopTimer: () => void
}

export const useCaseTimerStore = create<ICaseTimerState>()(
	devtools(
		persist(
			(set, get) => {
				let interval: ReturnType<typeof setInterval> | null = null

				return {
					setTimerActive: (timerActive: boolean) => set({ timerActive }),
					timerActive: false,
					setTimeRemaining: (timeRemaining: number | null) =>
						set({ timeRemaining }),
					timeRemaining: null,
					startTimer: () => {
						const { currentCase } = useCaseStore.getState()
						const { setTimerActive, setTimeRemaining } = get()
						if (interval || !currentCase?.timeLimit) return
						setTimerActive(true)
						setTimeRemaining(currentCase.timeLimit)
						interval = setInterval(() => get().tick(), 1000)
					},
					resumeTimer: () => {
						const { setTimerActive, setTimeRemaining, timeRemaining } = get()
						if (interval) return
						setTimerActive(true)
						setTimeRemaining(timeRemaining)
						interval = setInterval(() => get().tick(), 1000)
					},
					stopTimer: () => {
						const { setTimerActive, setTimeRemaining } = get()
						if (interval) {
							clearInterval(interval)
							interval = null
						}
						setTimerActive(false)
						setTimeRemaining(null)
					},
					tick: () => {
						const { timeRemaining } = get()
						if (timeRemaining === null) {
							return
						}
						if (timeRemaining >= 1) {
							set({
								timeRemaining: timeRemaining - 1,
							})
						} else {
							set({
								timeRemaining: null,
								timerActive: false,
							})
							stopTimer()
						}
					},
				}
			},
			{
				name: 'case-timer-storage',
			}
		)
	)
)
