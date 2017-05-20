var config = {
  apiKey: 'AIzaSyD0g19u1cQQbzphbkF5eSArtnsHi_9WakE',
  databaseURL: 'https://ghabs.firebaseio.com/'
};
firebase.initializeApp(config);

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
}

function loadFirebase(id) {
  var displayRef = firebase.database().ref('kiwis/' + 1);
  displayRef.on('value', function(snapshot) {
    //updateChart(snapshot.val());
    return snapshot.val();
  });
}


function pushToFirebase(id, value){
 firebase.database().ref('kiwis/' + id + '/values/').once('value', function(snapshot) {
    var kiwisValue = snapshot.val()
    //REPLACE WITH FIREBASE CURRENT USER
    var uid = firebase.auth().currentUser.uid;
    if (!uid){
      throw "Need to sign in"
    }
    if (kiwisValue[uid] === undefined){
        //update to make transactional
        firebase.database().ref('kiwis/' + id + '/values/').child(uid).set({value: value})
        //firebase.database().ref('/predictions/' + assertionId).child(userId).setValue(prediction)
    } else {
      var updates = {};
      updates['/kiwis/' + id + '/' + 'values/' + uid] = {value: value};
      firebase.database().ref().update(updates)
    }
  })
}

window.onload = function() {
  initApp();
  console.log('loaded')
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.id) {
      var displayRef = firebase.database().ref('kiwis/' + 1);
      displayRef.on('value', function(snapshot) {
       //updateChart(snapshot.val());
        sendResponse({id: snapshot.val()});
      });
    }
    console.log(request)
    if (request.push) {
      pushToFirebase(1, request.push.value);
      sendResponse({id: request.push.id});
    }
});