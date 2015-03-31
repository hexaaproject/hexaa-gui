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
    angular.module('hexaaApp.components.organizations.directives')
        .directive('hexaaOrganizationsPropertiesWidget', function () {

            var scope = {
                organization: '=',
                formValid: '='
            }

            var directive = {
                restrict: 'A',
                link: link,
                scope: scope,
                templateUrl: 'views/components/organizations/directives/hexaa-organizations-properties-widget.html'
            };

            function link(scope, elem, attr) {
                scope.$watch("newOrganizationForm.$valid", onFormValidationChanged);

                function onFormValidationChanged(newValue, oldValue) {
                    if (newValue !== undefined)
                    {
                        scope.formValid = newValue;
                    }
                }
            }

            return directive;
        });
}());