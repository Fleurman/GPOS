var WidgetMaximize = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-max";
    
    let restoreToRect = ()=>{
        frame.dataset.max = 'false';
        let rect = frame.infos.oldRect;
        frame.style.top = rect[0];
        frame.style.left = rect[1];
        frame.style.width = rect[2];
        frame.style.height = rect[3];
    }
    let setToMax = ()=>{
        frame.dataset.max = 'true';
        frame.infos.oldRect = [frame.style.top,frame.style.left,frame.style.width,frame.style.height]
        frame.style.top = SIZE.OSBAR+'px';
        frame.style.left =  '0px';
        frame.style.width = (window.innerWidth-2)+'px';
        frame.style.height = (window.innerHeight-2-SIZE.OSBAR)+'px';
    }

    Element.addEventListener("click",()=> {
        if(frame.dataset.mini != 'true'){
            if(frame.dataset.max == 'true'){
                frame.fireCustomEvent('unmaximize');
                restoreToRect();
                frame.fireCustomEvent('unmaximized');
            }else{
                frame.fireCustomEvent('maximize');
                setToMax();
                frame.fireCustomEvent('maximized');
            }
        }
    });

    frame.appendChild(Element);
    
}