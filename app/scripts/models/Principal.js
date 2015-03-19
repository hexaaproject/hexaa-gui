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

function PrincipalFactory($injector) {

    var ResourceEntity = $injector.get("ResourceEntity");

    var defaultProperties = {
        fedid: null,
        display_name: null,
        email: []
    };

    function Principal(data) {
        var prop = angular.copy(defaultProperties);
        angular.extend(this, data || prop);
    }

    Principal.prototype = ResourceEntity.new();
    Principal.prototype.constructor = Principal;
    /* INTERFACE */
    Principal.prototype.save = save;
    Principal.prototype.delete = remove;

    /* STATIC */
    Principal.new = create;

    PrincipalFactory.class = Principal;

    function create(data) {
        return new Principal(data);
    }

    function remove() {
        var proxy = $injector.get("PrincipalProxy");
        return proxy.deletePrincipal(this.id);
    }

    function save() {
        var proxy = $injector.get("PrincipalProxy");
        if (this.id == undefined || this.id == -1) {
            return proxy.addPrincipal(this).success(onAddPrincipalSuccess(this));
        }
        else {
            return proxy.updatePrincipal(this);
        }
    }

    function onAddPrincipalSuccess(principal) {
        return function (data, status, headers, config) {
            principal.id = headers("Location").match("(.*)/api/principals/(.*)/id")[2];
        }
    }

    return Principal;

}

angular.module('hexaaApp.models').factory('PrincipalFactory', ['$injector', PrincipalFactory]);
