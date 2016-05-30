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

    angular.module('hexaaApp.components.services.controllers.pages')
        .controller('HooksCtrl',
        ['$scope', 'ServicesProxy', '$translate', 'events', 'dialogService', 'pageTitleService', '$modal',
            function ($scope, ServicesProxy, $translate, events, dialogService, pageTitleService, $modal) {

                var namespace = "services.hooks.";

                var vm = this;
                vm.addHook = addHook;
                vm.onHookDeleteClicked = onHookDeleteClicked;
                vm.onHookEditClicked = onHookEditClicked;

                /* FIELDS */

                /* INTERFACE */

                /* IMPLEMENTATION */
                function activate() {
                    vm.service = {id: -1};
                    $scope.$emit(events.serviceCanBeSaved, false);
                    $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));

                }

                activate();

                function onHookDeleteSuccess(hook) {
                    return function (data) {
                        dialogService.success($translate.instant(namespace + "msg.hookDeleteSuccess"));
                        var index = $linq(vm.service.hooks).indexOf("x=>x.id == " + hook.id);
                        vm.service.hooks.removeAt(index);
                    }
                }

                function onHookDeleteError() {
                    dialogService.error($translate.instant(namespace + "msg.hookDeleteError"));
                }

                function onHookUpdateSuccess(hook) {
                    return function (data) {
                        dialogService.success($translate.instant(namespace + "msg.hookUpdateSuccess"));
                        var index = $linq(vm.service.hooks).indexOf("x=>x.id == " + hook.id);
                        vm.service.hooks[index] = angular.copy(hook);
                    }
                }

                function onHookUpdateError() {
                    dialogService.error($translate.instant(namespace + "msg.hookUpdateError"));
                }

                function onHookAddSuccess(hook) {
                    return function (data) {
                        dialogService.success($translate.instant(namespace + "msg.hookCreateSuccess"));
                        var id = data.headers("Location").match("(.*)/hooks/(.*)")[2];
                        hook.id = id;
                        vm.service.hooks.push(hook);
                    }
                }

                function onHookAddError(data) {
                    dialogService.error($translate.instant(namespace + "msg.hookCreateError"));
                }

                function onAddHookDialogClosed(hook) {
                    ServicesProxy.addHook(hook)
                        .then(onHookAddSuccess(hook), onHookAddError);
                }

                function onHookEditFinished(hook) {
                    ServicesProxy.updateHook(hook).then(onHookUpdateSuccess(hook), onHookUpdateError);
                }

                function onHookEditClicked(hook) {
                    var modalInstance = showEditorDialog(hook);
                    modalInstance.result.then(onHookEditFinished);
                }

                function onHookDeleteConfirmed(hook) {
                    return function (answer) {
                        if (answer == 'yes') {
                            ServicesProxy.deleteHook(hook).then(onHookDeleteSuccess(hook), onHookDeleteError);
                        }
                    }
                }

                function onHookDeleteClicked(hook) {
                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"), $translate.instant(namespace + "msg.confirmHookRemove"))
                        .then(onHookDeleteConfirmed(hook));
                }

                function showEditorDialog(hookToEdit) {
                    var hook = hookToEdit || {};

                    var modalInstance = $modal.open({
                        templateUrl: '../../../../../views/shared/modals/hookEditor.html',
                        controller: 'HookEditorCtrl as vm',
                        resolve: {
                            service: function () {
                                return angular.copy(vm.service)
                            },
                            hook: function () {
                                return angular.copy(hook);
                            }
                        }
                    });

                    return modalInstance;
                }

                /* CALLBACKS*/

                function addHook() {
                    var modalInstance = showEditorDialog();
                    modalInstance.result.then(onAddHookDialogClosed);
                }

                function onGetServiceSuccess(data) {
                    vm.service = angular.copy(data.data);
                }


                function onGetServiceError(data) {

                }

                /**
                 * Service selection changed
                 * @param id  - service id
                 */
                function onServicesSelectionChanged(event, selectedService) {
                    if (selectedService != -1) {
                        ServicesProxy.getService(selectedService)
                            .then(onGetServiceSuccess, onGetServiceError);

                    }
                }


            }]);
}());
