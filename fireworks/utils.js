class StringUtils {
    static contain(str, substr) {
        return str.indexOf(substr) > -1;
    }
}

class TimeUtils {
    static getTimeInt() {
        let date = new Date();
        return date.getTime();
    }
}

class MathUitls {
    static calcPointsDist(p1, p2) {
        const a = p1.x - p2.x;
        const b = p1.y - p2.y;
        return Math.sqrt(a * a + b * b);
    }

    static getNearestObj(p, objs) {
        let minDist = 0;
        let minIndex = 0;
        let i;
        for (i = 0; i < objs.length; i ++) {
            const dist = MathUitls.calcPointsDist(p, objs[i]);
            if (i == 0) {
                minDist = dist;
                minIndex = i;
            } else {
                if (dist < minDist) {
                    minDist = dist;
                    minIndex = i;
                }
            }
        }
        return minIndex;
    }

    static getDegree(oppositeL, siblingL) {
        return Math.atan(oppositeL / siblingL) * 180 / Math.PI;
    }
}

class URLUtils {
    static getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable) {
                return pair[1];
            }
        }
        return "";
    }

    /* http://127.0.0.1:8080/Test/index.html#test?name=test */
    static getURLHref() {
        return window.location.href;
    }
    /* /Test/index.html */
    static getURLPath() {
        return window.location.pathname;
    }
    /* http */
    static getURLProtocol() {
        return window.location.protocol;
    }
    /* 127.0.0.1:8080 */
    static getURLHost() {
        return window.location.host;
    }
    /* 127.0.0.1 */
    static getURLHostname() {
        return window.location.hostname;
    }
    /* 8080 */
    static getURLPort() {
        return window.local.port;
    }
    /* #test?name=test */
    static getURLHash() {
        return window.local.hash;
    }
    /* name=test */
    static getURLSearch() {
        return window.local.search;
    }

    /* http://127.0.0.1:8080/Test/index.html */
    static getURLMain() {
        let url = this.getURLHref();
        let index = url.indexOf('?') == -1 ? url.length : url.indexOf('?');
        return url.substring(0, index);
    }

    /*
     * {a: "xxx", b: "yyy"}
     * http://127.0.0.1:8080/Test/index.html?a=xxx&b=yyy
     */
    static genURL(params) {
        let strParams = [];
        for (let k in params) {
            strParams.push(k + "=", params[k]);
        }
        return this.getUrlMain() + "?" + strParams.join("&");
    }

    /*
     * {a: "xxx", b: "yyy"}
     * http://127.0.0.1:8080/Test/index.html?data=encodedJsonData
     */
    static getURLWithJsonData(data) {
        return this.getURLMain() + "?data=" + encodeURIComponent(JSON.stringify(data))
    }

    static getURLJsonData() {
        let jsonStr = decodeURIComponent(this.getQueryVariable("data"));
        try {
            var obj = JSON.parse(jsonStr);
            if (typeof obj == 'object' && obj ) {
                return obj;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
}

class CopyUtils {
    static copyText(text) {
        const input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, 9999);   // for iOS
        if (document.execCommand('copy')) {
            console.log('Copy successfully');
        }
        document.body.removeChild(input);
    }

    static copyMultiText(textArray) {

    }
}
