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
        .controller('MailDialogCtrl', ['$modalInstance', 'MailFactory','target','recipient','dialogService','$translate',
            function ($modalInstance, MailFactory, target, recipient,dialogService, $translate) {
                var namespace = "shared.modals.mailDialog.";

                //Title of the dialog
                var vm = this;

                /*INTERFACE*/
                vm.close = close;
                vm.send = send;
                vm.target = target;
                vm.recipient = recipient;

                /*IMPLEMENTATION*/

                function activate()
                {
                    vm.mail = MailFactory.new();
                }
                activate();

                /**
                 * @param {string} reason: yes | no
                 */
                function close() {
                    $modalInstance.dismiss();
                }

                function send()
                {
                    if (vm.target !== undefined &&
                        vm.target !== null)
                    {
                        if (vm.target.constructor === OrganizationFactory.class) {
                            vm.mail.organization = vm.target.id;
                        }
                        else if (vm.target.constructor === ServiceFactory.class){
                            vm.mail.service = vm.target.id;
                        }
                        else if (vm.target.constructor === RoleFactory.class){
                            vm.mail.role = vm.target.id;
                        }
                    }


                    vm.mail.target = recipient;

                    vm.mail.send()
                        .then(onMailSendSuccess,onMailSendError);
                }

                function onMailSendSuccess(data)
                {
                    dialogService.success($translate(namespace+"msg.sendMailSuccess"));
                    $modalInstance.close(angular.copy(vm.mail));
                }

                function onMailSendError(error)
                {
                    dialogService.error(error.data.message);
                    $modalInstance.dismiss();
                }
            }]);
}());
