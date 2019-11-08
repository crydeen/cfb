var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");
require('firebase/database');

var record_list=[];
var sort_list=[];
var year='2019'
var week='01'
var count=0
var first_week='10'
var counts=[]

/* GET users listing. */
router.get('/', function(req, res, next) {
  var database = firebase.database();
  records = database.ref('season/records')
  records.on('value', function(snapshot) {
    for (var k=0; k<15; k++) {
      season=year+week;
      if (snapshot.val()[season] == undefined) {
        //console.log('Undefined ' + season)
      }
      else {
        sort_list.push({'year':year,'week':week,'contender':'Chase','win':snapshot.val()[season].Chase.win,'loss':snapshot.val()[season].Chase.loss},{'year':year,'week':week,'contender':'Drew','win':snapshot.val()[season].Drew.win,'loss':snapshot.val()[season].Drew.loss},{'year':year,'week':week,'contender':'Evan','win':snapshot.val()[season].Evan.win,'loss':snapshot.val()[season].Evan.loss},{'year':year,'week':week,'contender':'Hunter','win':snapshot.val()[season].Hunter.win,'loss':snapshot.val()[season].Hunter.loss},{'year':year,'week':week,'contender':'Shreve','win':snapshot.val()[season].Shreve.win,'loss':snapshot.val()[season].Shreve.loss});
        sort_list.sort((a,b) => (a.win < b.win) ? 1 : -1);
        for (var i = 0; i < sort_list.length; i++) {
          record_list.push({[week]:{[i]:sort_list[i]}})
          counts.push(count)
        }
        //console.log(JSON.stringify(record_list));
        sort_list=[]
        //record_list.push({'season':season,'Chase':{'win':snapshot.val()[season].Chase.win,'loss':snapshot.val()[season].Chase.loss},'Drew':{'win':snapshot.val()[season].Drew.win,'loss':snapshot.val()[season].Drew.loss},'Evan':{'win':snapshot.val()[season].Evan.win,'loss':snapshot.val()[season].Evan.loss},'Hunter':{'win':snapshot.val()[season].Hunter.win,'loss':snapshot.val()[season].Hunter.loss},'Shreve':{'win':snapshot.val()[season].Shreve.win,'loss':snapshot.val()[season].Shreve.loss}})
        // Chase = {win:snapshot.val()[season].Chase.win,loss:snapshot.val()[season].Chase.loss};
        // Drew = {win:snapshot.val()[season].Drew.win,loss:snapshot.val()[season].Drew.loss};
        // Evan = {win:snapshot.val()[season].Evan.win,loss:snapshot.val()[season].Evan.loss};
        // Hunter = {win:snapshot.val()[season].Hunter.win,loss:snapshot.val()[season].Hunter.loss};
        // Shreve = {win:snapshot.val()[season].Shreve.win,loss:snapshot.val()[season].Shreve.loss};
        count = count + 1
      }
      if (k<=7) {
        week='0'+(parseInt(week)+1+'')
      }
      else {
        week=(parseInt(week)+1+'')
      }

      //record_list[count].sort((a, b) => (a.win > b.win) ? 1 : -1);

    }
    // record_list.sort((a, b) => (a.win > b.win) ? 1 : -1);
    });
  res.render('ranks', { title: 'Ranks', record_list:record_list, count:count, first_week:first_week});
});

module.exports = router;
