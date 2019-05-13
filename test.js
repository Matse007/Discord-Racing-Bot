const sqlite3 = require('sqlite3').verbose();
const db = require("./db");
var memes = require('./memes.json');

var mainData = [];
mainData.push(['sonicyellow', '0:43:00', 1]);
mainData.push(['flarebear', '0:42:00', 2]);
mainData.push(['Doka', '0:40:30', 3]);
mainData.push(['Suar', '0:52:30', 5]);
mainData.push(['amyrlinn', '0:56:30', 4]);

db.storeResults(mainData);