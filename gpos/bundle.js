const GPOS = (()=>{
"use strict"

var GPOS = {};

var importScript = function(url){
    var req = new XMLHttpRequest();
    req.onload = function(e){
        if(this.responseText.length>0){
            eval.call(window,this.responseText);
        }else{
            throw new Error("Impossible to load script "+ url);
        }
    };
    req.onerror = function(e){
        throw new Error("Impossible to load script "+ url);
    }
    req.open('GET', url, false);
    req.send(null);
};


var _remove = function(){
	this.parentNode.removeChild(this);
};
if(!Text.prototype.remove){
	Text.prototype.remove = _remove;
}
if(!Element.prototype.remove){
	Element.prototype.remove = _remove;
}
Math.randomInt = function(nb){return Math.ceil(Math.random()*nb);};

function Rect(top,left,width,height){
	return {
		top:top,
		left:left,
		width:width,
		height:height
	};
}


/**
 * MouseEvent path property polyfill
 * by TerryZ
 * https://gist.github.com/TerryZ/69eaf29aeb8ccb099e91fc2c65148bbd
 */

if (!('path' in Event.prototype)) {
	Object.defineProperty(Event.prototype, 'path', {
		get: function () {
			const path = [];
			let currentElem = this.target;
			while (currentElem) {
				path.push(currentElem);
				currentElem = currentElem.parentElement;
			}
			if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
				path.push(document);
			if (path.indexOf(window) === -1)
				path.push(window);
			return path;
		}
	});
}
	
window.EventListen = function(self = this){
	self.events = {};

	self.addCustomEventListener = function(ev,fn){
		self.events[ev] = (self.events[ev] || []);
		self.events[ev].push(fn);
	};
	self.removeCustomEventListener = function(ev,fn){
		if(self.events[ev]!==undefined){
			let list = self.events[ev];
			for (let i = 0; i < list.length; i++) {
				const item = list[i];
				if(item==fn){
					list.splice(i,1);
					break;
				}
			}
		}
	};
	self.fireCustomEvent = function(ev,o){
		if(self.events[ev]){
			self.events[ev].forEach(fn=>{
				fn.call(this,o);
			})
		}
	};

};
window.Future = function(v){
	
	EventListen(this);

	var val = v || null;
	
	Object.defineProperty(this, 'value', {
		get() {return val;},
		set(v) {
			this.fireCustomEvent("value",new MessageEvent('future', {data : v}));
			val = v;
			onChanged();
		},
		enumerable: true,
		configurable: true
	});
	
	var setter = function(v){
		val = v;
	}
	
	var echos = [];
	var onChanged = function(){
		for(let i = 0; i < echos.length; i++){
			let r = echos[i](val,setter);
			if(r===false){break;}
			if(typeof(r)===typeof(0)){i=i+r<0?0:i+r;}
		}
	};
	this.echo = function(fn){
		echos = [];
		echos.push(fn);
		let o = {
			then: then.bind(this)
		}
		if(this.value != null){
			onChanged();
		}
		return o;
	}
	
	var then = function(fn){
		echos.push(fn);
		let o = {
			then: then.bind(this)
		}
		if(this.value != null){
			onChanged();
		}
		return o;
	}
};

window.Request = function(url,syn){
	syn = (syn || false);
	var ajax = {};
	ajax.req = new XMLHttpRequest();
	ajax.Future = new Future();
	
	ajax.onLoaded = function(){};
	ajax.loaded = function(fn){
		ajax.onLoaded = fn;
		return ajax;
	};
	
	ajax.processResponse = function(res){return res;};
	ajax.req.onload = function(e){
		if (this.status === 200) {
		// if(this.responseText){
			try{
				ajax.Future.value = ajax.processResponse(this);
				ajax.onLoaded(ajax.Future.value);
			}catch(e){
				ajax.onFailed();
			}
		}else{
			// console.error("NO RESPONSE",e,this);
			ajax.onFailed(e);
		}
	};
	
	ajax.onFailed = function(){};
	ajax.failed = function(fn){
		ajax.onFailed = fn;
		return ajax;
	};
	ajax.req.onerror = function(e){
		console.error("Ajax Error " + e.target.status + " from " + url);
		ajax.onFailed(e);
	};
	
	ajax.send = function(){
		ajax.req.open('GET', url, !syn);
		ajax.req.send(null);
		return ajax.Future;
	};
	return ajax;
};

window.fhtml = function(raw){
	raw = raw.replace(/</g,"&lt;");
	raw = raw.replace(/>/g,"&gt;");
	return raw;
}

window.getJson = function(url,syn){
	var req = Request(url,syn);
	req.processResponse = function(res){
		return JSON.parse(res.responseText);
	};
	return req;
};

window.getText = function(url,syn){
	var req = Request(url,syn);
	req.processResponse = function(res){
		return res.responseText;
	};
	return req;
};

window.loadMenoTo = function(el,url){
	getText(url).send().echo((text)=>{
		el.innerHTML = meno.parsed(text);
	});
}




var SMARTPHONE = window.matchMedia("(max-width: 860px)").matches;

function iconPath(file){
	return "/gpos/assets/icons/"+file;
}

var ICONS = {
	ARTICLE:iconPath("text.png"),
	TEXT:iconPath("text.png"),
	DEV:iconPath("dev.png"),
	FOLDER:iconPath("box.png"),
	SYSTEM:iconPath("system.png"),
	THEME:iconPath("theme.png"),
	NOTEPAD:iconPath("notepad.png"),
	SOUND:iconPath("sound.png"),
	ZIP:iconPath("zip.png"),
	BOX:iconPath("box.png"),
	INFO:iconPath("information.png"),
	CASE:iconPath("case.png"),
	RANDOM:iconPath("random.png"),
	BOOK:iconPath("book.png"),
	DRAGON:iconPath("dragon.png"),
}

var SIZE = {
	OSBAR:30,
	ICONWIDTH:64,
	ICONHEIGHT:64,
	WINDOW:384,
	WINDOW_MIN:288,
};
var PADDING = {
	FULLSCREEN:2,
	DESKTOP:10
};

window.MOUSE = {x:0,y:0};
window.addEventListener("mousemove", (e)=>{
	MOUSE.X = e.clientX;
	MOUSE.Y = e.clientY;
});


window.THEMESETTINGS = {};

var THEMES = {
	gpos:``,
	bubble:{
		css:`.openable[data-mini='false']>.win-title {
			border-radius: 20px;
			background-image: linear-gradient(177deg, rgba(255, 255, 255, 0.4), transparent, rgba(0, 0, 0, 0.1));
			box-shadow: 1px 1px 3px #000;
			position: absolute;
			left: 0;
			right: 0;
		}
		
		.openable {
			background: none;
			border: none;
			box-shadow: none;
			overflow: visible;
		}
		
		.openable .win-content {
			border-radius: 20px;
			border-top-left-radius: 0;
			margin-left: 10px;
			border-top-right-radius: 0;
			margin-right: 10px;
			box-shadow: 1px 1px 5px;
		}
		
		.win-resize {
			border-radius: 50%;
			background-color: #fff;
			border: 2px solid #eee;
			box-shadow: -1px -1px 3px #000;
		}
		
		.openable[data-mini='true'] {
			border-radius: 50%;
		}
		
		[data-mini='true'] .win-icon {
			border-radius: 50%;
			padding: 4px;
			box-sizing: border-box;
			box-shadow: 1px 1px 3px;
		}
		
		.openable .win-icon img {
			border-radius: 50%;
		}
		
		.openable.shortcut .win-icon::after {
			border-radius: 50%;
			left: 2px;
			bottom: 2px;
		}
		
		.placeholder {
			border-radius: 50%;
		}
		
		#pool .openable[data-mini='false']:not(.active) {
			box-shadow: none !important;
		}
		
		#pool .openable[data-mini='false']:not(.active) .win-content {
			box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
			border-color: #eee;
		}
		:not([data-view='list'])>.win-content>.openable[data-mini='true'] {
			border-radius: 50%;
			background-color: rgba(0, 0, 0, 0.1);
		}`,
		icons:{
			close:'\u2297',
			min:'\u25F4',
			max:'\u25CB',
			unmax:'\u233E',
			viewgrid:'\u2295',
			viewlist:'\u2296'
		}
	},
	nostalgy:{
		css:`.openable {
			border-radius: 0;
			border-width: 2px;
			border-color: #fff;
			border-style: outset;
			box-shadow: 1px 1px 0 #000;
		}
		
		.openable[data-mini='false']>.win-title {
			border-bottom: 1px solid #000;
			height: 15px;
		}
		
		body {
			font-family: monospace;
		}
		
		.openable[data-mini="true"]:not(.trans):hover {
			border-radius: 0;
		}
		
		.openable[data-mini="true"]:not(.trans) {
			transition: none;
		}
		
		.win-resize {
			border: 1px solid grey;
			border-radius: 0;
			border-bottom: none;
			border-right: none;
			height: 10px;
			width: 10px;
		}
		
		.win-resize:hover {
			background-color: inherit;
		}
		
		.openable.shortcut .win-icon::after {
			border-radius: 0;
			background-color: #fff;
			font-weight: bold;
		}
		
		.openable[data-mini="true"] .win-title::after {
			text-shadow: 1px 1px 0 #000;
			font-size: 14px;
		}
		
		.system-button {
			border: 2px outset;
		}
		
		div#menuhandle {
			background-color: #ddd;
			border: 2px outset;
			color: #000;
			margin: 2px;
			height: 26px;
			margin-top: 0;
		}
		
		div#menu {
			border-radius: 0;
			box-shadow: 1px1px0#000;
		}
		
		div#menu.open {
			border-width: 2px;
		}
		
		div#osbar {
			background-image: none;
			background-color: #eee;
			height: 30px;
			border-bottom: 4px ridge;
		}
		
		.win-min, .win-max, .win-folder-view,.win-back-color {
			background-color: yellow;
			padding: 0px!important;
			margin: 3px;
			border: 2px outset;
			font-size: 12px !important;
		}
		
		.win-max {
			background-color: greenyellow;
		}
		
		.win-close {
			background-color: lightsalmon;
		}
		
		.win-folder-view,.win-back-color {
			background-color: whitesmoke;
		}
		
		.win-min.win-close {
			font-size: 10px!important;
			line-height: 15px;
		}
		
		.win-min:hover, .win-max:hover, .win-folder-view:hover,.win-back-color:hover {
			color: #000;
			background-color: #fff
		}
		
		div#quickview {
			color: #888;
		}
		
		div#menuGPBox {
			position: relative;
			transform: scale(0.8);
			top: -2px;
		}
		
		.app-menu-handle {
			border: 2px outset #fff !important;
			height:28px;
			width:28px;
		}
		.app-menu-handle img{
			height:20px;
			width:20px;
			margin:2px;
		}`
	}
}

var WALLPAPERS = ['face','face2','face3','Forest','Spider','Tome 3'];
var COLORS = ["yellowgreen", "darkkhaki", "darkseagreen", "cadetblue", "darkturquoise", "cornflowerblue", "mediumslateblue", "darkorchid", "mediumvioletred", "orchid", "hotpink", "lightcoral", "palevioletred", "crimson", "orangered", "salmon", "indianred", "peru", "burlywood", "orange", "darkgrey"];
const Store = (storage,name)=>{

	let o = {};
	let cache = {};

	o.read = function(key){
		if(cache[key]){
			return cache[key];
		}
		try {
			let value = storage.getItem('M_'+key);
			if(value){
				return value;
			}
		} catch (err) {
			console.warn(`ERROR WHILE READING ${name} [${key}]`,err);
		}
		return false;
	}
	o.get = o.read;
	
	o.write = function(key,value){
		try {
			storage.setItem('M_'+key,value);
			cache[key] = value;
		} catch (err) {
			console.warn(`ERROR WHILE WRITING IN ${name} [${key} = ${value}]`,err);
		}
	}

	o.remove = function(key){
		try {
			storage.removeItem('M_'+key);
			cache[key] = undefined;
		} catch (err) {
			console.warn(`ERROR WHILE REMOVING ${name} ITEM [${key}]`,err);
		}
	}

	return o;

};

var MEMORY = Store(localStorage,'MEMORY');
var SESSION = Store(sessionStorage,'SESSION');

var ROOT = document.getElementById('GPOS');

var DESKTOP = document.createElement("div");
DESKTOP.id = "desktop";
DESKTOP.add = function(el){this.appendChild(el);}
ROOT.appendChild(DESKTOP);

var BAR = document.createElement("div");
BAR.id = "osbar";
ROOT.appendChild(BAR);

var APPSBAR = document.createElement("div");
APPSBAR.id = "appsbar";
BAR.appendChild(APPSBAR);

var HANDLE = document.createElement("div");
HANDLE.id = "menuhandle";
HANDLE.innerHTML = '<div id="menuGPBox"><span id="menuG"></span><span id="menuP"></span><div>';
HANDLE.addEventListener('click',e=>{
    HANDLE.classList.toggle('open');
    MENU.classList.toggle('open');
    let autoClose = (ev)=>{
        if(!ev.path.includes(HANDLE)){
            closeSystemMenu();
        }
        window.removeEventListener('mousedown',autoClose);
    }
    window.addEventListener('mousedown',autoClose);
});
function closeSystemMenu(){
    HANDLE.classList.remove('open');
    MENU.classList.remove('open');
}
BAR.appendChild(HANDLE);

var QUICK = document.createElement("div");
QUICK.id = "quickview";
QUICK.innerHTML = '\u2237';
QUICK.addEventListener('click',ev=>{
    POOL.classList.add('quickview');
})
BAR.appendChild(QUICK);

var MENU = document.createElement("div");
MENU.id = "menu";
HANDLE.appendChild(MENU);

var POOL = document.createElement("div");
POOL.id = "pool";
POOL.add = function(el){this.appendChild(el);}
ROOT.appendChild(POOL);

POOL.addEventListener('click',ev=>{
    POOL.classList.remove('quickview');
});
ROOT.appendChild(POOL);

function inBounds(rect){
	rect.top = rect.top < (PADDING.FULLSCREEN+SIZE.OSBAR) ? PADDING.FULLSCREEN+SIZE.OSBAR : rect.top;
	rect.left = rect.left < PADDING.FULLSCREEN ? PADDING.FULLSCREEN : rect.left;
	if((rect.left+rect.width)>(window.innerWidth-PADDING.FULLSCREEN)){
		let off = (rect.left+rect.width) - (window.innerWidth-PADDING.FULLSCREEN*2);
		rect.left = rect.left - off;
	}
	if((rect.top+rect.height)>(window.innerHeight-PADDING.FULLSCREEN-SIZE.OSBAR)){
		let off = (rect.top+rect.height) - (window.innerHeight-SIZE.OSBAR-PADDING.FULLSCREEN*2);
		rect.top = rect.top - off;
	}
	return rect;
}

function setInFront(w) {
	if(SMARTPHONE){
		w.classList.add('active');
		if(w.infos && w.infos.inFolder){
			setInFront(w.infos.folder.parentNode)
		}
		return;
	}
	if(w.classList.contains('in-folder') && w.dataset.mini == "true"){
		return;
	}
	if(w.dataset.mini == "true"){
		DESKTOP.appendChild(w);
		return;
	}
	var wins = document.querySelectorAll('#pool > .openable[data-mini=false]');
	var base = parseInt(w.style.zIndex);
	for(let i= 0; i<wins.length; i++){
		wins[i].classList.remove('active');
		let zIndex = parseInt(wins[i].style.zIndex);
		if(zIndex >= base){
			wins[i].style.zIndex = Math.max(0,zIndex-1);
		}else{

		}
	}
	w.classList.add('active');
	if(w.dataset.mini != "true"){
		w.style.zIndex = wins.length+2;
	}
}

function displace(target){
	target.add(this);
}

function Boot(){
	setTimeout(()=>{
		document.getElementById('GPOS').className = 'boot-end';
		setTimeout(()=>{
			document.getElementById('GPOS').className = 'booted';
		},1000);
	},2500);
}

if (SMARTPHONE) {
    POOL.addEventListener('click',ev=>{
        if(ev.target == POOL){
            [].forEach.call(pool.children,el=>{
                el.classList.remove('active');
            });
        }
    });
}

function getItemPos(nb){
    let last = 1, col = 1;
    while(nb>last){
        col += 1;
        last = (col*(col+1))/2;
    }
    let row = (nb+(col%2==0?+1:-1))%col;
    return {col:col-1,row:row};
}

function putInTopLeft(el,index){
    let pos = getItemPos(index);
    el.style.left = ((pos.col-pos.row)*96)+'px';
    el.style.top = 35+(pos.row*96)+'px';
}
function putInTopRight(el,index){
    let pos = getItemPos(index);
    el.style.left = (window.innerWidth-100-((pos.col-pos.row)*96))+'px';
    el.style.top = 35+(pos.row*96)+'px';
}
function putInBottomLeft(el,index){
    let pos = getItemPos(index);
    el.style.left = ((pos.col-pos.row)*96)+'px';
    el.style.top = window.innerHeight-160-(pos.row*96)+'px';
}
function putInBottomRight(el,index){
    let pos = getItemPos(index);
    el.style.left = (window.innerWidth-100-((pos.col-pos.row)*96))+'px';
    el.style.top = window.innerHeight-160-(pos.row*96)+'px';
}

function createItem(data){
    let icon = undefined;
    switch(data.object){
        case 'article':
            icon = getIconPath(data.icon);
            return GPOS.newArticle(data.title,data.key,icon);
        case 'app':
            return GPOS.newApp(data.key);
        case 'folder':
            let items = [];
            data.items.forEach(item=>{
                items.push(createItem(item));
            });
            icon = getIconPath(data.icon);
            return GPOS.newFolder(data.title,items,icon);
        case 'image':
            return GPOS.newImage(data.title,data.source,data.backColor);
        case 'link':
            icon = getIconPath(data.icon);
            return GPOS.newLink(data.title,data.url,icon);
        default:
            return false;
    }
}

function loadDesktop(){
    getJson('/desktop.json',true).send().echo(json=>{
        let indexes = {['top-left']:1,['top-right' ]:1,['bottom-left' ]:1,['bottom-right' ]:1};
        json.forEach(data=>{
            let item = createItem(data);
            if(item){
                switch(data.position){
                    case 'top-right':
                        putInTopRight(item,indexes[data.position]);
                        break;
                    case 'bottom-left':
                        putInBottomLeft(item,indexes[data.position]);
                        break;
                    case 'bottom-right':
                        putInBottomRight(item,indexes[data.position]);
                        break;
                    case 'top-left':
                    default:
                        data.position = 'top-left';
                        putInTopLeft(item,indexes[data.position]);
                        break;
                }
                indexes[data.position]++;
            }
        });
    });
}

function getIconPath(str){
    if(!str){return undefined;}
    if(str[0] == '$'){
        return ICONS[str.substring(1)];
    }else{
        return str;
    }
}







var wallStyle = document.createElement('style');
document.head.appendChild(wallStyle);
function setWallPaper(name){
	THEMESETTINGS.wallpaper = name;
	let url = 'images/wallpaper/'+name+'.png';
	wallStyle.innerHTML = "body {background-image: url('"+url+"');}";
}

var colorStyle = document.createElement('style');
document.head.appendChild(colorStyle);
function setMainColor(color){
	THEMESETTINGS.color = color;
	colorStyle.innerHTML = ".open span#menuP,#menuhandle.open span#menuG,.openable.link > .win-icon::after {color:"+color+";}";
	colorStyle.innerHTML += "div#GPOS::before {background-color:"+color+";}";
	colorStyle.innerHTML += "#quickview {color:"+color+" !important;}";
	colorStyle.innerHTML += "div#menuhandle:hover, .openable[data-mini='false'] > .win-title, .openable.system.active > .win-resize,.app-menu-handle:hover  {background-color:"+color+";}";
	colorStyle.innerHTML += ".openable.system.active .win-content,.app-menu-handle:hover {border-color:"+color+";}";
}

var themeStyle = document.createElement('style');
document.head.appendChild(themeStyle);
function setTheme(key){
	THEMESETTINGS.theme = key;
	themeStyle.innerHTML = THEMES[key].css;
}


function loadThemeSettings(){
	try {
		let settings = MEMORY.read('THEMESETTINGS');
		settings = JSON.parse(settings);
		
		if(settings.color){
			setMainColor(settings.color);
		}
		if(settings.theme){
			setTheme(settings.theme);
		}
		if(settings.wallpaper){
			setWallPaper(settings.wallpaper);
		}
	} catch (err) {
		console.log('ERROR WHILE LOADING USER THEME SETTINGS',err);
	}
}
function recordThemeSettings(){
	let str = JSON.stringify(THEMESETTINGS);
	MEMORY.write('THEMESETTINGS',str);
}
function deleteThemeSettings(){
	MEMORY.remove('THEMESETTINGS');
}


loadThemeSettings();

var THEMEWINDOW = (function(){
	let form = document.createElement('form');
	form.className = 'system-form';
	form.action = '#';

	form.innerHTML += '<label for="_theme_choice">Thème:</label>';

	let key = THEMESETTINGS.theme || '';
	function isSelected(k){
		return k == key ? 'selected' : '';
	}

	let sel = document.createElement('select');
	sel.id = sel.name = "_theme_choice";
	sel.innerHTML = `<option value="gpos" ${isSelected('gpos')}>GPOS</option>
	<option value="bubble" ${isSelected('bubble')}>Bubble</option>
	<option value="nostalgy" ${isSelected('nostalgy')}>Nostalgy</option>`;
	sel.addEventListener('change',ev=>{
		setTheme(sel.value);
		recordThemeSettings();
	});
	form.appendChild(sel);
	if(THEMESETTINGS.theme){
		sel.selectedIndex = Object.keys(THEMES).indexOf(THEMESETTINGS.theme);
	}

	let choi = document.createElement('label');
	choi.innerText = 'Wallpaper:';
	choi.for="_wallpaper_choice";
	form.appendChild(choi);

	let wall = document.createElement('div');
	wall.id = "_wallpaper_choice";
	WALLPAPERS.forEach(w=>{
		let el = document.createElement('img');
		el.src = 'images/wallpaper/'+w+'.png';
		el.dataset.value = w;
		if(THEMESETTINGS.wallpaper == w){
			el.classList.add("selected");
		}
		el.addEventListener('click',ev=>{
			setWallPaper(w);
			recordThemeSettings();
			wall.querySelectorAll('img').forEach(e=>{
				e.classList.remove('selected');
			});
			el.classList.add('selected');
		});
		let cont = document.createElement('div');
		cont.className = "wallpaper-choice";
		cont.title = w;
		cont.appendChild(el);
		wall.appendChild(cont);
	});

	form.appendChild(wall);

	let co = document.createElement('label');
	co.innerText = 'Main Color:';
	co.for="_color_choice";
	form.appendChild(co);

	let color = document.createElement('div');
	color.id = "_color_choice";
	COLORS.forEach(c=>{
		let col = document.createElement('div');
		col.className = 'color-choice';
		col.style.backgroundColor = c;
		col.title = c;
		col.dataset.value = c;
		if(THEMESETTINGS.color == c){
			col.classList.add('selected');
		}
		col.addEventListener('click',ev=>{
			setMainColor(c);
			recordThemeSettings();
			
			color.querySelectorAll('.color-choice').forEach(e=>{
				e.classList.remove('selected');
			});
			col.classList.add('selected');
				
		});
		color.appendChild(col);
		if(THEMESETTINGS.color && THEMESETTINGS.color == c){
			col.classList.add('selected');
		}
	});

	form.appendChild(color);

	let def = document.createElement('div');
	def.innerText = 'Default';
	def.className="system-button";
	def.addEventListener('click',ev=>{

		setTheme('gpos');
		sel.selectedIndex = 0
		color.querySelector("[data-value='orangered']").click();
		wall.querySelector("[data-value='face2']").click();

		deleteThemeSettings();
	})
	form.appendChild(def);


	return form;

})();

var NOTEPAD = (function(){
	let form = document.createElement('form');
	form.className = 'notepad-form';
	form.action = '#';
	form.dataset.max = 2000;

	let area = document.createElement('textarea');
	area.id = "_note_area";
	area.maxLength = form.dataset.max;
	area.spellcheck = false;
	form.appendChild(area);

	let content = MEMORY.read('note') || `Ceci est un bloc-note.`;

	area.innerHTML = content;

	let save = function(){
		MEMORY.write('note',area.value);
	}

	area.addEventListener('blur',save);
	area.addEventListener('keyup',save);

	let count = function(){
		let note = area.value;
		form.dataset.count = note.length;
		if(note.length == area.maxLength){
			form.classList.add('full');
		}else{
			form.classList.remove('full');
		}
	}

	area.addEventListener('keyup',count);
	count();

	return form;
})();

var ABOUT = (function(){

	let cont = document.createElement('div');
	cont.className = 'meno';

    loadMenoTo(cont,'/articles/about.txt');

    return cont;
    
})();

// console.log('');
// console.log('');
// prout
// importScript("/gpos/display/Icons.js");


function Frame(title="",content=""){

    let self = document.createElement("div");
    self.className = "frame";

    EventListen(self);
    
    let focus = function(){
        if(POOL.dataset.quickview == 'true'){
            POOL.dataset.quickview = 'false';
        }
        setInFront(self);
        closeSystemMenu();
        self.fireCustomEvent('focus');
    };
    self.addEventListener("mousedown",focus);

    self.infos = {
        title: title,
        mini: false,
        lastWidth: SIZE.WINDOW,
        lastHeight: SIZE.WINDOW,
        iconTop: '',
        iconLeft: '',
        folder: DESKTOP,
        route:'',
        inFolder:false
    }
    
    self.Title = document.createElement("div");
    self.Title.className = "win-title";
    self.Title.innerHTML = title;
    self.Title.dataset.title = title;

    let doubleClick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.fireCustomEvent('doubleclick');
    };
    let downTrigger = false;

    let mouseUp = function() {
        self.dataset.notra = self.dataset.dragging = self.dataset.floating = 'false';
        
        downTrigger = false;
        window.removeEventListener('mousemove', mouseMove, false);
        window.removeEventListener('mouseup', mouseUp, false);
        self.fireCustomEvent('moved');
    };
    let mouseMove = function(e) {
        e.preventDefault();
        
        self.dataset.dragging = "true";

        if (e.clientX < 0 || e.clientX > window.innerWidth || e.clientY < 0 || e.clientY > window.innerHeight)
            return;
        
        var nw = self.startLeft + e.clientX - self.startMX;
        var nh = self.startTop + e.clientY - self.startMY;
        
        if(nw >= PADDING.FULLSCREEN && (nw+SIZE.ICONWIDTH) <= window.innerWidth-(PADDING.FULLSCREEN*2)){
            self.style.left = (nw/window.innerWidth)*100 + "%";
            self.infos.lastLeft = nw;
        }
        if(nh >= (PADDING.FULLSCREEN+SIZE.OSBAR) && (nh+SIZE.ICONHEIGHT) <= window.innerHeight-(PADDING.FULLSCREEN*2)){
            self.style.top = (nh/window.innerHeight)*100 + "%";
            self.infos.lastTop = nh;
        }
        
        self.fireCustomEvent('moving');
    };

    let hasFirstClicked = false;
    let clickTimer;
    
    let mouseDown = (e) => {
        focus();
        if(SMARTPHONE){
            clearTimeout(clickTimer);
            hasFirstClicked = false;
            doubleClick(e);
            return;
        }
        if (!hasFirstClicked) {
            if(self.dataset.max != 'true'){
                initMove(e);
            }
            clickTimer = setTimeout(function() {
                hasFirstClicked = false;
            }, 400);
            hasFirstClicked = true;
        } else if (hasFirstClicked) {
            clearTimeout(clickTimer);
            hasFirstClicked = false;
            doubleClick(e);
        }
    }
    self.Title.addEventListener("mousedown", mouseDown);
    
    let initMove = function(e){
        e.preventDefault();
        downTrigger = true;
        self.dataset.notra = "true";
        
        self.startMX = e.clientX;
        self.startMY = e.clientY;
        self.startLeft = parseInt(document.defaultView.getComputedStyle(self).left, 0);
        self.startTop = parseInt(document.defaultView.getComputedStyle(self).top, 0);
        
        var leave = function(){
            downTrigger=false;
            self.Title.removeEventListener('mouseout',leave);
        };
        
        var fn = function(){
            if(downTrigger == true){
                self.dataset.floating = "true";
                self.Title.removeEventListener('mouseout',leave);
                window.addEventListener('mousemove', mouseMove, false);
            }
            downTrigger=false;
        };
        if(self.dataset.mini == 'true'){
            if(!self.classList.contains('in-folder')){
                setTimeout(fn,200);
            }
        }else{
            window.addEventListener('mousemove', mouseMove, false);
            self.Title.addEventListener('mouseout',leave, false);
        }
        window.addEventListener('mouseup', mouseUp, false);
    };
    
    self.Content = document.createElement("div");
    self.Content.className = "win-content";
    self.Content.innerHTML = content;

    self.appendChild(self.Content);
    self.appendChild(self.Title);
    
    return self;
}

document.addEventListener('keydown',ev=>{
    if(ev.ctrlKey && ev.code == 'KeyA'){
        ev.preventDefault();
        let active = document.querySelector('#pool > .openable.active');
        if(active){
            let content = active.querySelector('.win-content:first-of-type');
            let selection = document.getSelection();
            selection.selectAllChildren(content);
        }
    }
});

// console.log('prout');
function MenuItem(title,icon,win,id){
	let el = document.createElement('div');
	el.className = 'menu-item';

	let ic = document.createElement('img');
	ic.className = 'menu-item-icon';
	ic.src = icon;

	let ti = document.createElement('span');
	ti.className = 'menu-item-title';
	ti.innerText = title;

	el.appendChild(ic);
	el.appendChild(ti);

	el.addEventListener('mousedown',ev=>{
		if(ev.button != 0){
			return;
		}
		closeSystemMenu();
		let exist = document.getElementById(id);
		if(exist){
			exist.restore();
			setInFront(exist);
		}else{
			let sys = GPOS.newSystem(title,win,id);
			setInFront(sys);
		}
	});

	return el;

}




const ACTIONS = {};

var WidgetClose = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-min win-close";
    
    Element.addEventListener("click",()=> {

            frame.dataset.max = 'false';

            frame.fireCustomEvent('close');

            frame.style.opacity = 0;

            frame.classList.add('trans');

            setTimeout(function(){
                frame.classList.remove('trans');
                frame.fireCustomEvent('closed');
            },500);

    });

    frame.appendChild(Element);
    
}
var WidgetFolderView = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-folder-view";
            
    Element.addEventListener("click",()=> {
        if(frame.dataset.mini != 'true'){
            frame.fireCustomEvent('viewchange');
            if(frame.dataset.view == 'list'){
                frame.dataset.view = "icons";
            }else{
                frame.dataset.view = "list";
            }
            frame.fireCustomEvent('viewchanged');
        }
    });

    frame.appendChild(Element);
    
}
var WidgetBackColor = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-back-color";
    
    Element.addEventListener("click",()=> {
        if(frame.dataset.mini != 'true'){
            frame.fireCustomEvent('backcolorchange');
            if(frame.dataset.backColor == 'white'){
                frame.dataset.backColor = "black";
            }else{
                frame.dataset.backColor = "white";
            }
            frame.fireCustomEvent('backcolorchanged');
        }
    });

    frame.appendChild(Element);
    
}
var WidgetMaximize = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-max";
    
    let restoreToRect = ()=>{
        frame.dataset.max = 'false';
        let rect = frame.infos.oldRect;
        frame.style.top = rect[0];
        frame.style.left = rect[1];
        frame.style.width = rect[2];
        frame.style.height = rect[3];
    }
    let setToMax = ()=>{
        frame.dataset.max = 'true';
        frame.infos.oldRect = [frame.style.top,frame.style.left,frame.style.width,frame.style.height]
        frame.style.top = SIZE.OSBAR+'px';
        frame.style.left =  '0px';
        frame.style.width = (window.innerWidth-2)+'px';
        frame.style.height = (window.innerHeight-2-SIZE.OSBAR)+'px';
    }

    Element.addEventListener("click",()=> {
        if(frame.dataset.mini != 'true'){
            if(frame.dataset.max == 'true'){
                frame.fireCustomEvent('unmaximize');
                restoreToRect();
                frame.fireCustomEvent('unmaximized');
            }else{
                frame.fireCustomEvent('maximize');
                setToMax();
                frame.fireCustomEvent('maximized');
            }
        }
    });

    frame.appendChild(Element);
    
}
var WidgetMinimize = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-min win-close";
    
    let restoreToIcon = ()=>{
        frame.dataset.mini = 'true';
        frame.dataset.max = 'false';
        frame.style.width = SIZE.ICONWIDTH+'px';
        frame.style.height = SIZE.ICONHEIGHT+'px';
        if(!frame.infos.inFolder){
            frame.style.top = frame.infos.iconTop;
            frame.style.left = frame.infos.iconLeft;
        }
    }

    Element.addEventListener("click",()=> {
        if(frame.dataset.mini != 'true'){

            restoreToIcon();

            frame.fireCustomEvent('close');

            frame.classList.add('trans');

            let time = SMARTPHONE&&frame.holder ? 0 : frame.infos.inFolder ? 100 : 300;

            setTimeout(function(){
                frame.classList.remove('trans');
                if(frame.infos.inFolder){
                    frame.infos.placeholder.insertAdjacentElement('beforebegin',frame);
                    frame.infos.placeholder.remove();
                }else if(frame.holder){
                    frame.holder.insertAdjacentElement('afterend',frame);
                    frame.holder.remove();
                }else{
                    frame.displace(frame.infos.folder);
                }
            },time);
        }
    });

    frame.appendChild(Element);
    
}
var WidgetResize = (frame)=>{
    
    let Element = document.createElement("div");
    
    Element.className = "win-resize";
    
    let startWidth,startHeight,startX,startY;

    let initResize = (e)=>{
        // e.stopPropagation();
        e.preventDefault();
        frame.fireCustomEvent('resize');
        setInFront(frame);
        closeSystemMenu();
        
        frame.dataset.notra = "true";
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(frame).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(frame).height, 10);
        
        window.addEventListener('mousemove', doResize, false);
        window.addEventListener('mouseup', stopResize, false);
    };
    let doResize = (e)=>{
        let nw = startWidth + MOUSE.X - startX;
        let nh = startHeight + MOUSE.Y - startY;

        if (nw > SIZE.WINDOW_MIN && nw < window.innerWidth-(PADDING.FULLSCREEN*2)){
            frame.style.width = nw + 'px';
            frame.infos.lastWidth = nw;
        }
        if (nh > SIZE.WINDOW_MIN && nh < window.innerHeight-SIZE.OSBAR-(PADDING.FULLSCREEN*2)){
            frame.style.height = nh + 'px';
            frame.infos.lastHeight = nh;
        }
        frame.fireCustomEvent('resizing');
    };
    let stopResize = (e)=>{
        frame.dataset.notra = "false";
        window.removeEventListener('mousemove', doResize, false);    
        window.removeEventListener('mouseup', stopResize, false);
        frame.fireCustomEvent('resized');
    };

    Element.addEventListener("mousedown",initResize);
    
    frame.appendChild(Element);

}

    
// importScript("/gpos/interface/actions/pin.js");
// importScript("/gpos/interface/actions/new.js");

