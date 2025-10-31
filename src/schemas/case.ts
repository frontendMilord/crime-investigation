import z from 'zod'

// Evidence
export const EvidenceSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	location: z.string(),
	collected: z.boolean(),
	analyzed: z.boolean(),
	analysisResult: z.string().optional(),
	hidden: z.boolean().optional(),
	unlockedBy: z.string().optional(),
})

// Dialogue response
export const DialogueResponseSchema = z.object({
	id: z.string(),
	text: z.string(),
	followUps: z.array(z.string()).optional(),
	revealsDetail: z.string().optional(),
	revealsContradiction: z.string().optional(),
})

// Dialogue tree
export const DialogueTreeSchema = z.object({
	id: z.string(),
	question: z.string(),
	requiresEvidence: z.string().optional(),
	requiresPerson: z.string().optional(),
	requiresResponse: z.string().optional(),
	responses: z.array(DialogueResponseSchema),
	asked: z.boolean(),
})

// Contradiction
export const ContradictionSchema = z.object({
	id: z.string(),
	response1: z.string(),
	response2: z.string(),
	description: z.string(),
	caught: z.boolean(),
})

// Person
export const PersonSchema = z.object({
	id: z.string(),
	name: z.string(),
	age: z.number(),
	occupation: z.string(),
	relationship: z.string(),
	type: z.enum(['suspect', 'witness']),
	available: z.boolean(),
	availability: z.string().optional(),
	initialStatement: z.string(),
	dialogueTrees: z.array(DialogueTreeSchema),
	contradictions: z.array(ContradictionSchema),
	interviewed: z.boolean(),
})

// Scene location
export const SceneLocationSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	evidenceIds: z.array(z.string()),
	examined: z.boolean(),
})

// Phone call
export const PhoneCallSchema = z.object({
	time: z.string(),
	from: z.string(),
	to: z.string(),
	duration: z.string(),
})

// Text message
export const TextMessageSchema = z.object({
	time: z.string(),
	from: z.string(),
	to: z.string(),
	message: z.string(),
	read: z.boolean(),
})

// Phone records
export const PhoneRecordsSchema = z.object({
	calls: z.array(PhoneCallSchema),
	texts: z.array(TextMessageSchema),
	unlockedBy: z.string().optional(),
})

// Breaking news
export const BreakingNewsSchema = z.object({
	id: z.string(),
	triggerCondition: z.string(),
	headline: z.string(),
	content: z.string(),
	revealed: z.boolean(),
})

// ICase schema
export const CaseSchema = z.object({
	// id: z.string(),
	title: z.string(),
	type: z.string(),
	victim: z.string(),
	timeLimit: z.number().optional(),
	briefing: z.string(),
	scene: z.array(SceneLocationSchema),
	evidence: z.array(EvidenceSchema),
	people: z.array(PersonSchema),
	phoneRecords: PhoneRecordsSchema.optional(),
	breakingNews: z.array(BreakingNewsSchema).optional(),
	solution: z.object({
		culprit: z.string(),
		motive: z.string(),
		method: z.string(),
	}),
})
