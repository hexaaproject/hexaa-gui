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

function RoleFactory($injector) {
    var ResourceEntity = $injector.get("ResourceEntity");

    var defaultProperties = {
        name: null,
        description: null,
        start_date: null,
        end_date: null,
        principals: [],
        entitlements: []
    };

    function Role(data) {
        var prop = angular.copy(defaultProperties);
        angular.extend(this, data || prop);
        this._original = angular.copy(data || prop);
    }

    Role.prototype = ResourceEntity.new();
    Role.prototype.constructor = Role;
    /* INTERFACE */
    Role.prototype.save = save;
    Role.prototype.delete = remove;
    /*STATIC*/
    Role.new = create;

    RoleFactory.class = Role;

    /* IMPLEMENTATION */

    function create(data) {
        return new Role(data);
    }

    function remove() {
        var Proxy = $injector.get("RolesProxy");

        return Proxy.deleteRole(this.id);
    }

    function save() {
        var Proxy = $injector.get("RolesProxy");

        if (this.id == -1 || this.id == undefined) {
            var role = this;
            return Proxy.createRole(this.oid, this)
                .then(function (data) {
                    role.id = data.headers("Location").match("(.*)/api/roles/(.*)")[2];
                    role._original = angular.copy(role);
                });
        }
        else {
            return Proxy.updateRole(this);
        }
    }

    return Role;
}

angular.module('hexaaApp.models').factory('RoleFactory', ['$injector', RoleFactory]);