function LoadingIndicator(){
	let el = document.createElement('div');
	el.className = "loading-indicator";
	return el;
}

function Openable(title,content,icon){

    let self = new Frame(title,content);
    self.dataset.mini = "true";

    WidgetMinimize(self);
    WidgetMaximize(self);
    WidgetResize(self);

    self.classList.add("openable");

    self.infos = {
        title: title,
        mini: false,
        lastWidth: SIZE.WINDOW,
        lastHeight: SIZE.WINDOW,
        iconTop: '',
        iconLeft: '',
        folder: DESKTOP,
        route:'',
        inFolder:false
    }
    
    self.setFolder = function(f,route){
        self.classList.add('in-folder');
        self.dataset.route = route;
        self.infos.route = route;
        self.infos.folder = f;
        self.infos.inFolder = true;
        self.Title.dataset.route = route;
    }
    self.displace = displace;
    
    self.placeholder = function(){
        let holder = document.createElement('div');
        holder.className = 'placeholder';
        holder.innerHTML = '<img src="'+icon+'">';
        holder.dataset.title = title;
        self.insertAdjacentElement('beforebegin',holder);
        self.infos.placeholder = holder;
    }

    let doubleClick = (e)=>{
        if(self.dataset.mini == 'true'){
            if(self.infos.inFolder){
                self.placeholder(self.infos.folder);
            }else{
                self.holder = document.createElement('meta');
                self.insertAdjacentElement('beforebegin',self.holder);
            }
            
            self.displace(POOL);
            self.infos.iconTop = self.style.top;
            self.infos.iconLeft = self.style.left;

            let rect = Rect(
                MOUSE.Y-30,
                MOUSE.X-30,
                self.infos.lastWidth ? self.infos.lastWidth :  SIZE.WINDOW,
                self.infos.lastHeight ? self.infos.lastHeight :  SIZE.WINDOW
            );

            rect = inBounds(rect);

            self.style.top = rect.top+'px';
            self.style.left = rect.left+'px';
            setTimeout(function(){
                self.dataset.mini = false;
                self.infos.mini = false;
                self.style.width = rect.width+'px';
                self.style.height = rect.height+'px';
                setInFront(self);
                
            },10);
        }
    }

    self.addCustomEventListener('doubleclick',doubleClick);

    self.Icon = document.createElement("div");
    self.Icon.className = "win-icon";
    self.Icon.innerHTML = '<img src="'+icon+'">';

    self.Title.insertAdjacentElement('beforebegin',self.Icon);

    return self;
}

