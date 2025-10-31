import type { LucideProps } from 'lucide-react'

export interface IEvidence {
	id: string
	name: string
	description: string
	location: string
	collected: boolean
	analyzed: boolean
	analysisResult?: string
	hidden?: boolean
	unlockedBy?: string
}

export interface IDialogueResponse {
	id: string
	text: string
	followUps?: string[]
	revealsDetail?: string
	revealsContradiction?: string
}

export interface IDialogueTree {
	id: string
	question: string
	requiresEvidence?: string
	requiresPerson?: string
	requiresResponse?: string
	responses: IDialogueResponse[]
	asked: boolean
}

export interface IContradiction {
	id: string
	response1: string
	response2: string
	description: string
	caught: boolean
}

export interface IPerson {
	id: string
	name: string
	age: number
	occupation: string
	relationship: string
	type: 'suspect' | 'witness'
	available: boolean
	availability?: string
	initialStatement: string
	dialogueTrees: IDialogueTree[]
	contradictions: IContradiction[]
	interviewed: boolean
}

export interface ISceneLocation {
	id: string
	name: string
	description: string
	evidenceIds: string[]
	examined: boolean
}

export interface IPhoneCall {
	time: string
	from: string
	to: string
	duration: string
}

export interface ITextMessage {
	time: string
	from: string
	to: string
	message: string
	read: boolean
}

export interface IPhoneRecords {
	calls: IPhoneCall[]
	texts: ITextMessage[]
	unlockedBy?: string
}

export interface IBreakingNews {
	id: string
	triggerCondition: string
	headline: string
	content: string
	revealed: boolean
}

export interface ICase {
	id: string
	title: string
	type: string
	victim: string
	timeLimit?: number
	briefing: string
	scene: ISceneLocation[]
	evidence: IEvidence[]
	people: IPerson[]
	phoneRecords?: IPhoneRecords
	breakingNews?: IBreakingNews[]
	solution: {
		culprit: string
		motive: string
		method: string
	}
}

export type ViewType =
	| 'menu'
	| 'briefing'
	| 'scene'
	| 'evidence'
	| 'interrogation'
	| 'board'
	| 'solution'
	| 'phone'
	| 'news'

export interface INavigationLinks {
	id: ViewType
	icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
	>
	label: string
	disabled?: boolean
	badge?: boolean
}
