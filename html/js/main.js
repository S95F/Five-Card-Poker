import * as THREE from './three.js-master/three.js-master/build/three.module.js';

import { GLTFLoader } from './three.js-master/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './three.js-master/three.js-master/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from './three.js-master/three.js-master/examples/jsm/utils/RoughnessMipmapper.js';
import { RenderPass } from './three.js-master/three.js-master/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three.js-master/three.js-master/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from './three.js-master/three.js-master/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './three.js-master/three.js-master/examples/jsm/shaders/FXAAShader.js';
import { EffectComposer } from './three.js-master/three.js-master/examples/jsm/postprocessing/EffectComposer.js';
//outline stuff


let composer, effectFXAA, outlinePass;

let selectedObjects = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

//import hdri from "./hdri/studio_small_07_4k.hdr";
//define the scene/renderer/camera
const scene = new THREE.Scene();



// instantiate a loader
const loader = new GLTFLoader();
//loader.setPath( './obj/'+objName+'/' )
//loader.load(objName+'.gltf',function(gltf){scene.add(gltf.scene);},function(xhr){console.log((xhr.loaded/xhr.total*100)+'%loaded');},
//function(error){console.log('An error occurred in resource load // DTC error follows::'+error);});

var card
loader.setPath( './obj/' )

//var envmap = new RGBELoader().load( "./hdri/studio_small_07_4k.hdr" );
//scene.environment = envmap;

var env = {playerCount:6,playerSeat:null,hands:{},cards:[],discard:[],jokers:[],queue:["Ante"],active:"221222",chips:{1:1000,2:1000,3:1000,4:1000,5:1000,6:1000},pot:0,anteAmt:20,actvPlyr:null}
for(var i = 0; i<env.playerCount; i++){
	env.hands[i] = [];
}

function deal(n){
	var dealt = env.cards.pop();
	var degree = 45 * n;
	var position = new THREE.Vector3(0.6 * Math.sin(degree), 
									0.35, 
									0.6 * Math.cos(degree));
	dealt.position.x = position.x;
	dealt.position.y = position.y;
	dealt.position.z = position.z;
	
	dealt.rotateY(Math.PI);

	
	var pCamera = new THREE.Vector3(0.7 * Math.sin(45 * n), 
									0.5, 
									0.7 * Math.cos(45 * n));

	dealt.lookAt(pCamera);
	degree-=env.hands[n].length/32;
	position = new THREE.Vector3(0.6 * Math.sin(degree), 
									0.35, 
									0.6 * Math.cos(degree));
	dealt.position.x = position.x;
	dealt.position.y = position.y;
	dealt.position.z = position.z;
									
	env.hands[n].push(dealt);
}

function shuffle(obj){
	env.cards.push(env.discard);
	env.discard = [];
	env.cards = env.cards.sort(() => (Math.random() > .5) ? 1 : -1);
	for(var i = 0; i < env.cards.length;i++){
		env.cards[i].position.x = 0;
		env.cards[i].position.y = i/1200 + .32;
		env.cards[i].position.z = 0;
		env.cards[i].lookAt(new THREE.Vector3(0,-1,0));
	}
}

function printChildren(obj){
	for(var i = 0; i < obj.children.length;i++){
		
		if(obj.children[i].name.includes("Joker")){
			env.jokers.push(obj.children[i]);
			obj.children[i].position.x = 0;
			obj.children[i].position.y = 1/1200 + 0.22;
			obj.children[i].position.z = -2/12;
		}else{
			env.cards.push(obj.children[i]);
		}
	}
	env.cards = env.cards.sort(() => (Math.random() > .5) ? 1 : -1);
	for(var i = 0; i < env.cards.length;i++){
		env.cards[i].position.x = 0;
		env.cards[i].position.y = i/1200 + .32;
		env.cards[i].position.z = 0;
		env.cards[i].rotateX(3.14);
		
	}
	for(var j = 0; j < 5; j++){
		for(var i = 0; i < env.playerCount; i++){
			deal(i);
		}
	}
	for(var i = 0; i < env.playerCount; i++){
		env.hands[i].sort((a, b) => (a.name > b.name) ? -1 : 1);
		for(var c = 0; c < env.hands[i].length; c++){
			var degree = 45*i
			degree-=c/32;
			var position = new THREE.Vector3(0.6 * Math.sin(degree), 
											0.35, 
											0.6 * Math.cos(degree));
			env.hands[i][c].position.x = position.x;
			env.hands[i][c].position.y = position.y;
			env.hands[i][c].position.z = position.z;
		}
		
	}
	//console.log(env);
}

var objName = "AllCards.glb"
loader.load(objName,function(gltf){card=gltf.scene;scene.add(gltf.scene);printChildren(card)},function(xhr){return xhr},
function(error){console.log('An error occurred in resource load // DTC error follows::'+error);});

//table 
objName = "table.glb"
function tableOnload(){
	env.table.scale.set(0.25,0.25,0.25);
	env.table.position.y = -1/6;
}
loader.load(objName,function(gltf){env["table"] = gltf.scene;scene.add(gltf.scene);tableOnload();},function(xhr){return xhr},
function(error){console.log('An error occurred in resource load // DTC error follows::'+error);});

