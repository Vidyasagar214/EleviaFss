Ext.define('TS.common.window.Print', {
    extend: 'Ext.Sheet',

    xtype: 'window-print',
    controller: 'print',

    requires: [
        'TS.common.field.Template'
    ],

    layout: 'fit',

    items: [{
        xtype: 'formpanel',
        layout: 'fit',
        bodyPadding: 10,
        items: [
            {
                xtype: 'titlebar',
                reference: 'signatureTitleBar',
                docked: 'top',
                cls: 'ts-navigation-header',

                items: [
                    {
                        align: 'right',
                        text: 'Close',
                        handler: 'closeSheet'
                    }
                ]
            },
            {
                xtype: 'field-template',
                label: 'Template',
                anchor: '100%',
                placeHolder: 'Select Template',
                reference: 'templateSelect'
            },
            {
                xtype: 'checkboxfield',
                name : 'singleFile',
                label: 'Single file results',
                labelWidth:'50%',
                checked: true,
                itemId: 'singleFile',
                reference: 'singleFile',
                hidden: true
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        text: 'Print',
                        align: 'right',
                        iconCls: 'x-fa  fa-print',
                        ui: 'action',
                        handler: 'print'
                    }
                ]
            }
        ]
    }]

});