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