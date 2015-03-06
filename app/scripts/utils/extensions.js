/*
 Copyright 2014 MTA SZTAKI

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
'use strict';
Array.prototype.isArray = true;

Array.prototype.indexOfField = function (value, propertyName) {
    for (var i = 0; i < this.length; i += 1) {
        if (this[i][propertyName] === value[propertyName]) {
            return i;
        }
    }
    return -1;

};

//given an id or anything as value and a propertyname. we iterate over the
//collection and check if the collection's actual item's given property has the given value
//we return the index where we found it in the collection
Array.prototype.position = function (value, propertyName) {
    for (var i = 0; i < this.length; i += 1) {
        if (this[i][propertyName] === value) {
            return i;
        }
    }
    return -1;

};

//return the element of the collection where the specified property has the specified value
Array.prototype.where = function (value, propertyName) {
    for (var i = 0; i < this.length; i += 1) {
        if (this[i][propertyName] === value) {
            return this[i];
        }
    }
    return undefined;
};


String.prototype.bool = function () {
    return (String(this) === "true");
};

Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOfField(i) < 0;
    });
};

Array.prototype.diffField = function (a, propertyName) {
    return this.filter(function (i) {
        return a.indexOfField(i, propertyName) < 0;
    });
};

String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

String.prototype.toDateString = function () {
    return this;
};

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};


String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function (prefix) {
    return (this.slice(0, prefix.length) === prefix);
};

Array.prototype.saveMemento = function () {
    this._original = this.slice();
};

Array.prototype.restoreMemento = function () {
    if (this.hasOwnProperty("_original")) {
        this.splice(0, this.length);
        for (var key in this._original) {
            if (key !== "_original") {
                this[key] = this._original[key];
            }
        }
    }
};

Array.prototype.removeAt = function (index) {
    this.splice(index, 1);
};

/**
 * Navigates to the specified location
 * @param to Location to navigate
 */
function navigate(to) {
    window.location = to;
}


Array.prototype.removeItemsProperty = function (prop) {
    angular.forEach(this, function (item) {
        item[prop] = undefined;
    });

    return this;
};

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
