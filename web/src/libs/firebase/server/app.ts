import 'server-only'

import admin from 'firebase-admin'
import { getApp as _getApp, getApps } from 'firebase-admin/app'

function getApp() {
  if (!getApps().length) {
    if (process.env.NODE_ENV !== 'production') {
      return admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.FIRESTORE_EMULATOR_HOST,
      })
    } else {
      return admin.initializeApp()
    }
  }
  return _getApp()
}

export const app = getApp()
