/**
 * Created by steve.tess on 6/7/2018.
 */
Ext.define('TS.view.crew.CrewTaskGrid', {
    extend: 'Ext.grid.Panel',

    xtype: 'crewtaskgrid',

    requires: [
        'Ext.grid.filters.Filters',
        'TS.Util',
        //'Ext.grid.plugin.Exporter',
        'TS.controller.crew.CrewTaskPanelController'
    ],

    controller: 'crewtaskpanel',
    //cls: 'grid-timesheetrow',

    viewConfig: {
        stripeRows: true,
        enableTextSelection: false,
        markDirty: false
    },
    trackMouseOver: true,
    disableSelection: false,

    //stateful: true,
    stateId: 'stateGridCrewTask_New',
    // state events to save
    stateEvents: ['columnmove', 'columnresize', 'filterchange', 'show', 'hide'],

    plugins: [
        {
            ptype: 'gridfilters'
        },
        {
            ptype: 'gridexporter'
        }
    ],
    selModel: 'rowmodel',
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{columnName}: {name}'
    }],

    store: {
        model: 'TS.model.fwa.Fwa',
        autoLoad: false,
        sorters: ['scheduledCrewName'],
        grouper: 'scheduledCrewName',
        proxy: {
            type: 'default',
            directFn: 'Fwa.GetSchedulerFwaList',
            paramOrder: 'dbi|username|start|limit|empId|isPreparedByMe|timeZoneOffset|scheduledFwas',
            extraParams: {
                scheduledFwas: true,
                isPreparedByMe: 'N',
                timeZoneOffset: new Date().getTimezoneOffset()
            },
            reader: {
                type: 'default',
                transform: {
                    fn: function (data) {
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
        filters: [
            function (item) {
                return Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) == Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT);
            }
        ],
        listeners: {
            load: function (t, records, successful, response) {
                var settings = TS.app.settings;
                if (!successful) {
                    var error = {mdBody: 'Load of ' + settings.fwaAbbrevLabel + ' list for ' + settings.crewLabel + ' task failed. ' + response.getResponse().result.message.mdBody},
                        title = (response.getResponse().result.message.mdTitleBarText && response.getResponse().result.message.mdTitleBarText == 'Error' ? response.getResponse().result.message.mdTitleBarText : 'Error');
                    Ext.GlobalEvents.fireEvent(title, error);
                }

            }
        }
    },

    columns: [

        {
            //xtype: 'datecolumn',
            dataIndex: 'gridStartDate',
            //format: 'm/d/Y g:i A',
            header: 'Start Date',
            //filter: {type: 'date'},
            flex: .75,
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false;
                found = holidays.find('holidayDate', dt);

                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }
                return Ext.Date.format(new Date(value), DATE_FORMAT + ' g:i A');
            },
            exportRenderer: true
        },
        {
            //xtype: 'datecolumn',
            dataIndex: 'gridEndDate',
            //format: ' m/d/Y g:i A',
            header: 'End Date/Time',
            flex: .75,
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false;
                found = holidays.find('holidayDate', dt);
                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }
                return Ext.Date.format(new Date(value), DATE_FORMAT + ' g:i A');
            },
            exportRenderer: true
        }, {
            xtype: 'actioncolumn',
            dataIndex: 'recurrencePattern',
            menuText: 'Recurring',
            width: 40,
            menuDisabled: true,
            hideable: false,
            align: 'center',
            items: [{
                getClass: function (v, meta, rec) {
                    if (rec.get('recurrenceConfig')) {// && rec.get('nonFieldActionCompleteCt') == rec.get('nonFieldActionCt')) {
                        return 'x-fa fa-refresh blackIcon'; //'x-fa fa-plus';
                    }
                },
                tooltip: 'Recurring'
            }],
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false;
                found = holidays.find('holidayDate', dt);
                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }
            },
            ignoreExport: true
        },
        {
            //xtype: 'datecolumn',
            dataIndex: 'recurringEndDate',
            tooltip: 'Recurring End Date',
            //format: ' m/d/Y g:i A',
            header: 'Recurr End',
            flex: .40,
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false;
                found = holidays.find('holidayDate', dt);
                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }
                return value;
            }
        },
        {
            dataIndex: 'fwaName',
            header: 'FWA',
            flex: .75,
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false;
                found = holidays.find('holidayDate', dt);
                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }
                return value;
            }
        },
        {
            dataIndex: 'scheduledCrewName',
            header: 'Crew',
            flex: 1,
            renderer: function (value, meta, record) {
                if (meta && record.get('scheduledCrewId') != '')
                {
                    TS.Util.displayCrewSkillsAndRegistration(meta, record);
                    var dt = Ext.Date.clearTime(new Date(record.get('schedStartDate'))),
                        holidays = Ext.getStore('HolidaySchedule'),
                        found = false;
                    found = holidays.find('holidayDate', dt);
                    if (found > -1) {
                        meta.style = "background-color: #d8ffff;";
                    } else {
                        meta.style = "background-color: white;";
                    }
                }
                return value;
            }
        },
        {
            dataIndex: 'clientName',
            header: 'Client',
            flex: 1,
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false;
                found = holidays.find('holidayDate', dt);
                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }
                return value;
            }
        },
        {
            dataIndex: 'wbs1',
            header: 'Project #',
            flex: .5,
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false;
                found = holidays.find('holidayDate', dt);
                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }
                return value;
            }
        },
        {
            dataIndex: 'wbs1Name',
            header: 'Project Name',
            flex: 1.5,
            renderer: function (value, meta, rec, idx) {
                var dt = Ext.Date.clearTime(new Date(rec.get('schedStartDate'))),
                    holidays = Ext.getStore('HolidaySchedule'),
                    found = false;
                found = holidays.find('holidayDate', dt);
                if (found > -1) {
                    meta.style = "background-color: #d8ffff;";
                } else {
                    meta.style = "background-color: white;";
                }
                return value;
            }
        }
    ],

    listeners: {
        itemdblclick: 'onFwaGridDblClick',
    }

});