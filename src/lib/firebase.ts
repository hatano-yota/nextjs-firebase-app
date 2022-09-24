// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
if (typeof window !== "undefined" && getApps().length === 0) {
  const firebaseConfig = {
    apiKey: "AIzaSyAqMu2hlJHISTXO1oTlsCBhqwq28OGhU5Q",
    authDomain: "nextjs-firebase-app-9d456.firebaseapp.com",
    projectId: "nextjs-firebase-app-9d456",
    storageBucket: "nextjs-firebase-app-9d456.appspot.com",
    messagingSenderId: "634410169498",
    appId: "1:634410169498:web:4ac00f209d70004a739b23",
    measurementId: "G-GLNTFC8P6F",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
}
