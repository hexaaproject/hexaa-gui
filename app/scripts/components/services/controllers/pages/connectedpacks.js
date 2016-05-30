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

    angular.module('hexaaApp.components.services.controllers.pages')
        .controller('ServiceConnectedEntitlementpacksCtrl',
        ['$scope', 'ServicesProxy', 'OrganizationsProxy',  '$translate', 'events', '$modal', 'dialogService', 'pageTitleService',
            function ($scope,ServicesProxy, OrganizationsProxy, $translate, events, $modal, dialogService, pageTitleService) {

        var namespace = "services.connectedpacks.";

        /* FIELDS */

        /* Pager settings */
        $scope.pager = {
            itemPerPage: 5, //How many items will appear on a single page?
            maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
            totalItems: 0, //Num of total items
            currentPage: 1,  //Currently selected page
            numPages: 0
        };

        $scope.service = {
            id: -1,
            connections: []
        };

        /* INTERFACE */
        $scope.deleteConnection = deleteConnection;
        $scope.showDetails = showDetails;
        $scope.acceptConnection = acceptConnection;

        /* IMPLEMENTATION */
        function activate() {
            $scope.$emit(events.serviceCanBeSaved, false);
            $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);
            pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
        }

        activate();

        /* GUI methods */

        /*Show details of organization*/
        function showDetails(id) {
            var modalInstance = $modal.open({
                templateUrl: 'views/components/organizations/modals/organizationDetails.html',
                controller: "OrganizationDetailsCtrl",
                size: 'lg',
                resolve: {
                    organizationId: function () {
                        return id;
                    }
                }
            });
        }

        /**
         * service selection changed
         * @param id - Id of the newly selected service
         */
        function onServicesSelectionChanged(event, selectedService) {
            $scope.service = {id: selectedService};

            if (selectedService ) {
                //load managers for the newly selected service
                ServicesProxy.getLinkedOrganizations(selectedService)
                    .then(onGetLinkedOrganizationsSuccess)
                    .catch(onGetLinkedOrganizationsError);

            }
        }


        /**
         * Delete a connection between an organization and a entitlementpack
         * @param id - Organization Id
         * @param epid - Entitlementpack id
         */
        function deleteConnection(connection) {
            dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                $translate.instant(namespace + "msg.connectionDeleteConfirmation"))
                .then(onDeleteConnectionDialogClosed(connection));
        }

        /**
         * accept a organization - entitlementpack connection
         * @param id - organization id
         * @param epid - entitlementpack id
         */
        function acceptConnection(connection) {
            ServicesProxy.acceptConnectionRequest(connection.organization_id, connection.entitlement_pack_id)
                .success(function (data, status, headers, config) {
                    dialogService.success($translate.instant(namespace + "msg.connectionAcceptSuccess"));
                    connection.status = "accepted";
                }).
                error(function (data, status, headers, config) {
                    dialogService.error($translate.instant(namespace + "msg.connectionAcceptError") + data.message);
                });
        }

        /* CALLBACKS */

        function onGetLinkedOrganizationsSuccess(data) {
            $scope.service.connections = angular.copy(data.data.items);
            $scope.service.connections.saveMemento();
            $scope.pager.totalItems = data.data.item_numberb;
        }

        function onGetLinkedOrganizationsError(error) {
            //Couldnt retrieve connected organizations
            dialogService.error(error.data.message);
        }

        function onDeleteConnectionSuccess(connection) {
            return function (data, status, headers, config) {
                dialogService.success($translate.instant(namespace + "msg.connectionRemoveSuccess"));
                var connectionIndex = $linq($scope.service.connections).indexOf("x => (x.organization_id==" + connection.organization_id + ") && (x.entitlement_pack_id==" + connection.entitlement_pack_id + ")");
                $scope.service.connections.removeAt(connectionIndex);
                $scope.pager.totalItems--;
            }
        }

        function onDeleteConnectionError(data, status, headers, config) {
            dialogService.error($translate.instant(namespace + "msg.connectionRemoveError") + data.message);
        }

        function onDeleteConnectionDialogClosed(connection) {
            return function (answer) {
                if (answer == 'yes') {
                    OrganizationsProxy.deleteEntitlementpack(connection.organization_id, connection.entitlement_pack_id)
                        .success(onDeleteConnectionSuccess(connection))
                        .error(onDeleteConnectionError);
                }
            }
        }

    }]);
}());