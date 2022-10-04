import {addUsertoUsers, deployUsers} from './userManagers.js'
import {dotheSlide} from './slide.js'
import {createAlert} from './alerts.js'
import {validateEmail} from './generalhelpers.js'
import {setAndGo, setSocket, loadFCP, updateGame} from './threejsHandler.js'

export function setupSocketUI(socket,env){

	setSocket(socket);
	
	socket.env = env;
	
	socket.on("connect",() =>{
		env.uuid = socket.id;
	});



	socket.on("user:join",(data) => {
		env.players = data.users;
		if(data.gameData){
			socket.gameData = data.gameData;
			updateGame();
		}
		
		deployUsers(data.users, env.leader);
	});


	socket.on("user:left",(inc) => {
		console.log(inc);
		env.leader = inc.leader;
		env.players = inc.users;
		deployUsers(env.players, env.leader);
		socket.gameData = inc.gameData;
		updateGame();
		
	});


	document.getElementById("cpclnamejoin").onclick = function(){
		var name = document.getElementById("name");
		if(name.value == ""){
			createAlert("warning-alert","Please enter a valid name!",10000);
		}
		else{
			env.players.push({name:name.value,uuid:socket.id});
			addUsertoUsers(name.value, socket.id, socket.id);
			socket.emit("lobby:create",name.value,"fcp", (res) => {
				env.connID = res;
				env.leader = socket.id;
				socket.connID = env.connID;
				socket.game = 'fcp';
				document.getElementById("lobbyuid").innerHTML = res;
				dotheSlide(0,1,loadFCP);
			});
		}
	}
	document.getElementById("cpjljoin").onclick = function(){
		var name = document.getElementById("namejl");
		var lobbyid = document.getElementById("lobbyID");
		if(lobbyid.value == ""){
			createAlert("warning-alert","This lobby code is not valid.",10000);
		}
		if(name.value == ""){
			createAlert("warning-alert","Enter a valid name!",10000);
		}
		else{
			
			socket.emit("lobby:join",lobbyid.value,{users:[{name:name.value, uuid: env.uuid}]}, (res,status) => {
				if(status){
					env.players = res.users;
					env.connID = lobbyid.value;
					socket.connID = env.connID;
					env.leader = res.leader;
					document.getElementById("lobbyuid").innerHTML = lobbyid.value;
					deployUsers(res.users, env.leader, socket.id);
					if(res.status == 'started'){
						loadFCP();
						socket.gameData = res.gameData;
						socket.game = 'fcp';
						setAndGo();
					}
					else{
						dotheSlide(0,1,loadFCP);
					}
				}else{
					createAlert("warning-alert","Invalid room code",10000);
				}
			});
			
		}
	}

	document.getElementById("loginbutton").onclick = function(){
		var user = document.getElementById("lusername").value;
		var pass = document.getElementById("lpass").value;
		var encode = btoa(user + ":" + pass);
		console.log(encode);
		socket = io({
			extraHeaders: {
					Authorization: "Basic " + encode
			}
		});
		socket.emit("auth", (fb) => {
			console.log(fb);
			
			});
	}

	document.getElementById("createUserbutton").onclick = function(){
		var usrname = document.getElementById("createusername").value;
		var email = document.getElementById("cemail").value;
		var fname = document.getElementById("fname").value;
		var lname = document.getElementById("lname").value;
		var pass = document.getElementById("pass").value;
		var cpass = document.getElementById("cpass").value;
		
		if(usrname == ""){
			createAlert("warning-alert","Please enter a valid username.",10000);
		}
		if(!validateEmail(email)){
			createAlert("warning-alert","Please enter a valid email.",10000);
		}
		if(fname == ""){
			createAlert("warning-alert","Please enter any character for first name.",10000);
		}
		if(lname == ""){
			createAlert("warning-alert","Please enter any character for last name.",10000);
		}
		if(pass != cpass){
			createAlert("warning-alert","The passwords do not match.",10000);
		}
		else{
			socket.emit("auth:create",usrname,email,fname,lname,pass,(cb) => {
				console.log(cb);
			});
		}
	}
	document.getElementById("startLobby").onclick = function(){
		if(env.leader == socket.id){
			setAndGo();
		}
	}


}
