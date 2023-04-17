
Ext.define('TS.common.window.LaborCodeLookup', {
    extend: 'Ext.Sheet',
    xtype: 'ts-laborcodelookup',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'vbox',

    items:[
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'laborCodeLabel', tpl: '{0} Lookup'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    action: 'close'
                }
            ]
        },
        {
            xtype: 'container',
            border: true,
            style: 'border: 1 px solid #000',
            layout: 'hbox',
            width: '100%',
            margin: 10,
            defaults: {
                xtype: 'textfield',
                flex: 1,
                readOnly: true
            },

            items: [{
                label: {_tr: 'laborCodeLabel'},
                bind: {
                    value: '{laborCodeString}'
                },
                margin: '0 10 0 0'
            }, {
                bind: {
                    value: '{laborLabelString}'
                }
            }]
        },
        {
            xtype: 'container',
            border: true,
            style: 'border: 1px solid #000',
            reference: 'ts-laborCodeGridsContainer',
            itemId: 'ts-laborCodeGridsContainer',
            flex: 1,
            margin: '0 0 10 10',
            layout: 'hbox',
            width: '100%'
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Select',
                    iconCls: 'x-fa fa-check-square-o',
                    align: 'right',
                    action: 'select-laborcode'
                }
            ]
        }
    ]

});