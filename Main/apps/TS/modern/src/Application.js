//Modern toolkit application differences
Ext.define('TS.Application', {
    extend: 'TS.BaseApplication',

    requires: [
        'Ext.data.identifier.Uuid',
        'TS.service.SynchronousCachedDirect'
        //'Ccg.ux.*' //Not used
    ],

    controllers: [
        // The load order of controllers matters for event handling in init methods
        'Error',
        'Direct',
        'Messenger',
        'User',
        'Settings',
        'Modern'
    ],

    // Global "static" stores only
    // None of these stores can require full authentication and autoLoad, as these will initialize before user auth
    // stores: [
    //     'Settings'
    // ],

    //Define Main entry points for all modules
    views: [
        'TS.view.crew.Main',
        'TS.view.fwa.Main',
        'TS.view.ts.Main',
        'TS.view.tsa.Main',
        'TS.view.fss.Main',
        'TS.view.exp.Main',
        'TS.view.exa.Main'
    ]

});