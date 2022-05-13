import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const provider = new GoogleAuthProvider();

const auth = getAuth();
signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });

const firebaseConfig = {
    apiKey: "AIzaSyDl_XiID_FW1tSr6CQ5bAwv8TAoF5T_bbA",
    authDomain: "eloquin-a7dce.firebaseapp.com",
    projectId: "eloquin-a7dce",
    storageBucket: "eloquin-a7dce.appspot.com",
    messagingSenderId: "1074546482474",
    appId: "1:1074546482474:web:12fc4a9f170bb06336d253"
};

const app = initializeApp(firebaseConfig);
