
import * as THREE from './three.js-master/three.js-master/build/three.module.js';

import { GLTFLoader } from './three.js-master/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './three.js-master/three.js-master/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from './three.js-master/three.js-master/examples/jsm/utils/RoughnessMipmapper.js';
import { RenderPass } from './three.js-master/three.js-master/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './three.js-master/three.js-master/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from './three.js-master/three.js-master/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './three.js-master/three.js-master/examples/jsm/shaders/FXAAShader.js';
import { EffectComposer } from './three.js-master/three.js-master/examples/jsm/postprocessing/EffectComposer.js';

//mine
import { randomIntFromInterval } from './generalhelpers.js'
import * as pokerUIhelpers from './pokerUIhelpers.js'
import {dotheSlide} from './slide.js'
//outline stuff


let composer, effectFXAA, outlinePass;

let selectedObjects = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
THREE.Cache.enabled = true; // for GLTF loader multi instancing 

//define the scene/renderer/camera
const scene = new THREE.Scene();

var env = {setup:null,pSeat:0,fcploaded:false,socket:null};

// instantiate a loader

const loader = new GLTFLoader();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.add(camera);

const renderer = new THREE.WebGLRenderer({canvas:document.getElementById("myCanvas")});
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );


//composer
composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );




effectFXAA = new ShaderPass( FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( effectFXAA );



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



const light = new THREE.HemisphereLight( 0x9293a8,0x9293a8, 7 );
light.position.set( 0, 6.5, 0 );
light.rotation.x -= Math.PI/2;
scene.add( light);




export function go(){


	requestAnimationFrame(go);
	composer.render();

}


export function loadFCP(){
	function checkGo(){
		if(env.fcploaded == "go"){
			env.fcploaded = true;
			pokerUIhelpers.setup(scene,env.socket,renderer,camera,mouse,composer,raycaster);
		}
	}
	
	if(env.fcploaded == false){
		env.fcploaded=true;
		var objName = 'playingCards_init';
		loader.setPath( './obj/' );
		loader.load(objName+'.glb',function(gltf){env.setup=gltf.scene;scene.add(gltf.scene);checkGo();},function(xhr){/*console.log((xhr.loaded/xhr.total*100)+'%loaded');*/return xhr},
		function(error){console.log('An error occurred in resource load // DTC error follows::'+error);});
		pokerUIhelpers.setupFCPsocketListeners(scene,env.socket);
	}
	
}

export function setSocket(socket){
	env.socket = socket;
}

export function updateGame(){
	if(env.socket.game = "fcp"){
		pokerUIhelpers.goToGameState();
	}
}


export function setAndGo(){
	if(scene.children[2] == undefined){
		env.fcploaded = "go";
	}else{
		pokerUIhelpers.setup(scene,env.socket,renderer,camera,mouse,composer,raycaster);	
	}
	dotheSlide(0,2);
	env.socket.pPos = env.socket.gameData.hands[env.socket.id].seat;
	env.pSeat = env.socket.pPos;
	go();

}



