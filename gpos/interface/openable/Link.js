
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