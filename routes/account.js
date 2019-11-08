var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");

var week="11";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('account', { title: 'Account', week:week});
});

module.exports = router;
