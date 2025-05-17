// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { API_URL } from "../../API_URL";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket:import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId:import.meta.env.APPID,
  measurementId:import.meta.env.VITE_MEASURMEENTID
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
