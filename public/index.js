let firebaseConfig = {
  apiKey: "AIzaSyBoCLNFNU2-_J6NQtbLD7GGy30zRvkzBmk",
  authDomain: "pulse-box.firebaseapp.com",
  databaseURL: "https://pulse-box.firebaseio.com",
  projectId: "pulse-box",
  storageBucket: "pulse-box.appspot.com",
  messagingSenderId: "118237267477",
  appId: "1:118237267477:web:ccee5e3ab7928a8ce4301c",
  measurementId: "G-0Q1RSLYZVN",
};

firebase.initializeApp(firebaseConfig);

function googleSignInButton() {
  const auth = firebase.auth();
  let provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(function (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      let pendingCred = error.credential;
      let email = error.email;
      auth.fetchSignInMethodsForEmail(email).then(function (methods) {
        if (methods[0] === "password") {
          let password = promptUserForPassword();
          auth
            .signInWithEmailAndPassword(email, password)
            .then(function (user) {
              return user.linkWithCredential(pendingCred);
            })
            .then(function () {});
          return;
        }
        let provider = getProviderForProviderId(methods[0]);
        auth.signInWithPopup(provider).then(function (result) {
          result.user
            .linkAndRetrieveDataWithCredential(pendingCred)
            .then(function (usercred) {});
        });
      });
    }
  });
}

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
    })
    .catch(function (error) {
      // An error happened.
    });
}

function uploadVideoToFirebase() {
  const storage = firebase.storage().ref();
  let element = document.getElementById('upload');
  let file = element.files[0];
  let blob = file.slice(0, file.size, 'video/quicktime'); 
  let newFile = new File([blob], 'hr_test.MOV', {type: 'video/quicktime'});

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let pulseBox = storage.child("data/" + user.uid);
      // Find all the prefixes and items.
      pulseBox
        .listAll()
        .then(function (res) {
          res.prefixes.forEach(function (folderRef) {
            // All the prefixes under listRef.
            // You may call listAll() recursively on them.;
          });
          res.items.forEach(function (itemRef) {
            let pulseCurrentStorage = storage.child(itemRef.location.path_);
              pulseCurrentStorage.delete().then(function () {
       console.log("Cleaning " + user.uid + " storage box.");
              });
          });

        })
        .catch(function (error) {});
    storage.child("data/" + user.uid + "/" + newFile.name)
        .put(newFile)
        .on("state_changed", function (snapshot) {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress > 0) {
            document.getElementById("progress-bar").classList.remove("hidden");
          }
          document.querySelector(".progress-bar").style.width = progress + "%";
        });
    }
  });
}

function initApp() {
  let numberOfClicks = 0;
  signOut();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (numberOfClicks >= 0) {
        numberOfClicks++;
      }
      document.getElementById("welcome-div").classList.remove("hidden");
      document.getElementById("welcome-text").textContent =
        "Welcome, " + user.displayName;
      document.getElementById("user-uid").textContent = user.uid;
      document
        .getElementById("capture-button")
        .addEventListener("change", uploadVideoToFirebase, false);
      document.body.style.background = "white";
      document.getElementById("sign-in").classList.add("hidden");
      document.getElementById("capture-button").classList.remove("hidden");
      document.getElementById("sign-out").classList.remove("hidden");
      document.getElementById("progress-bar").classList.add("hidden");
      document.getElementById("pulse-logo").classList.add("hidden");
      document.getElementById("navigation-bar").classList.remove("hidden");
      document.getElementById("login-alert").classList.remove("hidden");
      document.getElementById("uid-badge").classList.remove("hidden");
      //console.log('logged in');
    } else {
      if (numberOfClicks == 1) {
        numberOfClicks++;
        window.location.reload(true);
        numberOfClicks = 0;
      }
      document.body.style.background = "#3ED7F9";
      document.getElementById("welcome-div").classList.add("hidden");
      document.getElementById("user-uid").textContent = "";
      document
        .getElementById("capture-button")
        .addEventListener("change", uploadVideoToFirebase, true);
      document.getElementById("sign-in").classList.remove("hidden");
      document.getElementById("capture-button").classList.add("hidden");
      document.getElementById("sign-out").classList.add("hidden");
      document.getElementById("progress-bar").classList.add("hidden");
      document.getElementById("pulse-logo").classList.remove("hidden");
      document.getElementById("navigation-bar").classList.add("hidden");
      document.getElementById("login-alert").classList.add("hidden");
      document.getElementById("uid-badge").classList.add("hidden");
      //console.log('logged out');
    }
  });
  $(".alert").alert();
  document
    .getElementById("sign-in")
    .addEventListener("click", googleSignInButton, false);
  document.getElementById("sign-out").addEventListener("click", signOut, false);
}

window.onload = function () {
  initApp();
};