function Image(title,url,backColor = 'black'){

    let self = new Openable(title,`<div class="image-container"><img src="${url}" alt="Image"></div>`,url);
    self.classList.add('image');

    WidgetBackColor(self);

    self.dataset.backColor = backColor;
    
    return self;
}

GPOS.newImage = (title,url,backColor)=>{
    return DESKTOP.appendChild(new Image(title,url,backColor));
}

function Article(title,name,icon=ICONS.ARTICLE){

    let self = new Openable(title,LoadingIndicator(),icon);
	self.classList.add('article');

	self.Content.classList.add('meno');
	
	self.addCustomEventListener('doubleclick',()=>{
		loadMenoTo(self.Content,ArticlePath(name));
	});

    return self;
}
function ArticlePath(key){
	return "/articles/"+key+".txt";
}

GPOS.newArticle = (title,key,icon)=>{
    return DESKTOP.appendChild(new Article(title,key,icon));
}

function Folder(title,items,icon=ICONS.FOLDER){

    let self = new Openable(title,"",icon);
    self.classList.add('folder');

    WidgetFolderView(self);

    self.add = function(el){self.Content.appendChild(el)};
    
    items.forEach(item=>{
        self.add(item);
        item.setFolder(self.Content,title+'/');
    })

    return self;
}

