Ext.define('TS.common.ts.Hours', {
    extend: 'Ext.container.Container',

    xtype: 'ts-hours',

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            title: 'Hours',
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    iconCls: 'x-fa fa-chevron-left',
                    align: 'left',
                    handler: 'onBeforeHoursBack'
                }
            ]
        },
        {
            xtype: 'component',
            docked: 'top',
            bind: {
                data: {
                    empName: '{currentTSRow.empName}',
                    startDate: '{selectedTS.startDate}',
                    endDate: '{selectedTS.endDate}',
                    groupHeader: '{groupHeader}'
                }
            },
            tpl: new Ext.XTemplate('{startDate:date("' + DATE_FORMAT + '")} - {endDate:date("' + DATE_FORMAT + '")}',
                '<div>{groupHeader}</div>'),
            style: 'background:#fff;text-align:center;font-weight:bold;padding:0.4em;font-size: 0.9em;'
        },
        {
            xtype: 'field-tsemployee',
            itemId: 'hoursEmployee',
            height: 48,
            docked: 'top',
            userCls: 'ts-shadow-line',
            label: 'Employee',
            name: 'empId',
            style: 'border-top:1px solid #ccc',
            bind: {
                value: '{currentTSRow.empId}',
                disabled: '{lockEmployee}',
                readOnly: true //'{!isNewRecord}'
            },
            listeners: {
                change: 'setCrewRole'
            }
        },
        {
            xtype: 'field-crewrole',
            height: 48,
            docked: 'top',
            itemId: 'hoursCrewRole',
            userCls: 'ts-shadow-line',
            label: {_tr: 'crewLabel', tpl: '{0} Role'},
            name: 'crewRoleId',
            style: 'border-top:1px solid #ccc',
            bind: {
                value: '{currentTSRow.crewRoleId}',
                readOnly: true //'{!isNewRecord}'
            }
        },
        {
            xtype: 'list',
            grouped: true,
            itemId: 'ts-rowlist',
            itemCls: 'ts-day-view-item',
            listeners: {
                // disclose: 'onHoursEdit',
                itemtap: 'onHoursEditTap'
            },
            bind: {
                store: '{hoursview}',
                selection: '{selectedDay}'
            },
            itemTpl: new Ext.XTemplate(
                '{[this.getHours(values)]}',
                {
                    getHours: function (values) {
                        var settings = TS.app.settings,
                            isHoliday = 0,
                            html = '';
                        isHoliday = Ext.getStore('HolidaySchedule').findBy(function (rec) {
                            if (Ext.Date.format(new Date(rec.get('holidayDate')), DATE_FORMAT) == Ext.Date.format(new Date(values.workDate), DATE_FORMAT)) {
                                return rec;
                            }
                        });
                        if (isHoliday > -1) {
                            html += '<span style="background-color:rgba(0, 255, 255, 0.3);"><h2>Regular</h2><span>' + values.regHrs + '</span></span>';
                            if (settings.tsAllowOvtHrs) html += '<span style="background-color:rgba(0, 255, 255, 0.3);"><h2>Overtime</h2><span>' + values.ovtHrs + '</span></span>';
                            if (settings.tsAllowOvt2Hrs) html += '<span style="background-color:rgba(0, 255, 255, 0.3);"><h2>Ovt 2</h2><span>' + values.ovt2Hrs + '</span></span>';
                            if (settings.tsAllowTravelHrs) html += '<span style="background-color:rgba(0, 255, 255, 0.3);"><h2>Travel</h2><span>' + values.travelHrs + '</span></span>';
                        } else {
                            html += '<span><h2>Regular</h2><span>' + values.regHrs + '</span></span>';
                            if (settings.tsAllowOvtHrs) html += '<span><h2>Overtime</h2><span>' + values.ovtHrs + '</span></span>';
                            if (settings.tsAllowOvt2Hrs) html += '<span><h2>Ovt 2</h2><span>' + values.ovt2Hrs + '</span></span>';
                            if (settings.tsAllowTravelHrs) html += '<span><h2>Travel</h2><span>' + values.travelHrs + '</span></span>';
                        }
                        return html;
                    }
                }
            ),
            preventSelectionOnDisclose: false,
            onItemDisclosure: true
        },
        {
            xtype: 'component',
            docked: 'bottom',
            height: 24,
            style: 'text-align:center;border-top:1px solid #ccc',
            bind: {
                data: {
                    periodTtlHrs: '{periodTtlHrs}',
                    periodTtlRegHrs: '{periodTtlRegHrs}',
                    periodTtlOvtHrs: '{periodTtlOvtHrs}',
                    periodTtlOvt2Hrs: '{periodTtlOvt2Hrs}',
                    periodTtlTravelHrs: '{periodTtlTravelHrs}'
                }
            }, //'<div class="align-right"><span>Total Hours: </span><span>{periodTtlHrs}</span></div>'
            tpl: new Ext.XTemplate(
                '{[this.getTtlHours(values)]}', {

                    getTtlHours: function (values) {
                        var settings = TS.app.settings,
                            html = '<div class="align-right" style="font-size: smaller;">';

                        html += '<span>Total Hours: </span><span>' + values.periodTtlHrs + '</span>';
                        html += '&nbsp;';
                        html += '(&nbsp;';
                        html += '<span>Reg: <span>' + values.periodTtlRegHrs + '</span>';
                        if (settings.tsAllowOvtHrs) {
                            html += '&nbsp;';
                            html += '<span>Ovt: <span>' + values.periodTtlOvtHrs + '</span>';
                        }
                        if (settings.tsAllowOvt2Hrs) {
                            html += '&nbsp;';
                            html += '<span>Ovt2: <span>' + values.periodTtlOvt2Hrs + '</span>';
                        }
                        if (settings.tsAllowTravelHrs) {
                            html += '&nbsp;';
                            html += '<span>Travel: <span>' + values.periodTtlTravelHrs + '</span>';
                        }

                        return html += '&nbsp;)</div>';
                    }
                }
            )
        },
        {
            xtype: 'toolbar',
            docked: 'bottom',
            items: [
                {
                    xtype: 'button',
                    itemId: 'deleteRowButton',
                    text: 'Delete This Project',
                    flex: 1,
                    ui: 'decline',
                    handler: 'onRowDelete',
                    bind: {
                        //disabled: '{!settings.tsCanModifyFwaHours}'
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'copyRowButton',
                    text: 'Copy This Project',
                    flex: 1,
                    ui: 'action',
                    handler: 'onRowCopy',
                    bind: {
                        //disabled: '{!settings.tsCanModifyFwaHours}'
                    }
                }
            ]
        }
    ]
});
