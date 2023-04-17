Ext.define('TS.common.window.Email', {
    extend: 'Ext.window.Window',

    xtype: 'window-email',

    appType: null,
    modelId: null,

    controller: 'window-email',

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 300
        },
        normal: {
            width: 600
        }
    },

    maxHeight: 500,
    scrollable: true,
    title: 'Email',

    items: [
        {
            xtype: 'form',
            reference: 'emailForm',

            bodyPadding: 10,

            layout: {
                type: 'vbox'
            },

            defaults: {
                xtype: 'textfield',
                labelWidth: 60,
                width: '100%',
                allowBlank: true
            },

            items: [
                {
                    name: 'to',
                    fieldLabel: 'To',
                    vtype: 'email',
                    allowBlank: false
                }, {
                    name: 'cc',
                    fieldLabel: 'CC',
                    reference: 'ccEmailField',
                    vtype: 'email'
                }, {
                    name: 'bcc',
                    fieldLabel: 'BCC',
                    vtype: 'email'
                }, {
                    name: 'subject',
                    fieldLabel: 'Subject',
                    allowBlank: false
                }, {
                    xtype: 'textareafield',
                    //grow: true,
                    name: 'body',
                    fieldLabel: 'Body',
                    allowBlank: true
                }, {
                    name: 'app',
                    hidden: true
                }, {
                    name: 'empId',
                    hidden: true
                }, {
                    xtype: 'checkboxfield',
                    name: 'attachFwa',
                    inputValue: '1',
                    uncheckedValue: '0',
                    checked: true,
                    reference: 'emailInfoText',
                    style: {
                        color: 'salmon'
                    },
                    margin: "10 0 0 10"
                }
            ]
        },
        {
            name: 'attachments',
            itemId: 'emailAttachmentGrid',
            xtype: 'grid',
            store: {
                model: 'TS.model.shared.Attachment',
                autoLoad: false,
                proxy: {
                    type: 'default',
                    directFn: 'AttachmentData.GetAttachmentList',
                    paramOrder: 'dbi|username|modelType|modelId|includeItem|attachmentType'
                }
            },
            hidden: true,
            reference: 'emailAttachmentGrid',
            title: 'Attachment List',
            columns: [
                {
                    xtype: 'checkcolumn',
                    text: 'Select',
                    name: 'selectAttach',
                    dataIndex: 'select',
                    flex: 1
                },
                {
                    text: 'Type',
                    dataIndex: 'attachmentType',
                    renderer: function (value, metaData, record) {
                        return (value === 'P' ? 'Photo' : 'Doc');
                    },
                    flex: 1
                },
                {
                    text: 'Filename',
                    dataIndex: 'filename',
                    flex: 3
                },
                {
                    text: 'Description',
                    dataIndex: 'description',
                    flex: 3
                }

            ]
        }
    ],

    buttons: [
        {
            text: 'Send',
            handler: 'sendEmail',
            formBind: true
        },
        {
            text: 'Cancel',
            align: 'right',
            handler: 'closeEmail'
        }
    ]

});