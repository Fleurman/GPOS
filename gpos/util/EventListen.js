window.EventListen = function(self = this){
	self.events = {};

	self.addCustomEventListener = function(ev,fn){
		self.events[ev] = (self.events[ev] || []);
		self.events[ev].push(fn);
	};
	self.removeCustomEventListener = function(ev,fn){
		if(self.events[ev]!==undefined){
			let list = self.events[ev];
			for (let i = 0; i < list.length; i++) {
				const item = list[i];
				if(item==fn){
					list.splice(i,1);
					break;
				}
			}
		}
	};
	self.fireCustomEvent = function(ev,o){
		if(self.events[ev]){
			self.events[ev].forEach(fn=>{
				fn.call(this,o);
			})
		}
	};

};