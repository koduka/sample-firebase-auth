import 'client-only'

import errorMessages from '@/libs/constants/error-messages'

import { FirebaseError } from 'firebase/app'
import {
  signOut as _signOut,
  AuthErrorCodes,
  AuthProvider,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  linkWithPopup,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  unlink,
  User,
} from 'firebase/auth'
import { app } from './app'

type SignInWithProviderResult =
  | {
      status: 'success'
      user: User
    }
  | {
      status: 'cancel'
    }
  | {
      status: 'error'
      error: Error
    }

type LinkWithProviderResult =
  | {
      status: 'success' | 'cancel'
    }
  | {
      status: 'error'
      error: Error
    }

const LINE_AUTH_PROVIDER_ID = process.env.NEXT_PUBLIC_LINE_AUTH_PROVIDER_ID || 'oidc.local-line'

const auth = getAuth(app)

if (process.env.NODE_ENV !== 'production') {
  connectAuthEmulator(auth, 'http://localhost:9099')
}

const signUp = async (email: string, password: string) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    return credential.user
  } catch (e) {
    if (e instanceof FirebaseError) {
      throw new Error(`${e.code} : ${e.message}`)
    }
    throw e
  }
}

const signIn = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (e.code === AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE) {
        throw new Error(errorMessages.SIGN_IN_ALREADY_IN_USE)
      }
      if (e.code === AuthErrorCodes.INVALID_PASSWORD) {
        throw new Error(errorMessages.SIGN_IN_WITH_EMAIL_PASSWORD_FAILD)
      }
      if (e.code === AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
        throw new Error(errorMessages.SIGN_IN_TOO_MANY_REQUEST)
      }
      if (e.code === AuthErrorCodes.USER_DELETED) {
        throw new Error(errorMessages.SIGN_IN_WITH_EMAIL_PASSWORD_FAILD)
      }
      if (e.code === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
        throw new Error(errorMessages.SIGN_IN_NETWORK_REQUEST_FAILD)
      }
    }
    console.error(e)
    throw new Error(errorMessages.SIGN_IN_FAILD)
  }
}

const signInWithProvider = async (provider: AuthProvider): Promise<SignInWithProviderResult> => {
  try {
    const credential = await signInWithPopup(auth, provider)
    return {
      status: 'success',
      user: credential.user,
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (e.code === AuthErrorCodes.POPUP_CLOSED_BY_USER || e.code === AuthErrorCodes.EXPIRED_POPUP_REQUEST) {
        return {
          status: 'cancel',
        }
      }
      if (e.code === AuthErrorCodes.POPUP_BLOCKED) {
        return {
          status: 'error',
          error: new Error(errorMessages.POPUP_BLOCKED),
        }
      }
      if (e.code === AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE) {
        return {
          status: 'error',
          error: new Error(errorMessages.SIGN_IN_ALREADY_IN_USE),
        }
      }
    }
    return {
      status: 'error',
      error: new Error(errorMessages.SIGN_IN_FAILD),
    }
  }
}

const linkWithProvider = async (user: User, provider: AuthProvider): Promise<LinkWithProviderResult> => {
  try {
    await linkWithPopup(user, provider)
    return {
      status: 'success',
    }
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (e.code === AuthErrorCodes.POPUP_CLOSED_BY_USER || e.code === AuthErrorCodes.EXPIRED_POPUP_REQUEST) {
        return { status: 'cancel' }
      }
      if (e.code === AuthErrorCodes.POPUP_BLOCKED) {
        return {
          status: 'error',
          error: new Error(errorMessages.POPUP_BLOCKED),
        }
      }
      if (e.code === AuthErrorCodes.PROVIDER_ALREADY_LINKED) {
        return {
          status: 'error',
          error: new Error(errorMessages.PROVIDER_ALREADY_LINKED),
        }
      }
      if (e.code === AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE) {
        return {
          status: 'error',
          error: new Error(errorMessages.PROVIDER_ALREADY_USED),
        }
      }
    }
    return {
      status: 'error',
      error: new Error(errorMessages.PROVIDER_LINK_FAILD),
    }
  }
}

const unlinkWithProvider = async (user: User, providerId: string) => {
  try {
    await unlink(user, providerId)
  } catch (e) {
    // console.error(e)
    throw new Error(errorMessages.PROVIDER_UNLINK_FAILD)
  }
}

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  return await signInWithProvider(provider)
}

const signInWithLine = async () => {
  const provider = new OAuthProvider(LINE_AUTH_PROVIDER_ID)
  return await signInWithProvider(provider)
}

const signOut = async () => {
  try {
    await _signOut(auth)
  } catch (e) {
    // console.error(e)
    throw new Error(errorMessages.SIGN_OUT_FAILD)
  }
}

const linkWithGoogle = async (user: User) => {
  const provider = new GoogleAuthProvider()
  return await linkWithProvider(user, provider)
}

const linkWithLine = async (user: User) => {
  const provider = new OAuthProvider(LINE_AUTH_PROVIDER_ID)
  return await linkWithProvider(user, provider)
}

const unlinkWithGoogle = async (user: User) => {
  const provider = new GoogleAuthProvider()
  await unlinkWithProvider(user, provider.providerId)
}

const unlinkWithLine = async (user: User) => {
  await unlinkWithProvider(user, LINE_AUTH_PROVIDER_ID)
}

export {
  auth,
  LINE_AUTH_PROVIDER_ID,
  linkWithGoogle,
  linkWithLine,
  signIn,
  signInWithGoogle,
  signInWithLine,
  signOut,
  signUp,
  unlinkWithGoogle,
  unlinkWithLine,
}
