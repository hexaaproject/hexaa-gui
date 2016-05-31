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
        .controller('ProfileConsentsCtrl',
        ['$scope', '$translate', 'PrincipalFacade', 'ServicesFacade', 'ConsentsFacade', '$q', 'dialogService', 'pageTitleService',
            function ($scope, $translate, PrincipalFacade, ServicesFacade, ConsentsFacade, $q, dialogService, pageTitleService) {

                //Translation namespace
                var namespace = "profile.consents.";

                /*FIELDS*/

                /* Pager settings */
                $scope.pager = {
                    itemPerPage: 5, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: 0, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                /* INTERFACE */
                $scope.load = load;
                $scope.save = save;
                $scope.showServiceDetails = dialogService.showServiceDetails;

                /* IMPLEMENTATION*/

                /**
                 * Invoked when controller created
                 */
                function activate() {
                    PrincipalFacade.getRelatedServices()
                        .then(onGetRelatedServicesSuccess);
                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                activate();

                /**
                 * Lazy loads a service
                 * @param service
                 */
                function load(service) {
                    $q.all([ServicesFacade.getAttributeSpecifications(service.id), PrincipalFacade.getServiceConsent(service.id)])
                        .then(onQueryCompleted(service));
                }

                /**
                 * Save consents for a service
                 * @param service
                 */
                function save(service) {
                    var consent = {
                        id: service.consentId,
                        service: service.id,
                        enabled_attribute_specs: $linq(service.consent).where("x=>x.consented").toArray()
                            .map(function (att) {
                                return att.id;
                            }),
                        enable_entitlements: service.entitlements || false
                    };

                    if (consent.id === undefined)
                        ConsentsFacade.addConsent(consent)
                            .success(onAddConsentSuccess)
                            .error(onAddConsentError);
                    else
                        ConsentsFacade.updateConsent(consent)
                            .then(onUpdateConsentSuccess)
                            .catch(onUpdateConsentError);
                }

                /**
                 * Invoked when related services retrieved
                 * @param services
                 */
                function onGetRelatedServicesSuccess(services) {
                    $scope.profile.relatedServices = angular.copy(services.data.items);
                    $scope.pager.totalItems = services.data.item_number;
                }

                function onAddConsentSuccess(data) {
                    dialogService.success($translate.instant(namespace + "msg.consentAddSuccess"));
                }

                function onAddConsentError(error) {
                    dialogService.error($translate.instant(namespace + "msg.consentAddError") + error.data.message);
                }

                function onUpdateConsentSuccess(data) {
                    dialogService.success($translate.instant(namespace + "msg.consentUpdateSuccess"));
                }

                function onUpdateConsentError(error) {
                    dialogService.error($translate.instant(namespace + "msg.consentUpdateError") + error.data.message);
                }

                /**
                 * Invoked when lazy-loaded data retrieved
                 * @param service owner service of lazy loaded data
                 * @returns {Function}
                 */
                function onQueryCompleted(service) {
                    return function (data) {
                        var attrspecs = data[0].data.items;
                        var consent = data[1].data;

                        service.consent = $linq(attrspecs).where("x=>x.attribute_spec.maintainer == 'user'").toArray()
                            .map(function (attrspec) {
                                attrspec.attribute_spec.consented = $linq(consent.enabled_attribute_spec_ids).indexOf("x => x == " + attrspec.attribute_spec.id) != -1;
                                return attrspec.attribute_spec;
                            });

                        service.entitlements = consent.enable_entitlements;
                        service.consentId = consent.id;
                    }
                }

            }]);

}());