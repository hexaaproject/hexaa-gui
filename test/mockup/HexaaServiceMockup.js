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

hexaaApp.factory('HexaaServiceMockup', function() {

    var token = "token";

    var HexaaService = {
        doRequest: function(method, path, token, postData,tag) {
            //log to console
            console.log("FAKE_HTTP: "+method + " " + path + " " +postData);

            //execute query
            return false; //$http({method: method, url: apiAddr+path, headers: {'X-HEXAA-AUTH': token}, data:postData, tag: tag});
        }
    };


    return {
        getServices: function () {
            return HexaaService.doRequest('GET', '/services.json', token, null);
        },
        getService: function (id) {
            return HexaaService.doRequest('GET', '/services/' + id + '.json', token, null);
        },
        addService: function (name, url, entity, desc,org_name, org_short_name, org_url, org_description, priv_url, priv_description) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("url", url);
            postData.prop("entityid", entity);
            postData.prop("description", desc);
            postData.prop("org_name", org_name);
            postData.prop("org_short_name", org_short_name);
            postData.prop("org_url", org_url);
            postData.prop("org_description", org_description);
            postData.prop("priv_url", priv_url);
            postData.prop("priv_description", priv_description);
            return HexaaService.doRequest('POST', '/services.json', token, JSON.stringify(postData));
        },
        updateService: function (id, name, url, entity, desc, org_name, org_short_name, org_url, org_description, priv_url, priv_description) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("description", desc);
            postData.prop("url", url);
            postData.prop("entityid", entity);
            postData.prop("org_name", org_name);
            postData.prop("org_short_name", org_short_name);
            postData.prop("org_url", org_url);
            postData.prop("org_description", org_description);
            postData.prop("priv_url", priv_url);
            postData.prop("priv_description", priv_description);
            return HexaaService.doRequest('PUT', '/services/' + id + '.json', token, JSON.stringify(postData));
        },
        deleteService: function (id) {
            return HexaaService.doRequest('DELETE', '/services/' + id + '.json', token, null);
        },
        getOrganizations: function () {
            return HexaaService.doRequest('GET', '/organizations.json', token, null);
        },
        getOrganization: function (id, tag) {
            return HexaaService.doRequest('GET', '/organizations/' + id + '.json', token, null, tag);
        },
        addOrganization: function (name, desc) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("description", desc);
            return HexaaService.doRequest('POST', '/organizations.json', token, JSON.stringify(postData));
        },
        deleteOrganization: function (id) {
            return HexaaService.doRequest('DELETE', '/organizations/' + id + '.json', token, null);
        },
        updateOrganization: function (id, name, desc, default_role) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("description", desc);
            postData.prop("default_role", default_role);
            return HexaaService.doRequest('PUT', '/organizations/' + id + '.json', token, JSON.stringify(postData));
        },
        getPrincipals: function () {
            return HexaaService.doRequest('GET', '/principals.json', token, null);
        },
        getManagersOfOrganization: function (id) {
            return HexaaService.doRequest('GET', '/organizations/' + id + '/managers.json', token, null);
        },
        addManagerToOrganization: function (id, pid) {
            return HexaaService.doRequest('PUT', '/organizations/' + id + '/managers/' + pid + '.json', token, null);
        },
        deleteManagerFromOrganization: function (id, pid) {
            return HexaaService.doRequest('DELETE', '/organizations/' + id + '/managers/' + pid + '.json', token, null);
        },
        getMembersOfOrganization: function (id) {
            return HexaaService.doRequest('GET', '/organizations/' + id + '/members.json', token, null);
        },
        addMemberToOrganization: function (id, pid) {
            return HexaaService.doRequest('PUT', '/organizations/' + id + '/members/' + pid + '.json', token, null);
        },
        deleteMemberFromOrganization: function (id, pid) {
            return HexaaService.doRequest('DELETE', '/organizations/' + id + '/members/' + pid + '.json', token, null);
        },
        getManagersOfService: function (id) {
            return HexaaService.doRequest('GET', '/services/' + id + '/managers.json', token, null);
        },
        addManagerToService: function (id, pid) {
            return HexaaService.doRequest('PUT', '/services/' + id + '/managers/' + pid + '.json', token, null);
        },
        deleteManagerFromService: function (id, pid) {
            return HexaaService.doRequest('DELETE', '/services/' + id + '/managers/' + pid + '.json', token, null);
        },
        getEntityIds: function () {
            return HexaaService.doRequest('GET', '/entityids.json', token, null);
        },
        getAttributeSpecifications: function () {
            return HexaaService.doRequest('GET', '/attributespecs.json', token, null);
        },
        deleteAttributeSpecification: function (id) {
            return HexaaService.doRequest('DELETE', '/attributespecs/' + id + '.json', token, null);
        },
        getAttributeSpecification: function (id) {
            return HexaaService.doRequest('GET', '/attributespecs/' + id + '.json', token, null);
        },
        updateAttributeSpecification: function (id, oid, friendlyname, maintainer, desc, syntax, multivalue) {
            var postData = new Jobject();
            postData.prop("oid", oid);
            postData.prop("description", desc);
            postData.prop("maintainer", maintainer);
            postData.prop("syntax", syntax);
            postData.prop("is_multivalue", multivalue);
            postData.prop("friendly_name", friendlyname);

            return HexaaService.doRequest('PUT', '/attributespecs/' + id + '.json', token, JSON.stringify(postData));
        },
        addAttributeSpecification: function (oid, friendlyname, maintainer, desc, syntax, multivalue) {
            var postData = new Jobject();
            postData.prop("oid", oid);
            postData.prop("description", desc);
            postData.prop("maintainer", maintainer);
            postData.prop("syntax", syntax);
            postData.prop("is_multivalue", multivalue);
            postData.prop("friendly_name", friendlyname);

            return HexaaService.doRequest('POST', '/attributespecs.json', token, JSON.stringify(postData));
        },
        getServiceAttributeSpecifications: function (id, tag) {
            return HexaaService.doRequest('GET', '/services/' + id + '/attributespecs.json', token, null, tag);
        },
        addServiceAttributeSpecification: function (id, asid, isPublic) {

            var postData = new Jobject();
            postData.prop("is_public", isPublic);

            return HexaaService.doRequest('PUT', '/services/' + id + '/attributespecs/' + asid + '.json', token, JSON.stringify(postData));
        },
        deleteServiceAttributeSpecification: function (id, asid) {
            return HexaaService.doRequest('DELETE', '/services/' + id + '/attributespecs/' + asid + '.json', token, null);
        },
        getPrincipalAttributeSpecifications: function () {
            return HexaaService.doRequest('GET', '/principal/attributespecs.json', token, null);
        },
        getPrincipalAttributeValues: function () {
            return HexaaService.doRequest('GET', '/principal/attributevalueprincipal.json', token, null);
        },
        getPrincipal: function () {
            return HexaaService.doRequest('GET', '/principal/self.json', token, null);
        },
        deleteAttributeValuePrincipal: function (id) {
            return HexaaService.doRequest('DELETE', '/attributevalueprincipals/' + id + '.json', token, null);
        },
        updateAttributeValuePrincipal: function (id, asid, value, services) {
            var postData = new Jobject();
            postData.prop("value", value);
            postData.prop("attribute_spec", asid);
            postData.prop("services", services);
            return HexaaService.doRequest('PUT', '/attributevalueprincipals/' + id + '.json', token, JSON.stringify(postData));
        },
        addAttributeValuePrincipal: function (asid, value,services) {
            var postData = new Jobject();
            postData.prop("value", value);
            postData.prop("attribute_spec", asid);
            postData.prop("services", services);
            return HexaaService.doRequest('POST', '/attributevalueprincipals.json', token, angular.toJson(postData));
        },
        getOrganizationRoles: function (id) {
            return HexaaService.doRequest('GET', '/organizations/' + id + '/roles.json', token, null);
        },
        addRoleToOrganization: function (id, name, description, start_date, end_date) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("description", description);
            postData.prop("start_date", start_date);
            postData.prop("end_date", end_date);

            return HexaaService.doRequest('POST', '/organizations/' + id + '/roles.json', token, JSON.stringify(postData));
        },
        updateRole: function (id, name, description, start_date, end_date) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("description", description);
            postData.prop("start_date", start_date);
            postData.prop("end_date", end_date);

            return HexaaService.doRequest('PUT', '/roles/' + id + '.json', token, JSON.stringify(postData));
        },
        deleteRole: function (id) {
            return HexaaService.doRequest('DELETE', '/roles/' + id + '.json', token, null);
        },
        getServiceEntitlements: function (id) {
            return HexaaService.doRequest('GET', '/services/' + id + '/entitlements.json', token, null);
        },
        addServiceEntitlement: function (id, uri, name, description) {
            var postData = new Jobject().prop("name", name).prop("uri", uri).prop("description", description);
            return HexaaService.doRequest('POST', '/services/' + id + '/entitlements.json', token, JSON.stringify(postData));
        },
        updateEntitlement: function (id, uri, name, description) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("uri", uri);
            postData.prop("description", description);


            return HexaaService.doRequest('PUT', '/entitlements/' + id + '.json', token, JSON.stringify(postData));
        },
        deleteEntitlement: function (id) {
            return HexaaService.doRequest('DELETE', '/entitlements/' + id + '.json', token, null);
        },
        addServiceEntitlementPack: function (id, name, description, type) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("description", description);
            postData.prop("type", type);

            return HexaaService.doRequest('POST', '/services/' + id + '/entitlementpacks.json', token, JSON.stringify(postData));
        },
        updateEntitlementPack: function (id, name, description, type) {
            var postData = new Jobject();
            postData.prop("name", name);
            postData.prop("description", description);
            postData.prop("type", type);
            return HexaaService.doRequest('PUT', '/entitlementpacks/' + id + '.json', token, JSON.stringify(postData));
        },
        deleteEntitlementPack: function (id) {
            return HexaaService.doRequest('DELETE', '/entitlementpacks/' + id + '.json', token, null);
        },
        getServiceEntitlementPacks: function (id) {
            return HexaaService.doRequest('GET', '/services/' + id + '/entitlementpacks.json', token, null);
        },
        getEntitlementsOfEntitlementPack: function (id) {
            return HexaaService.doRequest('GET', '/entitlementpacks/' + id + '/entitlements', token, null);
        },
        inviteOrganizationManager: function (oid, email, msg, landing_url, start_date, end_date, limit, locale) {
            var postData = new Jobject();
            postData.prop("organization", oid);
            postData.prop("emails", email);
            postData.prop("message", msg);
            postData.prop("landing_url", landing_url);
            postData.prop("as_manager", true);
            postData.prop("start_date", start_date);
            postData.prop("end_date", end_date);
            postData.prop("limit", limit);
            postData.prop("locale", locale);

            return HexaaService.doRequest('POST', '/invitations.json', token, JSON.stringify(postData));
        },
        inviteOrganizationMember: function (oid, email, msg, role, landing_url, start_date, end_date, limit, locale) {
            var postData = new Jobject();
            postData.prop("organization", oid);
            postData.prop("emails", email);
            postData.prop("message", msg);
            postData.prop("role", role);
            postData.prop("landing_url", landing_url);
            postData.prop("start_date", start_date);
            postData.prop("end_date", end_date);
            postData.prop("limit", limit);
            postData.prop("locale", locale);
            postData.prop("as_manager", false);

            return HexaaService.doRequest('POST', '/invitations.json', token, JSON.stringify(postData));
        },
        inviteRoleMember: function (role, email, msg, landing_url,locale) {
            var postData = new Jobject();
            postData.prop("role", role);
            postData.prop("emails", email);
            postData.prop("message", msg);
            postData.prop("landing_url", landing_url);
            postData.prop("locale", landing_url);

            return HexaaService.doRequest('POST', '/invitations.json', token, JSON.stringify(postData));
        },
        inviteServiceManager: function (service, email, msg, landing_url, start_date, end_date, limit,locale) {
            var postData = new Jobject()
                .prop("service", service).prop("emails", email).prop("message", msg)
                .prop("landing_url", landing_url).prop("start_date", start_date).prop("end_date", end_date)
                .prop("limit", limit).prop("locale", locale);

            return HexaaService.doRequest('POST', '/invitations.json', token, JSON.stringify(postData));
        },
        addEntitlementToEntitlementpack: function (id, eid) {
            var postData = new Jobject();
            postData.prop("id", id);
            postData.prop("eid", eid);

            return HexaaService.doRequest('PUT', '/entitlementpacks/' + id + '/entitlements/' + eid + '.json', token, JSON.stringify(postData));
        },
        deleteEntitlementFromEntitlementpack: function (id, eid) {
            var postData = new Jobject();
            postData.prop("id", id);
            postData.prop("eid", eid);

            return HexaaService.doRequest('DELETE', '/entitlementpacks/' + id + '/entitlements/' + eid + '.json', token, JSON.stringify(postData));
        },
        getPublicEntitlementpacks: function () {
            return HexaaService.doRequest('GET', '/entitlementpacks/public.json', token, null);
        },
        getOrganizationEntitlementPacks: function (id) {
            ///api/organizations/{id}/entitlementpacks
            return HexaaService.doRequest('GET', '/organizations/' + id + '/entitlementpacks.json', token, null);
        },
        linkEntitlementToOrganization: function (id, atoken) {
            //            /api/organizations/{id}/entitlementpacks/{token}/token
            return HexaaService.doRequest('PUT', '/organizations/' + id + '/entitlementpacks/' + atoken + '/token.json', token, null);
        },
        unlinkEntitlementToOrganization: function (id, atoken) {
            //            /api/organizations/{id}/entitlementpacks/{token}/token

            return HexaaService.doRequest('DELETE', '/organizations/' + id + '/entitlementpacks/' + atoken + '/token.json', token, null);
        },
        addEntitlementpackToOrganization: function (id, eid) {
            return HexaaService.doRequest('PUT', '/organizations/' + id + '/entitlementpacks/' + eid + '.json', token, null);
        },
        deleteEntitlementpackFromOrganization: function (id, eid) {
            return HexaaService.doRequest('DELETE', '/organizations/' + id + '/entitlementpacks/' + eid + '.json', token, null);
        },
        getOrganizationEntitlements: function (id) {
            //            /api/organizations/{id}/entitlements
            return HexaaService.doRequest('GET', '/organizations/' + id + '/entitlements.json', token, null);
        },
        getRoleEntitlements: function (id) {
            //            /api/roles/{id}/entitlements
            return HexaaService.doRequest('GET', '/roles/' + id + '/entitlements.json', token, null);
        },
        getRole: function (id)
        {
            return HexaaService.doRequest('GET', '/roles/'+id+'.json', token, null);
        },
        addRoleEntitlement: function(id,eid)
        {
            //            /api/roles/{id}/entitlements/{eid}
            return HexaaService.doRequest('PUT', '/roles/'+id+'/entitlements/'+eid+'.json', token, null);
        },
        setRoleEntitlements: function(id,eid)
        {
            //            /api/roles/{id}/entitlements/{eid}
            var postData = new Jobject();
            postData.prop("entitlements",eid);
            return HexaaService.doRequest('PUT', '/roles/'+id+'/entitlement.json', token, angular.toJson(postData));
        },
        setRolePrincipals: function(id,principals)
        {
            //            /api/roles/{id}/entitlements/{eid}
            var postData = new Jobject();
            postData.prop("principals",principals);
            return HexaaService.doRequest('PUT', '/roles/'+id+'/principal.json', token, angular.toJson(postData));
        },
        deleteRoleEntitlement: function(id,eid)
        {
            return HexaaService.doRequest('DELETE', '/roles/'+id+'/entitlements/'+eid+'.json', token, null);
        },
        getRolePrincipals: function(id)
        {
            return HexaaService.doRequest('GET', '/roles/'+id+'/principals.json', token, null);
        },
        addRolePrincipal: function(id,pid,expiration)
        {
            var postData = new Jobject();
            postData.prop("expiration", expiration);

            return HexaaService.doRequest('PUT', '/roles/'+id+'/principals/'+pid+'.json', token, JSON.stringify(postData));
        },
        deleteRolePrincipal: function(id,pid)
        {
            return HexaaService.doRequest('DELETE', '/roles/'+id+'/principals/'+pid+'.json', token, null);
        },
        getOrganizationsLinkedToService: function(id)
        {
            return HexaaService.doRequest('GET', '/services/'+id+'/entitlementpack/requests.json', token, null);
        },
        getEntitlementpack: function(id, tag)
        {
            return HexaaService.doRequest('GET', '/entitlementpacks/'+id+'.json', token, null, tag);
        },
        acceptOrganizationToEntitlementpackageRequest: function(id,epid)
        {
            return HexaaService.doRequest('PUT', '/organizations/'+id+'/entitlementpacks/'+epid+'/accept.json', token, null, null);
        },
        getAttributeValuePrincipalsPerAttributeSpecification: function(asid)
        {
            return HexaaService.doRequest('GET', '/principals/'+asid+'/attributespecs/attributevalueprincipals.json', token, null, null);
        },
        getAttributeValuePrincipalConsents: function(id,tag)
        {
            return HexaaService.doRequest('GET', '/attributevalueprincipals/'+id+'/consents.json', token, null, tag);
        },
        addAttributeValuePrincipalConsent: function(sid,id,tag)
        {
            var postData = new Jobject();
            postData.prop("is_allowed", true);

            return HexaaService.doRequest('PUT', '/attributevalueprincipals/'+id+'/services/'+sid+'.json', token, JSON.stringify(postData), tag);
        },
        deleteAttributeValuePrincipalConsent: function(sid,id,tag)
        {
            return HexaaService.doRequest('DELETE', '/attributevalueprincipals/'+id+'/services/'+sid+'.json', token, null, tag);
        },
        getOrganizationAttributeSpecifications: function(id,tag)
        {
            return HexaaService.doRequest('GET', '/organizations/'+id+'/attributespecs.json', token, null, tag);
        },
        getOrganizationAttributeValues: function (id) {
            return HexaaService.doRequest('GET', '/organizations/'+id+'/attributevalueorganization.json', token, null);
        },
        getAttributeValueOrganizationsPerAttributeSpecification: function (id,asid) {
            return HexaaService.doRequest('GET', '/organizations/'+id+'/attributespecs/'+asid+'/attributevalueorganizations.json', token, null);
        },
        deleteAttributeValueOrganization : function(id,tag)
        {
            return HexaaService.doRequest('DELETE', '/attributevalueorganizations/'+id+'.json', token, null, tag);
        },
        addAttributeValueOrganization: function(id,asid, value, services)
        {
            var postData = new Jobject();
            postData.prop("services", services);
            postData.prop("value", value);
            postData.prop("organization", id);
            postData.prop("attribute_spec", asid);
            return HexaaService.doRequest('POST', '/attributevalueorganizations.json', token, angular.toJson(postData));
        },
        updateAttributeValueOrganization: function (id, asid, value,service) {
            var postData = new Jobject();
            postData.prop("attribute_spec", asid);
            postData.prop("value", value);
            postData.prop("services", service);
            return HexaaService.doRequest('PUT', '/attributevalueorganizations/' + id + '.json', token, angular.toJson(postData));
        },
        getServicesLinkedToAttributeSpecification : function(asid)
        {
            return HexaaService.doRequest('GET', '/attributespecs/'+asid+'/service.json', token, null);
        },
        getAttributeValueOrganizationConsents: function(id)
        {
            return HexaaService.doRequest('GET', '/attributevalueorganizations/'+id+'/consents.json', token, null);
        },
        addAttributeValueOrganizationConsent: function(sid, id)
        {
            return HexaaService.doRequest('PUT', '/attributevalueorganizations/'+id+'/services/'+sid+'.json', token, null);
        },
        deleteAttributeValueOrganizationConsent: function(sid, id)
        {
            return HexaaService.doRequest('DELETE', '/attributevalueorganizations/'+id+'/services/'+sid+'.json', token, null);
        },
        getOrganizationInvitations: function(id)
        {
            return HexaaService.doRequest('GET', '/organizations/'+id+'/invitations.json', token, null);
        },
        deleteInvitation: function(id)
        {
            return HexaaService.doRequest('DELETE', '/invitations/'+id+'.json', token, null);
        },
        updateInvitation: function(id, emails, landing_url, as_manager, message,
                                   start_date, end_date, limit, role, organization, service,locale)
        {
            var postData = new Jobject().prop("emails",emails).prop("landing_url",landing_url)
                .prop("as_manager",as_manager).prop("message",message).prop("start_date",start_date)
                .prop("end_date",end_date).prop("limit",limit).prop("role", role).prop("organization", organization)
                .prop("service",service).prop("locale",locale);
            return HexaaService.doRequest('PUT', '/invitations/'+id+'.json', token, JSON.stringify(postData));
        },
        resendInvitation: function(id)
        {
            return HexaaService.doRequest('GET', '/invitations/'+id+'/resend.json', token, null);
        },
        getInvitation: function(id)
        {
            return HexaaService.doRequest('GET', '/invitations/'+id+'.json', token, null);
        },
        getServiceInvitations: function(id)
        {
            ///api/services/{id}/invitations
            return HexaaService.doRequest('GET', '/services/'+id+'/invitations.json', token, null);
        },
        addPrincipal: function(fedid,email,display_name)
        {
            var postData = new Jobject().prop("fedid",fedid).prop("email",email).prop("display_name",display_name);

            return HexaaService.doRequest('POST', '/principals.json', token, JSON.stringify(postData));
        },
        setToken: function(_token)
        {
            token = _token;
        },
        getIsAdmin: function()
        {
            ///api/services/{id}/invitations
            return HexaaService.doRequest('GET', '/principal/isadmin.json', token, null);
        },
        getDummy: function () {
            return "dummy response";
        },
        addEntityIdRequest: function(entityid, message){
            ///api/entityidrequests
            var postData = new Jobject().prop("entityid",entityid).prop("message",message);
            return HexaaService.doRequest('POST', '/entityidrequests.json', token, JSON.stringify(postData));
        },
        getUserEntityIds: function()
        {
            return HexaaService.doRequest('GET', '/entityidrequests.json', token, null);
        },
        deleteEntityIdRequest:function(id){
            return HexaaService.doRequest('DELETE', '/entityidrequests/'+id+'.json', token, null);
        },
        acceptEntityIdRequest:function(id){
            return HexaaService.doRequest('GET', '/entityidrequests/'+id+'/accept.json', token, null);
        },
        rejectEntityIdRequest:function(id){
            return HexaaService.doRequest('GET', '/entityidrequests/'+id+'/reject.json', token, null);
        },
        updateEntityIdRequest:function(id,entityid,message){

            var postData = new Jobject().prop("entityid",entityid).prop("message",message);
            return HexaaService.doRequest('PUT', '/entityidrequests/'+id+'.json', token, JSON.stringify(postData));
        },
        getPrincipalRelatedServices: function()
        {
            return HexaaService.doRequest('GET', '/principal/services/related.json', token, null);
        },
        addConsent: function(enable_entitlements, enabled_attribute_specs, service)
        {
            var postData = new Jobject()
                .prop("enable_entitlements",enable_entitlements)
                .prop("enabled_attribute_specs",enabled_attribute_specs)
                .prop("service",service);
            return HexaaService.doRequest('POST', '/consents.json', token, angular.toJson(postData));
        },
        updateConsent: function(id,enable_entitlements, enabled_attribute_specs, service)
        {
            var postData = new Jobject()
                .prop("enable_entitlements",enable_entitlements)
                .prop("enabled_attribute_specs",enabled_attribute_specs)
                .prop("service",service);
            return HexaaService.doRequest('PUT', '/consents/'+id+'.json', token, angular.toJson(postData));
        },
        getConsents: function()
        {
            return HexaaService.doRequest('GET', '/consents.json', token, null);
        },
        getServiceConsent: function(serviceId){
            return HexaaService.doRequest('GET', '/consents/'+serviceId+'/service.json', token, null);
        },
        getOrganizationNews: function(id, skip, take, _tags)
        {
            return HexaaService.doRequest('GET', '/organizations/'+id+'/news.json?limit='+take+'&offset='+skip+'&'+$.param({tags: _tags}), token, null);
        },
        getServiceNews: function(id, skip, take, _tags)
        {
            return HexaaService.doRequest('GET', '/services/'+id+'/news.json?limit='+take+'&offset='+skip+'&'+$.param({tags: _tags}), token, null);
        },
        getPrincipalNews: function(skip, take, _tags, _services, _organizations)
        {
            return HexaaService.doRequest('GET', '/principal/news.json?limit='+take+'&offset='+skip+'&'+$.param({tags: _tags})+'&'+$.param({services: _services})+'&'+$.param({organizations: _organizations}), token, null);
        },
        getPrincipalById: function(id)
        {
            return HexaaService.doRequest('GET', '/principals/'+id+'/id.json', token, null);
        },
        generateEntitlementpackToken: function(id)
        {
            return HexaaService.doRequest('GET', '/entitlementpacks/'+id+'/token.json', token, null);
        },
        getApiProperties: function()
        {
            ///api/version.json
            return HexaaService.doRequest('GET', '/properties.json', token, null);
        },
        updatePrincipal: function(id,fedid,email,display_name)
        {
            ///api/version.json
            var postData = new Jobject()
                .prop("fedid",fedid)
                .prop("email",email)
                .prop("display_name",display_name);
            return HexaaService.doRequest('PATCH', '/principals/'+id+'.json', token, postData);
        },
        setEntitlementPackEntitlements: function(epid,entitlements)
        {
            var postData = new Jobject()
                .prop("entitlements", entitlements);
            return HexaaService.doRequest('PUT', '/entitlementpacks/'+epid+'/entitlement.json', token, angular.toJson(postData));
        },
        setOrganizationManagers: function(oid,managers)
        {
            var postData = new Jobject()
                .prop("managers", managers);
            return HexaaService.doRequest('PUT', '/organizations/'+oid+'/manager.json', token, angular.toJson(postData));
        },
        setServiceManagers: function(sid,managers)
        {
            var postData = new Jobject()
                .prop("managers", managers);
            return HexaaService.doRequest('PUT', '/services/'+sid+'/manager.json', token, angular.toJson(postData));
        },
        setOrganizationMembers: function(oid,members)
        {
            var postData = new Jobject()
                .prop("principals", members);
            return HexaaService.doRequest('PUT', '/organizations/'+oid+'/member.json', token, angular.toJson(postData));
        },
        setOrganizationEntitlementpacks: function(oid, entitlementpacks)
        {
            //            PUT /api/organizations/{id}/entitlementpack.{_format}
            var postData = new Jobject()
                .prop("entitlement_packs", entitlementpacks);
            return HexaaService.doRequest('PUT', '/organizations/'+oid+'/entitlementpack.json', token, angular.toJson(postData));
        },
        getPrincipalManagedServices: function()
        {
            return HexaaService.doRequest('GET', '/manager/services.json', token, null);
        },
        getPrincipalManagedOrganizations: function()
        {
            return HexaaService.doRequest('GET', '/manager/organizations.json', token, null);
        },
        getPrincipalMemberOrganizations: function()
        {
            return HexaaService.doRequest('GET', '/member/organizations.json', token, null);
        },
        deletePrincipal: function(id)
        {
            ///api/principals/{id}/id.{_format}
            return HexaaService.doRequest('DELETE', '/principals/'+id+'/id.json', token, null);
        },
        setServiceAttributeSpecifications: function(sid,attribute_specs)
        {
            ///api/services/{id}/attributespec.{_format}
            var postData = new Jobject()
                .prop("attribute_specs", attribute_specs);
            return HexaaService.doRequest('PUT', '/services/'+sid+'/attributespec.json', token, angular.toJson(postData));
        },
        notifySP: function(sid,contact)
        {
            return HexaaService.doRequest('PUT', '/services/'+sid+'/notifysp.json', token, angular.toJson(contact));
        }
    };
});
