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

    /* http://codingsmackdown.tv/blog/2013/04/20/using-response-interceptors-to-show-and-hide-a-loading-widget-redux/ */
    /* Config HTTP interceptor */

    function httpInterceptor($q, $injector) {
        var notificationChannel;

        function request(config) {

            // get requestNotificationChannel via $injector because of circular dependency problem
            notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
            // send a notification requests are complete
            notificationChannel.requestStarted();
            return config;
        }

        /*Occurs when a http request ends with success*/
        function response(response) {
            // get $http via $injector because of circular dependency problem
            var $http = $injector.get('$http');
            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                // get requestNotificationChannel via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                // send a notification requests are complete
                notificationChannel.requestEnded();
            }
            return response;
        }

        /* Occurs when a http request ends with error */
        function responseError(response) {
            // get $http via $injector because of circular dependency problem
            var $http = $injector.get('$http');
            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                // get requestNotificationChannel via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                // send a notification requests are complete
                notificationChannel.requestEnded();
            }

            //https://code.angularjs.org/1.3.10/docs/api/ng/service/$http

            if (response.status === 401) {
                notificationChannel.tokenExpired();
            }
            else if (response.status == 500) {
                //internal server error
                notificationChannel.internalServerError();
            }
            else {
                notificationChannel.badRequest(response.data);
            }

            return $q.reject(response);
        }

        return {
            request: request,
            response: response,
            responseError: responseError
        };
    }

    function httpProvider($httpProvider) {
        var $http,
            interceptor = ['$q', '$injector', httpInterceptor];
        if ($httpProvider.interceptors !== undefined) //responseInterceptors
        {
            $httpProvider.interceptors.push(interceptor); //responseInterceptors
        }
    }

    angular.module("hexaaApp.config")
        .config(['$httpProvider', httpProvider]);
}());