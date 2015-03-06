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
        .controller('AdminAttributeSpecificationsCtrl',
        ['$scope', 'AttributeSpecificationsProxy', '$translate', 'dialogService', '$modal', 'pageTitleService',
            function ($scope, AttributeSpecificationsProxy, $translate, dialogService, $modal, pageTitleService) {

                /*Namespace of the corresponding language files*/
                var namespace = "admin.attributespecifications.";

                var vm = this;
                /* FIELDS */
                vm.attrspecs = [];

                /* Pager settings */
                vm.pager = {
                    itemPerPage: 25, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: 0, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                /*INTERFACE*/
                vm.edit = create;
                vm.delete = remove;
                vm.new = create;

                /** IMPLEMENTATION **/

                /**
                 * Creates an attrspec editor window. Gives the ability to create/edit attrspec.
                 * @param targetAttrSpec The attrspec to edit. If undefined, it will create a new
                 */
                function create(targetAttrSpec) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/components/admin/modals/newAttrspecDialog.html',
                        controller: 'AdminNewAttributeSpecificationDialogCtrl as vm',
                        resolve: {
                            targetAttributeSpecification: function () {
                                return targetAttrSpec || AttributeSpecificationsProxy.new();
                            }
                        }
                    });
                    modalInstance.result.then(onAttributeSpecificationModalClosed);
                }



                /**
                 * confirm delete attrspecs
                 * @param attrspec attrspec given
                 */
                function remove(attrspec) {

                    dialogService.confirm($translate.instant(namespace + "msg.confirmationNeeded"), $translate.instant(namespace + "msg.attributeSpecificationDeleteConfirm", {name: attrspec.name}))
                        .then(onDeleteAttributeSpecificationConfirmationDialogClosed(attrspec));
                }

                /*
                 * Activate controller
                 */
                function activate() {
                    AttributeSpecificationsProxy.getAttributeSpecifications(vm.pager)
                        .then(onGetAttributeSpecificationsSuccess)
                        .catch(onGetAttributeSpecificationsError);

                    $scope.$watch("vm.pager.currentPage", onCurrentPageChanged);
                    $scope.$watch("vm.pager.itemPerPage", onCurrentPageChanged);
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                activate();

                /* CALLBACKS */

                /**
                 * Invoked when user selects an other page and attrspecs need to be paged and the view
                 * refreshed correctly
                 * @param oldPage old page id
                 * @param newPage new page id
                 */
                function onCurrentPageChanged(newPage, oldPage) {
                    if (oldPage !== newPage) {
                        AttributeSpecificationsProxy.getAttributeSpecifications(vm.pager)
                            .then(onGetAttributeSpecificationsSuccess)
                            .catch(onGetAttributeSpecificationsError);
                    }
                }

                /**
                 * Invoked when user closes the attrspec editor.
                 * @param attrspec Edited Attributespecification
                 */
                function onAttributeSpecificationModalClosed(attrspec) {
                    if (attrspec.id === -1) {
                        //If it was freshly created, just push it to the list
                        vm.attrspecs.push(attrspec);
                    }
                    else {
                        //if it was an existing and we edited it, grab it from the collection...
                        var index = $linq(vm.attrspecs).indexOf("x => x.id == " + attrspec.id);
                        if (index !== -1) {
                            //and update it
                            vm.attrspecs[index] = attrspec;
                        }
                    }
                }

                /**
                 * Invoked when an attributespecification has been deleted
                 * @param attrspec the attributespecification that was removed
                 * @returns {Function} Partial Application for promise
                 */
                function onDeleteAttributeSpecificationSuccess(attrspec) {
                    return function (data) {
                        //attrspecs removed
                        dialogService.success($translate.instant(namespace + "msg.attributeSpecificationDeleteSuccess"));
                        //refresh list
                        vm.attrspecs.splice($linq(vm.attrspecs).indexOf("x=>x.id==" + attrspec.id), 1);
                    }
                }

                /**
                 * Invoked when an attributespecification wasnt remvoed due to an error
                 * @param error Server response
                 */
                function onDeleteAttributeSpecificationError(error) {
                    dialogService.error($translate.instant(namespace + "msg.attributeSpecificationDeleteError"));
                }

                /**
                 * Invoked when user answered the confirmation dialog
                 * @param attrspec attribute specification which to be confirmed
                 * @returns {Function} partial application of confirmdialog promise
                 */
                function onDeleteAttributeSpecificationConfirmationDialogClosed(attrspec) {
                    return function (answer) {
                        if (answer == 'yes') {
                            attrspec.delete()
                                .then(onDeleteAttributeSpecificationSuccess(attrspec))
                                .catch(onDeleteAttributeSpecificationError);
                        }
                    }
                }

                /**
                 * Invoked when AttrSpecs has been downloaded
                 * @param data server response
                 */
                function onGetAttributeSpecificationsSuccess(data) {
                    vm.attrspecs = data.data.items;
                    vm.pager.totalItems = data.data.item_number;
                }

                /**
                 * Invoked when downloading attrspecs run into an error
                 * @param error Server response
                 */
                function onGetAttributeSpecificationsError(error) {
                    dialogService.error($translate.instant(namespace + "msg.attributeSpecificationGetError"))
                }
            }]);

}());