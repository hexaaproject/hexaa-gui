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
        .controller('ServiceAttributeSpecificationsCtrl',
        ['$scope', 'AttributeSpecificationsProxy', '$translate', 'events', 'ServicesProxy', 'dialogService', 'pageTitleService',
        function ($scope, AttributeSpecificationsProxy, $translate, events, ServicesProxy, dialogService, pageTitleService) {

            var namespace = "services.attributespecifications.";

            /* FIELDS */

            $scope.service = {
                id: -1,
                public_attrspecs: [],
                private_attrspecs: []
            };

            $scope.public_attrspecs = []; //System attributeSpecifications
            $scope.private_attrspecs = []; //System attributeSpecifications


            function onPublicAttributeSpecChanged() {
                $scope.private_attrspecs.restoreMemento();
                angular.forEach($scope.service.public_attrspecs, function (item) {
                    var index = $linq($scope.private_attrspecs).indexOf("x=>x.id==" + item.id);
                    $scope.private_attrspecs.removeAt(index);
                });
            }

            function onPrivateAttributeSpecChanged() {
                $scope.public_attrspecs.restoreMemento();

                angular.forEach($scope.service.private_attrspecs, function (item) {
                    var index = $linq($scope.public_attrspecs).indexOf("x=>x.id==" + item.id);
                    $scope.public_attrspecs.removeAt(index);
                });

                $scope.$emit("refreshListBox_publicAttrSpecBox");
                $scope.$emit("refreshListBox_privateAttrSpecBox");
            }


            /* IMPLEMENTATION*/
            function activate() {
                $scope.$emit(events.serviceCanBeSaved, true);
                $scope.$on(events.servicesSelectionChanged, onServiceSelectionChanged);
                $scope.$on(events.serviceSave, onServiceSave);

                $scope.$watch("service.public_attrspecs", onPublicAttributeSpecChanged);
                $scope.$watch("service.private_attrspecs", onPrivateAttributeSpecChanged);
                AttributeSpecificationsProxy.getAttributeSpecifications().then(onGetAttributeSpecificationsSuccess);

                pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
            }

            activate();

            /**
             * Save current service data
             */
            function onServiceSave(event, selectedService) {
                if (($scope.service.id != -1) &&
                    (selectedService )) {
                    angular.forEach($scope.service.public_attrspecs, function (a) {
                        a.is_public = true;
                    });
                    $scope.service.attrspecs = $linq($scope.service.public_attrspecs).union($scope.service.private_attrspecs).toArray();
                    ServicesProxy.updateAttributeSpecifications($scope.service)
                        .then(onServiceSaveSuccess)
                        .catch(onServiceSaveError);
                }
            }

            /* CALLBACKS */
            function onGetAttributeSpecificationsSuccess(data) {
                $scope.private_attrspecs = angular.copy(data.data.items);
                $scope.private_attrspecs.saveMemento();
                $scope.public_attrspecs = angular.copy(data.data.items);
                $scope.public_attrspecs.saveMemento();
            }

            function onGetServiceAttributeSpeficiationsSuccess(data) {
                if (data.data ) {
                    //Public attrspecs
                    $scope.service.public_attrspecs = $linq(data.data.items).where("x=>x.is_public==true").select("x => x.attribute_spec").toArray();
                    $scope.service.public_attrspecs.saveMemento();
                    //private attrspecs
                    $scope.service.private_attrspecs = $linq(data.data.items).where("x=>x.is_public==false").select("x => x.attribute_spec").toArray();
                    $scope.service.private_attrspecs.saveMemento();
                }
            }

            /**
             * if service selection changed by the user load the corresponding data to the UI
             * @param id - Id of the selected service
             */
            function onServiceSelectionChanged(event, selectedService) {
                $scope.service = {id: selectedService};
                if (selectedService ) {
                    //load defined attrspecs
                    ServicesProxy.getAttributeSpecifications(selectedService).then(onGetServiceAttributeSpeficiationsSuccess);
                }
            }

            function onServiceSaveSuccess(data) {
                dialogService.success($translate.instant(namespace + "msg.allChangesSaved"));
            }

            function onServiceSaveError(error) {
                dialogService.error($translate.instant(namespace + "msg.AttributeSpecificationsUpdateError"));
            }


        }]);
}());
