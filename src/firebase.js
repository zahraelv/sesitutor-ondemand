// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABfbFMg6EOduOd21kcC5rsfIOm9iQMwn4",
  authDomain: "sesitutor-project.firebaseapp.com",
  projectId: "sesitutor-project",
  storageBucket: "sesitutor-project.firebasestorage.app",
  messagingSenderId: "307684877956",
  appId: "1:307684877956:web:5cd533a8fd346307cb04d1",
  measurementId: "G-YNG3J1LPNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
