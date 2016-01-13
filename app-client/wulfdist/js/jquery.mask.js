"use strict";!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery||Zepto)}(function(a){var b=function(b,c,d){b=a(b);var e,f=this,g=b.val();c="function"==typeof c?c(b.val(),void 0,b,d):c;var h={invalid:[],getCaret:function(){try{var a,c=0,d=b.get(0),e=document.selection,f=d.selectionStart;return e&&-1===navigator.appVersion.indexOf("MSIE 10")?(a=e.createRange(),a.moveStart("character",b.is("input")?-b.val().length:-b.text().length),c=a.text.length):(f||"0"===f)&&(c=f),c}catch(g){}},setCaret:function(a){try{if(b.is(":focus")){var c,d=b.get(0);d.setSelectionRange?d.setSelectionRange(a,a):d.createTextRange&&(c=d.createTextRange(),c.collapse(!0),c.moveEnd("character",a),c.moveStart("character",a),c.select())}}catch(e){}},events:function(){b.on("keydown.mask",h.behaviour).on("keyup.mask",h.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){b.keydown().keyup()},100)}).on("change.mask",function(){b.data("changed",!0)}).on("blur.mask",function(){g===b.val()||b.data("changed")||b.triggerHandler("change"),b.data("changed",!1)}).on("keydown.mask, blur.mask",function(){g=b.val()}).on("focus.mask",function(b){d.selectOnFocus===!0&&a(b.target).select()}).on("focusout.mask",function(){d.clearIfNotMatch&&!e.test(h.val())&&h.val("")})},getRegexMask:function(){for(var a,b,d,e,g,h,i=[],j=0;j<c.length;j++)a=f.translation[c.charAt(j)],a?(b=a.pattern.toString().replace(/.{1}$|^.{1}/g,""),d=a.optional,e=a.recursive,e?(i.push(c.charAt(j)),g={digit:c.charAt(j),pattern:b}):i.push(d||e?b+"?":b)):i.push(c.charAt(j).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));return h=i.join(""),g&&(h=h.replace(new RegExp("("+g.digit+"(.*"+g.digit+")?)"),"($1)?").replace(new RegExp(g.digit,"g"),g.pattern)),new RegExp(h)},destroyEvents:function(){b.off(["keydown","keyup","paste","drop","blur","focusout",""].join(".mask "))},val:function(a){var c,d=b.is("input"),e=d?"val":"text";return arguments.length>0?(b[e]()!==a&&b[e](a),c=b):c=b[e](),c},getMCharsBeforeCount:function(a,b){for(var d=0,e=0,g=c.length;g>e&&a>e;e++)f.translation[c.charAt(e)]||(a=b?a+1:a,d++);return d},caretPos:function(a,b,d,e){var g=f.translation[c.charAt(Math.min(a-1,c.length-1))];return g?Math.min(a+d-b-e,d):h.caretPos(a+1,b,d,e)},behaviour:function(b){b=b||window.event,h.invalid=[];var c=b.keyCode||b.which;if(-1===a.inArray(c,f.byPassKeys)){var d=h.getCaret(),e=h.val(),g=e.length,i=g>d,j=h.getMasked(),k=j.length,l=h.getMCharsBeforeCount(k-1)-h.getMCharsBeforeCount(g-1);return h.val(j),!i||65===c&&b.ctrlKey||(8!==c&&46!==c&&(d=h.caretPos(d,g,k,l)),h.setCaret(d)),h.callbacks(b)}},getMasked:function(a){var b,e,g=[],i=h.val(),j=0,k=c.length,l=0,m=i.length,n=1,o="push",p=-1;for(d.reverse?(o="unshift",n=-1,b=0,j=k-1,l=m-1,e=function(){return j>-1&&l>-1}):(b=k-1,e=function(){return k>j&&m>l});e();){var q=c.charAt(j),r=i.charAt(l),s=f.translation[q];s?(r.match(s.pattern)?(g[o](r),s.recursive&&(-1===p?p=j:j===b&&(j=p-n),b===p&&(j-=n)),j+=n):s.optional?(j+=n,l-=n):s.fallback?(g[o](s.fallback),j+=n,l-=n):h.invalid.push({p:l,v:r,e:s.pattern}),l+=n):(a||g[o](q),r===q&&(l+=n),j+=n)}var t=c.charAt(b);return k!==m+1||f.translation[t]||g.push(t),g.join("")},callbacks:function(a){var e=h.val(),f=e!==g,i=[e,a,b,d],j=function(a,b,c){"function"==typeof d[a]&&b&&d[a].apply(this,c)};j("onChange",f===!0,i),j("onKeyPress",f===!0,i),j("onComplete",e.length===c.length,i),j("onInvalid",h.invalid.length>0,[e,a,b,h.invalid,d])}};f.mask=c,f.options=d,f.remove=function(){var a=h.getCaret();return h.destroyEvents(),h.val(f.getCleanVal()),h.setCaret(a-h.getMCharsBeforeCount(a)),b},f.getCleanVal=function(){return h.getMasked(!0)},f.init=function(c){if(c=c||!1,d=d||{},f.byPassKeys=a.jMaskGlobals.byPassKeys,f.translation=a.jMaskGlobals.translation,f.translation=a.extend({},f.translation,d.translation),f=a.extend(!0,{},f,d),e=h.getRegexMask(),c===!1){d.placeholder&&b.attr("placeholder",d.placeholder),b.attr("autocomplete","off"),h.destroyEvents(),h.events();var g=h.getCaret();h.val(h.getMasked()),h.setCaret(g+h.getMCharsBeforeCount(g,!0))}else h.events(),h.val(h.getMasked())},f.init(!b.is("input"))};a.maskWatchers={};var c=function(){var c=a(this),e={},f="data-mask-",g=c.attr("data-mask");return c.attr(f+"reverse")&&(e.reverse=!0),c.attr(f+"clearifnotmatch")&&(e.clearIfNotMatch=!0),"true"===c.attr(f+"selectonfocus")&&(e.selectOnFocus=!0),d(c,g,e)?c.data("mask",new b(this,g,e)):void 0},d=function(b,c,d){d=d||{};var e=a(b).data("mask"),f=JSON.stringify,g=a(b).val()||a(b).text();try{return"function"==typeof c&&(c=c(g)),"object"!=typeof e||f(e.options)!==f(d)||e.mask!==c}catch(h){}};a.fn.mask=function(c,e){e=e||{};var f=this.selector,g=a.jMaskGlobals,h=a.jMaskGlobals.watchInterval,i=function(){return d(this,c,e)?a(this).data("mask",new b(this,c,e)):void 0};return a(this).each(i),f&&""!==f&&g.watchInputs&&(clearInterval(a.maskWatchers[f]),a.maskWatchers[f]=setInterval(function(){a(document).find(f).each(i)},h)),this},a.fn.unmask=function(){return clearInterval(a.maskWatchers[this.selector]),delete a.maskWatchers[this.selector],this.each(function(){var b=a(this).data("mask");b&&b.remove().removeData("mask")})},a.fn.cleanVal=function(){return this.data("mask").getCleanVal()},a.applyDataMask=function(b){b=b||a.jMaskGlobals.maskElements;var d=b instanceof a?b:a(b);d.filter(a.jMaskGlobals.dataMaskAttr).each(c)};var e={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}}};a.jMaskGlobals=a.jMaskGlobals||{},e=a.jMaskGlobals=a.extend(!0,{},e,a.jMaskGlobals),e.dataMask&&a.applyDataMask()});