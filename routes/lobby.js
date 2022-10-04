

var express = require('express');
let mysql = require('mysql');

//config
let config = require('./sqlConfig.js');


var con = mysql.createConnection(config);




module.exports = (io) => {
	const createLobby = function(mname,incgame,callback){
		const socket = this;
		var mjson = {users:[{name:mname,uuid:socket.id}],leader:socket.id,game:incgame,status:"lobby"}
		var sql = 'call createLobby(?);';
		con.query(sql,[JSON.stringify(mjson)], function (err, result) {
			if (err){
				console.log(err);
			}
			else{
				callback(result[0][0].connID);
				socket.join(String(result[0][0].connID));
			}
		});
	}
	const joinLobby = function(connID,incJson,cbf){
		const socket = this;
		var sql = 'call joinLobby(?,?);';
		con.query(sql,[connID,JSON.stringify(incJson)], function (err, result) {
			if (err){
				console.log(err);
				cbf({},undefined);
			}
			else{
				if(result[0][0] != undefined){
					socket.join(String(connID));
					var pj = JSON.parse(result[0][0]['json']);
					if(pj.gameData && pj.game == "fcp"){
						var seats = Array.from(Array(pj.gameData.pMax).keys());
						Object.keys(pj.gameData.hands).forEach(item => seats.splice(seats.indexOf(pj.gameData.hands[item].seat),1));
						pj.gameData.hands[String(socket.id)] = {"chips":pj.gameData.max,"seat":seats[0]};
					}
					socket.to(String(connID)).emit("user:join",pj);
					cbf(pj,true);
				}else{
					cbf({},false);
				}
			}
		});
	}
	const leaveLobby = function(){
		const socket = this;
		
		var sql = 'call disconnectUUID(?);';
		con.query(sql, [socket.id], function (err, result) {
			if (err){
				console.log(err);
			}
			else{
				if(result[0][0] != undefined){
					var pj = JSON.parse(result[0][0]['json']);
					var cid = JSON.parse(result[0][0]['connID']);
					if(pj.leader != null){
						const leaderSocket = io.sockets.sockets.get(pj.leader);
						leaderSocket.to(String(cid)).emit("user:left",pj);
						leaderSocket.emit("user:left",pj);
					}
				}
			}
		});
	}
	return {
		createLobby,
		joinLobby,
		leaveLobby
	}
	
}
