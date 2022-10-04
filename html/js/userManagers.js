
export function addUsertoUsers(user,uuid,leader){
	var userContainer = document.getElementById("usercontainerMain");
	var newEntry = document.createElement("div");
	
	newEntry.id = uuid;
	if(uuid == leader){
		//newEntry.className = "leaderClass";
		newEntry.innerHTML += "⭐";
	}
	newEntry.innerHTML += user;
	userContainer.insertBefore(newEntry,null);
}

export function deployUsers(users, leader){
	var userContainer = document.getElementById("usercontainerMain");
	userContainer.innerHTML = ""
	users.forEach((n) => {
		addUsertoUsers(n.name,n.uuid, leader);
	});
}
