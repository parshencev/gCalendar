var CLIENT_ID = "784730492192-sr80jkcgb0s70eo38huh1pk5h46krf44.apps.googleusercontent.com",
		DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
		SCOPES = "https://www.googleapis.com/auth/calendar",
		main = document.getElementById("main"),
		authorization = document.getElementById("authorization"),
		inButton = document.getElementById("in"),
		outButton = document.getElementById("out"),
		eventsDOM = document.getElementById("events"),
		add = document.getElementById("add"),
		title = document.getElementById("title"),
		description = document.getElementById("description"),
		date = new Date,
		year = date.getFullYear(),
		month = date.getMonth().toString().length == 1 ? ("0" + (parseInt(date.getMonth()) + 1)) : parseInt(date.getMonth()) + 1,
		day = date.getDate().toString().length == 1 ? ("0" + date.getDate()) : date.getDate(),
		startDate = year + "-" + month + "-" + day,
		endDate = year + "-" + month + "-" + (parseInt(day) + 1);

function initGAPI(){
	gapi.load('client:auth2', initClient);
}

function initClient(){
	gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function(){
		gapi.auth2.getAuthInstance().isSignedIn.listen(route);
		route(gapi.auth2.getAuthInstance().isSignedIn.get());
		inButton.addEventListener("click", entry);
		outButton.addEventListener("click", exit);
		add.addEventListener("click", newEvent);
	});
}

function route(auth){
	if (auth) {
		main.setAttribute("data-target", "true");
		authorization.removeAttribute("data-target");
		gapi.client.calendar.events.list({calendarId: "primary" }).then(loadEvents);
	} else {
		authorization.setAttribute("data-target", "true");
		main.removeAttribute("data-target");
	}
}

function entry(){
	gapi.auth2.getAuthInstance().signIn();
}

function exit(){
	gapi.auth2.getAuthInstance().signOut();
}

function newEvent(){
	gapi.client.calendar.events.insert({
		calendarId: "primary",
		summary: title.innerHTML || "simple title",
		description: description.innerHTML || "text text text text text",
		end: {
			date: endDate
		},
		start: {
			date: startDate
		}
	}).then(function(data){
		console.log(data);
	});
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