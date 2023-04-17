Ext.define('TS.view.crew.window.UserForm', {
    extend: 'Ext.form.Panel',

    xtype: 'form-usersettings',

    reference: 'settingsForm',

    bodyPadding: 5,

    layout: 'anchor',
    defaults: {
        anchor: '100%',
        labelWidth: 140
    },
    items: [
        {
            xtype: 'timefield',
            name: 'schedVisibleHoursStart',
            fieldLabel: 'From:',
            increment: 30,
            bind: {
                value: '{settings.schedVisibleHoursStart}',
                maxValue: '{settings.schedVisibleHoursEnd}'
            }
        },
        {
            xtype: 'timefield',
            name: 'schedVisibleHoursEnd',
            fieldLabel: 'Until:',
            increment: 30,
            bind: {
                value: '{settings.schedVisibleHoursEnd}',
                minValue: '{settings.schedVisibleHoursStart}'
            }
        },
        {
            xtype: 'combobox',
            fieldLabel: 'Granularity:',
            name: 'schedTimeAxisGranularity',
            matchFieldWidth: false,
            width: 100,
            store: {
                fields: ['value', 'text'],
                data: [{
                    value: 15,
                    text: '15 minutes'
                }, {
                    value: 30,
                    text: '30 minutes'
                }, {
                    value: 60,
                    text: '1 hour'
                }]
            },
            displayField: 'text',
            valueField: 'value',
            bind: '{settings.schedTimeAxisGranularity}'
        },
        {
            xtype: 'combobox',
            fieldLabel: {_tr: 'crewLabel', tpl: '{0} Visibility'},
            name: 'schedCrewPreparedByMe',
            store: {
                fields: ['value', 'text'],
                data: [{
                    value: 'Y',
                    text: 'Prepared by me'
                }, {
                    value: 'N',
                    text: 'Prepared by anyone'
                }, {
                    value: 'T',
                    text: 'Prepared by my scheduling team'
                }]
            },
            displayField: 'text',
            valueField: 'value',
            bind: '{settings.schedCrewPreparedByMe}'
        },
        {
            xtype: 'combobox',
            fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: '{0} Visibility'},
            // labelWidth: 150,
            name: 'schedFwaPreparedByMe',
            store: {
                fields: ['value', 'text'],
                data: [{
                    value: 'Y',
                    text: 'Prepared by me'
                }, {
                    value: 'N',
                    text: 'Prepared by anyone'
                }, {
                    value: 'T',
                    text: 'Prepared by my scheduling team'
                }]
            },
            displayField: 'text',
            valueField: 'value',
            bind: '{settings.schedFwaPreparedByMe}'
        },
        {
            xtype: 'checkboxfield',
            name: 'availableForUseInField',
            inputValue: 1,
            fieldLabel: 'Default for Available',
            labelAlign: 'left',
            bind: '{settings.availableForUseInField}'
        },
        {
            xtype: 'numberfield',
            minValue: 1,
            name: 'schedDaysLookback',
            fieldLabel: '# Days Lookback',
            bind: '{settings.schedDaysLookback}'
        },
        {
            xtype: 'combobox',
            fieldLabel: 'Week Start Day',
            store: 'WeekdayByIndex',
            width: 100,
            queryMode: 'local',
            displayField: 'description',
            valueField: 'value',
            bind: '{settings.schedWeeklyStartDay}',
            hidden: true
        },
        {
            xtype: 'numberfield',
            name: 'schedWeeklyStartDay',
            fieldLabel: 'Week Start Day',
            bind: '{settings.schedWeeklyStartDay}',
            hidden:true
        },
    ]
});
