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

angular.module('hexaaApp.services.facades').factory('AttributeSpecificationsFacade', ['$http', '$rootScope', '$q', 'HexaaService', 'AttributeSpecificationFactory',
    function ($http, $rootScope, $q, HexaaService, AttributeSpecificationFactory) {

        /* Facade pattern definition */
        var proxy = {
            getSupportingServices: function (attrspec) {
                var deferred = $q.defer();

                HexaaService.getServicesLinkedToAttributeSpecification(attrspec.id)
                    .success(function (data)
                    {
                        var list = data.items.map(function(item) { return item.service });
                        deferred.resolve(wrapResponse({
                            items: list,
                            item_number: data.item_number
                        }));
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject(wrapResponse(data, status, headers, config));
                    });

                return deferred.promise;
            },
            getAttributeSpecifications: function (pager) {
                var promise = null;
                if (pager ) {
                    promise = HexaaService.getAttributeSpecifications((pager.currentPage - 1) * pager.itemPerPage, pager.itemPerPage);
                }
                else {
                    promise = HexaaService.getAttributeSpecifications();
                }
                var deferred = $q.defer();
                promise
                    .success(function (data, status, headers, config) {
                        var result = [];
                        angular.forEach(data.items, function (value, key) {
                            result[key] = AttributeSpecificationFactory.new(value);
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
            delete: function (id) {
                return HexaaService.deleteAttributeSpecification(id);
            },
            update: function (attrspec) {
                return HexaaService.updateAttributeSpecification(attrspec.id, attrspec.uri, attrspec.name,
                    attrspec.maintainer,
                    attrspec.description, attrspec.syntax, attrspec.is_multivalue);
            },
            create: function (attrspec) {
                return HexaaService.addAttributeSpecification(attrspec.uri, attrspec.name,
                    attrspec.maintainer,
                    attrspec.description, attrspec.syntax, attrspec.is_multivalue
                );
            },

            new: function (data) {
                return AttributeSpecificationFactory.new(data);
            }
        };

        return proxy;
    }]);
