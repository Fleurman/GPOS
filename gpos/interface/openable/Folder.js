
function Folder(title,items,icon=ICONS.FOLDER){

    let self = new Openable(title,"",icon);
    self.classList.add('folder');

    WidgetFolderView(self);

    self.add = function(el){self.Content.appendChild(el)};
    
    items.forEach(item=>{
        self.add(item);
        item.setFolder(self.Content,title+'/');
    })

    return self;
}

GPOS.newFolder = (title,content,icon)=>{
    return DESKTOP.appendChild(new Folder(title,content,icon));
}