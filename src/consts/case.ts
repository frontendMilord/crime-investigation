import type { ICase } from '../types'

// export const defaultCases: ICase[] = []

export const PROMT_FOR_AI_CASE_GENERATION = `Generate a detailed crime investigation case in JSON format with interactive dialogue trees and contradictions. Create an engaging mystery with realistic clues and strategic interrogation paths.

STRUCTURE:
{
  "title": "Case Name",
  "type": "Murder/Theft/Kidnapping/etc",
  "victim": "Victim Name",
  "timeLimit": 1500,
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
      "hidden": false,
      "unlockedBy": "ev2"
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
      "availability": "ev3",
      "initialStatement": "Their first statement when questioned",
      "interviewed": false,
      "dialogueTrees": [
        {
          "id": "tree1",
          "question": "Question to ask",
          "asked": false,
          "requiresEvidence": "ev1",
          "requiresPerson": "person2",
          "requiresResponse": "tree3-r1",
          "responses": [
            {
              "id": "r1",
              "text": "Their response text",
              "followUps": ["tree2", "tree3"],
              "revealsDetail": "Key information revealed",
              "revealsContradiction": "contradiction-id"
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
      "availability": "ev1",
      "initialStatement": "Their anonymous statement",
      "interviewed": false,
      "contradictions": [],
			"dialogueTrees": []
    }
  ],
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
  ],
  "solution": {
    "culprit": "person1",
    "motive": "Detailed explanation of why they did it",
    "method": "Detailed explanation of how they committed the crime"
  }
}

CRITICAL REQUIREMENTS:

DIALOGUE TREES:
- Each person should have 5-8 dialogue trees
- Create branching paths: early questions unlock later ones via "followUps"
- Use "requiresEvidence" for questions that need analyzed evidence
- Use "requiresPerson" + "requiresResponse" for cross-interrogation (confronting with other people's statements)
- Some trees should be available immediately, others locked behind requirements
- Include "revealsDetail" for important clues discovered through questioning
- Design trees so asking questions in different orders reveals different information

CONTRADICTIONS:
- Each suspect should have 2-3 potential contradictions
- Format: "tree1-r1" means response r1 from tree1
- Contradictions should be subtle - require player to notice inconsistencies
- Only suspects need contradictions, witnesses don't

PEOPLE TYPES:
- type: "suspect" = potential culprits (3-4 people)
- type: "witness" = witnesses who provide information (2-3 people)
- Suspects: more complex dialogue trees, contradictions, motives
- Witnesses: simpler trees, provide observations and tips
- Use "available: false" + "availability: evidence-id" to lock witnesses behind evidence collection

EVIDENCE:
- 8-12 pieces of evidence across 3-4 locations
- Use "hidden: true" + "unlockedBy: evidence-id" for sequential discovery (finding X reveals Y)
- analysisResult should contain specific, useful information
- Some evidence should point to wrong suspects (red herrings)
- Set timeToProcess for each piece of evidence in seconds based on how long it takes to process (from 5 to 300)
- Link evidence to dialogue trees (people react to being confronted with evidence)

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
- timeLimit is optional (in seconds:900-3600), omit for unlimited time
`

