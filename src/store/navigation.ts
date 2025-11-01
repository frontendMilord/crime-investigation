import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import type { ViewType } from '../types'

interface ICaseState {
	view: ViewType
	setView: (view: ViewType) => void
}

export const useNavigationStore = create<ICaseState>()(
	devtools(
		persist(
			(set) => ({
				view: 'menu',
				setView: (view) => set({ view }),
			}),
			{
				name: 'navigation-storage',
			}
		)
	)
)
