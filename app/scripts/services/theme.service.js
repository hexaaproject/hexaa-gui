'use strict';
angular.module('hexaaApp.services').service('themeService', ['$rootScope', 'events', function ($rootScope, events) {

    /**
     * Predefined Themes
     * @type {{id: number, name: string, src: string, selected: boolean}[]}
     */
    var themes = [
        {
            id: 0,
            name: 'Default',
            //src: '../bower_components/bootstrap/dist/css/bootstrap.css',
            src: 'styles/skins/bootstrap.css',
            selected: true
        },
        {
            id: 1,
            name: 'Amelia',
            src: 'styles/skins/amelia.css',
            selected: false
        },
        {
            id: 2,
            name: 'Cerulean',
            src: 'styles/skins/cerulean.css',
            selected: false
        },
        {
            id: 3,
            name: 'Cosmo',
            src: 'styles/skins/cosmo.css',
            selected: false
        },
        {
            id: 4,
            name: 'Cyborg',
            src: 'styles/skins/cyborg.css',
            selected: false
        },
        {
            id: 5,
            name: 'Darkly',
            src: 'styles/skins/darkly.css',
            selected: false
        },
        {
            id: 6,
            name: 'Flatly',
            src: 'styles/skins/flatly.css',
            selected: false
        },
        {
            id: 7,
            name: 'Journal',
            src: 'styles/skins/journal.css',
            selected: false
        },
        {
            id: 8,
            name: 'Lumen',
            src: 'styles/skins/lumen.css',
            selected: false
        },
        {
            id: 9,
            name: 'Readable',
            src: 'styles/skins/readable.css',
            selected: false
        },
        {
            id: 10,
            name: 'Simplex',
            src: 'styles/skins/simplex.css',
            selected: false
        },
        {
            id: 11,
            name: 'Spacelab',
            src: 'styles/skins/spacelab.css',
            selected: false
        },
        {
            id: 12,
            name: 'Superhero',
            src: 'styles/skins/superhero.css',
            selected: false
        },
        {
            id: 13,
            name: 'United',
            src: 'styles/skins/united.css',
            selected: false
        },
        {
            id: 14,
            name: 'Yeti',
            src: 'styles/skins/yeti.css',
            selected: false
        },
        {
            id: 15,
            name: 'Slate',
            src: 'styles/skins/slate.css',
            selected: false
        }
    ];

    var getThemes = function () {
        return themes;
    };

    var apply = function (theme) {
        var selected = theme || themes[0];

        $rootScope.$broadcast(events.siteThemeChanged, selected);
    };

    var getTheme = function (id) {
        return $linq(themes).where("x=>x.id == " + id).singleOrDefault(themes[0]);
    };

    return {
        apply: apply,
        getThemes: getThemes,
        getTheme: getTheme
    };
}]);