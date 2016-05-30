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

angular.module('hexaaApp.services.facades').factory('ServicesProxy', ['$http', '$rootScope', '$q', 'HexaaService', 'InvitationsProxy', 'baseUIAddr', 'baseAddr', 'ResourceEntity', 'EntitlementpacksProxy', 'SercviceFactory', function ($http, $rootScope, $q, HexaaService, InvitationsProxy, baseUIAddr, baseAddr, ResourceEntity, EntitlementpacksProxy, SercviceFactory) {

    var Service = function (data) {
        angular.extend(this, data || defaultProperties);
    };

    Service.prototype.save = function () {
        if (this.id === undefined || this.id === -1) {
            return Proxy.addService(this, this.contacts);
        }
        else {
            return Proxy.updateService(this);
        }
    };

    Service.prototype.delete = function () {
        return Proxy.deleteService(this.id);
    };

    Service.prototype.setLogo = function (logo_url) {
        this.logo_path = logo_url;
    };

    Service.prototype.getLogo = function () {
        if (this.logo_path === undefined || this.logo_path === null || this.logo_path === "")
            return baseUIAddr + "/images/default.png";
        else
            return baseAddr + '/' + this.logo_path;
    };

    var Proxy = {
        getServices: function () {
            return HexaaService.getServices();
        },
        deleteService: function (id) {
            return HexaaService.deleteService(id);
        },
        getService: function (id) {
            var deferred = $q.defer();
            HexaaService.getService(id)
                .success(function (data, status, header, config) {
                    deferred.resolve(wrapResponse(SercviceFactory.new(data), status, header, config));
                })
                .error(function (data, status, header, config) {
                    deferred.reject(wrapResponse(data, status, header, config));
                });
            return deferred.promise;
        },
        getAttributeSpecifications: function (id) {
            return HexaaService.getServiceAttributeSpecifications(id);
        },
        getNews: function (id, skip, take, tags) {
            return HexaaService.getServiceNews(id, skip, take, tags);
        },
        getEntityIds: function () {
            return HexaaService.getEntityIds();
        },
        updateService: function (service) {
            return HexaaService.updateService(service.id, service.name, service.url, service.entityid, service.description
                , service.org_name, service.org_short_name, service.org_url, service.org_description, service.priv_url, service.priv_description);
        },
        addService: function (service, contacts) {
            var deferred = $q.defer();

            HexaaService.addService(service.name, service.url, service.entityid, service.description
                , service.org_name, service.org_short_name, service.org_url, service.org_description, service.priv_url, service.priv_description)
                .success(function (data, status, headers, config) {
                    //send notification
                    var id = headers("Location").match("(.*)/api/services/(.*)")[2];
                    HexaaService.notifySP(id, {contacts: contacts})
                        .success(function (_data, _status, _headers, _config) {
                            deferred.resolve(wrapResponse(data, status, headers, config));
                        })
                        .error(function (data, status, headers, config) {
                            deferred.reject(wrapResponse(data, status, headers, config));
                        });
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(wrapResponse(data, status, headers, config));
                });


            return deferred.promise;
        },
        getManagers: function (id) {
            return HexaaService.getManagersOfService(id);
        },
        addEntitlement: function (sid, entitlement) {
            return HexaaService.addServiceEntitlement(sid,
                entitlement.uri,
                entitlement.name,
                entitlement.description).success(function (data, status, headers, config) {
                    entitlement.id = headers("Location").match("(.*)/api/entitlements/(.*)")[2];
                });
        },
        updateEntitlement: function (entitlement) {
            return HexaaService.updateEntitlement(entitlement.id,
                entitlement.uri,
                entitlement.name,
                entitlement.description);
        },
        getEntitlements: function (sid, pager) {
            var deferred = $q.defer();
            var entitlements = [];
            var request = HexaaService.getServiceEntitlements(sid);
            if (pager) {
                request = HexaaService.getServiceEntitlements(sid, (pager.currentPage - 1) * pager.itemPerPage, pager.itemPerPage)
            }
            
            request.success(function (data, status, header, config) {
                angular.forEach(data.items, function (entitlement) {
                    entitlements.push(ResourceEntity.new(entitlement));
                });
                deferred.resolve(wrapResponse({
                    items: entitlements,
                    item_number: data.item_number
                }, status, header, config));
            })
                .error(function (data, status, header, config) {
                    deferred.reject(wrapResponse(data, status, header, config));
                });
            return deferred.promise;
        },
        deleteEntitlement: function (eid) {
            return HexaaService.deleteEntitlement(eid);
        },
        getEntitlementpacks: function (sid, pager) {
            var deferred = $q.defer();
            var request = HexaaService.getServiceEntitlementPacks(sid);
            if (pager) {
                request = HexaaService.getServiceEntitlementPacks(sid, (pager.currentPage - 1) * pager.itemPerPage, pager.itemPerPage);
            }

            request.success(function (data, status, headers, config) {
                var entpacks = [];
                angular.forEach(data.items, function (entitlementpack) {
                    entpacks.push(EntitlementpacksProxy.new(entitlementpack));
                });
                deferred.resolve(wrapResponse({
                    items: entpacks,
                    item_number: data.item_number
                }, status, headers, config));
            })
                .catch(function (data, status, headers, config) {
                    deferred.reject(wrapResponse(data, status, headers, config));
                });
            return deferred.promise;
        },
        updateEntitlementpack: function (entitlementpack) {
            var deferred = $q.defer();

            HexaaService.updateEntitlementPack(entitlementpack.id, entitlementpack.name, entitlementpack.description, entitlementpack.type)
                .success(function (data, status, headers, config) {
                    HexaaService.setEntitlementPackEntitlements(entitlementpack.id, entitlementpack.entitlements.map(function (entitlement) {
                        return entitlement.id;
                    })).then(function (data) {
                        deferred.resolve(wrapResponse(data, status, headers, config));
                    }).catch(function (error) {
                        deferred.reject(wrapResponse(error, 420, headers, config));
                    })
                })
                .error(function (error, status, headers, config) {
                    deferred.reject(wrapResponse(error, status, headers, config));
                });

            return deferred.promise;
        },
        addEntitlementpack: function (sid, entitlementpack) {
            var deferred = $q.defer();

            HexaaService.addServiceEntitlementPack(sid, entitlementpack.name, entitlementpack.description, entitlementpack.type)
                .success(function (data, status, headers, config) {
                    entitlementpack.id = headers("Location").match("(.*)/api/entitlementpacks/(.*)")[2];
                    HexaaService.setEntitlementPackEntitlements(entitlementpack.id, entitlementpack.entitlements.map(function (entitlement) {
                        return entitlement.id;
                    })).success(function (data, status, headers, config) {
                        deferred.resolve(wrapResponse(data, status, headers, config));
                    }).error(function (data, status, headers, config) {
                        deferred.reject(wrapResponse(data, status, headers, config));
                    })
                })
                .error(function (error, status, headers, config) {
                    deferred.reject(wrapResponse(error, status, headers, config));
                });

            return deferred.promise;
        },
        getLinkedOrganizations: function (sid) {
            var deferred = $q.defer();
            /* TODO: Igazitani verbose=expand -hoz */
            HexaaService.getOrganizationsLinkedToService(sid).then(function (linked_orgs) {
                var connections = [];
                //connections = angular.copy(data.data);

                $q.all(
                    linked_orgs.data.items.map(function (connection) {
                        return $q.all([HexaaService.getOrganization(connection.organization_id), HexaaService.getEntitlementpack(connection.entitlement_pack_id)])
                            .then(function (data) {
                                connection["organization"] = data[0].data.name;
                                connection["entitlementpack"] = data[1].data.name;
                                connections.push(connection);
                            })
                            .catch(function (error) {
                                deferred.reject(wrapResponse(error, 420, null, null));
                            })
                    }))
                    .then(function (data) {
                        deferred.resolve(wrapResponse({
                            items: connections,
                            item_number: linked_orgs.data.item_number
                        }, 200, null, null));
                    })
                    .catch(function (error) {
                        deferred.resolve(wrapResponse(error, 420, null, null));
                    })

            });

            return deferred.promise;
        },
        acceptConnectionRequest: function (id, epid) {
            return HexaaService.acceptOrganizationToEntitlementpackageRequest(id, epid);
        },
        getInvitations: function (sid, pager) {
            var deferred = $q.defer();

            var request = null;
            if (pager === undefined) {
                request = HexaaService.getServiceInvitations(sid);
            }
            else {
                request = HexaaService.getServiceInvitations(sid, (pager.currentPage - 1) * pager.itemPerPage, pager.itemPerPage);
            }

            request
                .success(function (data, status, header, config) {
                    var result = [];
                    angular.forEach(data.items, function (invitation) {
                        result.push(InvitationsProxy.new(invitation));
                    });
                    deferred.resolve(wrapResponse({
                        items: result,
                        item_number: data.item_number
                    }, status, header, config))
                })
                .error(function (data, status, header, config) {
                    deferred.reject(wrapResponse(data, status, header, config))
                });

            return deferred.promise;
        },
        updateManagers: function (service) {
            return HexaaService.setServiceManagers(service.id, service.managers.map(function (manager) {
                return manager.id;
            }));
        },
        updateAttributeSpecifications: function (service) {
            return HexaaService.setServiceAttributeSpecifications(service.id, service.attrspecs.map(function (attrspec) {
                return {
                    attribute_spec: attrspec.id,
                    is_public: attrspec.is_public || false //default value is false
                };
            }));
        },
        acceptEntityIdRequest: function (id) {
            return HexaaService.acceptEntityIdRequest(id);
        },
        rejectEntityIdRequest: function (id) {
            return HexaaService.rejectEntityIdRequest(id);
        },
        deleteEntityIdRequest: function (id) {
            return HexaaService.deleteEntityIdRequest(id);
        },
        notifySP: function (id, contacts) {
            return HexaaService.notifySP(id, {contacts: contacts});
        },
        new: function (data) {
            return SercviceFactory.new(data)
        },
        addHook: function(hook) {
            return HexaaService.addHook(hook.name, hook.description, hook.url, hook.type, hook.service)
        },
        updateHook: function(hook) {
            return HexaaService.updateHook(hook.id,hook.name, hook.description, hook.url, hook.type, hook.service)
        },
        deleteHook: function(hook) {
            return HexaaService.deleteHook(hook.id);
        }
    };
    return Proxy;
}]);
