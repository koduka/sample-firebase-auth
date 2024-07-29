'use client'

import { useAuthContext } from '@/libs/components/providers/auth'
import { SignInForm } from '@/libs/components/SignInForm'
import { SignInWithGoogleButton } from '@/libs/components/SignInWithGoogleButton'
import { SignInWithLineButton } from '@/libs/components/SignInWithLineButton'
import { Card, CardContent } from '@/libs/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function SiginInPage() {
  const { status, account, signIn } = useAuthContext()

  useEffect(() => {
    if (account && status === 'authed') {
      redirect('/')
    }
  }, [status, account])

  return (
    <Card className="w-96 m-auto">
      <CardContent className="p-8 space-y-4">
        <SignInForm onSubmit={({ email, password }) => signIn(email, password)} />
        <div className="flex justify-center">
          <Link href="/sign-up" className="hover:text-gray-500">
            新しいアカウントを作成する
          </Link>
        </div>
        <div className="flex items-center before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:before:border-neutral-600 dark:after:border-neutral-600">
          <span className="text-sm text-gray-800 dark:text-white">または</span>
        </div>
        <div className="w-80 align-middle space-y-4">
          <SignInWithGoogleButton className="w-full" />
          <SignInWithLineButton className="w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
