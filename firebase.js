import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

import {
    getAuth,
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDNuLggsuh-MiMlhBnHnsF1gO65Tc0v8QU",
    authDomain: "date-proposal-89810.firebaseapp.com",
    databaseURL: "https://date-proposal-89810-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "date-proposal-89810",
    storageBucket: "date-proposal-89810.firebasestorage.app",
    messagingSenderId: "162319913657",
    appId: "1:319913657:web:74c146865d1c61f0a5c168"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = getAuth(app);

export {
    app,
    database,
    auth,
    ref,
    push,
    set,
    serverTimestamp,
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};