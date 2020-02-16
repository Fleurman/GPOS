

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