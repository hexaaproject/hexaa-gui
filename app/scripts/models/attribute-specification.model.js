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

function AttributeSpecificationFactory($injector) {
    var defaultProperties = {
        name: null,
        is_public: null,
        description: null,
        is_multivalue: false
    };

    //Retrieve dependencies
    var ResourceEntity = $injector.get("ResourceEntity");

    //Constructor function
    function AttributeSpecification(data) {
        angular.extend(this, data || angular.copy(defaultProperties));
    }

    //Ingerit from ResourceEntity
    AttributeSpecification.prototype = ResourceEntity.new();
    AttributeSpecification.prototype.constructor = AttributeSpecification;

    /* INTERFACE */
    AttributeSpecification.prototype.save = save;
    AttributeSpecification.prototype.delete = remove;

    /* STATIC */
    AttributeSpecification.new = create;

    AttributeSpecificationFactory.class = AttributeSpecification;

    /* IMPLEMENTATION */

    function create(data) {
        return new AttributeSpecification(data);
    }

    //Remove AttributeSpecification
    function remove() {
        var proxy = $injector.get("AttributeSpecificationsFacade");
        return proxy.delete(this.id);
    }

    //Save AttributeSpecification
    function save() {
        var proxy = $injector.get("AttributeSpecificationsFacade");
        if (this.id === -1 || this.id === undefined) {
            return proxy.create(this)
                .success(onAttributeSpecificationSaveSuccess(this));
        }
        else {
            return proxy.update(this);
        }
    }

    function onAttributeSpecificationSaveSuccess(attr) {
        return function (data, status, headers, config) {
            attr.id = headers("Location").match("(.*)/api/attributespecs/(.*)")[2];
        }
    }

    return AttributeSpecification;
}

//Register App Factory in AngularJS
angular.module('hexaaApp.models').factory("AttributeSpecificationFactory", ['$injector', AttributeSpecificationFactory]);