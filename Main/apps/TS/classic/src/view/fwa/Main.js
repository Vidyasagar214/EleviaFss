Ext.define('TS.view.fwa.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'ts-fwa',

    requires: [
        'Ext.layout.container.Fit',
        'TS.controller.fwa.MainController',
        'TS.model.fwa.MainModel',
        'TS.view.fwa.FwaPanel'
    ],

    controller: 'fwa',
    viewModel: 'fwa',
    //scrollable: true,
    layout: 'border',
    //width: '100%',
    style: 'background: #21639c !important;',

    items: [
        {
            xtype: 'header-fwa',
            docked: true,
            region: 'north'
        },
        {
            xtype: 'fwalist',
            resizable: false,
            height: '95%',
            //width: '100%',
            reference: 'fwaGrid',
            itemId: 'fwaGrid',
            region: 'center',
            isScheduler: false,
            expandToolText: '',
            collapseToolText: '',
            collapsible: false,
            collapsed: false,
            collapseMode: 'mini',
            hidden: false,
            split: false
        },
        {
            xtype: 'form-fwa',
            width: '100%',
            resizable: false,
            isScheduler: false,
            expandToolText: '',
            collapseToolText: '',
            collapsible: false,
            collapsed: true,
            region: 'south',
            collapseMode: 'mini',
            minWidth: window.screen.width,
            height: '95%',
            reference: 'fwaForm',
            hidden: true,
            split: false
        }
    ]
});

