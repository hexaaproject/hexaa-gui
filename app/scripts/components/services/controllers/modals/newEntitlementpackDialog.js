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

    angular.module('hexaaApp.components.services.controllers.pages').controller('ServicesEntitlementpacksNewCtrl',
        ['$scope', '$translate', '$modalInstance', 'targetService', 'targetEntitlementpack', 'dialogService',
            function ($scope, $translate, $modalInstance, targetService, targetEntitlementpack, dialogService) {

                /* FIELDS */
                var vm = this;
                var namespace = "services.modals.newEntitlementpackDialog.";

                vm.service = angular.copy(targetService);

                vm.entitlementpack = angular.copy(targetEntitlementpack);

                /* INTERFACE */
                vm.saveEntitlementpack = saveEntitlementpack;
                vm.close = close;
                /* IMPLEMENTATION */

                function close() {
                    $modalInstance.dismiss();
                }

                function saveEntitlementpack() {

                    vm.entitlementpack.save()
                        .then(onSaveEntitlementpackSuccess(vm.entitlementpack))
                        .catch(onSaveEntitlementpackError(vm.entitlementpack));

                    $modalInstance.close(vm.entitlementpack)
                }

                function onSaveEntitlementpackSuccess(entitlementpack) {
                    return function (data) {
                        dialogService.success($translate.instant(namespace + "msg.entitlementpackSaveSuccess"));
                        entitlementpack.commit();
                    }
                }

                function onSaveEntitlementpackError(entitlementpack) {
                    return function (error) {
                        dialogService.notifyUIError(error.data.errors);
                        dialogService.error($translate.instant(namespace + "msg.entitlementpackSaveError"));
                    }
                }


            }]);

}());