class StringUtils {
    static contain(str, substr) {
        return str.indexOf(substr) > -1;
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
    // static copyImage(img) {
    //     if (img.tagName != 'IMG')
    //         return;
    //     if (typeof img.contentEditable == 'undefined')
    //         return;
    //     if (!document.body.createControlRange)
    //         return;
    //     var ctrl = document.body.createControlRange();
    //     img.contentEditable = true;
    //     ctrl.addElement(img);
    //     ctrl.execCommand('Copy');
    //     img.contentEditable = false;
    // }

    // static copyFromInput(inputId) {
    //     var input = document.getElementById(inputId);
    // 	var userAgent = navigator.userAgent;
    //     var isOpera = StringUtils.contain(userAgent, "Opera");
    //     var isCompatible = StringUtils.contain(userAgent, "compatible");
    //     var isIE = StringUtils.contain(userAgent, "MSIE");
    // 	if (isCompatible && isIE && !isOpera) {
    // 		// check if copy successfully
    //         // in IE, if have the forbiding clipboard option after exceute copying and choose disable, then will fail.
    // 		if (window.clipboardData.setData("Text", input.value)) {
    //             alert("Successful to copy");
    // 		} else {
    //             alert('Fail to copy');
    // 		}
    // 	} else {
    // 		input.select();
    // 		document.execCommand("Copy");
    // 		alert("Successful to copy");
    // 	}
    // }

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
