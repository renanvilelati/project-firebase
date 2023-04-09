import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Configuração pega no site do firebase para cada app
const firebaseConfig = {
    apiKey: "AIzaSyDN3l8Qo4eHpNYOIX4umjxkfNqvyE17Hfc",
    authDomain: "curso-680af.firebaseapp.com",
    projectId: "curso-680af",
    storageBucket: "curso-680af.appspot.com",
    messagingSenderId: "47313930713",
    appId: "1:47313930713:web:4138616116834d4e4eb1c8"
};

// Inicializando o app
const firebaseApp = initializeApp(firebaseConfig)

// Recuperando o banco firestore
export const db = getFirestore(firebaseApp)

// Fazer autenticação
export const auth = getAuth(firebaseApp)
