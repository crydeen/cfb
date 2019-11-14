var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");
require('firebase/database');
require("firebase/auth");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', {failed:false});
});

router.post('/', function(request, response) {
  var credentials = request.body;
  console.log(credentials.email);
  // console.log(credentials.password);
  // console.log(credentials.firstName);
  firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
  .then(function() {
    red=false
    response.redirect('/');
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    response.render('login', {failed:true});

  // ...
  });

});

module.exports = router;