//pokerChips
objName = "pokerChips.glb"
function pokerChipsOnload(){
	env.pokerChips.scale.set(1/64,1/64,1/64);
	env.pokerChips.position.z = 2/6;
	env.pokerChips.position.x = 1/6;
	env.pokerChips.position.y = 9/32;
}
//loader.load(objName,function(gltf){env["pokerChips"] = gltf.scene;scene.add(gltf.scene);pokerChipsOnload();},function(xhr){return xhr},
//function(error){console.log('An error occurred in resource load // DTC error follows::'+error);});

//camera

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
env.playerSeat = 2
var position = new THREE.Vector3(0.7 * Math.sin(45 * env.playerSeat), 
									0.5, 
									0.7 * Math.cos(45 * env.playerSeat));

camera.position.x = position.x;
camera.position.y = position.y;
camera.position.z = position.z;
camera.lookAt(new THREE.Vector3(0,0.5,0));
camera.rotateX(-Math.PI/6);




const renderer = new THREE.WebGLRenderer({canvas:document.getElementById("myCanvas")});
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//composer
composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
composer.addPass( outlinePass );
outlinePass.visibleEdgeColor.set('#f6ff00');
outlinePass.hiddenEdgeColor.set('#000dff');
outlinePass.edgeStrength = 5;


effectFXAA = new ShaderPass( FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( effectFXAA );

renderer.domElement.addEventListener( 'pointermove', onPointerMove );
renderer.domElement.addEventListener( 'ontouchstart', onPointerMove );

//

function onPointerMove( event ) {

	if ( event.isPrimary === false ) return;

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	checkIntersection();

}

function addSelectedObject( object ) {

	selectedObjects = [];
	selectedObjects.push( object );

}

function checkIntersection() {

	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObject( scene, true );

	if ( intersects.length > 0 ) {

		const selectedObject = intersects[ 0 ].object;
		for(var i = 0; i < Object.keys(env.hands[env.playerSeat]).length; i++){
			if(selectedObject == env.hands[env.playerSeat][i]){
				addSelectedObject( selectedObject );
				outlinePass.selectedObjects = selectedObjects;
				break;
			}
		}
		

	}
}

function onWindowResize(){
	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );
	composer.setSize( width, height );

	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    camera.updateProjectionMatrix();
}

window.addEventListener( 'resize', onWindowResize, false );

// lights



const light = new THREE.HemisphereLight( 0xeeeeff, 3, 3 );
light.position.set( 0, 5, 0 );
scene.add( light );

// the game

function setChips(){
	document.getElementById("chipVal").innerHTML = env.chips[env.playerSeat];
	document.getElementById("betamt").max = env.chips[env.playerSeat];
}

function addItemtoLog(item){
	var newEntry = document.createElement("label");
	newEntry.className = 'logEntry fadeOut';
	newEntry.appendChild(document.createTextNode(item));
	document.getElementById('logContainer').appendChild(newEntry);
}


function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function toggleControls(){
	var betAmt = document.getElementById("betamt");
	betAmt.disabled = !betAmt.disabled;

	document.getElementById("foldbtn").disabled = !document.getElementById("foldbtn").disabled;
	document.getElementById("callbtn").disabled = !document.getElementById("callbtn").disabled;
	document.getElementById("raisebtn").disabled = !document.getElementById("raisebtn").disabled;
}


function ante(){
	for(var i = 0; i<6; i++){
		if(env.active[i] != '0'){
			if(env.chips[i] < env.anteAmt){
				env.active.replaceAt(i,'0');
				addItemtoLog("Player in seat #" + (i+1) + " is not able to ante.");
			}
			else{
				env.chips[i] -= env.anteAmt;
				env.pot += env.anteAmt;
				addItemtoLog("Player in seat #" + (i+1) + " has anted " + env.anteAmt + ".");
			}
		}
	}
	addItemtoLog("The pot is " + env.pot);
	setChips();
	
		//assign a starting better
	var assigned = 0;
	while(assigned != -1){
		var r = randomIntFromInterval(0,5);
		if(env.active[r] != '0'){
			assigned = -1;
			env.actvPlyr = r;
		}
		else{
			assigned += 1;
		}
		
		if(assigned > 10){
			for(var i = 0; i < 6; i++){
				if(env.active[i] != '0'){
					assigned = -1;
					env.actvPlyr = i;
				}
			}
		}
	}
	addItemtoLog("The active player is " + env.actvPlyr);
	if(env.actvPlyr != env.playerSeat && document.getElementById("betamt").disabled == false){
		toggleControls();
	}
	if(env.playerSeat == env.actvPlyr){
		addItemtoLog("Please place a bet " + env.actvPlyr);
	}else{
		//wait for other player
		if(env.active[env.actvPlyr] == 2){
			botBet();
		}
		
	}
}


function botBet(){
	evalHand(env.actvPlyr);
}

function evalHand(n){
	console.log(Object.keys(env.hands[n]));
}

function play(){
	if(env.queue.length != 0){
		var action = env.queue.shift();
		if(action == "Ante"){
			ante();
		}
	}
}



//animate => go



setChips();
play();

function animate() {
	requestAnimationFrame( animate );
	composer.render();
}
animate();
