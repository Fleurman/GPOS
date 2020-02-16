var WidgetResize = (frame)=>{
    
    let Element = document.createElement("div");
    
    Element.className = "win-resize";
    
    let startWidth,startHeight,startX,startY;

    let initResize = (e)=>{
        // e.stopPropagation();
        e.preventDefault();
        frame.fireCustomEvent('resize');
        setInFront(frame);
        closeSystemMenu();
        
        frame.dataset.notra = "true";
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(frame).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(frame).height, 10);
        
        window.addEventListener('mousemove', doResize, false);
        window.addEventListener('mouseup', stopResize, false);
    };
    let doResize = (e)=>{
        let nw = startWidth + MOUSE.X - startX;
        let nh = startHeight + MOUSE.Y - startY;

        if (nw > SIZE.WINDOW_MIN && nw < window.innerWidth-(PADDING.FULLSCREEN*2)){
            frame.style.width = nw + 'px';
            frame.infos.lastWidth = nw;
        }
        if (nh > SIZE.WINDOW_MIN && nh < window.innerHeight-SIZE.OSBAR-(PADDING.FULLSCREEN*2)){
            frame.style.height = nh + 'px';
            frame.infos.lastHeight = nh;
        }
        frame.fireCustomEvent('resizing');
    };
    let stopResize = (e)=>{
        frame.dataset.notra = "false";
        window.removeEventListener('mousemove', doResize, false);    
        window.removeEventListener('mouseup', stopResize, false);
        frame.fireCustomEvent('resized');
    };

    Element.addEventListener("mousedown",initResize);
    
    frame.appendChild(Element);

}

    