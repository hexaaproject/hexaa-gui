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
        .controller('OrganizationNewsCtrl',
        ['$scope', 'events', 'OrganizationsProxy', 'tags', 'dialogService', 'pageTitleService', '$translate',
            function ($scope, events, OrganizationsProxy, tags, dialogService, pageTitleService, $translate) {
                //Namespace of translation files
                var namespace = "organizations.news.";

                /* FIELDS */
                $scope.organization = {id: -1, news: []};

                /* Pager settings */
                $scope.pager = {
                    itemPerPage: 25, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: Number.MAX_VALUE, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                $scope.tagSources = []; //Data model for multiSelect tag box


                /* INTERFACE */
                $scope.refreshFeed = refreshFeed;

                /* IMPLEMENTATION */

                /**
                 * Build the multiselectbox
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

                /**
                 * Invoked when controller created
                 */
                function activate() {
                    //construct tagbox
                    buildTagBox();
                    //If current page has been changed by the paging bar, refresh entries according to that
                    $scope.$watch("pager.currentPage", onCurrentPageChanged);
                    //if the selected tagSources has been changed, refresh feed
                    $scope.$watch("tagSources", onTagSourcesChanged, true);
                    //if the number of the items per page has been changed, refresh feed
                    $scope.$watch("pager.itemPerPage", onItemPerPageChanged);
                    $scope.$on(events.organizationsSelectionChanged, onOrganizationsSelectionChanged);
                    //This controller can not handle save action
                    $scope.$emit(events.organizationCanBeSaved, false);

                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));

                }

                activate();

                /**
                 * Load feed entries for organization
                 * @param organization
                 */
                function refreshFeed(organization) {
                    if (organization.id !== undefined) {
                        //Get selected tags
                        var tags = $linq($scope.tagSources).where("x=>x.ticked==true").select("x => x.name").toArray();

                        OrganizationsProxy.getNews(organization.id, ($scope.pager.currentPage - 1) * $scope.pager.itemPerPage, $scope.pager.itemPerPage, tags).
                            then(onGetNewsSuccess)
                            .catch(onGetNewsError);
                    }
                }


                /* CALLBACKS */

                /**
                 * Invoked when retrieval of news failed
                 * @param error
                 */
                function onGetNewsError(error) {
                    dialogService.error(error.data.message);
                }

                /**
                 * Invoked when news are ready
                 * @param news
                 */
                function onGetNewsSuccess(news) {
                    $scope.organization.news = angular.copy(news.data.items);
                    $scope.pager.totalItems = angular.copy(news.data.item_number);
                }

                /**
                 * Invoked when organization selection changed
                 * @param event
                 * @param selectedOrganization
                 */
                function onOrganizationsSelectionChanged(event, selectedOrganization) {
                    $scope.pager.currentPage = 1;
                    $scope.organization.id = selectedOrganization;
                    $scope.organization.news.length = 0;

                    if (selectedOrganization != -1) {
                        refreshFeed($scope.organization);
                    }
                }

                /**
                 * Invoked when itemPerPage changed
                 * @param newValue
                 * @param oldValue
                 */
                function onItemPerPageChanged(newValue, oldValue) {
                    if ($scope.organization.id != -1)
                        refreshFeed($scope.organization);
                }

                /**
                 * Invoked when tagsources changed
                 * @param newValue
                 * @param oldValue
                 */
                function onTagSourcesChanged(newValue, oldValue) {
                    if ($scope.organization.id != -1 && oldValue != newValue) {
                        $scope.pager.currentPage = 1;
                        refreshFeed($scope.organization);
                    }
                }

                /**
                 * Invoked when current page changed
                 * @param newValue
                 * @param oldValue
                 */
                function onCurrentPageChanged(newValue, oldValue) {
                    if ($scope.organization.id != -1)
                        refreshFeed($scope.organization);
                }
            }]);

}());