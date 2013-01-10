/*!
 * jQuery corner plugin: simple corner rounding
 * Examples and documentation at: http://jquery.malsup.com/corner/
 * version 1.95 (02/26/2009)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
/**
 *  corner() takes a single string argument:  $('#myDiv').corner("effect corners width")
 *
 *  effect:  name of the effect to apply, such as round, bevel, notch, bite, etc (default is round). 
 *  corners: one or more of: top, bottom, tr, tl, br, or bl. 
 *           by default, all four corners are adorned. 
 *  width:   width of the effect; in the case of rounded corners this is the radius. 
 *           specify this value using the px suffix such as 10px (and yes, it must be pixels).
 *
 * @name corner
 * @type jQuery
 * @param String options Options which control the corner style
 * @cat Plugins/Corner
 * @return jQuery
 * @author Dave Methvin (http://methvin.com/jquery/jq-corner.html)
 * @author Mike Alsup   (http://jquery.malsup.com/corner/)
 */
(function(e){function n(t,n){return parseInt(e.css(t,n))||0}function r(e){var e=parseInt(e).toString(16);return e.length<2?"0"+e:e}function i(t){for(;t&&t.nodeName.toLowerCase()!="html";t=t.parentNode){var n=e.css(t,"backgroundColor");if(n.indexOf("rgb")>=0){if(e.browser.safari&&n=="rgba(0, 0, 0, 0)")continue;var i=n.match(/\d+/g);return"#"+r(i[0])+r(i[1])+r(i[2])}if(n&&n!="transparent")return n}return"#ffffff"}function s(e,t,n){switch(e){case"round":return Math.round(n*(1-Math.cos(Math.asin(t/n))));case"cool":return Math.round(n*(1+Math.cos(Math.asin(t/n))));case"sharp":return Math.round(n*(1-Math.cos(Math.acos(t/n))));case"bite":return Math.round(n*Math.cos(Math.asin((n-t-1)/n)));case"slide":return Math.round(n*Math.atan2(t,n/t));case"jut":return Math.round(n*Math.atan2(n,n-t-1));case"curl":return Math.round(n*Math.atan(t));case"tear":return Math.round(n*Math.cos(t));case"wicked":return Math.round(n*Math.tan(t));case"long":return Math.round(n*Math.sqrt(t));case"sculpt":return Math.round(n*Math.log(n-t-1,n));case"dog":return t&1?t+1:n;case"dog2":return t&2?t+1:n;case"dog3":return t&3?t+1:n;case"fray":return t%2*n;case"notch":return n;case"bevel":return t+1}}var t=function(){var e=document.createElement("div");try{e.style.setExpression("width","0+0")}catch(t){return!1}return!0}();e.fn.corner=function(r){if(this.length==0){if(!e.isReady&&this.selector){var o=this.selector,u=this.context;e(function(){e(o,u).corner(r)})}return this}r=(r||"").toLowerCase();var a=/keep/.test(r),f=(r.match(/cc:(#[0-9a-f]+)/)||[])[1],l=(r.match(/sc:(#[0-9a-f]+)/)||[])[1],c=parseInt((r.match(/(\d+)px/)||[])[1])||10,h=/round|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dog/,p=(r.match(h)||["round"])[0],d={T:0,B:1},v={TL:/top|tl/.test(r),TR:/top|tr/.test(r),BL:/bottom|bl/.test(r),BR:/bottom|br/.test(r)};!v.TL&&!v.TR&&!v.BL&&!v.BR&&(v={TL:1,TR:1,BL:1,BR:1});var m=document.createElement("div");return m.style.overflow="hidden",m.style.height="1px",m.style.backgroundColor=l||"transparent",m.style.borderStyle="solid",this.each(function(r){var o={T:parseInt(e.css(this,"paddingTop"))||0,R:parseInt(e.css(this,"paddingRight"))||0,B:parseInt(e.css(this,"paddingBottom"))||0,L:parseInt(e.css(this,"paddingLeft"))||0};typeof this.style.zoom!=undefined&&(this.style.zoom=1),a||(this.style.border="none"),m.style.borderColor=f||i(this.parentNode);var u=e.curCSS(this,"height");for(var l in d){var h=d[l];if(h&&(v.BL||v.BR)||!h&&(v.TL||v.TR)){m.style.borderStyle="none "+(v[l+"R"]?"solid":"none")+" none "+(v[l+"L"]?"solid":"none");var g=document.createElement("div");e(g).addClass("jquery-corner");var y=g.style;h?this.appendChild(g):this.insertBefore(g,this.firstChild);if(h&&u!="auto")e.css(this,"position")=="static"&&(this.style.position="relative"),y.position="absolute",y.bottom=y.left=y.padding=y.margin="0",t?y.setExpression("width","this.parentNode.offsetWidth"):y.width="100%";else if(!h&&e.browser.msie){e.css(this,"position")=="static"&&(this.style.position="relative"),y.position="absolute",y.top=y.left=y.right=y.padding=y.margin="0";if(t){var b=n(this,"borderLeftWidth")+n(this,"borderRightWidth");y.setExpression("width","this.parentNode.offsetWidth - "+b+'+ "px"')}else y.width="100%"}else y.margin=h?o.B-c+"px -"+o.R+"px -"+o.B+"px -"+o.L+"px":"-"+o.T+"px -"+o.R+"px "+(o.T-c)+"px -"+o.L+"px";for(var w=0;w<c;w++){var E=Math.max(0,s(p,w,c)),S=m.cloneNode(!1);S.style.borderWidth="0 "+(v[l+"R"]?E:0)+"px 0 "+(v[l+"L"]?E:0)+"px",h?g.appendChild(S):g.insertBefore(S,g.firstChild)}}}})},e.fn.uncorner=function(){return e(".jquery-corner",this).remove()}})(jQuery);