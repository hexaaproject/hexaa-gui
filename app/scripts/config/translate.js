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

/**
 * Configuration of the translate provider
 */

(function () {

    'use strict';

    angular.module("hexaaApp.config").config(['$translateProvider', '$translatePartialLoaderProvider', function ($translateProvider, $translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('index');
        $translatePartialLoaderProvider.addPart('organizations/index');
        $translatePartialLoaderProvider.addPart('organizations/new');
        $translatePartialLoaderProvider.addPart('organizations/news');
        $translatePartialLoaderProvider.addPart('organizations/properties');
        $translatePartialLoaderProvider.addPart('organizations/managers');
        $translatePartialLoaderProvider.addPart('organizations/members');
        $translatePartialLoaderProvider.addPart('organizations/attributes');
        $translatePartialLoaderProvider.addPart('organizations/consents');
        $translatePartialLoaderProvider.addPart('organizations/entitlementpacks');
        $translatePartialLoaderProvider.addPart('organizations/roles');
        $translatePartialLoaderProvider.addPart('organizations/invitations');
        $translatePartialLoaderProvider.addPart('organizations/inviteorgmanagers');
        $translatePartialLoaderProvider.addPart('organizations/inviteorgmembers');
        $translatePartialLoaderProvider.addPart('organizations/principalmanagement');
        $translatePartialLoaderProvider.addPart('organizations/public_catalog');
        $translatePartialLoaderProvider.addPart('organizations/modals/attributeEditorDialog');
        $translatePartialLoaderProvider.addPart('modals/message');
        $translatePartialLoaderProvider.addPart('modals/entityIdContactDialog');
        $translatePartialLoaderProvider.addPart('modals/newRole');
        $translatePartialLoaderProvider.addPart('modals/newEntitlementpackDialog');
        $translatePartialLoaderProvider.addPart('modals/invitation');
        $translatePartialLoaderProvider.addPart('modals/confirmationDialog');
        $translatePartialLoaderProvider.addPart('modals/loading');
        $translatePartialLoaderProvider.addPart('modals/organizationDetails');
        $translatePartialLoaderProvider.addPart('modals/serviceDetails');
        $translatePartialLoaderProvider.addPart('modals/organizationChangerDialog');
        $translatePartialLoaderProvider.addPart('modals/serviceChangerDialog');
        $translatePartialLoaderProvider.addPart('admin/attributespecifications');
        $translatePartialLoaderProvider.addPart('admin/new_attrspec');
        $translatePartialLoaderProvider.addPart('admin/index');
        $translatePartialLoaderProvider.addPart('admin/principals');
        $translatePartialLoaderProvider.addPart('admin/entityids');
        $translatePartialLoaderProvider.addPart('admin/modals/newAttrspecDialog');
        $translatePartialLoaderProvider.addPart('profile/index');
        $translatePartialLoaderProvider.addPart('profile/attributes');
        $translatePartialLoaderProvider.addPart('profile/modals/attributeEditorDialog');
        $translatePartialLoaderProvider.addPart('profile/me');
        $translatePartialLoaderProvider.addPart('profile/vowizard');
        $translatePartialLoaderProvider.addPart('profile/consents');
        $translatePartialLoaderProvider.addPart('profile/dashboard');
        $translatePartialLoaderProvider.addPart('profile/myorganizations');
        $translatePartialLoaderProvider.addPart('profile/myservices');
        $translatePartialLoaderProvider.addPart('profile/news');
        $translatePartialLoaderProvider.addPart('services/index');
        $translatePartialLoaderProvider.addPart('services/owner');
        $translatePartialLoaderProvider.addPart('services/properties');
        $translatePartialLoaderProvider.addPart('services/managers');
        $translatePartialLoaderProvider.addPart('services/entitlements');
        $translatePartialLoaderProvider.addPart('services/modals/newEntitlementpackDialog');
        $translatePartialLoaderProvider.addPart('services/attributespecifications');
        $translatePartialLoaderProvider.addPart('services/entitlementpacks');
        $translatePartialLoaderProvider.addPart('services/connectedpacks');
        $translatePartialLoaderProvider.addPart('services/invitations');
        $translatePartialLoaderProvider.addPart('services/new');
        $translatePartialLoaderProvider.addPart('services/news');
        $translatePartialLoaderProvider.addPart('services/inviteservicemanagers');
        $translatePartialLoaderProvider.addPart('services/entityids');
        $translatePartialLoaderProvider.addPart('services/modals/newEntitlementDialog');


        $translateProvider.useLoader('$translatePartialLoader', {
            //ngTranslate will use this pattern to look for translation files in the file system
            urlTemplate: 'lang/{lang}/{part}.json'
        });
        $translateProvider.fallbackLanguage('en');
        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
    }]);
}());