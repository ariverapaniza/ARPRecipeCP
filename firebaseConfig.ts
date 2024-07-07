//firebaseConfig.ts


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDpT3QIsnsl2eydpqGnxEnk2QpRGN5nr6M",
  authDomain: "arprecipe-expo.firebaseapp.com",
  projectId: "arprecipe-expo",
  storageBucket: "arprecipe-expo.appspot.com",
  messagingSenderId: "831068439077",
  appId: "1:831068439077:web:195b5964cd358cbd63b5cc",
  measurementId: "G-TGWYCKQD78"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, firestore, storage, auth };
