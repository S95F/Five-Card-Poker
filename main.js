

var path = require('path');
var express = require('express')
var serveStatic = require('serve-static')
var app = express()

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);


//temp
let fs = require('fs');
let mysql = require('mysql');

//config
let config = require('./routes/sqlConfig.js');
config = JSON.parse(JSON.stringify(config));
var con = mysql.createConnection(config);

function execSql(statement, values) {
  let p = new Promise(function (res, rej) {
    con.query(statement, values, function (err, result) {
      if (err) rej(err);
      else res(result);
    });
  });
  return p;
}


function getDBtoJSON(){
	var sql = "SHOW PROCEDURE STATUS WHERE Db = ?;";
	return execSql(sql,[config.database]).then((r) => {
		var json = {}
		var promises = [];
		for(var n in r){
			var sqlInner = "show create procedure " + r[n].Name + ";";
			promises.push(execSql(sqlInner, []).then((r) => {
				json[r[0].Procedure] = r[0]['Create Procedure'];
			}));
		}
		return Promise.all(promises).then(() => {
			var temp = {};
			temp.storedProcedures = json;
			json = temp;
			return json
		});
	}).then((json) => {
		var s = "show tables;";
		return execSql(s,[]).then((r) => {
			var promises = []
			json.tables = {};
			for(var i in r){
				promises.push(execSql("show create table "+r[i]["Tables_in_" + config.database],[]).then((r) => {
						json.tables[r[0].Table] = r[0]['Create Table'];
				}));
			}
			return Promise.all(promises).then(() => { return json });
		}).then((r) => {
			return r;
		});
	}).catch((err) => {
		console.error(err);
		return;
	});
}

function exportDB(){
	getDBtoJSON().then((r) => {
		fs.writeFile('dbconfig.json', JSON.stringify(r) , (err) => {
		  if (err) {
			console.error(err)
			return
		  }
		});
	});
}


function validateDB(){
	var results = {};
	var data = new Promise(function (res, rej) {
		fs.readFile('dbconfig.json', 'utf8' , (err, data) => {
			if (err) {
				console.error(err)
				return rej(err);
			}
			return res(JSON.parse(data));
		});
	});
	data.then((r) => { results.data = r; });
	var dbJson = getDBtoJSON();
	dbJson.then((r) => { results.dbJson = r });
	Promise.all([dbJson,data]).then(() => {
		const dKeys = Object.keys(results.data.storedProcedures);
		const bKeys = Object.keys(results.dbJson.storedProcedures);
		var OFKsp = [];
		for(var i in dKeys){
			if(results.data.storedProcedures[dKeys[i]] != results.dbJson.storedProcedures[bKeys[i]]){
				OFKsp.push(dKeys[i]);
			}
		}
		const cKeys = Object.keys(results.data.tables);
		const aKeys = Object.keys(results.dbJson.tables);
		var OFKtb = [];
		for(var i in cKeys){
			if(results.data.tables[cKeys[i]] != results.dbJson.tables[aKeys[i]]){
				OFKtb.push(cKeys[i]);
			}
		}
		//resolve inconsistancies
		var p = [];
		if(OFKsp.length != 0 || OFKtb.length != 0){
			for(var i in OFKsp){
				p.push(execSql(results.data.storedProcedures[OFKsp[i]],[]).catch((err) => {
					console.error(err);
					return;
				}));
			}
			for(var i in OFKtb){
				p.push(execSql('drop table ' + OFKtb[i],[]).catch((err) => {
					console.error(err);
					return;
				}));
				p.push(execSql(results.data.tables[OFKtb[i]],[]).catch((err) => {
					console.error(err);
					return;
				}));
			}
			Promise.all(p).then(() => {console.log("Validation Resolved");});
		}
		else{
			console.log("Validated");
		}
		
	});
}
//validateDB();



//temp



var htmlPath = path.join(__dirname, 'html');
console.log(htmlPath)

//my Routes
const { createLobby, joinLobby, leaveLobby} = require('./routes/lobby.js')(io);
const { auth, createAccount } = require('./routes/auth.js')(io);
//my games
const {fcpinit} = require('./routes/fiveCardPoker.js')(io);
//


const onConn = (socket) => {
	socket.on("lobby:create", createLobby);
	socket.on("lobby:join", joinLobby);
	socket.on("lobby:leave", leaveLobby);
	socket.on('disconnect', leaveLobby);
	socket.on("auth",auth);
	socket.on("auth:create",createAccount);
	//fcp
	socket.on("fcp:init",fcpinit);
	
}

io.on("connection",onConn);





app.use(serveStatic(htmlPath))
server.listen(81)
