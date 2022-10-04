var lb = document.getElementById("logButton");
		
function goingUp(){
	document.getElementById("log").className = 'goingUp';
	lb.onclick = goingDown;
	var logEntrys = document.getElementById('logContainer').children;
	for(var i = 0; i < logEntrys.length; i++){
		logEntrys[i].className = 'logEntry fadeOut';
	}
}
function goingDown() {
	var logEntrys = document.getElementById('logContainer').children;
	for(var i = 0; i < logEntrys.length; i++){
		logEntrys[i].className = 'logEntry';
	}
	document.getElementById("log").className = 'dropDown';
	lb.onclick = goingUp;
}


lb.onclick = goingDown;
