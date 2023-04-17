Ext.define('TS.view.fwa.Photo', {
    extend: 'Ext.Sheet',

    xtype: 'window-photo',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    approvalType: null,
    attachmentsList: false,
    scrollable: 'y',
    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            reference: 'photoTitleBar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Attach Photo',

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
                            padding: '10 10 10 0',
                            items: [
                                {
                                    xtype: 'filefield',
                                    accept: 'image/*',
                                    centered: true,
                                    reference: 'fileUploadField',
                                    iconCls: 'x-fa fa-camera',
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
                                    xtype: 'textfield',
                                    reference: 'filePathField',
                                    label: 'Filename'
                                },
                                {
                                    xtype: 'textfield',
                                    reference: 'filenameField',
                                    maskRe: /[^!^@^$^%^~^#^&^+^=^.^*^{^}^\\^:^<^>^|^"\^]/,
                                    label: 'File Name',
                                    placeHolder: 'Enter document filename (*required)',
                                    required: true,
                                    clearIcon: true
                                },
                                {
                                    xtype: 'textfield',
                                    reference: 'descriptionField',
                                    maskRe: /[^!^@^$^%^~^#^&^+^=^.^*^{^}^\\^:^<^>^|^"\^]/,
                                    label: 'Description',
                                    placeHolder: 'Enter document description (*required)',
                                    required: true,
                                    clearIcon: true
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Preview',
                            scrollable: 'y',
                            style: 'padding:10 10 10 0;',
                            width: '95%',
                            items: [{
                                xtype: 'image',
                                src: '',
                                mode: 'image',
                                reference: 'imagePreview',
                                width: 300,
                                style: 'padding:10 10 10 0;',
                                hidden: true
                            }]
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
                    text: 'Upload',
                    align: 'right',
                    iconCls: 'x-fa  fa-upload',
                    ui: 'action',
                    handler: 'loadFwaPhoto',
                    disabled: true,
                    reference: 'loadDoc',
                    itemId: 'loadDoc'
                }
            ]
        }
    ]
});