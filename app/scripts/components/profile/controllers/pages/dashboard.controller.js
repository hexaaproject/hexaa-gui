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

    angular.module('hexaaApp.components.profile.controllers.pages')
        .controller('ProfileDashboardCtrl',
        ['$scope', 'ServicesFacade', 'OrganizationsFacade', '$modal', 'pageTitleService', '$translate', 'profileService',
        function ($scope, ServicesFacade, OrganizationsFacade, $modal, pageTitleService, $translate, profileService) {
            //language file namespace
            var namespace = "profile.dashboard.";

            $scope.profile = profileService.getProfile();

            $scope.dashboard = {
                organizations: [],
                services: [],
                entityIdRequests: []
            };

            /* INTERFACE */
            $scope.newOrganization = newOrganization;
            $scope.newService = newService;

            /* Invoked when a controller created */
            function activate() {
                ServicesFacade.getServices().then(onGetServicesSuccess);

                OrganizationsFacade.getOrganizations(onGetOrganizationsSuccess).then(onGetOrganizationsSuccess);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
            }

            activate();

            function onGetServicesSuccess(services) {
                $scope.dashboard.services = services.data.items;
            }

            function onGetOrganizationsSuccess(organizations) {
                $scope.dashboard.organizations = organizations.data.items;
            }


            function onNewServiceDialogClosed(result) {
                $scope.dashboard.services.push(result);
                $scope.profile.addManagedService(result);

            }

            function newOrganization() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/components/organizations/modals/new-organization-dialog.html',
                    controller: 'OrganizationNewDialogCtrl as vm',
                    resolve: {}
                });
                modalInstance.result.then(onNewOrganizationDialogClosed);
            }

            function onNewOrganizationDialogClosed(result) {
                $scope.dashboard.organizations.push(result);
                $scope.profile.addManagedOrganization(result);
            }


            function newService() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/components/services/pages/new.html',
                    controller: 'ServiceNewCtrl',
                    resolve: {}
                });
                modalInstance.result.then(onNewServiceDialogClosed);
            }

        }]);

}());
