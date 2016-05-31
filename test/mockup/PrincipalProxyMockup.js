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

hexaaApp.factory('PrincipalFacade', function($q) {

    return {

        getPrincipal: function () {
            var deferred = $q.defer();
            var principal = {};

            deferred.resolve(wrapResponse(principal,200,null,null));

            return deferred.promise;
        },
        getAttributeSpecifications: function () {
            var deferred = $q.defer();
            var list = [];

            //Todo: create fake data

            deferred.resolve(wrapResponse(list,200,null,null));
            return deferred.promise;
        },
        getAttributeValuePrincipals: function (attspecId) {
            var deferred = $q.defer();
            var list = [];

            //Todo: create fake data

            deferred.resolve(wrapResponse(list,200,null,null));

            return deferred.promise;
        },
        addAttributeValuePrincipal: function (attributeValue) {
            var deferred = $q.defer();

            //Todo: create fake data
            deferred.resolve(wrapResponse({},200,null,null));
            return deferred.promise;
        },
        updateAttributeValuePrincipal: function (attributeValue) {
            var deferred = $q.defer();

            //Todo: create fake data
            deferred.resolve(wrapResponse({},200,null,null));
            return deferred.promise;
        },
        deleteAttributeValuePrincipal: function (aid) {
            var deferred = $q.defer();

            //Todo: create fake data
            deferred.resolve(wrapResponse({},200,null,null));
            return deferred.promise;
        },
        getRelatedServices: function () {
            var deferred = $q.defer();
            var related = [];
            //Todo: create fake data
            deferred.resolve(wrapResponse(related,200,null,null));
            return deferred.promise;
        },
        getConsents: function ()
        {
            var deferred = $q.defer();
            var consents = [];
            //Todo: create fake data
            deferred.resolve(wrapResponse(consents,200,null,null));
            return deferred.promise;
        },
        getServiceConsent: function (sid)
        {
            var deferred = $q.defer();
            var consent = {};
            //Todo: create fake data
            deferred.resolve(wrapResponse(consent,200,null,null));
            return deferred.promise;
        },
        getNews: function(skip, take, tags,services,organizations)
        {
            var deferred = $q.defer();

            var news = [];
            //Todo: create fake data
            deferred.resolve(wrapResponse(news,200,null,null));
            return deferred.promise;

        },
        updatePrincipal: function(principal) {
            var deferred = $q.defer();

            //Todo: create fake data
            deferred.resolve(wrapResponse("OK",200,null,null));
            return deferred.promise;
        },
        addPrincipal: function(principal) {
            var deferred = $q.defer();

            //Todo: create fake data
            deferred.resolve(wrapResponse("OK",200,null,null));
            return deferred.promise;
        },
        getPrincipals: function()
        {
            var deferred = $q.defer();
            var principals = [];
            //Todo: create fake data
            deferred.resolve(wrapResponse(principals,200,null,null));
            return deferred.promise;
        },
        isAdmin: function()
        {
            var deferred = $q.defer();
            //Todo: create fake data
            deferred.resolve(wrapResponse(true,200,null,null));
            return deferred.promise;
        },
        getOrganizationMemberships: function()
        {
            var deferred = $q.defer();
            var my_orgs = [];
            //Todo: create fake data
            deferred.resolve(wrapResponse(my_orgs,200,null,null));
            return deferred.promise;
        },
        getManagedOrganizations: function()
        {
            var deferred = $q.defer();
            var my_orgs = [];
            //Todo: create fake data
            deferred.resolve(wrapResponse(my_orgs,200,null,null));
            return deferred.promise;
        },
        getManagedServices: function()
        {
            var deferred = $q.defer();
            var my_services = [];
            //Todo: create fake data
            deferred.resolve(wrapResponse(my_services,200,null,null));
            return deferred.promise;
        },
        deletePrincipal: function(id)
        {
            var deferred = $q.defer();
            //Todo: create fake data
            deferred.resolve(wrapResponse("OK",200,null,null));
            return deferred.promise;
        },
        getEntityIds: function()
        {
            var deferred = $q.defer();
            var entityids = [];
            //Todo: create fake data
            deferred.resolve(wrapResponse(entityids,200,null,null));
            return deferred.promise;
        }

    }
});
