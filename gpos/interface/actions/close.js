var WidgetClose = (frame)=>{

    let Element = document.createElement("div");

    Element.className = "win-min win-close";
    
    Element.addEventListener("click",()=> {

            frame.dataset.max = 'false';

            frame.fireCustomEvent('close');

            frame.style.opacity = 0;

            frame.classList.add('trans');

            setTimeout(function(){
                frame.classList.remove('trans');
                frame.fireCustomEvent('closed');
            },500);

    });

    frame.appendChild(Element);
    
}