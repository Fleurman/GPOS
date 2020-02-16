
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
