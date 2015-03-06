'use strict';

describe('Controller: OrganizationNewsCtrl', function () {
    //Load module, mock up $translate provider
    beforeEach(function() {
        module('hexaaApp', function config($provide) {
            //faking $translate
            $provide.provider('$translate', function() {
                var store                 = {};
                this.get                  = function() { return false; };
                this.preferredLanguage    = function() { return false; };
                this.storage              = function() { return false; };
                this.translations         = function() { return {}; };
                this.$get = ['$q', function($q) {
                    var $translate        = function(key) {
                        var deferred = $q.defer(); deferred.resolve(key); return deferred.promise;
                    };
                    $translate.addPair    = function(key, val) { store[key] = val; };
                    $translate.isPostCompilingEnabled = function() { return false; };
                    $translate.preferredLanguage = function() { return false; };
                    $translate.storage    = function() { return false; };
                    $translate.storageKey = function() { return true; };
                    $translate.use        = function() { return false; };

                    return $translate;
                }];
            });
        });
    });


    var MainCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        MainCtrl = $controller('OrganizationNewsCtrl', {
            $scope: scope,
            $rootScope: $rootScope,
            events: $injector.get('events'),
            OrganizationsProxy: $injector.get('OrganizationsProxyMockup'),
            tags: $injector.get('tags')
        });
    }));

    it('tagSources has 12 tags', function () {
        expect(scope.tagSources.length).toBe(12);
    });

    it('has no organization selected by default', function()
    {
        expect(scope.organization.id).toBe(-1);
    });

    it('has 5 news item attached to organization 1', function()
    {
        scope.refreshFeed(1);
        scope.$digest();
        expect(scope.organization.news.length).toBe(5);
    });

    it('has 1 news item attached to organization 2', function()
    {
        scope.refreshFeed(2);
        scope.$digest();
        expect(scope.organization.news.length).toBe(1);
    });

    it('has 3 news item when pageSize is 3', function()
    {
        scope.pager.itemPerPage = 3;
        scope.refreshFeed(1);
        scope.$digest();
        expect(scope.organization.news.length).toBe(3);
    });

    it('has the first three items on the first page when pageSize is 3', function()
    {
        scope.pager.itemPerPage = 3;
        scope.refreshFeed(1);
        scope.$digest();
        expect(scope.organization.news.length).toBe(3);
        expect(scope.organization.news[0].id).toBe(0);
        expect(scope.organization.news[1].id).toBe(1);
        expect(scope.organization.news[2].id).toBe(2);
    });

    it('has two items on the second page', function()
    {
        scope.pager.itemPerPage = 3;
        scope.pager.currentPage = 2;
        scope.refreshFeed(1);
        scope.$digest();

        expect(scope.organization.news.length).toBe(2);
    });

    /*
    it('has one item tagged as invitation',function()
    {
        for (var i = 0; i < scope.tagSources.length; i++)
        {
            if( scope.tagSources[i].name == "invitation")
                scope.tagSources[i].ticked = true;
            else
                scope.tagSources[i].ticked = false;

            scope.refreshFeed(1);
            scope.$digest();

            expect(scope.organization.news.length).toBe(1);
        }
    });
    */


});
