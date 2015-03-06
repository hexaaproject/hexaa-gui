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
'use strict';
angular.module('hexaaApp.shared.directives').directive('loadingWidget', ['requestNotificationChannel', function (requestNotificationChannel) {
    return {
        restrict: "A",
        link: function (scope, element) {
            // hide the element initially
            //element.modal('hide'); //use it if modal
            element.hide();

            var startRequestHandler = function () {
                // got the request start notification, show the element
                //element.modal('show'); //use it if modal
                element.show();
            };

            var endRequestHandler = function () {
                // got the request start notification, show the element
                //element.modal('hide'); //use it if modal
                element.hide();
            };

            requestNotificationChannel.onRequestStarted(scope, startRequestHandler);

            requestNotificationChannel.onRequestEnded(scope, endRequestHandler);
        }
    };
}]);