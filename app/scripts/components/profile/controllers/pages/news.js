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
        .controller('ProfileNewsCtrl',
        ['$scope', 'HexaaService', '$translate', 'events', 'PrincipalProxy', 'ServicesProxy', 'OrganizationsProxy', 'tags', 'dialogService', 'pageTitleService',
            function ($scope,  HexaaService, $translate, events, PrincipalProxy, ServicesProxy, OrganizationsProxy, tags, dialogService, pageTitleService) {

                var namespace = "profile.news.";

                /*FIELDS*/
                $scope.dataSources = [];
                $scope.me = {
                    news: []
                };
                $scope.tagSources = [];

                /* Pager settings */
                $scope.pager = {
                    itemPerPage: 5, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: Number.MAX_VALUE, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                /* INTERFACE */
                $scope.refreshFeed = refreshFeed;

                /*IMPLEMENTATION*/

                function activate() {
                    buildTagBox();
                    $scope.$emit(events.organizationCanBeSaved, false);
                    ServicesProxy.getServices().then(onGetServicesSuccess);
                    OrganizationsProxy.getOrganizations().then(onGetOrganizationsSuccess);
                    $scope.$watch('dataSources', onDataSourceChanged, true);
                    $scope.$watch('tagSources', onDataSourceChanged, true);
                    $scope.$watch("pager.currentPage", onCurrentPageChanged);
                    $scope.$watch("pager.itemPerPage", onCurrentPageChanged);
                    refreshFeed();

                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                activate();

                /**
                 * Build tagbox
                 */
                function buildTagBox() {
                    $scope.tagSources.push({
                        name: '<strong>Tags</strong>',
                        multiSelectGroup: true
                    });

                    angular.forEach(tags, function (tag) {
                        this.push(tag);
                    }, $scope.tagSources);

                    $scope.tagSources.push({
                        multiSelectGroup: false
                    });
                }

                function onGetServicesSuccess(services) {
                    $scope.dataSources.push({
                        name: '<strong>Services</strong>',
                        multiSelectGroup: true
                    });

                    angular.forEach(services.data.items, function (service) {
                        this.push(
                            {
                                id: service.id,
                                type: 'service',
                                name: service.name,
                                ticked: true
                            }
                        );
                    }, $scope.dataSources);

                    $scope.dataSources.push({
                        multiSelectGroup: false
                    })
                }

                function onGetOrganizationsSuccess(organizations) {
                    $scope.dataSources.push({
                        name: '<strong>Organizations</strong>',
                        multiSelectGroup: true
                    });

                    angular.forEach(organizations.data.items, function (organization) {
                        this.push(
                            {
                                id: organization.id,
                                type: 'organization',
                                name: organization.name,
                                ticked: true
                            }
                        );
                    }, $scope.dataSources);

                    $scope.dataSources.push({
                        multiSelectGroup: false
                    })
                }

                function onCurrentPageChanged() {
                    var organizations = $linq($scope.dataSources).where("x=>x.type=='organization' && x.ticked==true").select("x=>x.id").toArray();
                    var services = $linq($scope.dataSources).where("x=>x.type=='service' && x.ticked==true").select("x=>x.id").toArray();
                    refreshFeed(services, organizations);
                }

                function onDataSourceChanged() {
                    var organizations = $linq($scope.dataSources).where("x=>x.type=='organization' && x.ticked==true").select("x=>x.id").toArray();
                    var services = $linq($scope.dataSources).where("x=>x.type=='service' && x.ticked==true").select("x=>x.id").toArray();

                    $scope.pager.currentPage = 1;
                    refreshFeed(services, organizations);

                }

                function onGetNewsSuccess(news) {
                    $scope.me.news = news.data.items;
                    $scope.pager.totalItems = news.data.item_number;
                }


                function onGetNewsError(data) {
                    dialogService.error(data.message);
                }

                function refreshFeed(servicesFilter, organizationsFilter) {

                    var tags = $linq($scope.tagSources).where("x=>x.ticked==true").toArray();
                    PrincipalProxy.getNews(($scope.pager.currentPage - 1) * $scope.pager.itemPerPage, $scope.pager.itemPerPage, tags, servicesFilter, organizationsFilter).
                        then(onGetNewsSuccess)
                        .catch(onGetNewsError);

                }


            }]);

}());