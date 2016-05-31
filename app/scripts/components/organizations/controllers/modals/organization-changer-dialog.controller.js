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

    angular.module('hexaaApp.components.organizations.controllers.modals')
        .controller('OrganizationChangerController', ['$modalInstance', 'organizations', '$scope','$filter',
            function ($modalInstance, organizations, $scope,$filter) {
                var namespace = "modals.organizationChanger.";

                var vm = this;

                /*INTERFACE*/
                vm.close = close;
                vm.organizations = organizations;
                vm.select = select;

                /* Pager settings */
                vm.pager = {
                    itemPerPage: 5, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: organizations.length, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };


                /*IMPLEMENTATION*/

                /**
                 * Invoked when controller created
                 */
                function activate() {
                    $scope.$watch("vm.organizationFilter", onFilterChanged);
                }

                activate();

                function onFilterChanged(newValue, oldValue) {
                    if (oldValue)
                    {
                        vm.pager.totalItems = $filter("filter")(vm.organizations,vm.organizationFilter).length;
                        vm.pager.currentPage = 1;
                    }
                }

                /**
                 * Dialog close clicked
                 */
                function close() {
                    $modalInstance.dismiss();
                }

                /**
                 * Invoked when an organization has been selected
                 * @param organization Selected organization
                 */
                function select(organization) {
                    $modalInstance.close(organization);
                }

            }]);
}());
