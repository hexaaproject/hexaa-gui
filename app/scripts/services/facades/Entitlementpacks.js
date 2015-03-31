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

angular.module('hexaaApp.services.facades').factory('EntitlementpacksProxy', ['$http', '$rootScope', '$q', 'HexaaService', 'ResourceEntity', '$injector', 'EntitlementpackFactory',
    function ($http, $rootScope, $q, HexaaService, ResourceEntity, $injector, EntitlementpackFactory) {

        var proxy = {
            generateToken: function (id) {
                return HexaaService.generateEntitlementpackToken(id);
            },
            getPublicEntitlementpacks: function (pager) {
                if (pager ) {
                    return HexaaService.getPublicEntitlementpacks((pager.currentPage - 1) * pager.itemPerPage, pager.itemPerPage);
                }
                else {
                    return HexaaService.getPublicEntitlementpacks();
                }
            },
            getEntitlements: function (id) {
                var deferred = $q.defer();
                var ents = [];

                HexaaService.getEntitlementsOfEntitlementPack(id)
                    .success(function (data, status, headers, config) {
                        angular.forEach(data, function (ent) {
                            ents.push(EntitlementpackFactory.new(ent));
                        });
                        deferred.resolve(wrapResponse(ents, status, headers, config));
                    })
                    .catch(function (error, status, headers, config) {
                        deferred.resolve(wrapResponse(error, status, headers, config));
                    });
                return deferred.promise;
            },
            remove: function (id) {
                return HexaaService.deleteEntitlementPack(id);
            },
            getEntitlementPrefix: function () {
                return HexaaService.getApiProperties();
            },
            getEntitlementpackEntitlements: function (eid) {
                return HexaaService.getEntitlementpackEntitlements(eid);
            },
            new: function (data) {
                return EntitlementpackFactory.new(data);
            }
        };

        return proxy;
    }]);
