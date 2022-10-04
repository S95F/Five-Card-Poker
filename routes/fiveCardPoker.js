
var express = require('express');

let mysql = require('mysql');

//config
let config = require('./sqlConfig.js');
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



module.exports = (io) => {
	const fcpinit = function(incgameData,connID){
		const socket = this;
		var sql = 'call mygame.updateLobby(?,?);';
		var json = {status:"started",gameData:incgameData};
		var hands = Object.keys(incgameData['hands']);
		for(let i=0;i<hands.length;i++){
			incgameData['hands'][hands[i]]['seat'] = i;
		}
		incgameData['pMax'] = 6;
		execSql(sql,[connID,JSON.stringify(json)]).then(function(result){
			socket.to(String(connID)).emit("lobby:started",incgameData);
		}).catch((err) => console.log(err));
	}
	
	
	return {
		fcpinit
	}
}
