'use client'

import { useAuthContext } from '@/libs/components/providers/auth'
import { Button } from '@/libs/components/ui/button'
import { cn } from '@/libs/utils'
import Image from 'next/image'

type Props = {
  className?: string
}

export function SignInWithGoogleButton({ className }: Props) {
  const { signInWithGoogle } = useAuthContext()
  return (
    <Button
      onClick={signInWithGoogle}
      className={cn(className, 'border bg-white border-gray-500 hover:bg-black/10 active:bg-black/30')}
    >
      <div className="flex gap-4 w-full">
        <Image src="/icons/google.svg" alt={'Googleアイコン'} width={32} height={32} className="p-1" />
        <span className="content-center text-black">Googleアカウントでサインインする</span>
      </div>
    </Button>
  )
}
