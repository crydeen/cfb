var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");
require('firebase/database');
require("firebase/auth");

var week="14";
var name='Chaos';
var email='Ragnarok@chaotic.com';
var asl='99/?/The Moment'
var zodiac='Spicy Equestrian'
var neopet='Eyrie'
var mixtape='Coco Da Prince'
var user;

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(firebase.auth().currentUser==null) {
    console.log("user account null")
    res.render('account', { title: 'Account', name:name, email:email, asl:asl, zodiac:zodiac, neopet:neopet, mixtape:mixtape, isLoggedIn:false});
  }
  else {
    user = firebase.auth().currentUser;
    name=user.displayName;
    email=user.email;
    var database = firebase.database();
    var chase=database.ref('contenders/' + name + '/');
    chase.on('value', function(snapshot) {
      if(snapshot.val()==undefined) {
        console.log("snapshot undefined")
        res.render('account', { title: 'Account', name:name, email:email, asl:asl, zodiac:zodiac, neopet:neopet, mixtape:mixtape, isLoggedIn:true});
      }
      else {
        console.log(snapshot.val().asl)
        asl=snapshot.val().asl;
        zodiac=snapshot.val().zodiac;
        neopet=snapshot.val().neopet;
        mixtape=snapshot.val().mixtape;
        res.render('account', { title: 'Account', name:name, email:email, asl:asl, zodiac:zodiac, neopet:neopet, mixtape:mixtape, isLoggedIn:true});
      }
    });
    //res.render('account', { title: 'Account', name:name, email:email, asl:asl, zodiac:zodiac, neopet:neopet, mixtape:mixtape});
  }

});

router.post('/', function(request, response) {
  firebase.auth().signOut().then(function() {
    response.redirect('/')
  }).catch(function(error) {
    response.render('account', { title: 'Account', name:name, email:email, asl:asl, zodiac:zodiac, neopet:neopet, mixtape:mixtape, isLoggedIn:true});
  });
});

module.exports = router;
