import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { CASE_LANGUAGES, CASE_TYPES } from '../../consts/case'
import UploadCase from '../../components/UploadCase'
import type { ICase } from '../../types'
import { useCaseStore } from '../../store/case'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ROUTES_PATHS } from '../../consts/routes'
import PasteGeneratedCase from '../../components/PasteGeneratedCase'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GenerateCaseSchema } from '@/schemas/generateCase'
import z from 'zod'
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

const CASE_SIZES = [
	{
		value: 'small',
		label: 'Small',
		description:
			'6-10 dialogue trees per person, 3-4 suspects, 8-10 evidence pieces, 2-4 crime scenes',
	},
	{
		value: 'medium',
		label: 'Medium',
		description:
			'10-14 dialogue trees per person, 4-5 suspects, 10-12 evidence pieces, 3-5 crime scenes',
	},
	{
		value: 'large',
		label: 'Large',
		description:
			'14-18 dialogue trees per person, 5-6 suspects, 12-15 evidence pieces, 4-8 crime scenes',
	},
]

export default function GenerateCasePage() {
	const [copied, setCopied] = useState(false)
	const [customPrompt, setCustomPrompt] = useState('')

	const { cases, setCases } = useCaseStore()
	const navigate = useNavigate()
	const { control, formState, handleSubmit, watch } = useForm<
		z.infer<typeof GenerateCaseSchema>
	>({
		defaultValues: {
			caseType: 'Murder',
			caseLanguage: 'english',
			caseSize: 'medium',
			hasTimeLimit: true,
			defaultTimeLimit: true,
			customTimeLimit: '',
		},
		resolver: zodResolver(GenerateCaseSchema),
	})

	const { hasTimeLimit, defaultTimeLimit } = watch()

	const copyToClipboard = async (
		text: string,
		setCopied: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	const onFileUploadSuccess = (newCase: ICase) => {
		setCases([...cases, newCase])
		toast.success('Case imported successfully!')
		navigate(ROUTES_PATHS.BASE)
	}

	const onFileUploadError = (error?: string) => {
		toast.error('Invalid JSON file format')
		console.error('error uploading case file', error)
	}

	const generateCustomPrompt = ({
		caseType,
		caseLanguage,
		caseSize,
		hasTimeLimit,
		defaultTimeLimit,
		customTimeLimit,
	}: z.infer<typeof GenerateCaseSchema>) => {
		let prompt = ''

		// Opening sentence
		if (caseType === 'random') {
			prompt += `Generate a detailed crime investigation case in JSON format with interactive dialogue trees and contradictions. Follow the structure, optional fields marked with "?". Create an engaging mystery with realistic clues and strategic interrogation paths.\n\n`
		} else {
			prompt += `Generate a detailed ${caseType} investigation case in JSON format with interactive dialogue trees and contradictions. Follow the structure, optional fields marked with "?". Create an engaging mystery with realistic clues and strategic interrogation paths.\n\n`
		}

		// Language instruction
		if (caseLanguage !== 'english') {
			const langName = CASE_LANGUAGES.find(
				(l) => l.value === caseLanguage
			)?.label
			prompt += `IMPORTANT: Generate all content (title, briefing, descriptions, dialogue, evidence names, etc.) in ${langName}.\n\n`
		}

		// Structure section (unchanged)
		prompt += `STRUCTURE:
{
  "title": "Case Name",
  "type": "${
		caseType === 'random'
			? CASE_TYPES.slice(1)
					.map((t) => t.label)
					.join('/')
			: caseType
	}",
  "victim": "Victim Name",
  "timeLimit?": 1500,
  "briefing": "Detailed initial case description with key facts and circumstances",
  "scene": [
    {
      "id": "location1",
      "name": "Location Name",
      "description": "Vivid description of the crime scene area",
      "evidenceIds": ["ev1", "ev2"],
      "examined": false
    }
  ],
  "evidence": [
    {
      "id": "ev1",
      "name": "Evidence Name",
      "description": "Initial appearance/description",
      "location": "location1",
      "collected": false,
      "analyzed": false,
      "timeToProcess": 120,
      "analysisResult": "Detailed forensic analysis revealing crucial information",
      "hidden?": false,
      "unlockedBy?": "ev2"
    }
  ],
  "people": [ 
    {
      "id": "person1",
      "name": "Full Name",
      "age": 30,
      "occupation": "Job Title",
      "relationship": "Connection to victim",
      "type":"suspect"
      "available": true,
      "availability?": "ev3",
      "initialStatement": "Their first statement when questioned",
      "interviewed": false,
      "dialogueTrees": [
        {
          "id": "tree1",
          "question": "Question to ask",
          "asked": false,
          "requiresEvidence?": "ev1",
          "requiresPerson?": "person2",
          "requiresResponse?": "tree3-r1",
          "responses": [
            {
              "id": "r1",
              "text": "Their response text",
              "followUps?": ["tree2", "tree3"],
              "revealsDetail?": "Key information revealed",
              "revealsContradiction?": "contradiction-id"
            }
          ]
        }
      ],
      "contradictions": [
        {
          "id": "contradiction1",
          "response1": "tree1-r1",
          "response2": "tree3-r1",
          "description": "Explanation of the contradiction between statements",
          "caught": false
        }
      ]
    },
    {
      "id": "person2",
      "name": "Anonymous Caller",
      "age": 0,
      "occupation": "Unknown",
      "relationship": "Anonymous tip",
      "type":"witness",
      "available": false,
      "availability?": "ev1",
      "initialStatement": "Their anonymous statement",
      "interviewed": false,
      "contradictions": [],
			"dialogueTrees": []
    }
  ],
  "solution": {
    "culprit": "person1",
    "motive": "Detailed explanation of why they did it",
    "method": "Detailed explanation of how they committed the crime"
  },
  "phoneRecords": {
    "unlockedBy": "phone-evidence-id",
    "calls": [
      {
        "time": "20:15",
        "from": "Person Name",
        "to": "Person Name",
        "duration": "3 min"
      }
    ],
    "texts": [
      {
        "time": "22:45",
        "from": "Person Name",
        "to": "Person Name",
        "message": "Actual message content with potential evidence",
        "read": true
      }
    ]
  },
  "breakingNews": [
    {
      "id": "news1",
      "triggerCondition": "evidence-analyzed-3",
      "headline": "News Headline",
      "content": "Full news article revealing new information",
      "revealed": false
    }
  ]
}

CRITICAL REQUIREMENTS:

`

		// Dialogue trees section (adjusted for case size)
		// const sizeConfig = CASE_SIZES.find((s) => s.value === caseSize)
		const dialogueRange =
			caseSize === 'small' ? '6-10' : caseSize === 'medium' ? '10-14' : '14-18'

		prompt += `DIALOGUE TREES:
- Each person should have ${dialogueRange} dialogue trees
- Create branching paths: early questions unlock later ones via "followUps"
- Use "requiresEvidence" for questions that need analyzed evidence
- Use "requiresPerson" + "requiresResponse" for cross-interrogation (confronting with other people's statements)
- At the start 2-4 trees should be available immediately, others locked behind requirements
- For some trees include "revealsDetail" for important clues discovered through questioning
- Design trees so asking questions in different orders reveals different information

CONTRADICTIONS:
- Each suspect should have 1-3 potential contradictions
- Format: "tree1-r1" means response r1 from tree1
- Contradictions should be subtle - require player to notice inconsistencies
- Only suspects need contradictions, witnesses don't

PEOPLE TYPES:
- type: "suspect" = potential culprits (${
			caseSize === 'small' ? '3-4' : caseSize === 'medium' ? '4-5' : '5-6'
		} people)
- type: "witness" = witnesses who provide information (2-3 people)
- Suspects: more complex dialogue trees, contradictions, motives
- Witnesses: simpler trees, provide observations and tips
- Use "available: false" + "availability: evidence-id" to lock witnesses behind evidence collection

EVIDENCE:
- ${
			caseSize === 'small' ? '8-10' : caseSize === 'medium' ? '10-12' : '12-15'
		} pieces of evidence across ${
			caseSize === 'small' ? '2-4' : caseSize === 'medium' ? '3-5' : '4-8'
		} locations
- Use "hidden: true" + "unlockedBy: evidence-id" for sequential discovery (finding X reveals Y)
- analysisResult should contain specific, useful information
- Some evidence should point to wrong suspects (red herrings)
`
		// timeToProcess instruction
		if (!hasTimeLimit) {
			prompt += `- timeToProcess for evidence can be set to reasonable values (5-300 seconds), but timeLimit should be OMITTED from the JSON structure\n`
		} else if (defaultTimeLimit) {
			prompt += `- Set timeToProcess for each piece of evidence in seconds based on how long it takes to process (from 5 to 300, total time to process all evidence should be less than half of timeLimit)\n- Generate a fair timeLimit value between 900-3600 seconds based on the case complexity\n`
		} else {
			prompt += `- Set timeToProcess for each piece of evidence in seconds based on how long it takes to process (from 5 to 300, total time to process all evidence should be less than half of timeLimit)\n- Set timeLimit to exactly ${customTimeLimit} seconds\n`
		}

		prompt += `- Link evidence to dialogue trees (people react to being confronted with evidence)

SCENE:
- if evidence is hidden and needs to be unlocked it still needs to be included in scene evidenceIds 

PHONE RECORDS:
- 4-6 calls showing timeline and relationships
- 4-6 texts with actual message content
- Include incriminating messages, timeline clues, suspicious communications
- Must be unlocked by collecting/analyzing phone evidence

BREAKING NEWS:
- 2-3 news items that unlock during investigation
- Triggers: "evidence-analyzed-X" or "person-interviewed-X" (replace X with number)
- Should reveal context, backstory, or new angles on the case

GENERAL TIPS:
- Make the mystery solvable but not obvious
- Include red herrings and false leads
- Ensure contradictions are catchable through careful questioning
- Create realistic motives for all suspects
- Timeline should be consistent and verifiable
- The culprit should have means, motive, and opportunity
- Design so player must collect evidence AND interrogate strategically to solve
`
		// time limit instruction
		if (!hasTimeLimit) {
			prompt += `- Do NOT include timeLimit field in the JSON output`
		} else if (defaultTimeLimit) {
			prompt += `- Generate a fair timeLimit value between 900-3600 seconds based on the case complexity`
		} else {
			prompt += `- Set timeLimit to exactly ${customTimeLimit} seconds`
		}

		prompt += `
	
`

		setCustomPrompt(prompt)
		setTimeout(() => window.scrollTo({ top: 99999, behavior: 'smooth' }), 0)
	}

	const onSubmit = (data: z.infer<typeof GenerateCaseSchema>) => {
		console.log(data)
		generateCustomPrompt(data)
	}

	return (
		<div className='min-h-screen bg-gray-900 text-gray-100 p-6'>
			<div className='max-w-5xl mx-auto space-y-6'>
				<h1 className='text-3xl font-bold mb-8'>Crime Case Prompt Generator</h1>

				<div className='bg-gray-800 rounded-lg p-6'>
					Use prompt to generate case. Then paste generated case into the text
					area below or upload a JSON file.
				</div>

				<div className='bg-gray-800 rounded-lg p-6'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						id='generateCaseForm'
						className='mb-6'
					>
						<Label
							htmlFor='generateCaseForm'
							className='text-xl font-semibold mb-6'
						>
							Customize case
						</Label>
						<FieldGroup className='gap-6'>
							<Controller
								name='caseType'
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Case type</FieldLabel>
										<Select
											{...field}
											onValueChange={field.onChange}
										>
											<SelectTrigger onBlur={field.onBlur}>
												<SelectValue placeholder='Case Type' />
											</SelectTrigger>
											<SelectContent>
												{CASE_TYPES.map((type) => (
													<SelectItem
														value={type.value}
														key={type.value}
													>
														{type.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{formState.errors[field.name]?.message && (
											<FieldError
												errors={[
													{ message: formState.errors[field.name]?.message },
												]}
											/>
										)}
									</Field>
								)}
							/>
							<Controller
								name='caseLanguage'
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Case language</FieldLabel>
										<Select
											{...field}
											onValueChange={field.onChange}
										>
											<SelectTrigger onBlur={field.onBlur}>
												<SelectValue placeholder='Select case language' />
											</SelectTrigger>
											<SelectContent>
												{CASE_LANGUAGES.map((lang) => (
													<SelectItem
														value={lang.value}
														key={lang.value}
													>
														{lang.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{formState.errors[field.name]?.message && (
											<FieldError
												errors={[
													{ message: formState.errors[field.name]?.message },
												]}
											/>
										)}
									</Field>
								)}
							/>
							<Controller
								name='caseSize'
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Case size</FieldLabel>
										<Select
											{...field}
											onValueChange={field.onChange}
										>
											<SelectTrigger onBlur={field.onBlur}>
												<SelectValue placeholder='Select case size' />
											</SelectTrigger>
											<SelectContent>
												{CASE_SIZES.map((size) => (
													<SelectItem
														value={size.value}
														key={size.value}
													>
														{size.label} - {size.description}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{formState.errors[field.name]?.message && (
											<FieldError
												errors={[
													{ message: formState.errors[field.name]?.message },
												]}
											/>
										)}
									</Field>
								)}
							/>
							<Controller
								name='hasTimeLimit'
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldContent className='flex flex-row items-center cursor-pointer'>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												id={field.name}
												className='cursor-pointer'
											/>
											<FieldLabel
												htmlFor={field.name}
												className='text-sm cursor-pointer'
											>
												Include time limit?
											</FieldLabel>
										</FieldContent>
										{formState.errors[field.name]?.message && (
											<FieldError
												errors={[
													{ message: formState.errors[field.name]?.message },
												]}
											/>
										)}
									</Field>
								)}
							/>
							{hasTimeLimit && (
								<Controller
									name='defaultTimeLimit'
									control={control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldContent className='flex flex-row items-center cursor-pointer'>
												<Checkbox
													// {...field}
													checked={field.value}
													onCheckedChange={field.onChange}
													id={field.name}
													className='cursor-pointer'
												/>
												<FieldLabel
													htmlFor={field.name}
													className='text-sm cursor-pointer'
												>
													Default time limit (900-3600s)
												</FieldLabel>
											</FieldContent>
											{formState.errors[field.name]?.message && (
												<FieldError
													errors={[
														{ message: formState.errors[field.name]?.message },
													]}
												/>
											)}
										</Field>
									)}
								/>
							)}
							{hasTimeLimit && !defaultTimeLimit && (
								<Controller
									name='customTimeLimit'
									control={control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel
												htmlFor={field.name}
												className='text-sm'
											>
												Custom time limit
											</FieldLabel>
											<Input
												{...field}
												id={field.name}
												placeholder='1500'
											/>
											{formState.errors[field.name]?.message && (
												<FieldError
													errors={[
														{ message: formState.errors[field.name]?.message },
													]}
												/>
											)}
										</Field>
									)}
								/>
							)}
							<Button className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer'>
								Customize Prompt
							</Button>
						</FieldGroup>
					</form>
				</div>
				{customPrompt && (
					<>
						<div className='bg-gray-800 rounded-lg p-6'>
							<div className='flex items-center justify-between mb-3'>
								<h2 className='text-xl font-semibold'>Customized Prompt</h2>
								<button
									onClick={() => copyToClipboard(customPrompt, setCopied)}
									className='flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors'
								>
									{copied ? <Check size={18} /> : <Copy size={18} />}
									{copied ? 'Copied!' : 'Copy'}
								</button>
							</div>
							<textarea
								readOnly
								value={customPrompt}
								className='w-full h-40 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>

						<div className='flex flex-col lg:flex-row gap-4'>
							<PasteGeneratedCase
								onSuccess={onFileUploadSuccess}
								onError={onFileUploadError}
							/>
							<UploadCase
								onSuccess={onFileUploadSuccess}
								onError={onFileUploadError}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
