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

    angular.module('hexaaApp.components.profile.controllers.pages')
        .controller('ProfileAttributesCtrl',
        ['$scope', 'dialogService', '$translate', 'AttributeSpecificationsProxy', 'PrincipalProxy', 'ResourceEntity', 'pageTitleService', '$modal',
        function ($scope, dialogService, $translate, AttributeSpecificationsProxy, PrincipalProxy, ResourceEntity, pageTitleService, $modal) {

            var namespace = "profile.attributes.";

            /* FIELDS */

            $scope.profile.attributeSpecifications = []; //List of attributespecifications that are connected to the principal
            $scope.load = load;
            $scope.saveAttribute = saveAttribute;
            $scope.newAttribute = newAttribute;
            $scope.removeAttribute = removeAttribute;
            $scope.editAttribute = newAttribute;
            $scope.showServiceDetails = dialogService.showServiceDetails;

            /**
             * Invoked when controller created
             */
            function activate() {
                PrincipalProxy.getAttributeSpecifications()
                    .then(onGetAttributeSpecificationsSuccess);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
            }
            activate();


            /**
             * lazy loads an attributespecification
             * @param attrspec
             */
            function load(attrspec) {

                PrincipalProxy.getAttributeValuePrincipals(attrspec.id)
                    .then(onGetAttributeValuePrincipalsSuccess(attrspec));

                AttributeSpecificationsProxy.getSupportingServices(attrspec)
                    .then(onGetSupportingServicesSuccess(attrspec));
            }

            function onAddAttributeValuePrincipalSuccess(attributeSpecification, attribute) {
                return function (data) {
                    attribute.commit();
                    dialogService.success($translate.instant(namespace + "msg.attributeValuePrincipalCreateSuccess"));
                    attributeSpecification.values.push(attribute); //persist local
                }
            }

            function onAddAttributeValuePrincipalError(error) {
                dialogService.notifyUIError(error.data.errors);
                dialogService.error($translate.instant(namespace + "msg.attributeValuePrincipalCreateError") + error.data.message);
            }

            function onUpdateAttributeValuePrincipalSuccess(attributeSpecification, attribute) {
                return function (data) {
                    attribute.commit();
                    var index = $linq(attributeSpecification.values).indexOf("x => x.id == " + attribute.id);
                    attributeSpecification.values[index] = attribute;
                    dialogService.success($translate.instant(namespace + "msg.attributeValuePrincipalUpdateSuccess"));
                }
            }

            function onUpdateAttributeValuePrincipalError(attribute) {
                return function (error) {
                    dialogService.notifyUIError(error.data.errors);
                    dialogService.error($translate.instant(namespace + "msg.attributeValuePrincipalUpdateError") + error.data.message);
                }
            }

            /**
             * Save current AttributeValuePrincipal
             */
            function saveAttribute(attrspec, attribute) {
                if (attribute.id == -1) {
                    PrincipalProxy.addAttributeValuePrincipal(attribute)
                        .then(onAddAttributeValuePrincipalSuccess(attrspec, attribute))
                        .catch(onAddAttributeValuePrincipalError);
                }
                else {
                    //update existing
                    PrincipalProxy.updateAttributeValuePrincipal(attribute)
                        .then(onUpdateAttributeValuePrincipalSuccess(attrspec, attribute))
                        .catch(onUpdateAttributeValuePrincipalError(attribute));
                }
            }

            /**
             * New AttributeValuePrincipal button clicked
             */
            function newAttribute(attrspec, attributeToEdit) {
                var attribute = attributeToEdit || ResourceEntity.new({
                        id: -1,
                        is_default: false,
                        attribute_spec_id: attrspec.id,
                        services: [],
                        associatedServices: []
                    });

                var modalInstance = $modal.open({
                    templateUrl: 'views/components/profile/modals/attributeEditorDialog.html',
                    controller: 'ProfileAttributeEditorDialogCtrl as vm',
                    resolve: {
                        targetAttribute: function () {
                            return attribute;
                        },
                        targetAttributeSpecification: function () {
                            return attrspec;
                        }
                    }
                });
                modalInstance.result.then(onNewAttributeModalClosed(attrspec));
            }

            function onNewAttributeModalClosed(attrspec) {
                return function (attribute) {
                    saveAttribute(attrspec, attribute);
                }

            }

            /**
             * Remove Attribute Value Principal button clicked
             */
            function removeAttribute(attrspec, attribute) {
                PrincipalProxy.deleteAttributeValuePrincipal(attribute.id)
                    .then(onDeleteAttributeValuePrincipalSuccess(attrspec, attribute))
                    .catch(onDeleteAttributeValuePrincipalError);
            };


            /* CALLBACKS */
            function onGetAttributeValuePrincipalsSuccess(attrspec) {
                return function (attrvalues) {
                    attrspec.values = angular.copy(attrvalues.data.items);
                }
            }

            function onGetAttributeSpecificationsSuccess(data) {
                $scope.profile.attributeSpecifications = angular.copy(data.data.items);
            }

            function onGetSupportingServicesSuccess(attrspec) {
                return function (data) {
                    attrspec.supportingServices = angular.copy(data.data.items);
                }
            }

            function onDeleteAttributeValuePrincipalSuccess(attrspec, attribute) {
                return function (data) {
                    var index = $linq(attrspec.values).indexOf("x=> x.id == " + attribute.id);
                    attrspec.values.removeAt(index);
                    dialogService.success($translate.instant(namespace + "msg.attributeValuePrincipalRemoveSuccess"));
                }
            }

            function onDeleteAttributeValuePrincipalError(error) {
                dialogService.showMessage($translate.instant(namespace + "msg.problemOccured"), error.data.message);
            }


        }]);

}());