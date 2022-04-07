import React, { Dispatch, useState } from "react"
import ClassSelect from './ClassSelect'
import Select from 'react-select'

interface OptionsProps {
  options: {
    active: boolean,
    minutesThreshold: number,
    class: number,
    slot: number | 'cosmetic' | 'taunt'
  },
  setOptions: Dispatch<any>,
  ignorePDAs: boolean,
  setIgnorePDAs: Dispatch<any>
}

const selectOptions = [
  {value: -1, label: 'Any'},
  {value: 0, label: 'Primary'},
  {value: 1, label: 'Secondary'},
  {value: 2, label: 'Melee'},
  {value: 'cosmetic', label: 'Cosmetic'},
  {value: 'taunt', label: 'Taunt'},
  {value: 3, label: 'Disguise Kit'},
  {value: 4, label: 'Sapper'},
  {value: 5, label: 'Construction PDA'},
  {value: 6, label: 'Spy Watch'},
]

export const enabledSlots = {
  1: [0, 1, 2, -1, 'cosmetic', 'taunt'], // scout
  2: [0, 1, 2, -1, 'cosmetic', 'taunt'], // sniper
  3: [0, 1, 2, -1, 'cosmetic', 'taunt'], // soldier
  4: [0, 1, 2, -1, 'cosmetic', 'taunt'], // demoman
  5: [0, 1, 2, -1, 'cosmetic', 'taunt'], // medic
  6: [0, 1, 2, -1, 'cosmetic', 'taunt'], // heavy
  7: [0, 1, 2, -1, 'cosmetic', 'taunt'], // pyro
  8: [1, 2, 3, 4, 6, -1, 'cosmetic', 'taunt'], // spy
  9: [0, 1, 2, 4, 5, 6 -1, 'cosmetic', 'taunt'] // engineer
}

const defaultValue: {
  label: string,
  value: number | string
} = { label: 'Any', value: -1 }

const Options: React.FC<OptionsProps> = ({options, setOptions, ignorePDAs, setIgnorePDAs}: OptionsProps) => {
  const [selectValue, setSelectValue] = useState(defaultValue)

  return (
    <div className="flex flex-col text-slate-300 pb-4 space-y-4 items-center">
      <div className="flex space-x-2">
        <button className={`rounded-lg py-1 px-2 ${options.active === true ? 'bg-teal-700' : 'bg-gray-700'}`} onClick={() => setOptions({...options, active: options.active === true ? -1 : true})} >
          Active players
        </button>
        <button className={`rounded-lg py-1 px-2 ${options.minutesThreshold === 120000 ? 'bg-teal-700' : 'bg-gray-700'}`} onClick={() => setOptions({...options, minutesThreshold: options.minutesThreshold === 120000 ? 0 : 120000})} >
          {'Experienced players'}
        </button>
        <button className={`rounded-lg py-1 px-2 ${ignorePDAs ? 'bg-teal-700' : 'bg-gray-700'}`} onClick={() => setIgnorePDAs(!ignorePDAs)} >
          Ignore PDAs
        </button>
      </div>
      <ClassSelect options={options} setOptions={setOptions} setSelect={setSelectValue} />
      <Select
        className="z-50 w-64 text-black"
        value={selectValue}
        options={selectOptions}
        onChange={(newValue) => {
          setOptions({...options, slot: newValue.value})
          setSelectValue(newValue)
        }}
        isOptionDisabled={({ value }) => !(options.class === -1 || enabledSlots[options.class].includes(value))}
        defaultValue={defaultValue}
      />
    </div>
  )
}

export default Options
