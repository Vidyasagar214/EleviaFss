Ext.define('TS.view.ts.EditMenu', {
    extend: 'TS.view.common.Menu',

    xtype: 'ts-editmenu',

    items: [
        {
            text: 'Copy',
            xtype: 'button',
            iconCls: 'x-fa fa-copy',
            handler: 'onTSCopy',
            bind: {
                hidden: '{tsDisabled}'
            }
        },
        {
            xtype: 'spacer',
            height: 10
        },
        {
            text: 'Email',
            iconCls: 'x-fa fa-envelope-o',
            handler: 'onEmail'
        },
        {
            xtype: 'spacer',
            height: 10
        },
        // {
        //     text: 'Print',
        //     xtype: 'button',
        //     iconCls: 'x-fa fa-print',
        //     handler: 'onPrint'
        // }
    ]
});