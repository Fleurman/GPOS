
function Article(title,name,icon=ICONS.ARTICLE){

    let self = new Openable(title,LoadingIndicator(),icon);
	self.classList.add('article');

	self.Content.classList.add('meno');
	
	self.addCustomEventListener('doubleclick',()=>{
		loadMenoTo(self.Content,ArticlePath(name));
	});

    return self;
}
function ArticlePath(key){
	return "/articles/"+key+".txt";
}

GPOS.newArticle = (title,key,icon)=>{
    return DESKTOP.appendChild(new Article(title,key,icon));
}