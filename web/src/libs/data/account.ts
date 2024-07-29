import 'client-only'

import errorMessages from '@/libs/constants/error-messages'
import { createConverter, firestore } from '@/libs/firebase/client/firestore'
import {
  collection,
  doc,
  FirestoreError,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'

export type AccountData = Readonly<{
  name: string
  email: string
  homeAddress: string
  iconBase64?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}>

const COLLECTION_NAME = 'Accounts'

const converter = createConverter<AccountData>()

export async function findAccountDataBy(id: string) {
  try {
    const collectionRef = collection(firestore, COLLECTION_NAME).withConverter(converter)
    const snapshot = await getDoc(doc(collectionRef, id))
    if (snapshot.exists()) {
      return snapshot.data()
    }
  } catch (e) {
    // console.error('findAccountDataBy', e)
  }
}

export async function existsAccountDataBy(id: string) {
  try {
    const collectionRef = collection(firestore, COLLECTION_NAME).withConverter(converter)
    const snapshot = await getDoc(doc(collectionRef, id))
    return snapshot.exists()
  } catch (e) {
    // console.error('findAccountDataBy', e)
  }
  return false
}

export async function createAccountData(id: string, data: AccountData) {
  const collectionRef = collection(firestore, COLLECTION_NAME).withConverter(converter)
  try {
    await setDoc(doc(collectionRef, id), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  } catch (e) {
    if (e instanceof FirestoreError) {
      if (e.code === 'invalid-argument') {
        throw new Error(errorMessages.DB_INVALID_ARGUMENT)
      }
      throw new Error(errorMessages.DB_ERROR)
    }
    // console.error('createAccountData', e)
  }
}

export function onSnapshotAccount(id: string, observe: (account?: AccountData) => void) {
  const collectionRef = collection(firestore, COLLECTION_NAME).withConverter(converter)
  const docRef = doc(collectionRef, id)

  const unsubscribe = onSnapshot(docRef, {
    next: async (snapshot) => {
      if (!snapshot.metadata.hasPendingWrites) {
        observe(snapshot.data())
      }
    },
  })

  return unsubscribe
}
