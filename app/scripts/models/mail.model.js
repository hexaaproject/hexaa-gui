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

/**
 * Enum for decide who is the recipient of an email
 * @type {{User: string, Manager: string, Admin: string}}
 */
var MailTargetEnum = {
    User: "user",
    Manager: "manager",
    Admin: "admin"
};
angular.module('hexaaApp.constants').constant("MailTargetEnum", MailTargetEnum);

function MailFactory($injector,HexaaService) {

    var ResourceEntity = $injector.get("ResourceEntity");

    var defaultProperties = {
        organization: null,
        role: null,
        service:null,
        target: null,
        subject: null,
        message: null
    };

    function Mail(data) {
        var prop = angular.copy(defaultProperties);
        angular.extend(this, data || prop);
    }

    /*PARENT*/
    Mail.prototype = ResourceEntity.new();
    Mail.prototype.constructor = Mail;

    /*INTERFACE*/
    Mail.prototype.send = send;


    MailFactory.class = Mail;

    /*STATIC */
    Mail.new = create;

    function create(data) {
        return new Mail(data);
    }

    function send() {
        return HexaaService.sendMail(this.subject, this.message, this.target, this.organization, this.role, this.service);
    }

    return Mail;
}

angular.module('hexaaApp.models').factory('MailFactory', ['$injector','HexaaService', MailFactory]);
