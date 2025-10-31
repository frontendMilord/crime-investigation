import { Clock, Upload, Copy } from 'lucide-react'
import type { ICase } from '../types'
import { formatTime } from '../utils'
import { PROMT_FOR_AI_CASE_GENERATION } from '../consts/case'
import { CaseSchema } from '../schemas/case'
import { toast } from 'react-toastify'
import { useState } from 'react'

export interface IMenuProps {
	cases: ICase[]
	startCase: (id: string) => void
	setCases: (cases: ICase[]) => void
}
const Menu = ({ cases, startCase, setCases }: IMenuProps) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(PROMT_FOR_AI_CASE_GENERATION)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const text = e.target?.result as string
				const json = JSON.parse(text)
				const parsed = CaseSchema.parse(json)
				const newCase: ICase = {
					...parsed,
					id: `case-${Date.now()}`,
				}
				setCases([...cases, newCase])
				toast.success('Case imported successfully!')
			} catch (error) {
				toast.error('Invalid JSON file format')
				console.error('error uploading case file', error)
			}
		}
		reader.readAsText(file)
	}

	return (
		<div className='flex-1 min-h-full bg-gray-900 text-gray-100 p-8'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-4xl font-bold mb-2 text-red-500'>
					CRIME INVESTIGATION UNIT
				</h1>

				{cases.length ? (
					<p className='text-gray-400 mb-8'>
						Select a case to begin investigation
					</p>
				) : (
					<p className='text-gray-400 mb-8'>
						No cases found. Please upload a case.
					</p>
				)}

				<div className='space-y-4 mb-8'>
					{cases.map((c) => (
						<div
							key={c.id}
							onClick={() => startCase(c.id)}
							className='bg-gray-800 p-6 rounded border border-gray-700 hover:border-red-500 cursor-pointer transition-all'
						>
							<div className='flex justify-between items-start'>
								<div>
									<h3 className='text-xl font-semibold mb-1'>{c.title}</h3>
									<p className='text-sm text-gray-400'>
										Type: {c.type} | Victim: {c.victim}
									</p>
								</div>
								{c.timeLimit && (
									<div className='flex items-center gap-2 text-yellow-500'>
										<Clock className='w-4 h-4' />
										<span className='text-sm'>{formatTime(c.timeLimit)}</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				<div className='border-t border-gray-700 pt-8'>
					<h2 className='text-xl font-semibold mb-4'>Import New Case</h2>
					<label className='flex items-center gap-3 bg-gray-800 p-4 rounded border border-gray-700 hover:border-red-500 cursor-pointer transition-all w-fit'>
						<Upload className='w-5 h-5' />
						<span>Upload JSON Case File</span>
						<input
							type='file'
							accept='.json'
							onChange={handleFileUpload}
							className='hidden'
						/>
					</label>
					<p className='text-sm text-gray-400 mt-4'>
						Need an AI-generated case? Use the updated prompt with the new
						interrogation system structure.
					</p>
					<div className='relative'>
						<button
							onClick={handleCopy}
							className='absolute top-2 right-2 p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs flex items-center gap-1'
						>
							<Copy size={14} />
							{copied ? 'Copied!' : 'Copy'}
						</button>
						<div className='bg-gray-800 p-4 rounded mt-2 text-xs text-gray-300 font-mono overflow-x-auto max-h-96 overflow-y-auto'>
							{PROMT_FOR_AI_CASE_GENERATION}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Menu
