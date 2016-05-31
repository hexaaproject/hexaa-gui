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
        .controller('ServiceManagersCtrl', ['$scope', 'ServicesFacade', '$cookies', '$translate', 'events', 'PrincipalFacade', 'dialogService', 'pageTitleService',
        function ($scope, ServicesFacade, $cookies, $translate, events, PrincipalFacade, dialogService, pageTitleService) {

            var namespace = "services.managers.";

            /*Scope variables*/

            $scope.service = {};
            $scope.principals = []; //System principals

            function activate() {
                $scope.$emit(events.serviceCanBeSaved, true);
                $scope.$on(events.serviceSave, onServiceSave);
                $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);

                if ($scope.profile.isAdmin) {
                    PrincipalFacade.getPrincipals()
                        .then(onGetPrincipalsSuccess)
                        .catch(onGetPrincipalsError);
                }

                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
            }

            activate();

            /**
             * if selection changed by the user load the corresponding data to the UI
             * @param id - Id of the selected service
             */
            function onServicesSelectionChanged(event, selectedService) {
                $scope.service = {id: selectedService};

                if (selectedService ) {
                    //load managers for the newly selected service
                    ServicesFacade.getManagers(selectedService)
                        .then(onGetManagersSuccess)
                        .catch(onGetManagersError);
                }
            }


            /**
             * Save current service data
             */
            function onServiceSave(event, selectedService) {
                if ((selectedService ) &&
                    ($scope.service.id != -1)) {
                    ServicesFacade.updateManagers($scope.service)
                        .success(onUpdateManagersSuccess)
                        .error(onUpdateManagersError);
                }

            }

            function onGetPrincipalsSuccess(data) {
                $scope.principals = angular.copy(data.data.items);
            }

            function onGetPrincipalsError(error) {

            }

            function onGetManagersSuccess(data) {
                $scope.service.managers = angular.copy(data.data.items);
                $scope.service.managers.saveMemento();

                if ($linq($scope.principals).intersect($scope.service.managers, "(x,y) => x.fedid == y.fedid")
                        .toArray().length != $scope.service.managers.length )
                {
                    /* A few managers are not in the principal list (they might have been deleted or the a
                        manager isnt admin so we need to put the managers into the principal array
                     */

                    $scope.principals = $linq($scope.principals).union( $scope.service.managers, "(x,y) => x.fedid == y.fedid")
                        .toArray();
                }

            }

            function onGetManagersError(error) {
                //Couldnt get the manager list
            }

            function onUpdateManagersSuccess(data) {
                dialogService.success($translate.instant(namespace + "msg.managerUpdated "));
                $scope.service.managers.saveMemento();
            }

            function onUpdateManagersError(error) {
                dialogService.error($translate.instant(namespace + "msg.managerFailedToUpdate"));
                $scope.service.managers.restoreMemento();
            }

        }]);

}());