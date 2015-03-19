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


function ServiceFactory($injector) {

    var ResourceEntity = $injector.get("ResourceEntity");
    var defaultProperties = {
        name: null,
        description: null,
        managers: [],
        org_name: null,
        org_description: null,
        org_short_name: null,
        org_url: null,
        priv_url: null,
        priv_description: null
    };

    function Service(data) {
        var prop = angular.copy(defaultProperties);
        angular.extend(this, data || prop);
    }

    Service.prototype = ResourceEntity.new();
    Service.prototype.constructor = Service;

    Service.prototype.save = save;
    Service.prototype.getLogo = getLogo;
    Service.prototype.delete = remove;
    Service.prototype.setLogo = setLogo;
    Service.new = create;

    ServiceFactory.class = Service;

    function create(data) {
        return new Service(data);
    }

    function save() {
        var Proxy = $injector.get("ServicesProxy");
        if (this.id === undefined || this.id === -1) {
            return Proxy.addService(this, this.contacts);
        }
        else {
            return Proxy.updateService(this);
        }
    }

    function remove() {
        var Proxy = $injector.get("ServicesProxy");
        return Proxy.deleteService(this.id);
    }

    function setLogo(logo_url) {
        this.logo_path = logo_url;
    }

    function getLogo() {
        if (this.logo_path === undefined || this.logo_path === null || this.logo_path === "")
            return baseUIAddr + "/images/default.png";
        else
            return baseAddr + '/' + this.logo_path;
    }

    return Service;
}

angular.module('hexaaApp.models').factory('SercviceFactory', ['$injector', ServiceFactory]);
