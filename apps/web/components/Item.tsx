import Image from "next/image";

const translation = {
  'TF_WEAPON_SCATTERGUN': 'Scattergun',
  'TF_WEAPON_ROCKETLAUNCHER': 'Rocket Launcher',
  'TF_WEAPON_FLAMETHROWER': 'Flamethrower',
  'TF_WEAPON_GRENADELAUNCHER': 'Grenade Launcher',
  'TF_WEAPON_MINIGUN': 'Minigun',
  'TF_WEAPON_SHOTGUN_PRIMARY': 'Shotgun',
  'TF_WEAPON_SYRINGEGUN_MEDIC': 'Syringe Gun',
  'TF_WEAPON_SNIPERRIFLE': 'Sniper Rifle',
  'TF_WEAPON_REVOLVER': 'Revolver',
  'TF_WEAPON_PISTOL_SCOUT': 'Pistol',
  'TF_WEAPON_SHOTGUN_SOLDIER': 'Shotgun',
  'TF_WEAPON_SHOTGUN_PYRO': 'Shotgun',
  'TF_WEAPON_PIPEBOMBLAUNCHER': 'Stickybomb Launcher',
  'TF_WEAPON_SHOTGUN_HWG': 'Shotgun',
  'TF_WEAPON_PISTOL': 'Pistol',
  'TF_WEAPON_MEDIGUN': 'Medi Gun',
  'TF_WEAPON_SMG': 'SMG',
  'TF_WEAPON_BUILDER_SPY': 'Sapper',
  'TF_WEAPON_BAT': 'Bat',
  'TF_WEAPON_SHOVEL': 'Shovel',
  'TF_WEAPON_FIREAXE': 'Fire Axe',
  'TF_WEAPON_BOTTLE': 'Bottle',
  'TF_WEAPON_FISTS': 'Fists',
  'TF_WEAPON_WRENCH': 'Wrench',
  'TF_WEAPON_BONESAW': 'Bonesaw',
  'TF_WEAPON_CLUB': 'Kukri',
  'TF_WEAPON_KNIFE': 'Knife',
  'TF_WEAPON_PDA_SPY': 'Disguise Kit',
  'TF_WEAPON_PDA_ENGINEER_BUILD': 'Construction PDA',
  'TF_WEAPON_BUILDER': 'Engineer Toolbox',
  'TF_WEAPON_PDA_ENGINEER_DESTROY': 'Destruction PDA',
  'TF_WEAPON_INVIS': 'Invis Watch',
  'Employee Badge C': 'Mercenary Badge',
  'TTG Glasses': 'Dangeresque, Too?',
  'TTG Max Hat': 'Max\'s Severed Head',
  'EOTL_sheavyshirt': 'Hunter Heavy',
  'Yeti_Arms': 'Himalayan Hair Shirt',
  'Yeti_Legs': 'Abominable Snow Pants',
  'Yeti_Head': 'Kathman-Hairdo',
  'Friendly Item': 'Professor Speks',
  'Laugh Taunt': 'Taunt: The Schadenfreude',
  'Replay Taunt': 'Taunt: The Director\'s Vision',
  'High Five Taunt': 'Taunt: The High Five!',
  'Meet the Medic Heroic Taunt': 'Taunt: Meet the Medic',
  'RPS Taunt': 'Taunt: Rock, Paper, Scissors',
  'TTG Max Pistol - Poker Night': 'Lugermorph',
  'TTG Max Pistol': 'Vintage Lugermorph',
  'Panic Attack Shotgun': 'The Panic Attack',
  'Stickybomb Jumper': 'The Sticky Jumper',
  'TTG Sam Revolver': 'The Big Kill',
  'OSX Item': 'Earbuds'
}

const sanitiseName = (name) => {
  if (name.startsWith('Upgradeable')) {
    return translation[name.slice(12)] + ' (Renamed/Strange)'
  }

  if (name in translation) return translation[name]

  if (name.endsWith('Taunt')) {
    return 'Taunt: ' + name.slice(0, -6)
  }

  return name
}


export default function Item ({ name, imageUrl, usage, defindex, rank }) {
  return (
    <div className="relative flex">
      <div className="absolute -left-12 h-24 flex flex-col justify-center pr-3">
        <span className="text-2xl inline-block font-bold text-slate-300"><pre>{('#' + rank).padStart(3, ' ')}</pre></span>
      </div>
      <div>
        <div className="relative bg-slate-800 p-1 rounded-3xl w-24 h-24 overflow-clip">
          <span className="absolute top-1 right-2 text-xs text-slate-500 z-10">{defindex}</span>
          <Image src={imageUrl} alt={sanitiseName(name)} width={96} height={96} />
        </div>
      </div>
      <div className="pl-2 md:py-2 flex flex-col text-slate-300 justify-between">
        <div><span className="absolute w-40 md:w-96">{sanitiseName(name)}</span></div>
        <div>
          <span className="text-xs">Usage rate:</span>
          <div><span className="font-bold -top-1">{(usage*100).toFixed(3)}</span>%</div>
        </div>
      </div>
    </div>
  )
}
