import {dotheSlide, onResize} from './slide.js'


export function toggleEle(ele) {
    var div = document.getElementById(ele);
    if (div.style.display !== 'none') {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'flex';
    }
};


export function scrollTo(x,y,expBehavior = 'smooth') {
	var offset = y * window.innerHeight;
	var offsetx = x * window.innerWidth;
    const fixedOffset = offset.toFixed();
    const fixedOffsetx = offsetx.toFixed();
    const onScroll = function () {
            if (window.pageYOffset.toFixed() === fixedOffset && window.pageXOffset.toFixed() === fixedOffsetx) {
                window.removeEventListener('scroll', onScroll)
				
            }
        }

    window.addEventListener('scroll', onScroll);
    onScroll();
    window.scroll({
			top:y * window.innerHeight,
			left:x * window.innerWidth,
			behavior:expBehavior
	});
}


export function preventScroll(e) { 
    e.preventDefault();
    e.stopPropagation();
}



export function onkeydown(e){
	var blockedCodes = [33,34,35,36];
	if((blockedCodes.indexOf(e.keyCode) > 0) || (e.keyCode == 32 && e.target == document.body)){
		e.preventDefault();
		e.stopPropagation();
	}
}

document.addEventListener('mousedown', logMouseButton, {'passive':false});

function logMouseButton(e) {
  if (typeof e === 'object') {
    switch (e.button) {
      case 1:
        e.preventDefault();
        e.stopPropagation();
        break;
    }
  }
}


export function initBasic(){
	var disNone = ['cpUI','cpjoinLobby'];
	disNone.forEach((ele) => {
		document.getElementById(ele).style.display = 'none';
	});
	
	document.getElementById('cp').onclick = function(){
		toggleEle('cpUI');
		var tog = ['cpclname','cpjoinLobby']
		tog.forEach((ele) => {
			if(document.getElementById(ele).style.display !== 'none'){
				toggleEle(ele);
			}
		});

	}
	document.getElementById('cpjl').onclick = function(){
		toggleEle('cpjoinLobby');
		var tog = 'cpclname'
		if(document.getElementById(tog).style.display !== 'none'){
			toggleEle(tog);
		}
	}


	toggleEle("cpclname");
	document.getElementById("cpcl").onclick = function(){	
		toggleEle("cpclname");
		var tog = 'cpjoinLobby'
		if(document.getElementById(tog).style.display !== 'none'){
			toggleEle(tog);
		}
	}
	document.addEventListener('wheel',preventScroll,{'passive':false});
	window.onwheel = function(){ return false; }
	
	document.getElementById("signinbutton").onclick = function(){
		dotheSlide(1,0);
	}
	document.getElementById("lcreateAccountbutton").onclick = function(){
		toggleEle("login");
		toggleEle("createUser");
	}
	document.getElementById("gotologinbutton").onclick = function(){
		toggleEle("login");
		toggleEle("createUser");
	}

	
	var logins = document.getElementsByClassName("login");

	for(var j=0; j<logins.length; j++){
		if(logins[j].id != "login"){
			toggleEle(logins[j].id);
		}
		
	}

	
	
	


	dotheSlide(0,0);
	window.onresize = onResize;
	window.onkeydown = onkeydown;

}
