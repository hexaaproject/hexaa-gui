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

angular.module('hexaaApp.services.facades')
    .factory('SecurityDomainsProxy', ['$http', '$rootScope', '$q', 'HexaaService', 'SecurityDomainFactory',
        function ($http, $rootScope, $q, HexaaService, SecurityDomainFactory) {

            /* Facade pattern definition */
            var proxy = {
                getAll: function () {
                    var deferred = $q.defer();
                    HexaaService.getSecurityDomains().
                        then(function (data) {
                            var domains = [];
                            angular.forEach(data.data.items,function(secdomain)
                            {
                                domains.push(proxy.new(secdomain));
                            });
                            deferred.resolve(wrapResponse({ items: domains, item_number: domains.length },data.status, data.headers, data.config));
                        },
                        function (error) {
                            deferred.reject(wrapResponse(error.data,error.status,error.headers,error.config));
                        });
                    return deferred.promise;
                },
                create: function (securityDomain) {
                    return HexaaService.addSecurityDomain(securityDomain.name, securityDomain.scoped_key, securityDomain.description);
                },
                update: function (securityDomain) {
                    return HexaaService.updateSecurityDomain(securityDomain.id, securityDomain.name, securityDomain.scoped_key, securityDomain.description);
                },
                delete: function (securityDomain) {
                    return HexaaService.deleteSecurityDomain(securityDomain.id);
                },
                setOrganizations: function (id, organizations) {
                    return HexaaService.setOrganizationsOfSecurityDomain(id,organizations);
                },
                setServices: function (id, services) {
                    return HexaaService.setServicesOfSecurityDomain(id,services);
                },
                new: function (data) {
                    return SecurityDomainFactory.new(data);
                },
                getScopedKeys: function()
                {
                    return HexaaService.getScopedKeys();
                }
            };

            return proxy;
        }]);
