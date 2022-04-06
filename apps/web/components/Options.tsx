import React, { Dispatch } from "react"
import ClassSelect from './ClassSelect'
import Select from 'react-select'

interface OptionsProps {
  options: {
    ignorePDAs: boolean,
    active: boolean,
    minutesThreshold: number,
    class: number,
    slot: number | 'cosmetic' | 'taunt'
  },
  setOptions: Dispatch<any>
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

const Options: React.FC<OptionsProps> = ({options, setOptions}: OptionsProps) => {
  return (
    <div className="flex flex-col text-slate-300 pb-4 space-y-4 items-center">
      <div className="flex space-x-2">
        <button className={`rounded-lg py-1 px-2 ${options.active === true ? 'bg-teal-700' : 'bg-gray-700'}`} onClick={() => setOptions({...options, active: options.active === true ? -1 : true})} >
          Active players
        </button>
        <button className={`rounded-lg py-1 px-2 ${options.minutesThreshold === 120000 ? 'bg-teal-700' : 'bg-gray-700'}`} onClick={() => setOptions({...options, minutesThreshold: options.minutesThreshold === 120000 ? 0 : 120000})} >
          {'Experienced players'}
        </button>
        <button className={`rounded-lg py-1 px-2 ${options.ignorePDAs ? 'bg-teal-700' : 'bg-gray-700'}`} onClick={() => setOptions({...options, ignorePDAs: !options.ignorePDAs})} >
          Ignore PDAs
        </button>
      </div>
      <ClassSelect options={options} setOptions={setOptions} />
      <Select className="z-50" options={selectOptions} onChange={(newValue) => setOptions({...options, slot: newValue.value})} />
    </div>
  )
}

export default Options
