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

    angular.module('hexaaApp.components.organizations.controllers.pages').controller('InviteOrganizationManagersCtrl', ['$scope', '$modal', 'dialogService', '$translate', 'InvitationsProxy', 'baseUIAddr', 'events', 'OrganizationsProxy', function ($scope, $modal, dialogService, $translate, InvitationsProxy, baseUIAddr, events, OrganizationsProxy) {

        //namespace of the language file
        var namespace = "organizations.inviteorgmanagers.";


        /* INTERFACE */
        $scope.inviteManagers = inviteManagers;

        /* IMPLEMENTATION */

        /**
         * Creates an invitation editor dialog with new invitation
         * @param organization The target organization of the invitation
         */
        function inviteManagers(organization) {

            var modalInstance = $modal.open({
                templateUrl: 'views/shared/modals/invitation.html',
                controller: "ModalInstanceCtrl",
                size: 'lg',
                resolve: {
                    unitName: function () {
                        return organization.name;
                    },
                    principal: function () {
                        return "manager";
                    },
                    roles: function () {
                        return undefined;
                    },
                    invitation: function () {
                        return InvitationsProxy.new({
                            organization: organization.id,
                            as_manager: true
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
            $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
        }

        activate();

        /* CALLBACK */

        /**
         * Invoked when modal window closed
         * @param invitation
         */
        function onModalWindowClosed(invitation) {
            invitation.save()
                .then(onInvitationSaved)
                .catch(onInvitationSaveError);
        }

        /**
         * Invoked when server couldnt save invitation
         * @param error
         */
        function onInvitationSaveError(error) {
            dialogService.error($translate.instant(namespace + "msg.invitationSendError"));
        }

        /**
         * Invoked when invitation saved
         * @param data
         */
        function onInvitationSaved(data) {
            dialogService.success($translate.instant(namespace + "msg.invitationSendSuccess"));
            $scope.$emit(events.refreshOrganizationInvitations);
        }

        /**
         * Invoked when organizations are retrieved
         * @param data
         */
        function onGetOrganizationSuccess(data) {
            $scope.organization = data.data;
        }

        /**
         * Invoked when organization selection changed
         * @param event
         * @param selectedOrganization
         */
        function onOrganizationsSelectionChanged(event, selectedOrganization) {
            if (selectedOrganization != undefined) {
                OrganizationsProxy.getOrganization(selectedOrganization).then(onGetOrganizationSuccess);
            }
        }

    }]);

}());
