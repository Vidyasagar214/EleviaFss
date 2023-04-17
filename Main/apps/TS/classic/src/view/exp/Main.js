/**
 * Created by steve.tess on 7/10/2018.
 */
Ext.define('TS.view.exp.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'ts-exp',

    requires: [
        'TS.controller.exp.MainController',
        'TS.model.exp.MainModel',
        'TS.view.exp.ExpList'
    ],

    controller: 'exp-main',
    viewModel: 'expense',

    items: [
        {
            xtype: 'header-exp'
        },
        {
            xtype: 'panel',
            region: 'center',
            layout: 'fit',
            items: [{

            },{
                xtype: 'explist',
                region: 'center',
                reference: 'expListGrid'
            }],

            dockedItems: [{
                xtype: 'toolbar-expenses',
                dock: 'top'
            }]
        }
    ]
});