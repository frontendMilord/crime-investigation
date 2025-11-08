import { Clock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCaseStore } from '../../store/case'
import { ROUTES_PATHS } from '../../consts/routes'
import { formatTime } from '../../utils'
import UploadCase from '../../components/UploadCase'
import type { ICase } from '../../types'
import { toast } from 'react-toastify'
import PasteGeneratedCase from '../../components/PasteGeneratedCase'

const MenuPage = () => {
	const { cases, setCurrentCase, setCases } = useCaseStore((state) => state)
	const navigate = useNavigate()

	const startCase = (caseId: string) => {
		const selectedCase = cases.find((c) => c.id === caseId)
		setCurrentCase(selectedCase || null)
		navigate(ROUTES_PATHS.BRIEFING)
	}

	const onFileUploadSuccess = (newCase: ICase) => {
		setCases([...cases, newCase])
		toast.success('Case imported successfully!')
	}
	const onFileUploadError = (error?: string) => {
		toast.error('Invalid JSON file format')
		console.error('error uploading case file', error)
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
							<div className='flex justify-between items-center'>
								<div>
									<h3 className='text-xl font-semibold mb-1'>{c.title}</h3>
									<p className='text-sm text-gray-400'>
										Type: {c.type} | Victim: {c.victim}
									</p>
								</div>
								{!!c.timeLimit && (
									<div className='flex items-center gap-2 text-yellow-500'>
										<Clock className='size-4' />
										<span className='text-sm'>{formatTime(c.timeLimit)}</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				<div className='border-t border-gray-700 pt-8'>
					<h2 className='text-xl font-semibold mb-4'>Import New Case</h2>
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
					<p className='text-sm text-gray-400 mt-4'>
						Need an AI-generated case?
					</p>
					<Link
						to={ROUTES_PATHS.GENERATE_CASE}
						className='mt-3 block bg-gray-800 p-4 px-6 rounded border border-gray-700 hover:border-red-500 cursor-pointer transition-all w-fit'
					>
						Generate Case
					</Link>
				</div>
			</div>
		</div>
	)
}

export default MenuPage
