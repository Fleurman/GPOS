
var ABOUT = (function(){

	let cont = document.createElement('div');
	cont.className = 'meno';

    loadMenoTo(cont,'/articles/about.txt');

    return cont;
    
})();