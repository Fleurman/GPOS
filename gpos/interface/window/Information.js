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