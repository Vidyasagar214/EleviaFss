Ext.define('TS.common.ts.EditHours', {
    extend: 'Ext.form.Panel',

    xtype: 'ts-edit-hours',

    layout: 'vbox',

    items: [
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            reference: 'editHoursTitle',
            title: 'Edit Hours',
            docked: 'top'
        },
        {
            xtype: 'component',
            docked: 'top',
            bind: {
                data: {
                    empName: '{currentTSRow.empName}',
                    workDate: '{selectedDay.workDate}',
                    groupHeader: '{groupHeader}'
                }
            },
            userCls: 'ts-shadow-line',
            tpl: new Ext.XTemplate('{empName}',
                '<div>{workDate:date("l ' + DATE_FORMAT + '")}</div>',
                '<div>{groupHeader}</div>'),
            style: 'background:#fff;text-align:center;font-weight:bold;padding:0.4em;font-size: 0.9em;'
        },
        {
            xtype: 'fieldset',
            reference: 'employeeHours',
            title: 'Hours',
            layout: 'hbox',
            margin: '0 10 0 10',
            userCls: 'ts-wide-fieldset',
            defaults: {
                flex: 1,
                labelAlign: 'top'
            },
            items: [
                {
                    xtype: 'numberfield',
                    label: 'Regular',
                    itemId: 'regHrsField',
                    stepValue: 1,
                    bind: {
                        value: '{selectedDay.regHrs}'
                    },
                    listeners: {
                        change: 'onTsHoursChange',
                        clearicontap: 'onClearIconTap'
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Ovt',
                    stepValue: 1,
                    //minValue: 0,
                    itemId: 'ovtHrsField',
                    bind: {
                        value: '{selectedDay.ovtHrs}',
                        hidden: '{!settings.tsAllowOvtHrs}'
                    },
                    listeners: {
                        change: 'onTsHoursChange',
                        clearicontap: 'onClearIconTap'
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Ovt 2',
                    stepValue: 1,
                    //minValue: 0,
                    itemId: 'ovt2HrsField',
                    bind: {
                        value: '{selectedDay.ovt2Hrs}',
                        hidden: '{!settings.tsAllowOvt2Hrs}'
                    },
                    listeners: {
                        change: 'onTsHoursChange',
                        clearicontap: 'onClearIconTap'
                    }
                },
                {
                    xtype: 'numberfield',
                    label: 'Travel',
                    stepValue: 1,
                    //minValue: 0,
                    itemId: 'travelHrsField',
                    bind: {
                        value: '{selectedDay.travelHrs}',
                        hidden: '{!settings.tsAllowTravelHrs}'
                    },
                    listeners: {
                        change: 'onTsHoursChange',
                        clearicontap: 'onClearIconTap'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Comments',
            layout: 'hbox',
            userCls: 'ts-wide-fieldset',
            margin: '0 10 0 10',
            items: [
                {
                    xtype: 'textareafield',
                    itemId: 'commentField',
                    //maxLength: 255,
                    bind: '{selectedDay.comment}',
                    flex: 1,
                    labelAlign: 'top',
                    height: 64
                }
            ]
        },
        {
            xtype: 'fieldset',
            itemId: 'fwaField',  //TODO show hide on load based on if a FWA tied to timesheet
            items: [
                {
                    xtype: 'displayfield',
                    label: {_tr: 'fwaAbbrevLabel'},
                    bind: '{selectedDay.fwaNum}'
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: {_tr: 'fwaAbbrevLabel'},
                    itemId: 'fwaButton',
                    align: 'left',
                    style: 'margin-right: 5px;',
                    handler: 'showFwa'
                },
                {
                    align: 'left',
                    text: 'Update',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    reference: 'updateHoursButton',
                    handler: 'onEditHoursSave'
                },
                {
                    text: 'Cancel',
                    align: 'right',
                    iconCls: 'x-fa  fa-times-circle-o',
                    handler: 'onBeforeEditHoursBack',
                    reference: 'cancelEditorButton'
                }
            ]
        }
    ]
});
