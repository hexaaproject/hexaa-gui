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

angular.module('hexaaApp.services.facades').factory('PrincipalProxy', ['$http', '$rootScope', '$q', 'HexaaService', 'ResourceEntity', 'PrincipalFactory',
    function ($http, $rootScope, $q, HexaaService, ResourceEntity, PrincipalFactory) {

        var proxy = {

            getPrincipal: function () {
                var deferred = $q.defer();
                var principal = {};

                $q.all({
                    principal: HexaaService.getPrincipal(),
                    memberships: HexaaService.getPrincipalMemberOrganizations(),
                    managedServices: HexaaService.getPrincipalManagedServices(),
                    managedOrganizations: HexaaService.getPrincipalManagedOrganizations(),
                    isAdmin: HexaaService.getIsAdmin()
                }).then(
                    function (data) {
                        principal = data.principal.data;
                        principal.memberships = data.memberships.data.items;
                        principal.managedServices = data.managedServices.data.items;
                        principal.managedOrganizations = data.managedOrganizations.data.items;
                        principal.isAdmin = data.isAdmin.data.is_admin;
                        principal.administrator = angular.copy(data.isAdmin.data.is_admin);

                        deferred.resolve(wrapResponse(PrincipalFactory.new(principal), 200, null, null));
                    }
                ).catch(function (error) {
                        deferred.reject(wrapResponse(error, 420, null, null));
                    });

                return deferred.promise;
            },
            getAttributeSpecifications: function () {

                return HexaaService.getPrincipalAttributeSpecifications();
            },
            getAttributeValuePrincipals: function (attspecId) {
                var deferred = $q.defer();
                var list = [];

                HexaaService.getAttributeValuePrincipalsPerAttributeSpecification(attspecId)
                    .success(function (values, status, headers, config) {
                        //We have a list of attributeValuePrincipals associated with an attributespecification
                        $q.all(values.items.map(function (attrValue) {
                            //For each attributeValuePrincipal query the associatedServices
                            return $q.all(attrValue.service_ids.map(function (serviceId) {
                                return HexaaService.getService(serviceId);
                            })).then(function (services) {
                                //associate with the value the linked services
                                attrValue.associatedServices = services.map(function (service) {
                                    return service.data;
                                });
                                list.push(ResourceEntity.new(attrValue));
                            });

                        })).then(function () {
                            //sum is a list of result
                            deferred.resolve(wrapResponse({
                                items: list,
                                item_number: list.length
                            }, status, headers, config));
                        });


                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject(wrapResponse(data, status, headers, config));
                    });

                return deferred.promise;
            },
            addAttributeValuePrincipal: function (attributeValue) {
                var associatedServices = attributeValue.associatedServices.map(function (service) {
                    return service.id;
                });
                var deferred = $q.defer();

                HexaaService.addAttributeValuePrincipal(attributeValue.attribute_spec_id, attributeValue.value, associatedServices)
                    .success(function (data, status, headers, config) {
                        attributeValue.id = headers("Location").match("(.*)/api/attributevalueprincipals/(.*)")[2];
                        deferred.resolve(wrapResponse(data, status, headers, config));
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject(wrapResponse(data, status, headers, config));
                    });

                return deferred.promise;
            },
            updateAttributeValuePrincipal: function (attributeValue) {
                return HexaaService.updateAttributeValuePrincipal(attributeValue.id, attributeValue.attribute_spec_id, attributeValue.value, attributeValue.associatedServices.map(function (service) {
                    return service.id;
                }));
            },
            deleteAttributeValuePrincipal: function (aid) {
                return HexaaService.deleteAttributeValuePrincipal(aid);
            },
            getRelatedServices: function (pager) {
                if (pager )
                    return HexaaService.getPrincipalRelatedServices((pager.currentPage - 1) * pager.itemPerPage, pager.itemPerPage);
                else
                    return HexaaService.getPrincipalRelatedServices();
            },
            getConsents: function () {
                return HexaaService.getConsents();
            },
            getServiceConsent: function (sid) {
                return HexaaService.getServiceConsent(sid);
            },
            getNews: function (skip, take, tags, services, organizations) {
                /*
                 var deferred = $q.defer();

                 var news = [];
                 var prom = [];
                 */
                return HexaaService.getPrincipalNews(skip, take, tags, services, organizations);
                /*    .success(function(data,status,headers,config)
                 {
                 if (data.length == 0) deferred.resolve(data);

                 news = angular.copy(data);

                 news.items.forEach(function(newsItem,i)
                 {
                 if (newsItem.principal_id != null)
                 prom.push(HexaaService.getPrincipalById(newsItem.principal_id).then(function(principal)
                 {
                 news[i].principal = principal.data;
                 }));
                 })

                 $q.all(prom).then(function()
                 {
                 deferred.resolve(wrapResponse({items: news, item_number: news.item_number},status,headers,config));
                 })
                 .catch(function(data)
                 {
                 deferred.reject(wrapResponse(data,420,headers,config));
                 });
                 })
                 .error(function(data,status,headers,config)
                 {
                 deferred.reject(wrapResponse(data,status,headers,config));
                 });

                 return deferred.promise;*/
            },
            updatePrincipal: function (principal) {
                return HexaaService.updatePrincipal(principal.id, principal.fedid, principal.email, principal.display_name);
            },
            addPrincipal: function (principal) {
                return HexaaService.addPrincipal(principal.fedid, principal.email, principal.display_name);
            },
            getPrincipals: function () {
                var deferred = $q.defer();
                HexaaService.getPrincipals().success(function (data, status, headers, config) {
                    var result = [];
                    angular.forEach(data.items, function (principal) {
                        result.push(PrincipalFactory.new(principal));
                    });
                    deferred.resolve(wrapResponse({
                        items: result,
                        item_number: data.item_number
                    }, status, headers, config));
                })
                    .error(function (data, status, headers, config) {
                        deferred.reject(wrapResponse(data, status, headers, config));
                    });
                return deferred.promise;
            },
            isAdmin: function () {
                return HexaaService.getIsAdmin();
            },
            getOrganizationMemberships: function () {
                return HexaaService.getPrincipalMemberOrganizations();
            },
            getManagedOrganizations: function () {
                return HexaaService.getPrincipalManagedOrganizations();
            },
            getManagedServices: function () {
                return HexaaService.getPrincipalManagedServices();
            },
            deletePrincipal: function (id) {
                return HexaaService.deletePrincipal(id);
            },
            getEntityIds: function () {
                return HexaaService.getUserEntityIds();
            },
            getRoles: function () {
                return HexaaService.getPrincipalRoles();
            },
            getMyOrganizations: function () {
                var deferred = $q.defer();

                HexaaService.getPrincipalRoles()
                    .success(function (data, status, header, config) {
                        var organization = $linq(data.items).groupBy("x => x.organization", null, "(x,y) => x.id == y.id").toArray();
                        deferred.resolve(wrapResponse({
                            items: organization,
                            item_number: organization.length
                        }, status, header, config));
                    })
                    .error(function (data, status, header, config) {
                        deferred.reject(wrapResponse(data, status, header, config));
                    });

                return deferred.promise;
            },
            getMyServices: function () {
                var deferred = $q.defer();

                HexaaService.getPrincipalEntitlements()
                    .success(function (data, status, header, config) {
                        var service = $linq(data.items).groupBy("x => x.service", null, "(x,y) => x.id == y.id").toArray();
                        deferred.resolve(wrapResponse({
                            items: service,
                            item_number: service.length
                        }, status, header, config));
                    })
                    .error(function (data, status, header, config) {
                        deferred.reject(wrapResponse(data, status, header, config));
                    });

                return deferred.promise;
            },
            new: function (data) {
                return PrincipalFactory.new(data);
            }

        };

        return proxy;

    }]);
