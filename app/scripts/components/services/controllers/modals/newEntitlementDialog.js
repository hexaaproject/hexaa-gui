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
        .controller('ServiceEntitlementNewCtrl', ['$modalInstance', 'targetEntitlement', 'prefix', '$scope',
        function ($modalInstance, targetEntitlement, prefix, $scope) {

            var namespace = "services.modals.newEntitlementDialog.";

            var vm = this;

            /*INTERFACE*/
            vm.close = close;
            vm.entitlement = angular.copy(targetEntitlement);
            vm.save = save;
            vm.prefix = prefix;
            vm.undo = undo;

            function removePrefix(uri) {
                if (uri ) {
                    return uri.replace(vm.prefix, "");
                }
                else {
                    return "";
                }
            }


            /*IMPLEMENTATION*/

            function activate() {

            }

            activate();

            function close() {
                $modalInstance.dismiss();
            }

            function save() {
                $modalInstance.close(vm.entitlement);
            }

            function undo() {
                vm.entitlement.undo();
                vm.entitlement.uri = removePrefix(vm.entitlement.uri);
            }

        }]);

}());