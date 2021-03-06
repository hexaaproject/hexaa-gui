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

    angular.module("hexaaApp.components.profile.controllers.modals")
        .controller('ProfileAttributeEditorDialogCtrl', ['$scope', '$translate', '$modalInstance', 'targetAttribute', 'targetAttributeSpecification', 'PrincipalFacade',
            function ($scope, $translate, $modalInstance, targetAttribute, targetAttributeSpecification, PrincipalFacade) {

                var namespace = "profile.modals.attributeEditorDialog.";
                var vm = this;

                vm.attribute = angular.copy(targetAttribute);
                vm.attributeSpecification = angular.copy(targetAttributeSpecification);
                vm.close = close;
                vm.save = save;

                function activate() {

                }

                function close() {
                    $modalInstance.dismiss();
                }

                function save(attribute) {
                    $modalInstance.close(attribute);
                }

                activate();


            }]);

}());