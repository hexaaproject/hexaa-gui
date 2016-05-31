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
     * Configuring the angular routing api
     */
    angular.module("hexaaApp.config").config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/organizations', {
                    templateUrl: 'views/components/organizations/pages/index.html'
                }).
                when('/organizations/:id?/:page', {
                    templateUrl: 'views/components/organizations/pages/index.html'
                }).
                when('/services', {
                    templateUrl: 'views/components/services/pages/index.html'
                }).
                when('/services/:id?/:page', {
                    templateUrl: 'views/components/services/pages/index.html'
                }).
                when('/profile', {
                    templateUrl: 'views/components/profile/pages/index.html'
                }).
                when('/profile/:page', {
                    templateUrl: 'views/components/profile/pages/index.html'
                }).
                when('/profile/myservices/entitlement?/:entitlement_id?', {
                    templateUrl: 'views/components/profile/pages/myservices.html'
                }).
                when('/profile/myorganizations/entitlement?/:entitlement_id?', {
                    templateUrl: 'views/components/profile/pages/myorganizations.html'
                }).
                when('/admin', {
                    templateUrl: 'views/components/admin/pages/index.html'
                }).
                when('/admin/:page', {
                    templateUrl: 'views/components/admin/pages/index.html'
                }).
                otherwise({
                    redirectTo: '/profile/dashboard'
                });
        }]);
}());