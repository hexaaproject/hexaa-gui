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
        .directive('consentEditor', function () {

            var scope = {
                services: '=',
                attributevalues: '=',
                consents: '=',
                addedConsents: '=',
                removedConsents: '=',
                on_change: '&onChange'
            };

            var directive = {
                restrict: 'A',
                scope: scope,
                link: link,
                template: '<div style="overflow: auto">' +
                '<table class="table table-striped table-bordered table-hover">' +
                '<tr>' +
                '<th></th>' +
                '<th ng-repeat="attribute in attributevalues  | orderBy:\'value\'">{{attribute.value}}</th>' +
                '</tr>' +
                '<tr ng-repeat="service in services  | orderBy:\'name\'">' +
                '<td>{{service.name}}</td>' +
                '<td ng-repeat="attribute in attributevalues" align="center">' +
                '<input type="checkbox" ng-checked="isGiven( service.id, attribute.id )" ng-click="changed(service.id, attribute.id)" />' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>'
            };

            function link(scope, elm, attr) {
                /* INTERFACE */
                scope.isGiven = isGiven;
                scope.notify = notify;
                scope.changed = changed;

                /* IMPLEMENTATION */

                /* Is There a consent between service and attrspecvalue */
                function isGiven(sid, aid) {
                    for (var i = 0; i < scope.consents.length; i++) {
                        if ((scope.consents[i].service_id === sid) && (scope.consents[i].attributeValuePrincipalId == aid)) {
                            return true;
                        }
                    }
                    return false;
                }

                /*Notify state changed*/
                function notify(consent) {
                    if (scope.on_change != undefined) {
                        scope.on_change({'consent': consent});
                    }
                }

                /* Checkbox state changed indicates given or removed consent */
                function changed(sid, aid) {
                    var hash = parseInt(sid) * 10 + parseInt(aid);
                    var consent = {
                        service: sid,
                        attrib: aid,
                        hash: hash
                    };

                    if ((!scope.isGiven(sid, aid)) && ( scope.addedConsents.indexOfField(consent, "hash") < 0)) {
                        console.log("eredetileg nem consent, es meg nem adta hozza");
                        //eredetileg nem consent, es meg nem adta hozza
                        consent.action = "added";
                        scope.addedConsents.push(consent);

                        scope.notify(consent);

                    }
                    else if ((!scope.isGiven(sid, aid)) && ( scope.addedConsents.indexOfField(consent, "hash") >= 0 )) {
                        //eredetileg nem volt consent, de aztan kipipalta, es most kivenne a pipat
                        console.log("eredetileg nem volt consent, de aztan kipipalta, es most kivenne a pipat");
                        scope.addedConsents.splice(scope.addedConsents.indexOfField(consent, "hash"), 1);

                        consent.action = "removed";
                        scope.notify(consent);
                    }
                    else if ((scope.isGiven(sid, aid)) && ( scope.removedConsents.indexOfField(consent, "hash") < 0)) {
                        //eredetileg consent volt, es meg nem vette ki a pipat
                        console.log("eredetileg consent volt, es meg nem vette ki a pipat");
                        scope.removedConsents.push(consent);

                        consent.action = "removed";
                        scope.notify(consent);
                    }
                    else if ((!scope.isGiven(sid, aid)) && ( scope.addedConsents.indexOfField(consent, "hash") >= 0 )) {
                        //eredetileg nem volt consent, de aztan kipipalta, es most kivenne a pipat
                        console.log("eredetileg nem volt consent, de aztan kipipalta, es most kivenne a pipat");
                        scope.removedConsents.splice(scope.removedConsents.indexOfField(consent, "hash"), 1);

                        consent.action = "added";
                        scope.notify(consent);
                    }
                    else {
                        console.log('van baj');
                    }
                }

            }

            return directive;
        });
}());