/*
 * WULF (http://networks.nokia.com/)
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 */

// Copyright 2010 Sandeep Mewara.
// Licence: The Code Project Open License (CPOL) v1.02
// http://www.codeproject.com/info/cpol10.aspx
// http://www.codeproject.com/Tips/61476/Disable-all-links-on-the-page-via-Javascript.aspx

window.onload = function () {
    DisableEnableLinks(true);
};

function DisableEnableLinks(xHow) {
    var objLinks = document.links;
    for (i = 0; i < objLinks.length; i++) {
        // Modification below by Nokia to make the disabling impact only on certain identified links
        if (objLinks[i].className .indexOf("n-link-disabled") > -1) {
            objLinks[i].disabled = xHow;
            //link with onclick
            if (objLinks[i].onclick && xHow) {
                objLinks[i].onclick = new Function("return false;" + objLinks[i].onclick.toString().getFuncBody());
            }
            //link without onclick
            else if (xHow) {
                objLinks[i].onclick = function () {
                    return false;
                }
            }
            //remove return false with link without onclick
            else if (!xHow && objLinks[i].onclick.toString().indexOf("function(){return false;}") != -1) {
                objLinks[i].onclick = null;
            }
            //remove return false link with onclick
            else if (!xHow && objLinks[i].onclick.toString().indexOf("return false;") != -1) {
                strClick = objLinks[i].onclick.toString().getFuncBody().replace("return false;", "");
                objLinks[i].onclick = new Function(strClick);
            }
            objLinks[i].removeAttribute("href");
        }
    }
}

/*
$('n-a-call-to-action-disabled').on('focus', function () {
    $this = $(this);
    $this.closest('div.container').scrollTop($this.index() * $this.outerHeight());
}).on('keydown', 'li', function (e) {
    $this = $(this);
    if (e.keyCode == 40) {
        $this.next().focus();
        return false;
    }
    else if (e.keyCode == 38) {
        $this.prev().focus();
        return false;
    }
}).find('a').first().focus();
//Todo pitäisi hakea joku fokusoitavissa oleva komponentti
*/

/*
 //prevent focus attempt
 if (objLinks[i].onfocus && xHow) {
 objLinks[i].onfocus = null
 return false;
 }
 else {
 // var focusables = $(':focusable');
 }

 */
String.prototype.getFuncBody = function () {
    var str = this.toString();
    str = str.replace(/[^{]+{/, "");
    str = str.substring(0, str.length - 1);
    str = str.replace(/\n/gi, "");
    if (!str.match(/\(.*\)/gi)) {
        str += ")";
    }
    return str;
};

/*
 class AnchorDisabler
 constructor: (selector = 'a.disabled') ->
 $(selector).click(@onClick).keyup(@onKeyup).focus(@onFocus)

 isStillDisabled: (ev) =>
 ### since disabled can be a class or an attribute, and it can be dynamically removed, always recheck on a watched event ###
 target = $(ev.target)
 return true if target.hasClass('disabled')
 return true if target.attr('disabled') is 'disabled'
 return false

 onFocus: (ev) =>
 ### if an attempt is made to focus on a disabled element, just move it along to the next focusable one. ###
 return unless @isStillDisabled(ev)

 focusables = $(':focusable')
 return unless focusables

 current = focusables.index(ev.target)
 next = (if focusables.eq(current + 1).length then focusables.eq(current + 1) else focusables.eq(0))

 next.focus() if next


 onClick: (ev) =>
 # disabled could be dynamically removed
 return unless @isStillDisabled(ev)

 ev.preventDefault()
 return false

 onKeyup: (ev) =>

 # 13 is the js key code for Enter, we are only interested in disabling that so get out fast
 code = ev.keyCode or ev.which
 return unless code is 13

 # disabled could be dynamically removed
 return unless @isStillDisabled(ev)

 ev.preventDefault()
 return false
 */
