import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import type { ICase, IEvidence, IPerson } from '../types'
import { defaultCases } from '../consts/case'

interface ICaseState {
	currentCase: ICase | null
	setCurrentCase: (newCase: ICase | null) => void
	cases: ICase[]
	setCases: (cases: ICase[]) => void
	availablePeople: IPerson[]
	setAvailablePeople: (people: IPerson[]) => void
	collectedEvidence: IEvidence[]
	setCollectedEvidence: (evidence: IEvidence[]) => void
	isNewsReaded: boolean
	setIsNewsReaded: (isNewsReaded: boolean) => void
	timerActive: boolean
	setTimerActive: (timerActive: boolean) => void
	timeRemaining: number | null
	setTimeRemaining: (timeRemaining: number | null) => void
}

export const useCaseStore = create<ICaseState>()(
	devtools(
		// persist(
		(set) => ({
			currentCase: null,
			setCurrentCase: (newCase: ICase | null) => set({ currentCase: newCase }),
			cases: defaultCases,
			setCases: (cases: ICase[]) => set({ cases }),
			availablePeople: [],
			setAvailablePeople: (people: IPerson[]) =>
				set({ availablePeople: people }),
			collectedEvidence: [],
			setCollectedEvidence: (evidence: IEvidence[]) =>
				set({ collectedEvidence: evidence }),
			isNewsReaded: false,
			setIsNewsReaded: (isNewsReaded: boolean) => set({ isNewsReaded }),
			setTimerActive: (timerActive: boolean) => set({ timerActive }),
			timerActive: false,
			setTimeRemaining: (timeRemaining: number | null) =>
				set({ timeRemaining }),
			timeRemaining: null,
		})
		// {
		// 	name: 'case-storage',
		// }
		// )
	)
)
