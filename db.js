const sqlite3 = require('sqlite3').verbose();

var fixedPlayerData = [];
var resultString = "";
var mainData = [];

module.exports = {
    storeResults: function(playerResults) {

    	mainData = playerResults;

	    let db = new sqlite3.Database('BTStats.db', sqlite3.OPEN_READWRITE, (err) => {
	        if (err) {
				console.error(err.message);
				return;
	        }
	        console.log('Connected to the Boop Troop Racing Stats database.');
	    });

	    var playerNames = playerResults.map(player => "('" + player[0] + "')").join(",");

	    db.serialize(() => {
	        db.run('INSERT OR IGNORE INTO runners(name) VALUES' + playerNames, (err) => {
	            if (err) {
	                console.error(err.message);
	            }
	        })
	        .all("SELECT * FROM runners", getRegisteredRunners)
	        .run('INSERT INTO results(runner_id, time, placement) VALUES' + resultString, (err) => {
	            if (err) {
	                console.log('FAILED QUERY STRING: INSERT INTO results(runner_id, time, placement) VALUES' + resultString);
	                console.error(err.message);
	            }
	        });
	    });

	    db.close((err) => {
	        if (err) {
	            console.error(err.message);
	        }
	        console.log('Close the database connection.');
	    });
	},
    fetchStats: function(playerName, category="") {
        // whatever
    }
};

function getRegisteredRunners(err, rows){
	if (err) {
        throw err;
    }

    rows.forEach((item, index) => {
        mainData.forEach((player, i) => {
            if (item.name == player[0]){
                let playerResult = {
                    runner_id: item.id,
                    time: player[1],
                    placement: player[2]
                };
                fixedPlayerData.push(playerResult);
            }
        });
    });

    resultString = fixedPlayerData.map(result =>
        "(" + result.runner_id +
        ",'" + result.time +
        "'," + result.placement + ")"
    ).join(",") + ";";
}