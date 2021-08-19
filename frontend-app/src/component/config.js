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
      // let uid = firebase.auth().currentUser.uid;
      // const coursePublicDB = database.ref('/messages/' + lms_conversition_object.post_id +'/users/' + uid);
      // coursePublicDB
      // .orderByChild('user_id')
      // .equalTo(window.lms_conversition_object.user_id)
      // .on('value', snapshot => {
      //     if(!snapshot.val()){
      //       coursePublicDB.set({
      //         name: window.lms_conversition_object.display_name, 
      //         user_type: window.lms_conversition_object.user_type, 
      //         user_id: window.lms_conversition_object.user_id,
      //         last_changed: firebase.database.ServerValue.TIMESTAMP,
      //         status: 'online'
      //       })
      //     }
      // });

      
  })
  .catch((error) => {
    auth.createUserWithEmailAndPassword(window.lms_conversition_object.email, window.lms_conversition_object.email)
    .then((userCredential) => {
      //Store user info. 
      // const coursePublicDB = database.ref('/messages/' + lms_conversition_object.post_id +'/users');
      // coursePublicDB.set({
      //   name: window.lms_conversition_object.display_name, 
      //   user_type: window.lms_conversition_object.user_type, 
      //   user_id: window.lms_conversition_object.user_id,
      //   last_changed: firebase.database.ServerValue.TIMESTAMP,
      //   status: 'online'
      // })

    })
    .catch(error => {
        auth.sendPasswordResetEmail(window.lms_conversition_object.email)
        .then(() => {
        })
        .catch((error) => {
        });
    })
  });


  database.ref('.info/connected').on('value', function(snapshot) {
    if (snapshot.val() == false) {
      return;
    };  

    let userStatusDatabaseRef = database.ref('/messages/' + lms_conversition_object.post_id +'/users')
    // var uid = firebase.auth().currentUser.uid;
    // console.log('auth id: ', uid)
    // If we are currently connected, then use the 'onDisconnect()' 
    // method to add a set which will only trigger once this 
    // client has disconnected by closing the app, 
    // losing internet, or any other means.
    userStatusDatabaseRef.onDisconnect()
    .orderByChild('room')
    .set(isOfflineForDatabase).then(function() {
      // The promise returned from .onDisconnect().set() will
      // resolve as soon as the server acknowledges the onDisconnect() 
      // request, NOT once we've actually disconnected:
      // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

      // We can now safely set ourselves as 'online' knowing that the
      // server will mark us as offline once we lose connection.
      userStatusDatabaseRef.set(isOnlineForDatabase);
    });
  });