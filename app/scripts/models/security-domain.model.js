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

function SecurityDomainFactory($injector,$q) {
    var defaultProperties = {
        name: null,
        scoped_key: null,
        description: null
    };

    //Retrieve dependencies
    var ResourceEntity = $injector.get("ResourceEntity");

    //Constructor function
    function SecurityDomain(data) {
        angular.extend(this, data || angular.copy(defaultProperties));
    }

    //Ingerit from ResourceEntity
    SecurityDomain.prototype = ResourceEntity.new();
    SecurityDomain.prototype.constructor = SecurityDomain;

    /* INTERFACE */
    SecurityDomain.prototype.save = save;
    SecurityDomain.prototype.delete = remove;

    /* STATIC */
    SecurityDomain.new = create;
    SecurityDomainFactory.class = SecurityDomain;

    /* IMPLEMENTATION */

    function create(data) {
        return new SecurityDomain(data);
    }

    //Remove SecurityDomain
    function remove() {
        var proxy = $injector.get("SecurityDomainsFacade");
        return proxy.delete(this);
    }

    //Save SecurityDomain
    function save() {
        var proxy = $injector.get("SecurityDomainsFacade");
        if (this.id === -1 || this.id === undefined) {
            return proxy.create(this)
                .success(onSecurityDomainSaveSuccess(this));
        }
        else {
            return proxy.update(this)
                .then(saveCorrespondingOrganizations(this))
                .then(saveCorrespondingServices(this));
        }
    }

    function saveCorrespondingOrganizations(securitydomain) {
        var proxy = $injector.get("SecurityDomainsFacade");
        return proxy.setOrganizations(securitydomain.id, securitydomain.organizations.map(function(organization) { return organization.id; } ));
    }

    function saveCorrespondingServices(securitydomain) {
        var proxy = $injector.get("SecurityDomainsFacade");
        return proxy.setServices(securitydomain.id, securitydomain.services.map(function(service) { return service.id; } ));
    }

    function onSecurityDomainSaveSuccess(securitydomain) {
        return function (data, status, headers, config) {
            securitydomain.id = headers("Location").match("(.*)/api/securitydomains/(.*)")[2];
            saveCorrespondingOrganizations(securitydomain);
            saveCorrespondingServices(securitydomain);
        }
    }

    return SecurityDomain;
}

//Register App Factory in AngularJS
angular.module('hexaaApp.models').factory("SecurityDomainFactory", ['$injector','$q', SecurityDomainFactory]);