GPOS.newFolder = (title,content,icon)=>{
    return DESKTOP.appendChild(new Folder(title,content,icon));
}


function Shortcut(title,icon){

    let self = new Frame(title,"");
    self.dataset.mini = "true";

    self.classList.add("openable");

    self.infos = {
        title: title,
        iconTop: '',
        iconLeft: '',
        folder: DESKTOP,
        route:'',
        inFolder:false
    }
    
    self.setFolder = function(f,route){
        self.classList.add('in-folder');
        self.dataset.route = route;
        self.infos.route = route;
        self.infos.folder = f;
        self.infos.inFolder = true;
        self.Title.dataset.route = route;
    }
    self.displace = displace;

    self.Icon = document.createElement("div");
    self.Icon.className = "win-icon";
    self.Icon.innerHTML = '<img src="'+icon+'">';

    self.Title.insertAdjacentElement('beforebegin',self.Icon);

    return self;
}

function Link(title,icon,url){

    let self = new Shortcut(title,icon);
    self.classList.add('link');

    let doubleclick = ()=>{
        window.open(url,'_blank');
    };

    self.addCustomEventListener('doubleclick',doubleclick);
    
    return self;
}

GPOS.newLink = (title,url,icon)=>{
    return DESKTOP.appendChild(new Link(title,icon,url));
}

