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

angular.module('hexaaApp.services.facades').factory('RolesFacade', ['$http', '$rootScope', '$q', 'HexaaService', 'RoleFactory', function ($http, $rootScope, $q, HexaaService, RoleFactory) {


    var Proxy = {
        createRole: function (oid, role) {
            var deferred = $q.defer();

            HexaaService.addRoleToOrganization(oid, role.name, role.description, role.start_date, role.end_date)
                .success(function (data, status, headers, config) {
                    role.id = headers("Location").match("(.*)/api/roles/(.*)")[2];
                    $q.all([HexaaService.setRoleEntitlements(role.id, role.entitlements.map(
                        function (item) {
                            return item.id;
                        }
                    )), HexaaService.setRolePrincipals(role.id, role.principals.map(
                        function (item) {
                            return {
                                principal: item.id,
                                expiration: item.expiration
                            }
                        }
                    ))])
                        .then(function (role_data) {
                            deferred.resolve(wrapResponse(data, status, headers, config));
                        })
                        .catch(function (error) {
                            deferred.reject(wrapResponse(error, 420, headers, config));
                        });
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(wrapResponse(data, status, headers, config));
                });

            return deferred.promise;
        },
        updateRole: function (role) {
            var deferred = $q.defer();
            HexaaService.updateRole(role.id, role.name, role.description, role.start_date, role.end_date)
                .success(function (data, status, headers, config) {
                    $q.all(HexaaService.setRoleEntitlements(role.id, role.entitlements.map(
                        function (item) {
                            return item.id;
                        }
                    )), HexaaService.setRolePrincipals(role.id, role.principals.map(
                        function (item) {
                            return {
                                principal: item.id,
                                expiration: item.expiration || null
                            }
                        }
                    )))
                        .then(function (data) {
                            deferred.resolve(wrapResponse(data, status, headers, config));
                        })
                        .catch(function (data) {
                            deferred.reject(wrapResponse(data, 420, headers, config));
                        });
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(wrapResponse(data, status, headers, config));
                });

            return deferred.promise;
        },
        deleteRole: function (id) {
            return HexaaService.deleteRole(id);
        },
        getRole: function (id) {
            var deferred = $q.defer();
            var role = undefined;

            HexaaService.getRole(id)
                .success(function (data, status, headers, config) {
                    role = data;

                    $q.all([HexaaService.getRolePrincipals(id), HexaaService.getRoleEntitlements(id)])
                        .then(function (data) {
                            role.members = data[0].data.map(function (member) {
                                member["fedid"] = member.principal.fedid;
                                member["email"] = member.principal.email;
                                member["display_name"] = member.principal.display_name;
                                member["id"] = member.principal.id;

                                return member;
                            });
                            role.entitlements = data[1].data;

                            deferred.resolve(wrapResponse(role, status, headers, config));
                        })
                        .catch(function (data) {
                            deferred.resolve(wrapResponse(data, 420, headers, config));
                        });
                })
                .error(function (data, status, headers, config) {
                    deferred.resolve(wrapResponse(data, status, headers, config));
                });
            return deferred.promise;
        },
        new: function (data) {
            return RoleFactory.new(data);
        }
    };

    return Proxy;
}]);
