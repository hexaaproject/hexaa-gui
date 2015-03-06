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
 * Takes a huge mass of data, returns [currentPage*itemPerpage,currentPage*itemPerpage + itemPerPage ]
 * @param input input collection
 * @param pagerSettings
 * @returns {*}
 */
function pagerFilter(input, pagerSettings) {
    if (input !== undefined) {
        if (pagerSettings !== undefined) {
            return $linq(input).skip((pagerSettings.currentPage - 1) * pagerSettings.itemPerPage).take(pagerSettings.itemPerPage).toArray();
        }
        else {
            return input;
        }
    }
    else {
        return [];
    }
}

function pagerFilterFactory() {
    return pagerFilter;
}

angular.module("hexaaApp.filters")
    .filter('pager', pagerFilterFactory);