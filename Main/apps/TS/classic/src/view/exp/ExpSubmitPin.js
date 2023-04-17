/**
 * Created by steve.tess on 7/18/2018.
 */
Ext.define('TS.view.exp.ExpSubmitPin', {
    extend: 'Ext.window.Window',

    xtype: 'expsubmitpin',

    controller: 'expsubmitpin',
    title: 'Submit Expense',

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
            hidden: true,
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
            text: 'Submit',
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