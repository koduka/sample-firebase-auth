import 'client-only'

import {
  connectFirestoreEmulator,
  DocumentData,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore'
import { app } from './app'

const firestore = getFirestore(app)

if (process.env.NODE_ENV !== 'production') {
  connectFirestoreEmulator(firestore, 'localhost', 8080)
}

function createConverter<T extends DocumentData>(): FirestoreDataConverter<T, WithFieldValue<T>> {
  return {
    toFirestore: (data: WithFieldValue<T>): WithFieldValue<T> => {
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      ) as WithFieldValue<T>
      return cleanedData
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<T, WithFieldValue<T>>, options?: SnapshotOptions): T => {
      return snapshot.data(options)
    },
  }
}

export { createConverter, firestore }
