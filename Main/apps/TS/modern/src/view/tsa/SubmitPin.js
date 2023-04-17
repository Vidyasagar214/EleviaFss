/**
 * Created by steve.tess on 8/24/2018.
 */
Ext.define('TS.view.tsa.SubmitPin', {
    extend: 'Ext.Sheet',
    xtype: 'tsa-submitpin',

    stretchX: true,
    stretchY: true,
    approvalType: null,

    autoDestroy: true, //custom property implemented in the override

    layout: 'vbox',

    items: [
        {
            xtype: 'titlebar',
            reference: 'signatureTitleBar',
            itemId: 'signatureTitleBar',
            title: {_tr: 'tsTitle', tpl: '{0} Submit'},
            docked: 'top',
            cls: 'ts-navigation-header',

            items: [
                {
                    text: 'Submit',
                    align: 'left',
                    //iconCls: 'x-fa fa-save',
                    action: 'tsa-sign',
                    reference: 'saveSignatureButton',
                    disabled: true,
                    bind: {
                        disabled: '{signature.isClean}'
                    }
                },
                {
                    align: 'right',
                    text: 'Close',
                    //action: 'close',
                    handler: function () {
                        this.up('sheet').hide();
                    }
                }
            ]
        },
        {
            xtype: 'textfield',
            placeHolder: '*Tap here and enter.',
            margin: 10,
            style: 'border:1px solid #ccc',
            inputType: 'password',
            minLength: 4,
            maxLength: 4,
            label: 'PIN',
            labelWidth: '15%',
            reference: 'tsSubmitPinField',
            hidden: true
        },
        {
            xtype: 'component',
            margin: '0 10 10 10',
            html: 'Signature'
        },
        {
            xtype: 'ts-draw',
            flex: 1,
            margin: '0 10 10 10',
            style: 'border:1px solid #ccc;',
            reference: 'signature'
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Clear',
                    align: 'right',
                    iconCls: 'x-fa  fa-pencil-square-o',
                    ui: 'action',
                    handler: function (bt) {
                        bt.up('sheet').down('ts-draw').clear();
                    }
                }
            ]
        }
    ]
});