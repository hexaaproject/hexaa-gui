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

    angular.module('hexaaApp.components.admin.controllers.pages')
        .controller('AdminSecurityDomainsCtrl',
            [  '$translate', 'dialogService', '$modal', 'pageTitleService','SecurityDomainsProxy',
            function (  $translate, dialogService, $modal, pageTitleService, SecurityDomainsProxy) {

                //Namespace of language files
                var namespace = "admin.securityDomains.";
                var vm = this;
                vm.newSecurityDomain = create;
                vm.edit = create;
                vm.deleteSecurityDomain = deleteSecurityDomain;

                /*FIELDS*/
                vm.securitydomains = [];

                /* Pager settings */
                vm.pager = {
                    itemPerPage: 25, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: 0, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                /*INTERFACE*/


                /* IMPLEMENTATION */

                /**
                 * Creates a principal editor dialog. If no target principal to edit specified, it creates a new one
                 */
                function create(targetSecurityDomain) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/components/admin/modals/newSecurityDomainDialog.html',
                        controller: 'AdminNewSecurityDomainDialogCtrl as vm',
                        resolve: {
                            targetSecurityDomain: function () {
                                return targetSecurityDomain || SecurityDomainsProxy.new();
                            }
                        }
                    });
                    modalInstance.result.then(onNewSecurityDomainModalClosed);
                }

                /**
                 * Invoked when principal modal closed
                 * @param principal Principal which was edited
                 */
                function onNewSecurityDomainModalClosed(securitydomain) {
                    var index = $linq(vm.securitydomains).indexOf("x => x.id == " + securitydomain.id);
                    if (index === -1) {
                        vm.securitydomains.push(securitydomain);

                    }
                    else {
                        vm.securitydomains[index] = securitydomain;
                    }

                }

                /**
                 * Invoked when user deletes a principal
                 * @param principal Principal to be deleted
                 */
                function deleteSecurityDomain(securitydomain) {
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"),
                        $translate.instant(namespace + "msg.securityDomainConfirm", {name: securitydomain.name})).
                        then(function (answer) {
                            if (answer == 'yes') {
                                securitydomain.delete()
                                    .success(onSecurityDomainDeleteSuccess(securitydomain))
                                    .error(onSecurityDomainDeleteError);
                            }
                        });
                }

                /**
                 * Invoked when controller instantiated
                 */
                function activate() {
                    SecurityDomainsProxy.getAll()
                        .then(onGetSecurityDomainsSuccess)
                        .catch(onGetSecurityDomainsError);
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                activate();

                /* CALLBACKS */

                /**
                 * Invoked when principal was deleted successfully
                 * @param principal Principal that was deleted
                 * @returns {Function} Partial Application for promise
                 */
                function onSecurityDomainDeleteSuccess(securitydomain) {

                    return function (data, status, headers, config) {
                        dialogService.success($translate.instant(namespace + "msg.securityDomainDeleteSuccess"));
                        vm.securitydomains.splice($linq(vm.securitydomains).indexOf("x=>x.id==" + securitydomain.id), 1); //Remove principal
                    }
                }

                /**
                 * Invoked when the server couldnt delete the principal
                 * @param error Server response
                 */
                function onSecurityDomainDeleteError(error) {
                    dialogService.error($translate.instant(namespace + "msg.securityDomainDeleteError"));
                }

                /**
                 * Invoked when the requested principals arrived
                 * @param principals System principals
                 */
                function onGetSecurityDomainsSuccess(securitydomains) {
                    vm.securitydomains = angular.copy(securitydomains.data.items);
                    vm.pager.totalItems = securitydomains.data.items.length;
                }

                /**
                 * Invoked when server couldnt retrieve principals
                 * @param error Server response
                 */
                function onGetSecurityDomainsError(error) {
                    dialogService.error($translate.instant(namespace + "msg.securityDomainGetError"));
                }

            }]);
}());
