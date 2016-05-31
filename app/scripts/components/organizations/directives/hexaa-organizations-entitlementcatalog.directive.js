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


(function () {
    'use strict';
    angular.module('hexaaApp.components.organizations.directives').directive('hexaaOrganizationsEntitlementcatalogWidget', ['profileService', function (profileService) {

        var scope = {
            organization: '=',
            entitlementpacks: '=',
            showServiceDetails: '&showServiceDetails',
            addEntitlementpack: '&addEntitlementpack',
            removeEntitlementpack: '&removeEntitlementpack'
        };

        var directive = {
            restrict: 'A',
            link: link,
            scope: scope,
            templateUrl: 'views/components/organizations/directives/hexaa-organizations-entitlementcatalog.html'
        };

        function link(scope, elem, attr) {

            scope.isAttached = isAttached;
            scope.getStatus = getStatus;
            scope.add = add;
            scope.remove = remove;
            scope.isAttached = isAttached;
            scope.getStatus = getStatus;
            scope.showService = showService;

            function isAttached(epack) {
                if (scope.organization.entitlementpacks && epack ) {
                    var pos = $linq(scope.organization.entitlementpacks).indexOf("x => x.id == " + epack.id);
                    return (pos >= 0);
                }
                return false;
            }

            function getStatus(id) {
                var q = $linq(scope.organization.entitlementpacks).where("x=>x.id == " + id).singleOrDefault(null);
                if (q !== null)
                    return q.status;
                else
                    return null;
            }

            function add(entitlementpack) {
                if (scope.addEntitlementpack !== undefined) {
                    scope.addEntitlementpack({entitlementpack: entitlementpack});
                }
            }

            function remove(entitlementpack) {
                if (scope.removeEntitlementpack !== undefined) {
                    scope.removeEntitlementpack({entitlementpack: entitlementpack});
                }
            }

            function showService(id) {
                if (scope.showServiceDetails !== undefined) {
                    scope.showServiceDetails({id: id});
                }
            }


        }

        return directive;
    }]);
}());