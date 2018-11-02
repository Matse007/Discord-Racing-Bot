const sqlite3 = require('sqlite3').verbose();

var registeredPlayers = [];

function storeResults(playerResults) {

    let db = new sqlite3.Database('C:\\Users\\pwinters\\Documents\\Personal\\testdb.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the Boop Troop Racing Stats database.');
    });

    var playerNames = playerResults.map(player => "('" + player[0] + "')").join(",");

    db.serialize(() => {
        db.run('REPLACE INTO runners(name) VALUES' + playerNames)
        .all("SELECT * FROM runners", getRegisteredRunners);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

function getRegisteredRunners(err, rows){
	if (err) {
        throw err;
    }

    rows.forEach((item, index) => {
    	registeredPlayers.push([item.id, item.name]);
    });


}

var mainData = [];
mainData.push(['sonicyellow', '0:42:00', 3]);
mainData.push(['flarebear', '0:39:00', 1]);
mainData.push(['Doka', '0:39:30', 2]);
mainData.push(['Suar', '0:57:30', 4]);
mainData.push(['amyrlinn', '0:59:30', 5]);

storeResults(mainData);