var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");
require('firebase/database');

const request = require('request');
var schedule=[];
var count=0;
var week=10;
var year=2019;
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  var chase_picks={};
  var drew_picks={};
  var evan_picks={};
  var hunter_picks={};
  var shreve_picks={};
  var database = firebase.database();
  var chase=database.ref('season/' + season + '/contenders/' + 'Chase');
  chase.on('value', function(snapshot) {
    if(snapshot.val()==undefined) {
      for (var i = 0; i < count; i++) {
        var new_pick_object={}
        new_pick_object[i]="Chaos";
        chase_picks=Object.assign(chase_picks,new_pick_object);
      }
    }
    else {
      chase_picks=snapshot.val();
    }
  });
  var drew=database.ref('season/' + season + '/contenders/' + 'Drew');
  drew.on('value', function(snapshot) {
    if(snapshot.val()==undefined) {
      for (var i = 0; i < count; i++) {
        var new_pick_object={};
        new_pick_object[i]="Chaos";
        drew_picks=Object.assign(drew_picks,new_pick_object);
      }
    }
    else {
      drew_picks=snapshot.val();
    }
  });
  var evan=database.ref('season/' + season + '/contenders/' + 'Evan');
  evan.on('value', function(snapshot) {
    if(snapshot.val()==undefined) {
      for (var i = 0; i < count; i++) {
        var new_pick_object={}
        new_pick_object[i]="Chaos";
        evan_picks=Object.assign(evan_picks,new_pick_object);
      }
    }
    else {
      evan_picks=snapshot.val();
    }
  });
  var hunter=database.ref('season/' + season + '/contenders/' + 'Hunter');
  hunter.on('value', function(snapshot) {
    if(snapshot.val()==undefined) {
      for (var i = 0; i < count; i++) {
        var new_pick_object={}
        new_pick_object[i]="Chaos";
        hunter_picks=Object.assign(hunter_picks,new_pick_object);
      }
    }
    else {
      hunter_picks=snapshot.val();
    }
  });
  var shreve=database.ref('season/' + season + '/contenders/' + 'Shreve');
  shreve.on('value', function(snapshot) {
    if(snapshot.val()==undefined) {
      for (var i = 0; i < count; i++) {
        var new_pick_object={}
        new_pick_object[i]="Chaos";
        shreve_picks=Object.assign(shreve_picks,new_pick_object);
      }
    }
    else {
      shreve_picks=snapshot.val();
    }
  });
  res.render('view-picks', { title: 'Welcome to the Pick Viewer', schedule:schedule, week:week, chase_picks:chase_picks, drew_picks:drew_picks, evan_picks:evan_picks, hunter_picks:hunter_picks, shreve_picks:shreve_picks});
});

module.exports = router;
