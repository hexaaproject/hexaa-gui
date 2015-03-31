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

    angular.module('hexaaApp.components.organizations.controllers.pages')
        .controller('OrganizationPublicCatalogCtrl',
        ['$scope', 'EntitlementpacksProxy', 'OrganizationsProxy', 'events', '$translate', '$modal', 'dialogService', 'pageTitleService',
            function ($scope, EntitlementpacksProxy, OrganizationsProxy, events, $translate, $modal, dialogService, pageTitleService) {

                var namespace = "organizations.public_catalog.";
                var vm = this;

                vm.entitlementpacks = [];
                vm.organization = {};

                /* INTERFACES */
                vm.showServiceDetails = dialogService.showServiceDetails;
                vm.add = add;
                vm.remove = remove;

                /* Pager settings */
                vm.pager = {
                    itemPerPage: 25, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: 0, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                /**
                 * Invokes when controller created
                 */
                function activate() {
                    $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
                    $scope.$emit(events.organizationCanBeSaved, false);
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                    $scope.$watch("pager.currentPage", onCurrentPageChanged);
                    $scope.$watch("pager.itemPerPage", onItemPerPageChanged);
                }

                activate();

                /**
                 * Invoked when current page changed
                 * @param newValue
                 * @param oldValue
                 */
                function onCurrentPageChanged(newValue, oldValue) {
                    if (vm.organization.id != -1) {
                        EntitlementpacksProxy.getPublicEntitlementpacks(vm.pager)
                            .then(onGetPublicEntitlementpacksSuccess);
                    }
                }

                /**
                 * Invoked when item per page changed
                 * @param newValue
                 * @param oldValue
                 */
                function onItemPerPageChanged(newValue, oldValue) {
                    if (vm.organization.id != -1) {
                        EntitlementpacksProxy.getPublicEntitlementpacks(vm.pager)
                            .then(onGetPublicEntitlementpacksSuccess);
                    }
                }

                /**
                 * Adds an entitlementpack to the organization
                 * @param entitlementpack entitlementpack to be added
                 */
                function add(entitlementpack) {
                    OrganizationsProxy.addEntitlementpack(vm.organization, entitlementpack)
                        .then(onAddEntitlementpackSuccess(entitlementpack))
                        .catch(onAddEntitlementpackError);
                }

                /**
                 * Removes an entitlementpack from the service
                 * @param entitlementpack entitlementpack to be removed
                 */
                function remove(entitlementpack) {
                    OrganizationsProxy.deleteEntitlementpack(vm.organization.id, entitlementpack.id)
                        .then(onDeleteEntitlementpackSuccess(entitlementpack))
                        .catch(onDeleteEntitlementpackError);
                }


                /* CALLBACK */

                /**
                 * Invoked when public entitlementpacks retrieved
                 * @param data public entitlementpacks
                 */
                function onGetPublicEntitlementpacksSuccess(data) {
                    vm.entitlementpacks = data.data.items;
                    vm.pager.totalItems = data.data.item_number;
                }

                /**
                 * Invoked when error occured during the delete process
                 * @param data
                 */
                function onDeleteEntitlementpackError(data) {
                    dialogService.error($translate.instant("organizations.public_catalog.msg.entitlementpackRemoveError"));
                }

                /**
                 * Invoked when entitlementpack deleted
                 * @param epack entitlementpack that was deleted
                 * @returns {Function}
                 */
                function onDeleteEntitlementpackSuccess(epack) {
                    return function (data) {
                        var index = $linq(vm.organization.entitlementpacks).indexOf("x=>x.id==" + epack.id);
                        vm.organization.entitlementpacks.splice(index, 1);
                        dialogService.success($translate.instant("organizations.public_catalog.msg.entitlementpackRemoveSuccess"));

                    }
                }

                /**
                 * Invoked when an entitlementpack was added
                 * @param epack the entitlementpack that was added to the organization
                 * @returns {Function}
                 */
                function onAddEntitlementpackSuccess(epack) {
                    return function (data) {
                        vm.organization.entitlementpacks.push(epack);
                        dialogService.success($translate.instant("organizations.public_catalog.msg.entitlementpackAddSuccess"));
                    }
                }

                /**
                 * Invoekd when selected organization changed
                 * @param event
                 * @param selectedOrganization
                 */
                function onOrganizationsSelectionChanged(event, selectedOrganization) {
                    if (selectedOrganization) {
                        vm.organization = {id: selectedOrganization};

                        OrganizationsProxy.getEntitlementpacks(selectedOrganization)
                            .then(onGetEntitlementpacksSuccess);
                    }
                }

                /**
                 * Invoked when entitlementpacks retrieved
                 * @param data entitlementpacks
                 */
                function onGetEntitlementpacksSuccess(data) {
                    vm.organization.entitlementpacks = data.data.items;
                }

                /**
                 * Invoked when failed to add an entitlementpack
                 * @param data
                 */
                function onAddEntitlementpackError(data) {
                    dialogService.error($translate.instant("organizations.public_catalog.msg.entitlementpackAddError"));
                }


            }]);
}());
