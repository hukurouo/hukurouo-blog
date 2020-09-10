import firebase from 'firebase'
import "firebase/auth"
import "firebase/firestore"

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGE_SENDER_ID,
      appId: process.env.APP_ID,
    }
  )
}

export default firebase