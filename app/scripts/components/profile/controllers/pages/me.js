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
        .controller('ProfileMeCtrl',
        ['$scope', 'HexaaService', '$translate', 'cssInjector', 'themeService', 'PrincipalProxy', 'dialogService', 'settingsService', 'pageTitleService',
            function ($scope, HexaaService, $translate, cssInjector, themeService, PrincipalProxy, dialogService, settingsService, pageTitleService) {

        var namespace = "profile.me";

        /* FIELDS */

        /* INTERFACE */
        $scope.languageChanged = languageChanged;
        $scope.themeSelectionChanged = themeSelectionChanged;
        $scope.change = change;

        /* IMPLEMENTATION */

        function activate() {
            $scope.profile.lang = $translate.use();
            $scope.themes = themeService.getThemes();
            $scope.selectedTheme = settingsService.get("selectedTheme");

            pageTitleService.setSubPageTitle($translate.instant(namespace + ".lbl.title"));
        }

        activate();

        //language change happened
        function languageChanged() {
            //translate site
            $translate.use($scope.profile.lang);
        }


        /**
         * User selected different Theme from the combobox
         */
        function themeSelectionChanged() {
            settingsService.set("selectedTheme", $scope.selectedTheme);
            themeService.apply(themeService.getTheme($scope.selectedTheme));
        }

        function change() {
            PrincipalProxy.updatePrincipal($scope.profile)
                .then(onUpdatePrincipalSuccess)
                .catch(onUpdatePrincipalError);
        }

        /* CALLBACKS */

        function onUpdatePrincipalError(data) {
            dialogService.error($translate.instant(namespace + ".msg.profileUpdateError"));
        }

        function onUpdatePrincipalSuccess(data) {
            dialogService.success($translate.instant(namespace + ".msg.profileUpdateSuccessful"));
        }


    }]);
}());
