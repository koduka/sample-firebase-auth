'use client'

import { useAuthContext } from '@/libs/components/providers/auth'
import { SignUpForm } from '@/libs/components/SignUpForm'
import { Card, CardContent } from '@/libs/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function SiginUpPage() {
  const { status, account, signUp } = useAuthContext()

  useEffect(() => {
    if (account && status === 'authed') {
      redirect('/')
    }
  }, [account, status])

  return (
    <Card className="w-96 m-auto">
      <CardContent className="p-8 space-y-4">
        <SignUpForm
          onSubmit={({ name, email, password, homeAddress }) =>
            signUp({ accountName: name, email, password, homeAddress })
          }
        />
        <div className="flex justify-center">
          <Link href="/sign-in" className="hover:text-gray-500">
            既存のアカウントでサインインする
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
