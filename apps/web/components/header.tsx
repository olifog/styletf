import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <div className="h-22 w-screen sticky top-0 flex items-center px-12">
      <Link href="/">
        <a className="w-48">
          <Image src="/styletf.png" layout="responsive" alt="style.tf" width={256} height={128} />
        </a>
      </Link>
    </div>
  );
}

