Ext.define('TS.view.fwa.MainMenu', {
    extend: 'TS.view.common.Menu',
    xtype: 'fwa-mainmenu',

    requires: [
        'TS.view.main.MainModel'
    ],

    viewModel: 'main',

    width: 260,

    items: [
        {
            text: {_tr: 'fwaAbbrevLabel', tpl: 'New {0}'},
            iconCls: 'x-fa fa-file-o',
            action: 'create-fwa',
            bind:{
                hidden:'{notFwaCreateNew}'
            }
        },
        {
            xtype: 'spacer',
            height: 2
        },
        // {
        //     text: 'Print All',
        //     iconCls: 'x-fa fa-print',
        //     handler: 'onPrintAll'
        // },
        {
            xtype: 'spacer',
            height: 2
        },
        {
            text: 'Map',
            iconCls: 'x-fa fa-map-o',
            handler: 'onGroupMapClick'
        },
        {
            xtype: 'spacer',
            height: 2
        },
        {
            text: {_tr: 'crewChiefLabelWithFwaAbbrevLabel', tpl: '{0}'},
            iconCls: 'x-fa fa-tasks',
            handler: 'onTaskList',
            hidden: true
        },
        {
            xtype: 'spacer',
            height: 2
        },
        {
            text: {_tr: 'crewLabelWithFwaAbbrevLabel', tpl: '{0}'},
            iconCls: 'x-fa fa-tasks',
            handler: 'onCrewList',
            hidden: true
        },
        {
            xtype: 'spacer',
            height: 2
        },
        {
            text: 'Refresh',
            iconCls: 'x-fa fa-refresh',
            handler: 'onRefreshList'
        }
    ]
});