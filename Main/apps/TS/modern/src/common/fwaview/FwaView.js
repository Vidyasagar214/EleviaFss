Ext.define('TS.common.fwaview.FwaView', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-view',

    requires: [
        'TS.common.field.WBS'
    ],

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    approvalType: null,

    autoDestroy: true, //custom property implemented in the override

    layout: 'vbox',
    scrollable: 'y',
    items: [
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    align: 'right',
                    text: 'Close',
                    //action: 'close'
                    handler: function () {
                        this.up('sheet').hide();
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: {_tr: 'fwaLabel'},

            items: [
                {
                    xtype: 'textfield',
                    hidden: true,
                    bind: '{fwa.fwaId}'
                },
                {
                    xtype: 'displayfield',
                    reference: 'fwaNumField',
                    label: {_tr: 'fwaAbbrevLabel', tpl: '{0} #'},
                    bind: '{fwa.fwaNum}'
                },
                {
                    xtype: 'displayfield',
                    label: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                    reference: 'fwaNameField',
                    bind: '{fwa.fwaName}'
                },
                {
                    xtype: 'displayfield',
                    label: 'Status',
                    bind: '{fwa.fwaStatusString}'
                },
                {
                    xtype: 'button',
                    handler: 'onManageNotesTapView',
                    bind: {
                        iconCls: '{notesCls}',
                        hidden: '{!fwa.hasNotes}'
                    },
                    text: 'Notes',
                    cls: 'ts-bt-margin-small',
                    reference: 'notesButton'
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'General Information',
            items: [
                {
                    label: {_tr: 'wbs1Label', tpl: '{0} #'},
                    xtype: 'displayfield',
                    bind: '{fwa.wbs1}'
                },
                {
                    label: {_tr: 'wbs2Label', tpl: '{0} #'},
                    xtype: 'displayfield',
                    bind: {
                        value: '{fwa.wbs2}',
                        hidden: '{hideFwaWbs2}'
                    }
                },
                {
                    label: {_tr: 'wbs3Label', tpl: '{0} #'},
                    xtype: 'displayfield',
                    bind: {
                        value: '{fwa.wbs3}',
                        hidden: '{hideFwaWbs3}'
                    }
                },
                {
                    xtype: 'displayfield',
                    userCls: 'ts-long-label',
                    label: {_tr: 'wbs1Label', tpl: '{0} Name'},
                    bind: '{fwa.wbs1Name}'
                },
                {
                    xtype: 'displayfield',
                    userCls: 'ts-long-label',
                    label: {_tr: 'wbs2Label', tpl: '{0} Name'},
                    bind: {
                        bind: '{fwa.wbs2Name}',
                        hidden: '{hideFwaWbs2}'
                    }
                },
                {
                    xtype: 'displayfield',
                    label: {_tr: 'wbs3Label', tpl: '{0} Name'},
                    bind: {
                        bind: '{fwa.wbs3Name}',
                        hidden: '{hideFwaWbs3}'
                    }
                },
                {
                    xtype: 'displayfield',
                    userCls: 'ts-long-label',
                    label: {_tr: 'clientLabel', tpl: '{0} Name'},
                    bind: {
                        value: '{fwa.clientName}',
                        hidden: '{hideFwaDisplayClient}'
                    }
                },
                {
                    xtype: 'displayfield',
                    label: {_tr: 'contactLabel'},
                    bind: '{fwa.contactInfo}'
                },
                {
                    xtype: 'displayfield',
                    label: {_tr: 'crewLabel'},
                    bind: '{fwa.scheduledCrewName}'
                }, {
                    xtype: 'checkboxfield',
                    label: 'Contract?',
                    readOnly: true,
                    bind: '{fwa.isContractWork}'
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
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
                    itemId: 'udf_t1_combo',
                    reference: 'udf_t1_combo',
                    bind: {
                        value: '{selectedFWA.udf_t1}',
                        //readOnly: true, //{readOnlyUdf_t1}',
                        hidden: '{hideUdf_t1_combo}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t2_text',
                            reference: 'udf_t2_text',
                            label: {_tr: 'udf_t2_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t2}',
                                hidden: '{hideUdf_t2_text}',
                                readOnly: true //'{readOnlyUdf_t2}'
                            }
                        }
                    ]
                }, {
                    xtype: 'selectfield',
                    displayField: 'value',
                    valueField: 'key',
                    label: {_tr: 'udf_t2_Label'},
                    itemId: 'udf_t2_combo',
                    reference: 'udf_t2_combo',
                    bind: {
                        value: '{selectedFWA.udf_t2}',
                        //readOnly: true, //'{readOnlyUdf_t2}',
                        hidden: '{hideUdf_t2_combo}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t3_text',
                            reference: 'udf_t3_text',
                            label: {_tr: 'udf_t3_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t3}',
                                hidden: '{hideUdf_t3_text}',
                                //readOnly: true //'{readOnlyUdf_t3}'
                            },
                            readOnly: true
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
                    itemId: 'udf_t3_combo',
                    reference: 'udf_t3_combo',
                    bind: {
                        value: '{selectedFWA.udf_t3}',
                        hidden: '{hideUdf_t3_combo}',
                        //readOnly: true //'{readOnlyUdf_t3}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t4_text',
                            reference: 'udf_t4_text',
                            label: {_tr: 'udf_t4_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t4}',
                                hidden: '{hideUdf_t4_text}',
                                //readOnly: true //'{readOnlyUdf_t4}'
                            },
                            readOnly: true
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
                    itemId: 'udf_t4_combo',
                    reference: 'udf_t4_combo',
                    bind: {
                        value: '{selectedFWA.udf_t4}',
                        hidden: '{hideUdf_t4_combo}',
                        //readOnly: true, //'{readOnlyUdf_t4}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t5_text',
                            reference: 'udf_t5_text',
                            label: {_tr: 'udf_t5_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t5}',
                                hidden: '{hideUdf_t5_text}',
                                //readOnly: true //'{readOnlyUdf_t5}'
                            },
                            readOnly: true
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
                    itemId: 'udf_t5_combo',
                    reference: 'udf_t5_combo',
                    bind: {
                        value: '{selectedFWA.udf_t5}',
                        hidden: '{hideUdf_t5_combo}',
                        //readOnly: true //'{readOnlyUdf_t5}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t6_text',
                            reference: 'udf_t6_text',
                            label: {_tr: 'udf_t6_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t6}',
                                hidden: '{hideUdf_t6_text}',
                                //readOnly: true //'{readOnlyUdf_t6}'
                            },
                            readOnly: true
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
                    itemId: 'udf_t6_combo',
                    reference: 'udf_t6_combo',
                    bind: {
                        value: '{selectedFWA.udf_t6}',
                        hidden: '{hideUdf_t6_combo}',
                        //readOnly: true // '{readOnlyUdf_t6}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t7_text',
                            reference: 'udf_t7_text',
                            label: {_tr: 'udf_t7_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t7}',
                                hidden: '{hideUdf_t7_text}',
                                //readOnly: true //'{readOnlyUdf_t7}'
                            },
                            readOnly: true
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
                    itemId: 'udf_t7_combo',
                    reference: 'udf_t7_combo',
                    bind: {
                        value: '{selectedFWA.udf_t7}',
                        hidden: '{hideUdf_t7_combo}',
                        //readOnly: true //'{readOnlyUdf_t7}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t8_text',
                            reference: 'udf_t8_text',
                            label: {_tr: 'udf_t8_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t8}',
                                hidden: '{hideUdf_t8_text}',
                                //readOnly: true //'{readOnlyUdf_t8}'
                            },
                            readOnly: true
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
                    itemId: 'udf_t8_combo',
                    reference: 'udf_t8_combo',
                    bind: {
                        value: '{selectedFWA.udf_t8}',
                        hidden: '{hideUdf_t8_combo}',
                        //readOnly: true //'{readOnlyUdf_t8}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t9_text',
                            reference: 'udf_t9_text',
                            label: {_tr: 'udf_t9_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t9}',
                                hidden: '{hideUdf_t9_text}',
                                //readOnly: true //'{readOnlyUdf_t9}'
                            },
                            readOnly: true
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
                    itemId: 'udf_t9_combo',
                    reference: 'udf_t9_combo',
                    bind: {
                        value: '{selectedFWA.udf_t9}',
                        hidden: '{hideUdf_t9_combo}',
                        //readOnly: true //'{readOnlyUdf_t9}'
                    },
                    readOnly: true
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'udf_t10_text',
                            reference: 'udf_t10_text',
                            label: {_tr: 'udf_t10_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t10}',
                                hidden: '{hideUdf_t10_text}',
                                //readOnly: true //'{readOnlyUdf_t10}'
                            },
                            readOnly: true
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
                    itemId: 'udf_t10_combo',
                    reference: 'udf_t10_combo',
                    bind: {
                        value: '{selectedFWA.udf_t10}',
                        hidden: '{hideUdf_t10_combo}',
                        //readOnly: true //'{readOnlyUdf_t10}'
                    },
                    readOnly: true
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Work Address',
            items: [
                {
                    xtype: 'displayfield',
                    label: 'Address 1',
                    bind: '{fwa.loc.address1}'
                },
                {
                    xtype: 'displayfield',
                    label: 'Address 2',
                    bind: '{fwa.loc.address2}'
                },
                {
                    xtype: 'displayfield',
                    label: 'City',
                    bind: '{fwa.loc.city}'
                },
                {
                    xtype: 'displayfield',
                    label: 'State',
                    bind: '{fwa.loc.state}'
                },
                {
                    xtype: 'displayfield',
                    label: 'Zip',
                    bind: '{fwa.loc.zip}'
                },
                {
                    xtype: 'displayfield',
                    label: 'Latitude',
                    reference: 'locLatitude',
                    bind: '{fwa.loc.latitude}'
                },
                {
                    xtype: 'displayfield',
                    label: 'Longitude',
                    reference: 'locLongitude',
                    bind: '{fwa.loc.longitude}'
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a1_Label'},
                    itemId: 'udf_a1_text',
                    reference: 'udf_a1_text',
                    bind: {
                        value: '{selectedFWA.udf_a1}',
                        hidden: '{hideUdf_a1_text}',
                        //readOnly: true //'{readOnlyUdf_a1}'
                    },
                    readOnly: true
                }, {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a1_Label'},
                    itemId: 'udf_a1_combo',
                    reference: 'udf_a1_combo',
                    displayField: 'value',
                    valueField: 'key',
                    bind: {
                        value: '{selectedFWA.udf_a1}',
                        hidden: '{hideUdf_a1_combo}',
                        //readOnly: true //'{readOnlyUdf_a1}'
                    },
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a2_Label'},
                    itemId: 'udf_a2_text',
                    reference: 'udf_a2_text',
                    bind: {
                        value: '{selectedFWA.udf_a2}',
                        hidden: '{hideUdf_a2_text}',
                        //readOnly: true // '{readOnlyUdf_a2}'
                    },
                    readOnly: true
                }, {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a2_Label'},
                    itemId: 'udf_a2_combo',
                    reference: 'udf_a2_combo',
                    displayField: 'value',
                    valueField: 'key',
                    bind: {
                        value: '{selectedFWA.udf_a2}',
                        hidden: '{hideUdf_a2_combo}',
                        //readOnly: true // '{readOnlyUdf_a2}'
                    },
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a3_Label'},
                    itemId: 'udf_a3_text',
                    reference: 'udf_a3_text',
                    bind: {
                        value: '{selectedFWA.udf_a3}',
                        hidden: '{hideUdf_a3_text}',
                        //readOnly: true //'{readOnlyUdf_a3}'
                    },
                    readOnly: true
                }, {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a3_Label'},
                    displayField: 'value',
                    valueField: 'key',
                    itemId: 'udf_a3_combo',
                    reference: 'udf_a3_combo',
                    bind: {
                        value: '{selectedFWA.udf_a3}',
                        hidden: '{hideUdf_a3_combo}',
                        //readOnly: true //'{readOnlyUdf_a3}'
                    },
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a4_Label'},
                    itemId: 'udf_a4_text',
                    reference: 'udf_a4_text',
                    bind: {
                        value: '{selectedFWA.udf_a4}',
                        hidden: '{hideUdf_a4_text}',
                        //readOnly: true //'{readOnlyUdf_a4}'
                    },
                    readOnly: true
                }, {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a4_Label'},
                    displayField: 'value',
                    valueField: 'key',
                    itemId: 'udf_a4_combo',
                    reference: 'udf_a4_combo',
                    bind: {
                        value: '{selectedFWA.udf_a4}',
                        hidden: '{hideUdf_a4_combo}',
                        //readOnly: true //'{readOnlyUdf_a4}'
                    },
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a5_Label'},
                    itemId: 'udf_a5_text',
                    reference: 'udf_a5_text',
                    bind: {
                        value: '{selectedFWA.udf_a5}',
                        hidden: '{hideUdf_a5_text}',
                        //readOnly: true // '{readOnlyUdf_a5}'
                    },
                    readOnly: true
                }, {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a5_Label'},
                    displayField: 'value',
                    valueField: 'key',
                    itemId: 'udf_a5_combo',
                    reference: 'udf_a5_combo',
                    bind: {
                        value: '{selectedFWA.udf_a5}',
                        hidden: '{hideUdf_a5_combo}',
                        //readOnly: true // '{readOnlyUdf_a5}'
                    },
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a6_Label'},
                    itemId: 'udf_a6_text',
                    reference: 'udf_a6_text',
                    bind: {
                        value: '{selectedFWA.udf_a6}',
                        hidden: '{hideUdf_a6_text}',
                        //readOnly: true //'{readOnlyUdf_a6}'
                    },
                    readOnly: true
                }, {
                    xtype: 'selectfield',
                    label: {_tr: 'udf_a6_Label'},
                    displayField: 'value',
                    valueField: 'key',
                    itemId: 'udf_a6_combo',
                    reference: 'udf_a6_combo',
                    bind: {
                        value: '{selectedFWA.udf_a6}',
                        hidden: '{hideUdf_a6_combo}',
                        //readOnly: true // '{readOnlyUdf_a6}'
                    },
                    readOnly: true
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
            title: 'Date and Time',
            items: [
                {
                    xtype: 'datepickerfield',
                    label: 'Date Ordered',
                    bind: '{selectedFWA.dateOrdered}',
                    dateFormat: DATE_FORMAT,
                    component: {
                        useMask: false
                    },
                    readOnly: true,
                    listeners: {
                        change: function (obj, nValue, oValue) {
                            if (nValue < new Date('1/1/0001 12:30:00 AM')) {
                                obj.setValue('');
                            }
                        }
                    }
                },
                {
                    xtype: 'field-employee',
                    label: 'Ordered By',
                    itemId: 'orderedByField',
                    bind: '{selectedFWA.orderedBy}',
                    readOnly: true
                },
                {
                    xtype: 'datepickerfield',
                    label: 'Date Required',
                    bind: '{selectedFWA.dateRequired}',
                    dateFormat: DATE_FORMAT,
                    component: {
                        useMask: false
                    },
                    readOnly: true,
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
                    bind: {
                        value: '{selectedFWA.udf_d1}',
                        hidden: '{hideUdf_d1}',
                        readOnly: '{readOnlyUdf_d1}'
                    },
                    dateFormat: DATE_FORMAT,
                    component: {
                        useMask: false
                    },
                    readOnly: true,
                    listeners: {
                        painted: function (obj) {
                            if (obj.component.getValue() == null || Ext.Date.format(obj.component.getValue(), DATE_FORMAT) < '01/01/2002') {
                                obj.component.setValue('');
                            }
                        }
                    }
                },
                {
                    xtype: 'datepickerfield',
                    label: {_tr: 'udf_d2_Label'},
                    bind: {
                        value: '{selectedFWA.udf_d2}',
                        hidden: '{hideUdf_d2}',
                        readOnly: '{readOnlyUdf_d2}'
                    },
                    dateFormat: DATE_FORMAT,
                    component: {
                        useMask: false
                    },
                    readOnly: true,
                    listeners: {
                        painted: function (obj) {
                            if (Ext.Date.format(obj.component.getValue(), DATE_FORMAT) < '01/01/2002') {
                                obj.component.setValue('');
                                return '';
                            }
                        }
                    }
                },
                {
                    xtype: 'datepickerfield',
                    label: {_tr: 'udf_d3_Label'},
                    bind: {
                        value: '{selectedFWA.udf_d3}',
                        hidden: '{hideUdf_d3}',
                        readOnly: '{readOnlyUdf_d3}'
                    },
                    dateFormat: DATE_FORMAT,
                    component: {
                        useMask: false
                    },
                    readOnly: true,
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
                    label: 'Start Date',
                    bind: '{fwa.schedStartDate}',
                    dateFormat: DATE_FORMAT,
                    component: {
                        useMask: false
                    },
                    readOnly: true
                },
                {
                    xtype: 'timepickerfield',
                    label: 'Start Time',
                    bind: '{fwa.schedStartDate}',
                    dateFormat: 'g:i A',
                    component: {
                        useMask: false
                    },
                    readOnly: true,
                    disabled: true,
                    disabledCls: ''
                },
                {
                    xtype: 'datepickerfield',
                    label: 'End Date',
                    bind: '{fwa.schedEndDate}',
                    dateFormat: DATE_FORMAT,
                    component: {
                        useMask: false
                    },
                    readOnly: true
                },
                {
                    xtype: 'timepickerfield',
                    label: 'End Time',
                    bind: '{fwa.schedEndDate}',
                    dateFormat: 'g:i A',
                    component: {
                        useMask: false
                    },
                    readOnly: true,
                    disabled: true,
                    disabledCls: ''
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Manage',
            cls: 'ts-fieldset-nbr',
            items: [
                {
                    xtype: 'button',
                    handler: 'onManageWorkCodesTapView',
                    text: {_tr: 'workCodeLabelPlural', tpl: '{0}'},
                    reference: 'manageWorkCodeButton'
                },
                {
                    xtype: 'button',
                    handler: 'onManageUnitsTapView',
                    text: {_tr: 'unitLabelPlural', tpl: '{0}'},
                    reference: 'manageUnitsButton',
                    bind: {
                        hidden: '{!fwaUnitsEnabled}'
                    }
                },
                {
                    xtype: 'button',
                    handler: 'onManageHoursTapView',
                    text: 'Employee Hours',
                    reference: 'manageHoursButton'
                },
                {
                    xtype: 'button',
                    handler: 'onManageExpensesTapView',
                    text: 'Employee Expenses',
                    reference: 'manageExpensesButton'
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: {_tr: 'clientLabel', tpl: '{0} Signature'},
            userCls: 'ts-required-field',
            items: [
                {
                    xtype: 'textfield',
                    userCls: 'ts-long-label',
                    label: 'Signature Date',
                    bind: '{fwa.clientApprovalDate}',
                    itemId: 'clientApprovalDate',
                    dateFormat: 'n/j/Y',
                    component: {
                        useMask: false // This removes the trigger on the right side of the field that usually populates the picker
                    },
                    readOnly: true // this ensures that field is not grayed out but no edit is allowed
                },
                {
                    xtype: 'image',
                    itemId: 'clientApprovalImage',
                    height: 150
                }
                ,
                {
                    xtype: 'button',
                    text: 'View All',
                    handler: 'viewAllClientSignatures',
                    itemId: 'viewAllClientSignatureButton'

                }
            ],
            reference: 'clientApprovalButton',
            itemId: 'clientApprovalButton'
        },
        {
            xtype: 'fieldset',
            title: {_tr: 'crewChiefLabel', tpl: '{0} Signature'},
            items: [
                {
                    xtype: 'textfield',
                    userCls: 'ts-long-label',
                    label: 'Signature Date',
                    bind: '{fwa.chiefApprovalDate}',
                    itemId: 'chiefApprovalDate',
                    dateFormat: 'n/j/Y',
                    component: {
                        useMask: false
                    },
                    readOnly: true
                },
                {
                    xtype: 'image',
                    itemId: 'chiefApprovalImage',
                    height: 150
                }
                ,
                {
                    xtype: 'button',
                    text: 'View All',
                    handler: 'viewAllChiefSignatures',
                    itemId: 'viewAllChiefSignatureButton'

                }
            ],
            reference: 'chiefApprovalButton',
            itemId: 'chiefApprovalButton'
        },

        // {
        //     xtype: 'fieldset',
        //     title: 'Employee Hours',
        //     cls: 'ts-fieldset-nbr',
        //     items: [
        //         {
        //             xtype: 'button',
        //             handler: 'onManageHoursTapView',
        //             text: 'View Employee Hours',
        //             reference: 'manageHoursButton'
        //         }
        //     ]
        // },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Open',
                    align: 'right',
                    ui: 'action',
                    iconCls: 'x-fa fa-folder-open-o',
                    handler: 'doOpenFwa',
                    itemId: 'fwaOpenButton',
                    reference: 'fwaOpenButton',
                    margin: '0 5 0 0',
                    bind: {
                        hidden: '{!canWindowFwaCopyOpen}'
                    }
                },
                {
                    text: 'Copy',
                    align: 'right',
                    ui: 'action',
                    iconCls: 'x-fa fa-copy',
                    handler: 'doCopyFwa',
                    itemId: 'fwaCopyButton',
                    reference: 'fwaCopyButton',
                    bind: {
                        hidden: '{!canWindowFwaCopyOpen}'
                    }
                }
            ]
        }
    ]
});