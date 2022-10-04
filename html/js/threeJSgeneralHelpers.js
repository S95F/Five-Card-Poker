
import * as THREE from './three.js-master/three.js-master/build/three.module.js';

export function addGroupBasedOnHandles(scene,grpName,Handles){
	const newGrp = new THREE.Group();
	newGrp.name = grpName;
	const innerScene = scene.children[2].children;
	var temp = [];
	for(var i =0; i < innerScene.length; i++){
		for(var j=0;j<Handles.length;j++){
			if(innerScene[i].name.includes(Handles[j])){
				temp.push(innerScene[i]);
			}
		}
	}
	for(var i=0; i<temp.length;i++){
		newGrp.add(temp[i]);
	}
	scene.add(newGrp);
	return newGrp;
}


export function findGroupBasedOnName(scene,name){
	for(var i=0;i<scene.children.length;i++){
		if(scene.children[i].name == name){
			return scene.children[i];
		}
	}
	return false;
}


export function isMemberofGroup(group,member){
	for(var i=0; i<group.children.length; i++){
		if(group.children[i].uuid == member.uuid){
				return true;
		}
	}
	return false;
}
