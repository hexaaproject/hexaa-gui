'use strict';
angular.module('hexaaApp.services').service('settingsService', ['$cookieStore', 'settingsCookieName', function ($cookieStore, settingsCookieName) {

    var hexaaCookie = $cookieStore.get(settingsCookieName);

    /* GETS an item from the settings cookie */
    var get = function (prop) {
        if (hexaaCookie ) {
            return hexaaCookie[prop];
        }
        else {
            return undefined;
        }
    };

    /*puts an item into the settings cookie*/
    var set = function (prop, value) {
        if (hexaaCookie === undefined) {
            hexaaCookie = {};
        }

        hexaaCookie[prop] = value;
        $cookieStore.put(settingsCookieName, hexaaCookie);
    };

    return {
        get: get,
        set: set
    };

}]);