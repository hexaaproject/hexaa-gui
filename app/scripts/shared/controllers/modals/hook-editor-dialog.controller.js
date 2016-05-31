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

    angular.module('hexaaApp.shared.controllers.modals')
        .controller('HookEditorCtrl', ['$modalInstance', 'dialogService', '$translate', 'hook', 'service',
            function ($modalInstance, dialogService, $translate, hook, service) {
                var namespace = "shared.modals.hookEditor.";

                //Title of the dialog
                var vm = this;

                /*IMPLEMENTATION*/

                function activate() {
                    vm.close = close;
                    vm.saveHook = saveHook;
                    vm.service = service;
                    vm.hook = hook;
                    vm.isEditing = Object.keys(hook) != 0;
                    vm.isHookUrlHttps = isHookUrlHttps;
                }

                activate();

                /**
                 * @param {string} reason: yes | no
                 */
                function close() {
                    $modalInstance.dismiss();
                }

                function saveHook() {
                    vm.hook.service = service.id;
                    $modalInstance.close(vm.hook);
                }

                function isHookUrlHttps() {
                    if (vm.hook.url == null || vm.hook.url == "") return true;
                    return vm.hook.url.toLowerCase().startsWith("https://");
                }

            }]);
}());
