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

    angular.module('hexaaApp.shared.controllers.modals').controller('ConfirmationDialogCtrl', ['$scope', '$modalInstance', 'title', 'body', function ($scope, $modalInstance, title, body) {
        var namespace = "modals.message.";

        //Title of the dialog
        $scope.title = title;
        //body of the dialog
        $scope.body = body;

        /*INTERFACE*/
        $scope.close = close;

        /*IMPLEMENTATION*/

        /**
         * @param {string} reason: yes | no
         */
        function close(reason) {
            $modalInstance.close(reason);
        }
    }]);
}());
