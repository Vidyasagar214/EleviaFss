Ext.define('TS.view.fwa.UdtfCombo', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-udtf-combo',

    requires: [
        'Ext.field.TextArea'
    ],

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items:[
        {
            xtype: 'panel',
            //scrollable: true,
            layout: 'fit',
            items:[
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: 'ts-navigation-header',
                    reference: 'udfTitle',
                    title: {_tr: 'udf_t1_Label'},
                    items: [
                        {
                            text: 'Update',
                            //iconCls: 'x-fa fa-save',
                            align: 'left',
                            handler: 'onUdfComboSave'
                        },
                        {
                            align: 'right',
                            text: 'Close',
                            handler: 'closeUdfSheet'
                        }
                    ]
                },
                {
                    xtype: 'textareafield',
                    placeHolder: '*Tap here and enter.',
                    width: '100%',
                    height: '50%',
                    maxLength: 255,
                    bind:{
                        value: '{selectedFWA.udfText}'
                    }
                },
                {
                    xtype: 'titlebar',
                    docked: 'bottom',
                    items: [
                        {
                            text: 'Cancel',
                            align: 'right',
                            iconCls: 'x-fa  fa-times-circle-o',
                            ui: 'action',
                            handler: 'closeUdfSheet'
                        }
                    ]
                }
            ]
        }
    ]
});