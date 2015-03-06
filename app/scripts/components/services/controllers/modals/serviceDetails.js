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
        .controller('ServiceDetailsCtrl',
        ['$scope', '$modalInstance', 'serviceId', 'ServicesProxy', 'dialogService', '$translate',
            function ($scope, $modalInstance, serviceId, ServicesProxy, dialogService, $translate) {

        var namespace = "modals.serviceDetails.";

        /* FIELDS */
        $scope.service = {};

        /* INTERFACE */
        $scope.close = close;

        /**
         * Cancel button clicked
         */
        function close() {
            $modalInstance.dismiss('close');
        }

        function activate() {
            ServicesProxy.getService(serviceId)
                .then(onGetServiceSuccess)
                .catch(onGetServiceError);
        }

        function onGetServiceSuccess(data) {
            $scope.service = data.data;
        }

        function onGetServiceError(error) {
            dialogService.error($translate.instant(namespace + "msg.getServiceError") + error.data.message);
        }

        activate();

    }]);
}());