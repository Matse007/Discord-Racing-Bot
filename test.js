const sqlite3 = require('sqlite3').verbose();
const db = require("./db");

var mainData = [];
mainData.push(['sonicyellow', '0:42:00', 3]);
mainData.push(['flarebear', '0:39:00', 1]);
mainData.push(['Doka', '0:39:30', 2]);
mainData.push(['Suar', '0:57:30', 4]);
mainData.push(['amyrlinn', '0:59:30', 5]);

db.storeResults(mainData);