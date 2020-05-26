let firebaseConfig = {
  apiKey: 'AIzaSyBoCLNFNU2-_J6NQtbLD7GGy30zRvkzBmk',
  authDomain: 'pulse-box.firebaseapp.com',
  databaseURL: 'https://pulse-box.firebaseio.com',
  projectId: 'pulse-box',
  storageBucket: 'pulse-box.appspot.com',
  messagingSenderId: '118237267477',
  appId: '1:118237267477:web:ccee5e3ab7928a8ce4301c',
  measurementId: 'G-0Q1RSLYZVN'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function signInButton() {
  const emailText = document.getElementById('email'); 
  const passwordText = document.getElementById('password');
signin.onclick = function(event) {    
    const email = emailText.value;
    const pass = passwordText.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  }
} 

function handleSignUp() {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);

  });

}
   /**
     * Handles the sign in button press.
     */
function toggleSignIn() {
      let numberOfClicks = 0;
      if (numberOfClicks >= 0) {
      if (firebase.auth().currentUser) {
        numberOfClicks++;
        firebase.auth().signOut();
  
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;

          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('sign-in').disabled = false;

        });
      } 
    } 
    if (numberOfClicks == 1){
        console.log('refreshing');
        window.location.reload(true);
    }  
}

function uploadVideoToFirebase(event) {
        event.stopPropagation();
        event.preventDefault();
        const storage = firebase.storage().ref();
        let file = event.target.files[0];
        let metadata = {
          'contentType': file.type
        };
        
        firebase.auth().onAuthStateChanged(function(user) {
          if(user) {

            let pulseBox = storage.child('data/' + user.uid);

                // Find all the prefixes and items.
                pulseBox.listAll().then(function(res) {
                    res.prefixes.forEach(function(folderRef) {
                    // All the prefixes under listRef.
                    // You may call listAll() recursively on them.;
                    });
                    res.items.forEach(function(itemRef) {
                    // All the items under listRef
                    let pulseCurrentStorage = storage.child(itemRef.location.path_)
                    pulseCurrentStorage.delete().then(function() {
                        console.log('Cleaning ' + user.uid + ' storage box.');
                    });
                    console.log(itemRef.location.path_);

                    });
                }).catch(function(error) {
            // Uh-oh, an error occurred!
            });
              
          storage.child('data/' + user.uid + '/' + file.name).put(file, metadata).on('state_changed', function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress > 0) {
              document.getElementById('progress-bar').classList.remove('hidden');
            }
            document.getElementById('capture-button').classList.add('hidden');
            console.log('Upload is ' + progress + '% done');
            document.querySelector('.progress-bar').style.width = progress + '%';
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');

          }).catch(function(error) {
            console.error('Upload failed:', error);
          });
        } 
    });
  } 

function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
      if(user) { 
          document.getElementById('user-uid').textContent = user.uid;
          document.getElementById('capture-button').addEventListener('change', uploadVideoToFirebase, false);
          document.getElementById('capture-button').disabled = true;    
          document.getElementById('sign-in').textContent = "Sign out";
          document.getElementById('sign-in-form').classList.add('hidden');
          document.getElementById('capture-button').classList.remove('hidden');
          document.getElementById('sign-up').classList.add('hidden');
          document.getElementById('progress-bar').classList.add('hidden');
          document.getElementById('title-text').classList.add('hidden');
          document.getElementById('navigation').classList.remove('hidden');
          document.getElementById('login-alert').classList.remove('hidden');
          document.getElementById('uid-badge').classList.remove('hidden');
          console.log("logged in");
      }
      else {
        document.getElementById('user-uid').textContent = "";
        document.getElementById('capture-button').addEventListener('change', uploadVideoToFirebase, true);
        document.getElementById('sign-in').textContent = "Sign in";
        document.getElementById('sign-in-form').classList.remove('hidden');
        document.getElementById('capture-button').classList.add('hidden');
        document.getElementById('sign-up').classList.remove('hidden');
        document.getElementById('progress-bar').classList.add('hidden');
        document.getElementById('title-text').classList.remove('hidden');
        document.getElementById('navigation').classList.add('hidden');
        document.getElementById('login-alert').classList.add('hidden');
        document.getElementById('uid-badge').classList.add('hidden');
        console.log("logged out");
      }
  });
  document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
}

window.onload = function() {
    initApp();
};
