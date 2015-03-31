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
        .controller('OrganizationsCtrl',
        ['$scope', 'OrganizationsProxy', '$route', '$translate', 'events', 'dialogService', 'settingsService', '$modal', 'pageTitleService',
        function ($scope, OrganizationsProxy, $route, $translate, events, dialogService, settingsService, $modal, pageTitleService) {

            //Namespace of the translations
            var namespace = "organizations.index.";

            $scope.Page = pageTitleService;
            $scope.canBeSaved = true; //show save organization button?
            $scope.organizations = []; //list of organizations
            $scope.selectedOrganization = null;

            /* INTERFACE */
            $scope.selectionChanged = selectionChanged;
            $scope.deleteOrganization = deleteOrganization;
            $scope.saveOrganization = saveOrganization;
            $scope.openOrganizationChanger = openOrganizationChanger;

            /*IMPLEMENTATION*/


            /**
             * I define a stub selection event, but subpages will override it with their own selection logic
             * @param item the selected organization
             */
            function selectionChanged(item) {
                $scope.selectedOrganization = item;

                if (item) {
                    $scope.$broadcast(events.organizationsSelectionChanged, item.id);
                    settingsService.set("selectedOrganization", item.id);
                }
            }


            /**
             * save button clicked, tell the active child, so it can handle it
             */
            function saveOrganization() {
                $scope.$broadcast(events.organizationSave, settingsService.get("selectedOrganization"));
            }

            /**
             * delete currently selected organization
             */
            function deleteOrganization(organization) {
                if (organization) {
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                        $translate.instant(namespace + "msg.organizationDeleteConfirm", {name: organization.name}))
                        .then(onDeleteOrganizationDialogAnswered(organization));
                }
            }

            /**
             * Invoked when controller activated
             */
            function activate() {
                $scope.$parent.page = $route.current.params["page"] || "news";
                $scope.$on(events.organizationCanBeSaved, onOrganizationCanBeSaved);
                $scope.$on(events.organizationChanged, onOrganizationChanged);
                //set properties as the default tab
                if ($scope.page == undefined) {
                    $scope.$parent.page = "news";
                }

                OrganizationsProxy.getOrganizations()
                    .then(onGetOrganizationsListSuccess)
                    .catch(onGetOrganizationsListError);

                pageTitleService.setPageTitle($translate.instant(namespace + "lbl.title"));
            }

            activate();

            /* CALLBACKS */

            /**
             * Invoked when selected organization changed
             * @param event
             * @param organization the selected organization
             */
            function onOrganizationChanged(event, organization) {
                var index = $linq($scope.organizations).indexOf("x => x.id == " + organization.id);

                if (!angular.equals($scope.organizations[index], organization)) {
                    angular.copy(organization, $scope.organizations[index]);
                }
            }

            /**
             * Invoked when a child controller says it can/cannot save the organization
             * @param event
             * @param canBeSaved
             */
            function onOrganizationCanBeSaved(event, canBeSaved) {
                $scope.canBeSaved = canBeSaved;
            }

            /**
             * Invoked when organization list retrieved
             * @param data Server response
             */
            function onGetOrganizationsListSuccess(data) {
                //assign data to the bound variable
                $scope.organizations = data.data.items;

                //retrieve item based on queryString
                if ($route.current.params["id"] !== undefined) {
                    var selected = $linq($scope.organizations).where("x=>x.id==" + $route.current.params["id"]).singleOrDefault(undefined);
                }
                else if (settingsService.get("selectedOrganization") != null) {
                    //set selected according to cookie
                    var selected = $linq($scope.organizations).where("x=>x.id==" + settingsService.get("selectedOrganization")).singleOrDefault(undefined);
                }

                if (selected !== undefined)
                    $scope.selectionChanged(selected);
                else
                    $scope.openOrganizationChanger();
            }

            /**
             * Invoked when retrieval of organization list failed
             * @param error
             */
            function onGetOrganizationsListError(error) {
                dialogService.error($translate.instant(namespace + "msg.organizationsGetError") + error.data.message);
            }

            /**
             * Invoked when organization was removed successfully
             * @param organization the removed organization
             * @returns {Function}
             */
            function onOrganizationDeleteSuccess(organization) {
                return function (data) {
                    //organisation removed
                    dialogService.success($translate.instant(namespace + "msg.organizationDeleteSuccess"));
                    //remove organization from list
                    $scope.organizations.removeAt($linq($scope.organizations).indexOf("x => x.id == " + organization.id));
                    settingsService.set("selectedOrganization", null);
                    $scope.navigate("#/");
                }
            }

            /**
             * Invoked when confirmation dialog answered
             * @param organization Organization to be deleted or not
             * @returns {Function}
             */
            function onDeleteOrganizationDialogAnswered(organization) {
                return function (answer) {
                    if (answer === 'yes') {
                        OrganizationsProxy.deleteOrganization(organization).success(onOrganizationDeleteSuccess(organization)).
                            error(function (error) {
                                dialogService.error($translate.instant(namespace + "msg.organizationDeleteError") + error.data.message);
                            });
                    }
                }
            }

            /**
             * Invoked when user choose an organization from the list
             * @param org
             */
            function onOrganizationChangerClosed(org) {
                if (org !== null)
                    selectionChanged(org);
            }

            /**
             * Invoked when user dismissed the organization changer dialog
             */
            function onOrganizationChangerDismissed() {
                if ($scope.selectedOrganization === null) {
                    $scope.navigate("#/");
                }
            }

            /**
             * Opens organization chooser
             */
            function openOrganizationChanger() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/components/organizations/modals/organizationChangerDialog.html',
                    controller: 'OrganizationChangerController as vm',
                    resolve: {
                        organizations: function () {
                            return $scope.organizations;
                        }
                    }
                });
                modalInstance.result.then(onOrganizationChangerClosed, onOrganizationChangerDismissed);
            }

        }]);
}());
