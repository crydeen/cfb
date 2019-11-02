var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");
var favicon = require('serve-favicon');
var path = require('path');
require('firebase/database');

const request = require('request');
var schedule=[];
var winners=[];
var count=0;
var week="10";
var year="2019";
var season=""+year+week;
var all_games=[];
var chase_picks={};
var drew_picks={};
var evan_picks={};
var hunter_picks={};
var shreve_picks={};
var chase_record={'win':0,'loss':0};
var drew_record={'win':0,'loss':0};
var evan_record={'win':0,'loss':0};
var hunter_record={'win':0,'loss':0};
var shreve_record={'win':0,'loss':0};

request('https://api.collegefootballdata.com/games?year=2019&week='+week+'&seasonType=regular', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  winner_check(body);
});

function winner_check(games) {
  for (var key in games) {
    if (games.hasOwnProperty(key)) {
        if ((games[key].home_conference=="SEC" | games[key].home_conference=="Pac-12" | games[key].home_conference=="Big Ten" | games[key].home_conference=="ACC" | games[key].home_conference=="Big-12") &
      (games[key].away_conference=="SEC" | games[key].away_conference=="Pac-12" | games[key].away_conference=="Big Ten" | games[key].away_conference=="ACC" | games[key].away_conference=="Big-12")) {
          //var temp={'home_team':games[key].home_team,'home_points':games[key].home_points,'away_team':games[key].away_team,'away_points':games[key].away_points}
          all_games.push({'count':count,'home_team':games[key].home_team,'home_points':games[key].home_points,'away_team':games[key].away_team,'away_points':games[key].away_points})
          count++;
        }
    }
  }
  for (var i = 0; i < count; i++) {
    if (all_games[i].away_points > all_games[i].home_points) {
      winners.push({'count':i,'winner':all_games[i].away_team});
    }
    else if (all_games[i].home_points > all_games[i].away_points) {
      winners.push({'count':i,'winner':all_games[i].home_team});
    }
    else {
      winners.push({'count':i,'winner':'Undecided'});
    }
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
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
  record_check();
  res.render('view-picks', { title: 'Welcome to the Pick Viewer', winners:winners, week:week, chase_picks:chase_picks, drew_picks:drew_picks, evan_picks:evan_picks, hunter_picks:hunter_picks, shreve_picks:shreve_picks, chase_record:chase_record, drew_record:drew_record, evan_record:evan_record, hunter_record:hunter_record, shreve_record:shreve_record});
});

function record_check() {
  chase_record={'win':0,'loss':0};
  drew_record={'win':0,'loss':0};
  evan_record={'win':0,'loss':0};
  hunter_record={'win':0,'loss':0};
  shreve_record={'win':0,'loss':0};
  var flag = false;
  for (var i = 0; i < winners.length; i++) {
    if (winners[i].winner == 'Undecided') {
      break;
    }
    else {
      if (chase_picks[i]==undefined || chase_picks[i]=='Chaos') {

      }
      else {
        flag = false;
        for (var j=0; j < winners.length; j++) {
          if (winners[i].winner==chase_picks[j]) {
            flag=true;
          }
        }
        if (flag) {
          chase_record.win = chase_record.win + 1;
        }
        else {
          chase_record.loss = chase_record.loss + 1;
        }
      }
      if (drew_picks[i]==undefined || drew_picks[i]=='Chaos') {

      }
      else {
        flag = false;
        for (var j=0; j < winners.length; j++) {
          if (winners[i].winner==drew_picks[j]) {
            flag=true;
          }
        }
        if (flag) {
          drew_record.win = drew_record.win + 1;
        }
        else {
          drew_record.loss = drew_record.loss + 1;
        }
      }
      if (evan_picks[i]==undefined || evan_picks[i]=='Chaos') {

      }
      else {
        flag = false;
        for (var j=0; j < winners.length; j++) {
          if (winners[i].winner==evan_picks[j]) {
            flag=true;
          }
        }
        if (flag) {
          evan_record.win = evan_record.win + 1;
        }
        else {
          evan_record.loss = evan_record.loss + 1;
        }
      }
      if (hunter_picks[i]==undefined || hunter_picks[i]=='Chaos') {

      }
      else {
        flag = false;
        for (var j=0; j < winners.length; j++) {
          if (winners[i].winner==hunter_picks[j]) {
            flag=true;
          }
        }
        if (flag) {
          hunter_record.win = hunter_record.win + 1;
        }
        else {
          hunter_record.loss = hunter_record.loss + 1;
        }
      }
      if (shreve_picks[i]==undefined || shreve_picks[i]=='Chaos') {

      }
      else {
        flag = false;
        for (var j=0; j < winners.length; j++) {
          if (winners[i].winner==shreve_picks[j]) {
            flag=true;
          }
        }
        if (flag) {
          shreve_record.win = shreve_record.win + 1;
        }
        else {
          shreve_record.loss = shreve_record.loss + 1;
        }
      }
    }
  }
  var database = firebase.database();
  database.ref('season/' + season + '/contenders/' + 'Chase_Record').set(chase_record);
  database.ref('season/' + season + '/contenders/' + 'Drew_Record').set(drew_record);
  database.ref('season/' + season + '/contenders/' + 'Evan_Record').set(evan_record);
  database.ref('season/' + season + '/contenders/' + 'Hunter_Record').set(hunter_record);
  database.ref('season/' + season + '/contenders/' + 'Shreve_Record').set(shreve_record);
}

module.exports = router;
