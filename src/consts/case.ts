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
		title: 'The Midnight Composer',
		type: 'Murder',
		victim: 'Victor Ashford',
		timeLimit: 3600,
		briefing:
			'Renowned pianist Victor Ashford, 52, was found dead in his soundproof music studio at 2:47 AM. Initial examination suggests poisoning. The studio was locked from inside. Three individuals had access to the building that evening.',
		scene: [
			{
				id: 'studio',
				name: 'Music Studio',
				description:
					'A luxurious soundproof room with a grand piano. The victim is slumped over the keys. A wine glass sits on the piano, half empty.',
				evidenceIds: ['wine-glass', 'sheet-music', 'phone'],
				examined: false,
			},
			{
				id: 'kitchen',
				name: 'Kitchen',
				description:
					'Modern kitchen with marble countertops. A wine bottle stands open on the counter. Dishes are neatly arranged.',
				evidenceIds: ['wine-bottle', 'medication'],
				examined: false,
			},
			{
				id: 'entrance',
				name: 'Building Entrance',
				description:
					'Secure entrance with keycard access. Security camera footage shows three people entering before midnight.',
				evidenceIds: ['security-footage', 'guest-log'],
				examined: false,
			},
			{
				id: 'bedroom',
				name: 'Master Bedroom',
				description:
					'Elegantly furnished bedroom. A desk sits in the corner with papers scattered across it.',
				evidenceIds: ['hidden-will', 'locked-drawer'],
				examined: false,
			},
		],
		evidence: [
			{
				id: 'wine-glass',
				name: 'Wine Glass',
				description: 'Half-empty wine glass with lipstick marks on the rim',
				location: 'studio',
				collected: false,
				analyzed: false,
				analysisResult:
					'Contains traces of digitalis (foxglove poison). Lipstick shade: Crimson Rouge #23',
			},
			{
				id: 'sheet-music',
				name: 'Sheet Music',
				description: 'Handwritten musical composition titled "Final Symphony"',
				location: 'studio',
				collected: false,
				analyzed: false,
				analysisResult:
					'Written yesterday. Lyrics mention "betrayal" and "the student surpasses the master"',
			},
			{
				id: 'phone',
				name: "Victim's Phone",
				description: 'Smartphone found next to the body, still unlocked',
				location: 'studio',
				collected: false,
				analyzed: false,
				analysisResult:
					'Contains call logs and text messages from the evening. Last activity at 11:47 PM.',
			},
			{
				id: 'wine-bottle',
				name: 'Wine Bottle',
				description: '2019 Bordeaux, expensive vintage, recently opened',
				location: 'kitchen',
				collected: false,
				analyzed: false,
				analysisResult:
					'No toxins detected in bottle. Only one glass poured. Fingerprints: victim and one other person',
			},
			{
				id: 'medication',
				name: 'Medication Bottles',
				description: 'Various prescription bottles in cabinet',
				location: 'kitchen',
				collected: false,
				analyzed: false,
				analysisResult:
					'Heart medication for victim. Also: digitalis pills prescribed to "E. Ashford" for cardiac arrhythmia',
			},
			{
				id: 'security-footage',
				name: 'Security Footage',
				description: 'CCTV recordings from evening',
				location: 'entrance',
				collected: false,
				analyzed: false,
				analysisResult:
					'Shows: Elena Ashford entering at 8:15 PM, Marcus Chen at 9:30 PM, Diana Volkov at 10:45 PM. All left by 11:30 PM except Elena who stayed until 1:00 AM',
			},
			{
				id: 'guest-log',
				name: 'Guest Sign-In Log',
				description: 'Physical logbook at entrance',
				location: 'entrance',
				collected: false,
				analyzed: false,
				analysisResult:
					'All three visitors signed in. Elena wrote "family dinner", Marcus wrote "lesson", Diana wrote "business discussion"',
			},
			{
				id: 'locked-drawer',
				name: 'Locked Drawer',
				description: 'A locked drawer in the bedroom desk. Requires a key.',
				location: 'bedroom',
				collected: false,
				analyzed: false,
				analysisResult:
					'Contains financial documents showing Victor planned to donate his entire estate to a music school, cutting Elena out of inheritance.',
			},
			{
				id: 'hidden-will',
				name: 'Draft Will',
				description: 'A document hidden behind a photo frame',
				location: 'bedroom',
				collected: false,
				analyzed: false,
				hidden: true,
				unlockedBy: 'locked-drawer',
				analysisResult:
					'Draft will dated three days ago. Victor planned to leave everything to Marcus Chen and a music scholarship fund. Elena mentioned as "estranged daughter - nothing".',
			},
		],
		people: [
			{
				id: 'elena',
				name: 'Elena Ashford',
				age: 28,
				occupation: 'Medical Resident',
				relationship: "Victim's daughter",
				type: 'suspect',
				available: true,
				initialStatement:
					'I came for dinner with father around 8 PM. We had a pleasant evening. I left around 11 PM and he seemed fine.',
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: 'Tell me about your relationship with your father.',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'We were very close. He supported all my decisions.',
								followUps: ['tree2', 'tree3'],
							},
						],
					},
					{
						id: 'tree2',
						question:
							'The security footage shows you leaving at 1 AM, not 11 PM. Why did you lie?',
						requiresEvidence: 'security-footage',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: '*nervously* Oh... I must have lost track of time. I stayed to help clean up after dinner.',
								followUps: ['tree4'],
								revealsContradiction: 'elena-time-lie',
							},
						],
					},
					{
						id: 'tree3',
						question: 'What did you talk about during dinner?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Just catching up. Work, family matters, nothing important.',
								followUps: ['tree5'],
							},
						],
					},
					{
						id: 'tree4',
						question: 'What were you cleaning for three hours?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Look, we argued, okay? About his will. He wanted to leave everything to that boy Marcus. After everything I sacrificed!',
								revealsDetail: 'Elena knew about the will change and was angry',
								followUps: ['tree6'],
							},
						],
					},
					{
						id: 'tree5',
						question: 'Did he mention anything about his will or estate?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "No, why would he? That's morbid dinner conversation.",
								revealsContradiction: 'elena-will-knowledge',
							},
						],
					},
					{
						id: 'tree6',
						question:
							'You have access to digitalis through your work. Did you poison your father?',
						requiresEvidence: 'medication',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "I would never! Yes, I was angry, but I'm a doctor. I save lives, I don't take them!",
								followUps: [],
							},
						],
					},
				],
				contradictions: [
					{
						id: 'elena-time-lie',
						response1: 'tree1-r1',
						response2: 'tree2-r1',
						description:
							'Elena claimed she left at 11 PM but security footage shows 1 AM. She admitted to lying about the time.',
						caught: false,
					},
					{
						id: 'elena-will-knowledge',
						response1: 'tree3-r1',
						response2: 'tree4-r1',
						description:
							'Elena first said they talked about nothing important, but later admitted they argued about the will. She knew about the inheritance change.',
						caught: false,
					},
				],
			},
			{
				id: 'marcus',
				name: 'Marcus Chen',
				age: 24,
				occupation: 'Piano Student',
				relationship: "Victim's protégé",
				type: 'suspect',
				available: true,
				initialStatement:
					'I had my weekly lesson with Victor from 9:30 to 10:30 PM. He was in great spirits, very energetic. I left right after the lesson ended.',
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: 'How long have you known Victor?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Three years. He changed my life completely. He was like a father to me.',
								followUps: ['tree2', 'tree3'],
							},
						],
					},
					{
						id: 'tree2',
						question:
							'Did you know Victor was planning to leave you his estate?',
						requiresEvidence: 'hidden-will',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "What? No! I had no idea. That's... that's incredibly generous but I never expected anything like that.",
								revealsDetail:
									"Marcus claims he didn't know about the inheritance",
								followUps: ['tree4'],
							},
						],
					},
					{
						id: 'tree3',
						question: 'Did you see anyone else that evening?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Diana was there arguing with Victor when I arrived. Elena came in as I was leaving around 10:30.',
								followUps: ['tree5'],
							},
						],
					},
					{
						id: 'tree4',
						question: "You're saying you had no financial motive?",
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Motive? I loved Victor! He was my mentor. I would never hurt him, inheritance or not.',
								followUps: [],
							},
						],
					},
					{
						id: 'tree5',
						question: 'What was Diana arguing with Victor about?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Money, as always. She was furious about him wanting to break their contract. I heard her threaten him.',
								revealsDetail: 'Diana threatened Victor according to Marcus',
								followUps: [],
							},
						],
					},
				],
				contradictions: [],
			},
			{
				id: 'diana',
				name: 'Diana Volkov',
				age: 45,
				occupation: 'Music Agent',
				relationship: "Victim's ex-wife and manager",
				type: 'suspect',
				available: true,
				initialStatement:
					'I met with Victor from 10:45 to 11:30 PM to discuss his tour. It was a business meeting. He was alive when I left.',
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: 'What was the nature of your meeting?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Strictly business. We were discussing his upcoming European tour and the contract terms.',
								followUps: ['tree2', 'tree3'],
							},
						],
					},
					{
						id: 'tree2',
						question: 'Marcus says you threatened Victor. Is that true?',
						requiresPerson: 'marcus',
						requiresResponse: 'tree5-r1',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "*angry* That boy misunderstood! I said breaking the contract would have legal consequences. That's not a threat, it's a fact!",
								followUps: ['tree4'],
							},
						],
					},
					{
						id: 'tree3',
						question:
							'How much money would you lose if Victor broke the contract?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "Over two million in commissions and future earnings. But I didn't kill him over it! I could have sued.",
								revealsDetail: 'Diana had millions at stake',
								followUps: [],
							},
						],
					},
					{
						id: 'tree4',
						question: 'Do you wear lipstick?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "Never. I'm severely allergic. Everyone who knows me knows that.",
								followUps: ['tree5'],
							},
						],
					},
					{
						id: 'tree5',
						question: 'The wine glass had lipstick on it. If not yours, whose?',
						requiresEvidence: 'wine-glass',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "Obviously Elena's! She was there for hours. She probably tried to frame me because she hates me.",
								revealsDetail: 'Diana suspects Elena tried to frame her',
								followUps: [],
							},
						],
					},
				],
				contradictions: [],
			},
			{
				id: 'witness1',
				name: 'Mrs. Johnson',
				age: 67,
				occupation: 'Neighbor',
				relationship: 'Lives in apartment 4B',
				type: 'witness',
				available: true,
				initialStatement:
					"I heard shouting from Victor's apartment around 8 PM. A woman's voice, very angry. They were arguing about money or inheritance.",
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: "Can you describe the woman's voice you heard?",
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Young, educated. She kept saying "after everything I\'ve done" and "you can\'t do this to me."',
								revealsDetail: 'Young woman argued about being cut off',
								followUps: ['tree2'],
							},
						],
					},
					{
						id: 'tree2',
						question: 'Did you see anyone leave the building?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'I saw a young woman in a dark coat leaving very late, past midnight. She looked distressed.',
								followUps: ['tree3'],
							},
						],
					},
					{
						id: 'tree3',
						question: 'What else did you notice that evening?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "The piano music stopped abruptly around 11:45. Victor usually plays until at least 1 AM. That's when I knew something was wrong.",
								revealsDetail:
									'Music stopped at 11:45 PM - possible time of death',
								followUps: [],
							},
						],
					},
				],
				contradictions: [],
			},
			{
				id: 'witness2',
				name: 'David Park',
				age: 34,
				occupation: 'Security Guard',
				relationship: 'Building security',
				type: 'witness',
				available: true,
				initialStatement:
					'I was on duty until midnight. Everyone who came in signed the log. Elena seemed upset when she arrived.',
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: "Tell me about Elena's behavior.",
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'She was clearly stressed. Rushed past me without her usual greeting. Then around 11 PM, she came back down saying she forgot something and went back up.',
								revealsDetail: 'Elena made two trips - once at 11 PM',
								followUps: ['tree2'],
							},
						],
					},
					{
						id: 'tree2',
						question: 'What do you think she forgot?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: "She didn't have anything with her when she went back up. Now that I think about it, that was strange.",
								revealsDetail: 'Elena went back empty-handed - suspicious',
								followUps: [],
							},
						],
					},
					{
						id: 'tree3',
						question: 'Did you hear the argument between Diana and Victor?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: 'Oh yes, very loud. She was shouting about contracts and lawyers. Victor told her to leave. She stormed out at 11:30.',
								followUps: [],
							},
						],
					},
				],
				contradictions: [],
			},
			{
				id: 'witness3',
				name: 'Anonymous Caller',
				age: 0,
				occupation: 'Unknown',
				relationship: 'Anonymous tip',
				type: 'witness',
				available: false,
				availability: 'locked-drawer',
				initialStatement:
					'This is anonymous. I saw Elena Ashford at a pharmacy two days ago asking about digitalis and lethal dosages.',
				interviewed: false,
				dialogueTrees: [
					{
						id: 'tree1',
						question: 'Why are you calling anonymously?',
						asked: false,
						responses: [
							{
								id: 'r1',
								text: '*phone hangs up*',
								followUps: [],
							},
						],
					},
				],
				contradictions: [],
			},
		],
		phoneRecords: {
			unlockedBy: 'phone',
			calls: [
				{
					time: '19:30',
					from: 'Marcus Chen',
					to: 'Victor Ashford',
					duration: '2 min',
				},
				{
					time: '20:15',
					from: 'Elena Ashford',
					to: 'Victor Ashford',
					duration: '8 min',
				},
				{
					time: '22:45',
					from: 'Diana Volkov',
					to: 'Victor Ashford',
					duration: '15 min',
				},
				{
					time: '23:10',
					from: 'Victor Ashford',
					to: 'Attorney Office',
					duration: '4 min',
				},
			],
			texts: [
				{
					time: '18:45',
					from: 'Marcus Chen',
					to: 'Victor Ashford',
					message:
						"Looking forward to tonight's lesson! I've been practicing the new piece.",
					read: true,
				},
				{
					time: '22:50',
					from: 'Diana Volkov',
					to: 'Victor Ashford',
					message: "We need to talk about the contract. This isn't over.",
					read: true,
				},
				{
					time: '23:15',
					from: 'Elena Ashford',
					to: 'Unknown Number',
					message: "It's done. He won't be changing that will now.",
					read: false,
				},
				{
					time: '23:47',
					from: 'Attorney Office',
					to: 'Victor Ashford',
					message:
						'Confirming appointment tomorrow at 10 AM to finalize the new will. See you then.',
					read: true,
				},
			],
		},
		breakingNews: [
			{
				id: 'news1',
				triggerCondition: 'evidence-analyzed-3',
				headline: "BREAKING: Victim's Will Changed Days Before Death",
				content:
					'Sources close to the investigation reveal that Victor Ashford had scheduled an appointment with his attorney to finalize a new will. The meeting was set for the day after his death. According to sources, the new will would have dramatically changed the inheritance distribution.',
				revealed: false,
			},
			{
				id: 'news2',
				triggerCondition: 'person-interviewed-3',
				headline: 'Financial Records Show Victim Owed Millions',
				content:
					'Financial investigators have uncovered that Victor Ashford owed significant commissions to his ex-wife and manager, Diana Volkov. The debt exceeded $2 million and was due within the month. Breaking the management contract would have left Volkov with nothing.',
				revealed: false,
			},
		],
		solution: {
			culprit: 'elena',
			motive:
				'Elena discovered her father was terminally ill and planned to leave his estate to Marcus. She poisoned him to secure her inheritance before he could change his will.',
			method:
				'Used digitalis from her own prescription to poison the wine glass after pouring it for her father. The lipstick was deliberately applied to frame Diana.',
		},
	},
]
