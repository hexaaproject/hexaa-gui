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

    angular.module('hexaaApp.components.services.controllers.pages').controller('ServiceEntitlementpacksCtrl',
        ['$scope', '$window', '$timeout', '$cookies', '$q', '$rootScope', '$translate', 'events', 'EntitlementpacksProxy', 'ServicesProxy', '$modal', 'dialogService', 'pageTitleService',
            function ($scope, $window, $timeout, $cookies, $q, $rootScope, $translate, events, EntitlementpacksProxy, ServicesProxy, $modal, dialogService, pageTitleService) {

                var namespace = "services.entitlementpacks.";

                /* FIELDS */
                $scope.service = {
                    id: -1,
                    entitlementpacks: []
                };

                /* Pager settings */
                $scope.pager = {
                    itemPerPage: 5, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: 0, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                /* INTERFACE */
                $scope.newEntitlementpack = editEntitlementpack;
                $scope.removeEntitlementpack = removeEntitlementpack;
                $scope.generateToken = generateToken;
                $scope.editEntitlementpack = editEntitlementpack;

                /* IMPLEMENTATION */
                function activate() {
                    $scope.$emit(events.serviceCanBeSaved, false);
                    $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);
                    $scope.$watch("pager.itemPerPage", onItemPerPageChanged);
                    $scope.$watch("pager.currentPage", onCurrentPageChanged);
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));

                }

                activate();

                function onItemPerPageChanged() {
                    refreshEntitlementpacks()
                }

                function onCurrentPageChanged() {
                    refreshEntitlementpacks()
                }


                function editEntitlementpack(entitlementpack) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/components/services/modals/newEntitlementpackDialog.html',
                        controller: 'ServicesEntitlementpacksNewCtrl as vm',
                        resolve: {
                            targetService: function () {
                                return $scope.service;
                            },
                            targetEntitlementpack: function () {
                                if (entitlementpack) {
                                    return entitlementpack;
                                }
                                else {
                                    var brandNew = EntitlementpacksProxy.new({
                                        type: 'private',
                                        id: -1,
                                        entitlements: [],
                                        service: {id: $scope.service.id}
                                    });
                                    return brandNew;
                                }
                            }
                        }
                    });
                    modalInstance.result.then(onEntitlementpackModalClosed);
                }


                /**
                 * remove entitlementpack
                 * @param id - entitlementpacks id to be removed
                 */
                function removeEntitlementpack(entitlementpack) {
                    if (entitlementpack.id != -1) {
                        dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                            $translate.instant(namespace + "msg.entitlementpackDeleteConfirmation",
                                {name: entitlementpack.name})).then(onRemoveEntitlementpackConfirmationClosed(entitlementpack));
                    }
                }

                /**
                 * undo changes in a entitlementpack
                 */

                function generateToken(entitlementpack) {
                    EntitlementpacksProxy.generateToken(entitlementpack.id)
                        .success(onGenerateTokenSuccess(entitlementpack))
                        .error(onGenerateTokenError);
                }

                /* CALLBACKS */
                function onGetEntitlementpacksError(error) {
                    //failed to load entitlementpacks
                    dialogService.error($translate.instant(namespace + "msg.entitlementpacksLoadError"));
                }

                function onGetEntitlementpacksSuccess(data) {
                    $scope.service.entitlementpacks = data.data.items;
                    $scope.service.entitlementpacks.saveMemento();
                    $scope.pager.totalItems = data.data.item_number;

                }

                function onGetServiceEntitlementsSuccess(data) {
                    $scope.service.entitlements = data.data.items;
                }

                function onGetServiceEntitlementsError(error) {
                    dialogService.error($translate.instant(namespace + "msg.entitlementsRefreshError"));
                }

                function refreshEntitlementpacks() {
                    if ($scope.service.id !== -1) {
                        ServicesProxy.getEntitlementpacks($scope.service.id, $scope.pager)
                            .then(onGetEntitlementpacksSuccess)
                            .catch(onGetEntitlementpacksError);
                    }
                }


                /**
                 * Service selection changed
                 * @param id
                 */
                function onServicesSelectionChanged(event, selectedService) {
                    if ($scope.selectedService) {
                        $scope.service = {id: selectedService};
                        //Query entitlementpacks of service
                        refreshEntitlementpacks();
                        //query entitlements of service
                        ServicesProxy.getEntitlements(selectedService)
                            .then(onGetServiceEntitlementsSuccess)
                            .catch(onGetServiceEntitlementsError);
                    }
                }

                function onEntitlementpackModalClosed(newItem) {
                    var index = $linq($scope.service.entitlementpacks).indexOf("x => x.id == " + newItem.id);
                    if (index === -1) {
                        $scope.service.entitlementpacks.push(newItem);
                        $scope.pager.totalItems++;
                    }
                    else {
                        $scope.service.entitlementpacks[index] = newItem;
                    }
                }


                function onEntitlementpackRemoveSuccess(entitlementpack) {
                    return function (data, status, headers, config) {
                        dialogService.success($translate.instant(namespace + "msg.entitlementpackRemoveSuccess"));
                        var index = $linq($scope.service.entitlementpacks).indexOf("x=>x.id == " + entitlementpack.id);
                        $scope.service.entitlementpacks.removeAt(index);
                        $scope.service.entitlementpacks.saveMemento();
                        $scope.pager.totalItems--;
                    }
                }

                function onEntitlementpackRemoveError(data, status, headers, config) {
                    dialogService.error($translate.instant(namespace + "msg.entitlementpackRemoveError") + data.message);
                }

                function onRemoveEntitlementpackConfirmationClosed(entitlementpack) {
                    return function (answer) {
                        if (answer == 'yes') {
                            EntitlementpacksProxy.remove(
                                entitlementpack.id
                            ).success(onEntitlementpackRemoveSuccess(entitlementpack)).
                                error(onEntitlementpackRemoveError);

                        }
                    }
                }


                function onGenerateTokenSuccess(entitlementpack) {
                    return function (data) {
                        entitlementpack.token = data.token;
                    }
                }

                function onGenerateTokenError(data) {
                    dialogService.error(data.message);
                }

            }]);

}());
