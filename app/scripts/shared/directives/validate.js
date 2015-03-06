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
'use strict';
angular.module('hexaaApp.shared.directives').directive('validate', ['$compile', '$interval',
    function ($compile, $interval) {

        var directive = {
            restrict: 'A',
            scope: true,
            link: link
        };

        function link(scope, elm, attr) {

            scope.showError = showError;
            /* EVENT HANDLERS */
            elm.focusout(onFocusOut(elm));
            elm.focus(onFocus(elm));

            $interval(onIntervalElapsed(scope, elm), 1000, 1);
        }

        function onIntervalElapsed(scope, elm) {
            showError(elm);
        }

        function showError(element) {
            if (!element[0].hasAttribute("tooltipVisible")) {
                var msg = element[0].validationMessage;

                if (msg !== undefined) {
                    element.data('bs.tooltip', false).tooltip({
                        placement: "left",
                        trigger: "manual",
                        title: msg
                    }).tooltip("show");
                    element.attr("tooltipVisible", true);
                }
            }
        }

        /*Hide Error*/
        function onFocus(elm) {
            elm.tooltip("hide");
            elm.removeAttr("tooltipVisible");
        }

        /*Show Error*/
        function onFocusOut(elm) {
            showError(elm);
        }

        return directive;
    }
]);