'use strict';
angular.module('hexaaApp.services')
    .service('startupService', ['$rootScope', '$translate', 'HexaaService', 'events', 'hexaaCookieName', 'PrincipalProxy',
        'securityService', '$cookies', '$timeout', '$location', 'profileService',
        function ($rootScope, $translate, HexaaService, events, hexaaCookieName, PrincipalProxy,
                  securityService, $cookies, $timeout, $location, profileService) {

            function run() {
                //Attach global functions to rooTscope
                $rootScope.navigate = navigate;
                $rootScope.isActiveTab = isActiveTab;
                //attach eventhandling
                $rootScope.$on(events.authenticated, onAuthenticated);
                $rootScope.$on(events.authError, onAuthError);
                $rootScope.$on(events.tokenExpired, onTokenExpired);
                $rootScope.$on(events.languageChanged, onLanguageChanged);
                //activate
                activate();
            }

            function activate() {
                //When app loads, authenticate the user
                securityService.authenticate($cookies[hexaaCookieName]);
                HexaaService.getApiProperties().then(onGetApiPropertiesSuccess);

                $rootScope.$on(events.onUserPermissionChanged, onUserPermissionChanged);

            }

            function onUserPermissionChanged(event) {
                navigate("#" + $location.url());
            }

            function onGetApiPropertiesSuccess(data) {
                $rootScope.hexaa_properties = {};
                $rootScope.hexaa_properties.backend_version = data.data.version;
                $rootScope.hexaa_properties.public_attribute_spec_enabled = data.data.public_attribute_spec_enabled;
            }

            /**
             * Executes when somebody gets authenticated
             */
            function onAuthenticated(event, token) {
                HexaaService.setToken(token);
                profileService.run();
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
            function onAuthError(event) {
                navigate("index.php");
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