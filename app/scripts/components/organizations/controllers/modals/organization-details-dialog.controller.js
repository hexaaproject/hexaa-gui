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

    angular.module('hexaaApp.components.organizations.controllers.modals')
        .controller('OrganizationDetailsCtrl',
        ['$scope', '$modalInstance', 'organizationId', 'OrganizationsFacade', 'dialogService',
            function ($scope, $modalInstance, organizationId, OrganizationsFacade, dialogService) {
                //Namespace of the translation
                var namespace = "modals.organizationDetails.";

                /* FIELDS */
                $scope.organization = {};

                /* INTERFACES */
                $scope.close = close;

                /* IMPLEMENTATION */

                /**
                 * Cancel button clicked
                 */
                function close() {
                    $modalInstance.dismiss('close');
                }

                /**
                 * Invoked when controller has been created
                 */
                function activate() {
                    OrganizationsFacade.getOrganization(organizationId)
                        .then(onGetOrganizationSuccess)
                        .catch(onGetOrganizationError);
                }

                /**
                 * Invoked when the information about the organization is ready
                 * @param organization the requested organization
                 */
                function onGetOrganizationSuccess(organization) {
                    $scope.organization = organization.data;

                    OrganizationsFacade.getManagers(organization.data.id)
                        .then(onGetManagersSuccess)
                        .catch(onGetManagersError);
                }

                /**
                 * Invoked when managers of the organization are retrieved
                 * @param managers organizations managers
                 */
                function onGetManagersSuccess(managers) {
                    $scope.organization.managers = managers.data;
                }

                /**
                 * Invoked when retrieving the manager list was unsuccessful
                 * @param error Server response
                 */
                function onGetManagersError(error) {
                    dialogService.error(translate.instant(namespace + ".msg.organizationManagersGetError") + error.data.message);
                }

                /**
                 * Invoked when retrieving the organization was unsuccessful
                 * @param error Server response
                 */
                function onGetOrganizationError(error) {
                    dialogService.error(translate.instant(namespace + ".msg.organizationGetError") + error.data.message);
                }

                activate();

            }]);
}());