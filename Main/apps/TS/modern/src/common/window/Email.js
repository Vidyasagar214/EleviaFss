Ext.define('TS.common.window.Email', {
    extend: 'Ext.Sheet',

    xtype: 'window-email',

    controller: 'fwa-edit',
    //height: 700,
    stretchX: true,
    stretchY: true,
    scrollable: 'y',

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            items: [
                {
                    text: 'Send',
                    align: 'left',
                    iconCls: 'x-fa fa-envelope-o',
                    handler: 'sendEmail'
                },
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSheet'
                }
            ]
        },
        {
            xtype: 'formpanel',
            //scrollable: true,
            reference: 'emailForm',
            items: [
                {
                    xtype: 'fieldset',
                    items: [
                        {
                            xtype: 'emailfield',
                            name: 'to',
                            label: 'To',
                            allowBlank: false,
                            required: true,
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getScrollable(),
                                        scrollToY = TS.Util.getCurrentScrollToY();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 0);
                                        //window.scrollTo(0, document.body.scrollHeight);
                                }
                            }
                            //window.scrollTo(0, document.body.scrollHeight);
                        },
                        {
                            xtype: 'emailfield',
                            name: 'cc',
                            label: 'CC',
                            reference: 'ccEmailField',
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getScrollable(),
                                        scrollToY = TS.Util.getCurrentScrollToY();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 75);
                                    //window.scrollTo(0, document.body.scrollHeight);
                                }
                            }
                        },
                        {
                            xtype: 'emailfield',
                            name: 'bcc',
                            label: 'BCC',
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getScrollable(),
                                        scrollToY = TS.Util.getCurrentScrollToY();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 130);
                                    //window.scrollTo(0, document.body.scrollHeight);
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'subject',
                            label: 'Subject',
                            allowBlank: false,
                            required: true,
                            listeners:{
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getScrollable(),
                                        scrollToY = TS.Util.getCurrentScrollToY();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 260);
                                }
                            }

                        },
                        {
                            xtype: 'textareafield',
                            name: 'body',
                            label: 'Body',
                            allowBlank: false,
                            required: true,
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getScrollable(),
                                        scrollToY = TS.Util.getCurrentScrollToY();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 390);
                                        //window.scrollTo(0, document.body.scrollHeight);
                                }
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            name: 'attachForm',
                            checked: true,
                            reference: 'attachFormField',
                            value: 'true',
                            labelCls: 'red-checkbox-label',
                            labelWrap: true,
                            labelWidth: '70%',
                            labelAlign: 'right',
                            style: {
                                'background-color': '#f6f6f6'
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Select Attachment(s)',
                            disabled: true
                        },
                        {
                            xtype: 'list',
                            mode: 'multi',
                            itemId: 'attachList',
                            name: 'attachments',
                            store: {
                                model: 'TS.model.shared.Attachment',
                                autoLoad: false,
                                proxy: {
                                    type: 'default',
                                    directFn: 'AttachmentData.GetAttachmentList',
                                    paramOrder: 'dbi|username|modelType|modelId|includeItem|attachmentType'
                                }
                            },
                            itemTpl: new Ext.XTemplate(
                                '<p>{[this.getDocType(values)]} - {[this.getDescription(values)]}</p>',
                                {
                                    getDocType: function (values) {
                                        if (values.attachmentType == 'P') return 'Photo';
                                        else return 'Doc'
                                    },

                                    getDescription: function (values) {
                                        return values.filename == '' ? values.description : values.filename
                                    }
                                }
                            )
                        }
                    ]
                }
            ]
        },

        // {
        //     xtype: 'titlebar',
        //     docked: 'top',
        //     items: [
        //         {
        //             text: 'Send',
        //             align: 'right',
        //             iconCls: 'x-fa fa-envelope-o',
        //             handler: 'sendEmail'
        //         }
        //     ]
        // }
    ]
})
;