import {
	CheckCircle,
	FileText,
	Map,
	Newspaper,
	Phone,
	Search,
	Users,
} from 'lucide-react'
import type { NavigationLinks, ViewType } from '../types'

interface NavigationProps {
	collectedEvidenceCount: number
	availablePeopleCount: number
	phoneUnlocked: boolean
	revealedNewsCount: number
	onTabClick: (tab: ViewType) => void
	view: ViewType
}

const Navigation = ({
	collectedEvidenceCount,
	availablePeopleCount,
	phoneUnlocked,
	revealedNewsCount,
	onTabClick,
	view,
}: NavigationProps) => {
	const NAVIGATION_TABS: NavigationLinks[] = [
		{ id: 'scene', icon: Map, label: 'Crime Scene' },
		{
			id: 'evidence',
			icon: Search,
			label: `Evidence (${collectedEvidenceCount})`,
		},
		{
			id: 'interrogation',
			icon: Users,
			label: `Interrogation (${availablePeopleCount})`,
		},
		{
			id: 'phone',
			icon: Phone,
			label: 'Phone Records',
			disabled: !phoneUnlocked,
		},
		{
			id: 'news',
			icon: Newspaper,
			label: `News (${revealedNewsCount})`,
			badge: revealedNewsCount > 0,
		},
		{ id: 'board', icon: FileText, label: 'Case Board' },
		{ id: 'solution', icon: CheckCircle, label: 'Submit Solution' },
	]

	return (
		<div className='bg-gray-800 border-b border-gray-700'>
			<div className='max-w-7xl mx-auto flex overflow-x-auto'>
				{NAVIGATION_TABS.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabClick(tab.id)}
						disabled={tab.disabled}
						className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap relative ${
							view === tab.id
								? 'border-red-500 text-white'
								: tab.disabled
								? 'border-transparent text-gray-600 cursor-not-allowed'
								: 'border-transparent text-gray-400 hover:text-white'
						}`}
					>
						<tab.icon className='w-4 h-4' />
						{tab.label}
						{tab.badge && (
							<span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse'></span>
						)}
					</button>
				))}
			</div>
		</div>
	)
}

export default Navigation
