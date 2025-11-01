import type { ReactElement } from 'react'
import { ROUTES_PATHS } from './routes'
import MenuPage from '../pages/MenuPage'
import BriefingPage from '../pages/BriefingPage'
import ScenePage from '../pages/ScenePage'
import EvidencePage from '../pages/EvidencePage'
import InterrogationPage from '../pages/InterrogationPage'
import PhonePage from '../pages/PhonePage'
import NewsPage from '../pages/NewsPage'
import BoardPage from '../pages/BoardPage'
import SolutionPage from '../pages/SolutionPage'

export const ROUTES: { path: string; element: ReactElement }[] = [
	{ path: ROUTES_PATHS.BASE, element: <MenuPage /> },
	{ path: ROUTES_PATHS.BRIEFING, element: <BriefingPage /> },
	{ path: ROUTES_PATHS.SCENE, element: <ScenePage /> },
	{ path: ROUTES_PATHS.EVIDENCE, element: <EvidencePage /> },
	{ path: ROUTES_PATHS.INTERROGATION, element: <InterrogationPage /> },
	{ path: ROUTES_PATHS.PHONE, element: <PhonePage /> },
	{ path: ROUTES_PATHS.NEWS, element: <NewsPage /> },
	{ path: ROUTES_PATHS.BOARD, element: <BoardPage /> },
	{ path: ROUTES_PATHS.SOLUTION, element: <SolutionPage /> },
]

export const CASE_PAGES = [
	ROUTES_PATHS.SCENE,
	ROUTES_PATHS.EVIDENCE,
	ROUTES_PATHS.INTERROGATION,
	ROUTES_PATHS.PHONE,
	ROUTES_PATHS.NEWS,
	ROUTES_PATHS.BOARD,
	ROUTES_PATHS.SOLUTION,
]
