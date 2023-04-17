Ext.define('TS.view.ts.StartEndTime', {
    extend: 'Ext.Sheet',

    xtype: 'ts-startendtimes',
    controller: 'ts-main',
    viewModel: 'ts-main',
    stretchX: true,
    stretchY: true,
    endDate: null,

    // config: {
    //     tsRowRecord: null, // Custom config
    //     tsWorkDate: null
    // },

    autoDestroy: true,
    // headerArr: [],

    selectedRow: null,
    selectedTS: null,

    layout: 'fit',
    //userCls: 'ts-delete-padding',
    //title:

    items: [ {
        xtype: 'titlebar',
        title: 'Start/End Times',
        cls: 'ts-navigation-header',
        docked: 'top',
        items: [
            {
                xtype: 'button',
                text: 'Back',
                iconCls: 'x-fa fa-chevron-left blackIcon',
                align: 'left',
                cls: 'button-white',
                handler: 'onCloseStartEndTime'
            }
        ]
    },
        {
            xtype: 'fieldset',
            reference: 'startEndTimesForm',
            //padding: '40, 20, 20, 20',
            itemId: 'timePanel',
            items: [
                {
                    xtype: 'label',
                    itemId: 'userNameLabel',
                    style: 'font-size:16pt; font-weight: bold; padding: 20 0 20 0;'
                },
                {
                    xtype: 'label',
                    itemId: 'workDateLabel',
                    style: 'font-size:14pt; font-weight: bold; padding: 20 0 20 0;',
                    bind: {
                        html: Ext.Date.format('{selectedTS.startEndDates.workDate}', DATE_FORMAT)
                    }
                },
                {
                    height: 20
                },
                {
                    xtype: 'timefield',
                    name: 'startTime',
                    itemId: 'startTimeField',
                    label: '<b>Start Time</b>',
                    bind: {
                        value: '{selectedTS.startEndDates.startTime}'
                    }
                },
                {
                    xtype: 'timefield',
                    name: 'endTime',
                    itemId: 'endTimeField',
                    label: '<b>End Time</b>',
                    bind: {
                        value: '{selectedTS.startEndDates.endTime}'
                    }
                }
            ]
        },
        {
            xtype: 'toolbar',
            docked: 'bottom',
            items: [
                {
                    text: 'Save',
                    align: 'left',
                    itemId: 'tsSaveButton',
                    iconCls: 'x-fa fa-save',
                    handler: 'onSaveStartEnd',
                    ui: 'action'
                },
                '->',
                {
                    text: 'Cancel',
                    ui: 'decline',
                    align: 'right',
                    iconCls: 'x-fa  fa-times-circle',
                    handler: 'onCloseStartEndTime'
                }
            ]
        }
    ],

    listeners: {
        beforeshow: 'getStartEndTimes'
    }

});
