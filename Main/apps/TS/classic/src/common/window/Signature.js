Ext.define('TS.common.window.Signature', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.draw.plugin.SpriteEvents'
    ],

    xtype: 'window-signature',

    controller: 'window-signature',

    //TODO: this belongs to viewModel
    config: {
        associatedRecordId: null
    },

    title: 'Signature',
    plugins: {
        ptype: 'responsive'
    },
    scrollable: 'y',
    responsiveConfig: {
        normal: {
            width: 700,
            height: 300
        },
        small: {
            width: 350,
            height: 300
        }
    },

    //layout: 'fit',
    bodyPadding: 0,

    items: [
        {
            xtype: 'form',
            reference: 'fwaApprovalForm',
            bodyPadding: 10,

            items:[
                {
                    xtype: 'displayfield',
                    padding: '0 0 0 10',
                    reference: 'approvalText'
                },
                {
                    xtype: 'draw',
                    plugins: ['spriteevents'],
                    reference: 'sigDrawPanel',
                    height: 130,
                    width: '90%',
                    style: {
                        borderColor: 'black',
                        borderStyle: 'solid',
                        borderWidth: 'thin'
                    },
                    listeners: {
                        mousedown: 'onSignatureDown',
                        mouseup: 'onSignatureUp',
                        mousemove: 'onSignatureMove',
                        element: 'element'
                    }
                }
            ]
        }
    ],

    buttons: [
        {
            text: 'Clear',
            handler: 'doClearSignature'
        },
        {
            text: 'Select',
            handler: 'doSaveSignature',
            reference: 'saveSignatureButton',
            disabled: true
        },
        {
            text: 'Cancel',
            handler: 'doCloseSignature'
        },
        '->',
        {
            xtype: 'checkbox',
            name: 'sendEmail',
            boxLabel: 'Send Email',
            boxLabelAlign: 'after',
            reference: 'checkEmailField',
            style: 'padding-top: 10px;'
        },
        '->',
        {
            fieldLabel: 'Email',
            labelAlign: 'top',
            xtype: 'textfield',
            name: 'emailAddress',
            vtype: 'email',
            reference: 'emailAddressField',
            width: '190px'
        }
    ]
});
