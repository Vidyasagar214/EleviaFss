Ext.define('TS.common.fieldset.Approval', {
    extend: 'Ext.form.FieldSet',

    xtype: 'fieldset-approval',

    requires: [
        'Ext.form.FieldContainer'
    ],

    controller: 'fieldset-approval',

    title: 'Approval',

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            layout: {
                type: 'box',
                align: 'stretch',
                vertical: true
            }
        },
        normal: {
            layout: {
                type: 'box',
                align: 'stretch',
                vertical: false,
                maxHeight: 100
            }
        }
    },

    attachmentId: null,

    items: [
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add Signature',
                            iconCls: 'x-fa fa-edit',
                            reference: 'addSignatureButton',
                            handler: 'showSignatureWindow'
                        }, {
                            xtype: 'fixedspacer'
                        }, {
                            xtype: 'fixedspacer'
                        }, {
                            xtype: 'textfield',
                            reference: 'signatureDateField',
                            fieldLabel: 'Signature Date',
                            // maxHeight: 25,
                            maxWidth: 275,
                            labelAlign: 'left',
                            readOnly: true,
                            excludeForm: true
                        }, {
                            xtype: 'tbspacer',
                            width: 200
                        },
                        {
                            xtype: 'button',
                            itemId: 'viewAllSignaturesButton',
                            reference: 'viewAllSignaturesButton',
                            hidden: true,
                            iconCls: 'x-fa fa-list-alt',
                            text: 'All Signatures',
                            handler: 'viewAllSignatures'
                        }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'image',
                            reference: 'signatureImage',
                            hidden: true,
                            height: 50,
                            width: 300,
                            //maxWidth: 175,
                            listeners: {
                                render: 'onSignatureImageRender',
                                scope: 'self.controller'
                            }
                        }, {
                            xtype: 'fixedspacer'
                        }, {
                            xtype: 'button',
                            reference: 'deleteSignatureButton',
                            //TODO Fix using iconCls
                            iconCls: 'x-fa fa-trash redIcon',
                            style: 'background: white;]',
                            defaultAlign: 'tr-tr',
                            cls: 'del-sig-btn',
                            constrain: true,
                            floating: true,
                            hidden: true,
                            handler: 'deleteApproval',
                            tooltip: 'Delete Signature'
                        }
                    ]
                }
            ]
        }
    ]
});
