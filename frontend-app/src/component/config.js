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
export const storage = firebase.storage();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const Schema = {
    sender_id: window.lms_conversition_object.user_id,
    avatar_url: window.lms_conversition_object.avatar_url,
    text_msg: '', 
    room: 'public', 
    createDate: Date.now()
}


auth.signInWithEmailAndPassword(window.lms_conversition_object.email, window.lms_conversition_object.email)
  .then((userCredential) => {
  })
  .catch((error) => {
    auth.createUserWithEmailAndPassword(window.lms_conversition_object.email, window.lms_conversition_object.email)
    .then((userCredential) => {
    })
    .catch(error => {
        auth.sendPasswordResetEmail(window.lms_conversition_object.email)
        .then(() => {
        })
        .catch((error) => {
        });
    })
  });