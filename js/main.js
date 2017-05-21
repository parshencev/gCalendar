function App(){
	window.CLIENT_ID = "784730492192-sr80jkcgb0s70eo38huh1pk5h46krf44.apps.googleusercontent.com";
	window.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
	window.SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
	this.main = document.getElementById("main");
	this.authorization = document.getElementById("authorization");
	this.in = document.getElementById("in");
	this.out = document.getElementById("out");
	this.events = document.getElementById("events");
	this.initGAPI = function(){
		console.log(this, "initGapi");
		gapi.load('client:auth2', this.initClient);
	};
	this.initClient = function(){
		console.log(this, "initClient");
		gapi.client.init({
			discoveryDocs: window.DISCOVERY_DOCS,
			clientId : window.CLIENT_ID,
			scopes: window.SCOPES
		}).then(this.initEvents);
	};
	this.initEvents = (function(){
		console.log(this, "initEvents");
		gapi.auth2.getAuthInstance().isSignedIn.listen(this.route);
		this.route(gapi.auth2.getAuthInstance().isSignedIn.get());
		this.in.addEventListener("click", this.entry);
		this.out.addEventListener("click", this.exit);
	}).bind(this);
	this.route = (function(auth){
		console.log(this, "route");
		if (auth) {
			this.main.setAttribute("data-target", "true");
			this.authorization.removeAttribute("data-target");
			gapi.client.calendar.events.list({calendarId: "primary" }).then(this.loadEvents);
		} else {
			this.authorization.setAttribute("data-target", "true");
			this.main.removeAttribute("data-target");
		}
	}).bind(this);
	this.entry = function(){
		console.log(this, "entry");
		gapi.auth2.getAuthInstance().signIn();
	};
	this.exit = function(){
		console.log(this, "exit");
		gapi.auth2.getAuthInstance().signOut();
	};
	this.loadEvents = (function(data){
		console.log(this, "loadEvents");
		var items = data.result.items;
		for (var key in items){
			var item = items[key],
					dt = document.createElement("dt"),
					dd = document.createElement("dd"),
					description = document.createTextNode(item.description + '\n' + "("+ item.start.dateTime +")"),
					title = document.createTextNode(item.summary);
			dt.appendChild(title);
			dd.appendChild(description);
			this.events.appendChild(dt);
			this.events.appendChild(dd);
		}
	}).bind(this);
	return this;
}