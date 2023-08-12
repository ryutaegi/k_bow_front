import firebase from "firebase/compat/app";

// Optionally import the services that you want to use
 import "firebase/auth";
 import "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
 import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBm6_m3rU_FhHJZsS8sXPZ2pJXXxqZdUdc",
    authDomain: "kbow-d7676.firebaseapp.com",
    databaseURL: "https://kbow-d7676-default-rtdb.firebaseio.com",
    projectId: "kbow-d7676",
    storageBucket: "kbow-d7676.appspot.com",
    messagingSenderId: "224755198105",
    appId : "1:224755198105:web:835671b1fda2e6b55b7008",
    measurementId: "G-LR2Z4S6KXB",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const firebase_db = firebase.database();
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
