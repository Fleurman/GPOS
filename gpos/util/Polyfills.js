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
	