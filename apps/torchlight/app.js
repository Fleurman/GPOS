const TorcheLight = (function(){
    let power = 0;
    EventListen(this);
    Object.defineProperty(this,'power',{
        get(){
            return power;
        }
    });
    this.addCustomEventListener('changepower',(pow)=>{
        power = pow;
    });
    return this;
})();
function TorchLightApp(id){

    var App = {};
    
    var Element = document.createElement("div");

    function update(){
        Element.style.backgroundImage = `radial-gradient(circle at ${MOUSE.X}px ${MOUSE.Y}px,transparent ${powers[power][1]}, #000)`;
    };
    function enter(){
        Element.style.backgroundColor = 'transparent';
    };
    function leave(){
        Element.style.backgroundColor = '#000';
    };
    
    let power = 0;
    let powers = [["high",''],['medium',',rgba(0,0,0,0.8)'],['low',',#000'],['minimum',',#000,#000']];

    function togglePower(){
        power++;
        if(power>powers.length-1){
            power = 0;
        }
        update();
        TorcheLight.fireCustomEvent('changepower',power);
        return powers[power][0];
    }
    
    App.style = `div[data-appid='torchlight'] {
        position: fixed;
        z-index: 9999999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        transition:opacity 0.4s, background-color 0.4s;
        opacity:0;
    }`;

    App.menu = [
        {
            "type":"switch",
            "label":"Puissance",
            "function":togglePower,
            "value":powers[power][0]
        }
    ];

    App.start = function(){
        window.addEventListener("mousemove", update);
        document.addEventListener("mouseenter", enter);
        document.addEventListener("mouseleave", leave);
        update();
        setTimeout(()=>{
            Element.style.opacity = '1';
        },100);
    }

    App.close = function(def){
        window.removeEventListener("mousemove", update);
        window.removeEventListener("mouseenter", enter);
        window.removeEventListener("mouseleave", leave);
        TorcheLight.fireCustomEvent('close');
        def();
    }

    App.element = Element;

    TorcheLight.fireCustomEvent('open');

    return App;
}
GPOS.registerApp("torchlight",TorchLightApp);