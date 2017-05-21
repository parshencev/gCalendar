var CLIENT_ID = "784730492192-sr80jkcgb0s70eo38huh1pk5h46krf44.apps.googleusercontent.com",
		DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
		SCOPES = "https://www.googleapis.com/auth/calendar.readonly",
		main = document.getElementById("main");
		authorization = document.getElementById("authorization");
		inButton = document.getElementById("in");
		outButton = document.getElementById("out");
		eventsDOM = document.getElementById("events");

function initGAPI{
	gapi.load('client:auth2', initClient);
}

function initClient{
	gapi.client.init({
		discoveryDocs: DISCOVERY_DOCS,
		clientId : CLIENT_ID,
		scopes: SCOPES
	}).then(function(){
		gapi.auth2.getAuthInstance().isSignedIn.listen(route);
		route(gapi.auth2.getAuthInstance().isSignedIn.get());
		inButton.addEventListener("click", entry);
		outButton.addEventListener("click", exit);
	});
}

function route(auth){
	if (auth) {
		main.setAttribute("data-target", "true");
		authorization.removeAttribute("data-target");
		gapi.client.calendar.eventsDOM.list({calendarId: "primary" }).then(loadEvents);
	} else {
		authorization.setAttribute("data-target", "true");
		main.removeAttribute("data-target");
	}
}

function entry{
	gapi.auth2.getAuthInstance().signIn();
}

function exit{
	gapi.auth2.getAuthInstance().signOut();
}

function loadEvents(data){
	var items = data.result.items;
	for (var key in items){
		var item = items[key],
				dt = document.createElement("dt"),
				dd = document.createElement("dd"),
				description = document.createTextNode(item.description + '\n' + "("+ item.start.dateTime +")"),
				title = document.createTextNode(item.summary);
		dt.appendChild(title);
		dd.appendChild(description);
		eventsDOM.appendChild(dt);
		eventsDOM.appendChild(dd);
	}
}