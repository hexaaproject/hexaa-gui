'use strict';
function wrapResponse(data, status, headers, config) {
    return {
        data: data,
        status: status,
        headers: headers,
        config: config
    };
}

function Jobject() {

    Jobject.prototype.prop = function (property, value) {
        if (value !== undefined) {
            this[property] = value;
        }
        return this;
    };
}

function QueryStringBuilder(url) {

    var params = {};

    QueryStringBuilder.prototype.set = function (property, value) {
        if (value !== undefined) {
            params[property] = value;
        }
        return this;
    };

    QueryStringBuilder.prototype.toString = function () {
        var string = url !== undefined ? url : "";

        if (!string.endsWith('?') && (string.indexOf('?') == -1)) {
            string += '?';
        }

        for (var key in params) {
            if (string[string.length] !== '/' || string[string.length] !== '?') {
                string += '&';
            }
            string += key + "=" + params[key];
        }
        return string;
    };
}
