Ext.define('TS.view.fwa.FwaInfo', {

    extend: 'Ext.form.FieldSet',

    xtype: 'fieldset-fwainfo',

    title: 'General Information',

    layout: {
        type: 'anchor'
    },

    defaults: {
        xtype: 'fieldcontainer',
        plugins: {
            ptype: 'responsive'
        },
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
                    vertical: false
                }
            }
        }
    },
    items: [
        {
            items: [
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    defaults: {
                        labelWidth: 150,
                        labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;'
                        //height: 25,
                    },
                    items: [
                        {
                            fieldLabel: {_tr: 'wbs1Label', tpl: '{0} #'},
                            xtype: 'field-wbs1',
                            itemId: 'fwawbs1id',
                            reference: 'fwawbs1id',
                            nameField: 'fwawbs1name',
                            typeAhead: true,
                            minChars: 2,
                            app: 'FWA',
                            name: 'wbs1',
                            flex: 1,
                            // labelWidth: 150,
                            // labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                            // height: 25,
                            bind: {
                                readOnly: '{wbsLocked}'
                            },
                            // enableKeyEvents: true,
                            listeners: {
                                change: 'onWbs1ComboChange'
                            },
                            queryParam: 'filter'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-search',
                            app: 'FWA',
                            width: 24,
                            handler: 'showProjectLookupWindow',
                            bind: {
                                disabled: '{wbsLocked}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    fieldLabel: {_tr: 'wbs2Label', tpl: '{0} #'},
                    xtype: 'field-wbs2',
                    itemId: 'fwawbs2id',
                    reference: 'fwawbs2id',
                    nameField: 'fwawbs2name',
                    typeAhead: true,
                    minChars: 2,
                    app: 'FWA',
                    name: 'wbs2',
                    flex: 1,
                    labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                    // height: 25,
                    bind: {
                        hidden: '{hideFwaWbs2}',
                        readOnly: '{wbsLocked}'
                    },
                    listeners: {
                        change: 'onWbs2ComboChange'
                    },
                    queryParam: 'filter'
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    fieldLabel: {_tr: 'wbs3Label', tpl: '{0} #'},
                    xtype: 'field-wbs3',
                    itemId: 'fwawbs3id',
                    reference: 'fwawbs3id',
                    nameField: 'fwawbs3name',
                    minChars: 2,
                    app: 'FWA',
                    name: 'wbs3',
                    flex: 1,
                    labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                    // height: 25,
                    bind: {
                        hidden: '{hideFwaWbs3}',
                        readOnly: '{wbsLocked}'
                    },
                    listeners: {
                        change: 'onWbs3ComboChange'
                    }
                }
            ]
        },
        {
            items: [
                {
                    xtype: 'textfield',
                    flex: 1,
                    labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    //height: 25,
                    fieldLabel: {_tr: 'wbs1Label', tpl: '{0} Name'},
                    reference: 'fwawbs1name',
                    readOnly: true,
                    submitValue: false,
                    name: 'wbs1Name'
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    xtype: 'textfield',
                    flex: 1,
                    labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                    //height: 25,
                    fieldLabel: {_tr: 'wbs2Label', tpl: '{0} Name'},
                    bind: {
                        hidden: '{hideFwaWbs2}'
                    },
                    reference: 'fwawbs2name',
                    readOnly: true,
                    submitValue: false,
                    name: 'wbs2Name'
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    xtype: 'textfield',
                    flex: 1,
                    labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                    //height: 25,
                    fieldLabel: {_tr: 'wbs3Label', tpl: '{0} Name'},
                    bind: {
                        hidden: '{hideFwaWbs3}'
                    },
                    reference: 'fwawbs3name',
                    itemId: 'fwawbs3name',
                    readOnly: true,
                    submitValue: false,
                    name: 'wbs3Name'
                }
            ]
        },
        {
            items: [
                {
                    xtype: 'textfield',
                    flex: 1,
                    labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    //height: 25,
                    fieldLabel: {_tr: 'clientLabel', tpl: '{0} Name'},
                    reference: 'clientNameField',
                    itemId: 'clientNameField',
                    readOnly: true,
                    excludeForm: true,
                    name: 'clientName'
                },
                {
                    xtype: 'hidden',
                    reference: 'clientIdField',
                    itemId: 'clientIdField',
                    name: 'clientId'
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    xtype: 'textfield',
                    flex: 1,
                    labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                    //height: 25,
                    fieldLabel: {_tr: 'contactLabel', tpl: '{0}'},
                    reference: 'contactField',
                    minWidth: 100,
                    name: 'contactInfo'
                },
                {
                    xtype: 'fixedspacer'
                },
                {
                    xtype: 'field-schedulers',
                    flex: 1,
                    labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                    //height: 25,
                    fieldLabel: 'Scheduled By',
                    name: 'preparedByEmpId',
                    reference: 'preparedByEmpIdField',
                    listeners: {
                        change: 'onScheduledByChanged'
                    }
                }
            ]
        },
        {
            items: [
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding: '0 3 0 0',
                    items: [
                        {
                            xtype: 'displayfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                            //height: 25,
                            fieldLabel: {_tr: 'crewLabel', tpl: '{0} Name'},
                            name: 'scheduledCrewName',
                            reference: 'scheduledCrewNameDisplay',
                            itemId: 'crewNameDisplay',
                            listeners: {
                                change: 'onCrewChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-users',
                            width: 24,
                            bind: {
                                hidden: '{!isSchedulerOrNewFwa}'
                            },
                            reference: 'crewButton',
                            itemId: 'crewButton',
                            handler: 'assignCrew',
                            padding: '0 3 0 0',
                            tooltip: {_tr: 'crewLabel', tpl: ' Assign {0}'}
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t1_Label'},
                            disabledCls: '',
                            reference: 'udf_t1_text',
                            itemId: 'udf_t1_text',
                            name: 'udf_t1',
                            bind: {
                                hidden: '{hideUdf_t1_text}',
                                disabled: '{readOnlyUdf_t1}'
                            },
                            listeners: {
                                render: function (c) {
                                    new Ext.ToolTip({
                                        target: c.labelEl.dom,
                                        html: c.fieldLabel
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            fieldLabel: {_tr: 'udf_t1_Label'},
                            name: 'udf_t1',
                            reference: 'udf_t1_combo',
                            itemId: 'udf_t1_combo',
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            bind: {
                                hidden: '{hideUdf_t1_combo}',
                                disabled: '{readOnlyUdf_t1}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    //labelWidth: 150,
                    labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis;',
                    //height: 25,
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'checkboxfield',
                            //flex: 1,
                            fieldLabel: 'WBS Locked',
                            labelAlign: 'right',
                            reference: 'wbsLockedCheckbox',
                            name: 'wbsLocked',
                            bind: {
                                hidden: '{wbsLocked}' //!isScheduler
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            //flex: 1,
                            labelAlign: 'right',
                            //labelWidth: 150,
                            fieldStyle: 'float:right',
                            fieldLabel: 'Contract?',
                            reference: 'contractCheckbox',
                            name: 'isContractWork',
                            bind: {
                                readOnly: '{isFwa}'
                            },
                            padding: '0 0 0 0'
                        },
                        {
                            xtype: 'checkbox',
                            //flex: 1,
                            reference: 'udf_c1_Checkbox',
                            name: 'udf_c1',
                            bind: {
                                readOnly: '{readOnlyUdf_c1}',
                                hidden: '{hideUdf_c1}'
                            },
                            fieldLabel: {_tr: 'udf_c1_Label'},
                            labelAlign: 'right',
                            //labelWidth: 130,
                            fieldStyle: 'float:right'
                        },
                        {
                            margin: '0 0 0 20',
                            xtype: 'button',
                            text: 'Update', //{_tr: 'wbs1Label', tpl: 'Update {0}'},
                            //iconCls: 'x-fa fa-refresh',
                            handler: 'onClickRefreshInfo',
                            align: 'right',
                            tooltip: 'Refresh general information',
                            style: 'float:right'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            reference: 'udfRowOne',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            //padding: '0 3 0 0',
            items: [
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t2_Label'},
                            reference: 'udf_t2_text',
                            itemId: 'udf_t2_text',
                            name: 'udf_t2',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t2_text}',
                                disabled: '{readOnlyUdf_t2}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t2_Label'},
                            name: 'udf_t2',
                            reference: 'udf_t2_combo',
                            itemId: 'udf_t2_combo',
                            bind: {
                                hidden: '{hideUdf_t2_combo}',
                                disabled: '{readOnlyUdf_t2}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t3_Label'},
                            reference: 'udf_t3_text',
                            itemId: 'udf_t3_text',
                            name: 'udf_t3',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t3_text}',
                                disabled: '{readOnlyUdf_t3}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t3_Label'},
                            name: 'udf_t3',
                            reference: 'udf_t3_combo',
                            itemId: 'udf_t3_combo',
                            bind: {
                                hidden: '{hideUdf_t3_combo}',
                                disabled: '{readOnlyUdf_t3}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t4_Label'},
                            reference: 'udf_t4_text',
                            itemId: 'udf_t4_text',
                            name: 'udf_t4',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t4_text}',
                                disabled: '{readOnlyUdf_t4}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t4_Label'},
                            name: 'udf_t4',
                            reference: 'udf_t4_combo',
                            itemId: 'udf_t4_combo',
                            bind: {
                                hidden: '{hideUdf_t4_combo}',
                                disabled: '{readOnlyUdf_t4}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
            ]
        },
        {
            xtype: 'fieldcontainer',
            reference: 'udfRowTwo',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            //padding: '0 3 0 0',
            items: [
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t5_Label'},
                            reference: 'udf_t5_text',
                            itemId: 'udf_t5_text',
                            name: 'udf_t5',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t5_text}',
                                disabled: '{readOnlyUdf_t5}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t5_Label'},
                            name: 'udf_t5',
                            reference: 'udf_t5_combo',
                            itemId: 'udf_t5_combo',
                            bind: {
                                hidden: '{hideUdf_t5_combo}',
                                disabled: '{readOnlyUdf_t5}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t6_Label'},
                            reference: 'udf_t6_text',
                            itemId: 'udf_t6_text',
                            name: 'udf_t6',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t6_text}',
                                disabled: '{readOnlyUdf_t6}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t6_Label'},
                            name: 'udf_t6',
                            reference: 'udf_t6_combo',
                            itemId: 'udf_t6_combo',
                            bind: {
                                hidden: '{hideUdf_t6_combo}',
                                disabled: '{readOnlyUdf_t6}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t7_Label'},
                            reference: 'udf_t7_text',
                            itemId: 'udf_t7_text',
                            name: 'udf_t7',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t7_text}',
                                disabled: '{readOnlyUdf_t7}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t7_Label'},
                            name: 'udf_t7',
                            reference: 'udf_t7_combo',
                            itemId: 'udf_t7_combo',
                            bind: {
                                hidden: '{hideUdf_t7_combo}',
                                disabled: '{readOnlyUdf_t7}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
            ]
        },
        {
            xtype: 'fieldcontainer',
            reference: 'udfRowThree',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            //padding: '0 3 0 0',
            items: [
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t8_Label'},
                            reference: 'udf_t8_text',
                            itemId: 'udf_t8_text',
                            name: 'udf_t8',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t8_text}',
                                disabled: '{readOnlyUdf_t8}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t8_Label'},
                            name: 'udf_t8',
                            reference: 'udf_t8_combo',
                            itemId: 'udf_t8_combo',
                            bind: {
                                hidden: '{hideUdf_t8_combo}',
                                disabled: '{readOnlyUdf_t8}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t9_Label'},
                            reference: 'udf_t9_text',
                            itemId: 'udf_t9_text',
                            name: 'udf_t9',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t9_text}',
                                disabled: '{readOnlyUdf_t9}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t9_Label'},
                            name: 'udf_t9',
                            reference: 'udf_t9_combo',
                            itemId: 'udf_t9_combo',
                            bind: {
                                hidden: '{hideUdf_t9_combo}',
                                disabled: '{readOnlyUdf_t9}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            fieldLabel: {_tr: 'udf_t10_Label'},
                            reference: 'udf_t10_text',
                            itemId: 'udf_t10_text',
                            name: 'udf_t10',
                            disabledCls: '',
                            bind: {
                                hidden: '{hideUdf_t10_text}',
                                disabled: '{readOnlyUdf_t10}'
                            }
                        },
                        {
                            xtype: 'combo',
                            editable: false,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'key',
                            fieldLabel: {_tr: 'udf_t10_Label'},
                            name: 'udf_t10',
                            reference: 'udf_t10_combo',
                            itemId: 'udf_t10_combo',
                            bind: {
                                hidden: '{hideUdf_t10_combo}',
                                disabled: '{readOnlyUdf_t10}'
                            },
                            disabledCls: '',
                            flex: 1,
                            labelWidth: 150,
                            labelStyle: 'overflow-wrap: break-word; padding-left: 5px;',
                            // height: 25,
                            listeners: {
                                change: 'onUdfComboChange'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                }
            ]
        }
    ]
});
