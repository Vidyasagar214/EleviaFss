/**
 * Created by steve.tess on 11/16/2015.
 */
Ext.define('TS.view.ts.TsSubmitPin', {
    extend: 'Ext.window.Window',

    controller: 'window-tssubmitpin',
    xtype: 'tssubmitpin',
    title: {_tr: 'tsTitle', tpl: 'Select {0} Submit'},
   
    items: [{
        xtype: 'form',
        reference: 'tsSubmitPinForm',
        bodyPadding: 10,

        items: [{
            xtype: 'numberfield',
            inputType: 'password',
            minLength: 4,
            maxLength: 4,
            fieldLabel: 'PIN',
            labelWidth: 40,
            allowBlank: false,
            reference: 'tsSubmitPinField',
            hidden: true,
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
            text: 'Submit',
            id: 'btnTsSubmitPin',//TODO Remove id!
            handler: 'tsSubmitPinClick',
            formBind: true,
            reference: 'tsSubmitPinBtn',
            disabled: true
        }, {
            text: 'Cancel',
            handler: 'tsSubmitPinCancel',
            reference: 'tsSubmitPinCancelBtn'
        }]

    }]

});
