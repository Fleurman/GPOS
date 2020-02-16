const Store = (storage,name)=>{

	let o = {};
	let cache = {};

	o.read = function(key){
		if(cache[key]){
			return cache[key];
		}
		try {
			let value = storage.getItem('M_'+key);
			if(value){
				return value;
			}
		} catch (err) {
			console.warn(`ERROR WHILE READING ${name} [${key}]`,err);
		}
		return false;
	}
	o.get = o.read;
	
	o.write = function(key,value){
		try {
			storage.setItem('M_'+key,value);
			cache[key] = value;
		} catch (err) {
			console.warn(`ERROR WHILE WRITING IN ${name} [${key} = ${value}]`,err);
		}
	}

	o.remove = function(key){
		try {
			storage.removeItem('M_'+key);
			cache[key] = undefined;
		} catch (err) {
			console.warn(`ERROR WHILE REMOVING ${name} ITEM [${key}]`,err);
		}
	}

	return o;

};

var MEMORY = Store(localStorage,'MEMORY');
var SESSION = Store(sessionStorage,'SESSION');