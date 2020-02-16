
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