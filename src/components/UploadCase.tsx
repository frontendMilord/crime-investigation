import { CaseSchema } from '../schemas/case'
import type { ICase } from '../types'
import { useRef } from 'react'
import { Upload } from 'lucide-react'

interface IUploadCaseProps {
	onSuccess: (newCase: ICase) => void
	onError: (error?: string) => void
}

const UploadCase = ({ onError, onSuccess }: IUploadCaseProps) => {
	const uploadCaseInputRef = useRef<HTMLInputElement>(null)

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
				onSuccess(newCase)
			} catch (error) {
				onError(
					error instanceof Error ? error.message : 'Invalid JSON file format'
				)
			} finally {
				if (uploadCaseInputRef.current) uploadCaseInputRef.current.value = ''
			}
		}
		reader.readAsText(file)
	}

	return (
		<label className='flex-1 flex items-center justify-center gap-3 bg-gray-800 p-4 rounded border border-gray-700 hover:border-red-500 cursor-pointer transition-all'>
			<Upload className='w-5 h-5' />
			<span>Upload JSON Case File</span>
			<input
				type='file'
				ref={uploadCaseInputRef}
				accept='.json'
				onChange={handleFileUpload}
				className='hidden'
			/>
		</label>
	)
}

export default UploadCase
