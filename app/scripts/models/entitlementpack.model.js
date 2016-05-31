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

function EntitlementpackFactory($injector) {

    var ResourceEntity = $injector.get("ResourceEntity");

    var defaultProperties = {
        entitlements: [],
        name: [],
        description: [],
        type: false,
        token: null
    };

    //Constructor function
    function Entitlementpack(data) {
        var prop = angular.copy(defaultProperties);
        angular.extend(this, data || prop);
        this["_original"] = angular.copy(data || prop);
    }

    //Inheritance
    Entitlementpack.prototype = ResourceEntity.new();
    Entitlementpack.prototype.constructor = Entitlementpack;

    /* INTERFACE */
    Entitlementpack.prototype.getToken = getToken;
    Entitlementpack.prototype.getEntitlements = getEntitlements;
    Entitlementpack.prototype.delete = remove;

    Entitlementpack.prototype.save = save;

    EntitlementpackFactory.class = Entitlementpack;

    /*STATIC */
    Entitlementpack.new = create;

    function save() {
        var ServicesFacade = $injector.get("ServicesFacade");
        if (this.id === -1 || this.id === undefined) {
            return ServicesFacade.addEntitlementpack(this.service.id, this);
        }
        else {
            return ServicesFacade.updateEntitlementpack(this);
        }
    }

    function create(data) {
        return new Entitlementpack(data);
    }

    function getToken() {
        var proxy = $injector.get("EntitlementpacksFacade");
        return proxy.generateToken(this.id);
    }

    function getEntitlements() {
        var proxy = $injector.get("EntitlementpacksFacade");
        return proxy.getEntitlements(this.id);
    }

    function remove() {
        var proxy = $injector.get("EntitlementpacksFacade");
        return proxy.remove(this.id);
    }

    return Entitlementpack;
}

angular.module('hexaaApp.models').factory('EntitlementpackFactory', ['$injector', EntitlementpackFactory]);
