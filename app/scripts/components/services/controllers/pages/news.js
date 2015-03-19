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
        .controller('ServiceNewsCtrl',
        ['$scope', '$rootScope', '$translate', 'events', 'ServicesProxy', 'tags', 'dialogService', 'pageTitleService',
            function ($scope, $rootScope, $translate, events, ServicesProxy, tags, dialogService, pageTitleService) {

                var namespace = "organizations.news.";

                /* FIELDS */
                $scope.service = {
                    id: -1,
                    news: []
                };

                /* Pager settings */
                $scope.pager = {
                    itemPerPage: 25, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: Number.MAX_VALUE, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                $scope.tagSources = [];

                /* INTERFACE */

                /* IMPLEMENTATION */

                function activate() {
                    $scope.$emit(events.serviceCanBeSaved, false);
                    $scope.$watch("tagSources", onTagSourcesChanged, true);
                    $scope.$watch("pager.currentPage", onCurrentPageChanged);
                    //if the number of the items per page has been changed, refresh feed
                    $scope.$watch("pager.itemPerPage", onItemPerPageChanged);
                    $scope.$on(events.servicesSelectionChanged, onServicesSelectionChanged);

                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));


                    buildTagBox();
                }

                activate();


                function buildTagBox() {
                    $scope.tagSources.push({
                        name: '<strong>Tags</strong>',
                        multiSelectGroup: true
                    });

                    angular.forEach(tags, function (tag) {
                        this.push(angular.copy(tag));
                    }, $scope.tagSources);

                    $scope.tagSources.push({
                        multiSelectGroup: false
                    });
                }

                function refreshFeed(service) {
                    var tags = $linq($scope.tagSources).where("x=>x.ticked==true").toArray();
                    ServicesProxy.getNews(service.id, ($scope.pager.currentPage - 1) * $scope.pager.itemPerPage, $scope.pager.itemPerPage, tags)
                        .then(onGetNewsSuccess)
                        .catch(onGetNewsError);
                }

                function onCurrentPageChanged(oldValue, newValue) {
                    if (oldValue !== undefined) {
                        if ($scope.service.id != -1) {
                            refreshFeed($scope.service);
                        }
                    }
                }

                function onServicesSelectionChanged(event, selectedService) {
                    $scope.pager.currentPage = 1;
                    $scope.service.id = selectedService;
                    $scope.service.news.length = 0;

                    if (selectedService != -1) {
                        refreshFeed($scope.service);
                    }
                }

                //CALLBACKS
                function onTagSourcesChanged(oldValue, newValue) {
                    if ($scope.service.id != -1) {
                        $scope.pager.currentPage = 1;
                        refreshFeed($scope.service);
                    }
                }

                function onItemPerPageChanged(oldValue, newValue) {
                    if (oldValue !== undefined) {
                        if ($scope.service.id != -1) {
                            refreshFeed($scope.service);
                        }
                    }
                }

                function onGetNewsSuccess(news) {
                    $scope.service.news = news.data.items;
                    $scope.pager.totalItems = news.data.item_number;
                }

                function onGetNewsError(error) {
                    if (error.data !== undefined &&
                        error.data.message !== undefined) {
                        dialogService.error(error.data.message);
                    }
                }

            }]);
}());
