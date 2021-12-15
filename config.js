// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeAGPR3WyKJ39cjC8QmYNaFhCsMOmAfkM",
  authDomain: "agapeaangular-b7bb6.firebaseapp.com",
  projectId: "agapeaangular-b7bb6",
  storageBucket: "agapeaangular-b7bb6.appspot.com",
  messagingSenderId: "937841281730",
  appId: "1:937841281730:web:4a229cae341143636dc95b",
  measurementId: "G-GD9SV84DZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);