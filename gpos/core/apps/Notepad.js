
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