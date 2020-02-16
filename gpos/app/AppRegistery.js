
GPOS.AppRegistery = {};
GPOS.registerApp = function(id,app){
	GPOS.AppRegistery[id] = {id:0,function:app,instances:0};
}
GPOS.getApp = function(id){
	if (GPOS.AppRegistery[id]){
		GPOS.AppRegistery[id].id++;
		return GPOS.AppRegistery[id];
	}else{
		console.warn("The App '"+id+"' isn't registered !");
		return false;
	}
}
GPOS.appInstancesOf = function(id){
	if (GPOS.AppRegistery[id]){
		return GPOS.AppRegistery[id].instances;
	}else{
		return 0;
	}
}
function flushAppInstance(id){
	if (GPOS.AppRegistery[id]){
		let number = Math.max(0,GPOS.AppRegistery[id].instances-1)
		GPOS.AppRegistery[id].instances = number;
		return GPOS.AppRegistery[id];
	}else{
		console.warn("The App '"+id+"' isn't registered !");
		return false;
	}
}
function addAppStyle(id,app){
	if(GPOS.AppRegistery[id].instances == 0){
		let AppStyle = document.createElement('style');
		AppStyle.dataset.appid = id;
		AppStyle.innerHTML = app.style;
		document.head.appendChild(AppStyle);
	}
}
function removeAppStyle(id){
	let AppStyle = document.head.querySelector(`style[data-appid='${id}']`);
	if(AppStyle){
		AppStyle.remove();
	}
}

function canInstantiate(data){
	if(data.multiple == true){
		return true;
	}
	if(Number.isInteger(data.multiple) && data.multiple > GPOS.appInstancesOf(data.id) ){
		return true;
	}
	if(data.multiple == false && GPOS.appInstancesOf(data.id) == 0){
		return true;
	}
	return false;
}

GPOS.flushAppInstance = function(id){
	if (GPOS.AppRegistery[id]){
		GPOS.AppRegistery[id].instances--;
		return GPOS.AppRegistery[id];
	}else{
		console.warn("The App '"+id+"' isn't registered !");
		return false;
	}
}
function openApp(data){
	var ROOT = document.getElementById("GPOS");
	let AppEntry = GPOS.getApp(data.id);
	if(AppEntry){
		let number = AppEntry.id;
		let App = AppEntry.function(number);
		Object.assign(App,data);

		if(App.style){
			addAppStyle(data.id,App);
		}

		App.element.dataset.appid = data.id;
		App.element.dataset.instance = number;
		App.element.classList.add("application");
		AppEntry.instances++;
		ROOT.appendChild(App.element);

		createAppMenu(App);
		if(App.start){
			App.start();
		}
	}
}
function loadApp(data) {
	if(!canInstantiate(data)){
		return;
	}
	if(document.head.querySelector(`script[data-appid='${data.id}']`)){
		openApp(data);
		return;
	}
	let url = "/apps/"+data.id+"/app.js";
	var newScript = document.createElement("script");
	newScript.dataset.appid = data.id;
	newScript.onerror = (err)=>{
		alert(err);
	};
	newScript.onload = ()=>{
		openApp(data);
	};
	document.head.appendChild(newScript);
	newScript.src = url;
}

function AppPath(id){
	return "/apps/"+id+"/";
}

function loadAppData(id){
	let json = false;
	getJson(AppPath(id)+"app.json",true).send().echo((res)=>{
		if(!res.icon){
			res.icon = "icon.png";
		}
		json = res;
	});
	return json;
}
