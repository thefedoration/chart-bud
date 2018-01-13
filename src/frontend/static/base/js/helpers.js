

function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function unslugify(text){
    return text.split("-").map(function(w){
        return w.charAt(0).toUpperCase() + w.slice(1)
    }).join(" ")
}



function getUrlParam(name) {
  var regex = RegExp("[\\?&]" + name + "=([^&#]*)"),
    url = location.href;
  var results = regex.exec(url);
  return results === null ? null : results[1];
}

function getColorFromPercent(percent){
    // this is green to red, that's why there's a reverse
    var options = ["#00CD86", "#05CD84", "#76D700", "#CCC82B", "#EFB004", "#FCAD16", "#F88F17", "#F67C17", "#F6561B", "#F43C12", "#ED1800"].reverse()
    var num = Math.floor((percent / 100) * 10);
    return options[num];
}

// tries to open url in new tab using js. if it can't just goes to the link.
// SOME ADBLOCKERS WILL STOP THIS, AVOID USING IF YOU CAN USE AN <a> TAG
function openUrlInNewTab(url) {
    var win = window.open(url, '_blank');
    if (win){
        win.focus();
    } else {
        window.location = url;
    }
}

function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i) && obj[i]) {
            if (obj[i].constructor === Array){
                parts.push(encodeURIComponent(i) + "=" + obj[i].join(','));
            } else {
                parts.push(encodeURIComponent(i) + "=" + obj[i]);
            }
        }
    }
    return (parts.length) ? "?" + parts.join("&") : "";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

// checks if real email
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function sum(a){
    var sum = 0;
    for (var i=0; i<a.length;i++){
        sum += a[i];
    }
    return sum;
}

function avg(a){
    return Math.sum(a)/a.length;
}

function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// separates numbers with commas for thousands places and so on
function commaSeparator(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function truncateText(text, chars) {
    if(text.length > chars) {
        text = text.slice(0, Math.floor(chars) - 3).trim() + '...';
    }
    return text;
}

function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}
