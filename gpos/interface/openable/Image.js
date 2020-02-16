
function Image(title,url,backColor = 'black'){

    let self = new Openable(title,`<div class="image-container"><img src="${url}" alt="Image"></div>`,url);
    self.classList.add('image');

    WidgetBackColor(self);

    self.dataset.backColor = backColor;
    
    return self;
}

GPOS.newImage = (title,url,backColor)=>{
    return DESKTOP.appendChild(new Image(title,url,backColor));
}