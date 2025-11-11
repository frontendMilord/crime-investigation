import z from 'zod'

export const GenerateCaseSchema = z.object({
	caseType: z.string(),
	language: z.string(),
	caseSize: z.string(),
	testText: z.string().optional(),
})
