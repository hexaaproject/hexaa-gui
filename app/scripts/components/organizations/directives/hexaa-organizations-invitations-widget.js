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
    angular.module('hexaaApp.components.organizations.directives').directive('hexaaOrganizationsInvitationsWidget', ['profileService', 'baseUIAddr', function (profileService, baseUIAddr) {

        var scope = {
            organization: '=',
            deleteInvitation: '&deleteInvitation',
            editInvitation: '&editInvitation',
            resendInvitation: '&resendInvitation'
        }

        var directive = {
            restrict: 'A',
            link: link,
            scope: scope,
            templateUrl: 'views/components/organizations/directives/hexaa-organizations-invitations-widget.html'
        };

        function link(scope, elem, attr) {

            function activate() {
                scope.profile = profileService.getProfile();
            }

            activate();

            scope.baseUIAddr = baseUIAddr;
            scope.delete = remove;
            scope.edit = edit;
            scope.resend = resend;
            scope.keyCount = keyCount;

            function keyCount(obj) {
                if (obj ) {
                    return Object.keys(obj).length;
                }
                else return 0;
            }

            function remove(invitation) {
                if (scope.deleteInvitation !== undefined) {
                    scope.deleteInvitation({invitation: invitation});
                }
            }

            function edit(invitation) {
                if (scope.editInvitation !== undefined) {
                    scope.editInvitation({invitation: invitation});
                }
            }

            function resend(invitation) {
                if (scope.resendInvitation !== undefined) {
                    scope.resendInvitation({invitation: invitation});
                }
            }
        }

        return directive;
    }]);
}());