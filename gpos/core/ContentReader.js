
function getItemPos(nb){
    let last = 1, col = 1;
    while(nb>last){
        col += 1;
        last = (col*(col+1))/2;
    }
    let row = (nb+(col%2==0?+1:-1))%col;
    return {col:col-1,row:row};
}

function putInTopLeft(el,index){
    let pos = getItemPos(index);
    el.style.left = ((pos.col-pos.row)*96)+'px';
    el.style.top = 35+(pos.row*96)+'px';
}
function putInTopRight(el,index){
    let pos = getItemPos(index);
    el.style.left = (window.innerWidth-100-((pos.col-pos.row)*96))+'px';
    el.style.top = 35+(pos.row*96)+'px';
}
function putInBottomLeft(el,index){
    let pos = getItemPos(index);
    el.style.left = ((pos.col-pos.row)*96)+'px';
    el.style.top = window.innerHeight-160-(pos.row*96)+'px';
}
function putInBottomRight(el,index){
    let pos = getItemPos(index);
    el.style.left = (window.innerWidth-100-((pos.col-pos.row)*96))+'px';
    el.style.top = window.innerHeight-160-(pos.row*96)+'px';
}

function createItem(data){
    let icon = undefined;
    switch(data.object){
        case 'article':
            icon = getIconPath(data.icon);
            return GPOS.newArticle(data.title,data.key,icon);
        case 'app':
            return GPOS.newApp(data.key);
        case 'folder':
            let items = [];
            data.items.forEach(item=>{
                items.push(createItem(item));
            });
            icon = getIconPath(data.icon);
            return GPOS.newFolder(data.title,items,icon);
        case 'image':
            return GPOS.newImage(data.title,data.source,data.backColor);
        case 'link':
            icon = getIconPath(data.icon);
            return GPOS.newLink(data.title,data.url,icon);
        default:
            return false;
    }
}

function loadDesktop(){
    getJson('/desktop.json',true).send().echo(json=>{
        let indexes = {['top-left']:1,['top-right' ]:1,['bottom-left' ]:1,['bottom-right' ]:1};
        json.forEach(data=>{
            let item = createItem(data);
            if(item){
                switch(data.position){
                    case 'top-right':
                        putInTopRight(item,indexes[data.position]);
                        break;
                    case 'bottom-left':
                        putInBottomLeft(item,indexes[data.position]);
                        break;
                    case 'bottom-right':
                        putInBottomRight(item,indexes[data.position]);
                        break;
                    case 'top-left':
                    default:
                        data.position = 'top-left';
                        putInTopLeft(item,indexes[data.position]);
                        break;
                }
                indexes[data.position]++;
            }
        });
    });
}

function getIconPath(str){
    if(!str){return undefined;}
    if(str[0] == '$'){
        return ICONS[str.substring(1)];
    }else{
        return str;
    }
}