function TheWatcherApp(id){

    var App = {};
    
    App.autoRetract = true;
    App.left = window.innerWidth-100;
    App.top = window.innerHeight-64;
    
    var Head = document.createElement("div");
    Head.className = "the-watcher-head";

    Head.style.left = App.left+'px';
    Head.style.top = App.top+'px';
    
    function launchRetract(){
        let time = 0.1+((1-(App.top/window.innerHeight))*3);
        Head.style.transitionDuration = time+'s';
        Head.style.top = window.innerHeight-64+'px';
    }

    function mouseUp(e) {
        Head.dataset.dragging = false;
        if(App.autoRetract == true){
            launchRetract();
        }
        window.removeEventListener('mousemove', mouseMove, false);
        window.removeEventListener('mouseup', mouseUp, false);
    };
    
    function mouseMove(e) {
        e.preventDefault();
        
        Head.dataset.dragging = true;
        
        if (e.clientX < 0 || e.clientX > window.innerWidth || e.clientY < 0 || e.clientY > window.innerHeight)
            return;
        
        var nw = App.startLeft + e.clientX - App.startMX;
        var nh = App.startTop + e.clientY - App.startMY;
        
        if(nw >= 50 && nw <= window.innerWidth-100)
            Head.style.left = nw + "px";
            App.left = nw;
        if(nh >= 50 && nh <= window.innerHeight-64)
            Head.style.top = nh + "px";
            App.top = nh;
        
    };
    
    Head.initMove = function(e){
        e.preventDefault();
        App.startMX = e.clientX;
        App.startMY = e.clientY;
        App.startLeft = parseInt(document.defaultView.getComputedStyle(Head).left, 0);
        App.startTop = parseInt(document.defaultView.getComputedStyle(Head).top, 0);
        window.addEventListener('mousemove', mouseMove, false);
        window.addEventListener('mouseup', mouseUp, false);
    };

    Head.addEventListener("mousedown", Head.initMove);

    function watch(){
        
        let filename = '';

        if(MOUSE.Y>App.top+48){
            filename = 's';
        }else if(MOUSE.Y<App.top){
            filename = 'n';
        }

        if(MOUSE.X>App.left+44){
            filename += 'e';
        }else if(MOUSE.X<App.left+4){
            filename += 'w';
        }

        if(filename == ''){
            filename = 'f';
        }

        Head.style.backgroundImage = "url('/apps/the watcher/img/"+filename+".png')";

    };

    window.addEventListener("mousemove", watch);
    
    let loader = document.createElement('span');
    ['f','f-drag','n','ne','e','se','s','sw','w','nw','body','body-drag'].forEach(name=>{
        let img = document.createElement('img');
        img.style = "width:1px;height:1px;position:fixed;top:-10px;left:-10px;";
        img.src = "/apps/the watcher/img/"+name+".png";
        loader.appendChild(img);
    });
    Head.appendChild(loader);

    function toggleAutoRetract(){
        App.autoRetract = !App.autoRetract;
        if(App.autoRetract == true){
            launchRetract();
        }
        return App.autoRetract;
    }

    let watchInterval = undefined;
    let retractUpdate = function(){
        App.top = parseInt(document.defaultView.getComputedStyle(Head).top, 0);
        App.left = parseInt(document.defaultView.getComputedStyle(Head).left, 0);
        watch();
        if(App.autoRetract == false){
            console.log('SWITCH',App.top+'px');
            Head.style.top = App.top+'px';
            clearInterval(watchInterval);
        }
    }

    Head.addEventListener("transitionstart", ()=>{
        clearInterval(watchInterval);
        watchInterval = setInterval(retractUpdate,100);
    }, true);
    Head.addEventListener("transitionend", ()=>{
        clearInterval(watchInterval);
    }, true);

    /* App.close = function(){
        customStyle.remove();
    }
    let customStyle = document.createElement('style');
    customStyle.dataset.instance = id;
    customStyle.dataset.app = 'the watcher';
    App.start = function(){
        document.head.appendChild(customStyle);
    }

    let colors = ['jaune','rouge','vert'];
    let currentColor = 0;
    App.switchColor = ()=>{
        currentColor++;
        if(currentColor>=colors.length){currentColor = 0;}
        customStyle.innerHTML = `/* COULEUR OF APP ${id}: ${colors[currentColor]} /`
        return colors[currentColor];
    } */
    
    App.style = `.the-watcher-head {
        position: fixed;
        z-index: 99999;
        background-image: url("/apps/the watcher/img/f.png");
        height: 48px;
        width: 48px;
        cursor: grab;
        transition-property: none;
    }
    
    .the-watcher-head:active {
        cursor: grabbing;
    }
    
    .the-watcher-head::before {
        position: absolute;
        pointer-events: none;
        content: '';
        background-image: repeating-linear-gradient(0deg, transparent 0px,transparent 10px, rgba(0,0,0,0.2) 15px);
        background-color: #eee;
        border-top: 1px solid #000;
        border-left: 1px solid #000;
        border-right: 1px solid #000;
        box-sizing: border-box;
        top: 49px;
        left: 16px;
        bottom: 0;
        height: 2000px;
        width: 15px;
    }
    
    .the-watcher-head[data-dragging='false'] {
        transition-property: top;
        transition-duration: 4s;
        transition-timing-function: cubic-bezier(.41,.79,.94,1.05);
    }
    .the-watcher-head[data-dragging='true'] {
        background-image: url("/apps/the watcher/img/f-drag.png") !important;
    }
    
    .the-watcher-head::after {
        position: fixed;
        pointer-events: none;
        content: '';
        background-image:url("/apps/the watcher/img/body.png");
        background-position:center;
        bottom: 0;
        margin-left: -26px;
        height: 26px;
        width: 100px;
    }
    .the-watcher-head[data-dragging='true']::after {
        background-image:url("/apps/the watcher/img/body-drag.png") !important;
    }`;

    App.menu = [
        {
            "type":"switch",
            "label":"Auto-rétraction",
            "function":toggleAutoRetract,
            "value":App.autoRetract
        },
        /* {
            "type":"switch",
            "label":"Couleur",
            "function":App.switchColor,
            "value":"jaune"
        }, */
        {
            "type":"information",
            "label":"À Propos",
            "title":"À Propos de l'App \"The Watcher\"",
            "content":"Original art by Technopeasant<br><a target='_blank' href='https://opengameart.org/content/foreshortening-female-head'>https://opengameart.org/content/foreshortening-female-head</a><br>Edits & dev by Fleurman - 2020"
        }
    ];

    App.element = Head;

    return App;
}
GPOS.registerApp("the watcher",TheWatcherApp);