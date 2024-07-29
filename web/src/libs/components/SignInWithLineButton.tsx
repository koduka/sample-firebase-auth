'use client'

import { useAuthContext } from '@/libs/components/providers/auth'
import { Button } from '@/libs/components/ui/button'
import { cn } from '@/libs/utils'
import lineIcon from '@public/icons/line_32.png'
import Image from 'next/image'

type Props = {
  className?: string
}

export function SignInWithLineButton({ className }: Props) {
  const { signInWithLine } = useAuthContext()

  return (
    <Button
      onClick={signInWithLine}
      className={cn(className, 'bg-line-provider hover:bg-line-provider-hover active:bg-line-provider-active')}
    >
      <div className="flex gap-4 w-full overflow-hidden">
        <Image src={lineIcon} alt={'LINEアイコン'} sizes="100vw" />
        <span className="content-center text-line-provider-foreground object-cover">
          LINEアカウントでサインインする
        </span>
      </div>
    </Button>
  )
}
