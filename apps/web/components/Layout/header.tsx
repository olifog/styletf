import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <div className="h-22 w-screen sticky top-0 flex items-center justify-center px-3 bg-slate-900/70">
      <div className="max-w-screen-xl flex w-full space-x-2 items-center">
        <Link href="/">
          <a className="w-48 mr-16 pt-1">
            <Image src="/styletf.png" layout="responsive" alt="style.tf" width={256} height={128} />
          </a>
        </Link>
      </div>
    </div>
  );
}

