// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { API_URL } from "../../API_URL";

const firebaseConfig = {
  apiKey: "AIzaSyDjuzkbSBRZV728rV87fGD4uNBreFiqD80",
  authDomain: "signinwith-e7000.firebaseapp.com",
  projectId: "signinwith-e7000",
  storageBucket: "signinwith-e7000.firebasestorage.app",
  messagingSenderId: "11657156503",
  appId: "1:11657156503:web:f4458e53adfe415bf356d2",
  measurementId: "G-4YDMN1XX9B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const payload = {
      name: user.displayName,
      email: user.email,
      google_id: user.uid,
      profile_picture: user.photoURL,
    };

    const response = await axios.post(`${API_URL}/users/google-signin`, payload);

    return response.data;
  } catch (error) {
    console.error('Google Sign-In Error:', error.response?.data || error.message);
    throw error; 
  }
};

export { auth, provider, signInWithPopup, handleGoogleLogin };
