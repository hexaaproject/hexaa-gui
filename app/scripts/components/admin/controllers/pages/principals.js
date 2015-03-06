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
        .controller('AdminPrincipalsCtrl', [ 'PrincipalProxy', '$translate', 'dialogService', '$modal', 'pageTitleService',
            function ( PrincipalProxy, $translate, dialogService, $modal, pageTitleService) {

                //Namespace of language files
                var namespace = "admin.principals.";
                var vm = this;

                /*FIELDS*/
                vm.principals = [];

                /* Pager settings */
                vm.pager = {
                    itemPerPage: 25, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: 0, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                /*INTERFACE*/
                vm.deletePrincipal = deletePrincipal;
                vm.newPrincipal = create;
                vm.edit = create;

                /* IMPLEMENTATION */

                /**
                 * Creates a principal editor dialog. If no target principal to edit specified, it creates a new one
                 */
                function create(targetPrincipal) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/components/admin/modals/newPrincipalDialog.html',
                        controller: 'AdminNewPrincipalDialogCtrl as vm',
                        resolve: {
                            targetPrincipal: function () {
                                return targetPrincipal || PrincipalProxy.new();
                            }
                        }
                    });
                    modalInstance.result.then(onPrincipalModalClosed);
                }

                /**
                 * Invoked when principal modal closed
                 * @param principal Principal which was edited
                 */
                function onPrincipalModalClosed(principal) {
                    var index = $linq(vm.principals).indexOf("x => x.id == " + principal.id);
                    if (index === -1) {
                        vm.principals.push(principal);

                    }
                    else {
                        vm.principals[index] = principal;
                    }

                }

                /**
                 * Invoked when user deletes a principal
                 * @param principal Principal to be deleted
                 */
                function deletePrincipal(principal) {
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"), $translate.instant(namespace + "msg.principalDeleteConfirm", {fedid: principal.fedid})).
                        then(function (answer) {
                            if (answer == 'yes') {
                                principal.delete()
                                    .success(onPrincipalDeleteSuccess(principal))
                                    .error(onPrincipalDeleteError);
                            }
                        });
                }

                /**
                 * Invoked when controller instantiated
                 */
                function activate() {
                    PrincipalProxy.getPrincipals()
                        .then(onGetPrincipalsSuccess)
                        .catch(onGetPrincipalsError);
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                activate();

                /* CALLBACKS */

                /**
                 * Invoked when principal was deleted successfully
                 * @param principal Principal that was deleted
                 * @returns {Function} Partial Application for promise
                 */
                function onPrincipalDeleteSuccess(principal) {

                    return function (data, status, headers, config) {
                        dialogService.success($translate.instant(namespace + "msg.principalDeleteSuccess"));
                        vm.principals.splice($linq(vm.principals).indexOf("x=>x.id==" + principal.id), 1); //Remove principal
                    }
                }

                /**
                 * Invoked when the server couldnt delete the principal
                 * @param error Server response
                 */
                function onPrincipalDeleteError(error) {
                    dialogService.error($translate.instant(namespace + "msg.principalDeleteError"));
                }

                /**
                 * Invoked when the requested principals arrived
                 * @param principals System principals
                 */
                function onGetPrincipalsSuccess(principals) {
                    vm.principals = principals.data.items;
                    vm.pager.totalItems = principals.data.items.length;
                }

                /**
                 * Invoked when server couldnt retrieve principals
                 * @param error Server response
                 */
                function onGetPrincipalsError(error) {
                    dialogService.error($translate.instant(namespace + "msg.principalGetError"));
                }

            }]);
}());
