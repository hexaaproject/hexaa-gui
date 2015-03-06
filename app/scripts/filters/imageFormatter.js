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


function imageFormatterFilter(baseAddr, baseUIAddr) {
    /**
     * Formats a service logo so that it can be displayed on the UI
     */
    return function (logo_path) {

        if (logo_path === undefined || logo_path === null || logo_path === "") {
            return baseUIAddr + "/images/default.png";
        }
        else {
            return baseAddr + '/' + this.logo_path;
        }
    };
}

angular.module("hexaaApp.filters")
    .filter('imageFormatter', ['baseAddr', 'baseUIAddr', imageFormatterFilter]);