function App(id){

  let data = loadAppData(id);
  data.id = id;

	let path = "/apps/"+id+"/";

  let self = new Shortcut(data.title,path+data.icon);
  self.classList.add('app');

  if(data.devices){
    if(!data.devices.includes('desktop')){
      self.classList.add('no-desktop');
    }
    if(!data.devices.includes('tablet')){
      self.classList.add('no-tablet');
    }
    if(!data.devices.includes('mobile')){
      self.classList.add('no-mobile');
    }
  }

  let doubleclick = ()=>{
    loadApp(data);
  };

  self.addCustomEventListener('doubleclick',doubleclick);
  
  return self;

}

GPOS.newApp = (id)=>{
  return DESKTOP.appendChild(new App(id));
}



function System(title,content,id){
    
    let self = new Frame(title,"");

    WidgetClose(self);
    WidgetMaximize(self);
	WidgetResize(self);
	
    self.id = id;
    self.classList.add('system','openable');
    self.dataset.mini = 'false';

	self.Content.appendChild(content);

    let close = ()=>{
		self.dataset.closed = 'true';
		self.style.pointerEvents = 'none';
		self.style.opacity = 0;
		self.style.width = '0px';
		self.style.height = '0px';
		self.style.top = '0px';
		self.style.left = '0px';
	}
	self.close = close;
	self.close = close;
	
    let restore = ()=>{
		self.dataset.closed = 'false';
		self.style.pointerEvents = 'all';
		self.style.opacity = 1;
		self.style.width = (self.infos.lastWidth || SIZE.WINDOW)+'px';
		self.style.height = (self.infos.lastHeight || SIZE.WINDOW)+'px';
		self.style.top = (self.infos.lastTop || '40')+'px';
		self.style.left = (self.infos.lastLeft || '40')+'px';
	}
	self.restore = restore;

	self.addCustomEventListener('close',close);

    return self;

}

