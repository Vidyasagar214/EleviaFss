/**
 * Created by steve.tess on 12/19/2016.
 */
Ext.define('TS.view.fwa.Document', {
    extend: 'Ext.Sheet',

    xtype: 'window-document',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    approvalType: null,
    attachmentsList: false,

    itemId: 'documentSheet',

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            reference: 'docTitleBar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Attach Document',

            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSheet'
                }
            ]
        },
        {
            xtype: 'formpanel',
            scrollable: 'y',
            items: [
                {
                    xtype: 'panel',
                    itemId: 'attachFormFrame',
                    items: [
                        {
                            height: 15
                        },
                        {
                            xtype: 'container',
                            padding: '10 0 10 0',
                            items: [
                                {
                                    xtype: 'filefield',
                                    reference: 'fileUploadField',
                                    iconCls: 'x-fa fa-file-text',
                                    accept: '.*', //.doc,.docx,.pdf,.txt,.xls,.xlsx,
                                    buttonText: 'Select',
                                    top: '-0.6em',
                                    right: '1em',
                                    listeners: {
                                        change: 'onFileUploadChange',
                                        scope: 'self.controller'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    reference: 'filePathField',
                                    label: 'Document'
                                },
                                {
                                    xtype: 'textfield',
                                    reference: 'filenameField',
                                    maskRe: /[^!^@^$^%^~^#^&^+^=^.^*^{^}^\\^:^<^>^|^"\^]/,
                                    label: 'Filename',
                                    placeHolder: 'Enter document filename (*required)',
                                    required: true
                                },
                                {
                                    xtype: 'textfield',
                                    reference: 'descriptionField',
                                    maskRe: /[^!^@^$^%^~^#^&^+^=^.^*^{^}^\\^:^<^>^|^"\^]/,
                                    label: 'Description',
                                    placeHolder: 'Enter document description (*required)',
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Attachments',
                    //scrollable: 'y',
                    width: '90%',
                    reference: 'attachmentList'
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'From Template',
                    ui: 'action',
                    align: 'left',
                    iconCls: 'x-fa fa-file-o',
                    handler: 'loadTemplates',
                    reference: 'fromTemplateButton',
                    bind:{
                        hidden:'{IS_CORDOVA_APP}'
                    }
                },
                {
                    text: 'Upload',
                    align: 'right',
                    iconCls: 'x-fa  fa-upload',
                    ui: 'action',
                    handler: 'loadFwaDoc',
                    disabled: true,
                    reference: 'loadDoc',
                    itemId: 'loadDoc'
                }
            ]
        }
    ]
});