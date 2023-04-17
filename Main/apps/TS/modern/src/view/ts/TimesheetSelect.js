Ext.define('TS.view.ts.TimesheetSelect', {
    extend: 'Ext.Sheet',

    xtype: 'ts-select',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'tsTitle', tpl: 'Select {0}'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: function () {
                        this.up('sheet').hide();
                    }
                }
            ]
        },
        {
            xtype: 'ts-list',
            reference: 'tspickerlist',
            bind: {
                store: '{tsheet}',
                selection: '{selectedTSCopy}'
            },
            style: 'border-bottom:1px solid #ccc',
            flex: 1
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    xtype: 'button',
                    text: 'Copy',
                    align: 'right',
                    iconCls: 'x-fa fa-copy',
                    action: 'copy-ts',
                    bind: {
                        disabled: '{!tspickerlist.selection}'
                    }
                }
            ]
        }
    ]

});