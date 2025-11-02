import { MessageSquare, Phone as PhoneIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCaseStore } from '../../store/case'
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'

const PhonePage = () => {
	const { currentCase } = useCaseStore((state) => state)
	const [phoneUnlocked, setPhoneUnlocked] = useState(false)

	useEffect(() => {
		if (!currentCase?.phoneRecords?.unlockedBy) {
			return
		}
		const unlockEvidence = currentCase.evidence.find(
			(e) => e.id === currentCase.phoneRecords?.unlockedBy
		)
		setPhoneUnlocked(unlockEvidence?.analyzed || false)
	}, [currentCase])

	if (!currentCase) return null

	return (
		<div className='flex-1 w-full h-full flex flex-col bg-gray-900 text-gray-100'>
			<Header />
			<Navigation />
			<div className='flex-1 w-full flex flex-col justify-start max-w-7xl mx-auto p-8'>
				<h2 className='text-2xl font-bold mb-6'>Phone Records</h2>
				{!phoneUnlocked ? (
					<p className='text-gray-400'>
						Phone records are locked. Collect and analyze the victim's phone to
						unlock.
					</p>
				) : currentCase.phoneRecords ? (
					<div className='grid md:grid-cols-2 gap-6'>
						<div className='bg-gray-800 p-6 rounded border border-gray-700'>
							<h3 className='text-xl font-semibold mb-4 flex items-center gap-2'>
								<PhoneIcon className='w-5 h-5' />
								Call Log
							</h3>
							<div className='space-y-3'>
								{currentCase.phoneRecords.calls.map((call, idx) => (
									<div
										key={idx}
										className='bg-gray-700 p-3 rounded'
									>
										<div className='flex justify-between items-start mb-1'>
											<p className='font-semibold text-sm'>
												{call.from} → {call.to}
											</p>
											<span className='text-xs text-gray-400'>{call.time}</span>
										</div>
										<p className='text-xs text-gray-400'>
											Duration: {call.duration}
										</p>
									</div>
								))}
							</div>
						</div>

						<div className='bg-gray-800 p-6 rounded border border-gray-700'>
							<h3 className='text-xl font-semibold mb-4 flex items-center gap-2'>
								<MessageSquare className='w-5 h-5' />
								Text Messages
							</h3>
							<div className='space-y-3'>
								{currentCase.phoneRecords.texts.map((text, idx) => (
									<div
										key={idx}
										className={`bg-gray-700 p-3 rounded border-l-4 ${
											text.read ? 'border-blue-500' : 'border-yellow-500'
										}`}
									>
										<div className='flex justify-between items-start mb-2'>
											<p className='font-semibold text-sm'>
												{text.from} → {text.to}
											</p>
											<span className='text-xs text-gray-400'>{text.time}</span>
										</div>
										<p className='text-sm text-gray-300 italic'>
											"{text.message}"
										</p>
										<p className='text-xs text-gray-500 mt-1'>
											{text.read ? '✓ Read' : '✗ Unread'}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				) : (
					<p className='text-gray-400'>No phone records found.</p>
				)}
			</div>
		</div>
	)
}

export default PhonePage
