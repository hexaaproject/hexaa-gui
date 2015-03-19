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
        .controller('AdminNewSecurityDomainDialogCtrl',
        ['$translate', 'dialogService', '$modalInstance', 'targetSecurityDomain','SecurityDomainsProxy','OrganizationsProxy', 'ServicesProxy',
            function ( $translate, dialogService, $modalInstance, targetSecurityDomain,SecurityDomainsProxy, OrganizationsProxy, ServicesProxy) {
                //Namespace for translations
                var namespace = "admin.modals.newSecurityDomainDialog.";

                var vm = this;
                /* INTERFACE */
                vm.save = save;
                vm.close = close;

                /***
                 * Invokes when controller activates
                 */
                function activate() {
                    //Populate form with the given attrspec
                    vm.securitydomain = angular.copy(targetSecurityDomain);
                    SecurityDomainsProxy.getScopedKeys()
                        .then(onGetScopedKeysSuccess,onGetScopedKeysError);
                    OrganizationsProxy.getOrganizations()
                        .then(onGetOrganizationsSuccess,onGetOrganizationsError);
                    ServicesProxy.getServices()
                        .then(onGetServicesSuccess,onGetServicesError);
                }

                function onGetOrganizationsSuccess(data)
                {
                    vm.organizations = angular.copy(data.data.items);
                }

                function onGetOrganizationsError(error)
                {

                }

                function onGetServicesSuccess(data)
                {
                    vm.services = angular.copy(data.data.items);
                }

                function onGetServicesError(error)
                {

                }

                activate();

                function onGetScopedKeysSuccess(data)
                {
                    vm.scoped_keys = angular.copy(data.data.items);
                }

                function onGetScopedKeysError(error)
                {
                    dialogService.error("Huston, van egy kis baj.");
                }

                /**
                 * Save button clicked
                 */
                function save() {
                    //Call service update
                    vm.securitydomain.save()
                        .then(onSaveSecurityDomainSuccess)
                        .catch(onSaveSecurityDomainError);
                }

                /***
                 * Invoked when attributespecifications has been saved successfully
                 * @param data server response
                 */
                function onSaveSecurityDomainSuccess(data) {
                    //successfull transaction
                    dialogService.success($translate.instant(namespace + "msg.attributeSpecificationUpdateSuccess"));
                    $modalInstance.close(vm.securitydomain); //close form and return attrspec
                }

                /**
                 * Invoked when attributespecification could have not been saved
                 * @param error response of the server
                 */
                function onSaveSecurityDomainError(error) {
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


