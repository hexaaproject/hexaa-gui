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

    angular.module('hexaaApp.components.organizations.controllers.pages')
        .controller('OrganizationAttributesCtrl',
        ['$scope', 'dialogService', '$translate', 'AttributeSpecificationsProxy', 'PrincipalProxy', 'events', 'OrganizationsProxy', 'pageTitleService', '$modal',
        function ($scope, dialogService, $translate, AttributeSpecificationsProxy, PrincipalProxy, events, OrganizationsProxy, pageTitleService, $modal) {

            var namespace = "organizations.attributes.";

            /* FIELDS */

            $scope.organization = {};

            /* INTERFACE */
            $scope.saveAttribute = saveAttribute;
            $scope.newAttribute = newAttribute;
            $scope.load = load;
            $scope.removeAttribute = removeAttribute;
            $scope.editAttribute = newAttribute;

            /* IMPLEMENTATION */
            function activate() {
                //Tell the parent to hide save button.
                $scope.$emit(events.organizationCanBeSaved, false);
                $scope.$on(events.organizationsSelectionChanged, organizationsSelectionChanged);
                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
            }

            /**
             * Invoked when selected organization changed
             * @param event
             * @param selectedOrganization selected organization
             */
            function organizationsSelectionChanged(event, selectedOrganization) {
                if (selectedOrganization != undefined) {
                    if ($scope.profile.isManagerOfOrganization(selectedOrganization)) {

                        $scope.organization = {id: selectedOrganization};

                        OrganizationsProxy.getAttributeSpecifications(selectedOrganization)
                            .then(onGetAttributeSpecificationSuccess)
                            .catch(onGetAttributeSpecificationError);
                    }
                    else {
                        $scope.navigate("#/");
                    }

                }
            }


            /**
             * Saves an attribute into an attrspec
             * @param attrspec
             * @param attribute
             */
            function saveAttribute(attrspec, attribute) {
                if (attribute.id === -1) {
                    //Assign attribute to organization
                    attribute.organizationId = $scope.organization.id;
                    //persist
                    OrganizationsProxy.addAttributeValueOrganization(attribute)
                        .then(onAttributeValueOrganizationSaved(attrspec, attribute))
                        .catch(onAttributeValueOrganizationSaveError);
                }
                else {
                    //update existing
                    OrganizationsProxy.updateAttributeValueOrganization(attribute)
                        .then(onAttributeValueOrganizationUpdated(attrspec, attribute))
                        .catch(onAttributeValueOrganizationUpdateError);
                }
            }

            /**
             * Lazy load attrspec
             * @param attrspec
             */
            function load(attrspec) {

                attrspec.organization_id = $scope.organization.id;
                OrganizationsProxy.getAttributeValueOrganizations(attrspec)
                    .then(onGetAttributeValueOrganizationsSuccess(attrspec))
                    .catch(onGetAttributeValueOrganizationsError(attrspec));

                AttributeSpecificationsProxy.getSupportingServices(attrspec)
                    .then(onGetSupportingServicesSuccess(attrspec))
                    .catch(onGetSupportingServicesError);
            }

            /**
             * Creates an attribute editor dialog
             * @param attrspec attributespec of the attribute
             * @param attributeToEdit The attribute to edit. If undefined it will create a new
             */
            function newAttribute(attrspec, attributeToEdit) {
                var attribute = attributeToEdit || {
                        id: -1,
                        is_default: false,
                        attribute_spec: {id: attrspec.id},
                        organization_id: attrspec.organization_id,
                        services: [],
                        associatedServices: []
                    };
                var modalInstance = $modal.open({
                    templateUrl: 'views/components/organizations/modals/attributeEditorDialog.html',
                    controller: 'OrganizationAttributeEditorDialogCtrl as vm',
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

            /**
             * On user closed the attribute editor dialog
             * @param attrspec
             * @returns {Function}
             */
            function onNewAttributeModalClosed(attrspec) {
                return function (attribute) {
                    saveAttribute(attrspec, attribute);
                }
            }

            /**
             * Removes an attribute from an attributespecification
             * @param attrspec Attrspec that owns the attribute
             * @param attribute Attribute to be deleted
             */
            function removeAttribute(attrspec, attribute) {
                OrganizationsProxy.deleteAttributeValueOrganization(attribute)
                    .then(onAttributeValueRemoved(attrspec, attribute))
                    .catch(onAttributeValueRemoveError);
            }


            /* CALLBACKS */

            /**
             * Invoked when attributespecification retrieved
             * @param data attrspec list
             */
            function onGetAttributeSpecificationSuccess(data) {
                $scope.organization.attributeSpecifications = data.data.items;
            }

            /**
             * Invoked when there was an error removing attribute
             * @param error Server response
             */
            function onAttributeValueRemoveError(error) {
                dialogService.showMessage($translate.instant(namespace + "msg.problemOccured"), error.data.message.toString());
            }

            /**
             * Invoked when attribute value removed
             * @param attrspec owner attrspec
             * @param attrvalue attribute value that was removed
             * @returns {Function} Partial application for server callback
             */
            function onAttributeValueRemoved(attrspec, attrvalue) {
                return function (data) {
                    dialogService.success($translate.instant(namespace + "msg.attributeValueChangesSaved"));
                    var index = $linq(attrspec).indexOf("x => x.id == " + attrvalue.id);
                    attrspec.values.splice(index, 1);
                    load(attrspec);
                }

            }

            /**
             * Invoked when supporting services for an attrspec has been retrieved
             * @param attrspec Attribute specification
             * @returns {Function}
             */
            function onGetSupportingServicesSuccess(attrspec) {
                return function (supportingServices) {
                    attrspec.supportingServices = supportingServices.data.items;
                }
            }

            /**
             * Invoked when getting supporting services was unsuccessful
             * @param error Server response
             */
            function onGetSupportingServicesError(error) {
                dialogService.error($translate.instant(namespace + "msg.supportingServicesGetError") + error.data.message);
            }

            /**
             * Invoked when attribute value organizations are ready for an attributespecification
             * @param attrspec attribute specification
             * @returns {Function}
             */
            function onGetAttributeValueOrganizationsSuccess(attrspec) {
                return function (attrvalues) {
                    attrspec.values = attrvalues.data.items;
                }
            }

            /**
             * Ubvijed when we couldnt retrieve the list of attribute value organizations for an attrspec
             * @param attrspec
             * @returns {Function}
             */
            function onGetAttributeValueOrganizationsError(attrspec) {
                return function (error) {
                    dialogService.error($translate.instant(namespace + "msg.attributeValueGetError", {attrspec: attrspec.name}) + error.data.message);
                }
            }

            /**
             * Invoked when attribute value organization has been saved into an attrspec
             * @param attrspec Target attrspec
             * @param attribute Attribute Value Organization
             * @returns {Function}
             */
            function onAttributeValueOrganizationSaved(attrspec, attribute) {
                return function (data) {
                    dialogService.success($translate.instant(namespace + "msg.attributeValueCreateSuccess"));
                    //refresh organization list
                    attrspec.values.push(attribute);
                }
            }

            /**
             * Invoked when failed to save the attribute value organization
             * @param error Server response
             */
            function onAttributeValueOrganizationSaveError(error) {
                dialogService.notifyUIError(error.data.errors);
                dialogService.error($translate.instant(namespace + "msg.attributeValueCreateError") + error.data.message);
            }

            /**
             * Invoked when attribute value organization updated
             * @param attributeSpecification owner attribute value specification
             * @param attribute attribute value that has been updated
             * @returns {Function}
             */
            function onAttributeValueOrganizationUpdated(attributeSpecification, attribute) {
                return function (data) {
                    var index = $linq(attributeSpecification.values).indexOf("x => x.id == " + attribute.id);
                    attributeSpecification.values[index] = attribute;
                    dialogService.success($translate.instant(namespace + "msg.attributeValueUpdateSuccess"));
                }
            }

            /**
             * Invoked when server couldnt update the attribute value organization
             * @param error Server response
             */
            function onAttributeValueOrganizationUpdateError(error) {
                if (error.data !== undefined) {
                    dialogService.notifyUIError(error.data.errors);
                }
                dialogService.error($translate.instant(namespace + "msg.attributeValueUpdateError"));
            }

            /**
             * Invoked when the retrieval of attributespecifications failed
             * @param error Server response
             */
            function onGetAttributeSpecificationError(error) {
                dialogService.error($translate.instant(namespace + "msg.attributeSpecificationGetError") + error.data.message);
            }

            activate();

        }]);
}());
