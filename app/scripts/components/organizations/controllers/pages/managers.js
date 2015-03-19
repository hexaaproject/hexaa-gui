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
        .controller('OrganizationManagersCtrl',
        ['$scope', 'OrganizationsProxy', 'PrincipalProxy', '$cookies', '$translate', 'events', 'dialogService', 'pageTitleService',
            function ($scope, OrganizationsProxy, PrincipalProxy, $cookies, $translate, events, dialogService, pageTitleService) {

                var namespace = "organizations.managers.";

                /*Scope variables*/

                $scope.organization = {};

                /* IMPLEMENTATION */

                /**
                 * Invoked when controller created
                 */
                function activate() {
                    $scope.$emit(events.organizationCanBeSaved, true);
                    $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
                    $scope.$on(events.organizationSave, onOrganizationSave);
                    //load principals

                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));

                }

                activate();

                /* CALLBACKS */

                /**
                 * Save organization managers
                 * @param event
                 * @param selectedOrganization
                 */
                function onOrganizationSave(event, selectedOrganization) {
                    if (($scope.organization.id != -1) && (selectedOrganization != undefined)) {
                        OrganizationsProxy.updateManagers($scope.organization)
                            .then(onUpdateManagersSuccess)
                            .catch(onUpdateManagersError);
                    }
                }

                /**
                 * Invoked when updating managers was successful
                 * @param data
                 */
                function onUpdateManagersSuccess(data) {
                    dialogService.success($translate.instant(namespace + "msg.managerUpdateSuccess"));
                }

                /**
                 * Invoked when updating managers was unsuccessful
                 * @param error
                 */
                function onUpdateManagersError(error) {
                    dialogService.error($translate.instant(namespace + "msg.managerUpdateFail"));
                    //restore previous state
                    $scope.organization.managers.restoreMemento();
                }

                /**
                 * Invoked when principals are retrieved
                 * @param data
                 */
                function onPrincipalsLoaded(data) {
                    $scope.principals = angular.copy(data.data.items);
                }

                /**
                 * Invoked when loading principals failed
                 * @param error
                 */
                function onPrincipalLoadError(error) {
                    dialogService.error($translate.instant(namespace + "msg.principalsRetrieveError"));
                }

                /**
                 * Invoked when managers loaded
                 * @param data
                 */
                function onManagersLoaded(data) {
                    $scope.organization.managers = angular.copy(data.data.items);
                    $scope.organization.managers.saveMemento();
                }

                /**
                 * Invoked when retrieving manager list failed
                 * @param data
                 */
                function onManagersLoadError(data) {
                    dialogService.error($translate.instant(namespace + "msg.principalsRetrieveError"));
                }

                /**
                 * if selection changed by the user load the corresponding data
                 * @param selectedOrganization
                 */
                function onOrganizationsSelectionChanged(event, selectedOrganization) {
                    $scope.organization = {id: selectedOrganization};

                    if (
                        (selectedOrganization != -1) &&
                        $scope.profile.isManagerOfOrganization(selectedOrganization)) {

                        OrganizationsProxy.getMembers(selectedOrganization)
                            .then(onPrincipalsLoaded)
                            .catch(onPrincipalLoadError);

                        OrganizationsProxy.getManagers(selectedOrganization)
                            .then(onManagersLoaded)
                            .catch(onManagersLoadError);
                    }
                    else {
                        $scope.navigate("#/");
                    }

                }

            }]);

}());