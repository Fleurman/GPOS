var WidgetMinimize = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-min win-close";
    
    let restoreToIcon = ()=>{
        frame.dataset.mini = 'true';
        frame.dataset.max = 'false';
        frame.style.width = SIZE.ICONWIDTH+'px';
        frame.style.height = SIZE.ICONHEIGHT+'px';
        if(!frame.infos.inFolder){
            frame.style.top = frame.infos.iconTop;
            frame.style.left = frame.infos.iconLeft;
        }
    }

    Element.addEventListener("click",()=> {
        if(frame.dataset.mini != 'true'){

            restoreToIcon();

            frame.fireCustomEvent('close');

            frame.classList.add('trans');

            let time = SMARTPHONE&&frame.holder ? 0 : frame.infos.inFolder ? 100 : 300;

            setTimeout(function(){
                frame.classList.remove('trans');
                if(frame.infos.inFolder){
                    frame.infos.placeholder.insertAdjacentElement('beforebegin',frame);
                    frame.infos.placeholder.remove();
                }else if(frame.holder){
                    frame.holder.insertAdjacentElement('afterend',frame);
                    frame.holder.remove();
                }else{
                    frame.displace(frame.infos.folder);
                }
            },time);
        }
    });

    frame.appendChild(Element);
    
}
