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

    angular.module('hexaaApp.components.services.controllers.pages')
        .controller('ServiceNewCtrl', ['$scope', 'HexaaService',  '$translate', '$modalInstance', 'ServicesFacade', 'dialogService',
            function ($scope, HexaaService, $translate, $modalInstance, ServicesFacade, dialogService) {

        var namespace = "services.new.";

        /* FIELDS */
        $scope.entityIdsPanel_collapse = false;
        $scope.entityids = []; //System entity ids
        $scope.new = ServicesFacade.new();
        $scope.selectedContacts = [];   //Selectedcontacts


        $scope.select = select;
        $scope.save = save;
        $scope.close = close;

        function activate() {
            ServicesFacade.getEntityIds().then(onGetEntityIdsSuccess);
        }

        activate();

        /**
         * Selects a contact and puts into an array (selected contacts)
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
         * save new service button handler
         */
        function save() {
            $scope.new.contacts = $scope.selectedContacts;
            $scope.new.save()
                .then(onServiceSaveSuccess)
                .catch(onServiceSaveError);
        }

        function close() {
            $modalInstance.dismiss("close")
        }

        /* CALLBACKS */


        function onServiceSaveError(error) {
            dialogService.error($translate.instant(namespace + "msg.serviceCreateError") + error.data.message);
            dialogService.notifyUIError(error.data.errors);
        }

        function onServiceSaveSuccess(data) {
            dialogService.success($translate.instant(namespace + "msg.serviceCreateSuccess"));
            $modalInstance.close($scope.new);
        }

        function onGetEntityIdsSuccess(data) {
            $scope.entityids = data.data.items;
        }
    }]);
}());
