Ext.define('TS.view.fwa.AddressText', {
    extend: 'Ext.Sheet',
    xtype: 'address_text',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    modal: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items:[
        {
            xtype: 'panel',
            layout: 'fit',
            items:[
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: 'ts-navigation-header',
                    reference: 'addressTitle',
                },
                {
                    xtype: 'textfield',
                    itemId: 'addressEditValue',
                    style: 'border: 1px solid blue;',
                    placeHolder: '*Tap here and enter.',
                    width: '100%',
                    height: '50',
                    maxRows: 2,
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