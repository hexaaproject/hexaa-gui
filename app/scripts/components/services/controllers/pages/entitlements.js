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

    angular.module('hexaaApp.components.services.controllers.pages')
        .controller('ServiceEntitlementsCtrl',
        ['$scope', 'ServicesProxy', '$translate', 'events', 'dialogService', 'EntitlementpacksProxy', 'ResourceEntity', 'pageTitleService', '$modal',
        function ($scope, ServicesProxy, $translate, events, dialogService, EntitlementpacksProxy, ResourceEntity, pageTitleService, $modal) {

            var namespace = "services.entitlements.";
            var vm = this;

            /* FIELDS */
            vm.service = {
                id: -1,
                entitlements: []
            };

            /* Pager settings */
            vm.pager = {
                itemPerPage: 5, //How many items will appear on a single page?
                maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                totalItems: 0, //Num of total items
                currentPage: 1,  //Currently selected page
                numPages: 0
            };

            /* INTERFACE */
            vm.newEntitlement = editEntitlement;
            vm.editEntitlement = editEntitlement;
            vm.deleteEntitlement = deleteEntitlement;
            vm.editEntitlement = editEntitlement;
            vm.save = save;

            /* IMPLEMENTATION */

            function activate() {
                $scope.$emit(events.serviceCanBeSaved, false);
                $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);
                $scope.$watch("vm.pager.itemPerPage", onItemPerPageChanged);
                $scope.$watch("vm.pager.currentPage", onCurrentPageChanged);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
            }

            activate();

            function onItemPerPageChanged() {
                if (vm.service.id !== -1)
                {
                    ServicesProxy.getEntitlements(vm.service.id, vm.pager)
                        .then(onGetEntitlementsSuccess);
                }
            }

            function onCurrentPageChanged() {
                if (vm.service.id !== -1)
                {
                    ServicesProxy.getEntitlements(vm.service.id, vm.pager)
                        .then(onGetEntitlementsSuccess);
                }
            }


            /* UI */

            /**
             * New entitlement button clicked
             */
            function editEntitlement(entitlementToEdit) {

                var entitlement = entitlementToEdit || ResourceEntity.new({
                        id: -1
                    });

                var modalInstance = $modal.open({
                    templateUrl: 'views/components/services/modals/newEntitlementDialog.html',
                    controller: 'ServiceEntitlementNewCtrl as vm',
                    resolve: {
                        targetEntitlement: function () {
                            entitlement.uri = removePrefix(entitlement.uri);
                            return entitlement;
                        },
                        prefix: function () {
                            return vm.prefix;
                        }
                    }
                });
                modalInstance.result.then(onNewEntitlementModalClosed);
            }

            function onNewEntitlementModalClosed(entitlement) {
                save(entitlement)
            }

            /**
             * Delete entitlement
             */
            function deleteEntitlement(entitlement) {
                dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                    $translate.instant(namespace + "msg.entitlementDeleteConfirm", {name: entitlement.name}))
                    .then(onDeleteEntitlementpackDialogClosed(entitlement));
            }

            function addPrefix(uri) {
                if (uri ) {
                    if (uri.indexOf(vm.prefix) !== -1) {
                        return uri;
                    }
                    else {
                        return vm.prefix + uri;
                    }
                }
                else {
                    return vm.prefix;
                }
            }

            function removePrefix(uri) {
                if (uri !== undefined) {
                    return uri.replace(vm.prefix, "");
                }
                else {
                    return "";
                }
            }

            /**
             * Save current service data
             */
            function save(entitlement) {
                if (vm.service.id != -1) {

                    entitlement.uri = addPrefix(entitlement.uri);

                    if (entitlement.id == -1) {
                        ServicesProxy.addEntitlement(vm.service.id, entitlement)
                            .then(onAddEntitlementSuccess(entitlement)).
                            catch(onAddEntitlementError(entitlement));
                    }
                    else {
                        //update
                        ServicesProxy.updateEntitlement(entitlement)
                            .then(onUpdateEntitlementSuccess(entitlement))
                            .catch(onUpdateEntitlementError(entitlement));
                    }

                }
            }

            /* CALLBACKS */

            /**
             * User services selection changed
             */
            function onServicesSelectionChanged(event, selectedService) {
                if (selectedService ) {

                    vm.service = {id: selectedService};
                    //Get Service entitlements
                    ServicesProxy.getEntitlements(selectedService, vm.pager)
                        .then(onGetEntitlementsSuccess);
                    //Get entitlementprefix
                    EntitlementpacksProxy.getEntitlementPrefix()
                        .then(onGetEntitlementPrefixSuccess);
                }
            }

            function onDeleteEntitlementError(error) {
                dialogService.error($translate.instant(namespace + "msg.entitlementpackUpdateError") + error.data.message);
            }

            function onDeleteEntitlementSuccess(entitlement) {
                return function (data) {
                    var index = $linq(vm.service.entitlements).indexOf("x=>x.id == " + entitlement.id);
                    vm.service.entitlements.removeAt(index);
                }
            }

            function onDeleteEntitlementpackDialogClosed(entitlement) {
                return function (answer) {
                    if (answer == 'yes') {
                        ServicesProxy.deleteEntitlement(entitlement.id).
                            then(onDeleteEntitlementSuccess(entitlement))
                            .catch(onDeleteEntitlementError);
                    }
                }
            }


            function onAddEntitlementSuccess(entitlement) {
                return function (data) {
                    entitlement.commit();
                    dialogService.success($translate.instant(namespace + "msg.entitlementpackAddSuccess"));
                    //local persist
                    vm.service.entitlements.push(entitlement);
                }
            }

            function onAddEntitlementError(entitlement) {
                return function (error) {
                    dialogService.notifyUIError(error.data.errors);
                    dialogService.error($translate.instant(namespace + "msg.entitlementpackAddError") + error.data.message);
                }
            }

            function onUpdateEntitlementSuccess(entitlement) {
                return function (data) {
                    entitlement.commit();
                    dialogService.success($translate.instant(namespace + "msg.entitlementpackUpdateSuccess"));
                    var index = $linq(vm.service.entitlements).indexOf("x => x.id == " + entitlement.id);
                    if (index !== -1) {
                        vm.service.entitlements[index] = entitlement;
                    }
                }
            }

            function onGetEntitlementsSuccess(data) {
                vm.service.entitlements = angular.copy(data.data.items);
                vm.pager.totalItems = data.data.item_number;
            }

            function onUpdateEntitlementError(entitlement) {
                return function (error) {
                    dialogService.notifyUIError(error.data.errors);
                    dialogService.error($translate.instant(namespace + "msg.entitlementpackUpdateError") + error.data.message);
                }
            }

            function onGetEntitlementPrefixSuccess(data) {
                vm.prefix = data.data.entitlement_base + ":" + vm.service.id + ":";
            }

        }]);
}());