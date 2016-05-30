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

angular.module("hexaaApp.shared.directives")
    .directive("hookList", hookList);

function hookList() {

    var directive = {
        restrict: "A",
        link: link,
        scope: {
            hooks: "=",
            onEditClicked: "&",
            onDeleteClicked: "&onDeleteClicked"
        },
        templateUrl: "views/shared/directives/hookList.html",
    };

    function link(scope, elem, attr) {

        function activate() {

        }

        scope.edit = edit;
        scope.remove = remove;

        function remove(hook) {
            if (scope.onDeleteClicked) {
                scope.onDeleteClicked({hook: hook});
            }
        }

        function edit(hook) {
            if (scope.onEditClicked) {
                scope.onEditClicked({hook: hook});
            }
        }

        activate();
    }

    return directive;
}
