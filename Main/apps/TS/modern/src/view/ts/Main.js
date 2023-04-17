Ext.define('TS.view.ts.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'app-ts',
    fullscreen: true,

    controller: 'ts-main',
    viewModel: 'ts-main',

    header: {
        hidden: true
    },

    items: [
        {
            xtype: 'container',
            layout: 'fit',
            title: 'Main card', //will be invisible as we are hiding the tab bar
            items: [
                {
                    xtype: 'titlebar',
                    cls: 'ts-navigation-header',
                    docked: 'top',
                    title: {_tr: 'tsTitle', tpl: 'Select {0}'},
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa  fa-home',
                            align: 'left',
                            handler: 'onBackToFSS',
                            bind:{
                                hidden: '{!fromFSS}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'ts-list',
                    reference: 'timesheets',
                    bind: {
                        store: '{tsheet}',
                        selection: '{selectedTS}'
                    },
                    style: 'border-bottom:1px solid #ccc',
                    flex: 1,
                    listeners: {
                        itemsingletap: 'editSelectedTimesheet'
                    }
                }
                // ,{
                //     xtype: 'titlebar',
                //     docked: 'bottom',
                //     items: [{
                //         text: 'Open',
                //         ui: 'action',
                //         bind: {
                //             disabled: '{!timesheets.selection}'
                //         },
                //         align: 'right',
                //         iconCls: 'x-fa fa-external-link',
                //         handler: 'editSelectedTimesheet'
                //     }]
                // }
            ]
        },
        {
            xtype: 'ts-timesheet',
            title: {_tr: 'tsTitle'}
        },
        {
            xtype: 'ts-hours',
            title: 'Hours'
        },
        {
            xtype: 'ts-edit-hours',
            title: 'Edit Hours'
        }
    ],
    listeners:{
        painted: 'findCurrentTimesheet'
    }
});
