/**
 * Created by steve.tess on 7/25/2018.
 */
Ext.define('TS.view.exp.ExpSubmitPin', {
    extend: 'Ext.Sheet',
    xtype: 'exp-submitpin',

    stretchX: true,
    stretchY: true,
    approvalType: null,

    autoDestroy: true, //custom property implemented in the override

    layout: 'vbox',

    items: [
        {
            xtype: 'titlebar',
            reference: 'signatureTitleBar',
            title: 'Expense Report Submit',
            docked: 'top',
            cls: 'ts-navigation-header',

            items: [
                {
                    text: 'Submit',
                    //iconCls: 'x-fa fa-save',
                    align: 'left',
                    action: 'expsign',
                    reference: 'saveSignatureButton',
                    disabled: true,
                    bind: {
                        disabled: '{signature.isClean}'
                    }
                },
                {
                    align: 'right',
                    text: 'Close',
                    handler: function () {
                        this.up('sheet').hide();
                    }
                }
            ]
        },
        {
            xtype: 'textfield',
            margin: 10,
            placeHolder: '*Tap and enter here.',
            style: 'border:1px solid #ccc',
            inputType: 'password',
            // minLength: 4,
            // maxLength: 4,
            label: 'PIN',
            reference: 'expSubmitPinField',
            hidden:true
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