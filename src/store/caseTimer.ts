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
						if (interval || !currentCase?.timeLimit) return
						set({ timerActive: true, timeRemaining: currentCase.timeLimit })
						interval = setInterval(() => get().tick(), 1000)
					},
					resumeTimer: () => {
						if (interval) return
						set({ timerActive: true })
						interval = setInterval(() => get().tick(), 1000)
					},
					stopTimer: () => {
						const { currentCase } = useCaseStore.getState()
						if (interval) {
							clearInterval(interval)
							interval = null
						}
						if (currentCase?.id) {
							localStorage.removeItem(`timeRemaining-${currentCase.id}`)
						}
						set({
							timeRemaining: null,
							timerActive: false,
						})
					},
					tick: () => {
						const { timeRemaining, stopTimer } = get()
						const { currentCase } = useCaseStore.getState()
						if (timeRemaining === null) {
							return
						}
						if (timeRemaining >= 1) {
							set({
								timeRemaining: timeRemaining - 1,
							})
							if (currentCase?.id) {
								localStorage.setItem(
									`timeRemaining-${currentCase.id}`,
									`${timeRemaining - 1}`
								)
							}
						} else {
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