GPOS.newSystem = (title,content,id)=>{
	let sys = new System(title,content,id);
	
	sys.close();

	POOL.appendChild(sys);

	setTimeout(()=>{
		sys.restore();
	},10)
	
	return sys;
}
function Information(title,content){
    
    let self = new Frame(title,content);
    self.classList.add('information','openable');
    self.dataset.mini = 'false';

    WidgetClose(self);

    let close = ()=>{
        self.remove();
    }

    self.addCustomEventListener('closed',close);

    return self;
}

GPOS.newInformation = (title,content)=>{
    let info = new Information(title,content);
    POOL.appendChild(info);

    info.style.left = (window.innerWidth-info.offsetWidth)/2+'px';
    info.style.top = (window.innerHeight-info.offsetHeight)/2+'px';

    return info;
}


function autoCloseApp(app){
    app.element.style.pointerEvents = 'none';
    app.element.style.transition = "opacity 0.4s";
    app.element.style.opacity = '0';
    setTimeout(()=>{
        app.element.remove();
    },400);
}

function appMenuItemClose(app,handle){
    let item = appMenuItem({label:"Quitter"});
    item.addEventListener('click',ev=>{
		if(ev.button != 0){ return; }
        handle.style.pointerEvents = 'none';
        handle.style.transition = "opacity 0.4s";
        handle.style.opacity = '0';
        setTimeout(()=>{
            handle.remove();
        },400);
        if(app.close){
            app.close(autoCloseApp.bind(null,app));
            flushAppInstance(app.id);
            if(GPOS.appInstancesOf(app.id)==0){
                removeAppStyle(app.id);
            }
        }else{
            autoCloseApp(app);
            flushAppInstance(app.id);
            if(GPOS.appInstancesOf(app.id)==0){
                removeAppStyle(app.id);
            }
        }
    });
    return item;
}

