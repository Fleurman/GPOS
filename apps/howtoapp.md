	
<div>style="width:230px;margin-right:30px;float:left;"
    <- Table des matières
    01 >La Structure<#app-structure
    >02 >Le fichier .json<#app-json
    --- >Title<#app-json-title
    --- >Icone<#app-json-icon
    --- >Multple<#app-json-multiple
    --- >Devices<#app-json-devices
    >03 >L'objet App<#app-object
    --- >ID<#app-object-id
    --- >Menu<#app-object-menu
    --- >CSS<#app-object-css
    --- >close() & start()<#app-object-fn
    --- >AppRegistery<#app-object-registery
    04 >À venir<#app-future
    05 >Démo<#app-demo
<>

-
: Développer une App pour le GPOS

Une application GPOS consiste en un dossier contenant des ressources et d'une fonction qui renvoie <<un élément ;HTML .

-
-
-
<div>id="app-structure"
:: La Structure
---lightgrey
<>

Une application est une function appelée lorsqu'un utilisateur ouvre son icone.
Si l'application retourne un élément HTML, il sera ajouté au bureau.

Chaque application doit avoir un <<identifiant_unique qui sert de nom de dossier.

Le dossier d'une application doit nécessairement contenir:
<<un_fichier_;.json
<<un_fichier_;.js
<<une_icone


-
<div>id="app-json"
:: Le fichier ;.json
---lightgrey
<>

Le fichier ;.json d'une application est chargé lors de la création d'une icone d'application.


<div>id="app-json-title"
::: Title
---lightgrey-transparent
<>
Le paramètre ;"title" contient le nom de l'Application

<div>id="app-json-icon"
::: Icone
---lightgrey-transparent
<>
Le paramètre ;"icon" pointe vers l'icone de l'Application.
Soit une <<url_absolue soit une <<url_relative_au_dossier_de_l'Application

Si le paramètre ;"icon" n'est pas fourni, GPOS cherchera à utiliser le fichier ;"icon.png" situé à la source du dossier de l'Application

<div>id="app-json-multiple"
::: Multiple
---lightgrey-transparent
<>
Le paramètre ;"multiple" permet de limiter le nombre d'instances simultanées que l'utilisateur peut ouvrir.

La valeur peut être: 
<<un_nombre: la quantité d'instances simultanées possibles
<<true: l'application peut être lancées un nombre infini de fois en même temps 
<<false: l'application ne peut être lancée plus d'une fois en même temps

<div>id="app-json-devices"
::: Devices
---lightgrey-transparent
<>
Le paramètre ;"devices" permet de limiter l'accès à l'application à certains appareils

La valeur est un tableau pouvant contenir une ou plusieurs de ces trois valeurs:
;"desktop", ;"tablet", ;"mobile"

-
<div>id="app-object"
:: L'objet App
---lightgrey
<>

-
<div>id="app-object-id"
::: ID
---lightgrey-transparent
<>

Lors de son appel, la fonction de l'Application reçoit comme paramètre un identifiant unique.
Cet identifiant, permet de différencier les instances de l'Application.

À chaque nouvel appel, l'identifiant s'incrémente.

-
<div>id="app-object-menu"
::: Menu
---lightgrey-transparent
<>

Toutes applications en cours d'utilisation affichent une icone et un menu dans l'interface GPOS.

L'option <<"Quitter" est par défaut présente dans un menu d'Application.

Pour créer ses propres options dans le menu, l'object retourné par la fonction doit contenir un champ ;"menu".
Ce champ est un tableau d'objets contenant chacun un champ ;"type" qui défini la nature de l'option.

Les types possibles et leurs champs sont:

- ;"text"
^ Un simple texte.
^ - <<"label": Le texte à afficher
^ &nbsp;
- ;"line"
^ Une ligne de séparation horizontale.
^ &nbsp;
- ;"function" 
^ Une fonction à exécuter.
^ - <<"label": Le texte à afficher
^ - <<"fonction": La fonction à éxécuter
^ &nbsp;
- ;"switch"
^ Un champ qui permet de d'osciller entre plusieurs valeurs
^ - <<"label": Le texte à afficher
^ - <<"value": La valeur initiale
^ - <<"fonction": La fonction à éxécuter. 
^ &emsp;Cette fonction doit retourner la prochaine valeur à afficher.
^ &emsp;Si la valeur est ;true ou ;false une icone de case cochée ou vide est automatiquement affichée.
^ &nbsp;
- ;"information" 
^ Une fenêtre d'information.
^ - <<"label": Le texte à afficher
^ - <<"title": Le title de la fenêtre
^ - <<"content": Le contenu ;HTML de la fenêtre sous forme de texte
^ &nbsp;
- ;"window" 
^ Une fenêtre.
^ - <<"label": Le texte à afficher
^ - <<"title": Le title de la fenêtre
^ - <<"content": Un élément ;HTML qui sera le contenu de la fenêtre

<<Le_champ_facultatif_;"ref"_est_disponible_pour_chaque_type_d'option:
Il s'agit d'une fonction appelée lors de la création de l'option et qui a comme paramètre l'élément ;HTML de l'option.


-
<div>id="app-object-css"
:::: CSS
---lightgrey-transparent
<>

