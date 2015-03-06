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

( function () {
    'use strict';

    angular.module('hexaaApp.components.organizations.controllers.pages')
        .controller('OrganizationPrincipalManagement',
        ['$scope',  'OrganizationsProxy',  '$translate', 'events',
        '$modal', 'dialogService', 'pageTitleService', 'profileService',
        function ($scope, OrganizationsProxy, $translate, events,
                  $modal, dialogService, pageTitleService, profileService) {

            var namespace = "organizations.principalmanagement.";
            var vm = this;

            vm.organization = {};
            vm.profile = {};

            /* INTERFACE */
            vm.revoke = revoke;
            vm.propose = propose;
            vm.remove = remove;


            /* IMPLEMENTATION */

            /**
             * Revokes a principal from manager access
             * @param principal
             */
            function revoke(principal) {
                if (principal.id === vm.profile.id) {
                    //Revoke self
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                        $translate.instant(namespace + "msg.confirmRevokeSelf"))
                        .then(onRevokePrincipalConfirmed(principal));
                }
                else {
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                        $translate.instant(namespace + "msg.confirmRevokeManager", {fedid: principal.fedid}))
                        .then(onRevokePrincipalConfirmed(principal));
                }
            }

            /**
             * Propose a principal to be manager
             * @param principal
             */
            function propose(principal) {
                OrganizationsProxy.addManager(vm.organization.id, principal.id)
                    .then(onAddManagerSuccess(principal))
                    .catch(onAddManagerError);
            }


            /**
             * Removes a principal
              * @param principal
             */
            function remove(principal) {
                if (principal.id === vm.profile.id) {
                    //Removing self
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                        $translate.instant(namespace + "msg.confirmRemoveSelf"))
                        .then(onRemovePrincipalConfirmed(principal));
                }
                else {
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                        $translate.instant(namespace + "msg.confirmRemoveMember", {fedid: principal.fedid}))
                        .then(onRemovePrincipalConfirmed(principal));
                }
            }

            /**
             * Invokes when controller created
             */
            function activate() {
                $scope.$emit(events.organizationCanBeSaved, false);
                $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));

                vm.profile = profileService.getProfile();

            }

            activate();


            /* CALLBACK */

            /**
             * Service selection changed
             * @param selectedOrganization
             */
            function onOrganizationsSelectionChanged(event, selectedOrganization) {
                vm.organization = {id: selectedOrganization};

                if (selectedOrganization != undefined) {
                    OrganizationsProxy.getPrincipals(selectedOrganization)
                        .then(onGetPrincipalsSuccess)
                        .catch(onGetPrincipalError);
                }
            }

            /**
             * Invoked when retrieving principal failed
             * @param error
             */
            function onGetPrincipalError(error) {
                dialogService.error($translate.instant(namespace + "msg.failedToRetrieveData"));
            }

            /**
             * Invoked when principal list retrieved
             * @param data server response
             */
            function onGetPrincipalsSuccess(data) {
                vm.organization.principals = angular.copy(data.data);
                vm.organization.principals.saveMemento();
            }

            /**
             * Invoked when member removed
             * @param principal Member that was removed
             * @returns {Function}
             */
            function onRemoveMemberSuccess(principal) {
                return function (data) {
                    dialogService.success($translate.instant(namespace + "msg.memberRemoveSuccess"));
                    vm.organization.principals = $linq(vm.organization.principals).except(principal, "(x,y) => x.id == y.id").toArray();
                }
            }

            /**
             * Invoked when server failed to remove a member
             * @param error
             */
            function onRemoveMemberError(error) {
                dialogService.error($translate.instant(namespace + "msg.memberRemoveError"));
            }


            /**
             * Invoked when a manager was removed successfully
             * @param principal the managers principal
             * @returns {Function}
             */
            function onRemoveManagerSuccess(principal) {
                return function (data) {
                    dialogService.success($translate.instant(namespace + "msg.managerRevokeSuccess"));
                    principal.is_manager = false;
                }

            }

            /**
             * Invoked when service failed to remove manager
             * @param error Server response
             */
            function onRemoveManagerError(error) {
                dialogService.error($translate.instant(namespace + "msg.managerRevokeError"));
            }


            /**
             * Invoked when manager was added
             * @param principal the new manager
             * @returns {Function}
             */
            function onAddManagerSuccess(principal) {
                return function (data) {
                    dialogService.success($translate.instant(namespace + "msg.managerProposeSuccess"));
                    principal.is_manager = true;
                };
            }

            /**
             * Invoked when adding manager run into error
             * @param error
             */
            function onAddManagerError(error) {
                dialogService.error($translate.instant(namespace + "msg.managerProposeError"));
            }

            /**
             * Invoked when user confirmed or denied removing a principal
             * @param principal target principal
             * @returns {Function}
             */
            function onRemovePrincipalConfirmed(principal) {
                return function (answer) {
                    if (answer == "yes") {
                        OrganizationsProxy.removeMember(vm.organization.id, principal.id)
                            .then(onRemoveMemberSuccess(principal))
                            .catch(onRemoveMemberError);
                    }
                }
            }

            /**
             * Invoked when user confirmed or denied revoking a principal
             * @param principal
             * @returns {Function}
             */
            function onRevokePrincipalConfirmed(principal) {
                return function (answer) {
                    if (answer == "yes") {
                        OrganizationsProxy.removeManager(vm.organization.id, principal.id)
                            .then(onRemoveManagerSuccess(principal))
                            .catch(onRemoveManagerError);
                    }
                }
            }


        }]);

}());