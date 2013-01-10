// Contains global site functions (mainly helpers)
// Translate any string using the global site translation
function translate(e){return translateHash[e]?translateHash[e]:e}jQuery.fn.log=function(e){return console.log("%s: %o",e,this),this};