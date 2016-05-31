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
    angular.module('hexaaApp.components.profile.directives')
        .directive('hexaaProfileAttributeEditorWidget', [
            function () {

                var scope = {
                    attributeSpecification: '=',
                    attribute: '=',
                    saveAttribute: '&saveAttribute'
                };

                var directive = {
                    restrict: 'A',
                    link: link,
                    scope: scope,
                    templateUrl: 'views/components/profile/directives/hexaa-profile-attribute-editor-widget.html'
                };

                function link(scope, elem, attr) {

                    scope.undo = undo;
                    scope.save = save;

                    function undo() {
                        scope.attribute.undo();
                    }

                    function save() {
                        if (scope.saveAttribute) {
                            scope.saveAttribute({attribute: scope.attribute});
                        }
                    }

                }

                return directive;
            }]);
}());