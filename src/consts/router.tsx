import type { ReactElement } from 'react'
import { ROUTES_PATHS } from './routes'
import MenuPage from '../pages/Menu/page'
import BriefingPage from '../pages/Briefing/page'
import ScenePage from '../pages/Scene/page'
import EvidencePage from '../pages/Evidence/page'
import InterrogationPage from '../pages/Interrogation/page'
import PhonePage from '../pages/Phone/page'
import NewsPage from '../pages/News/page'
import BoardPage from '../pages/Board/page'
import SolutionPage from '../pages/Solution/page'

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