export const defaultCases: ICase[] = [
	{
		id: 'case-001',
		title: 'Midnight at the Marina',
		type: 'Murder',
		victim: 'Lucas Byrne',
		timeLimit: 1800,
		briefing:
			"At 23:40, Lucas Byrne, a 38-year-old yacht broker, was found dead aboard his boat 'The Silver Current' moored at Havenport Marina. The cause of death appears to be blunt force trauma to the head. The area was locked from the inside, with no immediate signs of struggle. Several individuals connected to Byrne—his business partner, ex-girlfriend, and a client—were at the marina earlier that evening. Investigators must determine who had the motive, means, and opportunity.",
		scene: [
			{
				id: 'marina_dock',
				name: 'Havenport Marina Dock',
				description:
					"Wooden dock lit by dim security lights. Several moored yachts. Footprints in drying mud lead toward 'The Silver Current'.",
				evidenceIds: ['ev1', 'ev2', 'ev3'],
				examined: false,
			},
			{
				id: 'yacht_cabin',
				name: 'Yacht Cabin',
				description:
					'Confined cabin space. A desk cluttered with documents and a half-empty whiskey glass. Blood stains near the corner table.',
				evidenceIds: ['ev4', 'ev5', 'ev6'],
				examined: false,
			},
			{
				id: 'marina_office',
				name: 'Marina Office',
				description:
					'A cramped administrative office with CCTV monitors. Smells of coffee and salt. A phone log book sits on the counter.',
				evidenceIds: ['ev7', 'ev8', 'ev9'],
				examined: false,
			},
		],
		evidence: [
			{
				id: 'ev1',
				name: 'Bloody Wrench',
				description:
					'A heavy wrench with faint blood traces found behind a crate near the dock.',
				location: 'marina_dock',
				collected: false,
				timeToProcess: 5,
				analyzed: false,
				analysisResult:
					'DNA confirms the victim’s blood. Partial fingerprint belongs to Hannah Reed (victim’s ex).',
				hidden: false,
			},
			{
				id: 'ev2',
				name: 'Dock Camera Footage',
				description: 'CCTV feed covering 22:00–00:00 from the marina entrance.',
				location: 'marina_office',
				collected: false,
				timeToProcess: 10,
				analyzed: false,
				analysisResult:
					'Footage shows Alan Cross (business partner) entering the dock at 22:35 and leaving at 23:05. No sign of forced entry afterward.',
				hidden: false,
			},
			{
				id: 'ev3',
				name: 'Boot Print Cast',
				description: 'Single partial footprint near yacht ramp.',
				location: 'marina_dock',
				collected: false,
				timeToProcess: 15,
				analyzed: false,
				analysisResult:
					'Matches a size 10 hiking boot; brand linked to a store receipt later found in Mia’s car.',
				hidden: false,
			},
			{
				id: 'ev4',
				name: 'Whiskey Glass',
				description: 'Half-empty glass on the yacht’s desk.',
				location: 'yacht_cabin',
				collected: false,
				timeToProcess: 30,
				analyzed: false,
				analysisResult:
					'Contains fingerprints of Lucas Byrne and Alan Cross. Traces of sedatives found in the liquid.',
				hidden: false,
			},
			{
				id: 'ev5',
				name: 'Financial Ledger',
				description:
					'A handwritten notebook showing recent yacht sales and commission splits.',
				location: 'yacht_cabin',
				collected: false,
				timeToProcess: 20,
				analyzed: false,
				analysisResult:
					'Reveals $80,000 missing from joint business account, likely embezzled by Alan Cross.',
				hidden: false,
			},
			{
				id: 'ev6',
				name: 'Victim’s Phone',
				description:
					'Smartphone found near the victim’s chair, screen cracked.',
				location: 'yacht_cabin',
				collected: false,
				timeToProcess: 60,
				analyzed: false,
				analysisResult:
					'Unlocks message history revealing threats from Hannah and a warning from an unknown number.',
				hidden: false,
			},
			{
				id: 'ev7',
				name: 'Anonymous Tip Note',
				description: 'Folded note left at marina office desk.',
				location: 'marina_office',
				collected: false,
				timeToProcess: 20,
				analyzed: false,
				analysisResult:
					"Handwriting matches Mia Torres. Note warns 'Lucas isn’t who he seems. He’ll hurt someone tonight.'",
				hidden: false,
			},
			{
				id: 'ev8',
				name: 'Receipt - Hiking Store',
				description: 'Receipt dated same day for size 10 hiking boots.',
				location: 'marina_office',
				collected: false,
				timeToProcess: 10,
				analyzed: false,
				analysisResult: 'Paid by Mia Torres in cash. Timestamp 18:15.',
				hidden: true,
				unlockedBy: 'ev3',
			},
			{
				id: 'ev9',
				name: 'Security Log Book',
				description: 'Handwritten record of visitor entries at marina gate.',
				location: 'marina_office',
				collected: false,
				timeToProcess: 60,
				analyzed: false,
				analysisResult:
					'Shows Hannah Reed signed in at 21:55, left blank for exit time.',
				hidden: false,
			},
		],
		people: [
			{
				id: 'person1',
				name: 'Alan Cross',
				age: 42,
				occupation: 'Business Partner',
				relationship: 'Co-owner of Byrne & Cross Yacht Sales',
				type: 'suspect',
				available: true,
				availability: '',
				initialStatement:
					'I came by to discuss financials, left before midnight. Lucas was alive when I left.',
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: 'Ask about business relationship with Lucas',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'We were partners for six years. Things got tense lately because of money issues.',
								followUps: ['tree2'],
								revealsDetail: 'Confirms financial conflict motive.',
								revealsContradiction: '',
							},
						],
					},
					{
						id: 'tree2',
						question: 'Confront him about missing $80,000 (requires ledger)',
						asked: false,
						requiresEvidence: 'ev5',
						responses: [
							{
								id: 'r1',
								text: "That ledger's wrong. Lucas was moving cash around; I didn’t touch it.",
								followUps: ['tree3'],
								revealsDetail:
									'Denies embezzlement, implies Lucas manipulated books.',
								revealsContradiction: 'contradiction1',
							},
						],
					},
					{
						id: 'tree3',
						question: 'Ask about whiskey glass (requires glass analysis)',
						asked: false,
						requiresEvidence: 'ev4',
						responses: [
							{
								id: 'r1',
								text: 'We had a drink, sure. Just one glass, no drugs or anything like that.',
								followUps: ['tree4'],
								revealsDetail:
									'He confirms drinking together shortly before death.',
								revealsContradiction: 'contradiction2',
							},
						],
					},
					{
						id: 'tree4',
						question: 'Ask where he went after leaving marina',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Straight home. CCTV should show me leaving at 23:05.',
								followUps: ['tree5'],
								revealsDetail: 'Matches footage timing from ev2.',
								revealsContradiction: '',
							},
						],
					},
					{
						id: 'tree5',
						question:
							'Confront about Hannah’s presence (requires Hannah’s statement)',
						asked: false,
						requiresPerson: 'person2',
						requiresResponse: 'tree3-r1',
						responses: [
							{
								id: 'r1',
								text: 'I didn’t see her there. Maybe she came after me.',
								followUps: [],
								revealsDetail: 'Downplays overlap of presence with Hannah.',
								revealsContradiction: 'contradiction3',
							},
						],
					},
				],
				contradictions: [
					{
						id: 'contradiction1',
						response1: 'tree1-r1',
						response2: 'tree2-r1',
						description:
							'Alan first admits money tension, then denies any financial misdeeds when ledger surfaces.',
						caught: false,
					},
					{
						id: 'contradiction2',
						response1: 'tree3-r1',
						response2: 'tree4-r1',
						description:
							'Alan says they drank once but evidence shows sedatives in the glass he touched.',
						caught: false,
					},
					{
						id: 'contradiction3',
						response1: 'tree4-r1',
						response2: 'tree5-r1',
						description:
							'Alan claims to have left at 23:05, but CCTV indicates Hannah arrived before he left.',
						caught: false,
					},
				],
			},
			{
				id: 'person2',
				name: 'Hannah Reed',
				age: 35,
				occupation: 'Freelance Designer',
				relationship: 'Victim’s ex-girlfriend',
				type: 'suspect',
				available: true,
				availability: '',
				initialStatement:
					'I came to return his house key and left. I didn’t even go aboard.',
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: 'Ask about reason for visit',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'We broke up weeks ago. I only came to give back his key.',
								followUps: ['tree2'],
								revealsDetail: 'Claims minimal contact with Lucas recently.',
								revealsContradiction: '',
							},
						],
					},
					{
						id: 'tree2',
						question: 'Confront her with security log (requires ev9)',
						asked: false,
						requiresEvidence: 'ev9',
						responses: [
							{
								id: 'r1',
								text: 'Yes, I signed in. Didn’t realize they track exits too.',
								followUps: ['tree3'],
								revealsDetail: 'Admits presence at marina, no proof of exit.',
								revealsContradiction: 'contradiction1',
							},
						],
					},
					{
						id: 'tree3',
						question: 'Ask about her fingerprint on wrench (requires ev1)',
						asked: false,
						requiresEvidence: 'ev1',
						responses: [
							{
								id: 'r1',
								text: 'I worked on my own boat nearby last week. Maybe I touched it then.',
								followUps: ['tree4'],
								revealsDetail: 'Attempts to explain fingerprint presence.',
								revealsContradiction: 'contradiction2',
							},
						],
					},
					{
						id: 'tree4',
						question:
							'Ask about threatening messages on victim’s phone (requires ev6)',
						asked: false,
						requiresEvidence: 'ev6',
						responses: [
							{
								id: 'r1',
								text: 'I was angry, yes. But I’d never hurt him.',
								followUps: [],
								revealsDetail: 'Admits sending messages but denies violence.',
								revealsContradiction: 'contradiction3',
							},
						],
					},
				],
				contradictions: [
					{
						id: 'contradiction1',
						response1: 'tree1-r1',
						response2: 'tree2-r1',
						description:
							'Claims brief visit to return key but doesn’t log departure.',
						caught: false,
					},
					{
						id: 'contradiction2',
						response1: 'tree3-r1',
						response2: 'tree4-r1',
						description:
							'Says she was nearby last week but sent threatening texts that same night.',
						caught: false,
					},
					{
						id: 'contradiction3',
						response1: 'tree2-r1',
						response2: 'tree3-r1',
						description:
							'Her fingerprint explanation contradicts her claim of not boarding any yacht that night.',
						caught: false,
					},
				],
			},
			{
				id: 'person3',
				name: 'Mia Torres',
				age: 29,
				occupation: 'Real Estate Agent',
				relationship: 'Recent client of victim',
				type: 'suspect',
				available: true,
				availability: '',
				initialStatement:
					'I came to finalize the sale paperwork, left around 22:00.',
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: 'Ask about note left at office',
						asked: false,
						requiresEvidence: 'ev7',
						responses: [
							{
								id: 'r1',
								text: 'Yes, I wrote it. Lucas was threatening to cancel my purchase unfairly.',
								followUps: ['tree2'],
								revealsDetail: 'Confirms authorship of anonymous note.',
								revealsContradiction: '',
							},
						],
					},
					{
						id: 'tree2',
						question: 'Ask about new hiking boots (requires ev8)',
						asked: false,
						requiresEvidence: 'ev8',
						responses: [
							{
								id: 'r1',
								text: 'I bought them for a hiking trip, not for sneaking around docks.',
								followUps: ['tree3'],
								revealsDetail:
									'Matches boot print evidence but denies involvement.',
								revealsContradiction: 'contradiction1',
							},
						],
					},
					{
						id: 'tree3',
						question: 'Ask if she saw anyone near the yacht',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'I saw Alan’s car still parked when I left. Didn’t see Hannah.',
								followUps: [],
								revealsDetail: 'Places Alan at scene around 22:00–23:00.',
								revealsContradiction: '',
							},
						],
					},
				],
				contradictions: [
					{
						id: 'contradiction1',
						response1: 'tree1-r1',
						response2: 'tree2-r1',
						description:
							'Says she was angry at Lucas but denies sneaking around despite matching footprint and anonymous warning.',
						caught: false,
					},
				],
			},
			{
				id: 'person4',
				name: 'Anonymous Caller',
				age: 0,
				occupation: 'Unknown',
				relationship: 'Anonymous tip',
				type: 'witness',
				available: false,
				availability: 'ev6',
				initialStatement:
					'There’s something wrong at the marina tonight. Lucas is in danger.',
				interviewed: false,
				contradictions: [],
				dialogueTrees: [],
			},
		],
		phoneRecords: {
			unlockedBy: 'ev6',
			calls: [
				{
					time: '21:10',
					from: 'Hannah Reed',
					to: 'Lucas Byrne',
					duration: '2 min',
				},
				{
					time: '22:05',
					from: 'Alan Cross',
					to: 'Lucas Byrne',
					duration: '4 min',
				},
				{
					time: '22:48',
					from: 'Unknown Number',
					to: 'Lucas Byrne',
					duration: '1 min',
				},
				{
					time: '23:02',
					from: 'Lucas Byrne',
					to: 'Mia Torres',
					duration: 'No answer',
				},
			],
			texts: [
				{
					time: '21:15',
					from: 'Hannah Reed',
					to: 'Lucas Byrne',
					message: 'You’ll regret lying to me again.',
					read: true,
				},
				{
					time: '22:32',
					from: 'Alan Cross',
					to: 'Lucas Byrne',
					message: 'We need to settle this tonight.',
					read: true,
				},
				{
					time: '22:50',
					from: 'Unknown',
					to: 'Lucas Byrne',
					message: 'She knows. Get rid of the records.',
					read: false,
				},
				{
					time: '23:00',
					from: 'Lucas Byrne',
					to: 'Alan Cross',
					message: 'Meet me in the cabin now.',
					read: false,
				},
			],
		},
		breakingNews: [
			{
				id: 'news1',
				triggerCondition: 'evidence-analyzed-5',
				headline: 'Local Business Under Fraud Investigation',
				content:
					'Police confirm ongoing inquiry into Byrne & Cross Yacht Sales over embezzlement allegations.',
				revealed: false,
			},
			{
				id: 'news2',
				triggerCondition: 'person-interviewed-2',
				headline: 'Tensions Surface Between Victim and Ex-Partner',
				content:
					'Sources reveal heated breakup and financial disputes between Lucas Byrne and Hannah Reed.',
				revealed: false,
			},
		],
		solution: {
			culprit: 'person1',
			motive:
				'Alan Cross embezzled funds from their joint account. Lucas discovered it and intended to report him. Alan drugged Lucas’s drink, struck him with the wrench, and staged an exit to make it appear he left early.',
			method:
				'Alan mixed sedatives into Lucas’s whiskey, waited for him to weaken, and killed him using a wrench from the dock maintenance kit. He left the wrench behind a crate and exited before midnight.',
		},
	},
]
