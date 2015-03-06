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
        .controller('AdminCtrl', ['$scope', '$route', 'pageTitleService', '$translate',
            function ($scope, $route, pageTitleService, $translate) {

                //Namespace for language files
                var namespace = "admin.index.";

                //Child page to be loaded
                $scope.page = $route.current.params["page"];


                /**
                 * Invoked when controller activates
                 */
                function activate() {
                    //Set up default page if no page specified
                    if ($scope.page == undefined) {
                        $scope.page = "attributespecifications";
                    }

                    //If not admin, redirect to default page
                    if (!$scope.profile.isAdmin) {
                        $scope.navigate("index.html")
                    }
                    //set up page title
                    pageTitleService.setPageTitle($translate.instant(namespace + "lbl.title"));
                }


                activate();

            }]);

}());

