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
angular.module('hexaaApp.shared.directives').directive('notifyuierror', ['events', '$rootScope', function (events, $rootScope) {

    function link(scope, elem, attr) {

        //Feliratkozás a notifyUIError broadcast eseményre
        $rootScope.$on(events.notifyUIError, onNotifyUIError(elem));
    }

    function onNotifyUIError(elem) {
        return function (event, error) {
            //Ellenőrizzük, hogy biztosan kaptunk-e konkrét hibaüzenetet (500-as hiba esetén nem kapunk)
            if ((error !== undefined) && (error !== null) && (error.children !== undefined)) {

                //A tooltipet el is kell majd rejteni, ehhez definialok egy fuggvenyt
                var hide = function () {
                    $(this).tooltip("hide");
                };
                //Melyik adatmezőhöz tartozik a direktíva?
                var error_type = $(elem).attr("id");
                //Az adott mezővel kapcsolatban történt-e validációs hiba?
                if ((error.children[error_type] !== undefined) &&
                    (error.children[error_type].errors !== undefined) &&
                    (error.children[error_type].errors.length > 0)) {
                    //Létrehozunk egy tooltipet az input HTML elemre
                    $(elem).prop("data-toggle", "tooltip");
                    //Beállítjuk a szövegét
                    $(elem).prop("title", error.children[error_type].errors[0]);
                    //Megjelenítjük, poziciónáljuk
                    $(elem).tooltip({placement: "left", trigger: "manual"}).tooltip("show");
                    //Focus esetén tűnjön el a popup
                    $(elem).focus(hide);
                }
            }
        };
    }

    return {
        restrict: 'A', //Attribútumként csatolhatjuk a komponenshez a direktívát
        link: link
    };

}]);