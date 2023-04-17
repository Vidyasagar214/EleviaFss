Ext.define('TS.view.fwa.DateTime', {

    extend: 'Ext.form.FieldSet',

    xtype: 'fieldset-datetime',

    requires: [
        'TS.common.field.AllEmployeesWithSchedulers'
    ],

    title: 'Dates & Times',

    items: [
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            defaults: {
                labelWidth: 110,
                labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                // height: 30,
                width: 255
            },
            items: [
                {
                    xtype: 'datefield',
                    editable: false,
                    fieldLabel: 'Date Ordered',
                    pickerAlign: 'tl-bl?',
                    name: 'dateOrdered',
                    reference: 'dateOrderedField',
                    labelStyle: 'overflow-wrap: normal; padding-left: 5px;',
                    publishes: [
                        'value',
                        'dirty'
                    ]
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                {
                    xtype: 'field-allemployeewithschedulers',
                    name: 'orderedBy',
                    fieldLabel: 'Ordered By',
                    labelStyle: 'overflow-wrap: normal; padding-left: 5px;',
                    //width: 275,
                    publishes: [
                        'value',
                        'dirty'
                    ]
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                // {
                //     xtype: 'button',
                //     width: 120,
                //     margin: '0 0 0 10',
                //     //iconCls: 'x-fa fa-recycle',
                //     text: 'Clear Dates',
                //     handler: 'onResetDates'
                // }
            ]
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },

            defaults: {
                labelWidth: 110,
                labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                // height: 30,
                width: 255
            },
            items: [
                {
                    xtype: 'datefield',
                    editable: false,
                    fieldLabel: 'Date Required',
                    labelStyle: 'overflow-wrap: normal; padding-left: 5px;',
                    pickerAlign: 'tl-bl?',
                    name: 'dateRequired',
                    reference: 'dateRequiredField',
                    publishes: [
                        'value',
                        'dirty'
                    ]
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                {
                    xtype: 'datefield',
                    editable: false,
                    fieldLabel: {_tr: 'udf_d1_Label'},
                    labelStyle: 'overflow-wrap: normal; padding-left: 5px;',
                    pickerAlign: 'tl-bl?',
                    name: 'udf_d1',
                    reference: 'udf_d1_field',
                    itemId: 'udf_d1_field',
                    bind: {
                        hidden: '{hideUdf_d1}',
                        disabled: '{readOnlyUdf_d1}'
                    },
                    disabledCls: '',
                    listeners: {
                        render: function (c) {
                            // new Ext.ToolTip({
                            //     target : c.labelEl.dom,
                            //     html: c.fieldLabel
                            // });
                            if (c.getValue() < new Date('1/1/2002')) {
                                c.setValue('');
                            }
                        }
                    },
                    publishes: [
                        'value',
                        'dirty'
                    ]
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },

            defaults: {
                labelWidth: 110,
                labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                // height: 30,
                width: 255
            },
            items: [
                {
                    xtype: 'datefield',
                    editable: false,
                    fieldLabel: {_tr: 'udf_d2_Label'},
                    labelStyle: 'overflow-wrap: normal; padding-left: 5px;',
                    pickerAlign: 'tl-bl?',
                    name: 'udf_d2',
                    reference: 'udf_d2_field',
                    itemId: 'udf_d2_field',
                    bind: {
                        hidden: '{hideUdf_d2}',
                        disabled: '{readOnlyUdf_d2}'
                    },
                    disabledCls: '',
                    listeners: {
                        render: function (c) {
                            // new Ext.ToolTip({
                            //     target : c.labelEl.dom,
                            //     html: c.fieldLabel
                            // });
                            if (c.getValue() < new Date('1/1/2002')) {
                                c.setValue('');
                            }
                        }
                    },
                    publishes: [
                        'value',
                        'dirty'
                    ]
                },
                {
                    xtype: 'tbspacer',
                    width: 10,
                    bind: {
                        hidden: '{hideUdf_d2}'
                    }
                },
                {
                    xtype: 'datefield',
                    editable: false,
                    fieldLabel: {_tr: 'udf_d3_Label'},
                    labelStyle: 'overflow-wrap: normal; padding-left: 5px;',
                    pickerAlign: 'tl-bl?',
                    name: 'udf_d3',
                    reference: 'udf_d3_field',
                    itemId: 'udf_d3_field',
                    bind: {
                        hidden: '{hideUdf_d3}',
                        disabled: '{readOnlyUdf_d3}'
                    },
                    disabledCls: '',
                    listeners: {
                        render: function (c) {
                            // new Ext.ToolTip({
                            //     target : c.labelEl.dom,
                            //     html: c.fieldLabel
                            // });
                            if (c.getValue() < new Date('1/1/2002')) {
                                c.setValue('');
                            }
                        }
                    },
                    publishes: [
                        'value',
                        'dirty'
                    ]
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            defaults: {
                labelWidth: 110,
                labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                // height: 30,
                width: 255
            },
            items: [
                {
                    xtype: 'button',
                    width: 120,
                    margin: '0 0 0 10',
                    //iconCls: 'x-fa fa-recycle',
                    text: 'Clear Dates',
                    handler: 'onResetDates'
                },
            ]
        },
        {
            xtype: 'tbspacer',
            height: 10
        },
        {
            xtype: 'box',
            autoEl: {tag: 'hr'}
        },
        {
            xtype: 'tbspacer',
            height: 10
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            defaults: {
                labelWidth: 110,
                labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                // height: 30,
                width: 255
            },
            items: [
                {
                    xtype: 'datefield',
                    editable: false,
                    fieldLabel: 'Start Date',
                    pickerAlign: 'tl-bl?',
                    name: 'schedStartDate',
                    reference: 'schedStartDateField',
                    itemId: 'schedStartDateField',
                    publishes: [
                        'value',
                        'dirty'
                    ],
                    listeners: {
                        change: 'onStartDateChange',
                        validitychange: 'onDateValidityChange'
                    },
                    bind: {
                        //maxValue: '{schedEndDateField.value}'
                    }
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                {
                    xtype: 'timefield',
                    editable: false,
                    fieldLabel: 'Start Time',
                    name: 'schedStartDate',
                    reference: 'schedStartTimeField',
                    itemId: 'schedStartTimeField',
                    submitValue: false,
                    excludeForm: true,
                    listeners: {
                        change: 'startEndTimeChange',
                        validitychange: 'onTimeValidityChange'
                    },
                    //width: 300,
                    publishes: [
                        'value',
                        'dirty'
                    ]
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                // {
                //     xtype: 'button',
                //     width: 120,
                //     margin: '0 0 0 10',
                //     //iconCls: 'x-fa fa-recycle',
                //     text: 'Clear Start/End',
                //     handler: 'onResetStartEndDateTime',
                //     reference: 'resetStartEndDateTimeBtn'
                // }
            ]
        },
        {
            xtype: 'tbspacer',
            width: 10
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },

            defaults: {
                labelWidth: 110,
                labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                // height: 30,
                width: 255
            },
            items: [
                {
                    xtype: 'datefield',
                    editable: false,
                    fieldLabel: 'End Date',
                    name: 'schedEndDate',
                    pickerAlign: 'tl-bl?',
                    reference: 'schedEndDateField',
                    itemId: 'schedEndDateField',
                    publishes: [
                        'value',
                        'dirty'
                    ],
                    readOnly: true,
                    listeners: {
                        change: 'onEndDateChange',
                        validitychange: 'onDateValidityChange'
                    }
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                {
                    xtype: 'timefield',
                    editable: false,
                    fieldLabel: 'End Time',
                    name: 'schedEndDate',
                    reference: 'schedEndTimeField',
                    itemId: 'schedEndTimeField',
                    //width: 300,
                    listeners: {
                        change: 'startEndTimeChange',
                        validitychange: 'onTimeValidityChange'
                    },
                    publishes: [
                        'value',
                        'dirty'
                    ]
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },

            defaults: {
                labelWidth: 110,
                labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                // height: 30,
                width: 255
            },
            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Day(s)',
                    reference: 'fwaDayCount',
                    itemId: 'fwaDayCount',
                    publishes: [
                        'value',
                        'dirty'
                    ]
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Duration',
                    name: 'duration',
                    reference: 'recurDurationDate',
                    itemId: 'recurDurationDate',
                    //width: 285,
                    publishes: [
                        'value',
                        'dirty'
                    ]
                },
                {
                    xtype: 'tbspacer',
                    width: 20
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },

            defaults: {
                labelWidth: 110,
                labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
                // height: 30,
                width: 255
            },

            items: [
                {
                    xtype: 'button',
                    width: 120,
                    margin: '0 10 0 10',
                    //iconCls: 'x-fa fa-recycle',
                    text: 'Clear Start/End',
                    handler: 'onResetStartEndDateTime',
                    reference: 'resetStartEndDateTimeBtn'
                },
                {
                    xtype: 'tbspacer',
                    width: 130
                },
                {
                    xtype: 'button',
                    width: 165,
                    itemId: 'recurrenceButton',
                    bind: {
                        iconCls: '{recurrenceBtn}',
                        hidden: '{!showCreate}'
                    },
                    text: 'Create Recurrence',
                    handler: 'onFwaRecurrsion',
                    margin: '0 0 5 0'
                },
                {
                    xtype: 'button',
                    width: 165,
                    itemId: 'recurrenceButtonEdit',
                    style: 'background: red !important;',
                    bind: {
                        iconCls: '{recurrenceBtn}',
                        hidden: '{showCreate}'
                    },
                    text: 'Edit Recurrence',
                    hidden: true,
                    handler: 'onFwaRecurrsion',
                    margin: '0 0 5 0'
                }
            ]
        }
    ]

    // items: [
    //     {
    //         xtype: 'fieldcontainer',
    //         layout: {
    //             type: 'hbox'
    //         },
    //         defaults: {
    //             labelWidth: 110,
    //             labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
    //             // height: 30,
    //             width: 255
    //         },
    //         items: [
    //             {
    //                 xtype: 'datefield',
    //                 editable: false,
    //                 fieldLabel: 'Date Ordered',
    //                 pickerAlign: 'tl-bl?',
    //                 name: 'dateOrdered',
    //                 reference: 'dateOrderedField',
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 10
    //             },
    //             {
    //                 xtype: 'field-allemployeewithschedulers',
    //                 name: 'orderedBy',
    //                 fieldLabel: 'Ordered By',
    //                 itemId: 'orderedByField',
    //                 //width: 275,
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 10
    //             },
    //             {
    //                 xtype: 'button',
    //                 width: 120,
    //                 margin: '0 0 0 10',
    //                 //iconCls: 'x-fa fa-recycle',
    //                 text: 'Clear Dates',
    //                 handler: 'onResetDates'
    //             }
    //         ]
    //     },
    //     {
    //         xtype: 'fieldcontainer',
    //         layout: {
    //             type: 'hbox'
    //         },
    //
    //         defaults: {
    //             labelWidth: 110,
    //             labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
    //             // height: 30,
    //             width: 255
    //         },
    //         items: [
    //             {
    //                 xtype: 'datefield',
    //                 editable: false,
    //                 fieldLabel: 'Date Required',
    //                 pickerAlign: 'tl-bl?',
    //                 name: 'dateRequired',
    //                 reference: 'dateRequiredField',
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 10
    //             },
    //             {
    //                 xtype: 'datefield',
    //                 editable: false,
    //                 fieldLabel: {_tr: 'udf_d1_Label'},
    //                 pickerAlign: 'tl-bl?',
    //                 name: 'udf_d1',
    //                 reference: 'udf_d1_field',
    //                 itemId: 'udf_d1_field',
    //                 bind: {
    //                     hidden: '{hideUdf_d1}',
    //                     disabled: '{readOnlyUdf_d1}'
    //                 },
    //                 disabledCls: '',
    //                 listeners: {
    //                     render : function(c) {
    //                         // new Ext.ToolTip({
    //                         //     target : c.labelEl.dom,
    //                         //     html: c.fieldLabel
    //                         // });
    //                         if(c.getValue() < new Date('1/1/2002')){
    //                             c.setValue('');
    //                         }
    //                     }
    //                 },
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         xtype: 'fieldcontainer',
    //         layout: {
    //             type: 'hbox'
    //         },
    //
    //         defaults: {
    //             labelWidth: 110,
    //             labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
    //             // height: 30,
    //             width: 255
    //         },
    //         items: [
    //             {
    //                 xtype: 'datefield',
    //                 editable: false,
    //                 fieldLabel: {_tr: 'udf_d2_Label'},
    //                 pickerAlign: 'tl-bl?',
    //                 name: 'udf_d2',
    //                 reference: 'udf_d2_field',
    //                 itemId: 'udf_d2_field',
    //                 bind: {
    //                     hidden: '{hideUdf_d2}',
    //                     disabled: '{readOnlyUdf_d2}'
    //                 },
    //                 disabledCls: '',
    //                 listeners: {
    //                     render : function(c) {
    //                         // new Ext.ToolTip({
    //                         //     target : c.labelEl.dom,
    //                         //     html: c.fieldLabel
    //                         // });
    //                         if(c.getValue() < new Date('1/1/2002')){
    //                             c.setValue('');
    //                         }
    //                     }
    //                 },
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 10,
    //                 bind: {
    //                     hidden: '{hideUdf_d2}'
    //                 }
    //             },
    //             {
    //                 xtype: 'datefield',
    //                 editable: false,
    //                 fieldLabel: {_tr: 'udf_d3_Label'},
    //                 pickerAlign: 'tl-bl?',
    //                 name: 'udf_d3',
    //                 reference: 'udf_d3_field',
    //                 itemId: 'udf_d3_field',
    //                 bind: {
    //                     hidden: '{hideUdf_d3}',
    //                     disabled: '{readOnlyUdf_d3}'
    //                 },
    //                 disabledCls: '',
    //                 listeners: {
    //                     render : function(c) {
    //                         // new Ext.ToolTip({
    //                         //     target : c.labelEl.dom,
    //                         //     html: c.fieldLabel
    //                         // });
    //                         if(c.getValue() < new Date('1/1/2002')){
    //                             c.setValue('');
    //                         }
    //                     }
    //                 },
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         xtype: 'tbspacer',
    //         height: 10
    //     },
    //     {
    //         xtype: 'box',
    //         autoEl: {tag: 'hr'}
    //     },
    //     {
    //         xtype: 'tbspacer',
    //         height: 10
    //     },
    //     {
    //         xtype: 'fieldcontainer',
    //         layout: {
    //             type: 'hbox'
    //         },
    //         defaults: {
    //             labelWidth: 110,
    //             labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
    //             // height: 30,
    //             width: 255
    //         },
    //         items: [
    //             {
    //                 xtype: 'datefield',
    //                 editable: false,
    //                 fieldLabel: 'Start Date',
    //                 pickerAlign: 'tl-bl?',
    //                 name: 'schedStartDate',
    //                 reference: 'schedStartDateField',
    //                 itemId: 'schedStartDateField',
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ],
    //                 listeners: {
    //                     change: 'onStartDateChange',
    //                     validitychange: 'onDateValidityChange'
    //                 },
    //                 bind: {
    //                     //maxValue: '{schedEndDateField.value}'
    //                 }
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 10
    //             },
    //             {
    //                 xtype: 'timefield',
    //                 editable: false,
    //                 fieldLabel: 'Start Time',
    //                 name: 'schedStartDate',
    //                 reference: 'schedStartTimeField',
    //                 itemId: 'schedStartTimeField',
    //                 submitValue: false,
    //                 excludeForm: true,
    //                 listeners: {
    //                     change: 'startEndTimeChange',
    //                     validitychange: 'onTimeValidityChange'
    //                 },
    //                 //width: 300,
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 10
    //             },
    //             {
    //                 xtype: 'button',
    //                 width: 120,
    //                 margin: '0 0 0 10',
    //                 //iconCls: 'x-fa fa-recycle',
    //                 text: 'Clear Start/End',
    //                 handler: 'onResetStartEndDateTime',
    //                 reference: 'resetStartEndDateTimeBtn'
    //             }
    //         ]
    //     },
    //     {
    //         xtype: 'tbspacer',
    //         width: 10
    //     },
    //     {
    //         xtype: 'fieldcontainer',
    //         layout: {
    //             type: 'hbox'
    //         },
    //
    //         defaults: {
    //             labelWidth: 110,
    //             labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
    //             // height: 30,
    //             width: 255
    //         },
    //         items: [
    //             {
    //                 xtype: 'datefield',
    //                 editable: false,
    //                 fieldLabel: 'End Date',
    //                 name: 'schedEndDate',
    //                 pickerAlign: 'tl-bl?',
    //                 reference: 'schedEndDateField',
    //                 itemId: 'schedEndDateField',
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ],
    //                 readOnly: true,
    //                 listeners: {
    //                     change: 'onEndDateChange',
    //                     validitychange: 'onDateValidityChange'
    //                 }
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 10
    //             },
    //             {
    //                 xtype: 'timefield',
    //                 editable: false,
    //                 fieldLabel: 'End Time',
    //                 name: 'schedEndDate',
    //                 reference: 'schedEndTimeField',
    //                 itemId: 'schedEndTimeField',
    //                 //width: 300,
    //                 listeners: {
    //                     change: 'startEndTimeChange',
    //                     validitychange: 'onTimeValidityChange'
    //                 },
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         xtype: 'fieldcontainer',
    //         layout: {
    //             type: 'hbox'
    //         },
    //
    //         defaults: {
    //             labelWidth: 110,
    //             labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
    //             // height: 30,
    //             width: 255
    //         },
    //         items: [
    //             {
    //                 xtype: 'displayfield',
    //                 fieldLabel: 'Day(s)',
    //                 reference: 'fwaDayCount',
    //                 itemId: 'fwaDayCount',
    //                 //width: 285,
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 10
    //             },
    //             {
    //                 xtype: 'displayfield',
    //                 fieldLabel: 'Duration',
    //                 name: 'duration',
    //                 reference: 'recurDurationDate',
    //                 itemId: 'recurDurationDate',
    //                 //width: 285,
    //                 publishes: [
    //                     'value',
    //                     'dirty'
    //                 ]
    //             },
    //             {
    //                 xtype: 'tbspacer',
    //                 width: 20
    //             }
    //         ]
    //     },
    //     {
    //         xtype: 'fieldcontainer',
    //         layout: {
    //             type: 'hbox'
    //         },
    //
    //         defaults: {
    //             labelWidth: 110,
    //             labelStyle: 'white-space: nowrap; overflow: hidden;text-overflow: ellipsis; padding-left: 5px;',
    //             // height: 30,
    //             width: 255
    //         },
    //         items:[
    //             {
    //                 xtype: 'button',
    //                 width: 165,
    //                 itemId: 'recurrenceButton',
    //                 bind: {
    //                     iconCls: '{recurrenceBtn}',
    //                     hidden: '{!showCreate}'
    //                 },
    //                 text: 'Create Recurrence',
    //                 handler: 'onFwaRecurrsion',
    //                 margin: '0 0 5 0'
    //             },
    //             {
    //                 xtype: 'button',
    //                 width: 165,
    //                 itemId: 'recurrenceButtonEdit',
    //                 style: 'background: red !important;',
    //                 bind: {
    //                     iconCls: '{recurrenceBtn}',
    //                     hidden: '{showCreate}'
    //                 },
    //                 text: 'Edit Recurrence',
    //                 hidden: true,
    //                 handler: 'onFwaRecurrsion',
    //                 margin: '0 0 5 0'
    //             }
    //         ]
    //     }
    // ]
});