Si l'application retourne un champ ;style son contenu sera ajouté dans un élément ;<style> dans l'élément ;<head> de la page lors du lancement de l'application.
Les styles ne sont inclus qu'une fois même si plusieurs instances de l'application sont ouvertes et sont supprimés de la page quand l'application est fermée.

-
<div>id="app-object-fn"
:::: close() & start()
---lightgrey-transparent
<>

La fonction ;start() est appelée juste après que l'élément de l'application soit intégré au GPOS.

Par défaut, lorsque l'utilisateur quitte l'application, l'élément et le menu de l'application sont effacés en fondu puis supprimé de la page ^(en_400_millisecondes).

Si une fonction ;close(default) est définie, elle est appelée lors de la fermeture de l'application et remplace le comportement par défaut.
Le paramètre ;default est un callback de la fonction de fermeture par défaut.

-
<div>id="app-object-registery"
:::: AppRegistery
---lightgrey-transparent
<>
Pour permettre à une application d'être utilisée il faut l'enregistrer dans le ;AppRegistery du GPOS.

;;js;;
; GPOS.registerApp( "identifiant" , AppFunction );
;;;;

L'identifiant doit correspondre au nom du dossier source de l'application.

-
<div>id="app-future"
:: À venir
---lightgrey
<>
-&nbsp;Catalogue d'applications
-&nbsp;Type d'option pour menu d'application: Slider
-&nbsp;Loader lors du chargement d'applications

-
-

<div>style="padding:20px;border:2px solid whitesmoke;background-color:rgb(253,253,253)" id="app-demo"
:: App Démo: _Torche
-
<"Structure">white
- torchlight/
-- app.json
-- app.js
-- icon.png

<".json">
;;json;;
; {
&#8199;"title":&#8199;"Torche",
&#8199;"multiple":&#8199;false,
&#8199;"devices":&#8199;&#91; "desktop" ],
}
;;;;

<:"Code">
<code>
;;js;;
function TorchLightApp(id){
&nbsp;
&#8199;var App = {};
&#8199;
&#8199;var Element = document.createElement("div");
&nbsp;
&#8199;function update(){
&#8199;&#8199;Element.style.backgroundImage = `radial-gradient(circle at ${MOUSE.X}px ${MOUSE.Y}px,transparent ${powers&#91;power]&#91;1]}, #000)`;
&#8199;};
&#8199;function enter(){
&#8199;&#8199;Element.style.backgroundColor = 'transparent';
&#8199;};
&#8199;function leave(){
&#8199;&#8199;Element.style.backgroundColor = '#000';
&#8199;};
&#8199;
&#8199;let power = 0;
&#8199;let powers = &#91;&#91;"high",''],&#91;'medium',',rgba(0,0,0,0.8)'],&#91;'low',',#000'],&#91;'minimum',',#000,#000']];
&nbsp;
&#8199;function togglePower(){
&#8199;&#8199;power++;
&#8199;&#8199;if(power>powers.length-1){
&#8199;&#8199;&#8199;power = 0;
&#8199;&#8199;}
&#8199;&#8199;update();
&#8199;&#8199;return powers&#91;power]&#91;0];
&#8199;}
;;;;
;;css;;
&#8199;App.style = 
&#8199;&#8199;`div[data-appid='torchlight'] {
&#8199;&#8199;&#8199;&#8199;position: fixed;
&#8199;&#8199;&#8199;&#8199;z-index: 9999999;
&#8199;&#8199;&#8199;&#8199;top: 0;
&#8199;&#8199;&#8199;&#8199;left: 0;
&#8199;&#8199;&#8199;&#8199;right: 0;
&#8199;&#8199;&#8199;&#8199;bottom: 0;
&#8199;&#8199;&#8199;&#8199;pointer-events: none;
&#8199;&#8199;&#8199;&#8199;transition:opacity 0.4s, background-color 0.4s;
&#8199;&#8199;&#8199;&#8199;opacity:0;
&#8199;&#8199;}`;
;;js;;
&#8199;App.menu = &#91;
&#8199;&#8199;{
&#8199;&#8199;&#8199;"type":"switch",
&#8199;&#8199;&#8199;"label":"Puissance",
&#8199;&#8199;&#8199;"function":togglePower,
&#8199;&#8199;&#8199;"value":powers&#91;power]&#91;0]
&#8199;&#8199;}
&#8199;];
&nbsp;
&#8199;App.start = function(){
&#8199;&#8199;window.addEventListener("mousemove", update);
&#8199;&#8199;document.addEventListener("mouseenter", enter);
&#8199;&#8199;document.addEventListener("mouseleave", leave);
&#8199;&#8199;update();
&#8199;&#8199;setTimeout(()=>{
&#8199;&#8199;&#8199;Element.style.opacity = '1';
&#8199;&#8199;},100);
&#8199;}
&nbsp;
&#8199;App.close = function(def){
&#8199;&#8199;window.removeEventListener("mousemove", update);
&#8199;&#8199;window.removeEventListener("mouseenter", enter);
&#8199;&#8199;window.removeEventListener("mouseleave", leave);
&#8199;&#8199;def();
&#8199;}
&nbsp;
&#8199;App.element = Element;
&nbsp;
&#8199;return App;
}
GPOS.registerApp("torchlight",TorchLightApp);
;;;;
<>
<>

