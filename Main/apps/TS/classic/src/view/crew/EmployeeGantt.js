/**
 * Created by steve.tess on 11/9/2017.
 */
Ext.define('TS.view.crew.EmployeeGantt', {
    extend: 'Sch.panel.SchedulerGrid',
    alias: 'widget.employeeviewscheduler',
    xtype: 'scheduler-employeeview',

    requires: [
        'Sch.plugin.CurrentTimeLine',
        'Sch.plugin.Zones',
        'TS.common.MyTimeAxis',
        'TS.view.fwa.SearchTrigger'
    ],

    plugins: [
        {
            ptype: 'scheduler_currenttimeline',
            updateInterval: 30000
        },
        {
            ptype: 'scheduler_zones',
            store: 'HolidaySchedule'
        }
    ],

    enableDragCreation: false,
    rowHeight: 30,
    viewPreset: 'hourAndDay',
    constrainDragToResource: false,
    eventBorderWidth: 1,

    ttTpl: new Ext.XTemplate('<table style="width:450px;">',
        '<tr><td colspan="4">{hoverRows}</td></tr>',
        '<tr><td>&nbsp;</td></tr>',
        '<tr><td colspan="4"> Double-click to view details</td></tr>',
        '</table>'),

    getDataForTooltipTpl: function (tip, fwa) {
        var info = fwa.hoverRows;
        if (fwa.startDateTime) {
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

        return {
            //new row as defined by user
            hoverRows: info
        }
   },

    initComponent: function () {

        var settings = TS.app.settings;
        Ext.apply(this, {
            readOnly: true,
            timeAxis: new TS.common.MyTimeAxis({
                paramStart: settings.schedVisibleHoursStart,
                paramEnd: settings.schedVisibleHoursEnd
            }), //used when weekAndDay,
            // This method should return the text inside the event bar, additionally it can also
            // add style declarations and CSS classes to the containing DOM node.
            eventRenderer: function (event, resourceRecord, meta) {
                var statusColor = this.lookupViewModel().getFwaStatusColor(event);
                if (event.get('recurrenceConfig'))
                    meta.iconCls = 'x-fa fa-refresh';
                meta.style = 'font-weight: bold; font-size: 1.1em;' + statusColor + '; border-style: solid; border-color: black;';

                if (statusColor.includes("#FFC080") || statusColor.includes("#e2da77") || statusColor.includes('#FFA500'))
                    meta.style += 'color:black;';

                if (event.get('schedBarText'))
                    return '  ' + event.get('schedBarText');
                else
                    return '  ' + event.get('fwaNum') + ': ' + event.getName();
            },

            columns: [{
                width: 150,
                dataIndex: 'empGroupName',
                text: 'Group',
                items: [{
                    xtype: 'searchtrigger',
                    autoSearch: true,
                    anyMatch: true,
                    exactMatch: false,
                    itemId: 'filterEmpViewGanttEmpGroupName',
                    listeners: {
                        render: function (t) {
                            var myDefault = TS.app.settings.schedFilters.split('^')[9];
                            t.setValue(myDefault);
                            return;
                        }
                    }

                }]
            }, {
                width: 150,
                dataIndex: 'empName',
                text: 'Employee',
                items: [{
                    xtype: 'searchtrigger',
                    autoSearch: true,
                    anyMatch: true,
                    exactMatch: false,
                    itemId: 'filterEmpViewGanttEmpName',
                    listeners: {
                        render: function (t) {
                            var myDefault = TS.app.settings.schedFilters.split('^')[10];
                            t.setValue(myDefault);
                            return;
                        }
                    }
                }],
                renderer: function (value, meta, record) {
                    if (meta && record) ;
                    {
                        var emp = Ext.getStore('Employees').findRecord('empId', record.get('empId'));
                        if (emp) {
                            var title = emp.get('title'),
                                email = emp.get('emailAddress'),
                                phoneNumbers = emp.get('phoneNumbers'),
                                city = emp.get('city'),
                                state = emp.get('state'),
                                office,
                                mobile,
                                fax,
                                info;
                            for (var i = 0, l = phoneNumbers.length; i < l; i++) {
                                if (phoneNumbers[i].phoneType == 'Fax') {
                                    fax = phoneNumbers[i].phoneNumber;
                                }
                                if (phoneNumbers[i].phoneType == 'Mobile') {
                                    mobile = phoneNumbers[i].phoneNumber;
                                }
                                if (phoneNumbers[i].phoneType == 'Office') {
                                    office = phoneNumbers[i].phoneNumber;
                                }
                            }

                            info = '<tr><td><b>Email Address:</b></td><td colspan="3">' + email + '</td></tr>' +
                                '<tr><td><b>Office:</b></td><td>' + office + '</td><td><b>Mobile:</b></td><td>' + mobile + '</td></tr>'+
                                '<tr><td><b>City:</b></td><td>' + city + '</td><td><b>State:</b></td><td>' + state + '</td></tr>';

                            info += TS.Util.displayEmployeeSkillsAndRegistration(meta, record, record.get('empId'));
                            if (info)
                                meta.tdAttr = 'data-qtip=\'<table style="width:600px;">' + info.replace(/'/g, "&#39") + '</table>\'';
                        } else {
                            //console.log('employee not in table for Employee Scheduler');
                        }
                    }
                    return value;
                }
            }, {
                width: 75,
                dataIndex: 'totalSchedHrs',
                text: 'Total</br>Hours',
                align: 'end'
            }],

            lockedViewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true,
                    dragText: 'Drag and drop to order'
                }
            },
            viewConfig: {
                stripeRows: false,
                barMargin: 1
            }

        });

        this.callParent(arguments);
    },

    createToolTip: function (toolTipDataFn, scope) {

        var me = this,
            view = this.getSchedulingView();

        this.toolTip = Ext.create('Ext.tip.ToolTip', {
            target: view.el,
            dismissDelay: 0,
            title: {_tr: 'fwaAbbrevLabel', tpl: '{0} information'},
            delegate: '.sch-event',
            trackMouse: true,
            minWidth: 600,

            renderTo: Ext.getBody(),
            listeners: {
                beforeshow: function (tip) {
                    var fwa = view.getEventRecordFromDomId(tip.triggerElement.id);
                    if (fwa) {
                        var toolTipDataFn = me.getDataForTooltipTpl(tip, fwa.data);
                        tip.update(me.ttTpl.apply(toolTipDataFn));
                    }

                    // if (fwa) {
                    //     tip.update(me.ttTpl.apply(toolTipDataFn.call(scope || this, this, fwa)));
                    // } else {
                    //     return false;
                    // }
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
});