var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");
var favicon = require('serve-favicon');
var path = require('path');
require('firebase/database');

const request = require('request');
var schedule = [];
var count = 0;
var week = "6";
var year = "2020";
var season = ""+year+week;
var name = '';
var red = false;
var isLoggedIn=false;
var ap_rankings;

request('https://api.collegefootballdata.com/rankings?year='+year+'&week='+week+'&seasonType=regular', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  rank_parse(body);
  request('https://api.collegefootballdata.com/lines?year='+year+'&week='+week+'&seasonType=regular', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    game_list(body);
  });
});

function rank_parse(ranks) {
  for (var key in ranks) {
    if (ranks.hasOwnProperty(key)) {
      // console.log(key + " -> " + JSON.stringify(ranks[key]));
      console.log(key + " -> " + JSON.stringify(ranks[key]));
      ap_rankings = ranks[key].polls.find(obj => {
         return obj.poll === "AP Top 25"
      })

    }
  }
}

function game_list(games) {
  for (var key in games) {
    if (games.hasOwnProperty(key)) {
        //console.log(key + " -> " + JSON.stringify(games[key]));
        //console.log(key + " -> " + games[key].home_team);
        if ((games[key].homeConference=="SEC" | games[key].homeConference=="Pac-12" | games[key].homeConference=="Big Ten" | games[key].homeConference=="ACC" | games[key].homeConference=="Big 12") &
      (games[key].awayConference=="SEC" | games[key].awayConference=="Pac-12" | games[key].awayConference=="Big Ten" | games[key].awayConference=="ACC" | games[key].awayConference=="Big 12")) {
          //console.log(key + " -> " + games[key].away_team + " at " + games[key].home_team);
          var caesar = games[key].lines.find(obj => {
            return obj.provider === "Bovada"
          })

          var awayRank = ap_rankings.ranks.find(obj => {
            return obj.school === games[key].awayTeam
          })

          var homeRank = ap_rankings.ranks.find(obj => {
            return obj.school === games[key].homeTeam
          })

          if (awayRank !== undefined) {
            awayRank = awayRank.rank;
          }

          if (homeRank !== undefined) {
            homeRank = homeRank.rank;
          }

          //var math = parseFloat(caesar.spread) + 4

          //console.log("Spread: " + caesar.spread + " Math result " + math)

          //console.log("Trying to grab Caesars" + result.provider + " " + result.spread)
          schedule.push({'count':count,'away':games[key].awayTeam,'awayRank':awayRank,'home':games[key].homeTeam,'homeRank':homeRank,'spread':caesar.spread,'formattedSpread':caesar.formattedSpread});
          count++;
        }
    }
  }
  //console.log(schedule)
}

/* GET home page. */
router.get('/', function(req, res, next) {
  red=false
  res.render('index', { title: 'Welcome to the Hecking Show', schedule:schedule, week:week, red:red});
//   firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     isLoggedIn=true
//     name=user.displayName
//     res.render('index', { title: 'Welcome to the Hecking Show', schedule:schedule, week:week, name:name, isLoggedIn:isLoggedIn});
//   } else {
//     isLoggedIn=false
//     name='Chaos'
//     res.render('index', { title: 'Welcome to the Hecking Show', schedule:schedule, week:week, name:name, isLoggedIn:isLoggedIn});
//     //res.render('login', { failed:false});
//   }
// });
});
//{"0":"Arizona","1":"UCLA","2":"Illinois","3":"Indiana","4":"Purdue","5":"Maryland","6":"Wake Forest","7":"Syracuse","8":"Florida","9":"Florida State","10":"Washington","11":"Arkansas","12":"Georgia Tech","13":"Auburn","14":"South Carolina","15":"North Carolina","16":"USC","contender":"Chase"}
router.post('/', function(request, response) {
  var picks = request.body;
  if (picks['contender'] == '') {
    red = true
    response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
    response.render('index', { title: "You've failed the show, pick your player", schedule:schedule, week:week, red:red})
  }
  else {
    var database = firebase.database();
    var pick_object={}
    for (var i = 0; i < count; i++) {
      var pick=picks[i];
      var new_pick_object={}
      new_pick_object[i]=pick;
      pick_object=Object.assign(pick_object,new_pick_object);
    }
    database.ref('season/' + season + '/contenders/' + picks["contender"]).set(pick_object);
    response.redirect('/view-picks');
    }
//   firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     console.log(user.displayName);
//     var database = firebase.database();
//     var pick_object={}
//     for (var i = 0; i < count; i++) {
//       var pick=picks[i];
//       var new_pick_object={}
//       new_pick_object[i]=pick;
//       pick_object=Object.assign(pick_object,new_pick_object);
//     }
//     database.ref('season/' + season + '/contenders/' + user.displayName).set(pick_object);
//     response.redirect('/view-picks');
//   } else {
//     response.render('index', { title: "You've failed the show, login at the bottom", schedule:schedule, week:week, red:red})
//   }
// });

});

module.exports = router;
