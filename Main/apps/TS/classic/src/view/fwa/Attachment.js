Ext.define('TS.view.fwa.Attachment', {
    extend: 'Ext.window.Window',

    xtype: 'window-attachment',

    controller: 'window-attachment',
    resizable: false,
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
        associatedRecordId: null,
        attachmentsList: false,

        title: 'Attachment Type',
        modal: true,
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
                    ]
                }
            ]
        }],
        buttons: [
            {
                text: 'From Template',
                align: 'left',
                handler: 'openTemplateList',
                itemId:  'includeTemplates',
                reference: 'includeTemplates'
            }, '->',
            {
                text: 'Upload',
                reference: 'fileUploadButton',
                itemId:'fileUploadButton',
                handler: 'onFileUpload',
                formBind: true
            }, {
                text: 'Cancel',
                align: 'right',
                itemId: 'cancelAttachment',
                handler: 'onCancelAttachment'
            }
        ]
    },

    listeners:{
        close: 'catchWindowClose'
    }
});