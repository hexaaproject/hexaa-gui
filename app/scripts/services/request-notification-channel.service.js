'use strict';
angular.module('hexaaApp.services')
    .factory('requestNotificationChannel',
    ['$rootScope', 'events',
        function ($rootScope, events) {
            // private notification messages
            var _START_REQUEST_ = '_START_REQUEST_';
            var _END_REQUEST_ = '_END_REQUEST_';

            // publish start request notification
            var requestStarted = function () {
                $rootScope.$broadcast(_START_REQUEST_);
            };
            // publish end request notification
            var requestEnded = function () {
                $rootScope.$broadcast(_END_REQUEST_);
            };
            // subscribe to start request notification
            var onRequestStarted = function ($scope, handler) {
                $scope.$on(_START_REQUEST_, function (event) {
                    handler();
                });
            };
            // subscribe to end request notification
            var onRequestEnded = function ($scope, handler) {
                $scope.$on(_END_REQUEST_, function (event) {
                    handler();
                });
            };

            var tokenExpired = function () {
                $rootScope.$broadcast(events.tokenExpired);
            };

            var internalServerError = function () {
                $rootScope.$broadcast(events.onInternalServerError);
            };

            var badRequest = function (error) {
                $rootScope.$broadcast(events.onBadRequest, error);
            };

            return {
                requestStarted: requestStarted,
                requestEnded: requestEnded,
                onRequestStarted: onRequestStarted,
                onRequestEnded: onRequestEnded,
                tokenExpired: tokenExpired,
                internalServerError: internalServerError,
                badRequest: badRequest
            };
        }]);