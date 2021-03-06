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
angular.module('hexaaApp.services')
    .factory('dialogService',
    ['$rootScope', '$q', '$modal', 'toastr', 'events',
        function ($rootScope, $q, $modal, toastr, events) {


            var confirm = function (title, body) {
                var deferred = $q.defer();

                var modalInstance = $modal.open({
                    templateUrl: 'views/shared/modals/confirmation-dialog.html',
                    controller: "ConfirmationDialogCtrl",
                    backdrop: false,
                    resolve: {
                        title: function () {
                            return title;
                        },
                        body: function () {
                            return body;
                        }
                    }
                });

                modalInstance.result.then(function (answer) {
                    deferred.resolve(answer);
                });


                return deferred.promise;
            };

            function showMessage(title, body) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/shared/modals/message-dialog.html',
                    controller: "ModalMessageCtrl",
                    backdrop: false,
                    resolve: {
                        title: function () {
                            return title;
                        },
                        body: function () {
                            return body;
                        }
                    }
                });
            }


            /**
             * invokes when error happened, displays tooltip to the corresponding element.
             * @param data - Collection of errors
             */
            function notifyUIError(data) {
                if (data ) {
                    $rootScope.$broadcast(events.notifyUIError, data);
                }
            }

            function success(message) {
                toastr.success(message);
            }

            function warning(message) {
                toastr.warning(message);
            }

            function info(message) {
                toastr.info(message);
            }

            function error(message) {
                toastr.error(message);
            }

            function showMailer(target, recipient)
            {
                var modalInstance = $modal.open({
                    templateUrl: 'views/shared/modals/mail-dialog.html',
                    controller: "MailDialogCtrl as vm",
                    resolve: {
                        recipient: function() {
                            return recipient;
                        },
                        target: function() {
                            return target;
                        }
                    }
                });

                return modalInstance;
            }

            /**
             * Opens a dialog with service details
             * @param id the id of the service
             */
            function showServiceDetails(id) {
                var modalInstance = $modal.open({
                    templateUrl: 'views/shared/modals/service-details-dialog.html',
                    controller: "ServiceDetailsCtrl",
                    size: 'lg',
                    resolve: {
                        serviceId: function () {
                            return id;
                        }
                    }
                });
            }


            return {
                confirm: confirm,
                success: success,
                warning: warning,
                info: info,
                error: error,
                notifyUIError: notifyUIError,
                showMessage: showMessage,
                showMailer: showMailer,
                showServiceDetails: showServiceDetails
            };
        }]);