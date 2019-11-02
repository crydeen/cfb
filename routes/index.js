var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");
var favicon = require('serve-favicon');
var path = require('path');
require('firebase/database');

const request = require('request');
var schedule=[];
var count=0;
var week="10";
var year="2019";
var season=""+year+week;

request('https://api.collegefootballdata.com/games?year=2019&week='+week+'&seasonType=regular', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  game_list(body);
});

function game_list(games) {
  for (var key in games) {
    if (games.hasOwnProperty(key)) {
        //console.log(key + " -> " + JSON.stringify(games[key]));
        //console.log(key + " -> " + games[key].home_team);
        if ((games[key].home_conference=="SEC" | games[key].home_conference=="Pac-12" | games[key].home_conference=="Big Ten" | games[key].home_conference=="ACC" | games[key].home_conference=="Big-12") &
      (games[key].away_conference=="SEC" | games[key].away_conference=="Pac-12" | games[key].away_conference=="Big Ten" | games[key].away_conference=="ACC" | games[key].away_conference=="Big-12")) {
          //console.log(key + " -> " + games[key].away_team + " at " + games[key].home_team);
          schedule.push({'count':count,'away':games[key].away_team,'home':games[key].home_team});
          count++;
        }
    }
  }
  //console.log(schedule)
}

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(schedule);
  res.render('index', { title: 'Welcome to the Hecking Show', schedule:schedule, week:week});
});
//{"0":"Arizona","1":"UCLA","2":"Illinois","3":"Indiana","4":"Purdue","5":"Maryland","6":"Wake Forest","7":"Syracuse","8":"Florida","9":"Florida State","10":"Washington","11":"Arkansas","12":"Georgia Tech","13":"Auburn","14":"South Carolina","15":"North Carolina","16":"USC","contender":"Chase"}
router.post('/', function(request, response) {
  var database = firebase.database();
  var picks = request.body;
  var pick_object={}
  for (var i = 0; i < count; i++) {
    var pick=picks[i];
    var new_pick_object={}
    new_pick_object[i]=pick;
    pick_object=Object.assign(pick_object,new_pick_object);
  }
  console.log(JSON.stringify(pick_object));
  database.ref('season/' + season + '/contenders/' + picks["contender"]).set(pick_object);
  response.redirect('/view-picks');
});

module.exports = router;
