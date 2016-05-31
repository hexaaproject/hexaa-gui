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

angular.module('hexaaApp.services.facades').factory('InvitationsFacade', ['$http', '$rootScope', '$q', 'HexaaService', 'ResourceEntity', 'InvitationFactory',
    function ($http, $rootScope, $q, HexaaService, ResourceEntity, InvitationFactory) {

        var Proxy = {

            invite: function (invitation) {
                return HexaaService.invite(invitation);
            },
            resend: function (id) {
                return HexaaService.resendInvitation(id);
            },
            delete: function (id) {
                return HexaaService.deleteInvitation(id);
            },
            update: function (invitation) {
                return HexaaService.updateInvitation(invitation.id, String(invitation.emails).split(','), invitation.landing_url, invitation.as_manager, invitation.message,
                    invitation.start_date, invitation.end_date, invitation.limit, invitation.role_id, invitation.organization_id, invitation.service_id, invitation.locale)
            },
            new: function (data) {
                return InvitationFactory.new(data);
            }
        };

        return Proxy;
    }]);
