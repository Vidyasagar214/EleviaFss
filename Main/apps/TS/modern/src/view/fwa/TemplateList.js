/**
 * Created by steve.tess on 2/21/2018.
 */
Ext.define('TS.view.fwa.TemplateList', {
    extend: 'Ext.Sheet',

    xtype: 'window-templates',

    requires: [
        'Ext.grid.Grid',
        'TS.controller.fwa.FWAEditController'
    ],

    controller: 'fwa-edit',
    //viewModel: 'fwa-main',

    stretchX: true,
    stretchY: true,
    autoDestroy: false, //custom property implemented in the override
    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            reference: 'templateTitleBar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Available Templates',
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeTemplateSheet'
                }
            ]
        },
        {
            xtype: 'panel',
            layout: 'vbox',
            items: [
                {
                    xtype: 'grid',
                    reference: 'templateGrid',
                    scrollable: true,
                    mode: 'MULTI',
                    flex: 1,

                    plugins: {
                        type: 'grideditable',
                        triggerEvent: 'doubletap',
                        enableDeleteButton: false,

                        formConfig: {
                            viewModel: {}, //enables bindings across this form
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'filename',
                                    label: 'Filename',
                                    listeners: {
                                        change: function (component, newValue, oldValue) {
                                            var match = newValue.match(/[!^@^$^%^~^#^&^+^=^^*^{^}^\\^:^<^>^|^"]/gi);
                                            if (match)
                                                component.setValue(oldValue);
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'description',
                                    label: 'Description',
                                    listeners: {
                                        change: function (component, newValue, oldValue) {
                                            var match = newValue.match(/[!^@^$^%^~^#^&^+^=^^*^{^}^\\^:^<^>^|^"]/gi);
                                            if (match)
                                                component.setValue(oldValue);
                                        }
                                    }
                                }
                            ]
                        },

                        toolbarConfig: {
                            xtype: 'titlebar',
                            docked: 'top',
                            items: [{
                                xtype: 'button',
                                ui: 'decline',
                                text: 'Cancel',
                                align: 'right',
                                action: 'cancel'
                            }, {
                                xtype: 'button',
                                ui: 'confirm',
                                text: 'Save',
                                align: 'left',
                                action: 'submit'
                            }]
                        }
                    },

                    bind: {
                        //store: '{selectedFWA.availableTemplates}',
                        selection: '{selectedTemplate}'
                    },

                    columns: [
                        {
                            dataIndex: 'templateId',
                            hidden: true
                        },
                        {
                            text: 'Template Name',
                            dataIndex: 'templateName',
                            style: 'white-space: nowrap;',
                            flex: 2
                        },
                        {
                            text: 'Filename',
                            dataIndex: 'filename',
                            editable: true,
                            flex: 1.5
                        },
                        {
                            text: 'Description',
                            dataIndex: 'description',
                            editable: true,
                            flex: 1.5
                        }
                    ],
                    listeners: {
                        selectionchange: 'onSelectionTemplateChange'
                    }
                }
            ]
        },

        {
            xtype: 'titlebar',
            docked: 'bottom',
            title: '*doubletap to edit',
            titleAlign: 'left',
            items: [
                {
                    text: 'Upload',
                    align: 'right',
                    iconCls: 'x-fa  fa-upload',
                    ui: 'action',
                    handler: 'uploadFwaTemplate',
                    disabled: true,
                    reference: 'loadTemplateDoc',
                    itemId: 'loadTemplateDoc'
                }
            ]
        }
    ]

});