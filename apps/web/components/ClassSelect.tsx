
import Scout from '../public/Scout.svg'
import Soldier from '../public/Soldier.svg'
import Pyro from '../public/Pyro.svg'
import Demoman from '../public/Demoman.svg'
import Heavy from '../public/Heavy.svg'
import Engineer from '../public/Engineer.svg'
import Medic from '../public/Medic.svg'
import Sniper from '../public/Sniper.svg'
import Spy from '../public/Spy.svg'
import { enabledSlots } from './Options'
import Image from 'next/image'

const classes = [
  [Scout, 1],
  [Soldier, 3],
  [Pyro, 7],
  [Demoman, 4],
  [Heavy, 6],
  [Engineer, 9],
  [Medic, 5],
  [Sniper, 2],
  [Spy, 8]
]

const ClassButton = ({icon, classNum, options, setOptions, setSelect}) => {
  const handleClick = () => {
    const newOptions = {
      ...options
    }
  
    newOptions['class'] = options['class'] === classNum ? -1 : classNum
  
    if (!(newOptions['class'] === -1 || enabledSlots[newOptions['class']].includes(options.slot))) {
      newOptions['slot'] = -1
      setSelect({value: -1, label: 'Any'})
    }
    setOptions(newOptions)
  }

  return (
    <button className={`w-8 h-8 ${options['class'] === classNum ? 'bg-teal-700' : 'bg-gray-700'}`} onClick={handleClick}>
      <Image src={icon} alt='class icon' width={32} height={32} />
    </button>
  )
}

export default function ClassSelect ({ options, setOptions, setSelect }) {
  return (
    <div className="flex rounded-md divide-x-2 divide-slate-800 overflow-clip items-center">
      {
        classes.map(([icon, classNum]) => (
          <ClassButton
            key={classNum}
            icon={icon}
            classNum={classNum}
            options={options}
            setOptions={setOptions}
            setSelect={setSelect}
          />
        ))
      }
    </div>
  )
}
