'use strict';
angular.module('hexaaApp.services')
    .service('startupService', ['$rootScope', '$translate', 'HexaaService', 'events', 'hexaaCookieName', 'PrincipalFacade',
        '$cookies', '$timeout', '$location', 'profileService','$route',
        function ($rootScope, $translate, HexaaService, events, hexaaCookieName, PrincipalFacade,
                  $cookies, $timeout, $location, profileService,$route) {

            function run() {
                //Attach global functions to rooTscope
                $rootScope.navigate = navigate;
                $rootScope.isActiveTab = isActiveTab;
                //attach eventhandling
                $rootScope.$on(events.tokenExpired, onTokenExpired);
                $rootScope.$on(events.languageChanged, onLanguageChanged);
                //activate
                activate();
            }

            function activate() {
                //When app loads, authenticate the user
                HexaaService.getApiProperties().then(onGetApiPropertiesSuccess);
                profileService.run();
                $rootScope.$on(events.onUserPermissionChanged, onUserPermissionChanged);

            }

            function onUserPermissionChanged(event) {
                $route.reload();
            }

            function onGetApiPropertiesSuccess(data) {
                $rootScope.hexaa_properties = {};
                $rootScope.hexaa_properties.backend_version = data.data.version;
                $rootScope.hexaa_properties.public_attribute_spec_enabled = data.data.public_attribute_spec_enabled;
            }


            /*
             * Executes when user changes the site language
             */
            function onLanguageChanged(event, lang) {
                $translate.use(lang);
            }


            /*
             * Executes when authentication error occours, or token has expired
             */
            function onTokenExpired(event) {
                navigate("index.php");
            }


            /**
             * Tells if the tab, given in the parameter should be selected, based on the site location
             * @param name Tab key
             * @returns {boolean} Is selected?
             */
            function isActiveTab(name) {
                return ($location.path() === name) || ($location.path().startsWith(name));
            }

            return {
                run: run
            };

        }]);