import { useAuthContext } from '@/libs/components/providers/auth'
import { Button } from '@/libs/components/ui/button'
import { cn } from '@/libs/utils'
import { useCallback, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

type Props = {
  className?: string
}

export function LinkAccountWithGoogleButton({ className }: Props) {
  const { user, linkWithGoogle } = useAuthContext()
  const [isLinking, setIsLinking] = useState(false)
  const isLinkedProvider = !!user?.providerData.some((userInfo) => userInfo.providerId === 'google.com')

  const onClick = useCallback(() => {
    if (user) {
      setIsLinking(true)
      linkWithGoogle(user).finally(() => {
        setTimeout(() => setIsLinking(false), 1000)
      })
    }
  }, [user])

  return (
    <Button disabled={isLinkedProvider || isLinking} variant="ghost" className={cn(className)} onClick={onClick}>
      {isLinking ? <FaSpinner className="animate-spin" /> : isLinkedProvider ? '連携済み' : '連携する'}
    </Button>
  )
}
