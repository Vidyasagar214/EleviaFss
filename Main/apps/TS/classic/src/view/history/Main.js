/**
 * Created by steve.tess on 2/21/2017.
 */
Ext.define('TS.view.history.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'ts-history',

    requires: [
        'TS.controller.history.MainController',
        'TS.model.history.MainModel',
        'TS.view.history.FwaHistory',
        'TS.view.history.Header'
    ],

    controller: 'history-main',
    viewModel: 'history-main',

    layout: 'border',

    items:[
        {
            xtype: 'header-history',
            region: 'north'
        },
        {
            xtype: 'fwahistory',
            region: 'center',
            reference: 'fwaHistory'
        }
    ]
});