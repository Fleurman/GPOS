var WidgetBackColor = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-back-color";
    
    Element.addEventListener("click",()=> {
        if(frame.dataset.mini != 'true'){
            frame.fireCustomEvent('backcolorchange');
            if(frame.dataset.backColor == 'white'){
                frame.dataset.backColor = "black";
            }else{
                frame.dataset.backColor = "white";
            }
            frame.fireCustomEvent('backcolorchanged');
        }
    });

    frame.appendChild(Element);
    
}