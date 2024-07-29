import Image from 'next/image'
import { BiSolidUser } from 'react-icons/bi'

type Props = {
  src?: string
}

const ICON_SIZE = 192

export function AccountIcon({ src }: Props) {
  return (
    <div className="rounded-full border-2 p-2 border-gray-300 size-48 align-middle flex overflow-hidden">
      {src ? (
        <Image
          className="object-contain"
          src={src}
          alt="アカウントアイコン"
          width={ICON_SIZE}
          height={ICON_SIZE}
          priority
        />
      ) : (
        <BiSolidUser className="object-cover  fill-gray-500 w-full h-full" />
      )}
    </div>
  )
  return
}
