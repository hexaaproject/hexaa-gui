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
    angular.module('hexaaApp.components.organizations.directives')
        .directive('hexaaOrganizationsRolesWidget',
        ['profileService','$filter',
            function (profileService,$filter) {

                var scope = {
                    filterBy: '=',
                    pageBy: '=',
                    organization: '=',
                    deleteRole: '&deleteRole',
                    editRole: '&editRole',
                    sendMail: '&sendMail'
                }

                var directive = {
                    restrict: 'A',
                    link: link,
                    scope: scope,
                    templateUrl: 'views/components/organizations/directives/hexaa-organizations-roles.html'
                };

                function link(scope, elem, attr) {

                    function activate() {
                        scope.profile = profileService.getProfile();
                        scope.$watch("filterBy", onFilterChanged);
                    }

                    activate();

                    function onFilterChanged(newValue,oldValue)
                    {
                        if(newValue )
                        {
                            scope.pageBy.totalItems = $filter("filter")(scope.organization.roles,scope.filterBy).length;
                            scope.pageBy.currentPage = 1;
                        }
                    }

                    scope.delete = remove;
                    scope.edit = edit;
                    scope.sendmail = sendmail;

                    function remove(role) {
                        if (scope.deleteRole !== undefined) {
                            scope.deleteRole({role: role});
                        }
                    }

                    function edit(role) {
                        if (scope.editRole !== undefined) {
                            scope.editRole({role: role});
                        }
                    }

                    function sendmail(role) {
                        if (scope.sendMail !== undefined) {
                            scope.sendMail({role: role});
                        }
                    }
                }

                return directive;
            }]);
}());