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

//Declaring application with dependencies
angular.module('hexaaApp', [
    //Third party modules
    'ui.bootstrap',
    'ngCookies',
    'ngRoute',
    'angular.css.injector',
    'pascalprecht.translate',
    'ngSanitize',
    'multi-select',
    'angularFileUpload',
    'toastr',
    'uiSwitch',
    //First party modules
    'hexaaApp.constants',
    'hexaaApp.config',
    'hexaaApp.filters',
    'hexaaApp.services',
    'hexaaApp.services.facades',
    'hexaaApp.models',
    'hexaaApp.shared',
    'hexaaApp.shared.controllers',
    'hexaaApp.shared.controllers.pages',
    'hexaaApp.shared.controllers.modals',
    'hexaaApp.shared.directives',
    'hexaaApp.components',
    'hexaaApp.components.admin',
    'hexaaApp.components.admin.controllers',
    'hexaaApp.components.admin.controllers.pages',
    'hexaaApp.components.admin.controllers.modals',
    'hexaaApp.components.admin.directives',
    'hexaaApp.components.organizations',
    'hexaaApp.components.organizations.controllers',
    'hexaaApp.components.organizations.controllers.modals',
    'hexaaApp.components.organizations.controllers.pages',
    'hexaaApp.components.organizations.directives',
    'hexaaApp.components.profile',
    'hexaaApp.components.profile.controllers',
    'hexaaApp.components.profile.controllers.pages',
    'hexaaApp.components.profile.directives',
    'hexaaApp.components.profile.controllers.modals',
    'hexaaApp.components.services',
    'hexaaApp.components.services.controllers',
    'hexaaApp.components.services.controllers.modals',
    'hexaaApp.components.services.controllers.pages',
    'hexaaApp.components.services.directives',
]);

(function () {
    'use strict';

    angular.module('hexaaApp.constants', []);
//Constant for baseAddr
    angular.module('hexaaApp.constants').constant("baseAddr", baseAddr);
    angular.module('hexaaApp.constants').constant("apiAddr", apiAddr);
    angular.module('hexaaApp.constants').constant("logoutUrl", logoutUrl);
    angular.module('hexaaApp.constants').constant("hexaaCookieName", hexaaCookieName);
    angular.module('hexaaApp.constants').constant("settingsCookieName", "hexaaUISettings");
    angular.module('hexaaApp.constants').constant("baseUIAddr", hexaaUIAddr);
    angular.module('hexaaApp.constants').constant("tags", [
        {name: 'attribute_release', ticked: false},
        {name: 'invitation', ticked: true},
        {name: 'service', ticked: true},
        {name: 'service_manager', ticked: true},
        {name: 'service_attribute_spec', ticked: true},
        {name: 'organization', ticked: true},
        {name: 'organization_manager', ticked: true},
        {name: 'organization_member', ticked: true},
        {name: 'organization_entitlement_pack', ticked: true},
        {name: 'entityid', ticked: true}
    ]);


    /* Eventing constants */
    angular.module('hexaaApp.constants').constant("events", {
        "notifyUIError": "notify_UI_Error",
        "siteThemeChanged": "site_Theme_Changed",
        "organizationsSelectionChanged": "organizations_List_Changed",
        "servicesSelectionChanged": "services_List_Changed",
        "serviceChanged": "serviceChanged",
        "organizationSave": "organization_Save",
        "organizationChanged": "organizationChanged",
        "serviceSave": "service_Save",
        "organizationCanBeSaved": "organization_can_be_saved",
        "serviceCanBeSaved": "service_can_be_saved",
        "authenticated": "authenticated",
        "authError": "authError",
        "languageChanged": "langChanged",
        "tokenExpired": "tokenExpired",
        "refreshOrganizationInvitations": "refreshOrganizationInvitations",
        "refreshServiceInvitations": "refreshServiceInvitations",
        "subpageTitleChanged": "subpageTitleChanged",
        "forceAction": "forceAction",
        "actionResult": "actionResult",
        "onBadRequest": "onBadRequest",
        "onInternalServerError": "onInternalServerError",
        "onUserPermissionChanged": "onUserPermissionChanged"
    });

    angular.module('hexaaApp').run(['startupService',
        function (startupService) {
            //Run Startup Service
            startupService.run();
        }]);

}());
