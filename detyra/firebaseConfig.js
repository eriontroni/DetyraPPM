// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCY4bon9EcBHe31EUC-5hj83GotTa8TSYw",
    authDomain: "detyra-dffed.firebaseapp.com",
    projectId: "detyra-dffed",
    storageBucket: "detyra-dffed.firebasestorage.app",
    messagingSenderId: "484810036899",
    appId: "1:484810036899:web:0bdb15297495b922981116",
    measurementId: "G-9ZBB79Z3ZJ"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);