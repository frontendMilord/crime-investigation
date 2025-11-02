import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IEvidence } from '../types'
import { useCaseStore } from './case'

interface IEvidenceState {
	availableEvidence: IEvidence[]
	queue: IEvidence[]
	current: IEvidence | null
	timeLeft: number
	totalTimeLeft: number
	setAvailableEvidence: (evidenceArr: IEvidence[]) => void
	sendEvidenceToLab: (id: string) => void
	tick: () => void
	startProcessing: () => void
	resumeProcessing: () => void
	getEvidenceStatus: (id: string) => 'available' | 'pending' | 'analyzed'
	getRemainingTime: (id: string) => number | null
}

export const useEvidenceStore = create<IEvidenceState>()(
	persist(
		(set, get) => {
			let interval: ReturnType<typeof setInterval> | null = null

			const recalcTotal = () => {
				const { queue, current, timeLeft } = get()
				const queueTime = queue.reduce((acc, e) => acc + e.timeToProcess, 0)
				const totalTimeLeft = queueTime + (current ? timeLeft : 0)
				return totalTimeLeft - 1 <= 0 ? 0 : totalTimeLeft - 1
			}

			const startTimer = () => {
				if (interval) return
				interval = setInterval(() => get().tick(), 1000)
			}

			const stopTimer = () => {
				if (interval) {
					clearInterval(interval)
					interval = null
				}
			}

			return {
				availableEvidence: [],
				queue: [],
				current: null,
				timeLeft: 0,
				totalTimeLeft: 0,

				setAvailableEvidence: (evidenceArr) => {
					set(() => ({
						availableEvidence: evidenceArr,
					}))
				},

				sendEvidenceToLab: (id) => {
					const { availableEvidence, queue, current } = get()
					const evidence = availableEvidence.find(
						(e) => e.id === id && !e.analyzed
					)
					if (!evidence) return

					if (queue.find((e) => e.id === id) || current?.id === id) return

					const newQueue = [...queue, { ...evidence }]
					set({ queue: newQueue, totalTimeLeft: recalcTotal() })
					get().startProcessing()
				},

				tick: () => {
					const { current, timeLeft, queue, availableEvidence } = get()

					if (!current) {
						stopTimer()
						return
					}

					if (timeLeft >= 1) {
						set({
							timeLeft: timeLeft - 1,
							totalTimeLeft: recalcTotal(),
						})
					} else {
						// mark analyzed
						const { currentCase, setCurrentCase, setCases, cases } =
							useCaseStore.getState()
						const updatedEvidence = availableEvidence.map((e) =>
							e.id === current.id ? { ...e, analyzed: true } : e
						)

						if (currentCase) {
							const updatedCase = {
								...currentCase,
								evidence: updatedEvidence,
							}
							setCurrentCase(updatedCase)
							setCases(
								cases.map((c) => (c.id === currentCase.id ? updatedCase : c))
							)
						}

						const next = queue[0] || null
						set({
							availableEvidence: updatedEvidence,
							current: next,
							queue: next ? queue.slice(1) : [],
							timeLeft: next ? next.timeToProcess : 0,
							totalTimeLeft: recalcTotal(),
						})

						if (!next) stopTimer()
					}
				},

				startProcessing: () => {
					const { current, queue } = get()
					if (current) return
					const next = queue[0]
					if (!next) return
					set({
						current: next,
						queue: queue.slice(1),
						timeLeft: next.timeToProcess,
					})
					startTimer()
				},

				resumeProcessing: () => {
					startTimer()
				},

				getEvidenceStatus: (id) => {
					const { availableEvidence, queue, current } = get()
					const ev = availableEvidence.find((e) => e.id === id)
					if (!ev) return 'available'
					if (ev.analyzed) return 'analyzed'
					if (current?.id === id || queue.find((q) => q.id === id))
						return 'pending'
					return 'available'
				},

				getRemainingTime: (id) => {
					const { current, queue, timeLeft } = get()
					if (current?.id === id) return timeLeft
					const index = queue.findIndex((e) => e.id === id)
					if (index === -1) return null
					const laterQueue = queue.slice(0, index + 1)
					const sumAhead = laterQueue.reduce(
						(acc, e) => acc + e.timeToProcess,
						0
					)
					return timeLeft + sumAhead
				},
			}
		},
		{
			name: 'evidence-storage',
		}
	)
)
