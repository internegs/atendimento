import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCBhytK2I428dT_hhe2EP4Yv5Md_rsTuzs",
  authDomain: "inzapbrasil.firebaseapp.com",
  databaseURL: "https://inzapbrasil-default-rtdb.firebaseio.com",
  projectId: "inzapbrasil",
  storageBucket: "inzapbrasil.appspot.com",
  messagingSenderId: "1039896318348",
  appId: "1:1039896318348:web:9bd419cdf02f5a9ef706a9"
}

const firebaseApp = initializeApp(firebaseConfig)
const database = getDatabase(firebaseApp)
const auth = getAuth(firebaseApp)
const storage = getStorage(firebaseApp)

export default {
  install(app) {
    app.config.globalProperties.$firebase = firebaseApp
    app.config.globalProperties.$database = database
    app.config.globalProperties.$auth = auth
    app.config.globalProperties.$storage = storage

    app.provide('firebase', firebaseApp)
    app.provide('database', database)
    app.provide('auth', auth)
    app.provide('storage', storage)
  }
}