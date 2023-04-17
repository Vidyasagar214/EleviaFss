/**
 * This employee scheduler shows the tasks booked for each resource.
 * Additionally it show the availability for each resource, configured through the 'resourceZones' config property.
 * After it is rendered, it also sets up the drop zone which indicates it can accept drops on the schedule area.
 */
Ext.define('TS.view.crew.Crew', {
    extend: 'Sch.panel.SchedulerGrid',
    alias: 'widget.crewscheduler',
    xtype: 'scheduler-crew',

    requires: [
        'TS.Util',
        'TS.common.MyTimeAxis'
    ],

    title: {_tr: 'crewLabelPlural', tpl: 'Scheduled {0}'},
    bind: {
        //title: '{settings.crewLabel} Schedule (drag unscheduled {settings.fwaAbbrevLabel}s onto the schedule)'
    },

    //cls: 'crewscheduler',

    plugins: [
        {
            ptype: 'scheduler_currenttimeline',
            updateInterval: 30000
        },
        {
            ptype: 'scheduler_zones',
            store: 'HolidaySchedule'
        },
        {
            ptype: 'scheduler_printable',
            pluginId: 'printable'
        }
    ],

    enableDragCreation: false,
    rowHeight: 35,
    viewPreset: 'hourAndDay',
    constrainDragToResource: false,
    eventBorderWidth: 1,
    stateful: true,
    stateId: 'stateSchedulerCrewList',
    //state events to save
    stateEvents: ['columnmove', 'columnresize', 'sortchange', 'expand'],

    zoomKeepsOriginalTimespan: false,
    zoomLevels: [

        ////WEEK
        {width: 35, increment: 1, resolution: 1, preset: 'weekAndMonth', resolutionUnit: 'WEEK'},

        ////DAY
        {width: 40, increment: 1, resolution: 1, preset: 'weekAndDayLetter', resolutionUnit: 'DAY'}, //d

        ////HOUR
        {width: 150, increment: 1, resolution: 1, preset: 'weekAndDay', resolutionUnit: 'DAY'}, //h

        ////MINUTE
        {width: 75, increment: 1, resolution: 1, preset: 'hourAndDay', resolutionUnit: 'MINUTE'}
        // {width: 60, increment: 15, resolution: 5, preset: 'minuteAndHour', resolutionUnit: 'MINUTE'}

    ],
    /*
     Template for the tooltip
     */
    ttTpl: new Ext.XTemplate('<table style="width:450:px;">',
        '<tr><td colspan="4">{hoverRows}</td></tr>',
        '<tr><td>&nbsp;</td></tr>',
        //'<tr><td colspan="4"> Single-click to change {fwaLabel} availability.</td></tr>',
        '<tr><td colspan="4"> Double-click to view details</td></tr>',
        '<tr><td colspan="4"> Hold left mouse button down to unschedule/make available.</td></tr>',
        '</table>'),

    getDataForTooltipTpl: function (tip, fwa) {
        var settings = TS.app.settings,
            info = fwa.hoverRows;

        if (fwa.schedStartDate && fwa.schedStartDate > new Date('1/1/2001')) {
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
                newDt = Ext.Date.format(dt,DATE_FORMAT + ' g:i A');
                info = info.replace('^fromUTC(' + info.substring(start, end) + ')^', newDt);
            }
        } else {
            info = info.replace(/\^fromUTC\(/g, '');
            info = info.replace(/\)\^/g, '');
        }


        return {
            //new row as defined by user
            fwaLabel: settings.fwaAbbrevLabel,
            hoverRows: info
        }
    },

    initComponent: function () {

        var D = Ext.Date,
            settings = TS.app.settings;

        Ext.apply(this, {//'Sch.data.TimeAxis'
            timeAxis: new TS.common.MyTimeAxis({
                paramStart: settings.schedVisibleHoursStart,
                paramEnd: settings.schedVisibleHoursEnd
            }), //used when weekAndDay,
            // This method should return the text inside the event bar, additionally it can also
            // add style declarations and CSS classes to the containing DOM node.
            eventRenderer: function (event, resourceRecord, meta) {
                var statusColor = this.lookupViewModel().getFwaStatusColor(event);
                if(meta){
                    if (event.get('recurrenceConfig'))
                        meta.iconCls = 'x-fa fa-refresh';
                    meta.style = 'text-align:center; font-weight: bold; font-size: 1.1em; ' + statusColor + '; border-style: solid; border-color: black;';

                    if (statusColor.includes("#FFC080") || statusColor.includes("#e2da77") || statusColor.includes('#FFA500'))
                        meta.style += 'color:black;';
                }

                if (event.get('schedBarText'))
                    return '  ' + event.get('schedBarText');
                else
                    return '  ' + event.get('fwaNum') + ': ' + event.getName();
            },

            //this prevents FWAs from being spread across 2 dates
            resizeValidatorFn: function (resourceRecord, eventRecord, startDate, endDate, e) {
                var settings = TS.app.settings,
                    minStartHour = settings.schedVisibleHoursStart.getHours(),
                    minStartMinutes = settings.schedVisibleHoursStart.getMinutes(),
                    maxEndHour = settings.schedVisibleHoursEnd.getHours(),
                    maxEndMinutes = settings.schedVisibleHoursEnd.getMinutes();
                if (Sch.util.Date.getDurationInDays(startDate, endDate) > 1) {
                    return {
                        valid: false,
                        message: settings.fwaAbbrevLabel + 's cannot span multiple dates.'
                    };
                }
                if ((startDate.getHours() < minStartHour || (startDate.getHours() == minStartHour && startDate.getMinutes() < minStartMinutes))
                    || (endDate.getHours() > maxEndHour || (endDate.getHours() == maxEndHour && endDate.getMinutes() > maxEndMinutes))
                    || startDate.getDate() != endDate.getDate()) {
                    return {
                        valid: false,
                        message: settings.fwaAbbrevLabel + 's start/end times cannot exceed pre-set times.'
                    };
                }
            },

            createValidatorFn: function (resourceRecord, start, end) {

            },

            tools: [{
                type: 'refresh',
                iconCls: 'x-fa fa-undo',
                bind: {
                    tooltip: 'Reset to original {settings.crewLabel} sort',
                },
                handler: 'onResetSort'
            }],


            // getToolTip: function (value, metaData, record) {
            //     var crewList = record.get('crewMembers'),
            //         info = '';
            //
            //     Ext.each(crewList, function (crewMember) {
            //         var emp = Ext.getStore('AllEmployees').findRecord('empId', crewMember.get('crewMemberEmpId')),
            //             empName = emp.get('empName'),
            //             title = emp.get('title');
            //
            //         info += '<tr><td colspan="2"><b>empName:</b></td><td>' + title + '</td></tr>' ;
            //
            //     })
            //
            //     if (info)
            //         metaData.tdAttr = 'data-qtip=\'<table style="width:400px;">' + info.replace(/'/g, "&#39") + '</table>\'';
            // },

            columns: [
                    {
                    width: 300,
                    dataIndex: 'crewName',
                    text: 'Name',
                    renderer: function (value, meta, record) {

                        if (meta && record.get('scheduledCrewId') != '')
                            TS.Util.displayCrewSkillsAndRegistration(meta, record);
                        if (value) {
                            if (record.get('crewCt') > 1)
                                return '<span class="x-fa fa-users blackIcon inline-cell" />' + '&nbsp;&nbsp;' + (value);
                            else
                                return '<span class="x-fa fa-user blackIcon inline-cell" />' + '&nbsp;&nbsp;' + (value);
                        }
                    },
                    items: [
                        {
                            xtype: 'searchtrigger',
                            itemId: 'filterSchedulerCrew',
                            inputAttrTpl: " data-qtip='Filters by " + TS.app.settings.crewLabel + " Name, Employee Name (last & first), and Employee Group Name' ",
                            listeners: {
                                // render: function (t) {
                                //     var myDefault = TS.app.settings.schedFilters.split('^')[11];
                                //     t.setValue(''); // t.setValue(myDefault);
                                //     return;
                                // },
                                afterrender: function (t) {
                                    var task = new Ext.util.DelayedTask(function () {
                                        t.setValue(TS.app.settings.schedFilters.split('^')[11]);
                                    });
                                    task.delay(1500);
                                    return;
                                }
                            }
                        }
                    ]
                }
            ],

            lockedViewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true,
                    dragText: 'Drag and drop to order'
                }
            },

            viewConfig: {
                stripeRows: false,
                barMargin: 1,
                listeners: {
                    unplannedtaskdrop: 'onUnplannedFWADrop'
                }
            }

        });

        this.callParent(arguments);
    },

    createToolTip: function (toolTipDataFn, scope) {

        var me = this,
            view = this.getSchedulingView();

        me.toolTip = Ext.create('Ext.tip.ToolTip', {
            target: view.el,
            dismissDelay: 0,
            title: {_tr: 'fwaAbbrevLabel', tpl: '{0} information'},
            delegate: '.sch-event',
            trackMouse: true,
            width: 600,

            renderTo: Ext.getBody(),
            listeners: {
                beforeshow: function (tip) {
                    var fwa = view.getEventRecordFromDomId(tip.triggerElement.id);
                    if (fwa) {
                        var toolTipDataFn = me.getDataForTooltipTpl(tip, fwa.data);
                        tip.update(me.ttTpl.apply(toolTipDataFn));
                    }
                }
            }
        });
    },


    refreshRow: function (s, rs) {
        // Normalize
        if (!(rs instanceof Array)) {
            rs = [rs];
        }
        var index = this.resourceStore.indexOf(rs[0].getResource());
        this.getView().refreshNode(index);
    }
    ,

    destroy: function () {
        if (this.tooltip) {
            Ext.destroy(this.tooltip);
        }
        this.callParent(arguments);
    }

});
