import {
	CheckCircle,
	FileText,
	Map,
	Newspaper,
	Phone,
	Search,
	Users,
} from 'lucide-react'
import type { IBreakingNews, INavigationLinks } from '../types'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES_PATHS } from '../consts/routes'
import { useCaseStore } from '../store/case'
import { useEffect, useState } from 'react'

const Navigation = () => {
	const {
		collectedEvidence,
		availablePeople,
		currentCase,
		isNewsReaded,
		setIsNewsReaded,
	} = useCaseStore((state) => state)
	const pathname = useLocation()
	const [phoneUnlocked, setPhoneUnlocked] = useState(false)
	const [revealedNews, setRevealedNews] = useState<IBreakingNews[]>([])

	const onLinkClick = (path: string) => {
		if (path === ROUTES_PATHS.NEWS) {
			setIsNewsReaded(true)
		}
	}

	useEffect(() => {
		if (!currentCase) return
		setRevealedNews(currentCase.breakingNews?.filter((n) => n.revealed) || [])
	}, [currentCase])

	useEffect(() => {
		if (!currentCase?.phoneRecords?.unlockedBy) {
			return
		}
		const unlockEvidence = currentCase.evidence.find(
			(e) => e.id === currentCase.phoneRecords?.unlockedBy
		)
		setPhoneUnlocked(unlockEvidence?.analyzed || false)
	}, [currentCase])

	const NAVIGATION_TABS: INavigationLinks[] = [
		{ path: ROUTES_PATHS.SCENE, icon: Map, label: 'Crime Scene' },
		{
			path: ROUTES_PATHS.EVIDENCE,
			icon: Search,
			label: `Evidence (${collectedEvidence.length})`,
		},
		{
			path: ROUTES_PATHS.INTERROGATION,
			icon: Users,
			label: `Interrogation (${availablePeople.length})`,
		},
		{
			path: ROUTES_PATHS.PHONE,
			icon: Phone,
			label: 'Phone Records',
			disabled: !phoneUnlocked,
		},
		{
			path: ROUTES_PATHS.NEWS,
			icon: Newspaper,
			label: `News (${revealedNews.length})`,
			badge: revealedNews.length > 0,
		},
		{ path: ROUTES_PATHS.BOARD, icon: FileText, label: 'Case Board' },
		{
			path: ROUTES_PATHS.SOLUTION,
			icon: CheckCircle,
			label: 'Submit Solution',
		},
	]

	return (
		<div className='bg-gray-800 border-b border-gray-700'>
			<div className='max-w-7xl mx-auto flex overflow-x-auto'>
				{NAVIGATION_TABS.map((tab) => (
					<Link
						key={tab.path}
						to={tab.path}
						onClick={tab.disabled ? () => {} : () => onLinkClick(tab.path)}
						className={`flex items-center gap-2 px-6 py-4 border-b-2 cursor-pointer transition-all whitespace-nowrap relative ${
							pathname.pathname === tab.path
								? 'border-red-500 text-white'
								: tab.disabled
								? 'border-transparent text-gray-600 cursor-not-allowed'
								: 'border-transparent text-gray-400 hover:text-white'
						}`}
					>
						<tab.icon className='w-4 h-4' />
						{tab.label}
						{tab.badge && !isNewsReaded && (
							<span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse'></span>
						)}
					</Link>
				))}
			</div>
		</div>
	)
}

export default Navigation
