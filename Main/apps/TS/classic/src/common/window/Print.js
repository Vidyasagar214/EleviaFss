Ext.define('TS.common.window.Print', {
    extend: 'Ext.Window',

    xtype: 'window-print',

    width: 300,
    height: 175,
    title: {_tr: 'printTitle'},
    layout: 'fit',
    modal: true,

    controller: 'window-print',

    items: [{
        xtype: 'form',
        bodyPadding: 10,
        layout: 'anchor',
        items: [{
            xtype: 'field-template',
            padding: '10 0 10 0',
            fieldLabel: 'Print Template',
            anchor: '100%',
            placeHolder: 'Select Template',
            reference: 'templateSelect',
            listeners: {
                select: function (me, rec) {
                    Ext.first('#printButton').setDisabled(false);
                }
            }
        }, {
            xtype: 'checkboxfield',
            boxLabel: 'Single file results',
            id: 'singleFile',
            reference: 'singleFile',
            checked: true,
            hidden: true
        }],
        buttons: [
            {
                text: 'Print',
                handler: 'print',
                disabled: true,
                itemId: 'printButton'
            }, {
                text: 'Cancel',
                handler: 'onClosePrint'
            }
        ]
    }]
});
