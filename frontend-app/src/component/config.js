import firebase from "firebase";
const config = {
    apiKey: window.lms_conversition_object.settings.api_key,
    authDomain: window.lms_conversition_object.settings.auth_domain,
    databaseURL: window.lms_conversition_object.settings.database_url,
    projectId: window.lms_conversition_object.settings.projectid,
    storageBucket: lms_conversition_object.settings.storage_bucket,
    messagingSenderId: lms_conversition_object.settings.messaging_sender_id,
    appId: lms_conversition_object.settings.app_id
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();



if(typeof window.lms_conversition_object != 'undefined' && typeof window.lms_conversition_object.email != 'undefined'){
    auth.signInWithEmailAndPassword(window.lms_conversition_object.email, window.lms_conversition_object.email)
    .then((userCredential) => {

    })
    .catch((error) => {
        if(error.code == 'auth/wrong-password' || error.code == 'auth/invalid-email' || error.code == 'auth/user-not-found'){
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
        }
    });
}