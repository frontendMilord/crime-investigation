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

	const [caseType, setCaseType] = useState('Murder')
	const [hasTimeLimit, setHasTimeLimit] = useState(true)
	const [useDefaultTimeLimit, setUseDefaultTimeLimit] = useState(true)
	const [customTimeLimit, setCustomTimeLimit] = useState('1500')
	const [language, setLanguage] = useState('english')
	const [caseSize, setCaseSize] = useState('medium')

	const [customPrompt, setCustomPrompt] = useState('')

	const { cases, setCases } = useCaseStore()
	const navigate = useNavigate()

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

	const generateCustomPrompt = () => {
		let prompt = ''

		// Opening sentence
		if (caseType === 'random') {
			prompt += `Generate a detailed crime investigation case in JSON format with interactive dialogue trees and contradictions. Follow the structure, optional fields marked with "?". Create an engaging mystery with realistic clues and strategic interrogation paths.\n\n`
		} else {
			prompt += `Generate a detailed ${caseType} investigation case in JSON format with interactive dialogue trees and contradictions. Follow the structure, optional fields marked with "?". Create an engaging mystery with realistic clues and strategic interrogation paths.\n\n`
		}

		// Language instruction
		if (language !== 'english') {
			const langName = CASE_LANGUAGES.find((l) => l.value === language)?.label
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
		} else if (useDefaultTimeLimit) {
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
		} else if (useDefaultTimeLimit) {
			prompt += `- Generate a fair timeLimit value between 900-3600 seconds based on the case complexity`
		} else {
			prompt += `- Set timeLimit to exactly ${customTimeLimit} seconds`
		}

		prompt += `
	
`

		setCustomPrompt(prompt)
		setTimeout(() => window.scrollTo({ top: 99999, behavior: 'smooth' }), 0)
	}

	const isFormValid =
		!hasTimeLimit ||
		useDefaultTimeLimit ||
		(customTimeLimit &&
			!isNaN(Number(customTimeLimit)) &&
			Number(customTimeLimit) > 0)

	return (
		<div className='min-h-screen bg-gray-900 text-gray-100 p-6'>
			<div className='max-w-5xl mx-auto space-y-6'>
				<h1 className='text-3xl font-bold mb-8'>Crime Case Prompt Generator</h1>

				<div className='bg-gray-800 rounded-lg p-6'>
					Use prompt to generate case. Then paste generated case into the text
					area below or upload a JSON file.
				</div>

				<div className='bg-gray-800 rounded-lg p-6'>
					<h2 className='text-xl font-semibold mb-6'>Customize case</h2>
					<div className='space-y-6'>
						<div>
							<label className='block text-sm font-medium mb-2'>
								Case Type
							</label>
							<select
								value={caseType}
								onChange={(e) => setCaseType(e.target.value)}
								className='w-full bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								{CASE_TYPES.map((type) => (
									<option
										key={type.value}
										value={type.value}
									>
										{type.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='flex items-center gap-2 mb-3'>
								<input
									type='checkbox'
									checked={hasTimeLimit}
									onChange={(e) => setHasTimeLimit(e.target.checked)}
									className='w-5 h-5 bg-gray-900 rounded border-gray-600 focus:ring-2 focus:ring-blue-500'
								/>
								<span className='text-sm font-medium'>Include Time Limit</span>
							</label>

							{hasTimeLimit && (
								<div className='ml-7 space-y-3'>
									<label className='flex items-center gap-2'>
										<input
											type='checkbox'
											checked={useDefaultTimeLimit}
											onChange={(e) => setUseDefaultTimeLimit(e.target.checked)}
											className='w-5 h-5 bg-gray-900 rounded border-gray-600 focus:ring-2 focus:ring-blue-500'
										/>
										<span className='text-sm font-medium'>
											Default Time Limit (900-3600s)
										</span>
									</label>

									{!useDefaultTimeLimit && (
										<div>
											<label className='block text-sm font-medium mb-2'>
												Custom Time Limit (seconds)
											</label>
											<input
												type='number'
												value={customTimeLimit}
												onChange={(e) => setCustomTimeLimit(e.target.value)}
												min='1'
												className='w-full bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
												placeholder='Enter time limit in seconds'
											/>
										</div>
									)}
								</div>
							)}
						</div>

						<div>
							<label className='block text-sm font-medium mb-2'>Language</label>
							<select
								value={language}
								onChange={(e) => setLanguage(e.target.value)}
								className='w-full bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								{CASE_LANGUAGES.map((lang) => (
									<option
										key={lang.value}
										value={lang.value}
									>
										{lang.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm font-medium mb-2'>
								Case Size
							</label>
							<select
								value={caseSize}
								onChange={(e) => setCaseSize(e.target.value)}
								className='w-full bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								{CASE_SIZES.map((size) => (
									<option
										key={size.value}
										value={size.value}
									>
										{size.label} - {size.description}
									</option>
								))}
							</select>
						</div>

						<button
							onClick={generateCustomPrompt}
							disabled={!isFormValid}
							className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors'
						>
							Customize Prompt
						</button>
					</div>
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
