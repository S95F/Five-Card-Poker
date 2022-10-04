import * as THREE from './three.js-master/three.js-master/build/three.module.js';
import { OutlinePass } from './three.js-master/three.js-master/examples/jsm/postprocessing/OutlinePass.js';

var env;


export function onPointerMove( event ) {
	if ( event.isPrimary === false ) return;
	env.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	env.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	env.toolTip.style.left = (env.mouse.x*50+50).toString() + "vw";
	env.toolTip.style.top = (env.mouse.y*-50+48).toString() + "vh";
	checkIntersection();
}
export function onClick( event ) {
	checkIntersection(true);
}
export function addSelectedObject( object ) {
	env.selectedObjects = [];
	env.selectedObjects.push( object );
	env.outlinePass.selectedObjects = env.selectedObjects;
}
export function addtoSelected(object){
	env.selected.push(object);
	env.SoutlinePass.selectedObjects = env.selected;
}
export function checkIntersection(click = false) {

	env.raycaster.setFromCamera( env.mouse, env.camera );
	
	const intersects = env.raycaster.intersectObject( env.scene, true );
	const handlers = ["Heart","Spade","Diamond","Club","chip"];
	if ( intersects.length > 0 ) {
		const selectedObject = intersects[ 0 ].object;
		const match = handlers.find(e => {
			if(selectedObject.name.includes(e)){
				return true;
			}
		});
		if(match){
			env.toolTip.innerHTML = selectedObject.parent.name;
			if(selectedObject.name.includes("chip")){
				env.toolTip.innerHTML = selectedObject.val;
				if(click == false){
					addSelectedObject( selectedObject );
				}
				
			}
			else if(selectedObject.parent != null && selectedObject.parent.name == "hand"+env.socket.pPos){
				env.toolTip.innerHTML = selectedObject.name;
				if(click == false){
					addSelectedObject( selectedObject );
				}else{
					if(env.selected.includes(selectedObject)){
						env.selected.splice(env.selected.indexOf(selectedObject),1);
						env.SoutlinePass.selectedObjects = env.selected;
					}else{
						addtoSelected(selectedObject);
					} 
				}
			}
			else{
				env.toolTip.innerHTML = "";
				env.outlinePass.selectedObjects = [];
			}
		}
		else{
			env.toolTip.innerHTML = "";
			env.outlinePass.selectedObjects = [];
		}
		
	}
}
export function setSelection(){
	env.selectedObjects = [];
	env.outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), env.scene, env.camera );
	env.composer.addPass( env.outlinePass );
	env.outlinePass.visibleEdgeColor.set('#f6ff00');
	env.outlinePass.hiddenEdgeColor.set('#00ddff');
	env.outlinePass.edgeStrength = 5;
	env.toolTip = document.getElementById("tooltip");
	
	env.selected = [];
	env.SoutlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), env.scene, env.camera );
	env.composer.addPass( env.SoutlinePass );
	env.SoutlinePass.visibleEdgeColor.set('#0000ff');
	env.SoutlinePass.hiddenEdgeColor.set('#ddddff');
	env.SoutlinePass.edgeStrength = 5;

	
	env.renderer.domElement.onpointermove = onPointerMove;
	env.renderer.domElement.onclick = onClick;
	
	document.getElementById("discbtn").onclick=discard;
}
export function setoutlineGlobal(incEnv){
	env = incEnv;
}
function discard(){
	var discardpile = findGroupBasedOnName(env.scene,"discard");
	var discardGameData = env.socket.gameData.cards.discard;
	var hand = env.socket.gameData.hands[env.socket.id].cards;
	for(var i=0;i<env.selected.length;i++){
		hand.splice(hand.indexOf(env.selected[i].cid),1);
		discardGameData.push(env.selected[i].cid);
		env.selected[i].position.set(0.1,1.200182433128357+discardpile.children.length*(0.000001),0);
		env.selected[i].lookAt(-0.5,0,100);
		discardpile.add(env.selected[i]);
	}	
	env.selected = [];
	env.SoutlinePass.selectedObjects = env.selected;
	// refill hand 
	var m = 5 - hand.length;
	if(m < 0 || m >5){m=0;}
	for(var i=0;i<m;i++){
		deal(env.socket.pPos);
	}
	handSort(env.scene,env.socket.pPos);
	// toggle discard
	var discbtn = document.getElementById("discbtn");
	discbtn.style.visibility = "hidden";
	// submit move to server
}
