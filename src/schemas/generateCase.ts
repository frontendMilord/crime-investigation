import z from 'zod'

export const GenerateCaseSchema = z
	.object({
		caseType: z.string(),
		caseLanguage: z.string(),
		caseSize: z.string(),
		hasTimeLimit: z.boolean(),
		defaultTimeLimit: z.boolean().optional(),
		customTimeLimit: z.string().optional(),
	})
	.refine(
		(data) => {
			// if hasTimeLimit is false, nothing else matters
			if (!data.hasTimeLimit) return true

			// if defaultTimeLimit is false, customTimeLimit must be provided and valid
			if (!data.defaultTimeLimit) {
				const customTime = Number(data.customTimeLimit)
				return typeof customTime === 'number' && customTime >= 1
			}

			return true
		},
		{
			message:
				'Provide a custom time limit in seconds if not using default time limit',
			path: ['customTimeLimit'],
		}
	)
