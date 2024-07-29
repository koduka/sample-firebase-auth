'use client'

import { AccountData, createAccountData, existsAccountDataBy, onSnapshotAccount } from '@/libs/data/account'
import {
  auth,
  linkWithGoogle as linkWithGoogleFirebaseAuth,
  linkWithLine as linkWithLineFirebaseAuth,
  signIn as signInFirebaseAuth,
  signInWithGoogle as signInWithGoogleFirebaseAuth,
  signInWithLine as signInWithLineFirebaseAuth,
  signOut as signOutFirebaseAuth,
  signUp as signUpFirebaseAuth,
  unlinkWithGoogle as unlinkWithGoogleFirebaseAuth,
  unlinkWithLine as unlinkWithLineFirebaseAuth,
} from '@/libs/firebase/client/auth'
import { fetchAsBase64 } from '@/libs/utils'
import { deepEqual } from 'fast-equals'
import { User } from 'firebase/auth'
import { createContext, ReactNode, useContext, useEffect, useState, useSyncExternalStore } from 'react'
import { toast, Toaster } from 'sonner'

type SignUpProps = {
  email: string
  accountName: string
  password: string
  homeAddress: string
}

type AuthContextValue = {
  user?: User
  account?: AccountData
  status: 'initializing' | 'unauthed' | 'authed'
  signIn: (email: string, password: string) => Promise<void>
  signUp: (props: SignUpProps) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithLine: () => Promise<void>
  signOut: () => Promise<void>
  linkWithGoogle: (user: User) => Promise<void>
  linkWithLine: (user: User) => Promise<void>
  unlinkWithLine: (user: User) => Promise<void>
  unlinkWithGoogle: (user: User) => Promise<void>
}
type AuthProviderProps = {
  children?: ReactNode
}

const errorHandle = () => Promise.reject(new Error('親コンポーネントのツリー内にAuthProviderが見当たりません。'))

const signUp = async ({ email, password, accountName, homeAddress }: SignUpProps) => {
  try {
    const user = await signUpFirebaseAuth(email, password)
    const account = createAccountData(user.uid, {
      email,
      homeAddress,
      name: accountName,
    })
    return account
  } catch (e: any) {
    toast.error(e.message)
  }
}

const signIn = async (email: string, password: string) => {
  try {
    await signInFirebaseAuth(email, password)
    toast.success('ようこそ！')
  } catch (e: any) {
    toast.error(e.message)
  }
}

const signInWithGoogle = async () => {
  const result = await signInWithGoogleFirebaseAuth()
  if (result.status === 'error') {
    toast.error(result.error.message)
  } else if (result.status === 'success') {
    try {
      const user = result.user
      const existsMyAccount = await existsAccountDataBy(user.uid)
      if (!existsMyAccount) {
        const photoUrl = user.photoURL
        const iconBase64 = photoUrl ? await fetchAsBase64(photoUrl) : undefined

        await createAccountData(user.uid, {
          email: user.email || '',
          name: user.displayName || '',
          homeAddress: '',
          iconBase64,
        })
      }
      toast.success('ようこそ！')
    } catch (e: any) {
      console.error(e)
      await signOutFirebaseAuth()
      toast.error(e.message)
    }
  }
}

const signInWithLine = async () => {
  const result = await signInWithLineFirebaseAuth()
  if (result.status === 'error') {
    toast.error(result.error.message)
  } else if (result.status === 'success') {
    try {
      const user = result.user
      const existsMyAccount = await existsAccountDataBy(user.uid)
      if (!existsMyAccount) {
        const photoUrl = user.photoURL
        const iconBase64 = photoUrl ? await fetchAsBase64(photoUrl) : undefined

        await createAccountData(user.uid, {
          email: user.email || '',
          name: user.displayName || '',
          homeAddress: '',
          iconBase64,
        })
      }
      toast.success('ようこそ！')
    } catch (e: any) {
      toast.error(e.message)
    }
  }
}

const signOut = async () => {
  try {
    await signOutFirebaseAuth()
    toast.success('サインアウトしました')
  } catch (e: any) {
    toast.error(e.message)
  }
}

const linkWithGoogle = async (user: User) => {
  const result = await linkWithGoogleFirebaseAuth(user)
  if (result.status == 'success') {
    toast.success('Googleアカウントとの連携しました')
  } else if (result.status === 'error') {
    toast.error(result.error.message)
  }
}

const linkWithLine = async (user: User) => {
  const result = await linkWithLineFirebaseAuth(user)
  if (result.status == 'success') {
    toast.success('LINEアカウントとの連携しました')
  } else if (result.status === 'error') {
    toast.error(result.error.message)
  }
}

const unlinkWithGoogle = async (user: User) => {
  try {
    await unlinkWithGoogleFirebaseAuth(user)
    toast.success('Googleアカウントとの連携を解除しました')
  } catch (e: any) {
    toast.error(e.message)
  }
}

const unlinkWithLine = async (user: User) => {
  try {
    await unlinkWithLineFirebaseAuth(user)
    toast.success('LINEアカウントとの連携を解除しました')
  } catch (e: any) {
    toast.error(e.message)
  }
}

const AuthContext = createContext<AuthContextValue>({
  status: 'initializing',
  signIn: errorHandle,
  signUp: errorHandle,
  signInWithGoogle: errorHandle,
  signInWithLine: errorHandle,
  signOut: errorHandle,
  linkWithGoogle: errorHandle,
  linkWithLine: errorHandle,
  unlinkWithLine: errorHandle,
  unlinkWithGoogle: errorHandle,
})

function useOnAuthStateChanged(): ['initializing' | 'unauthed' | 'authed', User | undefined] {
  const [status, setStatus] = useState<'initializing' | 'unauthed' | 'authed'>('initializing')

  const user = useSyncExternalStore<User | undefined>(
    (onStoreChange: () => void) => {
      const unsubscribed = auth.onAuthStateChanged(async (user) => {
        setStatus(user ? 'authed' : 'unauthed')
        onStoreChange()
      })
      return () => {
        unsubscribed()
      }
    },
    () => auth.currentUser ?? undefined,
    () => undefined,
  )

  return [status, user]
}

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, user] = useOnAuthStateChanged()
  const [account, setAccount] = useState<AccountData>()

  useEffect(() => {
    if (user) {
      const unsubscribed = onSnapshotAccount(user.uid, (_account) => {
        if (!deepEqual(account, _account)) {
          setAccount(_account)
        }
      })
      return () => {
        unsubscribed()
      }
    } else {
      setAccount(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        account,
        status,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithLine,
        signOut,
        linkWithGoogle,
        linkWithLine,
        unlinkWithGoogle,
        unlinkWithLine,
      }}
    >
      <Toaster richColors position="top-center" />
      {children}
    </AuthContext.Provider>
  )
}
