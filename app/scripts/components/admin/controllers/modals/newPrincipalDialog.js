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

    angular.module('hexaaApp.components.admin.controllers.modals').controller('AdminNewPrincipalDialogCtrl',
        [ '$translate', 'dialogService', '$modalInstance', 'targetPrincipal',
            function ( $translate, dialogService, $modalInstance, targetPrincipal) {

                //Namespace of the translation
                var namespace = "admin.modals.newPrincipalDialog.";

                var vm = this;
                /* INTERFACE */
                vm.save = save;
                vm.close = close;

                /***
                 * Invokes when controller activated
                 */
                function activate() {
                    //Populate form with the principal given as parameter
                    vm.principal = angular.copy(targetPrincipal);
                }

                activate();

                /**
                 * Save button clicked
                 */
                function save() {
                    //Call service update
                    vm.principal.save()
                        .success(onPrincipalSaveSuccess(vm.principal))
                        .error(onPrincipalSaveError(vm.principal));
                }


                /**
                 * Invokes when principal saved successfully
                 * @param principal the principal that has been persisted
                 * @returns {Function} partial application for promise
                 */
                function onPrincipalSaveSuccess(principal) {
                    return function (data, status, headers, config) {
                        if (principal.id == -1)
                        {
                            //Principal Created
                            dialogService.success($translate.instant(namespace + "msg.principalCreateSuccess"));
                        }
                        else
                        {
                            //Principal updated
                            dialogService.success($translate.instant(namespace + "msg.principalUpdateSuccess"));
                        }
                        $modalInstance.close(principal);
                    }
                }

                /**
                 * Invokes when principal has not been saved
                 * @param principal The principal that wasnt saved
                 * @returns {Function} Partial application for promise
                 */
                function onPrincipalSaveError(principal) {
                    return function (data, status, headers, config) {
                        dialogService.notifyUIError(data.errors);
                        if (principal.id == -1)
                        {
                            //Couldnt create principal
                            dialogService.error($translate.instant(namespace + "msg.principalCreateError"));
                        }
                        else
                        {
                            //Couldnt update principal
                            dialogService.error($translate.instant(namespace + "msg.principalUpdateError"));
                        }
                    }
                }

                /**
                 * Close dialog
                 */
                function close() {
                    $modalInstance.dismiss();
                }

            }]);
}());


