/**
 * Created by steve.tess on 8/20/2018.
 */
Ext.define('TS.view.exa.ExpApprovalSubmitPin', {
    extend: 'Ext.window.Window',

    xtype: 'exaapprovalsubmitpin',

    controller: 'exasubmitpin',
    title: 'Approve/Reject Expense',

    items: [{
        xtype: 'form',
        reference: 'expSubmitPinForm',
        bodyPadding: 10,

        items: [{
            xtype: 'numberfield',
            inputType: 'password',
            minLength: 4,
            maxLength: 4,
            fieldLabel: 'PIN',
            labelWidth: 40,
            allowBlank: false,
            reference: 'expSubmitPinField',
            hidden:true,
            listeners: {
                //@TODO Sencha
                afterrender: function (field) {
                    Ext.defer(function () {
                        field.focus(true, 100);
                    }, 1);
                }
            }
        }, {
            xtype: 'displayfield',
            fieldLabel: 'Signature'
        }, {
            xtype: 'draw',
            plugins: ['spriteevents'],
            name: 'signature',
            reference: 'sigDrawPanel',
            height: 100,
            width: 450,
            allowBlank: false,
            style: {
                borderColor: 'black',
                borderStyle: 'solid',
                borderWidth: 'thin'
            },
            listeners: {
                mousedown: 'onMouseDown',
                mouseup: 'onMouseUp',
                mousemove: 'onMouseMove',
                element: 'element'
            }
        }],

        buttons: [{
            text: 'Clear',
            handler: 'doClearSignature'
        }, '->', {
            text: 'Approve',
            id: 'btnExpSubmitPin',
            handler: 'expSubmitPinClick',
            formBind: true,
            reference: 'expSubmitPinBtn',
            disabled: true
        }, {
            text: 'Cancel',
            handler: 'expSubmitPinCancel',
            reference: 'expSubmitPinCancelBtn'
        }]

    }]
});