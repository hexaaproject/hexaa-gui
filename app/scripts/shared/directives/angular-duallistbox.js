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

    angular.module('hexaaApp.shared.directives')
        .directive('angularDuallistbox', ['$interval', function ($interval) {

            var scope = {
                elements: '=',
                selected: '=',
                elementDisplay: '=',
                elementValue: '=',
                nonSelectedListLabel: '&',
                selectedListLabel: '&',
                filterPlaceHolder: '&'
            };

            var directive = {
                restrict: 'A',
                scope: scope,
                link: link,
                templateUrl: 'views/shared/directives/angular-duallistbox.tpl.html'
            };

            function link(scope, elm, attr) {
                // INIT
                var listbox = null;
                scope.refresh = refresh;

                function create() {
                    var element = $(elm).find("select");

                    listbox = $(element).bootstrapDualListbox({
                        nonSelectedListLabel: scope.nonSelectedListLabel,
                        selectedListLabel: scope.selectedListLabel,
                        moveOnSelect: false,
                        filterPlaceHolder: scope.filterPlaceHolder
                    });
                }

                function activate() {
                    create();
                    scope.$watchCollection("elements", refresh,true);
                    scope.$watchCollection("selected", refresh,true);
                }

                activate();


                function refresh() {
                    listbox.bootstrapDualListbox('refresh', false);
                }
            }

            return directive;
        }]);
}());