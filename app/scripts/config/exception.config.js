(function () {
    'use strict';

    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    function extendExceptionHandler($delegate, $injector, baseUIAddr) {
        return function (exception, cause) {
            $delegate(exception, cause);

            var $http = $injector.get("$http");
            var toastr = $injector.get("toastr");
            var $rootScope = $injector.get("$rootScope");
            var profileService = $injector.get("profileService");

            var errorData = angular.toJson({
                fedid: profileService.getProfile().fedid,
                message: exception.message,
                stack: exception.stack,
                cause: cause
            });


            $http({
                method: "POST",
                url: baseUIAddr + "/log.php",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                data: 'errorData=' + errorData
            })
                .success(function (data, status, headers, config) {
                    toastr.info("Exception has been logged.");
                })
                .error(function (data, status, headers, config) {
                    toastr.warning("Exception occured, but could not log because " + data);
                });

        };
    }

    exceptionConfig.$inject = ['$provide'];
    extendExceptionHandler.$inject = ['$delegate', '$injector', 'baseUIAddr'];

    angular
        .module('hexaaApp.config')
        .config(exceptionConfig);


}());