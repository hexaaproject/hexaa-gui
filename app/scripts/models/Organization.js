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

function OrganizationFactory($injector) {

    var ResourceEntity = $injector.get("ResourceEntity");

    var defaultProperties = {
        name: null,
        description: null,
        default_role: null,
        members: [],
        managers: [],
        isolate_members: false,
        isolate_role_members: false,
        invitations: [],
        role: {
            name: "default"
        },
        roles: [],
        entitlements: [],
        entitlementpacks: []
    };

    function Organization(data) {
        var prop = angular.copy(defaultProperties);
        angular.extend(this, data || prop);
    }

    Organization.prototype = ResourceEntity.new();
    Organization.prototype.constructor = Organization;

    /* INTERFACE */
    Organization.prototype.delete = remove;
    Organization.prototype.save = save;

    /* STATIC */
    Organization.new = create;

    OrganizationFactory.class = Organization;

    function create(data) {
        return new Organization(data);
    }

    function remove() {
        var Proxy = $injector.get("OrganizationsProxy");
        return Proxy.deleteOrganization(this.id);
    }

    function save() {
        var Proxy = $injector.get("OrganizationsProxy");
        if (this.id === -1 || this.id === undefined) {
            var organization = this;
            return Proxy.createOrganization(this).then(onOrganizationCreated(organization));
        }
        else {
            return Proxy.updateOrganization(this);
        }
    }

    function onOrganizationCreated(organization) {
        return function (data) {
            organization.default_role = angular.fromJson(data.config.data).default_role;
            if (data.config.url.match("(.*)/api/organizations/(.*).json") )
                organization.id = data.config.url.match("(.*)/api/organizations/(.*).json")[2];
            else
                organization.id = data.headers("Location").match("(.*)/api/organizations/(.*)")[2];
        }
    }

    return Organization;
}

angular.module('hexaaApp.models').factory('OrganizationFactory', ['$injector', OrganizationFactory]);


