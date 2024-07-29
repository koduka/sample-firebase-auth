'use client'

import { AccountInfo } from '@/libs/components/AccountInfo'
import { LinkAccountWithGoogleButton } from '@/libs/components/LinkAccountWithGoogleButton'
import { LinkAccountWithLineButton } from '@/libs/components/LinkAccountWithLineButton'
import { useAuthContext } from '@/libs/components/providers/auth'
import { Button } from '@/libs/components/ui/button'
import { Card, CardContent, CardFooter } from '@/libs/components/ui/card'
import lineIcon from '@public/icons/line_32.png'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { account, status, signOut } = useAuthContext()

  useEffect(() => {
    if (status === 'unauthed') {
      redirect('/sign-in')
    }
  }, [status])

  return status === 'initializing' ? (
    <p>loading account...</p>
  ) : (
    <Card className="w-fit m-auto">
      <CardContent className=" p-8">
        <AccountInfo account={account} />
      </CardContent>
      <CardContent className=" p-8">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 w-full">
            <div className="p-1">
              <Image src="/icons/google.svg" alt={'Googleアイコン'} width={32} height={32} />
            </div>
            <span className="content-center">Googleアカウント</span>
          </div>
          <LinkAccountWithGoogleButton />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 w-full">
            <div className="p-1 overflow-hidden">
              <Image
                src={lineIcon}
                className="bg-line-provider rounded-full object-cover"
                alt={'LINEアイコン'}
                sizes="100vw"
              />
            </div>
            <span className="content-center">LINEアカウント</span>
          </div>
          <LinkAccountWithLineButton />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={signOut} className="w-full">
          サインアウトする
        </Button>
      </CardFooter>
    </Card>
  )
}
