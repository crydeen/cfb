var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");
require('firebase/database');
require("firebase/auth");

var user;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', {failed:false});
});

router.post('/', function(request, response) {
  var credentials = request.body;
  console.log(credentials.email);
  console.log(credentials.password);
  console.log(credentials.firstName);
  if ((credentials.password == credentials.confirmPassword) && (credentials.password.length > 8)) {
    firebase.database().ref('contenders/' + credentials.firstName).set({'name':credentials.firstName,'asl':credentials.asl,'zodiac':credentials.zodiac,'neopet':credentials.neopet,'mixtape':credentials.mixtape})
    firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    .then(function() {
      user = firebase.auth().currentUser;
      console.log('User is ' + user);
      console.log('User is ' + user.uid);
      //firebase.database().ref('contenders/' + credentials.email).set({'name':credentials.firstName,'asl':credentials.asl,'zodiac':zodiac,'neopet':neopet,'mixtape':mixtape})
      console.log(user.displayName);
      user.updateProfile({
        displayName: credentials.firstName
      }).then(function() {
        console.log(user.displayName);
        response.redirect('/');
      }).catch(function(error) {
        response.render('register', {failed:true});
});

    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log("In the catch from createUser")
      response.render('register', {failed:true});
    });

  } else {
    response.render('register', {failed:true});
  }


});

module.exports = router;