function appMenuItem(data){
	let el = document.createElement('div');
	el.className = 'app-menu-item';

	let label = document.createElement('span');
	label.className = 'app-menu-item-label';
	label.innerText = data.label;
    el.appendChild(label);

    return el;
}
function appMenuItemText(data){

	let el = document.createElement('div');
	el.className = 'app-menu-text';

	let label = document.createElement('span');
	label.className = 'app-menu-item-label';
	label.innerText = data.label;
    el.appendChild(label);

    return el;

}
function appMenuItemLine(){
    
	let el = document.createElement('div');
	el.className = 'app-menu-text';

	let label = document.createElement('span');
	label.className = 'app-menu-hr';
    el.appendChild(label);

    return el;

}
function appMenuItemFunction(data){
    
    let el = appMenuItem(data);
    el.classList.add('app-menu-function');
    
	el.addEventListener('click',ev=>{
        if(ev.button != 0){ return; }
        if(data.function){
            data.function();
        }
	});

}

function appMenuItemInformation(data,menu){
    
    let el = appMenuItem(data);
    el.classList.add('app-menu-info');
    
	el.addEventListener('click',ev=>{
        if(ev.button != 0){ return; }
        menu.classList.remove('open');
        let key = data.id + ':' + data.label;
        let already = document.getElementById(key);
        if(!already){
            already = GPOS.newInformation(data.title,data.content);
            already.id = key;
        }
        setInFront(already);
    });
    
    return el;

}

