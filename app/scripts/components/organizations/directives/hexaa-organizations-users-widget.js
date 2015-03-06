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
    angular.module('hexaaApp.components.organizations.directives').directive('hexaaOrganizationsUsersWidget', ['profileService', function (profileService) {

        var scope = {
            organization: '=',
            revokePrincipal: '&revokePrincipal',
            proposePrincipal: '&proposePrincipal',
            removePrincipal: '&removePrincipal',
            filterText: '='
        }

        var directive = {
            restrict: 'A',
            link: link,
            scope: scope,
            templateUrl: 'views/components/organizations/directives/hexaa-organizations-users-widget.html'
        };

        function link(scope, elem, attr) {

            function activate() {
                scope.profile = profileService.getProfile();
            }

            activate();

            scope.revoke = revoke;
            scope.propose = propose;
            scope.remove = remove;

            function revoke(principal) {
                if (scope.revokePrincipal !== undefined) {
                    scope.revokePrincipal({principal: principal});
                }
            }

            function propose(principal) {
                if (scope.proposePrincipal !== undefined) {
                    scope.proposePrincipal({principal: principal});
                }
            }

            function remove(principal) {
                if (scope.removePrincipal !== undefined) {
                    scope.removePrincipal({principal: principal});
                }
            }
        }

        return directive;
    }]);
}());