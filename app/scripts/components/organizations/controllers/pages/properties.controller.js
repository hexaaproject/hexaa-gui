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
        .controller('OrganizationPropertiesCtrl',
        ['$scope', 'OrganizationsFacade', '$translate', 'events', 'dialogService', 'pageTitleService','$q',
            function ($scope, OrganizationsFacade, $translate, events, dialogService, pageTitleService,$q) {

                //Translation namespace
                var namespace = "organizations.properties.";

                /* FIELDS */
                $scope.properties = {};

                /**
                 * Invoked when controller created
                 */
                function activate() {
                    $scope.$emit(events.organizationCanBeSaved, true);
                    $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
                    $scope.$on(events.organizationSave, onOrganizationSave);
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                activate();

                /**
                 * Invoked when failed to retrieve organization
                 * @param error
                 */
                function onGetOrganizationError(error) {
                    //Couldnt get the selected Organization
                    dialogService.error($translate.instant(namespace + "msg.organizationGetError"));
                }

                /**
                 * Invoked when retrievel of roles failed
                 * @param error Server response
                 */
                function onGetRolesError(error) {
                    //Couldnt get organization roles
                    dialogService.error($translate.instant(namespace + "msg.organizationRoleGetError"));
                }

                /**
                 * Invoked when data is ready
                 * @param data
                 */
                function onDataReady(data) {
                    //everything fine
                    if (data.organization)
                    {
                        $scope.properties = angular.copy(data.organization.data);
                    }
                    if (data.roles)
                    {
                        $scope.properties.roles = angular.copy(data.roles.data.items);
                    }
                }


                /**
                 * Invoked when organization selection changed
                 * @param event
                 * @param selectedOrganization
                 */
                function onOrganizationsSelectionChanged(event, selectedOrganization) {
                    if (selectedOrganization !== undefined) {

                        $q.all({
                            organization: OrganizationsFacade.getOrganization(selectedOrganization)
                                .catch(onGetOrganizationError),
                            roles: OrganizationsFacade.getRoles(selectedOrganization)
                                .catch(onGetRolesError)
                        })
                            .then(onDataReady);
                    }
                }

                /**
                 * Invoked when organization saved
                 * @param organization
                 * @returns {Function}
                 */
                function onOrganizationSaveSuccess(organization) {
                    return function (data) {
                        dialogService.success($translate.instant(namespace + "msg.organizationUpdateSuccess"));
                        $scope.$emit(events.organizationChanged, organization);
                    }
                }

                /**
                 * Invoked when service failed to save organization
                 * @param data
                 */
                function onOrganizationSaveError(data) {
                    dialogService.notifyUIError(data.data.errors);
                    dialogService.error($translate.instant(namespace + "msg.organizationUpdateError"));
                }

                /**
                 * Save currentorganization
                 */
                function onOrganizationSave(event, selectedOrganization) {
                    if ($scope.organizationPropertiesForm.$valid && (selectedOrganization !== undefined)) {

                        $scope.properties.save()
                            .then(onOrganizationSaveSuccess($scope.properties)).
                            catch(onOrganizationSaveError);
                    }
                }

            }]);

}());