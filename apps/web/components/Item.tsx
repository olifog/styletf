import Image from "next/image";

export default function Item ({ name, imageUrl, usage, defindex, rank }) {
  return (
    <div className="flex w-96">
      <div className="flex flex-col justify-center pr-3">
        <span className="text-2xl font-bold text-slate-300">{'#' + rank}</span>
      </div>
      <div>
        <div className="relative bg-slate-800 p-1 rounded-3xl w-24 h-24 overflow-clip">
          <span className="absolute top-1 right-2 text-xs text-slate-500 z-10">{defindex}</span>
          <Image src={imageUrl} alt={name} width={96} height={96} />
        </div>
      </div>
      <div className="pl-2 py-2 flex flex-col text-slate-300 justify-between">
        <span className="whitespace-nowrap">{name}</span>
        <div>
          <span className="text-xs">Usage rate:</span>
          <div><span className="font-bold">{(usage*100).toFixed(3)}</span>%</div>
        </div>
      </div>
    </div>
  )
}
