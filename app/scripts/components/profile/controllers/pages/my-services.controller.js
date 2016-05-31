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
        .controller('ProfileMyServicesCtrl',
        ['$scope', 'PrincipalFacade', 'pageTitleService', '$translate', 'dialogService', '$route',
            function ($scope, PrincipalFacade, pageTitleService, $translate, dialogService, $route) {

        var namespace = "profile.myservices.";
        $scope.services = [];

        $scope.lookuped_entitlement = $route.current.params["entitlement_id"];

        function activate() {
            PrincipalFacade.getMyServices()
                .then(function (data) {
                    $scope.services = data.data.items;
                })
                .catch(function (error) {
                    dialogService.error($translate.instant(namespace + "msg.getMyServicesError"));
                });

            pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
        }

        activate();

    }]);
}());
