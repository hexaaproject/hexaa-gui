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

    angular.module('hexaaApp.components.organizations.controllers.pages')
        .controller('InviteOrganizationMembersCtrl', ['$scope', '$modal', 'dialogService', 'OrganizationsProxy', '$translate', 'InvitationsProxy', 'baseUIAddr', 'events',
        function ($scope, $modal, dialogService, OrganizationsProxy, $translate, InvitationsProxy, baseUIAddr, events) {

            //Namespace of the corresponding language file
            var namespace = "organizations.inviteorgmembers.";


            /* INTERFACE */
            $scope.inviteMembers = inviteMembers;

            /* IMPLEMENTATION */

            /**
             * InviteManagers button click eventhandler
             */
            function inviteMembers(organization) {

                var modalInstance = $modal.open({
                    templateUrl: 'views/shared/modals/invitation.html',
                    controller: "ModalInstanceCtrl",
                    size: 'lg',
                    resolve: {
                        unitName: function () {
                            return organization.name;
                        },
                        principal: function () {
                            return "member";
                        },
                        roles: function () {
                            return organization.roles;
                        },
                        invitation: function () {
                            return InvitationsProxy.new({
                                role: organization.default_role_id,
                                organization: organization.id
                            });
                        }

                    }
                });


                /**
                 * Check the result of the modal window
                 */
                modalInstance.result.then(onModalWindowClosed);
            }

            /**
             * Invoked when controller created
             */
            function activate() {
                $scope.$on(events.organizationsSelectionChanged, onSelectedOrganizationChanged);
            }

            activate();

            /* CALLBACKS */

            /**
             * Invoked when invitation saved
             * @param data
             */
            function onInvitationSaved(data) {
                dialogService.success($translate.instant(namespace + "msg.invitationSendSuccess"));
                $scope.$emit(events.refreshOrganizationInvitations);
            }

            /**
             * Invoked when invitation wasnt saved
             * @param error
             */
            function onInvitationSaveError(error) {
                dialogService.error($translate.instant(namespace + "msg.invitationSendError"));
            }

            /**
             * invoked when modal window closed
             * @param invitation
             */
            function onModalWindowClosed(invitation) {
                invitation.save()
                    .then(onInvitationSaved)
                    .catch(onInvitationSaveError);
            }


            /**
             * Invoked when organization retrieved
             * @param data
             */
            function onSelectedOrganizationDownloaded(data) {
                $scope.organization = angular.copy(data.data);
            }

            /**
             * Invoked when organization roles retrieved
             * @param data
             */
            function onOrganizationRolesDownloaded(data) {
                $scope.organization.roles = angular.copy(data.data.items);
            }

            /**
             * Invoked when organization selection changed
             * @param event
             * @param selectedOrganization
             */
            function onSelectedOrganizationChanged(event, selectedOrganization) {
                $scope.organization = {id: selectedOrganization};

                if (selectedOrganization != undefined) {
                    OrganizationsProxy.getOrganization(selectedOrganization).then(onSelectedOrganizationDownloaded);
                    OrganizationsProxy.getRoles(selectedOrganization).then(onOrganizationRolesDownloaded);
                }
            }
        }]);

}());
