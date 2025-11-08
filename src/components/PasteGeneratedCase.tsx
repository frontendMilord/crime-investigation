import { useState } from 'react'
import { CaseSchema } from '../schemas/case'
import type { ICase } from '../types'
interface IPasteGeneratedCaseProps {
	onSuccess: (newCase: ICase) => void
	onError: (error?: string) => void
}

const PasteGeneratedCase = ({
	onError,
	onSuccess,
}: IPasteGeneratedCaseProps) => {
	const [generatedCase, setGeneratedCase] = useState('')
	const [error, setError] = useState('')

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGeneratedCase(e.target.value)
		try {
			const text = e.target.value
			const json = JSON.parse(text)
			const parsed = CaseSchema.parse(json)
			const newCase: ICase = {
				...parsed,
				id: `case-${Date.now()}`,
			}
			onSuccess(newCase)
			setError('')
		} catch (error) {
			const errMessage = error instanceof Error ? error.message : ''
			onError(errMessage || 'Invalid JSON file format')
			setError(errMessage || 'Invalid JSON file format')
		}
	}

	return (
		<input
			type='text'
			value={generatedCase}
			onChange={onChange}
			placeholder='Paste case here'
			className={`flex-1 flex items-center justify-center gap-3 bg-gray-800 p-4 rounded border cursor-pointer transition-all  outline-none ${
				error ? 'border-red-500' : 'border-gray-700 hover:border-gray-500'
			}`}
		/>
	)
}

export default PasteGeneratedCase
