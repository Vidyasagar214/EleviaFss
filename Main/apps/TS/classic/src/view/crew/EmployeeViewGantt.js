/**
 * Created by steve.tess on 11/9/2017.
 */
Ext.define('TS.view.crew.EmployeeViewGantt', {
    extend: 'Ext.panel.Panel',
    xtype: 'panel-employeeviewgantt',

    requires: [
        'TS.controller.crew.EmployeeGanttController',
        'TS.model.fwa.EmployeeViewGantt',
        'TS.model.fwa.EmployeeViewListGantt',
        'TS.view.crew.EmployeeGantt'
    ],

    controller: 'panel-employeegantt',

    tbar: {
        cls: 'toolbar-background',
        layout: {
            //pack: 'center'
        },
        items: [
            {
                iconCls: 'x-fa fa-home',
                width: 70,
                align: 'left',
                liquidLayout: true,
                handler: 'onBackToFSS',
                bind: {
                    hidden: '{!fromFSS}'
                },
                tooltip: 'FSS application list',
                style: 'margin-right: 25px;'
            },
            '->',
            {
                text: 'Go to Date',
                handler: 'onGoToDate',
                width: 100
            },
            {
                xtype: 'button',
                itemId: 'btnLastDay',
                iconCls: 'x-fa fa-arrow-left',
                handler: 'filterByLastDay',
                tooltip: 'View previous day'
            },
            {
                xtype: 'button',
                itemId: 'btnToday',
                text: 'Today',
                handler: 'filterByToday',
                tooltip: 'View today'
            }, {
                xtype: 'button',
                itemId: 'btnNextDay',
                iconCls: 'x-fa fa-arrow-right',
                handler: 'filterByNextDay',
                tooltip: 'View next day'
            }, {
                xtype: 'button',
                itemId: 'btnClear',
                iconCls: 'x-fa fa-undo',
                handler: 'filterReset',
                tooltip: 'Reset view'
            }, {
                xtype: 'button',
                itemId: 'btnLessThan',
                text: '< 8 Hrs',
                tooltip: 'View Hours < 8',
                enableToggle: true,
                pressed: false,
                listeners: {
                    toggle: 'filterLessThan'
                }
            },
            '->',
            {
                iconCls: 'colorwheel', // 'x-fa fa-question',
                handler: 'openStatusLegend',
                tooltip: 'Color Legend',
                width: 75
            },
            {
                iconCls: 'x-fa fa-refresh',
                align: 'right',
                tooltip: 'Refresh screen',
                handler: 'refreshEmployeeGantt'
            },
            {
                iconCls: 'x-fa fa-cogs',
                align: 'right',
                handler: 'openSettingsWindow',
                tooltip: 'User Settings',
                width: 75
            },
            {
                iconCls: 'x-fa fa-info-circle',
                width: 25,
                handler: 'openAboutFss',
                tooltip: 'About FSS'
            }
        ]
    },

    // Some panel configs
    layout: 'border',
    border: false,

    // Custom configs for this panel, which will be passed on to the two child scheduler panels
    startDate: null,
    endDate: null,

    initComponent: function () {

        var me = this,
            vm = me.lookupViewModel(),
            settings = TS.app.settings,
            startTime = settings.schedVisibleHoursStart,
            endTime = settings.schedVisibleHoursEnd;
        me.startDate = vm.get('startDate');
        me.weekStartDay = settings.schedWeeklyStartDay || 0;

        if (me.startDate && startTime && endTime) {
            Sch.util.Date.copyTimeValues(me.startDate, startTime);
            me.endDate = Sch.util.Date.add(me.startDate, Sch.util.Date.MONTH, 1);
            Sch.util.Date.copyTimeValues(me.endDate, endTime);
        }

        Ext.apply(me, {
            items: [
                {
                    xtype: 'scheduler-employeeview',
                    reference: 'employee-scheduler',
                    region: 'center',

                    resourceStore: {
                        type: 'resourcestore',
                        model: 'TS.model.fwa.EmployeeViewGantt',
                        autoLoad: false,
                        proxy: {
                            type: 'default',
                            directFn: 'Employee.GetEmployeeView',
                            paramOrder: 'dbi|username|employeeId|dt',
                            extraParams: {
                                dt: Ext.Date.add(new Date(), Ext.Date.DAY, 1).toDateString(),
                                employeeId: settings.empId
                            },
                            reader: {
                                type: 'default',
                                transform: {
                                    fn: function (data) {
                                        // //do some manipulation of the raw data object
                                        // var decommValue;
                                        // decommValue = TS.Util.Decompress(data.data);
                                        // data.data = [];
                                        // Ext.each(decommValue, function (item) {
                                        //     data.data.push(item);
                                        // });
                                        return data;
                                    },
                                    scope: this
                                }
                            }
                        },
                        listeners: {
                            load: function (t, records, successful, response) {
                                var settings = TS.app.settings;
                                if (!successful) {
                                    var error = {mdBody: 'Load of Employee View List failed ' + response.getResponse().result.message.mdBody},
                                        title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                                    Ext.GlobalEvents.fireEvent(title, error);
                                }
                            }
                        }
                    },

                    eventStore: {
                        type: 'eventstore',
                        model: 'TS.model.fwa.EmployeeViewListGantt',
                        autoLoad: false,
                        proxy: {
                            type: 'default',
                            directFn: 'Employee.GetEmployeeViewList',
                            paramOrder: 'dbi|username|employeeId|dt',
                            extraParams: {
                                dt: Ext.Date.add(new Date(), Ext.Date.DAY, 1).toDateString(),
                                employeeId: settings.empId
                            },
                            reader: {
                                type: 'default',
                                transform: {
                                    fn: function (data) {
                                        // //do some manipulation of the raw data object
                                        // var decommValue;
                                        // decommValue = TS.Util.Decompress(data.data);
                                        // data.data = [];
                                        // Ext.each(decommValue, function (item) {
                                        //     data.data.push(item);
                                        // });
                                        return data;
                                    },
                                    scope: this
                                }
                            }
                        },
                        listeners: {
                            load: function (t, records, successful, response) {
                                var settings = TS.app.settings;
                                if (!successful) {
                                    var error = {mdBody: 'Load of Employee View List failed ' + response.getResponse().result.message.mdBody},
                                        title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                                    Ext.GlobalEvents.fireEvent(title, error);
                                }

                            },
                            //afterrender: 'onGanttRender'
                        }
                    },
                    highlightWeekends: true,
                    highlightHolidays: true,
                    weekStartDay: me.weekStartDay,
                    startDate: me.startDate,
                    endDate: me.endDate,
                    startParamName: 'schedStartDate',
                    endParamName: 'schedEndDate',

                    listeners: {
                        afterrender: 'onGanttRender',
                        eventdblclick: 'onEventDblClick'
                    }
                }]
        });

        this.callParent(arguments);
    },

    getToolTip: function (value, metaData, record) {
        var info = record.get('hoverRows');

        if (record.get('schedStartDate')) {
            while (info.indexOf('^fromUTC(') > -1) {
                var start = info.indexOf('^fromUTC(') + 9,
                    end = info.indexOf(')^'),
                    oldDt = '',
                    dt = '',
                    newDt = '',
                    D = Ext.Date,
                    offset = new Date().getTimezoneOffset();
                oldDt = new Date(info.substring(start, end));
                dt = D.add(oldDt, D.MINUTE, offset * -1);
                newDt = Ext.Date.format(dt, DATE_FORMAT + ' g:i A');
                info = info.replace('^fromUTC(' + info.substring(start, end) + ')^', newDt);
            }
        } else {
            info = info.replace(/\^fromUTC\(/g, '');
            info = info.replace(/\)\^/g, '');
        }
        if (info)
            metaData.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
    }

});

