Ext.define('TS.view.crew.Scheduler', {
    extend: 'Ext.panel.Panel',
    xtype: 'panel-scheduler',

    requires: [
        'TS.model.fwa.Crew'
    ],

    controller: 'panel-scheduler',

    // Some panel configs
    layout: 'border',
    border: false,

    // Custom configs for this panel, which will be passed on to the two child scheduler panels
    startDate: null,
    endDate: null,

    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar-scheduler'
    }],

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
                    xtype: 'scheduler-crew',
                    reference: 'scheduler',
                    itemId: 'scheduler',
                    region: 'center',

                    resourceStore: {
                        type: 'resourcestore',
                        model: 'TS.model.fwa.Crew',
                        autoLoad: false,
                        proxy: {
                            type: 'default',
                            directFn: 'Crew.GetList',
                            paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe',
                            extraParams: {
                                isPreparedByMe: settings.schedCrewPreparedByMe
                            }
                        },
                        listeners: {
                            load: function (t, records, successful, response) {
                                var settings = TS.app.settings;
                                if (!successful) {
                                    var error = {mdBody: 'Load of Scheduled ' + settings.crewLabel + 's failed. ' + response.getResponse().result.message.mdBody};
                                    Ext.GlobalEvents.fireEvent(response.getResponse().result.message.mdTitleBarText || 'Error', error),
                                        title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                                    Ext.GlobalEvents.fireEvent(title, error);
                                }
                            }
                        },
                        filters: [
                            function (item) {
                                return item.get('crewStatus') == 'A';
                            }
                        ],
                        sorters: [
                            {
                                property: 'crewOrder',
                                direction: 'ASC'
                            }
                        ]
                    },

                    eventStore: {
                        type: 'eventstore',
                        itemId: 'eventStore',
                        autoLoad: false,
                        model: 'TS.model.fwa.Fwa',
                        proxy: {
                            type: 'default',
                            directFn: 'Fwa.GetSchedulerFwaList',
                            paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe|timeZoneOffset|scheduledFwas',
                            extraParams: {
                                scheduledFwas: true,
                                isPreparedByMe: settings.schedFwaPreparedByMe,
                                timeZoneOffset: new Date().getTimezoneOffset()
                            },
                            reader: {
                                type: 'default',
                                transform: {
                                    fn: function (data) {
                                        // console.log('scheduler event');
                                        // // do some manipulation of the raw data object
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
                                    var error = {mdBody: 'Load of Scheduled ' + settings.fwaAbbrevLabel + 's failed. ' + response.getResponse().result.message.mdBody};
                                    Ext.GlobalEvents.fireEvent(response.getResponse().result.message.mdTitleBarText || 'Error', error),
                                        title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                                    Ext.GlobalEvents.fireEvent(title, error);
                                }
                            }
                        }
                    },
                    highlightWeekends: false,
                    highlightHolidays: true,
                    weekStartDay: me.weekStartDay,
                    startDate: me.startDate,
                    endDate: me.endDate,
                    startParamName: 'schedStartDate',
                    endParamName: 'schedEndDate',

                    listeners: {
                        afterrender: 'onSchedulerRender',
                        eventdblclick: 'onEventDblClick',
                        eventlongpress: 'onEventLongPress',
                        zoomchange: 'clearTimeAxisFilter',
                        //both of these check data then call 'onReScheduleFWA'
                        beforeeventdropfinalize: 'onBeforeEventDropFinalize',
                        beforeeventresizefinalize: 'onBeforeEventResizeFinalize'
                    }
                },
                {
                    xtype: 'grid',
                    reference: 'unplannedfwagrid',
                    //dock: 'right',
                    stateful: true,
                    stateId: 'stateUnplannedList',
                    //state events to save
                    stateEvents: ['columnmove', 'columnresize', 'sortchange', 'expand'],
                    itemId: 'unplannedfwagrid',
                    collapsible: true,

                    store: {
                        model: 'TS.model.fwa.Fwa',
                        leadingBufferZone: 100,
                        pageSize: 50,
                        remoteSort: false,
                        autoLoad: false,
                        proxy: {
                            type: 'default',
                            directFn: 'Fwa.GetSchedulerFwaList',
                            paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe|timeZoneOffset|scheduledFwas',
                            extraParams: {
                                scheduledFwas: false,
                                isPreparedByMe: settings.schedFwaPreparedByMe,
                                timeZoneOffset: new Date().getTimezoneOffset()
                            },
                            reader: {
                                type: 'default',
                                transform: {
                                    fn: function (data) {
                                        // console.log('scheduler unplanned');
                                        // do some manipulation of the raw data object
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
                                    var error = {mdBody: 'Load of Unscheduled ' + settings.fwaAbbrevLabel + 's failed. ' + response.getResponse().result.message.mdBody},
                                        title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                                    Ext.GlobalEvents.fireEvent(title, error);
                                }

                            }
                        }

                    },

                    scrollable: true,
                    features: {
                        ftype: 'grouping'
                    },
                    plugins: 'responsive',

                    responsiveConfig: {
                        'width < 300': {
                            region: 'south'
                        },
                        'width >= 300': {
                            region: 'east'
                        }
                    },
                    //region: 'east',
                    viewConfig: {
                        columnLines: false
                    },
                    columns: [
                        {
                            text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                            sortable: true,
                            width: '200px',
                            dataIndex: 'fwaName',
                            id: 'fwaName',
                            renderer: function (value, metadata, record) {
                                me.getToolTip(value, metadata, record);
                                return value;
                            }
                        },
                        {
                            xtype: 'datecolumn',
                            width: 200,
                            text: 'Date Required',
                            dataIndex: 'dateRequired',
                            id: 'dateRequired',
                            renderer: function (value, metadata, record) {
                                //me.getToolTip(value, metadata, record);
                                var dt = new Date('1/1/2002'),
                                    badDate = value < dt,
                                    formattedDate = Ext.Date.format(new Date(value), DATE_FORMAT);
                                return !badDate ? formattedDate : '';
                            }
                        },
                        {
                            text: 'Scheduled By',
                            width: 250,
                            dataIndex: 'preparedByEmpId',
                            renderer: function (value, meta, rec) {
                                meta.style = 'border-left: 1px solid #b0b0b0 !important;';
                                //all employees when displaying
                                var record = Ext.getStore('Schedulers').getById(value),
                                    tip = 'employeetooltip';
                                return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
                            },
                            hidden: true
                        },
                        {
                            xtype: 'datecolumn',
                            //flex: 1,
                            text: 'Date Ordered',
                            dataIndex: 'dateOrdered',
                            width: 200,
                            renderer: function (value, metadata, record) {
                                //me.getToolTip(value, metadata, record);
                                var dt = new Date('1/1/2002'),
                                    badDate = value < dt,
                                    formattedDate = Ext.Date.format(new Date(value), DATE_FORMAT);
                                return !badDate ? formattedDate : '';
                            },
                            hidden: true
                        },
                        {
                            text: 'Ordered By',
                            dataIndex: 'orderedBy',
                            width: 250,
                            renderer: function (value, meta, rec) {
                                meta.style = 'border-left: 1px solid #b0b0b0 !important;';
                                //all employees when displaying
                                var record = Ext.getStore('AllEmployees').getById(value),
                                    tip = 'employeetooltip';
                                return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
                            },
                            hidden: true
                        },
                        {
                            text: 'Client Name',
                            dataIndex: 'clientName',
                            hidden: true,
                            //width: 150
                        },
                        {
                            text: {_tr: 'wbs1Label', tpl: '{0} Name'},
                            dataIndex: 'wbs1Name',
                            width: '250px',
                            hidden: true
                        },
                        {
                            xtype: 'actioncolumn',
                            reference: 'prePostActionColumn',
                            resizable: false,
                            align: 'center',
                            items: [{
                                iconCls: 'actions-yellow',
                                tooltip: 'Pre/Post Actions',
                                handler: 'prePostFwaActions',
                                getClass: function (v, meta, rec) {
                                    if (rec.get('nonFieldActionCt') == 0) {// && rec.get('nonFieldActionCompleteCt') == rec.get('nonFieldActionCt')) {
                                        return 'actions-yellow';
                                    } else if (rec.get('nonFieldPreActionCt') > 0 && rec.get('nonFieldPreActionCt') > rec.get('nonFieldPreActionCompleteCt')) {
                                        return 'actions-red';
                                    } else if ((rec.get('nonFieldPreActionCt') == 0 || (rec.get('nonFieldPreActionCt') > 0 && rec.get('nonFieldPreActionCt') == rec.get('nonFieldPreActionCompleteCt'))) && rec.get('nonFieldActionCt') != rec.get('nonFieldActionCompleteCt')) {
                                        return 'actions-green';
                                    } else if (rec.get('nonFieldActionCt') == rec.get('nonFieldActionCompleteCt')) {
                                        return 'actions-blue';
                                    } else {
                                        return 'actions-yellow';
                                    }
                                }
                            }],
                            width: 30,
                            bind: {
                                hidden: '{schedReadOnly}' //!settings.fwaDisplayActionsbutton
                            }
                        }
                    ],
                    width: 300,
                    split: true,
                    listeners: {
                        afterrender: 'onFWAGridRender',
                        //select: 'onFwaGridSelect'
                        rowdblclick: 'onFwaGridSelect'
                    },
                    cls: 'fwagrid',
                    bind: {
                        title: 'Unscheduled {settings.fwaAbbrevLabel}s'
                    },
                    collapseFirst: false, // make sure our pin is rendered first
                    tools: [
                        {
                            type: 'pin', //if other vector icon is desired you can add that type via scss
                            handler: 'onShowUnscheduledFwaMap',
                            tooltip: 'View Unscheduled Location(s)'
                        }
                    ]
                }]
        });

        this.callParent(arguments);
    },

    getToolTip: function (value, metaData, record) {
        var info = record.get('hoverRows');


        if (record.get('schedStartDate') && record.get('schedStartDate') > new Date('1/1/2001')) {
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
            metaData.tdAttr = 'data-qtip=\'<table style="width:600px;">' + info.replace(/'/g, "&#39") + '</table>\'';
    }

});