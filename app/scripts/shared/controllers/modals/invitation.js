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

/**
 *  General modal window for inviting member/manager to service/organization
 * @param $scope parent scope
 * @param $modalInstance
 * @param unitName Service or Organization
 * @param principal Member or Manager
 * @constructor
 */

(function () {

    angular.module('hexaaApp.shared.controllers.modals').controller('ModalInstanceCtrl', ['$scope', '$interval', '$modalInstance', 'unitName', 'principal', 'roles', 'invitation', function ($scope, $interval, $modalInstance, unitName, principal, roles, invitation) {

        var namespace = "modals.invitation.";

        /* FIELDS */
        $scope.unitName = unitName; //Service or Organization
        $scope.principal = principal; // Member or Manager
        $scope.roles = roles; //role lsit of the selected organization
        $scope.invitation = angular.copy(invitation); //return value of dialog
        $scope.prop = {
            useEmail: false
        };

        /* INTERFACE */
        $scope.ok = ok;
        $scope.cancel = cancel;
        $scope.open = open;


        /* IMPLEMENTATION */

        /**
         * OK button clicked, invitation initiated
         */
        function ok() {
            $scope.invitation.emails = ($scope.invitation.emails || '').split(',');
            if (!$scope.prop.useEmail) {
                $scope.invitation.emails = [];
            }
            else {
                $scope.invitation.limit = undefined;
            }
            $modalInstance.close($scope.invitation);
        }

        /**
         * Cancel button clicked
         */
        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        /**
         * Open DatePicker and handle selection
         * @param $event
         * @param opened
         */
        function open($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[opened] = true;
        }

        function activate() {
            if (invitation ) {
                if ($scope.invitation.emails !== undefined
                    && $scope.invitation.emails.isArray) {
                    $scope.invitation.emails = invitation.emails.join(',');
                    $scope.prop.useEmail = invitation.emails.length > 0;
                }
            }
            else $scope.invitation = {};
        }

        activate();
    }]);

}());