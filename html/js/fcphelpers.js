



export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function toggleStart(){
	var strt = document.getElementById("strtbtn");
	if(strt.style.visibility == "hidden"){
		strt.style.visibility = "visible";
	}else{
		strt.style.visibility = "hidden";
	}
}

export function toggleControls(){
	var betAmt = document.getElementById("betamt");
	betAmt.disabled = !betAmt.disabled;
	document.getElementById("foldbtn").disabled = !document.getElementById("foldbtn").disabled;
	document.getElementById("callbtn").disabled = !document.getElementById("callbtn").disabled;
	document.getElementById("raisebtn").disabled = !document.getElementById("raisebtn").disabled;
}

export function addItemtoLog(item){
	var newEntry = document.createElement("label");
	newEntry.className = 'logEntry fadeOut';
	newEntry.appendChild(document.createTextNode(item));
	document.getElementById('logContainer').appendChild(newEntry);
}
