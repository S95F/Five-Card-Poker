

var express = require('express');
let mysql = require('mysql');

//config
let c = require('./sqlConfig.js');
var temp = JSON.parse(JSON.stringify(c));
temp.database = 'user';
let config = temp;

var con = mysql.createConnection(config);

module.exports = (io) => {
	const auth = function(callback){
		const socket = this;
		const header = socket.handshake.headers['authorization'].split(" ")[1];
		let bufferObj = Buffer.from(header, "base64");
		let decodedString = bufferObj.toString("utf8");
		decodedString = decodedString.split(":");
		var sql = 'call verifyAccount(?,?);';
		con.query(sql,[decodedString[0],decodedString[1]], function (err, result) {
			if (err){
				console.log(err);
			}
			else{
				callback(result[0][0]);
			}
		});
	}
	const createAccount = function(usrname,email,fname,lname,pass,callback){
		const socket = this;
		var sql = 'call createAccount(?,?,?,?);';
		var json = {'name':fname,'lastname':lname};
		con.query(sql,[usrname,email,pass,JSON.stringify(json)], function (err, result) {
			if (err){
				console.log(err);
				callback(false);
			}
			else{
				callback(true);
			}
		});
	}
	const forgotpass = function(json,callback){
		const socket = this;
		callback(true);
		//var sql = 'call createLobby(?);';
		//con.query(sql,[JSON.stringify(mjson)], function (err, result) {
			//if (err){
				//console.log(err);
			//}
			//else{
				//callback(result[0][0].connID);
				//socket.join(String(result[0][0].connID));
			//}
		//});
	}
	
	return {
		auth,createAccount
	}
	
}
