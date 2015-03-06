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

    angular.module('hexaaApp.components.services.controllers.modals')
        .controller('EntityIdContactDialogController', ['$scope', '$modalInstance', 'entityIds',
            function ($scope, $modalInstance, entityIds) {

                var namespace = "modals.entityIdContactDialog.";

                /* FIELDS */
                $scope.entityIds = entityIds; //Title of the dialog
                $scope.selectedContacts = []; //Selectedcontacts

                /*INTERFACE*/
                $scope.close = close;
                $scope.select = select;

                /* IMPLEMENTATION */

                /**
                 * Selects a contact
                 * @param {integer} index Index of the selected contact
                 */
                function select(contact) {
                    var indexInList = $linq($scope.selectedContacts).contains(contact);

                    if (indexInList) {
//remove from list
                        $scope.selectedContacts.remove(contact);
                    }
                    else {
//push
                        $scope.selectedContacts.push(contact);
                    }
                }

                /**
                 * Closes dialog
                 * @param {string} reason: yes | no
                 */
                function close(reason) {
                    if (reason === 'close') {
                        $modalInstance.dismiss();
                    }
                    else {
                        $modalInstance.close($scope.selectedContacts);
                    }
                }

            }]);

}());