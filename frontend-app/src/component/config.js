import firebase from "firebase";
const config = {
    apiKey: "AIzaSyD3xcZDHm-TI6Qio3BZzLLlsV9q2sb-gfc",
    authDomain: "chat-7caa4.firebaseapp.com",
    databaseURL: "https://chat-7caa4.firebaseio.com",
    projectId: "chat-7caa4",
    storageBucket: "chat-7caa4.appspot.com",
    messagingSenderId: "58421091753",
    appId: "1:58421091753:web:502de188e4c3363c44b8b8"
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();