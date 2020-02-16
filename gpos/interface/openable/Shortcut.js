
function Shortcut(title,icon){

    let self = new Frame(title,"");
    self.dataset.mini = "true";

    self.classList.add("openable");

    self.infos = {
        title: title,
        iconTop: '',
        iconLeft: '',
        folder: DESKTOP,
        route:'',
        inFolder:false
    }
    
    self.setFolder = function(f,route){
        self.classList.add('in-folder');
        self.dataset.route = route;
        self.infos.route = route;
        self.infos.folder = f;
        self.infos.inFolder = true;
        self.Title.dataset.route = route;
    }
    self.displace = displace;

    self.Icon = document.createElement("div");
    self.Icon.className = "win-icon";
    self.Icon.innerHTML = '<img src="'+icon+'">';

    self.Title.insertAdjacentElement('beforebegin',self.Icon);

    return self;
}