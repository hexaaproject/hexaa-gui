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
        .controller('ServiceOwnerCtrl',
        ['$scope',  'ServicesFacade',  '$translate', 'events', '$upload', '$q', 'dialogService', 'pageTitleService',
        function ($scope, ServicesFacade, $translate, events, $upload, $q, dialogService, pageTitleService) {

            var namespace = "services.owner.";

            /* FIELDS */
            $scope.service = {
                id: -1
            };

            /* INTERFACE */

            /* IMPLEMENTATION */
            function activate() {
                $scope.$emit(events.serviceCanBeSaved, true);
                $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);
                $scope.$on(events.serviceSave, onServiceSave);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));

            }

            activate();

            /* CALLBACKS*/

            function onGetServiceSuccess(data) {
                $scope.owner = angular.copy(data.data);
            }


            function onGetServiceError(data) {

            }

            /**
             * Service selection changed
             * @param id  - service id
             */
            function onServicesSelectionChanged(event, selectedService) {
                if (selectedService != -1) {
                    ServicesFacade.getService(selectedService)
                        .then(onGetServiceSuccess)
                        .catch(onGetServiceError);
                }
            }


            function onUpdateServiceSuccess(data) {
                dialogService.success($translate.instant(namespace + "msg.ownerUpdateSuccess"));
            }

            function onUpdateServiceError(error) {
                dialogService.notifyUIError(error.data.errors);
                dialogService.error($translate.instant(namespace + "msg.ownerUpdateError") + error.data.message);
            }

            /**
             * Save current service
             */
            function onServiceSave(event, selectedService) {
                if ((selectedService  ) && ($scope.ownerForm.$valid)) {
                    ServicesFacade.updateService($scope.owner)
                        .then(onUpdateServiceSuccess)
                        .catch(onUpdateServiceError);
                }
            }


        }]);
}());
