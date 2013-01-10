/**
 * jquery.purr.js
 * Copyright (c) 2008 Net Perspective (net-perspective.com)
 * Licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * @author R.A. Ray
 * @projectDescription  jQuery plugin for dynamically displaying unobtrusive messages in the browser. Mimics the behavior of the MacOS program "Growl."
 * @version 0.1.0
 *
 * @requires jquery.js (tested with 1.2.6)
 *
 * @param fadeInSpeed           int - Duration of fade in animation in miliseconds
 *                          default: 500
 *  @param fadeOutSpeed         int - Duration of fade out animationin miliseconds
                            default: 500
 *  @param removeTimer          int - Timeout, in miliseconds, before notice is removed once it is the top non-sticky notice in the list
                            default: 4000
 *  @param isSticky             bool - Whether the notice should fade out on its own or wait to be manually closed
                            default: false
 *  @param usingTransparentPNG  bool - Whether or not the notice is using transparent .png images in its styling
                            default: false
 */
(function(e){e.purr=function(t,n){function i(){var i=document.createElement("a");e(i).attr({className:"close",href:"#close"}).appendTo(t).click(function(){return s(),!1}),e(document).keyup(function(e){e.keyCode==27&&s()}),t.appendTo(r).hide(),e.browser.msie&&n.usingTransparentPNG?t.show():t.fadeIn(n.fadeInSpeed);if(!n.isSticky)var o=setInterval(function(){t.prevAll(".purr").length==0&&(clearInterval(o),setTimeout(function(){s()},n.removeTimer))},200)}function s(){e.browser.msie&&n.usingTransparentPNG?t.css({opacity:0}).animate({height:"0px"},{duration:n.fadeOutSpeed,complete:function(){t.remove()}}):t.animate({opacity:"0"},{duration:n.fadeOutSpeed,complete:function(){t.animate({height:"0px"},{duration:n.fadeOutSpeed,complete:function(){t.remove()}})}})}t=e(t),t.addClass("purr");var r=document.getElementById("purr-container");r||(r='<div id="purr-container"></div>'),r=e(r),e("body").append(r),i()},e.fn.purr=function(t){return t=t||{},t.fadeInSpeed=t.fadeInSpeed||500,t.fadeOutSpeed=t.fadeOutSpeed||500,t.removeTimer=t.removeTimer||4e3,t.isSticky=t.isSticky||!1,t.usingTransparentPNG=t.usingTransparentPNG||!1,this.each(function(){new e.purr(this,t)}),this}})(jQuery);