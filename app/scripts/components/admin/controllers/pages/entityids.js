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
        .controller('AdminEntityIdsCtrl',
        [ '$translate', 'ServicesProxy', 'dialogService', 'pageTitleService',
            function ( $translate, ServicesProxy, dialogService, pageTitleService) {

                //Namespace for language file
                var namespace = "admin.entityids.";

                var vm = this;
                vm.entityids = [];

                /* Pager settings */
                vm.pager = {
                    itemPerPage: 5, //How many items will appear on a single page?
                    maxSize: 5,  //Size of pagers visile counters [1,2,3,4,5....last]
                    totalItems: 0, //Num of total items
                    currentPage: 1,  //Currently selected page
                    numPages: 0
                };

                /* INTERFACE */

                /* IMPLEMENTATION */
                function activate() {
                    //Get entity ids from server
                    ServicesProxy.getEntityIds()
                        .then(onGetEntityIdsSuccess)
                        .catch(onGetEntityIdsError);

                    pageTitleService.setSubPageTitle($translate.instant(namespace + "lbl.title"));
                }

                activate();

                /* CALLBACK */

                /**
                 * Invoked when entityIds are ready
                 * @param data entityids
                 */
                function onGetEntityIdsSuccess(data) {
                    //convert associative array to simple arry of complex items
                    for (var key in data.data.items) {
                        vm.entityids.push({
                            key: key,
                            value: data.data.items[key]
                        });
                    }
                    vm.pager.totalItems = data.data.items.length; //set up pager
                }

                /**
                 * Invoked when request for entityids failed
                 * @param error Server response
                 */
                function onGetEntityIdsError(error) {
                    dialogService.error($translate.instant(namespace + "msg.entityIdsGetError"));
                }

            }]);

}());