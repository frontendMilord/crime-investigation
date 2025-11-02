import { useEffect, useState } from 'react'
import type { IPerson } from '../../../types'
import { useCaseStore } from '../../../store/case'

interface IAvailablePersonProps {
	startInterrogation: (personId: string) => void
}

const AvailablePeople = ({ startInterrogation }: IAvailablePersonProps) => {
	const { currentCase, availablePeople } = useCaseStore()
	const [suspects, setSuspects] = useState<IPerson[]>([])
	const [witnesses, setWitnesses] = useState<IPerson[]>([])

	useEffect(() => {
		const suspects: IPerson[] = []
		const witnesses: IPerson[] = []
		currentCase?.people.forEach((p) => {
			if (p.type === 'suspect') {
				suspects.push(p)
			} else if (p.type === 'witness') {
				witnesses.push(p)
			}
		})
		setSuspects(suspects.sort((a, b) => +a.interviewed - +b.interviewed))
		setWitnesses(witnesses.sort((a, b) => +a.interviewed - +b.interviewed))
	}, [currentCase?.people])

	return (
		<div>
			<h2 className='text-2xl font-bold mb-6'>Interrogation Room</h2>

			{suspects.length > 0 && (
				<div className='mb-8'>
					<h3 className='text-xl font-semibold mb-4 text-red-400'>Suspects</h3>
					<div className='space-y-4'>
						{suspects.map((selectedPerson) => (
							<div
								key={selectedPerson.id}
								className={`bg-gray-800 p-6 rounded border ${
									selectedPerson.interviewed
										? 'border-orange-500'
										: 'border-gray-700'
								}`}
							>
								<div className='flex justify-between items-start mb-3'>
									<div>
										<h4 className='text-xl font-semibold'>
											{selectedPerson.name}
										</h4>
										<p className='text-sm text-gray-400'>
											{selectedPerson.age} years old |{' '}
											{selectedPerson.occupation}
										</p>
										<p className='text-xs text-gray-500'>
											{selectedPerson.relationship}
										</p>
									</div>
									{selectedPerson.interviewed && (
										<span className='text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded'>
											INTERVIEWED
										</span>
									)}
								</div>
								<p className='text-sm text-gray-300 italic mb-4'>
									"{selectedPerson.initialStatement}"
								</p>
								{availablePeople.find((p) => p.id === selectedPerson.id) && (
									<button
										onClick={() => startInterrogation(selectedPerson.id)}
										className='bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded transition-all'
									>
										{selectedPerson.interviewed
											? 'Continue Interrogation'
											: 'Begin Interrogation'}
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{witnesses.length > 0 && (
				<div>
					<h3 className='text-xl font-semibold mb-4 text-blue-400'>
						Witnesses
					</h3>
					<div className='space-y-4'>
						{witnesses.map((selectedPerson) => (
							<div
								key={selectedPerson.id}
								className={`bg-gray-800 p-6 rounded border ${
									selectedPerson.interviewed
										? 'border-blue-500'
										: 'border-gray-700'
								}`}
							>
								<div className='flex justify-between items-start mb-3'>
									<div>
										<h4 className='text-xl font-semibold'>
											{selectedPerson.name}
										</h4>
										<p className='text-sm text-gray-400'>
											{selectedPerson.occupation}
										</p>
										<p className='text-xs text-gray-500'>
											{selectedPerson.relationship}
										</p>
									</div>
									{selectedPerson.interviewed && (
										<span className='text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded'>
											INTERVIEWED
										</span>
									)}
								</div>
								<p className='text-sm text-gray-300 italic mb-4'>
									"{selectedPerson.initialStatement}"
								</p>
								{availablePeople.find((p) => p.id === selectedPerson.id) && (
									<button
										onClick={() => startInterrogation(selectedPerson.id)}
										className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-all'
									>
										{selectedPerson.interviewed
											? 'Continue Interview'
											: 'Interview Witness'}
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default AvailablePeople
