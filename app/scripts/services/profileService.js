'use strict';
angular.module('hexaaApp.services')
    .service('profileService', ['PrincipalProxy', 'HexaaService', 'baseAddr', '$rootScope', 'events', PrincipalProxyService]);

function PrincipalProxyService(PrincipalProxy, HexaaService, baseAddr, $rootScope, events) {

    var profile = null;

    var service = {
        run: run,
        refresh: refresh,
        getProfile: getProfile,
        logout: logout
    };

    var profileOperations = {
        isManagerOfService: isManagerOfService,
        isManagerOfOrganization: isManagerOfOrganization,
        isMemberOfOrganization: isMemberOfOrganization,
        setIsAdmin: setIsAdmin,
        addManagedOrganization: addManagedOrganization,
        addManagedService: addManagedService
    };


    function logout() {
        var redirectUrl = baseAddr + "/Shibboleth.sso/Logout?return=" + baseAddr;
        var encoded = btoa(redirectUrl);
        location.href = "logout.php?redirect=" + encoded;
    }

    function addManagedOrganization(organization) {
        profile.managedOrganizations.push(organization);
    }

    function addManagedService(service) {
        profile.managedServices.push(service);
    }

    function run() {
        refresh();
    }

    function refresh() {
        return PrincipalProxy.getPrincipal()
            .then(onGetPrincipalSuccess);
    }

    function getProfile() {
        if (profile !== null) {
            return profile;
        }
        else {
            profile = {};
            profile.$promise = refresh();
            return profile;
        }
    }


    /**
     * Checks if the current user is manager of the specified service
     * @param {integer} sid - The ID of the Service
     * @returns {boolean}
     */
    function isManagerOfService(sid) {
        if (sid !== undefined) {
            if (profile !== undefined) {
                return profile.isAdmin || ($linq(profile.managedServices).indexOf("x=>x.id==" + sid) >= 0);
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    /**
     * Checks if the current user is a manager of the specified organization
     * @param {integer} oid - The ID of the Organization
     * @returns {boolean}
     */
    function isManagerOfOrganization(oid) {
        if (oid !== undefined) {
            if (profile !== undefined) {
                var ismanager = ($linq(profile.managedOrganizations).indexOf("x=>x.id==" + oid) >= 0);
                return profile.isAdmin || ismanager;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    /**
     * Checks if the current user is a member of the specified organization
     * @param oid ID of the Organization
     * @returns {boolean}
     */
    function isMemberOfOrganization(oid) {
        if (oid !== undefined) {
            if (profile !== undefined) {
                return profile.isAdmin || ($linq(profile.memberships).indexOf("x=>x.id==" + oid) >= 0);
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    function onGetPrincipalSuccess(data) {
        angular.copy(data.data, profile);
        angular.extend(profile, profileOperations);
        HexaaService.setIsAdmin(data.data.isAdmin);
    }

    function setIsAdmin(isAdmin) {
        HexaaService.setIsAdmin(isAdmin);
        profile.isAdmin = isAdmin;
        $rootScope.$broadcast(events.onUserPermissionChanged);
    }

    return service;
}