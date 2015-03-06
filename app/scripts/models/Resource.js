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

function ResourceFactory() {

    var defaultProperties = {
        id: -1
    };

    var Resource = function (data) {
        var prop = angular.copy(defaultProperties);
        angular.extend(this, data || prop);
        this._original = {};
        angular.copy(data || defaultProperties, this._original);
    };

    /* INTERFACE */
    Resource.prototype.undo = undo;
    Resource.prototype.commit = commit;
    Resource.new = create;

    /* IMPLEMENTATION */
    function commit() {
        this["_original"] = angular.copy(this);
    }

    function undo() {
        for (var key in this._original)
            if (key !== "_original")
                this[key] = this._original[key];
    }

    function create(data) {
        return new Resource(data);
    }

    return Resource;

}

angular.module('hexaaApp.models').factory('ResourceEntity', ResourceFactory);

