import { getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { app } from './app'

const firestore = getFirestore(app)

if (!getApps().length) {
  firestore.settings({
    ignoreUndefinedProperties: true,
    timestampsInSnapshots: true,
  })
}

export { firestore }
