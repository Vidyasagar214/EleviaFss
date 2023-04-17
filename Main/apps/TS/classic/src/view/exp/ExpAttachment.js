/**
 * Created by steve.tess on 7/14/2018.
 */
Ext.define('TS.view.exp.ExpAttachment', {
    extend: 'Ext.window.Window',

    xtype: 'window-expenseattachment',

    controller: 'expattachment',

    record: null,
    config: {

        plugins: {
            ptype: 'responsive'
        },
        responsiveConfig: {
            normal: {
                width: 450
            },
            small: {
                width: 275
            }
        },

        //TODO: move to ViewModel
        attType: null,
        location: null,
        record: null,
        associatedRecordId: null,
        attachmentsList: false,

        title: 'Attachment Type',
        layout: 'fit',

        items: [{
            xtype: 'panel',
            scrollable: true,
            items: [
                {
                    xtype: 'form',
                    //layout: 'vbox',
                    bodyPadding: 10,
                    reference: 'attachmentForm',
                    items: [
                        {
                            xtype: 'fieldset',
                            itemId: 'attachFormFrame',
                            items: [
                                {
                                    xtype: 'filefield',
                                    padding: '5 0 0 0',
                                    reference: 'fileUploadField',
                                    allowBlank: false,
                                    anchor: '100%',
                                    buttonText: 'Select',
                                    listeners: {
                                        change: 'onFileUploadChange',
                                        scope: 'self.controller'
                                    },
                                    flex: 1
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            padding: '5 0 0 5',
                            width: '95%',
                            items: [
                                {
                                    xtype: 'textfield',
                                    reference: 'fileNameField',
                                    fieldLabel: 'Filename',
                                    maskRe: /[^!^@^$^%^~^#^&^+^=^.^*^{^}^\\^/^:^<^>^|^"\^]/,
                                    width: '95%'
                                },
                                {
                                    xtype: 'textfield',
                                    reference: 'descfield',
                                    fieldLabel: 'Description',
                                    maskRe: /[^!^@^$^%^~^#^&^+^=^.^*^{^}^\\^/^:^<^>^|^"\^]/,
                                    width: '95%'
                                }
                            ]
                        }
                    ],

                    buttons: [
                        '->',
                        {
                            text: 'Upload',
                            reference: 'fileUploadButton',
                            handler: 'onFileUpload',
                            formBind: true
                        }, {
                            text: 'Cancel',
                            align: 'right',
                            handler: 'onCancelAttachment'
                        }
                    ]
                }
            ]
        }]
    }
});