function appMenuWindowInformation(data,menu){
    
    let el = appMenuItem(data);
    el.classList.add('app-menu-window');
    
	el.addEventListener('click',ev=>{
        if(ev.button != 0){ return; }
        menu.classList.remove('open');
        let key = data.id + ':' + data.label;
        let already = document.getElementById(key);
        if(!already){
            already = GPOS.newSystem(data.title,data.content);
            already.id = key;
        }
        already.restore();
        setInFront(already);
    });
    
    return el;

}
function appMenuItemSwitch(data){

    let el = appMenuItem(data);

    let state = document.createElement('span');
    state.className = 'app-menu-item-state';
    el.appendChild(state);
    
    let convertStateValue = (value)=>{
        return value === true ? '\u2611': value === false ? '\u2610' : value;
    }
    if(data.value !== undefined){
        let value = convertStateValue(data.value)
        state.innerHTML = value;
    }
    
	el.addEventListener('click',ev=>{
        if(ev.button != 0){ return; }
        
        if(data.function){
            state.innerHTML = convertStateValue(data.function());
        }     
    });
    
    return el;
    
}
function getAppMenuItem(data,menu){
    
    let el = undefined;

    switch(data.type){
        case 'text':
            el = appMenuItemText(data);
            break;
        case 'line':
            el = appMenuItemLine();
            break;
        case 'function':
            el = appMenuItemFunction(data);
            break;
        case 'switch':
            el = appMenuItemSwitch(data);
            break;
        case 'information':
            el = appMenuItemInformation(data,menu);
            break;
        case 'window':
            el = appMenuWindowInformation(data,menu);
    }
    
    if(data.ref){
        data.ref(el);
    }

    return el;
    
}

function createAppMenu(app){

    let handle = document.createElement('div');
    handle.className = "app-menu-handle";

    let icon = document.createElement('img');
    icon.className = "app-menu-icon";
    icon.src = `${AppPath(app.id)+app.icon}`;

    handle.appendChild(icon);

	icon.addEventListener('mouseup',ev=>{
        if(ev.target != icon){return;}
		if(ev.button != 0){ return; }
        menu.classList.toggle('open');
        let autoClose = (ev)=>{
            if(!ev.path.includes(menu)){
                menu.classList.remove('open');
                window.removeEventListener('mousedown',autoClose);
            }
        }
        window.addEventListener('mousedown',autoClose);
    });
    
    let menu = document.createElement('div');
    menu.className = "app-menu-cont";

    if(app.menu){
        app.menu.forEach(item=>{
            menu.appendChild(getAppMenuItem(item,menu));
        });
    }

    menu.appendChild(appMenuItemClose(app,handle));

    handle.appendChild(menu);

    APPSBAR.appendChild(handle);
    
}

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

MENU.appendChild(MenuItem('Thème & Apparence',ICONS.THEME,THEMEWINDOW,'gpos-themes'));
MENU.appendChild(MenuItem('Bloc-note',ICONS.NOTEPAD,NOTEPAD,'gpos-notepad'));
MENU.appendChild(MenuItem('À propos',ICONS.INFO,ABOUT,'gpos-about'));

loadDesktop();

Boot();

return GPOS;

})();