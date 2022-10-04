// insert after renderer and camera

//window.addEventListener( 'resize', onWindowResize, false );

export function onWindowResize(camera,renderer){
	
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
