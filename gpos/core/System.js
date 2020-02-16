
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