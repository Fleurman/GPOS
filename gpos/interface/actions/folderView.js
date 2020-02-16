var WidgetFolderView = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-folder-view";
            
    Element.addEventListener("click",()=> {
        if(frame.dataset.mini != 'true'){
            frame.fireCustomEvent('viewchange');
            if(frame.dataset.view == 'list'){
                frame.dataset.view = "icons";
            }else{
                frame.dataset.view = "list";
            }
            frame.fireCustomEvent('viewchanged');
        }
    });

    frame.appendChild(Element);
    
}