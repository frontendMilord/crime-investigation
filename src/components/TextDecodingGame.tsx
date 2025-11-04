import React, { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { shuffleArray } from '../utils'
import { Lightbulb } from 'lucide-react'

type Props = {
	solution: string
	onSolved?: () => void
	shuffle?: boolean
	maxHintsCount?: number
}

type InputState = {
	value: string
	revealed: boolean
	locked: boolean
}

export default function TextDecodingGame({
	solution,
	onSolved,
	shuffle = true,
	maxHintsCount = 2222,
}: Props) {
	const [hinted, setHinted] = useState<number[]>([])
	const normalized = solution.toUpperCase()
	const positions = useMemo(
		() => normalized.split('').map((c) => (c === ' ' ? ' ' : c)),
		[normalized]
	)

	const createInitialInputs = () => {
		const inputs: InputState[] = positions.map((c) => ({
			value: c === ' ' ? ' ' : '',
			revealed: false,
			locked: false,
		}))

		// Reveal letters randomly: at least 1 per word, more for longer words
		const words: number[][] = []
		let currentWord: number[] = []
		positions.forEach((c, idx) => {
			if (c === ' ') {
				if (currentWord.length > 0) words.push(currentWord)
				currentWord = []
			} else {
				currentWord.push(idx)
			}
		})
		if (currentWord.length > 0) words.push(currentWord)

		words.forEach((word) => {
			const revealCount = Math.max(1, Math.floor(word.length / 3))
			const shuffled = shuffleArray([...word])
			for (let i = 0; i < revealCount; i++) {
				const idx = shuffled[i]
				inputs[idx].value = positions[idx]
				inputs[idx].revealed = true
				inputs[idx].locked = true
			}
		})

		return inputs
	}

	const [inputs, setInputs] = useState<InputState[]>(createInitialInputs)

	// Build letter pool (excluding revealed letters)
	const basePool = useMemo(() => {
		const pool: { char: string; id: number }[] = []
		positions.forEach((c, idx) => {
			if (c !== ' ' && !inputs[idx].revealed && !inputs[idx].locked)
				pool.push({ char: c, id: idx })
		})
		return pool
	}, [positions, inputs])
	// eslint-disable-next-line
	const [letterPool, setLetterPool] = useState(
		shuffle ? shuffleArray([...basePool]) : [...basePool]
	)
	console.log('app letterPool', letterPool)
	const [usedPool, setUsedPool] = useState<boolean[]>(
		Array(letterPool.length).fill(false)
	)
	console.log('app usedPool', usedPool)
	const [inputToPoolIndex, setInputToPoolIndex] = useState<(number | null)[]>(
		Array(inputs.length).fill(null)
	)
	console.log('app inputToPoolIndex', inputToPoolIndex)
	const inputRefs = useRef<Array<HTMLInputElement | null>>([])

	const solved = useMemo(() => {
		const current = inputs.map((i) => i.value || '').join('')
		return current === normalized
	}, [inputs, normalized])

	const allFilled = useMemo(() => {
		return inputs.every((i) => i.value !== '' || i.revealed || i.locked)
	}, [inputs])

	const checkSolved = () => {
		if (solved) onSolved?.()
	}

	useEffect(() => {
		checkSolved()
	}, [solved])

	// ------------------ Helpers ------------------
	const nextEditableIndexFrom = (start: number) => {
		for (let i = start; i < inputs.length; i++) {
			// if (!inputs[i].locked && !inputs[i].revealed && positions[i] !== ' ' && inputs[i].value === '')
			if (
				!inputs[i].locked &&
				!inputs[i].revealed &&
				positions[i] !== ' ' &&
				inputs[i].value === ''
			)
				return i
		}
		return -1
	}

	const prevEditableIndexFrom = (start: number) => {
		for (let i = start - 1; i >= 0; i--) {
			if (
				!inputs[i].locked &&
				!inputs[i].revealed &&
				positions[i] !== ' ' &&
				inputs[i].value === ''
			)
				return i
		}
		return -1
	}

	const handleLetterClick = (poolIndex: number) => {
		if (usedPool[poolIndex]) return
		const target = nextEditableIndexFrom(0)
		if (target === -1) return
		const letter = letterPool[poolIndex].char

		// Fill input and map pool index
		const newInputs = [...inputs]
		newInputs[target].value = letter
		setInputs(newInputs)

		const newMap = [...inputToPoolIndex]
		newMap[target] = poolIndex
		setInputToPoolIndex(newMap)

		const newUsed = [...usedPool]
		newUsed[poolIndex] = true
		setUsedPool(newUsed)

		const next = nextEditableIndexFrom(target + 1)
		if (next !== -1) inputRefs.current[next]?.focus()
	}

	const clearInputAt = (i: number) => {
		if (inputs[i].locked || !inputs[i].value || inputs[i].revealed) return

		const newInputs = [...inputs]
		newInputs[i].value = ''
		setInputs(newInputs)

		const mapped = inputToPoolIndex[i]
		if (mapped !== null) {
			const newUsed = [...usedPool]
			newUsed[mapped] = false // always return letter to pool
			setUsedPool(newUsed)
		}

		const newMap = [...inputToPoolIndex]
		newMap[i] = null
		setInputToPoolIndex(newMap)
	}

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		inputIndex: number
	) => {
		const key = e.key

		if (key === 'Backspace') {
			e.preventDefault()
			if (inputs[inputIndex].value) {
				clearInputAt(inputIndex)
				inputRefs.current[inputIndex]?.focus()
			} else {
				const prev = prevEditableIndexFrom(inputIndex)
				if (prev !== -1) {
					clearInputAt(prev)
					inputRefs.current[prev]?.focus()
				}
			}
			return
		}

		if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
			e.preventDefault()
			const char = key.toUpperCase()

			// Find first unused pool index of this char
			const poolIdx = letterPool.findIndex(
				(p, idx) => p.char === char && !usedPool[idx]
			)
			if (poolIdx === -1) return

			// Fill input and map pool index
			const newInputs = [...inputs]
			if (newInputs[inputIndex].value === char) return
			newInputs[inputIndex].value = char
			setInputs(newInputs)

			const newMap = [...inputToPoolIndex]
			newMap[inputIndex] = poolIdx
			setInputToPoolIndex(newMap)

			const newUsed = [...usedPool]
			newUsed[poolIdx] = true
			setUsedPool(newUsed)

			// Move focus to next editable input
			const next = nextEditableIndexFrom(inputIndex + 1)
			if (next !== -1) inputRefs.current[next]?.focus()
		}
	}

	const handleInputClick = (i: number) => {
		clearInputAt(i)
		inputRefs.current[i]?.focus()
	}

	const onGetHint = () => {
		const indexes = []
		for (let i = 0; i < inputs.length; i++) {
			if (positions[i] !== ' ' && !inputs[i].locked && !inputs[i].revealed) {
				indexes.push(i)
			}
		}
		if (!indexes.length) return

		const index = indexes[Math.floor(Math.random() * indexes.length)]
		// const index = indexes[Math.floor(Math.random() * (indexes.length - 1))]
		const rightChar = positions[index]

		console.log('index', index)
		console.log('rightChar', rightChar)
		console.log('curr', inputs[index].value || 'no value')
		console.log('inputs', inputs)
		// console.log('indexes', indexes)
		console.log('inputs joined', inputs.map((i) => i.value || '_').join(''))

		// if right char
		if (inputs[index].value === rightChar) {
			console.log('rofl inputs[index].value === rightChar')
			setHinted([...hinted, index])
			const newInputs = [...inputs]
			newInputs[index].revealed = true
			newInputs[index].locked = true
			setInputs(newInputs)
			return
		}
		console.log('letterPool', letterPool)
		console.log('usedPool', usedPool)
		// Find first unused pool index of this char
		const poolIdx = letterPool.findIndex(
			(p, idx) => p.char === rightChar && !usedPool[idx]
		)
		// console.log('poolIdx', poolIdx, letterPool, usedPool)

		//found in pool, also need to delete char if current input is filled
		if (poolIdx !== -1) {
			const currentValue = inputs[index].value
			// Fill input and map pool index
			const newInputs = [...inputs]
			newInputs[index].value = rightChar
			newInputs[index].revealed = true
			newInputs[index].locked = true
			const prevValuePoolIndexes = [...letterPool]
				.map((p, idx) =>
					currentValue && p.char === currentValue && usedPool[idx] ? idx : null
				)
				.filter((p) => p !== null)

			const newMap = [...inputToPoolIndex]
			console.log('inputToPoolIndex if poolIdx !== -1', inputToPoolIndex)
			newMap[index] = poolIdx
			if (prevValuePoolIndexes.length) {
				const prevValuePoolIndex =
					prevValuePoolIndexes[prevValuePoolIndexes.length - 1]
				console.log(
					'newMap[prevValuePoolIndex] = null prevValuePoolIndexes, prevValuePoolIndex',
					prevValuePoolIndexes,
					prevValuePoolIndex
				)
				newMap[prevValuePoolIndex] = null
			}

			const newUsed = [...usedPool]
			newUsed[poolIdx] = true
			if (prevValuePoolIndexes.length) {
				const prevValuePoolIndex =
					prevValuePoolIndexes[prevValuePoolIndexes.length - 1]
				console.log(
					'newUsed[prevValuePoolIndex] = false prevValuePoolIndexes, prevValuePoolIndex',
					prevValuePoolIndexes,
					prevValuePoolIndex
				)
				newUsed[prevValuePoolIndex] = false
			}

			// Move focus to next editable input
			const next = nextEditableIndexFrom(index + 1)
			if (next !== -1) inputRefs.current[next]?.focus()

			console.log('poolIdx !== -1')
			setHinted([...hinted, index])
			setInputs(newInputs)
			setInputToPoolIndex(newMap)
			setUsedPool(newUsed)

			return
		}
		//didnt find in pool, need to set right char in this input and (delete right char from wrong input or leave empty)
		const currentChar = inputs[index].value
		const rightCharWrongInputIndex = inputs.findIndex(
			(input) => input.value === rightChar && !input.locked && !input.revealed
		)
		//rip
		if (rightCharWrongInputIndex === -1) {
			console.log('RIPRIPRIP didnt find in pool and in filled inputs')
			return
		}

		// const rightCharPoolIndex = letterPool.findIndex((p) => p.char === rightChar)
		const rightCharPoolIndex = letterPool.findIndex(
			(p) =>
				p.char === rightChar &&
				inputs.find(
					(input) =>
						input.value === rightChar && !input.locked && !input.revealed
				)
		)
		// const rightCharWrongInputPoolIndex = letterPool.findIndex(
		// 	(p) => p.char === currentChar
		// )
		const rightCharWrongInputPoolIndex = letterPool.findIndex(
			(p) =>
				p.char === currentChar &&
				inputs.find(
					(input) =>
						input.value === rightChar && !input.locked && !input.revealed
				)
		)
		//another rip
		if (
			rightCharPoolIndex === -1 ||
			(currentChar && rightCharWrongInputPoolIndex === -1)
			// (!currentChar && rightCharWrongInputPoolIndex === -1)
		)
			return

		const newMap = [...inputToPoolIndex]
		newMap[index] = rightCharPoolIndex
		if (currentChar && rightCharWrongInputPoolIndex !== -1) {
			newMap[rightCharWrongInputIndex] = null
		}
		// newMap[rightCharWrongInputIndex] = null

		const newUsed = [...usedPool]
		newUsed[rightCharPoolIndex] = true
		if (currentChar && rightCharWrongInputPoolIndex !== -1) {
			newUsed[rightCharWrongInputPoolIndex] = false
		}

		const newInputs = [...inputs]
		newInputs[rightCharWrongInputIndex].value = ''
		newInputs[index].value = rightChar
		newInputs[index].revealed = true
		newInputs[index].locked = true

		setInputs(newInputs)
		setInputToPoolIndex(newMap)
		setUsedPool(newUsed)
		setHinted([...hinted, index])
		console.log('poolIdx ====== -1')
		inputRefs.current[rightCharWrongInputIndex]?.focus()
	}

	return (
		<div className='min-h-[220px] w-full max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg text-gray-100'>
			<div className='flex items-center justify-between gap-x-3 mb-3 text-yellow-500 hover:text-yellow-300'>
				<div className='text-gray-300 font-bold'>Decipher the message</div>
				{hinted.length < maxHintsCount && (
					<div
						className='flex items-center gap-x-1 cursor-pointer'
						onClick={onGetHint}
					>
						<Lightbulb className='size-6' />
						<div className='text-gray-300'>
							hints left: {maxHintsCount - hinted.length}
						</div>
					</div>
				)}
			</div>
			<div
				className={clsx(
					'p-3 rounded-md flex flex-wrap gap-2 mb-3',
					allFilled
						? solved
							? 'ring-2 ring-green-500'
							: 'ring-2 ring-red-500'
						: 'ring-1 ring-gray-700'
				)}
			>
				{inputs.map((i, idx) => {
					if (positions[idx] === ' ') {
						return (
							<div
								key={idx}
								className='w-10 h-10 bg-gray-800/40 border border-dashed border-gray-700 rounded-md'
								aria-hidden
							/>
						)
					}
					return (
						<input
							key={idx}
							ref={(el: HTMLInputElement | null) => {
								if (el !== null) {
									inputRefs.current[idx] = el
								}
							}}
							value={i.value}
							onKeyDown={(e) => handleKeyDown(e, idx)}
							onChange={() => {}}
							onClick={() => handleInputClick(idx)}
							maxLength={1}
							className={clsx(
								'w-10 h-10 text-center rounded-md text-lg font-mono border',
								i.locked
									? 'bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed'
									: 'bg-gray-900 border-gray-700 text-gray-100',
								hinted.includes(idx) &&
									'ring-1 ring-green-500 bg-gray-900 text-gray-100'
							)}
							disabled={i.locked}
							inputMode='text'
						/>
					)
				})}
			</div>
			<div className='flex flex-wrap gap-2'>
				{letterPool.map((p, idx) => {
					const disabled = usedPool[idx] || solved
					return (
						<button
							key={p.id}
							onClick={() => handleLetterClick(idx)}
							disabled={disabled}
							className={clsx(
								'w-10 h-10 flex items-center justify-center rounded-md font-mono text-lg border',
								disabled
									? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
									: 'bg-gray-900 hover:bg-gray-800 border-gray-600 text-gray-100'
							)}
						>
							{p.char}
						</button>
					)
				})}
			</div>
			<div className='mt-3 text-xs text-gray-400'>
				Click characters to fill the next empty slot, or type to place a
				character. Backspace deletes and moves back. Click an input to clear it.
			</div>
		</div>
	)
}
