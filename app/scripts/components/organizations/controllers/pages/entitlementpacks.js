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
        .controller('OrganizationEntitlementpacksCtrl',
        ['$scope', 'EntitlementpacksProxy', 'OrganizationsProxy', '$translate', 'events', 'dialogService', 'pageTitleService',
            function ($scope, EntitlementpacksProxy, OrganizationsProxy, $translate, events, dialogService, pageTitleService) {
                //Namespace for language files
                var namespace = "organizations.entitlementpacks.";

                /* FIELDS */
                $scope.organization = {};

                /* INTERFACE */
                $scope.link = link;
                $scope.remove = remove;
                $scope.filterText = "";
                $scope.searchFunc = searchFunc;

                /* IMPLEMENTATION */

                function searchFunc(filterText) {
                    return function(value) {
                        if (value.name.indexOf(filterText) > -1
                            || value.description.indexOf(filterText) > -1)
                        {
                            return value;
                        }
                    }
                }

                /**
                 * Link Button click handler.
                 * @param token The token thats given in the inputbox
                 */
                function link(token) {
                    if (token) {
                        OrganizationsProxy.linkPrivateEntitlementpack($scope.organization, token)
                            .then(onLinkPrivateEntitlementSuccess)
                            .catch(onLinkPrivateEntitlementpackError);
                    }
                }


                /**
                 * get All the entitlementpacks of the currently selected organization
                 * @param organization target organization
                 */
                function getEntitlementpacksOfOrganization(organization) {
                    //query service
                    OrganizationsProxy.getEntitlementpacks(organization.id)
                        .then(onOrganizationEntitlementpacksDownloaded(organization))
                        .catch(onOrganizationEntitlementpacksDownloadError);


                }

                /**
                 * Invoked when organization created
                 */
                function activate() {
                    $scope.$emit(events.organizationCanBeSaved, false);
                    $scope.$on(events.organizationsSelectionChanged, onOrganizationSelectionChanged);

                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                /**
                 * Remove an entitlementpack
                 * @param entitlementpack the entitlementpack to be removed
                 */
                function remove(entitlementpack) {
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                        $translate.instant(namespace + "msg.entitlementpackDeleteConfirm", {name: entitlementpack.name}))
                        .then(onDeleteEntitlementpackConfirmed(entitlementpack));
                }

                /**
                 * Invoked when user confirmed to remove the entitlementpack
                 * @param entitlementpack
                 * @returns {Function}
                 */
                function onDeleteEntitlementpackConfirmed(entitlementpack) {
                    return function (answer) {
                        if (answer === 'yes') {
                            OrganizationsProxy.removeEntitlementpack($scope.organization.id, entitlementpack.id)
                                .then(onRemoveEntitlementpackSuccess(entitlementpack))
                                .catch(onRemoveEntitlementpackError)
                        }
                    }
                }

                /**
                 * Selection changed in the organization checkbox
                 * @param id - The ID of the newly selected organization
                 */
                function onOrganizationSelectionChanged(event, selectedOrganization) {

                    if (selectedOrganization) {
                        $scope.organization = {id: selectedOrganization};

                        if ($scope.profile.isManagerOfOrganization(selectedOrganization)) {
                            getEntitlementpacksOfOrganization($scope.organization);
                        }
                        else {
                            $scope.navigate("#/");
                        }

                    }

                }

                /**
                 * Invoked when entitlementpacks are ready for the organization
                 * @param organization organization that the entitlements belong to
                 * @returns {Function}
                 */
                function onOrganizationEntitlementpacksDownloaded(organization) {
                    return function (data) {
                        //create property for entitlementpacks
                        organization.entitlementpacks = data.data.items;
                    }
                }

                /**
                 * Invoked when downloading entitlementpacks for an organization failed
                 * @param error Server Response
                 */
                function onOrganizationEntitlementpacksDownloadError(error) {
                    //error, couldnt retrieve entitlementpacks
                    dialogService.error($translate.instant(namespace + "msg.organizationEntitlementpacksRetrieveError"));
                }

                /**
                 * Invoked when entitlementpack removed
                 * @param entitlementpack Deleted entitlementpack
                 * @returns {Function}
                 */
                function onRemoveEntitlementpackSuccess(entitlementpack) {
                    return function () {
                        dialogService.success($translate.instant(namespace + "msg.entitlementpackRemoveSuccess"));
                        $scope.organization.entitlementpacks.removeAt($linq($scope.organization.entitlementpacks).indexOf("x=>x.id == " + entitlementpack.id));
                    }
                }

                /**
                 * Invoked when removign an entitlementpack failed
                 */
                function onRemoveEntitlementpackError() {
                    dialogService.error($translate.instant(namespace + "msg.entilementpackRemoveError"));
                }

                /**
                 * Invoked when linking a private entitlementpack failed
                 * @param error
                 */
                function onLinkPrivateEntitlementpackError(error) {
                    dialogService.notifyUIError(error.data.errors);
                    dialogService.error($translate.instant(namespace + "msg.tokenLinkError"));
                }

                /**
                 * Invoked when linking an entitlementpack to the organization was successful
                 * @param data Server response
                 */
                function onLinkPrivateEntitlementSuccess(data) {
                    dialogService.success($translate.instant(namespace + "msg.tokenLinkSuccessful"));
                    getEntitlementpacksOfOrganization($scope.organization);
                    $scope.token = "";
                }


                activate();
            }]);
}());
