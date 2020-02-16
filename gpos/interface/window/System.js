function System(title,content,id){
    
    let self = new Frame(title,"");

    WidgetClose(self);
    WidgetMaximize(self);
	WidgetResize(self);
	
    self.id = id;
    self.classList.add('system','openable');
    self.dataset.mini = 'false';

	self.Content.appendChild(content);

    let close = ()=>{
		self.dataset.closed = 'true';
		self.style.pointerEvents = 'none';
		self.style.opacity = 0;
		self.style.width = '0px';
		self.style.height = '0px';
		self.style.top = '0px';
		self.style.left = '0px';
	}
	self.close = close;
	self.close = close;
	
    let restore = ()=>{
		self.dataset.closed = 'false';
		self.style.pointerEvents = 'all';
		self.style.opacity = 1;
		self.style.width = (self.infos.lastWidth || SIZE.WINDOW)+'px';
		self.style.height = (self.infos.lastHeight || SIZE.WINDOW)+'px';
		self.style.top = (self.infos.lastTop || '40')+'px';
		self.style.left = (self.infos.lastLeft || '40')+'px';
	}
	self.restore = restore;

	self.addCustomEventListener('close',close);

    return self;

}

GPOS.newSystem = (title,content,id)=>{
	let sys = new System(title,content,id);
	
	sys.close();

	POOL.appendChild(sys);

	setTimeout(()=>{
		sys.restore();
	},10)
	
	return sys;
}