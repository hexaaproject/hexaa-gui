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

function InvitationFactory($injector) {

    var ResourceEntity = $injector.get("ResourceEntity");

    var defaultProperties = {
        limit: null,
        start_date: null,
        end_date: null,
        locale: null,
        landing_url: null,
        emails: [],
        statuses: {},
        counter: null,
        message: null
    };

    function Invitation(data) {
        var prop = angular.copy(defaultProperties);
        angular.extend(this, data || prop);
    }

    /*PARENT*/
    Invitation.prototype = ResourceEntity.new();
    Invitation.prototype.constructor = Invitation;

    /*INTERFACE*/
    Invitation.prototype.resend = resend;
    Invitation.prototype.save = save;
    Invitation.prototype.delete = remove;

    InvitationFactory.class = Invitation;

    /*STATIC */
    Invitation.new = create;

    function create(data) {
        return new Invitation(data);
    }

    function remove() {
        var Proxy = $injector.get("InvitationsProxy");
        return Proxy.delete(this.id);
    }

    function save() {
        var Proxy = $injector.get("InvitationsProxy");
        if (this.id === -1 || this.id === undefined) {
            return Proxy.invite(this);
        }
        else {
            return Proxy.update(this);
        }
    }

    function resend() {
        var Proxy = $injector.get("InvitationsProxy");
        return Proxy.resend(this.id);
    }

    return Invitation;
}

angular.module('hexaaApp.models').factory('InvitationFactory', ['$injector', InvitationFactory]);
