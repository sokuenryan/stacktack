
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app); 

const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();

function saveDataToDatabase(data) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      const userRef = ref(db, 'users/' + userId);

      set(userRef, data);
      console.log("Data saved to Realtime Database:", data);
    } else {
      console.log("User is not signed in.");
    }
  });
}

function saveDataToDatabaseList(data, listName) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      const userRef = ref(db, `users/${userId}/${listName}`);
      set(userRef, data);
      console.log(`Data saved to Realtime Database for ${listName}:`, data);
    } else {
      console.log("User is not signed in.");
    }
  });
}

function saveDataFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem('myData')); 

  if (data) {
    saveDataToDatabase(data); 
    localStorage.removeItem('myData'); 
  }
}

export { app, auth, db, analytics, googleProvider, saveDataFromLocalStorage, saveDataToDatabaseList };
