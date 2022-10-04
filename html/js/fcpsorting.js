import * as THREE from './three.js-master/three.js-master/build/three.module.js';
import { addGroupBasedOnHandles, findGroupBasedOnName } from './threeJSgeneralHelpers.js';

//helpers
import {getRandomInt,addItemtoLog} from './fcphelpers.js';

export function sortingHat(a,b){
	const suits = ["Heart","Spade","Diamond","Club"];
	var valA = 0;
	var valB = 0;
	for(var i=0;i<suits.length;i++){
		if(a.name.includes(suits[i])){
			valA += i*100;
		}
		if(b.name.includes(suits[i])){
			valB += i*100;
		}
	}
	const cVal = ["02","03","04","05","06","07","08","09","10","Jack","Queen","King","01"];
	for(var i=0;i<cVal.length;i++){
		if(a.name.includes(cVal[i])){
			valA += i;
		}
		if(b.name.includes(cVal[i])){
			valB += i;
		}
	}
	return (valA > valB) ? -1 : 1;
}


export function sortChips(a,b,max){
	var cbyval = ["black","gold","blue","red","green","pink"];
	const chipVals = [max/10,max/40,max/100,max/200,max/1000,max/2000];
	var valA = 0;
	var valB = 0;
	for(var i=0;i<cbyval.length;i++){
		if(a.name.includes(cbyval[i])){
			valA += i;
			a.val = chipVals[i];
		}
		if(b.name.includes(cbyval[i])){
			valB += i;
			b.val = chipVals[i];
		}
		if((valA*valB) > 0){
			break;
		}
	}
	return (valA > valB) ? 1 : -1;
}	

export function sortEm(a,b,cSet){
	var valA = 0;
	var valB = 0;
	for(var i=0;i<cSet.length;i++){
		if(cSet[i] == a.cid){
			valA = i;
		}
		if(cSet[i] == b.cid){
			valB = i;
		}
		if(valA*valB > 0){
			break;
		}
	}
	return (valA > valB) ? 1 : -1;
}

export function stackChips(env,player,remainder,pChips){
	var stack = 0;
	for(var i=0;i<env.chips.children.length;i++){
		const amt = Math.floor(remainder/env.chips.children[i].val);
		remainder = remainder % env.chips.children[i].val;
		for(var j=0;j<amt;j++){
			var clone = env.chips.children[i].clone();
			clone.val = env.chips.children[i].val;
			clone.position.y += j*0.01;
			clone.position.x += stack*0.07;
			clone.rotation.y += Math.floor(Math.random() * 11)
			pChips.add(clone);
		}
		if(amt > 0){
			stack+=1;
		}
	}
}

export function handSort(scene,h){
	var hand =  findGroupBasedOnName(scene,"hand"+h);
	hand.children = hand.children.sort((a,b) => sortingHat(a,b));
	let hp = h;
	for(var c = 0; c < hand.children.length; c++){
		var degree = 45 * hp;
		const r = 2;
		const h = 1.7;
		const rp = r * 0.93 ;
		var position = new THREE.Vector3(rp * Math.sin(degree), 
									h, 
									rp * Math.cos(degree));
		hand.children[c].position.x = position.x;
		hand.children[c].position.y = position.y;
		hand.children[c].position.z = position.z;
		var pCamera = new THREE.Vector3(r * Math.sin(degree), 
									1.9, 
									r * Math.cos(degree));
		hand.children[c].lookAt(pCamera);
		hand.children[c].rotateX(Math.PI/2);
		degree-= c/29 - 0.08;
		position = new THREE.Vector3(rp * Math.sin(degree), 
									h, 
									rp * Math.cos(degree));
	
		hand.children[c].position.x = position.x;
		hand.children[c].position.y = position.y;
		hand.children[c].position.z = position.z;
	}	
}

export function shuffle(scene){
	var cards =  findGroupBasedOnName(scene,"cards");
	var cSet = [];
	cards.children = cards.children.sort(() => (Math.random() > .5) ? 1 : -1);
	for(var i = 0; i < cards.children.length;i++){
		const e =i/1200 + 1.205182433128357;
		cards.children[i].position.x = 0;
		cards.children[i].position.y = e;
		cards.children[i].position.z = 0;
		var tar = new THREE.Vector3(0,e,-e);
		cards.children[i].lookAt(tar);
		cards.children[i].rotateZ(Math.PI);
		cSet.push(cards.children[i].cid);
	}
	return cSet
}

