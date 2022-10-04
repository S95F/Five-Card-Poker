


function addDestroy(ele,timeout){
	ele.onclick = function(){
		this.parentElement.remove();
	}
	setTimeout(()=>{ele.parentElement.remove()},timeout);
}


export function createAlert(alertLevel,msg,timeout){
	var alertBox = document.getElementById("alertBox");
	var container = document.createElement("div");
	container.className = "fadeOut alert " + alertLevel;
	var h3 = document.createElement("h3");
	h3.innerHTML = msg;
	h3.className = "circularFont"
	container.insertBefore(h3,null);
	var a = document.createElement("a");
	a.className = "close";
	a.innerHTML = "&times;";
	container.insertBefore(a,null);
	
	alertBox.insertBefore(container,null);
	addDestroy(a,timeout);
	
}


/*

createAlert("warning-alert","Why doesn't this work!");
createAlert("success-alert","Why doesn't this work!");
createAlert("danger-alert","Why doesn't this work!");
createAlert("simple-alert","Why doesn't this work!");*/
