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

'use strict';

angular.module('hexaaApp.components.organizations.controllers.modals')
    .controller('OrganizationNewDialogCtrl',
    ['$scope', 'dialogService', '$modalInstance', 'OrganizationsFacade', '$translate',
        function ($scope, dialogService, $modalInstance, OrganizationsFacade, $translate) {
            var vm = this;
            var namespace = "organizations.new."

            /* INTERFACE */
            vm.save = save;
            vm.close = close;
            vm.organization = OrganizationsFacade.new();
            vm.valid = false; //Is the form valid?

            /**
             * Invoked when controller has been created.
             */
            function activate() {

            }

            activate();

            /**
             * Save Organization button clicked
             */
            function save() {
                vm.organization.save()
                    .then(onOrganizationSaveSuccess)
                    .catch(onOrganizationSaveError);
            }

            /**
             * Invoked when organization has been saved
             * @param data Server response
             */
            function onOrganizationSaveSuccess(data) {
                dialogService.success($translate.instant(namespace + "msg.organizationCreateSuccess"));
                $modalInstance.close(vm.organization);
            }

            /**
             * Invoked when saving organization was not successful
             * @param errors
             */
            function onOrganizationSaveError(errors) {
                dialogService.notifyUIError(errors.data.errors);
                dialogService.error($translate.instant(namespace + "msg.organizationCreateError"));
            }

            /**
             * Close modal window
             */
            function close() {
                $modalInstance.dismiss("close");
            }
        }]);

