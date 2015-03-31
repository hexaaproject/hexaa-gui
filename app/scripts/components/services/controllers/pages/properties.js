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
        .controller('ServicePropertiesCtrl',
        ['$scope', 'ServicesProxy', '$translate', 'events', '$upload', 'baseAddr', '$q', 'dialogService', 'pageTitleService',
            function ($scope, ServicesProxy, $translate, events, $upload, baseAddr, $q, dialogService, pageTitleService) {

                var namespace = "services.properties.";

                /* FIELDS */

                $scope.entityids = []; //System Entity ids
                $scope.service = {
                    id: -1
                };
                $scope.progress = 0; //upload progress

                /* INTERFACE */
                $scope.onFileSelect = onFileSelect;

                /* IMPLEMENTATION*/
                function activate() {
                    $scope.$emit(events.serviceCanBeSaved, true);
                    $scope.$on(events.servicesSelectionChanged, onServiceSelectionChanged);
                    $scope.$on(events.serviceSave, onSaveService);
                    ServicesProxy.getEntityIds().then(onGetEntityIdsSuccess);

                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                activate();

                /**
                 * Uploads a file as logo of the service
                 * @param $files the selected file
                 * @returns {*}
                 */
                function refreshImage($files) {

                    return $upload.upload({
                        url: baseAddr + '/api/services/' + $scope.properties.id + '/logos.json?admin='+$scope.profile.isAdmin,
                        method: 'POST',
                        withCredentials: true,
                        file: $files[0],
                        fileFormDataName: "logo"
                    }).progress(onUploadProgressChanged);
                }

                /* GUI */

                /**
                 * Service selection changed
                 * @param id  - service id
                 */
                function onServiceSelectionChanged(event, selectedService) {
                    if (selectedService != -1) {
                        ServicesProxy.getService(selectedService)
                            .then(onGetServiceSuccess)
                            .catch(onGetServiceError);
                    }
                }


                /**
                 * Save current service
                 */
                function onSaveService(event, selectedService) {
                    if ($scope.servicePropertiesForm.$valid) {
                        if ((selectedService  ) && ($scope.properties.id != -1)) {
                            var tasks = [];

                            if ($scope.service.logo ) {
                                tasks.push(
                                    refreshImage($scope.service.logo).catch(onFileUploadError)
                                );
                            }

                            tasks.push($scope.properties.save().
                                    catch(onServiceSaveError)
                            );

                            $q.all(tasks).then(onCompleted);
                        }
                    }

                }

                /*CALLBACKS*/
                function onGetEntityIdsSuccess(data) {
                    $scope.entityids = angular.copy(data.data.items);
                }

                function onFileSelect($files) {
                    $scope.service.logo = $files;
                }

                function onUploadProgressChanged(evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }

                function onGetServiceSuccess(data) {
                    $scope.properties = angular.copy(data.data);
                }

                function onGetServiceError(data) {
                    //Failed to retrieve Service data
                }

                function onFileUploadError(error) {
                    // file is uploade error
                    $scope.progress = 0;
                    dialogService.error($translate.instant(namespace + "msg.serviceLogoUpdateError"));
                    return $q.reject(error);
                }

                function onServiceSaveError(error) {
                    dialogService.notifyUIError(error.data.errors);
                    dialogService.error($translate.instant(namespace + "msg.serviceUpdateError"));
                    return $q.reject(error);
                }

                function onCompleted() {
                    $scope.progress = 0;
                    dialogService.success($translate.instant(namespace + "msg.serviceUpdateSuccess"));

                }
            }]);
}());
