var GUID=function(){function e(){do var t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,r="x"==e?t:3&t|8;return r.toString(16)});while(!e.register(t));return t}return e.create=function(){return e()},e.version="1.2.0",e.list=[],e.exists=function(t){return e.list.indexOf(t)>-1},e.register=function(t){return!e.exists(t)&&(e.list.push(t),!0)},e}(),Obj=function(){function e(e){if("function"==typeof e)return e;if("string"==typeof e){if(void 0!=window[e]&&"function"==typeof window[e])return window[e];try{return new Function(e)}catch(e){}}return function(){return e}}function t(){this._guid=GUID(),Object.defineProperty(this,"guid",{get:function(){return this._guid},set:function(){}}),this._handlers=[],this.on=function(e,t,r){for(var i="all",n=null,s=0,h=0;h<arguments.length;h++)"string"==typeof arguments[h]?i=arguments[h].toLowerCase().split(" "):arguments[h]instanceof Array?i=$.map(arguments[h],function(e,t){return e.toLowerCase()}):"function"==typeof arguments[h]?n=arguments[h]:"number"==typeof arguments[h]&&(s=arguments[h]);if(!n)return this;for(var h=0;h<i.length;h++)this._handlers[i[h]]||(this._handlers[i[h]]=[]),this._handlers[i[h]].push({event:i[h],handler:n,max_count:s,trigger_count:0});return this},this.off=function(e,t){if(void 0===t&&"function"==typeof e){t=e;for(var r in this._handlers){for(var i=this._handlers[r],n=0;n<i.length;n++)t==i[n].handler&&this._handlers[r].splice(n--,1);0==this._handlers[r].length&&delete this._handlers[r]}}else if(void 0===t&&"string"==typeof e){e=e.toLowerCase().split(" ");for(var s=0;s<e.length;s++)delete this._handlers[e[s]]}else{e=e.toLowerCase().split(" ");for(var s=0;s<e.length;s++){for(var r=e[s],i=this._handlers[r],n=0;n<i.length;n++)i[n].handler==t&&i.splice(n--,1);0==this._handlers[r].length&&delete this._handlers[r]}}return this},this.trigger=function(t,r){t=t.toLowerCase().split(" ");for(var i=0;i<t.length;i++){var n=t[i];if(this._handlers[n])for(var s=0;s<this._handlers[n].length;s++){var h=this._handlers[n][s];e(h.handler).call(this,n,r),h.trigger_count++,h.max_count&&h.max_coung<h.trigger_count&&this._Handlers[n].splice(s--,1)}}return this},this._elements=$(),this.pauseRefreshing=!1,this.renderer=function(){var e=$("<div class='Obj'></div>");for(var t in this)0==t.indexOf("_")&&"function"!=typeof this[t]&&["_handlers","_elements","_guid"].indexOf(t)==-1&&e.append("<div class='Obj-member'><div class='Obj-member-key'>"+t.substr(1)+"</div><div class='Obj-member-value'>"+this[t]+"</div></div>");return e},this.refresher=function(e){return this.renderer.apply(this)},this.destroyer=function(e){},this.cleaner=function(){},this.render=function(e,t){var r=this;if(void 0===e)var e="body";if(void 0===t)var t="append";else t=t.toLowerCase();var i=[].slice.call(arguments,2),n=this;return $(e).each(function(e,s){s=$(s);var h=$(r.renderer.apply(r,i));h.attr("guid",r.guid),r._elements=r._elements.add(h),"append"==t?s.append(h):"prepend"==t?s.prepend(h):"after"==t?s.after(h):"before"==t?s.before(h):"return"==t?n=h:"replace"==t&&(s.after(h),s.remove())}),this.trigger("render"),n},this.refresh=function(e){if(this.pauseRefreshing)return this;for(var t=$(),r=0;r<this._elements.length;r++){var i=this._elements.eq(r),n=this.refresher.call(this,i,e);n?(n.attr("guid",this.guid),this._elements=this._elements.not(i),i.after(n),i.remove(),t=t.add(n)):t=t.add(i)}return this._elements=t,this},this.destroy=function(){var e=this;return this._elements.each(function(t,r){var i=$(r);i.off(),i.find("*").off(),e.destroyer.call(e,i)}),this._elements.remove(),this._elements=$(),delete t.directory[this._guid],delete GUID.list[this._guid],this},this.clean=function(){for(var e=$("body *"),t=0;t<this._elements.length;t++)0==e.filter(this._elements[t]).length&&(this._elements=this._elements.not(this._elements.eq(t)));return this.cleaner(),this.trigger("clean"),this},this.defMember=function(e,t,r,i){for(var n=this,s=["handlers","on","off","trigger","elements","render","refresh","destroy","defMember","defSettings","defMethod","guid","clean"],h=0;h<s;h++)if(s[h]==e||"_"+s[h]==e)return!1;this["_"+e]=void 0===t?null:t,Object.defineProperty(this,e,{get:function(){var t=this["_"+e];return i&&(t=i.call(n,t)),t},set:function(t){if(r){var i=r.call(n,t);void 0!==i&&(t=i)}this["_"+e]=t,this.refresh(e),this.trigger(e,t)}})},this.defSettings=function(e){if(void 0===e)var e={};this._settings=e,Object.defineProperty(this,"settings",{get:function(){return this._settings},set:function(e){this._settings=$.extend(this._settings,e),this.refresh("settings"),this.trigger("settings",this._settings)}})},this.defMethod=function(e,t){for(var r=this,i=["handlers","on","off","trigger","elements","render","refresh","destroy","defMember","defSettings","defMethod","guid","clean"],n=0;n<i;n++)if(i[n]==e||"_"+i[n]==e)return!1;this["_"+e]=t||function(){},this[e]=function(){var t=r["_"+e].apply(r,arguments);return r.trigger(e,arguments),void 0!=t?t:r}},t.directory[this.guid]=this}return t.version="3.0.0",t.directory={},t.extend=function(e,r){r||(r=t);var i=function(){r.apply(this,arguments),e.apply(this,arguments)};return e.prototypoe=Object.create(r.prototype),i.prototype=Object.create(e.prototype),i},t.create=function(e){function r(){t.apply(this)}if("function"==typeof e)return t.extend(e);if("object"==typeof e){var r=function(){t.apply(this,arguments);for(var r in e)"function"==typeof e[r]?this.defMethod(r,e[r]):this.defMember(r,e[r]);this.init&&this.init.apply(this,arguments)};return r}return r.prototype=Object.create(t.prototype),r},t.clean=function(){for(var e in t.directory)t.directory[e].clean();return this},t}();