export function setfromcSet(scene,cSet){
	var cards = findGroupBasedOnName(scene,"cards");

	cards.children = cards.children.sort((a,b) => sortEm(a,b,cSet));
	for(var i = 0; i < cards.children.length;i++){
		const e =i/1200 + 1.205182433128357;
		cards.children[i].position.x = 0;
		cards.children[i].position.y = e;
		cards.children[i].position.z = 0;
		var tar = new THREE.Vector3(0,e,-e);
		cards.children[i].lookAt(tar);
		cards.children[i].rotateZ(Math.PI);
	}
}


export function deal(n,env){
	var dealt = findGroupBasedOnName(env.scene,"cards").children.pop();
	var hand = findGroupBasedOnName(env.scene,"hand"+n);
	if(hand == false){
		hand = new THREE.Group();
		hand.name = "hand"+n;
		env.scene.add(hand);
	}
	var degree = 45 * n;
	const r = 2;
	const h = 1.7;
	const rp = r * 0.93 ;
	var position = new THREE.Vector3(rp * Math.sin(degree), 
									h, 
									rp * Math.cos(degree));
	dealt.position.x = position.x;
	dealt.position.y = position.y;
	dealt.position.z = position.z;
	var pCamera = new THREE.Vector3(r * Math.sin(degree), 
									1.9, 
									r * Math.cos(degree));
	dealt.lookAt(pCamera);
	dealt.rotateX(Math.PI/2);
	degree -= parseFloat(hand.children.length)/32;
	degree+=0.07;
	position = new THREE.Vector3(rp * Math.sin(degree), 
									h, 
									rp * Math.cos(degree));
	dealt.position.x = position.x;
	dealt.position.y = position.y;
	dealt.position.z = position.z;
	dealt.rotateZ(-Math.PI/64);
	dealt.matrixWorldNeedsUpdate = true;
	if(env.socket.gameData.hands[env.socket.env.players[n].uuid].cards == undefined){
		env.socket.gameData.hands[env.socket.env.players[n].uuid].cards = [];
	}
	env.socket.gameData.hands[env.socket.env.players[n].uuid].cards.push(env.socket.gameData.cards.deck.pop());
	hand.add(dealt);
	handSort(env.scene,n);

}


function addChip(player,env){
		
	const h = 1.205182433128357;
	const rp = 2 * 0.6 ;
	const greetings = ['[player] has joined the game!','Welcome player [player]!','Introducing [player] to the table!','Here comes [player] to take your money!',"Don't lose all your money [player]!"];
	const rgreeting = greetings[getRandomInt(greetings.length)].replace('[player]',env.socket.env.players[player].name);
	addItemtoLog(rgreeting);
	var c = addGroupBasedOnHandles(env.scene,"chips"+player,[]);
	var degree = 45 * player;
	c.position.set(rp * Math.sin(degree),h,rp * Math.cos(degree));
	c.rotateY(degree);
}
export function setChips(player,amount,env){
	var remainder = amount;
	var pChips = null;
	if(player == "pot"){
		env.pot = amount;
		pChips = findGroupBasedOnName(env.scene,"pot");
	}
	else{
		if(!findGroupBasedOnName(env.scene,"chips"+player)){
			addChip(player,env);
		}
		pChips = findGroupBasedOnName(env.scene,"chips"+player);
	}
	if(player == env.socket.pPos){
		document.getElementById("chipVal").innerHTML = amount;
	}
	if(env.socket.gameData.hands[String(env.socket.env.players[player].uuid)] == undefined){
		env.socket.gameData.hands[String(env.socket.env.players[player].uuid)] = {};
	}
	env.socket.gameData.hands[String(env.socket.env.players[player].uuid)].chips = amount;
	if(pChips.children.length > 0){
		for(var i=pChips.children.length -1; i>=0;i--){
			var delObj = pChips.children[i];
			pChips.remove(delObj);
		}
	}
	stackChips(env,player,remainder,pChips);
}


