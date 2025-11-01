import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import type { ICase } from '../types'
import { defaultCases } from '../consts/case'

interface ICaseState {
	currentCase: ICase | null
	setCurrentCase: (newCase: ICase | null) => void
	cases: ICase[]
	setCases: (cases: ICase[]) => void
}

export const useCaseStore = create<ICaseState>()(
	devtools(
		persist(
			(set) => ({
				currentCase: null,
				setCurrentCase: (newCase: ICase | null) =>
					set({ currentCase: newCase }),
				cases: defaultCases,
				setCases: (cases: ICase[]) => set({ cases }),
			}),
			{
				name: 'case-storage',
			}
		)
	)
)
