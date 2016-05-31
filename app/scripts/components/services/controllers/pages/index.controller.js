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

    angular.module('hexaaApp.components.services.controllers.pages').controller('ServicesCtrl', [
        '$scope', 'ServicesFacade', '$route', '$translate', 'events', 'dialogService', '$location',
        'settingsService', '$modal', 'pageTitleService',
        function ($scope, ServicesFacade, $route, $translate, events, dialogService, $location, settingsService, $modal, pageTitleService) {

            var namespace = "services.index.";

            /*Variables*/
            $scope.services = []; //List of services;
            $scope.canBeSaved = true; // show save service button?
            $scope.Page = pageTitleService;
            $scope.selectedService = null;

            /* INTERFACE */
            $scope.resendEntityIdAuth = resendEntityIdAuth;
            $scope.selectionChanged = selectionChanged;
            $scope.deleteService = deleteService;
            $scope.openServiceChanger = openServiceChanger;
            $scope.contact = contact;

            $scope.MailTargetEnum = MailTargetEnum;

            /*IMPLEMENTATION*/

            function activate() {
                //Load requested page or news by default
                $scope.$parent.page = $route.current.params["page"] || "news";

                $scope.$on(events.serviceCanBeSaved, onServiceCanBeSaved);
                $scope.$on(events.serviceChanged, onServiceChanged);
                ServicesFacade.getServices().then(getServicesSuccess); //Load Services

                pageTitleService.setPageTitle($translate.instant(namespace + "lbl.title"));
            }

            activate();

            function onServiceCanBeSaved(event, canBeSaved) {
                $scope.canBeSaved = canBeSaved;
            }


            function onNotifySPSuccess(data) {
                dialogService.success($translate.instant(namespace + "msg.serviceSPNotifySuccess"));
            }

            function onNotifySPError(error) {
                dialogService.error($translate.instant(namespace + "msg.serviceSPNotifyError"));
            }

            function onEntityIdsModalClosed(service) {
                return function (contact) {
                    if (contact !== 'close') {
                        ServicesFacade.notifySP(service.id, contact)
                            .then(onNotifySPSuccess)
                            .catch(onNotifySPError);
                    }
                }
            }

            function onGetEntityIdsSuccess(service) {
                return function (data) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/components/services/modals/entity-id-contact-dialog.html',
                        controller: 'EntityIdContactDialogController',
                        resolve: {
                            entityIds: function () {
                                return data.data.items[service.entityid];
                            }
                        }
                    });

                    modalInstance.result.then(onEntityIdsModalClosed(service));
                }
            }

            function resendEntityIdAuth(service) {
                ServicesFacade.getEntityIds()
                    .then(onGetEntityIdsSuccess(service));
            }


            function getServicesSuccess(data) {
                //assign data to the bound variable
                $scope.services = angular.copy(data.data.items);
                if ($route.current.params["id"] ) {
                    var selected = $linq($scope.services).where("x=>x.id==" + $route.current.params["id"]).singleOrDefault(undefined);
                }
                else if (settingsService.get("selectedService") != null ) {
                    //carry selected service between sites
                    var selected = $linq($scope.services).where("x=>x.id==" + settingsService.get("selectedService")).singleOrDefault(undefined);
                }

                if (selected !== undefined)
                    $scope.selectionChanged(selected);
                else
                    $scope.openServiceChanger();

            }

            /**
             * User's service selection changed
             * @param id - The id of the selected service
             */
            function selectionChanged(item) {
                $scope.selectedService = item;
                if ($scope.selectedService ) {
                    settingsService.set("selectedService", item.id);
                    $scope.$broadcast(events.servicesSelectionChanged, item.id);
                }
            }

            /**
             * delete currently selected services
             */
            function deleteService(service) {
                if (service ) {

                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                        $translate.instant(namespace + "msg.serviceDeleteConfirm", {name: service.name}))
                        .then(onDeleteServiceDialogClosed(service));
                }

            }

            /**
             * User clicked save service button, tell the active child to handle it
             * @returns {undefined}
             */
            $scope.saveService = function saveService(service) {
                if (service !== undefined) {
                    //Saving existing
                    $scope.$broadcast(events.serviceSave, service.id);
                }
                else {
                    //Creating new
                    $scope.$broadcast(events.serviceSave, -1);
                }
            };


            /* CALLBACKS */
            function onDeleteServiceSuccess(service) {
                return function (data) {
                    //service removed
                    dialogService.success($translate.instant(namespace + "msg.serviceDeleteSuccess"));
                    settingsService.set("selectedService", null);
                    //remove from list
                    var index = $linq($scope.services).indexOf("x=>x.id==" + service.id);
                    $scope.services.removeAt(index);

                    $scope.navigate("#/");
                }
            }

            function onDeleteServiceError(error) {
                dialogService.error($translate.instant(namespace + "msg.serviceDeleteError") + error.data.message);
            }

            function onDeleteServiceDialogClosed(service) {
                return function (answer) {
                    if (answer == 'yes') {
                        ServicesFacade.deleteService(service.id)
                            .then(onDeleteServiceSuccess(service))
                            .catch(onDeleteServiceError);
                    }
                }
            }

            function onServiceChanged(event, service) {
                var index = $linq($scope.services).indexOf("x=>x.id == service.id");
                $scope.services[index] = service;
            }

            function onServiceChangerClosed(org) {
                if (org !== null)
                    selectionChanged(org);
            }

            function onServiceChangerDismissed() {

                if ($scope.selectedService === null) {
                    $scope.navigate("#/");
                }
            }

            function openServiceChanger() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/components/services/modals/service-changer-dialog.html',
                    controller: 'ServiceChangerController as vm',
                    resolve: {
                        services: function () {
                            return $scope.services;
                        }
                    }
                });
                modalInstance.result.then(onServiceChangerClosed, onServiceChangerDismissed);
            }

            function contact(target,recipient)
            {
                dialogService.showMailer(target,recipient);
            }

        }]);

}());
