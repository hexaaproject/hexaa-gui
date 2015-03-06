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

hexaaApp.factory('OrganizationsProxyMockup', function($q) {

    return {
        getNews: function(id, skip, take, tags)
        {
            var deferred = $q.defer();

            var news = [
                {
                    id : 0,
                    organization_id: 1,
                    tag: ["service"],
                    created_at: "2014.11.11",
                    title: "Title 0",
                    message: "Message 0"
                },
                {
                    id : 1,
                    organization_id: 1,
                    tag: ["service"],
                    created_at: "2014.11.12",
                    title: "Title 1",
                    message: "Message 1"
                }
                ,{
                    id : 2,
                    organization_id: 1,
                    tag: ["organization"],
                    created_at: "2014.11.12",
                    title: "Title 2",
                    message: "Message 2"
                }
                ,{
                    id : 3,
                    organization_id: 1,
                    tag: ["invitation"],
                    created_at: "2014.11.13",
                    title: "Title 3",
                    message: "Message 3"
                }
                ,{
                    id : 4,
                    organization_id: 1,
                    tag: ["organization_member"],
                    created_at: "2014.11.14",
                    title: "Title 4",
                    message: "Message 4"
                }
                ,{
                    id : 5,
                    organization_id: 2,
                    tag: ["organization_entitlement_pack"],
                    created_at: "2014.11.17",
                    title: "Title 5",
                    message: "Message 5"
                }
            ];
            var subquery =  $linq(news).where("x => x.organization_id == "+id).skip(skip).take(take).toArray();

            if (tags !== [])
            {
                subquery = $linq(subquery).where(function(x)
                {
                    return $linq(tags).any(function(y)
                    {
                        return x.tag.indexOf(y) > -1;
                    });
                }).toArray();
            }

            deferred.resolve(wrapResponse(subquery,200,null,null));

            return deferred.promise;
        }
    }
});
