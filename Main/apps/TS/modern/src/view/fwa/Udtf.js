/**
 * Created by steve.tess on 10/12/2017.
 */
Ext.define('TS.view.fwa.Udtf', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-udtf',

    requires: [
        'Ext.field.TextArea'
    ],

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
            layout: 'fit',
            items:[
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: 'ts-navigation-header',
                    reference: 'udfTitle',
                },
                {
                    xtype: 'textareafield',
                    style: 'border: 1px solid blue;',
                    placeHolder: '*Tap here and enter. Max length 255',
                    width: '100%',
                    clearable: true,
                    bind:{
                        value: '{selectedFWA.udfText}'
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
                            handler: 'onUdfSave'
                        },
                        {
                            text: 'Cancel',
                            align: 'right',
                            iconCls: 'x-fa  fa-times-circle-o',
                            ui: 'decline',
                            handler: 'closeUdfSheet'
                        }
                    ]
                }
            ]
        }
    ]
});