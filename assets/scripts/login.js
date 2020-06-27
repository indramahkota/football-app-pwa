'use strict';

let config = {
    apiKey: "AIzaSyCcF-9pAPeFcGlChoU-X5thunL1TcmwhpI",
    authDomain: "indramahkota-pwapp.firebaseapp.com",
    databaseURL: "https://indramahkota-pwapp.firebaseio.com",
    projectId: "indramahkota-pwapp",
    storageBucket: "indramahkota-pwapp.appspot.com",
    messagingSenderId: "246885568751"
};
firebase.initializeApp(config);

let loginWithEmail = () => {
    let email = 'indramahkota1@gmail.com';
    let password = 'indra2516';
    
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
    
    firebase.auth().onAuthStateChanged(function(user){
        if (user){            
            let d = new Date();
            d.setTime(d.getTime() + (15*60*1000));
            
            let expires = d.toUTCString();
            document.cookie = `uid=${user.uid};expires=${expires};path=/`;
            
            location = 'page1.html';
        } else {
            console.log('user not found');
        }
    });
}

let loginWithFacebook = () => {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider)
    .then(function(result){
        let user = result.user;
        console.log('uid: ' + user.uid);
        console.log('dp: ' + user.displayName);
        
        let d = new Date();
        d.setTime(d.getTime() + (15*60*1000));
        
        let expires = d.toUTCString();
        document.cookie = `uid=${user.uid};expires=${expires};path=/`;
        
        location = 'page1.html';
    })
    .catch(function(error){
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
}

let loginWithGoogle = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });
    firebase.auth().signInWithPopup(provider)
    .then(function(result){
        let user = result.user;
        console.log('uid: ' + user.uid);
        console.log('dp: ' + user.displayName);
        
        let d = new Date();
        d.setTime(d.getTime() + (15*60*1000));
        
        let expires = d.toUTCString();
        document.cookie = `uid=${user.uid};expires=${expires};path=/`;
        
        location = 'page1.html';
    }).catch(function(error){
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
}

addEventListener('load', () => {
    //loginWithFacebook();
    location = 'page1.html';
});
