Ext.define('TS.view.fwa.FWAEdit', {
    extend: 'Ext.form.Panel',
    xtype: 'fwa-edit',

    requires: [
        'Ext.SegmentedButton',
        'Ext.field.TextArea',
        'TS.common.field.WBS',
        'TS.controller.fwa.FWAEditController'
    ],

    controller: 'fwa-edit',
    //viewModel: 'main',
    reference: 'fwaEditForm',
    itemId: 'fwaForm',

    scrollable: 'y', //limit scrolling to vertical axis?
    items: [
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            docked: 'top',
            title: 'Edit',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    iconCls: 'x-fa fa-chevron-left',
                    action: 'navigation-back',
                    reference: 'backButton'
                },
                {
                    align: 'right',
                    iconCls: 'x-fa fa-bars',
                    handler: 'onEditMenuTap',
                    reference: 'fwaEditMenuButton'
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            height: 90,
            items: [
                {
                    bind: {
                        text: '{fwaStartStop}',
                        hidden: true, //'{hideFwaStartStop}',
                        iconCls: '{hourglassIconCls}'
                    },
                    handler: 'toggleWork',
                    reference: 'toggleWorkButton',
                    itemId: 'toggleWorkButton'
                },
                {
                    text: 'Save',
                    align: 'left',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    handler: 'onSaveFwa',
                    style: 'margin-right: 5px; margin-botttom: 5px;',
                    reference: 'saveFwaButton',
                    width: 130
                },
                {
                    text: 'Submit',
                    align: 'right',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    handler: 'onSubmitFwa',
                    style: 'margin-botttom: 5px;',
                    reference: 'submitFwaButton',
                    width: 130
                }
            ]
        },
        {
            xtype: 'fieldset',
            reference: 'onlineFwaInfo',
            title: {_tr: 'fwaLabel'},
            itemId:'FwaInfo',
            margin: '0 0 0 0',
            items: [
                {
                    xtype: 'textfield',
                    labelWrap: true,
                    hidden: true,
                    bind: '{selectedFWA.fwaId}'
                },
                {
                    xtype: 'textfield',
                    labelWrap: true,
                    reference: 'fwaNumField',
                    label: {_tr: 'fwaAbbrevLabel', tpl: '{0} #'},
                    bind: {
                        readOnly: '{settings.fwaAutoNumbering}',
                        value: '{selectedFWA.fwaNum}'
                    }
                },
                {
                    xtype: 'textfield',
                    labelWrap: true,
                    label: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                    reference: 'fwaNameField',
                    required: true,
                    //requiredCls: 'required-background',
                    bind: {
                        value: '{selectedFWA.fwaName}',
                    },
                    listeners: {
                        change: 'itemChange'
                    }

                },
                // {
                //     xtype: 'field-fwastatuslist',
                //     label: 'Status',
                //     bind: {
                //         value:'{selectedFWA.fwaStatusId}'
                //     }
                // },
                {
                    xtype: 'displayfield',
                    label: 'Status',
                    bind: '{selectedFWA.fwaStatusString}'
                },
                {
                    xtype: 'field-prioritylist',
                    label: {_tr: 'fieldPriorityLabel', tpl: '{0}'},
                    itemId: 'fieldPriorityField',
                    required: true,
                    //autoSelect: true,
                    placeHolder: 'Select priority',
                    bind: {
                        value: '{selectedFWA.fieldPriorityId}',
                        readOnly: '{wbsLocked}',
                        style: '{selectedFWA.fieldPriorityColor}'
                    }
                },
                {
                    xtype: 'button',
                    handler: 'onManageNotesTap',
                    bind: {
                        iconCls: '{notesCls}'
                    },
                    text: 'Notes',
                    cls: 'ts-bt-margin-small',
                    reference: 'notesButton'
                },
                {
                    xtype: 'button',
                    text: 'Non-field Actions',
                    // top: '-0.1em', //used only if in a container
                    // right: '1em',
                    iconCls: 'x-fa fa-list-ol',
                    cls: 'ts-bt-margin-small',
                    handler: 'onActionLookup',
                    reference: 'nonFieldActionsButton'
                }
            ]
        },

        {
            xtype: 'container',
            items: [
                {
                    xtype: 'button',
                    reference: 'onlineProjectLookup',
                    top: '-0.1em',
                    right: '0.5em',
                    iconCls: 'x-fa fa-search',
                    handler: 'onProjectLookup',
                    bind: {
                        disabled: '{wbsLocked}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            itemId:'GeneralInfo',
            margin: '0 0 0 0',
            title: 'General Information',
            reference: 'onlineGeneralInformation',
            items: [
                {
                    label: {_tr: 'wbs1Label', tpl: '{0} #'},
                    xtype: 'field-wbs',
                    modelName: 'Wbs1',
                    itemId: 'fwawbs1id',
                    required: true,
                    reference: 'wbs1combo', //we rely on referenced field selection in the view model
                    deferredLoad: true, // Load the store until after initialization is complete
                    clears: ['fwawbs2id', 'fwawbs3id'], //References of fields that should be receive blank value when this field sets new value
                    sets: 'fwawbs2id', //Manipulates dependent store
                    //WBS2 needs wbs1 value
                    dependencyFilter: {
                        wbs1: 'fwawbs1id' // Proxy ExtraParam. Will set to dependency value
                    },
                    app: 'FWA',
                    bind: {
                        value: '{selectedFWA.wbs1}',
                        readOnly: '{wbsLocked}',
                        hidden: '{hideFwaWbs1}'
                    },
                    listeners: {
                        change: 'onWbsChange',
                        painted: function (cmp) {
                            if (cmp.component.getRequired() && !cmp.component.getValue()) {
                                cmp.component.setRequiredCls('required-background');
                            } else {
                                cmp.component.setRequiredCls('');
                            }
                        }
                    }
                },
                {
                    label: {_tr: 'wbs2Label', tpl: '{0} #'},
                    xtype: 'field-wbs',
                    itemId: 'fwawbs2id',
                    reference: 'wbs2combo',
                    clears: ['fwawbs3id'],
                    modelName: 'Wbs2',
                    app: 'FWA',
                    sets: 'fwawbs3id',
                    //WBS3 needs both wbs1 and wbs2 values
                    dependencyFilter: {
                        wbs1: 'fwawbs1id',
                        wbs2: 'fwawbs2id'
                    },
                    bind: {
                        value: '{selectedFWA.wbs2}',
                        readOnly: '{wbsLocked}',
                        hidden: '{hideFwaWbs2}'
                    },
                    listeners: {
                        change: 'onWbsChange'
                    }
                },
                {
                    label: {_tr: 'wbs3Label', tpl: '{0} #'},
                    xtype: 'field-wbs',
                    itemId: 'fwawbs3id',
                    reference: 'wbs3combo',
                    modelName: 'Wbs3',
                    app: 'FWA',
                    bind: {
                        value: '{selectedFWA.wbs3}',
                        readOnly: '{wbsLocked}',
                        hidden: '{hideFwaWbs3}'
                    }
                },
                {
                    xtype: 'textfield',
                    labelWrap: true,
                    readOnly: true,
                    userCls: 'ts-long-label',
                    label: {_tr: 'wbs1Label', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs1combo.selection.name}', // this is automatic field and will adjust to whatever selection is in combo
                        hidden: '{hideFwaWbs1Name}'
                    },
                    reference: 'wbs1NameField'
                },
                {
                    xtype: 'textfield',
                    labelWrap: true,
                    readOnly: true,
                    userCls: 'ts-long-label',
                    label: {_tr: 'wbs2Label', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs2combo.selection.name}',
                        hidden: '{hideFwaWbs2Name}'
                    },
                    reference: 'wbs2NameField'
                },
                {
                    xtype: 'textfield',
                    labelWrap: true,
                    readOnly: true,
                    label: {_tr: 'wbs3Label', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs3combo.selection.name}',
                        hidden: '{hideFwaWbs3Name}'
                    },
                    reference: 'wbs3NameField'
                },
                {
                    xtype: 'textfield',
                    labelWrap: true,
                    readOnly: true,
                    userCls: 'ts-long-label',
                    reference: 'clientNameField',
                    label: {_tr: 'clientLabel', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs1combo.selection.clientName}',
                        hidden: '{hideFwaDisplayClient}'
                    }
                },
                {
                    xtype: 'field-schedulers',
                    label: 'Scheduled By',
                    itemId: 'scheduledByField',
                    reference: 'scheduledByField',
                    required: true,
                    bind: {
                        value: '{selectedFWA.preparedByEmpId}',
                        readOnly: '{wbsLocked}'
                    },
                    listeners: {
                        painted: function (cmp) {
                            if (cmp.component.getRequired() && !cmp.component.getValue()) {
                                cmp.component.setRequiredCls('required-background');
                            } else {
                                cmp.component.setRequiredCls('');
                            }
                        },
                        change: function (cmp) {
                            if (cmp.getRequired() && !cmp.getValue()) {
                                cmp.setRequiredCls('required-background');
                            } else {
                                cmp.setRequiredCls('');
                            }
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    labelWrap: true,
                    label: {_tr: 'contactLabel'},
                    reference: 'contactField',
                    bind: '{selectedFWA.contactInfo}'
                },
                {
                    xtype: 'segmentedbutton',
                    cls: 'filterbar-segmented-button',
                    pressedCls: 'filterbar-segmented-button-pressed',
                    allowMultiple: true,
                    items: [
                        {
                            text: {_tr: 'crewLabelPlural', tpl: 'All {0}'},
                            handler: 'onAllCrewsClick',
                            iconCls: 'user',
                            itemId: 'allCrewButton',
                            width: '50%'

                        },
                        {
                            text: {_tr: 'crewLabelPlural', tpl: 'My {0} Only'},
                            width: '50%',
                            itemId: 'myCrewsButton',
                            iconCls: 'compose',
                            handler: 'onMyCrewOnlyClick',
                            pressed: true,
                            style: 'color:white;background-color:#939393;font-weight: bold;'
                        }
                    ],
                    bind: {
                        hidden: '{!newFwa}'
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-phone',
                            itemId: 'crewPhoneButton',
                            handler: 'onCrewPhoneClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{newFwa}'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-chevron-down',
                            itemId: 'newFwaCrewSelectButton',
                            handler: 'onNewFwaCrewSelectClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{!newFwa}'
                            }
                        },
                        {
                            xtype: 'field-crewlist',
                            label: {_tr: 'crewLabel'},
                            itemId: 'crewLabel',
                            reference: 'schedCrewfield',
                            bind: {
                                value: '{selectedFWA.scheduledCrewId}',
                                readOnly: '{!newFwa}'
                            },
                            listeners: {
                                change: 'onCrewChange'
                            }
                        }
                    ]
                },
                {
                    xtype: 'checkboxfield',
                    label: 'Contract?',
                    labelWrap: true,
                    itemId: 'isContractWorkCbx',
                    bind: {
                        checked: '{selectedFWA.isContractWork}',
                        disabled: '{!newFwa}'
                    }
                },
                {
                    xtype: 'checkboxfield',
                    label: 'WBS Locked',
                    labelWrap: true,
                    itemId: 'wbsLockedCbx',
                    reference: 'wbsLockedCbx',
                    bind: {
                        checked: '{selectedFWA.wbsLocked}',
                        hidden: '{!newFwa}'
                    }
                }, {
                    xtype: 'checkboxfield',
                    label: {_tr: 'udf_c1_Label'},
                    labelWrap: true,
                    reference: 'udf_c1_field',
                    bind: {
                        checked: '{selectedFWA.udf_c1}',
                        disabled: '{readOnlyUdf_c1}',
                        hidden: '{hideUdf_c1}'
                    },
                    disabledCls: '',
                    listeners: {
                        change: 'udfCheckBoxChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'udf_t1',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t1}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t1_text',
                            reference: 'udf_t1_text',
                            label: {_tr: 'udf_t1_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t1}',
                                hidden: '{hideUdf_t1_text}',
                                readOnly: true //'{readOnlyUdf_t1}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t1_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t1_Label'},
                    labelWrap: true,
                    itemId: 'udf_t1_combo',
                    reference: 'udf_t1_combo',
                    bind: {
                        value: '{selectedFWA.udf_t1}',
                        readOnly: '{readOnlyUdf_t1}',
                        hidden: '{hideUdf_t1_combo}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t2',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t2}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t2_text',
                            reference: 'udf_t2_text',
                            label: {_tr: 'udf_t2_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t2}',
                                hidden: '{hideUdf_t2_text}',
                                readOnly: true //'{readOnlyUdf_t2}'
                            }
                        }
                    ],
                    bind: {
                        //hidden: '{hideUdf_t2_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t2_Label'},
                    labelWrap: true,
                    itemId: 'udf_t2_combo',
                    reference: 'udf_t2_combo',
                    bind: {
                        value: '{selectedFWA.udf_t2}',
                        readOnly: '{readOnlyUdf_t2}',
                        hidden: '{hideUdf_t2_combo}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t3',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t3}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t3_text',
                            reference: 'udf_t3_text',
                            label: {_tr: 'udf_t3_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t3}',
                                hidden: '{hideUdf_t3_text}',
                                readOnly: true //'{readOnlyUdf_t3}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t3_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t3_Label'},
                    labelWrap: true,
                    itemId: 'udf_t3_combo',
                    reference: 'udf_t3_combo',
                    bind: {
                        value: '{selectedFWA.udf_t3}',
                        hidden: '{hideUdf_t3_combo}',
                        readOnly: '{readOnlyUdf_t3}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t4',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t4}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t4_text',
                            reference: 'udf_t4_text',
                            label: {_tr: 'udf_t4_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t4}',
                                hidden: '{hideUdf_t4_text}',
                                readOnly: true //'{readOnlyUdf_t4}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t4_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t4_Label'},
                    labelWrap: true,
                    itemId: 'udf_t4_combo',
                    reference: 'udf_t4_combo',
                    bind: {
                        value: '{selectedFWA.udf_t4}',
                        hidden: '{hideUdf_t4_combo}',
                        readOnly: '{readOnlyUdf_t4}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t5',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t5}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t5_text',
                            reference: 'udf_t5_text',
                            label: {_tr: 'udf_t5_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t5}',
                                hidden: '{hideUdf_t5_text}',
                                readOnly: true //'{readOnlyUdf_t5}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t5_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t5_Label'},
                    labelWrap: true,
                    itemId: 'udf_t5_combo',
                    reference: 'udf_t5_combo',
                    bind: {
                        value: '{selectedFWA.udf_t5}',
                        hidden: '{hideUdf_t5_combo}',
                        readOnly: '{readOnlyUdf_t5}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t6',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em', bind: {
                                hidden: '{readOnlyUdf_t6}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t6_text',
                            reference: 'udf_t6_text',
                            label: {_tr: 'udf_t6_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t6}',
                                hidden: '{hideUdf_t6_text}',
                                readOnly: true //'{readOnlyUdf_t6}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t6_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t6_Label'},
                    labelWrap: true,
                    itemId: 'udf_t6_combo',
                    reference: 'udf_t6_combo',
                    bind: {
                        value: '{selectedFWA.udf_t6}',
                        hidden: '{hideUdf_t6_combo}',
                        readOnly: '{readOnlyUdf_t6}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t7',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t7}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t7_text',
                            reference: 'udf_t7_text',
                            label: {_tr: 'udf_t7_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t7}',
                                hidden: '{hideUdf_t7_text}',
                                readOnly: true //'{readOnlyUdf_t7}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t7_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t7_Label'},
                    labelWrap: true,
                    itemId: 'udf_t7_combo',
                    reference: 'udf_t7_combo',
                    bind: {
                        value: '{selectedFWA.udf_t7}',
                        hidden: '{hideUdf_t7_combo}',
                        readOnly: '{readOnlyUdf_t7}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t8',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t8}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t8_text',
                            reference: 'udf_t8_text',
                            label: {_tr: 'udf_t8_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t8}',
                                hidden: '{hideUdf_t8_text}',
                                readOnly: true //'{readOnlyUdf_t8}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t8_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t8_Label'},
                    labelWrap: true,
                    itemId: 'udf_t8_combo',
                    reference: 'udf_t8_combo',
                    bind: {
                        value: '{selectedFWA.udf_t8}',
                        hidden: '{hideUdf_t8_combo}',
                        readOnly: '{readOnlyUdf_t8}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t9',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t9}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t9_text',
                            reference: 'udf_t9_text',
                            label: {_tr: 'udf_t9_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t9}',
                                hidden: '{hideUdf_t9_text}',
                                readOnly: true //'{readOnlyUdf_t9}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t9_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t9_Label'},
                    labelWrap: true,
                    itemId: 'udf_t9_combo',
                    reference: 'udf_t9_combo',
                    bind: {
                        value: '{selectedFWA.udf_t9}',
                        hidden: '{hideUdf_t9_combo}',
                        readOnly: '{readOnlyUdf_t9}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-edit',
                            itemId: 'udf_t10',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t10}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_t10_text',
                            reference: 'udf_t10_text',
                            label: {_tr: 'udf_t10_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t10}',
                                hidden: '{hideUdf_t10_text}',
                                readOnly: true //'{readOnlyUdf_t10}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_t10_text}'
                    }
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t10_Label'},
                    labelWrap: true,
                    itemId: 'udf_t10_combo',
                    reference: 'udf_t10_combo',
                    bind: {
                        value: '{selectedFWA.udf_t10}',
                        hidden: '{hideUdf_t10_combo}',
                        readOnly: '{readOnlyUdf_t10}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            margin: '0 0 0 0',
            title: 'Work Address',
            reference: 'onlineWorkAddress',
            items: [
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'address_address1',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onAddressClick',
                            top: '.1em',
                            right: '.0em'
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            label: 'Address 1',
                            bind: '{selectedFWA.loc.address1}',
                            itemId: 'address1Field',
                            reference: 'address1Field',
                            readOnly: true
                        }
                    ]
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'address_address2',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onAddressClick',
                            top: '.1em',
                            right: '.0em'
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            label: 'Address 2',
                            bind: '{selectedFWA.loc.address2}',
                            itemId: 'address2Field',
                            reference: 'address2Field',
                            readOnly: true
                        }
                    ]
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'address_city',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onAddressClick',
                            top: '.1em',
                            right: '.0em'
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            label: 'City',
                            bind: '{selectedFWA.loc.city}',
                            itemId: 'cityField',
                            reference: 'cityField',
                            readOnly: true
                        }
                    ]
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'address_state',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onAddressClick',
                            top: '.1em',
                            right: '.0em'
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            label: 'State',
                            bind: '{selectedFWA.loc.state}',
                            itemId: 'stateField',
                            reference: 'stateField',
                            readOnly: true
                        }
                    ]
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'address_zip',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onAddressClick',
                            top: '.1em',
                            right: '.0em'
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            label: 'Zip',
                            bind: '{selectedFWA.loc.zip}',
                            itemId: 'zipField',
                            reference: 'zipField',
                            readOnly: true
                        }
                    ]
                },

                //     listeners: {
                //         focus: function (obj, e) {
                //             var scroller = obj.getParent().getParent().getScrollable(),
                //                 scrollToY = TS.Util.getCurrentScrollToY();
                //             TS.app.settings.currentPosition = scroller.position.y;
                //             if (Ext.os.is.Android && Ext.os.is.Phone)
                //                 scroller.scrollTo(null, scrollToY + 600);
                //         }
                //     }
                // },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'address_latitude',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onAddressNumericClick',
                            top: '.1em',
                            right: '.0em'
                        },
                        {
                            xtype: 'numberfield',
                            minValue: -90,
                            maxValue: 90,
                            label: 'Latitude',
                            labelWrap: true,
                            reference: 'locLatitude',
                            bind: '{selectedFWA.loc.latitude}',
                            itemId: 'latitudeField',
                            readOnly: true
                        }
                    ]
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'address_longitude',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onAddressNumericClick',
                            top: '.1em',
                            right: '.0em'
                        },
                        {
                            xtype: 'numberfield',
                            minValue: -180,
                            maxValue: 180,
                            label: 'Longitude',
                            labelWrap: true,
                            reference: 'locLongitude',
                            bind: '{selectedFWA.loc.longitude}',
                            itemId: 'longitudeField',
                            readOnly: true
                        }
                    ]
                },
                // {
                //     xtype: 'numberfield',
                //     minValue: -180,
                //     maxValue: 180,
                //     label: 'Longitude',
                //     labelWrap: true,
                //     reference: 'locLongitude',
                //     bind: '{selectedFWA.loc.longitude}',
                //     itemId: 'longitudeField',
                //     listeners: {
                //         focus: function (obj, e) {
                //             var scroller = obj.getParent().getParent().getScrollable(),
                //                 scrollToY = TS.Util.getCurrentScrollToY();
                //             TS.app.settings.currentPosition = scroller.position.y;
                //             if (Ext.os.is.Android && Ext.os.is.Phone)
                //                 scroller.scrollTo(null, scrollToY + 700);
                //         }
                //     }
                // },
                //added popup for edit
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'udf_a1',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onUdfClick',
                            top: '.3em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_a1}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_a1_text',
                            reference: 'udf_a1_text',
                            label: {_tr: 'udf_a1_Label'},
                            bind: {
                                value: '{selectedFWA.udf_a1}',
                                hidden: '{hideUdf_a1_text}',
                                readOnly: true //'{readOnlyUdf_t1}'
                            }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_a1_text}'
                    }
                },
                {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a1_Label'},
                    labelWrap: true,
                    itemId: 'udf_a1_combo',
                    reference: 'udf_a1_combo',
                    displayField: 'value',
                    valueField: 'key',
                    bind: {
                        value: '{selectedFWA.udf_a1}',
                        hidden: '{hideUdf_a1_combo}',
                        readOnly: '{readOnlyUdf_a1}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'udf_a2',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_a2}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_a2_text',
                            reference: 'udf_a2_text',
                            label: {_tr: 'udf_a2_Label'},
                            bind: {
                                value: '{selectedFWA.udf_a2}',
                                hidden: '{hideUdf_a2_text}',
                                readOnly: true //'{readOnlyUdf_t1}'
                            },
                            // listeners: {
                            //     focus: function (obj, e) {
                            //         var scroller = obj.getParent().getParent().getParent().getScrollable(),
                            //             scrollToY = TS.Util.getCurrentScrollToY();
                            //         TS.app.settings.currentPosition = scroller.position.y;
                            //         if (Ext.os.is.Android && Ext.os.is.Phone)
                            //             scroller.scrollTo(null, scrollToY + 560);
                            //     }
                            // }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_a2_text}'
                    }
                },
                {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a2_Label'},
                    labelWrap: true,
                    itemId: 'udf_a2_combo',
                    reference: 'udf_a2_combo',
                    displayField: 'value',
                    valueField: 'key',
                    bind: {
                        value: '{selectedFWA.udf_a2}',
                        hidden: '{hideUdf_a2_combo}',
                        readOnly: '{readOnlyUdf_a2}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'udf_a3',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_a3}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_a3_text',
                            reference: 'udf_a3_text',
                            label: {_tr: 'udf_a3_Label'},
                            bind: {
                                value: '{selectedFWA.udf_a3}',
                                hidden: '{hideUdf_a3_text}',
                                readOnly: true //'{readOnlyUdf_t1}'
                            },
                            // listeners: {
                            //     focus: function (obj, e) {
                            //         var scroller = obj.getParent().getParent().getParent().getScrollable(),
                            //             scrollToY = TS.Util.getCurrentScrollToY();
                            //         TS.app.settings.currentPosition = scroller.position.y;
                            //         if (Ext.os.is.Android && Ext.os.is.Phone)
                            //             scroller.scrollTo(null, scrollToY + 605);
                            //     }
                            // }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_a3_text}'
                    }
                },
                {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a3_Label'},
                    labelWrap: true,
                    displayField: 'value',
                    valueField: 'key',
                    itemId: 'udf_a3_combo',
                    reference: 'udf_a3_combo',
                    bind: {
                        value: '{selectedFWA.udf_a3}',
                        hidden: '{hideUdf_a3_combo}',
                        readOnly: '{readOnlyUdf_a3}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'udf_a4',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_a1}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_a4_text',
                            reference: 'udf_a4_text',
                            label: {_tr: 'udf_a4_Label'},
                            bind: {
                                value: '{selectedFWA.udf_a4}',
                                hidden: '{hideUdf_a4_text}',
                                readOnly: true //'{readOnlyUdf_a4}'
                            },
                            // listeners: {
                            //     focus: function (obj, e) {
                            //         var scroller = obj.getParent().getParent().getParent().getScrollable(),
                            //             scrollToY = TS.Util.getCurrentScrollToY();
                            //         TS.app.settings.currentPosition = scroller.position.y;
                            //         if (Ext.os.is.Android && Ext.os.is.Phone)
                            //             scroller.scrollTo(null, scrollToY + 650);
                            //     }
                            // }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_a4_text}'
                    }
                },
                {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a4_Label'},
                    labelWrap: true,
                    displayField: 'value',
                    valueField: 'key',
                    itemId: 'udf_a4_combo',
                    reference: 'udf_a4_combo',
                    bind: {
                        value: '{selectedFWA.udf_a4}',
                        hidden: '{hideUdf_a4_combo}',
                        readOnly: true //'{readOnlyUdf_a4}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'udf_a5',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_a5}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_a5_text',
                            reference: 'udf_a5_text',
                            label: {_tr: 'udf_a5_Label'},
                            bind: {
                                value: '{selectedFWA.udf_a5}',
                                hidden: '{hideUdf_a5_text}',
                                readOnly: true //'{readOnlyUdf_t1}'
                            },
                            // listeners: {
                            //     focus: function (obj, e) {
                            //         var scroller = obj.getParent().getParent().getParent().getScrollable(),
                            //             scrollToY = TS.Util.getCurrentScrollToY();
                            //         TS.app.settings.currentPosition = scroller.position.y;
                            //         if (Ext.os.is.Android && Ext.os.is.Phone)
                            //             scroller.scrollTo(null, scrollToY + 695);
                            //     }
                            // }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_a5_text}'
                    }
                },
                {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a5_Label'},
                    labelWrap: true,
                    displayField: 'value',
                    valueField: 'key',
                    itemId: 'udf_a5_combo',
                    reference: 'udf_a5_combo',
                    bind: {
                        value: '{selectedFWA.udf_a5}',
                        hidden: '{hideUdf_a5_combo}',
                        readOnly: '{readOnlyUdf_a5}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'udf_a6',
                            iconCls: 'x-fa fa-edit',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_a6}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            itemId: 'udf_a6_text',
                            reference: 'udf_a6_text',
                            label: {_tr: 'udf_a6_Label'},
                            bind: {
                                value: '{selectedFWA.udf_a6}',
                                hidden: '{hideUdf_a6_text}',
                                readOnly: true //'{readOnlyUdf_t1}'
                            },
                            // listeners: {
                            //     focus: function (obj, e) {
                            //         var scroller = obj.getParent().getParent().getParent().getScrollable(),
                            //             scrollToY = TS.Util.getCurrentScrollToY();
                            //         TS.app.settings.currentPosition = scroller.position.y;
                            //         if (Ext.os.is.Android && Ext.os.is.Phone)
                            //             scroller.scrollTo(null, scrollToY + 740);
                            //     }
                            // }
                        }
                    ],
                    bind: {
                        hidden: '{hideUdf_a6_text}'
                    }
                },
                {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a6_Label'},
                    labelWrap: true,
                    displayField: 'value',
                    valueField: 'key',
                    itemId: 'udf_a6_combo',
                    reference: 'udf_a6_combo',
                    bind: {
                        value: '{selectedFWA.udf_a6}',
                        hidden: '{hideUdf_a6_combo}',
                        readOnly: '{readOnlyUdf_a6}'
                    },
                    listeners: {
                        //change: 'onCrewChange'
                    }
                },

                {
                    xtype: 'button',
                    cls: 'ts-bt-margin-small',
                    iconCls: 'x-fa fa-map-pin ',
                    text: 'Map Location',
                    handler: 'onMapLocationTap',
                    reference: 'mapButton'
                }

            ]
        },
        {
            xtype: 'fieldset',
            reference: 'onlineDateTime',
            margin: '0 0 0 0',
            title: 'Dates & Times',
            itemId: 'dateTimeHeader',
            items: [
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            top: '.0em',
                            right: '.0em',
                            iconCls: 'x-fa  fa-refresh',
                            handler: 'onResetOrderedDates',
                            itemId: 'resetOrderedDatesBtn',
                            bind: {
                                disabled: '{wbsLocked}'
                            }
                        },
                        {
                            xtype: 'datepickerfield',
                            label: 'Date Ordered',
                            labelWrap: true,
                            itemId: 'dateOrderedField',
                            reference: 'dateOrderedField',
                            bind: '{selectedFWA.dateOrdered}',
                            picker: {
                                yearFrom: new Date().getFullYear() - 1,
                                yearTo: new Date().getFullYear() + 2
                            },
                            listeners: {
                                change: function (obj, nValue, oValue) {
                                    if (nValue < new Date('1/1/0001 12:30:00 AM')) {
                                        obj.setValue('');
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'field-employee',
                    label: 'Ordered By',
                    labelWrap: true,
                    itemId: 'orderedByField',
                    bind: '{selectedFWA.orderedBy}'
                },
                {
                    xtype: 'datepickerfield',
                    label: 'Date Required',
                    labelWrap: true,
                    itemId: 'dateRequiredField',
                    reference: 'dateRequiredField',
                    bind: '{selectedFWA.dateRequired}',
                    picker: {
                        yearFrom: new Date().getFullYear() - 1,
                        yearTo: new Date().getFullYear() + 2
                    },
                    listeners: {
                        change: function (obj, nValue, oValue) {
                            if (nValue < new Date('1/1/0001 12:30:00 AM')) {
                                obj.setValue('');
                            }
                        }
                    }
                },
                {
                    xtype: 'datepickerfield',
                    label: {_tr: 'udf_d1_Label'},
                    labelWrap: true,
                    itemId: 'udf_d1_field',
                    reference: 'udf_d1_field',
                    bind: {
                        value: '{selectedFWA.udf_d1}',
                        hidden: '{hideUdf_d1}',
                        readOnly: '{readOnlyUdf_d1}'
                    },
                    picker: {
                        yearFrom: new Date().getFullYear() - 1,
                        yearTo: new Date().getFullYear() + 2
                    },
                    listeners: {
                        painted: function (obj) {
                            if (Ext.Date.format(obj.component.getValue(), DATE_FORMAT) < '01/01/2002') {
                                obj.component.setValue('');
                            }
                        }
                    }
                },
                {
                    xtype: 'datepickerfield',
                    label: {_tr: 'udf_d2_Label'},
                    labelWrap: true,
                    itemId: 'udf_d2_field',
                    reference: 'udf_d2_field',
                    bind: {
                        value: '{selectedFWA.udf_d2}',
                        hidden: '{hideUdf_d2}',
                        readOnly: '{readOnlyUdf_d2}'
                    },
                    picker: {
                        yearFrom: new Date().getFullYear() - 1,
                        yearTo: new Date().getFullYear() + 2
                    },
                    listeners: {
                        painted: function (obj) {
                            if (Ext.Date.format(obj.component.getValue(), DATE_FORMAT) < '01/01/2002') {
                                obj.component.setValue('');
                            }
                        }
                    }
                },
                {
                    xtype: 'datepickerfield',
                    label: {_tr: 'udf_d3_Label'},
                    labelWrap: true,
                    itemId: 'udf_d3_field',
                    reference: 'udf_d3_field',
                    bind: {
                        value: '{selectedFWA.udf_d3}',
                        hidden: '{hideUdf_d3}',
                        readOnly: '{readOnlyUdf_d3}'
                    },
                    picker: {
                        yearFrom: new Date().getFullYear() - 1,
                        yearTo: new Date().getFullYear() + 2
                    },
                    listeners: {
                        painted: function (obj) {
                            if (Ext.Date.format(obj.component.getValue(), DATE_FORMAT) < '01/01/2002') {
                                obj.component.setValue('');
                            }
                        }
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            top: '.0em',
                            right: '.0em',
                            iconCls: 'x-fa  fa-refresh',
                            handler: 'onResetDates',
                            itemId: 'resetDatesBtn',
                            bind: {
                                disabled: '{wbsLocked}'
                            }
                        },
                        {
                            xtype: 'datepickerfield',
                            label: 'Start Date',
                            labelWrap: true,
                            itemId: 'schedStartDateField',
                            reference: 'schedStartDateField',
                            bind: '{selectedFWA.schedStartDate}',
                            //Example set year slot range
                            picker: {
                                yearFrom: new Date().getFullYear() - 1,
                                yearTo: new Date().getFullYear() + 2
                            },
                            //dateFormat: DATE_FORMAT,
                            listeners: {
                                change: 'onStartDateChange'
                            }
                        }
                    ]
                },
                {
                    xtype: 'timepickerfield',
                    label: 'Start Time',
                    reference: 'schedStartTimeField',
                    itemId: 'schedStartTimeField',
                    bind: '{selectedFWA.schedStartDate}',
                    dateFormat: 'g:i A'
                },
                {
                    xtype: 'datepickerfield',
                    label: 'End Date',
                    labelWrap: true,
                    bind: '{selectedFWA.schedEndDate}',
                    itemId: 'schedEndDateField',
                    reference: 'schedEndDateField',
                    //readOnly: true,
                    picker: {
                        yearFrom: new Date().getFullYear() - 1,
                        yearTo: new Date().getFullYear() + 2
                    },
                    //dateFormat: DATE_FORMAT,
                    listeners: {
                        change: 'onEndDateChange'
                    }
                },
                {
                    xtype: 'timepickerfield',
                    label: 'End Time',
                    bind: '{selectedFWA.schedEndDate}',
                    itemId: 'schedEndTimeField',
                    reference: 'schedEndTimeField',
                    dateFormat: 'g:i A'
                }
            ],
            listeners: {
                painted: function () {
                    var me = this,
                        settings = TS.app.settings,
                        vm = Ext.first('app-fwa').getViewModel(),
                        selection = vm.get('selectedFWA');

                    if (selection.get('recurrencePattern')) {
                        me.setTitle('Dates & Times (*recurring)');
                    } else {
                        me.setTitle('Dates & Times');
                    }
                }
            }
        },

        {
            xtype: 'fieldset',
            reference: 'workCodeUnitFieldset',
            bind: {
                title: '{settings.workCodeLabelPlural}'
            },
            cls: 'ts-fieldset-nbr',
            items: [
                {
                    xtype: 'button',
                    handler: 'onManageWorkCodesTap',
                    text: {_tr: 'workCodeLabelPlural', tpl: '{0}'},
                    reference: 'manageWorkCodeButton',
                    bind: {
                        hidden: '{fwaHideWorkCodes}'
                    }
                },
                {
                    xtype: 'button',
                    handler: 'onManageUnitsTap',
                    text: {_tr: 'unitLabelPlural', tpl: '{0}'},
                    reference: 'manageUnitsButton',
                    bind: {
                        hidden: '{!fwaUnitsEnabled}'
                    }
                },
                {
                    xtype: 'button',
                    handler: 'onManageHoursTap',
                    text: 'Employee Hours',
                    reference: 'manageHoursButton'
                },
                {
                    xtype: 'button',
                    handler: 'onManageExpensesTap',
                    text: 'Employee Expenses',
                    reference: 'manageExpensesButton',
                    bind: {
                        hidden: '{hideExpenses}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            margin: '0 0 0 0',
            reference: 'onlineApprovalReq',
            title: 'Approval Requirements',
            items: [
                {
                    xtype: 'checkboxfield',
                    bind: '{selectedFWA.clientSigReq}',
                    label: {_tr: 'clientLabel', tpl: '{0} Signature'},
                    labelWrap: true,
                    reference: 'clientReqCheckBox'
                },
                {
                    xtype: 'checkboxfield',
                    bind: '{selectedFWA.chiefSigReq}',
                    label: {_tr: 'crewChiefLabel', tpl: '{0} Signature'},
                    labelWrap: true,
                    reference: 'chiefReqCheckBox'
                }
            ],
            bind: {
                hidden: '{!newFwa}'
            }
        },
        {
            xtype: 'fieldset',
            reference: 'onlineSignatures',
            margin: '0 0 0 0',
            userCls: 'ts-required-field',
            itemId: 'signatureFields',
            bind: {
                title: 'Signatures',// '{settings.clientLabel} Signature {clientSigReqTxt}',
                hidden: '{hideSignaturePanel}'
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'fwaClientSignatures',
                    bind: {
                        hidden: '{hideFwaClientSignatures}'
                    },
                    items: [
                        {
                            xtype: 'button',
                            hidden: true,
                            iconCls: 'x-fa fa-remove',
                            itemId: 'deleteClientSignatureButton',
                            reference: 'deleteClientSignatureButton',
                            handler: 'onDeleteClientSignatureClick',
                            top: '2.8em',
                            right: '.0em',
                            bind: {
                                //hidden: '{newFwa}'
                            }
                        },
                        {
                            xtype: 'segmentedbutton',
                            allowMultiple: true,
                            items: [
                                {
                                    cls: 'ts-bt-margin-small',
                                    text: {_tr: 'clientLabel', tpl: 'Manage {0} Signature'},
                                    handler: 'onManageClientApproval',
                                    reference: 'clientApprovalButton',
                                    itemId: 'clientApprovalButton',
                                    width: '75%'
                                },
                                {
                                    text: 'View All',
                                    width: '25%',
                                    hidden: true,
                                    handler: 'viewAllClientSignatures',
                                    itemId: 'viewAllClientSignatureButton',
                                    reference: 'viewAllClientSignatureButton'
                                }
                            ]
                        },
                        {
                            xtype: 'image',
                            reference: 'clientApprovalImage',
                            itemId: 'clientApprovalImage',
                            attachmentId: null,
                            height: 75,
                            hidden: true
                        },
                        {
                            xtype: 'textfield',
                            labelWrap: true,
                            userCls: 'ts-long-label',
                            itemId: 'clientApprovalDate',
                            label: 'Signature Date',
                            bind: '{selectedFWA.clientApprovalDate}',
                            dateFormat: 'n/j/Y',
                            // component: {
                            //     useMask: false // This removes the trigger on the right side of the field that usually populates the picker
                            // },
                            readOnly: true // this ensures that field is not grayed out but no edit is allowed
                        },
                        {
                            xtype: 'container',
                            itemId: 'fwaChiefSignatures',
                            bind: {
                                //hidden: '{hideFwaChiefSignatures}' //'{newFwa}'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    hidden: true,
                                    iconCls: 'x-fa fa-remove',
                                    itemId: 'deleteChiefSignatureButton',
                                    reference: 'deleteChiefSignatureButton',
                                    handler: 'onDeleteChiefSignatureClick',
                                    top: '2.8em',
                                    right: '.0em'
                                },
                                {
                                    xtype: 'segmentedbutton',
                                    allowMultiple: true,
                                    items: [
                                        {
                                            cls: 'ts-bt-margin-small',
                                            text: {_tr: 'crewChiefLabel', tpl: 'Manage {0} Signature'},
                                            handler: 'onManageChiefApproval',
                                            reference: 'chiefApprovalButton',
                                            itemId: 'chiefApprovalButton',
                                            width: '75%'
                                        },
                                        {
                                            text: 'View All',
                                            width: '25%',
                                            hidden: true,
                                            handler: 'viewAllChiefSignatures',
                                            itemId: 'viewAllChiefSignatureButton',
                                            reference: 'viewAllChiefSignatureButton'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'image',
                                    reference: 'chiefApprovalImage',
                                    itemId: 'chiefApprovalImage',
                                    attachmentId: null,
                                    height: 75,
                                    hidden: true
                                },
                                {
                                    xtype: 'textfield',
                                    labelWrap: true,
                                    userCls: 'ts-long-label',
                                    itemId: 'chiefApprovalDate',
                                    label: 'Signature Date',
                                    bind: '{selectedFWA.chiefApprovalDate}',
                                    dateFormat: 'n/j/Y',
                                    // component: {
                                    //     useMask: false
                                    // },
                                    readOnly: true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    listeners: {
        painted: 'onClearDirty'
    }
})
;
