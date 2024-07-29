import { useAuthContext } from '@/libs/components/providers/auth'
import { Button } from '@/libs/components/ui/button'
import { LINE_AUTH_PROVIDER_ID } from '@/libs/firebase/client/auth'
import { cn } from '@/libs/utils'
import { useCallback, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

type Props = {
  className?: string
}

export function LinkAccountWithLineButton({ className }: Props) {
  const { user, linkWithLine } = useAuthContext()
  const [isLinking, setIsLinking] = useState(false)
  const isLinkedProvider = !!user?.providerData.some((userInfo) => userInfo.providerId === LINE_AUTH_PROVIDER_ID)

  const onClick = useCallback(() => {
    if (user) {
      setIsLinking(true)
      linkWithLine(user).finally(() => {
        setTimeout(() => setIsLinking(false), 1000)
      })
    }
  }, [linkWithLine, user])

  return (
    <Button disabled={isLinkedProvider || isLinking} variant="ghost" className={cn(className)} onClick={onClick}>
      {isLinking ? <FaSpinner className="animate-spin" /> : isLinkedProvider ? '連携済み' : '連携する'}
    </Button>
  )
}
