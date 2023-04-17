Ext.define('TS.common.window.Signature', {
    extend: 'Ext.Sheet',

    xtype: 'window-signature',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    approvalType: null,

    autoDestroy: true, //custom property implemented in the override
    //scrollable: true,
    layout: 'vbox',

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
                    handler: 'closeSignatureSheet'
                }
            ]
        },
        {
            xtype: 'panel',
            scrollable: false,
            layout: {
                type: 'vbox',
                //pack: 'center'
            },
            items: [
                {
                    xtype: 'fieldset',
                    //scrollable: false,
                    flex: 1,
                    itemId: 'signatureWindow',
                    items: [
                        {
                            xtype: 'ts-draw',
                            reference: 'signature',
                            itemId: 'signatureDraw',
                            height: '100%',
                            width: '100%'
                        }
                    ],
                    listeners: {
                        painted: function (obj) {
                            var deviceOrientation = Ext.Viewport.getOrientation(),
                                imgHeight = deviceOrientation == 'portrait' ? 200 : 150;
                            Ext.first("#signatureWindow").setHeight(imgHeight);

                            Ext.Viewport.on('orientationchange', function (viewport, orientation, width, height) {
                                var mySignature = Ext.first("#signatureWindow");
                                if (mySignature) {
                                    if (orientation == 'portrait') {
                                        mySignature.setHeight(200);
                                    } else {
                                        mySignature.setHeight(150);
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        }, {
            xtype: 'panel',
            scrollable: false,
            padding: '0 15 15 15',
            items: [
                {
                    xtype: 'checkboxfield',
                    name: 'sendEmail',
                    label: 'Send Email',
                    reference: 'sendEmailField',
                    style: 'border: 1px solid grey;',
                    labelWidth: '35%'
                },
                {
                    xtype: 'emailfield',
                    label: 'Email Address',
                    name: 'emailAddress',
                    reference: 'emailAddressField',
                    style: 'border: 1px solid grey;',
                    labelWidth: '35%'
                }
            ]
        },
        {
            xtype: 'fieldset',
            items:[
                {
                    xtype: 'button',
                    handler: 'getFwaInfoForSignature',
                    text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Info'}
                }
            ]
            // xtype: 'panel',
            // scrollable: true,
            // padding: '0 15 15 15',
            // minHeight: 500,
            // defaults: {
            //     xtype: 'displayfield',
            //     labelWidth: '35%'
            // },
            // items: [
            //     {
            //         reference: 'fwaInfoField'
            //     },
            //     {
            //         reference: 'workCodeField',
            //         bind: {
            //             hidden: '{settings.fwaHideWorkCodes}'
            //         }
            //     },
            //     {
            //         reference: 'empHoursField'
            //     }
            // ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Save',
                    iconCls: 'x-fa fa-save',
                    action: 'save',
                    reference: 'saveSignatureButton',
                    disabled: true,
                    bind: {
                        disabled: '{signature.isClean}'
                    },
                    handler: 'doSaveSignature'
                },
                {
                    text: 'Clear',
                    align: 'right',
                    iconCls: 'x-fa  fa-pencil-square-o',
                    ui: 'action',
                    handler: function (bt) {
                        Ext.first('#signatureDraw').clear();
                        //bt.up('sheet').down('ts-draw').clear();
                    }
                }
            ]
        }
    ],

    listeners: {
        painted: 'onSignatureWindowOpen'
    }
});
