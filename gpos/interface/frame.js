
function Frame(title="",content=""){

    let self = document.createElement("div");
    self.className = "frame";

    EventListen(self);
    
    let focus = function(){
        if(POOL.dataset.quickview == 'true'){
            POOL.dataset.quickview = 'false';
        }
        setInFront(self);
        closeSystemMenu();
        self.fireCustomEvent('focus');
    };
    self.addEventListener("mousedown",focus);

    self.infos = {
        title: title,
        mini: false,
        lastWidth: SIZE.WINDOW,
        lastHeight: SIZE.WINDOW,
        iconTop: '',
        iconLeft: '',
        folder: DESKTOP,
        route:'',
        inFolder:false
    }
    
    self.Title = document.createElement("div");
    self.Title.className = "win-title";
    self.Title.innerHTML = title;
    self.Title.dataset.title = title;

    let doubleClick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.fireCustomEvent('doubleclick');
    };
    let downTrigger = false;

    let mouseUp = function() {
        self.dataset.notra = self.dataset.dragging = self.dataset.floating = 'false';
        
        downTrigger = false;
        window.removeEventListener('mousemove', mouseMove, false);
        window.removeEventListener('mouseup', mouseUp, false);
        self.fireCustomEvent('moved');
    };
    let mouseMove = function(e) {
        e.preventDefault();
        
        self.dataset.dragging = "true";

        if (e.clientX < 0 || e.clientX > window.innerWidth || e.clientY < 0 || e.clientY > window.innerHeight)
            return;
        
        var nw = self.startLeft + e.clientX - self.startMX;
        var nh = self.startTop + e.clientY - self.startMY;
        
        if(nw >= PADDING.FULLSCREEN && (nw+SIZE.ICONWIDTH) <= window.innerWidth-(PADDING.FULLSCREEN*2)){
            self.style.left = (nw/window.innerWidth)*100 + "%";
            self.infos.lastLeft = nw;
        }
        if(nh >= (PADDING.FULLSCREEN+SIZE.OSBAR) && (nh+SIZE.ICONHEIGHT) <= window.innerHeight-(PADDING.FULLSCREEN*2)){
            self.style.top = (nh/window.innerHeight)*100 + "%";
            self.infos.lastTop = nh;
        }
        
        self.fireCustomEvent('moving');
    };

    let hasFirstClicked = false;
    let clickTimer;
    
    let mouseDown = (e) => {
        focus();
        if(SMARTPHONE){
            clearTimeout(clickTimer);
            hasFirstClicked = false;
            doubleClick(e);
            return;
        }
        if (!hasFirstClicked) {
            if(self.dataset.max != 'true'){
                initMove(e);
            }
            clickTimer = setTimeout(function() {
                hasFirstClicked = false;
            }, 400);
            hasFirstClicked = true;
        } else if (hasFirstClicked) {
            clearTimeout(clickTimer);
            hasFirstClicked = false;
            doubleClick(e);
        }
    }
    self.Title.addEventListener("mousedown", mouseDown);
    
    let initMove = function(e){
        e.preventDefault();
        downTrigger = true;
        self.dataset.notra = "true";
        
        self.startMX = e.clientX;
        self.startMY = e.clientY;
        self.startLeft = parseInt(document.defaultView.getComputedStyle(self).left, 0);
        self.startTop = parseInt(document.defaultView.getComputedStyle(self).top, 0);
        
        var leave = function(){
            downTrigger=false;
            self.Title.removeEventListener('mouseout',leave);
        };
        
        var fn = function(){
            if(downTrigger == true){
                self.dataset.floating = "true";
                self.Title.removeEventListener('mouseout',leave);
                window.addEventListener('mousemove', mouseMove, false);
            }
            downTrigger=false;
        };
        if(self.dataset.mini == 'true'){
            if(!self.classList.contains('in-folder')){
                setTimeout(fn,200);
            }
        }else{
            window.addEventListener('mousemove', mouseMove, false);
            self.Title.addEventListener('mouseout',leave, false);
        }
        window.addEventListener('mouseup', mouseUp, false);
    };
    
    self.Content = document.createElement("div");
    self.Content.className = "win-content";
    self.Content.innerHTML = content;

    self.appendChild(self.Content);
    self.appendChild(self.Title);
    
    return self;
}

document.addEventListener('keydown',ev=>{
    if(ev.ctrlKey && ev.code == 'KeyA'){
        ev.preventDefault();
        let active = document.querySelector('#pool > .openable.active');
        if(active){
            let content = active.querySelector('.win-content:first-of-type');
            let selection = document.getSelection();
            selection.selectAllChildren(content);
        }
    }
});