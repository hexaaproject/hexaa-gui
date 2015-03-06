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
        .controller('OrganizationsInvitationsCtrl',
        ['$scope', 'OrganizationsProxy', '$modal', '$translate', 'events', 'InvitationsProxy', 'dialogService', 'pageTitleService',
        function ($scope, OrganizationsProxy, $modal, $translate, events, InvitationsProxy, dialogService, pageTitleService) {

            var namespace = "organizations.invitations.";
            var vm = this;

            vm.organization = {
                id: -1,
                roles: [],
                invitations: []
            };


            /* Pager settings */
            vm.pager = {
                itemPerPage: 25, //How many items will appear on a single page?
                maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                totalItems: 0, //Num of total items
                currentPage: 1,  //Currently selected page
                numPages: 0
            };


            /* INTERFACE */
            vm.edit = edit;
            vm.resend = resend;
            vm.delete = deleteInvitation;

            /* IMPLEMENTATION */

            /**
             * Resend invitation.
             * @param {integer} index of the invitation to resend
             */
            function resend(invitation) {
                invitation.resend()
                    .success(onInvitationResent)
                    .error(onInvitationResendError);
            }

            /**
             * Delete an invitation
             * @param {integer} index of the invitation to delete
             */
            function deleteInvitation(invitation) {
                dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                    $translate.instant(namespace + "msg.invitationDeleteConfirmation"))
                    .then(onDeleteOrganizationDialogAnswered(invitation));
            }

            /**
             * Edit an invitation
             * @param {integer} index of the invitation to edit
             */
            function edit(einvitation) {

                //inline bugfix for backend inconsistency need to move into proxy layer?
                if (einvitation.emails.length == 1 && einvitation.emails[0] == "") einvitation.emails = [];

                var modalInstance = $modal.open({
                    templateUrl: 'views/shared/modals/invitation.html',
                    controller: "ModalInstanceCtrl",
                    size: 'lg',
                    resolve: {
                        unitName: function () {
                            return "Organization";
                        },
                        principal: function () {
                            return "manager";
                        },
                        roles: function () {
                            return vm.organization.roles;
                        },
                        invitation: function () {
                            return angular.copy(einvitation);
                        }
                    }
                });

                /**
                 * Check the result of the modal window
                 */
                modalInstance.result.then(function (invitation) {
                    //Edit
                    invitation.organization_id = vm.organization.id;
                    invitation.save()
                        .success(onInvitationSaveSuccess(invitation))
                        .error(onInvitationSaveError);
                });

            }

            /**
             * Invoked when controller created
             */
            function activate() {
                //we dont support saving organizations, so parent, hide that button pls
                $scope.$emit(events.organizationCanBeSaved, false);
                $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
                $scope.$on(events.refreshOrganizationInvitations, onRefreshInvitations);
                $scope.$watch("pager.currentPage", onCurrentPageChanged);
                $scope.$watch("pager.itemPerPage", onItemPerPageChanged);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
            }

            activate();

            /* CALLBACKS */

            /**
             * Invoked when organizations need to be refreshed
             */
            function onRefreshInvitations() {
                onOrganizationsSelectionChanged({}, vm.organization.id);
            }

            /**
             * Invoked when invitation sent
             * @param invitation Invitation that was sent
             * @returns {Function}
             */
            function onInvitationSaveSuccess(invitation) {
                return function (data, status, headers, config) {
                    dialogService.success($translate.instant(namespace + "msg.invitationUpdateSuccess"));
                    var index = $linq(vm.organization.invitations).indexOf("x => x.id == " + invitation.id);
                    if (index !== -1) {
                        vm.organization.invitations[index] = invitation;
                    }

                }
            }

            /**
             * Invoked when server couldnt save the invitation
             * @param data response data
             * @param status response status
             * @param headers response headers
             * @param config response config
             */
            function onInvitationSaveError(data, status, headers, config) {
                dialogService.error($translate.instant(namespace + "msg.invitationUpdateError"));
            }

            /**
             * Invoked when invitations are retrieved
             * @param invitations list of invitations
             */
            function onGetInvitationsSuccess(invitations) {
                vm.organization.invitations = invitations.data.items;
                vm.pager.totalItems = invitations.data.item_number;
            }

            /**
             * Invoked when retrieving invitations was unsuccessful
             * @param error Server response
             */
            function onGetInvitationsError(error) {
                dialogService.error($translate.instant(namespace + "msg.invitationGetError"));
            }

            /**
             * Invoked when current page changed
             * @param oldValue
             * @param newValue
             */
            function onCurrentPageChanged( newValue, oldValue) {
                if (vm.organization.id != -1) {
                    loadInvitations();
                }
            }

            /**
             * Invoked when itemPerPage changed
             * @param newValue
             * @param oldValue
             */
            function onItemPerPageChanged( newValue, oldValue ) {
                if (vm.organization.id != -1) {
                    loadInvitations();
                }
            }

            /**
             * Loads invitations of the current organization according to the pager status
             */
            function loadInvitations() {
                OrganizationsProxy.getInvitations(vm.organization.id, vm.pager)
                    .then(onGetInvitationsSuccess)
                    .catch(onGetInvitationsError);
            }

            /**
             * User changed his selection in Organizations. Its time to refresh our data
             * @param selectedOrganization
             */
            function onOrganizationsSelectionChanged(event, selectedOrganization) {

                if (selectedOrganization != undefined) {
                    vm.organization.id = selectedOrganization;
                    loadInvitations();
                }
            }

            /**
             * Invoked on Invitation resent
             * @param data
             * @param status
             * @param headers
             * @param config
             */
            function onInvitationResent(data, status, headers, config) {
                dialogService.success($translate.instant(namespace + "msg.invitationResendSuccess"));
            }

            /**
             * Invoked when resending invitation failed
             * @param data
             * @param status
             * @param headers
             * @param config
             */
            function onInvitationResendError(data, status, headers, config) {
                dialogService.error($translate.instant(namespace + "msg.invitationResendError"));
            }

            /**
             * Invoked when invitation deleted
             * @param invitation
             * @returns {Function}
             */
            function onDeleteInvitationSuccess(invitation) {
                return function (data, status, headers, config) {
                    dialogService.success($translate.instant(namespace + "msg.invitationRemoveSuccess"));
                    vm.organization.invitations.splice($linq(vm.organization.invitations).indexOf("x=>x.id==" + invitation.id), 1);
                    vm.pager.totalItems--;
                }
            }

            /**
             * Invoked when deleting invitation failed
             * @param data
             * @param status
             * @param headers
             * @param config
             */
            function onDeleteInvitationError(data, status, headers, config) {
                dialogService.error($translate.instant(namespace + "msg.invitationRemoveError"));
            }

            /**
             * Invoked when confirmation dialog answered
             * @param invitation
             * @returns {Function}
             */
            function onDeleteOrganizationDialogAnswered(invitation) {
                return function (answer) {
                    if (answer == 'yes') {
                        invitation.delete()
                            .success(onDeleteInvitationSuccess(invitation))
                            .error(onDeleteInvitationError);
                    }
                }

            }

        }]);

}());