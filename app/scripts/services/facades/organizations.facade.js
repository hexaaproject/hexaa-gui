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

angular.module('hexaaApp.services.facades').factory('OrganizationsFacade', ['$http', '$rootScope', '$q', 'HexaaService', 'RolesFacade', 'InvitationsFacade', 'ResourceEntity', 'OrganizationFactory', function ($http, $rootScope, $q, HexaaService, RolesFacade, InvitationsFacade, ResourceEntity, OrganizationFactory) {

    var Proxy = {
        getRoles: function (organizationId, pager) {
            var deferred = $q.defer();
            var roles = [];

            var getRoles = null;
            if (pager ) {
                getRoles = HexaaService.getOrganizationRoles(organizationId, (pager.currentPage - 1) * pager.itemPerPage, pager.itemPerPage);
            }
            else {
                getRoles = HexaaService.getOrganizationRoles(organizationId);
            }

            getRoles.then(function (data) {
                angular.forEach(data.data.items, function (role) {
                    if (role.principals )
                    {
                        for (var i = 0; i < role.principals.length; i++) {
                            role.principals[i] = role.principals[i].principal;
                        }
                    }
                    roles.push(RolesFacade.new(role));
                });
                deferred.resolve(wrapResponse({
                    items: roles,
                    item_number: data.data.item_number
                }, data.status, data.headers, data.config));
            });

            return deferred.promise;
        },
        getOrganizations: function () {
            return HexaaService.getOrganizations();
        },
        getOrganization: function (id) {
            var deferred = $q.defer();
            HexaaService.getOrganization(id)
                .success(function (data, status, header, config) {
                    deferred.resolve(wrapResponse(OrganizationFactory.new(data), status, header, config));
                })
                .error(function (data, status, header, config) {
                    deferred.reject(wrapResponse(data, status, header, config));
                });
            return deferred.promise;
        },
        getAttributeSpecifications: function (id) {
            return HexaaService.getOrganizationAttributeSpecifications(id);
        },
        getManagers: function (id) {
            return HexaaService.getManagersOfOrganization(id);
        },
        getMembers: function (id) {
            return HexaaService.getMembersOfOrganization(id);
        },
        getPrincipals: function (id) {
            var deferred = $q.defer();
            $q.all({
                members: HexaaService.getMembersOfOrganization(id),
                managers: HexaaService.getManagersOfOrganization(id)
            })
                .then(function (data) {
                    var managers = data.managers.data.items.map(function (manager) {
                        manager.is_manager = true;
                        return manager;
                    });

                    var principals = $linq(managers).union(data.members.data.items, "(x,y)=>x.fedid==y.fedid").toArray();

                    deferred.resolve(wrapResponse(principals, data.members.status, data.members.headers, data.members.config));
                })
                .catch(function (error) {
                    deferred.reject(wrapResponse(error, 420, null, null));
                });
            return deferred.promise;
        },
        getAttributeValueOrganizations: function (attrspec) {
            return HexaaService.getAttributeValueOrganizationsPerAttributeSpecification(attrspec.organization_id, attrspec.id);
        },
        addAttributeValueOrganization: function (attr) {
            var deferred = $q.defer();

            HexaaService.addAttributeValueOrganization(attr.organization_id, attr.attribute_spec.id, attr.value, attr.services.map(function (service) {
                return service.id;
            }))
                .success(function (data, status, header, config) {
                    attr.id = header("Location").match("(.*)/api/attributevalueorganizations/(.*)")[2];
                    deferred.resolve(wrapResponse(data, status, header, config));
                })
                .error(function (data, status, header, config) {
                    deferred.reject(wrapResponse(data, status, header, config));
                });

            return deferred.promise;
        },
        updateAttributeValueOrganization: function (attr) {
            return HexaaService.updateAttributeValueOrganization(attr.id, attr.attribute_spec.id, attr.value, attr.services.map(function (service) {
                return service.id;
            }));
        },
        deleteAttributeValueOrganization: function (attributeValue) {
            return HexaaService.deleteAttributeValueOrganization(attributeValue.id);
        },
        getNews: function (id, skip, take, tags) {
            return HexaaService.getOrganizationNews(id, skip, take, tags);
        },
        updateOrganization: function (organization) {
            return HexaaService.updateOrganization(organization.id, organization.name, organization.description, organization.url, organization.default_role_id,organization.isolate_members,organization.isolate_role_members);
        },
        createOrganization: function (organization) {
            var deferred = $q.defer();

            HexaaService.addOrganization(organization.name, organization.description, organization.url, organization.isolate_members,organization.isolate_role_members)
                .success(function (data, status, headers, config) {
                    organization.id = headers("Location").match("(.*)/api/organizations/(.*)")[2];

                    if (organization.role ) {
                        HexaaService.addRoleToOrganization(organization.id, organization.role.name,
                            organization.role.description, organization.role.start_date, organization.role.end_date)
                            .success(function (data, status, headers, config) {
                                organization.role.id = headers("Location").match("(.*)/api/roles/(.*)")[2];
                                HexaaService.updateOrganization(organization.id, organization.name, organization.description, organization.url, organization.role.id,organization.isolate_members,organization.isolate_role_members)
                                    .success(function (data, status, headers, config) {
                                        deferred.resolve(wrapResponse(organization, status, headers, config));
                                    })
                                    .error(function (data, status, headers, config) {
                                        deferred.reject(wrapResponse(data, status, headers, config));
                                    });

                            })
                            .error(function (data, status, headers, config) {
                                deferred.reject(deferred.reject(wrapResponse(data, status, headers, config)));
                            });
                    }
                    else {
                        deferred.resolve(wrapResponse(organization, status, headers, config));
                    }
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(wrapResponse(data, status, headers, config));
                });

            return deferred.promise;
        },
        deleteOrganization: function (organization) {
            return HexaaService.deleteOrganization(organization.id);
        },
        updateManagers: function (organization) {
            return HexaaService.setOrganizationManagers(organization.id, organization.managers.map(function (manager) {
                return manager.id;
            }))
        },
        updateMembers: function (organization) {
            return HexaaService.setOrganizationMembers(organization.id, organization.members.map(function (members) {
                return members.id;
            }))
        },
        getInvitations: function (id, pager) {
            var deferred = $q.defer();
            var items = [];

            var request = {};
            if (pager !== undefined) {
                request = HexaaService.getOrganizationInvitations(id, (pager.currentPage - 1) * pager.itemPerPage, pager.itemPerPage);
            }
            else {
                request = HexaaService.getOrganizationInvitations(id);
            }

            request.success(function (data, status, header, config) {
                angular.forEach(data.items, function (item) {
                    items.push(InvitationsFacade.new(item));
                });
                deferred.resolve(wrapResponse({items: items, item_number: data.item_number}, status, header, config));
            })
                .error(function (data, status, header, config) {
                    deferred.resolve(wrapResponse(data, status, header, config));
                });

            return deferred.promise;
        },
        getEntitlementpacks: function (id) {
            var deferred = $q.defer();
            var entitlementpacks = [];

            HexaaService.getOrganizationEntitlementPacks(id)
                .success(function (data, status, headers, config) {
                    angular.forEach(data.items, function (entpack) {
                        entpack.id = entpack.entitlement_pack.id;
                        entpack.name = entpack.entitlement_pack.name;
                        entpack.description = entpack.entitlement_pack.description;
                        entpack.scoped_name = entpack.entitlement_pack.scoped_name;

                        entitlementpacks.push(entpack);
                    });
                    deferred.resolve(wrapResponse({
                        items: entitlementpacks,
                        item_number: data.item_number
                    }, status, headers, config));
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(wrapResponse(data, status, headers, config));
                });

            return deferred.promise;

        },
        getEntitlements: function (id) {
            return HexaaService.getOrganizationEntitlements(id);
        },
        linkPrivateEntitlementpack: function (organization, token) {
            return HexaaService.linkEntitlementToOrganization(organization.id, token);
        },
        updateEntitlementpacks: function (organization) {
            return HexaaService.setOrganizationEntitlementpacks(organization.id, organization.entitlementpacks.map(function (ep) {
                return ep.id;
            }));
        },
        deleteEntitlementpack: function (oid, epid) {
            return HexaaService.deleteEntitlementpackFromOrganization(oid, epid);
        },
        addManager: function (id, pid) {
            return HexaaService.addManagerToOrganization(id, pid);
        },
        removeManager: function (id, pid) {
            return HexaaService.deleteManagerFromOrganization(id, pid);
        },
        addMember: function (id, pid) {
            return HexaaService.addMemberToOrganization(id, pid);
        },
        removeMember: function (id, pid) {
            return HexaaService.deleteMemberFromOrganization(id, pid);
        },
        addEntitlementpack: function (organization, entitlementpack) {
            return HexaaService.addEntitlementpackToOrganization(organization.id, entitlementpack.id);
        },
        removeEntitlementpack: function (id, eid) {
            return HexaaService.deleteEntitlementpackFromOrganization(id, eid);
        },
        new: function (data) {
            return OrganizationFactory.new(data);
        }
    };

    return Proxy;
}]);
