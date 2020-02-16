
function App(id){

  let data = loadAppData(id);
  data.id = id;

	let path = "/apps/"+id+"/";

  let self = new Shortcut(data.title,path+data.icon);
  self.classList.add('app');

  if(data.devices){
    if(!data.devices.includes('desktop')){
      self.classList.add('no-desktop');
    }
    if(!data.devices.includes('tablet')){
      self.classList.add('no-tablet');
    }
    if(!data.devices.includes('mobile')){
      self.classList.add('no-mobile');
    }
  }

  let doubleclick = ()=>{
    loadApp(data);
  };

  self.addCustomEventListener('doubleclick',doubleclick);
  
  return self;

}

GPOS.newApp = (id)=>{
  return DESKTOP.appendChild(new App(id));
}