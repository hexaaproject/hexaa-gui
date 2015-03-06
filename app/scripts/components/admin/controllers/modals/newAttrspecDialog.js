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

    angular.module('hexaaApp.components.admin.controllers.modals')
        .controller('AdminNewAttributeSpecificationDialogCtrl',
        ['$translate', 'dialogService', '$modalInstance', 'targetAttributeSpecification',
            function ( $translate, dialogService, $modalInstance, targetAttributeSpecification) {
                //Namespace for translations
                var namespace = "admin.modals.newAttrspecDialog.";

                var vm = this;
                /* INTERFACE */
                vm.save = save;
                vm.close = close;

                /***
                 * Invokes when controller activates
                 */
                function activate() {
                    //Populate form with the given attrspec
                    vm.attrspec = angular.copy(targetAttributeSpecification);
                }

                activate();

                /**
                 * Save button clicked
                 */
                function save() {
                    //Call service update
                    vm.attrspec.save()
                        .then(onSaveAttributeSpecificationSuccess)
                        .catch(onSaveAttributeSpecificationError);
                }

                /***
                 * Invoked when attributespecifications has been saved successfully
                 * @param data server response
                 */
                function onSaveAttributeSpecificationSuccess(data) {
                    //successfull transaction
                    dialogService.success($translate.instant(namespace + "msg.attributeSpecificationUpdateSuccess"));
                    $modalInstance.close(vm.attrspec); //close form and return attrspec
                }

                /**
                 * Invoked when attributespecification could have not been saved
                 * @param error response of the server
                 */
                function onSaveAttributeSpecificationError(error) {
                    dialogService.notifyUIError(error.data.errors); //Show tooltips on input fields
                    dialogService.error($translate.instant(namespace + "msg.attributeSpecificationUpdateError"));
                }

                /**
                 * close dialog
                 */
                function close() {
                    $modalInstance.dismiss();
                }

            }]);
}());


