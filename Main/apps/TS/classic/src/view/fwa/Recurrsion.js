/**
 * Created by steve.tess on 1/26/2017.
 */
Ext.define('TS.view.fwa.Recurrsion', {
    extend: 'Ext.window.Window',

    xtype: 'window-recurrsions',

    requires: [
        'Ext.form.field.Time',
        'TS.controller.fwa.RecurrsionController'
    ],

    controller: 'recurrsion',

    modal: true,
    title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Recurrence'},

    items: [
        {
            xtype: 'fieldset',
            margin: 10,
            title: {_tr: 'fwaAbbrevLabel', tpl: '{0} Time'},
            items: [
                {
                    xtype: 'timefield',
                    fieldLabel: 'Start Time',
                    reference: 'recurStart',
                    itemId: 'recurStartTime',
                    name: 'recurStart',
                    increment: 15,
                    // bind: {
                    //     minValue: '{settings.schedVisibleHoursStart}',
                    //     maxValue: '{settings.schedVisibleHoursEnd}'
                    // },
                    listeners: {
                        change: 'onTimeChange'
                    }
                },
                {
                    xtype: 'timefield',
                    fieldLabel: 'End Time',
                    reference: 'recurEnd',
                    itemId: 'recurEndTime',
                    increment: 15,
                    bind: {
                        minValue: '{settings.schedVisibleHoursStart}',
                        maxValue: '{settings.schedVisibleHoursEnd}'
                    },
                    listeners: {
                        change: 'onTimeChange'
                    }
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Duration',
                    reference: 'recurDuration',
                    itemId: 'recurDuration',
                    store: 'Duration',
                    queryMode: 'local',
                    displayField: 'description',
                    valueField: 'value',
                    listeners: {
                        change: 'onTimeChange'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            margin: 10,
            title: 'Recurrence Pattern',
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            defaultType: 'radiofield',
                            defaults: {
                                flex: 1
                            },
                            border: '0 2 0 0',
                            style: {
                                borderColor: '#b0b0b0',
                                borderStyle: 'solid'
                            },
                            layout: 'vbox',
                            margin: '0 10 0 0',
                            items: [
                                {
                                    boxLabel: 'Daily',
                                    name: 'rPattern',
                                    margin: '0 10 0 0',
                                    inputValue: 'd',
                                    itemId: 'rDailyFreq',
                                    reference: 'rDailyFreq',
                                    listeners: {
                                        change: 'onRecurrencePatternChange'
                                    }
                                }, {
                                    boxLabel: 'Weekly',
                                    margin: '0 10 0 0',
                                    name: 'rPattern',
                                    inputValue: 'w',
                                    itemId: 'rWeeklyFreq',
                                    reference: 'rWeeklyFreq',
                                    listeners: {
                                        change: 'onRecurrencePatternChange'
                                    }
                                }, {
                                    boxLabel: 'Monthly',
                                    margin: '0 10 0 0',
                                    name: 'rPattern',
                                    inputValue: 'm',
                                    itemId: 'rMonthlyFreq',
                                    reference: 'rMonthlyFreq',
                                    listeners: {
                                        change: 'onRecurrencePatternChange'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            margin: '0 0 0 10',
                            reference: 'dailyFieldset',
                            hidden: true,
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'radio',
                                            boxLabel: 'Every',
                                            name: 'rDailyPattern',
                                            inputValue: 'y',
                                            reference: 'rEveryDay',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        },
                                        {
                                            xtype: 'numberfield',
                                            width: 50,
                                            margin: '0 5 0 15',
                                            minValue: 0,
                                            reference: 'rDailyInterval',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'day(s)'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'radio',
                                            boxLabel: 'Every weekday',
                                            name: 'rDailyPattern',
                                            inputValue: 'y',
                                            reference: 'rEveryWeekday',
                                            listeners: {
                                                change: 'onDailyRecurrenceChange'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            margin: '0 0 0 10',
                            reference: 'weeklyFieldset',
                            hidden: true,
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Recur every'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            width: 50,
                                            margin: '0 5 0 15',
                                            reference: 'rWeeklyInterval',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'week(s) on:'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    defaultType: 'checkboxfield',
                                    items: [
                                        {
                                            boxLabel: 'Sunday',
                                            margin: '0 0 0 25',
                                            name: 'sunday',
                                            inputValue: 'sun',
                                            itemId: 'cbSun',
                                            reference: 'cbSun',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        }, {
                                            boxLabel: 'Monday',
                                            margin: '0 0 0 10',
                                            name: 'monday',
                                            inputValue: 'mon',
                                            itemId: 'cbMon',
                                            reference: 'cbMon',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        }, {
                                            boxLabel: 'Tuesday',
                                            margin: '0 0 0 10',
                                            name: 'tuesday',
                                            inputValue: 'tue',
                                            itemId: 'cbTue',
                                            reference: 'cbTue',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        }, {
                                            boxLabel: 'Wednesday',
                                            margin: '0 0 0 10',
                                            name: 'wednesday',
                                            inputValue: 'wed',
                                            itemId: 'cbWed',
                                            reference: 'cbWed',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        }
                                    ]
                                }, {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    defaultType: 'checkboxfield',
                                    items: [
                                        {
                                            boxLabel: 'Thursday',
                                            margin: '0 0 0 25',
                                            name: 'thursday',
                                            inputValue: 'thu',
                                            itemId: 'cbThu',
                                            reference: 'cbThu',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        }, {
                                            boxLabel: 'Friday',
                                            name: 'friday',
                                            margin: '0 0 0 10',
                                            inputValue: 'fri',
                                            itemId: 'cbFri',
                                            reference: 'cbFri',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        }
                                        , {
                                            boxLabel: 'Saturday',
                                            name: 'saturday',
                                            margin: '0 0 0 10',
                                            inputValue: 'sat',
                                            itemId: 'cbSat',
                                            reference: 'cbSat',
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            reference: 'monthlyFieldset',
                            margin: '0 0 0 10',
                            hidden: true,
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'radio',
                                            boxLabel: 'Day',
                                            name: 'rMonthlyDay',
                                            inputValue: 'day',
                                            itemId: 'rMonthlyDay',
                                            reference: 'rMonthlyDay',
                                            margin: '0 10 0 0',
                                            listeners: {
                                                change: 'onMonthlyRecurrenceChange'
                                            }
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'mlyDayNumber',
                                            reference: 'mlyDayNumber',
                                            name: 'mlyDayNumber',
                                            labelAlign: 'right',
                                            width: 50,
                                            maxValue: 31,
                                            minValue: 1,
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'of every',
                                            width: 50,
                                            margin: '0 10 0 10'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'rMonthlyInterval',
                                            reference: 'rMonthlyInterval',
                                            name: 'mlyMonthNumber',
                                            width: 50,
                                            maxValue: 12,
                                            listeners: {
                                                change: 'onChange'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'month(s)',
                                            margin: '0 0 0 10'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'radio',
                                            boxLabel: 'The',
                                            name: 'rMonthlyDay',
                                            inputValue: 'daySequence',
                                            itemId: 'rMonthlySequence',
                                            reference: 'rMonthlySequence',
                                            margin: '0 10 0 0',
                                            listeners: {
                                                change: 'onMonthlyRecurrenceChange'
                                            }
                                        },
                                        {
                                            xtype: 'combobox',
                                            reference: 'monthDaySequence',
                                            store: 'DaySequence',
                                            width: 75,
                                            margin: '0 10 0 0',
                                            queryMode: 'local',
                                            displayField: 'description',
                                            valueField: 'value',
                                            listeners:{
                                                change: 'onChange'
                                            }
                                        },
                                        {
                                            xtype: 'combobox',
                                            reference: 'monthWeekdaySequence',
                                            store: 'WeekdaySequence',
                                            width: 100,
                                            margin: '0 10 0 0',
                                            queryMode: 'local',
                                            displayField: 'description',
                                            valueField: 'value',
                                            listeners:{
                                                change: 'onChange'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'of every',
                                            width: 50,
                                            margin: '0 10 0 0'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            reference: 'rMonthlyInterval2',
                                            name: 'mlyMonthNumber',
                                            width: 50,
                                            maxValue: 12,
                                            minValue: 1,
                                            listeners:{
                                                change: 'onChange'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'month(s)',
                                            margin: '0 0 0 10'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'fieldset',
            margin: 10,
            title: 'Range of Recurrence',
            layout: 'hbox',
            items: [
                {
                    xtype: 'datefield',
                    fieldLabel: 'Start',
                    width: 270,
                    reference: 'rangeRecurrenceStartDate',
                    //format: 'l m/d/Y',
                    listeners: {
                        change: 'onDateChange'
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'radio',
                            boxLabel: 'No end date',
                            name: 'rRangeRecurrence',
                            inputValue: 'noday',
                            itemId: 'rNoEndDate',
                            reference: 'rNoEndDate',
                            margin: '0 10 0 10',
                            listeners: {
                                change: 'onRangeRecurrenceChange'
                            }
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'radio',
                                    boxLabel: 'End after: ',
                                    name: 'rRangeRecurrence',
                                    itemId: 'endAfterCheckBox',
                                    reference: 'endAfterCheckBox',
                                    inputValue: 'endafter',
                                    margin: '0 10 0 10',
                                    listeners: {
                                        //change: 'onRangeRecurrenceChange'
                                    }
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'rRangeOccurences',
                                    reference: 'rRangeOccurences',
                                    name: 'rRangeOccurences',
                                    width: 50,
                                    maxValue: 99,
                                    minValue: 2,
                                    listeners:{
                                        //change: 'onChange'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'occurrence(s)',
                                    margin: '0 0 0 10'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'radio',
                                    boxLabel: 'End by: ',
                                    name: 'rRangeRecurrence',
                                    reference: 'endByCheckBox',
                                    inputValue: 'endby',
                                    itemId: 'rEndBy',
                                    margin: '0 10 0 10',
                                    listeners: {
                                        change: 'onRangeRecurrenceChange'
                                    }
                                },
                                {
                                    xtype: 'datefield',
                                    width: 150,
                                    reference: 'rangeRecurrenceEndByDate',
                                    itemId: 'rangeRecurrenceEndByDate',
                                    //format: 'l m/d/Y',
                                    listeners: {
                                        change: 'onRangeRecurrenceDateChange',
                                        collapse: 'setEndByRadioButton'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    buttons: [
        {
            text: 'Ok',
            handler: 'onOkayRecurrence',
            id: 'OKbutton'
        },
        {
            text: 'Except/Add\'l Dates',
            handler: 'onEditRecurrenceDates'
        },
        '->',
        {
            text: 'Remove Recurrence',
            handler: 'onRemoveRecurrence'
        },
        {
            text: 'Cancel',
            handler: 'onCancelRecurrence'
        }
    ]
});