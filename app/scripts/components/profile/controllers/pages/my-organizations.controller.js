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
        .controller('ProfileMyOrganizationsCtrl',
        ['$scope', 'PrincipalFacade', 'pageTitleService', '$translate', 'dialogService', '$route',
            function ($scope, PrincipalFacade, pageTitleService, $translate, dialogService, $route) {

        var namespace = "profile.myorganizations.";
        $scope.organizations = [];
        $scope.lookuped_entitlement = $route.current.params["entitlement_id"];

        function activate() {
            PrincipalFacade.getMyOrganizations()
                .then(onGetMyOrganizationsSuccess)
                .catch(onGetMyOrganizationsError);

            pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
        }

        activate();


        function onGetMyOrganizationsSuccess(data) {
            $scope.organizations = data.data.items;
        }

        function onGetMyOrganizationsError(error) {
            dialogService.error($translate.instant(namespace + "msg.getMyOrganizationsError"));
        }


    }]);

}());