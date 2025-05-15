// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

// Configuración de Firebase (usa tus propios valores)
const firebaseConfig = {
  apiKey: "AIzaSyAJ9tJScRdzZIsWQ4m-j1iojzvJIxDh_5M",
  authDomain: "museo-bicentenario-e6aca.firebaseapp.com",
  projectId: "museo-bicentenario-e6aca",
  storageBucket: "museo-bicentenario-e6aca.firebasestorage.app",
  messagingSenderId: "136355789538",
  appId: "1:136355789538:web:42e074e01e8c7a211afcbb"
}

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Obtiene los servicios de Firebase
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)
const auth = getAuth(firebaseApp)

// Exporta los servicios y la configuración
export { db, storage, auth, firebaseConfig }