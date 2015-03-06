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

    /**
     * Index/Master Controller
     */
    angular.module('hexaaApp.shared.controllers.pages')
        .controller('IndexCtrl', ['$scope', 'cssInjector', '$rootScope',
        'themeService', 'events', 'settingsService', 'pageTitleService', 'profileService', 'dialogService',
        function ($scope, cssInjector, $rootScope,
                  themeService, events, settingsService, pageTitleService, profileService, dialogService) {

            var namespace = "index.";

            /* FIELDS */
            $scope.Page = pageTitleService;

            /*A few of our controllers are refactored to use controllerAs syntax, so they have isoalted scopes.
            * But to provide backward compatibility I also put the profile data to the master scope, so that
            * the children that doesnt use viewAs yet could also access it, till i dont refactor them.
            * */
            $scope.profile = profileService.getProfile();

            /* IMPLEMENTATION */

            function activate() {
                $rootScope.$on(events.siteThemeChanged, onSiteThemeChanged);
                $rootScope.$on(events.onBadRequest, onBadRequest);
                $rootScope.$on(events.onInternalServerError, onInternalServerError);
                themeService.apply(themeService.getTheme(settingsService.get("selectedTheme")));

            }

            function onInternalServerError() {
                dialogService.error("Internal Server Error!");
            }

            function onBadRequest(event, error) {
                if (error !== null && error.message !== undefined) {
                    dialogService.error(error.message.toString());
                }
            }

            activate();

            /* CALLBACKS */
            function onSiteThemeChanged(event, theme) {
                cssInjector.removeAll();
                cssInjector.add(theme.src);
                cssInjector.add("styles/main.css");
            }

        }]);
}());
