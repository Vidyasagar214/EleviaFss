/**
 * Created by steve.tess on 2/21/2018.
 */
Ext.define('TS.view.fwa.TemplateList', {
    extend: 'Ext.window.Window',

    xtype: 'templatelist',

    requires: [
        'TS.controller.TemplateListController',
        'TS.model.shared.PrintTemplate'
    ],

    controller: 'templatelist',
    width: 750,

    minHeight: 250,
    maxHeight: 500,
    scrollable: true,
    title: 'Templates',

    items: [
        {
            xtype: 'panel',
            items: [
                {
                    xtype: 'grid',
                    reference: 'templateListGrid',
                    emptyText: 'No templates available',
                    plugins: [
                        {ptype: 'cellediting', clicksToEdit: 1}
                    ],
                    store: {
                        model: 'TS.model.shared.PrintTemplate',
                        loader: {url: false},
                        proxy: {
                            type: 'default',
                            directFn: 'Document.GetTemplateList',
                            paramOrder: 'dbi|username|modelType|modelId'
                        }
                    },
                    columns: [
                        {
                            xtype: 'checkcolumn',
                            text: 'Select',
                            name: 'selectTemplate',
                            dataIndex: 'select',
                            flex: 1,
                            listeners: {
                                checkchange: 'onTemplateCheckChange'
                            }
                        },
                        {
                            dataIndex: 'templateId',
                            hidden: true
                        },
                        {
                            text: 'Template Name',
                            flex: 2,
                            dataIndex: 'templateName'
                        },
                        {
                            text: 'Filename',
                            dataIndex: 'filename',
                            editor: {
                                xtype: 'textfield',
                                maskRe: /[^!^@^$^%^~^#^&^+^=^.^*^{^}^\\^:^<^>^|^"\^]/
                            },
                            flex: 6
                        },
                        {
                            dataIndex: 'templateApp',
                            hidden: true
                        },
                        {
                            dataIndex: 'templateType',
                            hidden: true
                        },
                        {
                            text: 'Description',
                            editor: {
                                xtype: 'textfield',
                                maskRe: /[^!^@^$^%^~^#^&^+^=^.^*^{^}^\\^:^<^>^|^"\^]/
                            },
                            dataIndex: 'description',
                            flex: 4
                        }
                    ]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Attach',
            handler: 'attachTemplate',
            reference: 'attachTemplateBtn',
            disabled: true
        },
        {
            text: 'Cancel',
            align: 'right',
            handler: 'closeTemplate'
        }
    ]
});