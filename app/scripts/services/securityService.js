'use strict';
angular.module('hexaaApp.services')
    .service('securityService',
    ['$rootScope', 'events', '$cookies', 'hexaaCookieName',
        function ($rootScope, events, $cookies, hexaaCookieName) {

            /* Security */
            var hexaaCookie = $cookies[hexaaCookieName];

            var authenticate = function (cookie) {
                if (cookie !== undefined) {
                    var hexaaData = JSON.parse(cookie);
                    $rootScope.$broadcast(events.authenticated, hexaaData.token);
                }
                else {
                    $rootScope.$broadcast(events.authError, undefined);
                }
            };

            $rootScope.$watch(function () {
                return $cookies[hexaaCookieName];
            }, function (newValue) {
                if (newValue === undefined) {
                    $rootScope.$broadcast(events.authError, undefined);
                }
                else {
                    var hexaaData = JSON.parse(newValue);
                    $rootScope.$broadcast(events.languageChanged, hexaaData.lang);
                }
            });

            var getToken = function () {
                var hexaaData = JSON.parse(hexaaCookie);
                return hexaaData.token;
            };

            return {
                authenticate: authenticate,
                getToken: getToken
            };

        }]);