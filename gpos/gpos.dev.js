"use strict"

var GPOS = {};

var importScript = function(url){
    var req = new XMLHttpRequest();
    req.onload = function(e){
        if(this.responseText.length>0){
            eval.call(window,this.responseText);
        }else{
            throw new Error("Impossible to load script "+ url);
        }
    };
    req.onerror = function(e){
        throw new Error("Impossible to load script "+ url);
    }
    req.open('GET', url, false);
    req.send(null);
};

importScript("/gpos/util/lib.js");
importScript("/gpos/core/lib.js");
importScript("/gpos/display/lib.js");
importScript("/gpos/interface/lib.js");
importScript("/gpos/app/lib.js");

MENU.appendChild(MenuItem('Thème & Apparence',ICONS.THEME,THEMEWINDOW,'gpos-themes'));
MENU.appendChild(MenuItem('Bloc-note',ICONS.NOTEPAD,NOTEPAD,'gpos-notepad'));
MENU.appendChild(MenuItem('À propos',ICONS.INFO,ABOUT,'gpos-about'));

loadDesktop();

Boot();

// return GPOS;