Ext.define('TS.view.fwa.ManageWorkCodes', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-manageworkcodes',

    requires: [
        'Ext.grid.plugin.Editable',
        'Ext.util.Format'
    ],

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'workCodeLabelPlural'},
            items: [
                {
                    iconCls: 'x-fa fa-plus',
                    handler: 'addWorkCodes',
                    reference: 'addWorkCodeButton',
                    itemId: 'addButton'
                },
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSheet'
                }
            ],
            reference: 'topToolbar'
        },
        // {
        //     xtype: 'titlebar',
        //     docked: 'bottom',
        //     items: [{
        //         text: 'Open',
        //         ui: 'action',
        //         hidden: true,
        //         bind: {
        //             disabled: '{!workCodeGrid.selection}'
        //         },
        //         align: 'right',
        //         iconCls: 'x-fa fa-external-link',
        //         handler: 'onWorkCodeSelection'
        //     }]
        // },
        {
            xtype: 'grid',
            reference: 'workCodeGrid',
            itemId: 'workCodeGrid',
            bind: {
                store: '{selectedFWA.workSchedAndPerf}',
                selection: '{selectedWSP}'
            },
            emptyText: {_tr: 'workCodeLabelPlural', tpl: 'Tap plus icon to add {0}'},
            deferEmptyText: false,
            plugins: {

                type: 'grideditable',

                triggerEvent: 'singletap',

                enableDeleteButton: true,

                formConfig: {
                    viewModel: {}, //enables bindings across this form

                    items: [
                        {
                            xtype: 'field-workcode',
                            autoSelect: false,
                            name: 'workCodeCombo',
                            reference: 'workCodeCombo',
                            label: {_tr: 'workCodeLabel'},
                            bind: '{workCodeCombo.selection.workCodeId}'
                        },
                        {
                            //We have to auto-populate this field once the above one changes
                            xtype: 'hiddenfield',
                            name: 'workCodeId',
                            bind: '{workCodeCombo.selection.workCodeId}'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'scheduledHours',
                            label: 'Scheduled',
                            minValue: 0,
                            stepValue: 1,
                            listeners: {
                                change: function (t, n, o) {
                                    if (n < 0) {
                                        t.setValue(0);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'actualHours',
                            itemId: 'wcActualHrs',
                            label: 'Actual',
                            minValue: 0,
                            stepValue: 1
                        },
                        {
                            xtype: 'displayfield',
                            label: 'Description',
                            bind: '{workCodeCombo.selection.workCodeDescr}' //reference#.selection.field
                        },
                        {
                            xtype: 'numberfield',
                            label: '% Complete',
                            itemId: 'wcPercentComplete',
                            name: 'pctComplete',
                            bind: {
                                hidden: '{!settings.fwaDisplayWorkCodePctComplete}'
                            },
                            renderer: Ext.util.Format.numberRenderer('00%')
                        },
                        {
                            xtype: 'textfield',
                            name: 'comments',
                            label: 'Comments',
                            margin: '0 0 15 0',
                            maxLength: 255,
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 125);
                                }
                            }
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'workCodeAbbrev',
                            bind: '{workCodeCombo.selection.workCodeAbbrev}'
                        },
                        {
                            xtype: 'checkboxfield',
                            name: 'picRequired',
                            label: 'Photo Req'
                        },
                        {
                            xtype: 'label',
                            padding: 10,
                            itemId: 'warning'
                        },
                        {
                            xtype: 'button',
                            text: 'Photo',
                            iconCls: 'x-fa fa-camera',
                            handler: 'onAttachPhoto',
                            reference: 'addPhotoWorkCodeButton',
                            itemId: 'addPhotoWorkCodeButton',
                            listeners: {
                                painted: function (el) {
                                    var ct = this.getParent().getRecord().get('attachmentCtPhoto');
                                    if (ct > 0) {
                                        this.setStyle('background:#FF6666; color: white;');
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Doc',
                            iconCls: 'x-fa fa-file-text-o',
                            handler: 'onAttachDoc',
                            reference: 'addDocButton',
                            itemId: 'addDocButton',
                            listeners: {
                                painted: function (el) {
                                    var ct = this.getParent().getRecord().get('attachmentCtDoc');
                                    if (ct > 0) {
                                        this.setStyle('background:#FF6666; color: white;');
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            name: 'dummy',
                            text: '  ',
                            height: 300,
                            listeners: {
                                painted: function (obj) {
                                    if (Ext.os.is.Android && Ext.os.is.Phone) {
                                        obj.hidden = false;
                                    } else {
                                        obj.hidden = true;
                                    }
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
                        action: 'submit',
                        reference: 'submitWorkCodeButton'
                    }]
                }
            },

            columns: [
                {
                    text: {_tr: 'workCodeLabel'},
                    dataIndex: 'workCodeId',
                    flex: 1,
                    renderer: function (value) {
                        var record = Ext.getStore('WorkCodes').getById(value);
                        return (record ? record.get('workCodeAbbrev') : 'N/A');
                    }
                },
                {
                    text: 'Scheduled',
                    dataIndex: 'scheduledHours',
                    flex: 1
                },
                {
                    text: 'Actual',
                    dataIndex: 'actualHours',
                    flex: 1
                }
            ]
        }
    ]
});