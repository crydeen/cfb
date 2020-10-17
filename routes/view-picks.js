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
var week="7";
var year="2020";
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

request('https://api.collegefootballdata.com/lines?year='+year+'&week='+week+'&seasonType=regular', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  winner_check(body);
});

function winner_check(games) {
  for (var key in games) {
    if (games.hasOwnProperty(key)) {
        if ((games[key].homeConference=="SEC" | games[key].homeConference=="Pac-12" | games[key].homeConference=="Big Ten" | games[key].homeConference=="ACC" | games[key].homeConference=="Big 12") &
      (games[key].awayConference=="SEC" | games[key].awayConference=="Pac-12" | games[key].awayConference=="Big Ten" | games[key].awayConference=="ACC" | games[key].awayConference=="Big 12")) {
          //var temp={'home_team':games[key].home_team,'home_points':games[key].home_points,'away_team':games[key].away_team,'away_points':games[key].away_points}
          var caesar = games[key].lines.find(obj => {
            return obj.provider === "Bovada"
          })
          all_games.push({'count':count,'homeTeam':games[key].homeTeam,'homeScore':games[key].homeScore,'awayTeam':games[key].awayTeam,'awayScore':games[key].awayScore,'spread':caesar.spread})
          count++;
        }
    }
  }
  // if home team is favored, spread is negative
  // home: State    away: Arkansas    Spread: -17
  for (var i = 0; i < count; i++) {
    // if (all_games[i].spread < 4) {
    //   if (parseFloat(all_games[i].awayScore) > parseFloat(all_games[i].homeScore)) {
    //     winners.push({'count':i,'winner':all_games[i].awayTeam});
    //   }
    //   else if (parseFloat(all_games[i].homeScore) > parseFloat(all_games[i].awayScore)) {
    //     winners.push({'count':i,'winner':all_games[i].homeTeam});
    //   }
    //   else {
    //     winners.push({'count':i,'winner':'Undecided'});
    //   }
    // }

    if (parseFloat(all_games[i].awayScore) > parseFloat(all_games[i].homeScore) + parseFloat(all_games[i].spread)) {
      console.log("Away Win " + count + " " + all_games[i].awayTeam)
      winners.push({'count':i,'winner':all_games[i].awayTeam});
    }
    else if (parseFloat(all_games[i].homeScore) + parseFloat(all_games[i].spread) > parseFloat(all_games[i].awayScore)) {
      console.log("Away Win " + count + " " + all_games[i].homeTeam)
      winners.push({'count':i,'winner':all_games[i].homeTeam});
    }
    else {
      winners.push({'count':i,'winner':'Undecided'});
    }

  }
  record_check();
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
  res.render('view-picks', { title: 'Pick Viewer', winners:winners, week:week, chase_picks:chase_picks, drew_picks:drew_picks, evan_picks:evan_picks, hunter_picks:hunter_picks, shreve_picks:shreve_picks, chase_record:chase_record, drew_record:drew_record, evan_record:evan_record, hunter_record:hunter_record, shreve_record:shreve_record});
});

/* Record Check Function. */
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
  database.ref('season/records/' + season + '/Chase').set(chase_record);
  database.ref('season/records/' + season + '/Drew').set(drew_record);
  database.ref('season/records/' + season + '/Evan').set(evan_record);
  database.ref('season/records/' + season + '/Hunter').set(hunter_record);
  database.ref('season/records/' + season + '/Shreve').set(shreve_record);
}

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
