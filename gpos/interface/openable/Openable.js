function Openable(title,content,icon){

    let self = new Frame(title,content);
    self.dataset.mini = "true";

    WidgetMinimize(self);
    WidgetMaximize(self);
    WidgetResize(self);

    self.classList.add("openable");

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
    
    self.setFolder = function(f,route){
        self.classList.add('in-folder');
        self.dataset.route = route;
        self.infos.route = route;
        self.infos.folder = f;
        self.infos.inFolder = true;
        self.Title.dataset.route = route;
    }
    self.displace = displace;
    
    self.placeholder = function(){
        let holder = document.createElement('div');
        holder.className = 'placeholder';
        holder.innerHTML = '<img src="'+icon+'">';
        holder.dataset.title = title;
        self.insertAdjacentElement('beforebegin',holder);
        self.infos.placeholder = holder;
    }

    let doubleClick = (e)=>{
        if(self.dataset.mini == 'true'){
            if(self.infos.inFolder){
                self.placeholder(self.infos.folder);
            }else{
                self.holder = document.createElement('meta');
                self.insertAdjacentElement('beforebegin',self.holder);
            }
            
            self.displace(POOL);
            self.infos.iconTop = self.style.top;
            self.infos.iconLeft = self.style.left;

            let rect = Rect(
                MOUSE.Y-30,
                MOUSE.X-30,
                self.infos.lastWidth ? self.infos.lastWidth :  SIZE.WINDOW,
                self.infos.lastHeight ? self.infos.lastHeight :  SIZE.WINDOW
            );

            rect = inBounds(rect);

            self.style.top = rect.top+'px';
            self.style.left = rect.left+'px';
            setTimeout(function(){
                self.dataset.mini = false;
                self.infos.mini = false;
                self.style.width = rect.width+'px';
                self.style.height = rect.height+'px';
                setInFront(self);
                
            },10);
        }
    }

    self.addCustomEventListener('doubleclick',doubleClick);

    self.Icon = document.createElement("div");
    self.Icon.className = "win-icon";
    self.Icon.innerHTML = '<img src="'+icon+'">';

    self.Title.insertAdjacentElement('beforebegin',self.Icon);

    return self;
}
