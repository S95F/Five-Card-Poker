import * as THREE from './three.js-master/three.js-master/build/three.module.js';
import { addGroupBasedOnHandles, findGroupBasedOnName } from './threeJSgeneralHelpers.js';
import {setAndGo} from './threejsHandler.js';
var env = {scene:null,cards:null,playerCount:6,playerSeat:null,chips:null,pot:0,anteAmt:20,actvPlyr:null,max:1000,socket:null}

//sorting
import {sortChips,handSort,shuffle,setfromcSet,deal,setChips} from './fcpsorting.js'
//fcphelpers
import {toggleStart,toggleControls,addItemtoLog} from './fcphelpers.js'
//outliners
import {setSelection,setoutlineGlobal} from './fcpoutline.js'


export function goToGameState(){
	const deck = env.socket.gameData.cards.deck;
	const discard = env.socket.gameData.cards.discard;
	const hands = env.socket.gameData.hands;
	for(var i=0; i<env.socket.env.players.length; i++){
		const uuid = env.socket.env.players[i].uuid;
		const getGrp = findGroupBasedOnName(env.scene,'chips'+i);
		var amt = 0;
		if(hands[uuid]){
			amt = hands[uuid].chips;
		}
		setChips(i,amt,env);
	}
	setfromcSet(env.scene,deck);
}
export function setupFCPsocketListeners(scene,socket){
	env.socket = socket;
	socket.gameData = {cards:{deck:[],discard:[]},hands:{}};
	socket.on("lobby:started",(newGameData) => {
			env.socket.gameData = newGameData;
			setAndGo();
			goToGameState();
			if(env.socket.env.players[env.socket.pPos].name.length > 16){
				document.getElementById("uuid").innerHTML = env.socket.env.players[env.socket.pPos].name.slice(0,16) + "...";
			}
			else{
				document.getElementById("uuid").innerHTML = env.socket.env.players[env.socket.pPos].name;
			}
			var position = new THREE.Vector3(r * Math.sin(45 * env.socket.pPos), 
										1.9, 
										r * Math.cos(45 * env.socket.pPos));
			const h = 1.205182433128357;
			const rp = 2 * 0.6 ;
			env.camera.position.x = position.x;
			env.camera.position.y = position.y;
			env.camera.position.z = position.z;
			env.camera.lookAt(new THREE.Vector3(0,1.5,0));
			env.camera.rotateX(-Math.PI/12);
	});
}
export function setup(scene,socket,renderer,camera,mouse,composer,raycaster){
	env.renderer = renderer;
	env.camera = camera;
	env.mouse = mouse;
	env.socket = socket;
	env.composer = composer;
	env.raycaster = raycaster;
	env.scene = scene;
	setoutlineGlobal(env);
	setSelection();
	env.playerCount = socket.env.players.length;
	document.getElementById("globbyuid").innerHTML = socket.connID;
	addGroupBasedOnHandles(scene,"cards",["Club","Diamond","Heart","Spade"]);
	addGroupBasedOnHandles(scene,"jokers",["Joker"]);
	addGroupBasedOnHandles(scene,"chips",["chip"]);
	addGroupBasedOnHandles(scene,"discard",[""]);
	const r = 2;
	const h = 1.205182433128357;
	const rp = 2 * 0.6 ;
	var cards = findGroupBasedOnName(scene,"cards");
	var jokers = findGroupBasedOnName(scene,"jokers");
	var chips = findGroupBasedOnName(scene,"chips");
	for(var i = 0; i < jokers.children.length;i++){
			jokers.children[i].position.x = 0;
			jokers.children[i].position.y = 0;
			jokers.children[i].position.z = 0;
	}
	for(var i = 0; i < cards.children.length;i++){
			cards.children[i].cid = cards.children[i].id-25;
	}
	for(var i=0;i<chips.children.length;i++){
		chips.children[i].position.x = 0;
		chips.children[i].position.y = 0;
		chips.children[i].position.z = 0;
	}
	addGroupBasedOnHandles(scene,"pot",[]);
	var p = findGroupBasedOnName(scene,"pot");
	p.position.set(0.1,h,0.1);
	env.chips = chips;
	env.cards = cards;
	chips.children = chips.children.sort((a,b) => sortChips(a,b,env.max));
	if(socket.env.leader == socket.env.uuid){
		var cSet = shuffle(env.scene);
		socket.gameData = {cards:{deck:cSet,discard:[]},hands:{},max:env.max};
		for(var i=0;i<env.playerCount;i++){
			setChips(i,socket.gameData.max,env);
		}
		socket.emit("fcp:init",socket.gameData,socket.connID);
	}
	else{
		goToGameState();
	}
	toggleControls();
}



