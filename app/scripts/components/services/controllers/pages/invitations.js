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

    angular.module('hexaaApp.components.services.controllers.pages').controller('ServicesInvitationsCtrl', ['$scope', '$window', '$timeout', 'InvitationsProxy', 'ServicesProxy', '$cookies', '$modal', '$translate', 'events', 'dialogService', 'baseUIAddr', 'pageTitleService',
        function ($scope, $window, $timeout, InvitationsProxy, ServicesProxy, $cookies, $modal, $translate, events, dialogService, baseUIAddr, pageTitleService) {

            var namespace = "services.invitations.";

            /* FIELDS */
            $scope.baseUIAddr = baseUIAddr;

            $scope.service = {
                id: -1
            };

            /* Pager settings */
            $scope.pager = {
                itemPerPage: 5, //How many items will appear on a single page?
                maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                totalItems: 0, //Num of total items
                currentPage: 1,  //Currently selected page
                numPages: 0
            };

            /* INTERFACE */
            $scope.resend = resend;
            $scope.delete = deleteInvitation;
            $scope.edit = edit;

            /* IMPLEMENTATION */

            function activate() {
                $scope.$emit(events.serviceCanBeSaved, false);
                $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);
                $scope.$on(events.refreshServiceInvitations, onRefreshServiceInvitations);
                $scope.$watch("pager.itemPerPage",onItemPerPageChanged);
                $scope.$watch("pager.currentPage",onCurrentPageChanged);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));

            }

            activate();

            function refreshInvitations()
            {
                if ($scope.service.id !== -1)
                {
                    ServicesProxy.getInvitations($scope.service.id, $scope.pager)
                        .then(onGetInvitationsSuccess)
                        .catch(onGetInvitationsError);

                }
            }

            function onItemPerPageChanged(newValue,oldValue)
            {
                refreshInvitations();
            }

            function onCurrentPageChanged(newValue,oldValue)
            {
                refreshInvitations();
            }

            function resend(invitation) {
                invitation.resend()
                    .then(onInvitationResendSuccess)
                    .catch(onInvitationResendError);
            }

            function deleteInvitation(invitation) {
                dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                    $translate.instant(namespace + "msg.invitationDeleteConfirmation"))
                    .then(onDeleteInvitationModalClosed(invitation));
            }

            function edit(einvitation) {
                //inline bugfix for backend inconsistency need to move into proxy layer?
                if (einvitation.emails.length == 1
                    && einvitation.emails[0] == "") {
                    einvitation.emails = [];
                }

                var modalInstance = $modal.open({
                    templateUrl: 'views/shared/modals/invitation.html',
                    controller: "ModalInstanceCtrl",
                    size: 'lg',
                    resolve: {
                        unitName: function () {
                            return "Service";
                        },
                        principal: function () {
                            return "manager";
                        },
                        roles: function () {
                            return undefined;
                        },
                        invitation: function () {
                            return angular.copy(einvitation);
                        }
                    }
                });

                /**
                 * Check the result of the modal window
                 */
                modalInstance.result.then(onEditInvitationModalClosed);

            }

            $scope.keyCount = function (obj) {
                if (obj !== undefined) {
                    return Object.keys(obj).length;
                }
                else return 0;
            };

            /* CALLBACKS */

            function onRefreshServiceInvitations() {
                refreshInvitations();
            }

            function onInvitationResendSuccess(data) {
                dialogService.success($translate.instant(namespace + "msg.invitationResendSuccess"));
            }

            function onInvitationResendError(data) {
                dialogService.error($translate.instant(namespace + "msg.invitationResendError"));
            }

            function onGetInvitationsSuccess(data) {
                $scope.service.invitations = $linq(data.data.items).orderByDescending("x => x.created_at").toArray();
                $scope.pager.totalItems = data.data.item_number;
            }

            function onGetInvitationsError(error) {
                dialogService.error($translate.instant(namespace + "msg.invitationsGetError"));
            }

            /**
             * User changed his selection in Services. Its time to refresh our data
             */
            function onServicesSelectionChanged(event, selectedService) {
                if (selectedService != undefined) {
                    $scope.service = {id: selectedService};
                    refreshInvitations();
                }
            }

            function onInvitationDeleteSuccess(invitation) {
                return function (data) {
                    dialogService.success($translate.instant(namespace + "msg.invitationRemoveSuccess"));
                    $scope.service.invitations.removeAt($linq($scope.service.invitations).indexOf("x=>x.id==" + invitation.id));
                    $scope.pager.totalItems--;
                }
            }

            function onInvitationDeleteError(data) {
                dialogService.error($translate.instant(namespace + "msg.invitationRemoveError"));
            }

            function onDeleteInvitationModalClosed(invitation) {
                return function (answer) {
                    if (answer == 'yes') {
                        invitation.delete()
                            .then(onInvitationDeleteSuccess(invitation))
                            .catch(onInvitationDeleteError);
                    }
                }
            }

            function onInvitationSaveSuccess(data, status, headers, config) {
                dialogService.success($translate.instant(namespace + "msg.invitationUpdateSuccess"));
                $scope.$emit(events.refreshServiceInvitations);
            }

            function onInvitationSaveError(data, status, headers, config) {
                dialogService.error($translate.instant(namespace + "msg.invitationUpdateError"));
            }

            function onEditInvitationModalClosed(invitation) {
                //Edit
                invitation.save()
                    .success(onInvitationSaveSuccess)
                    .error(onInvitationSaveError);
            }
        }]);

}());