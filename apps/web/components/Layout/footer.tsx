import Link from 'next/link'
import Steam from '../../public/steam.svg'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="absolute h-24 w-screen -bottom-24">
      <div className="max-w-screen-md h-full flex flex-col items-center justify-center space-y-2 mx-auto border-t-[1px] border-slate-700 text-slate-400 text-sm">
        <div className="">
          Using assets from <span>
            <Link href="https://steampowered.com">
              <a className="text-slate-300">
                Steam
              </a>
            </Link>
          </span>
        </div>
        <div className="flex items-center">
          <div>
            Made with 🥪 by <span>
              <Link href="https://www.olifog.com/">
                <a className="text-slate-300">
                  Moose
                </a>
              </Link>
            </span>
          </div>
          <div className="flex items-center pl-1">
            <Link href="https://steamcommunity.com/id/moosewoo/">
              <a className="relative w-4 h-4">
                <Image src={Steam} alt="Steam icon" layout="fill" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
