Ext.define('TS.view.fwa.AddressNumeric', {
    extend: 'Ext.Sheet',
    xtype: 'address_numeric',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    modal: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items:[
        {
            xtype: 'panel',
            //scrollable: true,
            height: '95%',
            layout: 'fit',
            items:[
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: 'ts-navigation-header',
                    reference: 'addressTitle',
                },
                {
                    xtype: 'numberfield',
                    itemId: 'addressEditValue',
                    minValue: -180,
                    maxValue: 180,
                    height: '50',
                    maxRows: 1,
                    style: 'border: 1px solid blue;',
                    placeHolder: '*Tap here and enter.',
                    width: '100%',
                    clearable: true,
                    bind:{
                        value: '{selectedFWA.addressText}'
                    }
                },
                {
                    xtype: 'titlebar',
                    itemId: 'toolbarButtons',
                    docked: 'bottom',
                    items: [
                        {
                            text: 'Update',
                            iconCls: 'x-fa fa-save',
                            ui: 'action',
                            align: 'left',
                            handler: 'onAddressSave'
                        },
                        {
                            text: 'Cancel',
                            align: 'right',
                            iconCls: 'x-fa  fa-times-circle-o',
                            ui: 'decline',
                            handler: 'closeAddressSheet'
                        }
                    ]
                }
            ]
        }
    ]
});