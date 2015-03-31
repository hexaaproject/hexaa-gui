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
        .controller('OrganizationMembersCtrl',
        ['$scope', 'HexaaService', 'PrincipalProxy', '$translate', 'events', 'OrganizationsProxy', 'dialogService', 'pageTitleService',
            function ($scope, HexaaService, PrincipalProxy, $translate, events, OrganizationsProxy, dialogService, pageTitleService) {

                //Namespace of the corresponding language file
                var namespace = "organizations.members.";

                $scope.organization = {};
                $scope.principals = [];

                /**
                 * if selection changed by the user load the corresponding data
                 * @param selectedOrganization
                 */
                function onOrganizationsSelectionChanged(event, selectedOrganization) {
                    if ($scope.profile.isAdmin
                        && (selectedOrganization )) {
                        $scope.organization = {id: selectedOrganization};

                        OrganizationsProxy.getMembers(selectedOrganization)
                            .then(onGetMembersSuccess)
                            .catch(onGetMembersError);
                    }
                    else {
                        $scope.navigate("#/");
                    }

                }

                /**
                 * Invoked when controller created
                 */
                function activate() {
                    $scope.$on(events.organizationSave, onOrganizationSave);
                    $scope.$emit(events.organizationCanBeSaved, true);
                    $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
                    if ($scope.profile.isAdmin) {
                        PrincipalProxy.getPrincipals()
                            .then(onGetPrincipalsSuccess)
                            .catch(onGetPrincipalsError);
                    }
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));

                }

                activate();

                /**
                 * Invoked when retrieving members failed
                 * @param data
                 */
                function onGetMembersError(data) {
                    dialogService.error($translate.instant(namespace + "msg.memberRetrieveError"));
                }

                /**
                 * Invoked when retrieving members was successful
                 * @param data
                 */
                function onGetMembersSuccess(data) {
                    $scope.organization.members = angular.copy(data.data.items);
                    $scope.organization.members.saveMemento();

                }

                function onGetPrincipalsError(error) {
                    dialogService.error($translate.instant(namespace + "msg.principalsRetrieveError"));
                }

                /**
                 * Invoked when principals are retrieved
                 * @param data
                 */
                function onGetPrincipalsSuccess(data) {
                    //GetPrincipals nincs lapozva
                    $scope.principals = angular.copy(data.data.items);
                }

                /**
                 * Invoked when organization saved
                 * @param data
                 */
                function onOrganizationSaveSuccess(data) {
                    dialogService.success($translate.instant(namespace + "msg.memberUpdateSuccess"));
                }

                /**
                 * Invoked when saving organization failed
                 * @param error
                 */
                function onOrganizationSaveError(error) {
                    //notify error
                    dialogService.error($translate.instant(namespace + "msg.memberUpdateFail"));
                    //restore original state
                    $scope.organization.members.restoreMemento();
                }

                /**
                 * save current organizations manager data
                 */
                function onOrganizationSave(event, selectedOrganization) {
                    OrganizationsProxy.updateMembers($scope.organization)
                        .then(onOrganizationSaveSuccess)
                        .catch(onOrganizationSaveError);
                }

            }]);
}());
