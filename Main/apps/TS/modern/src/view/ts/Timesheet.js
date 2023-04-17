Ext.define('TS.view.ts.Timesheet', {
    extend: 'Ext.container.Container',
    xtype: 'ts-timesheet',

    requires: [
        'TS.view.ts.EditMenu'
    ],

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            title: {_tr: 'tsTitle'},
            cls: 'ts-navigation-header',
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    iconCls: 'x-fa fa-chevron-left',
                    align: 'left',
                    handler: 'onTsBackBt'
                },
                {
                    xtype: 'button',
                    align: 'right',
                    iconCls: 'x-fa fa-bars',
                    handler: 'onMenuTap'
                }
            ]
        },
        {
            xtype: 'toolbar',
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    text: {_tr: 'wbs1LabelPlural', tpl: 'Manage {0}'},
                    flex: 1,
                    style: 'background-color: #ddf0ff',
                    handler: 'onManageEntry',
                    bind: {
                        disabled: '{tsProjectEdit}'
                    }
                }
            ]
        },
        {
            xtype: 'component',
            height: 50,
            docked: 'top',
            userCls: 'ts-user-details',
            bind: {
                data: {
                    selected: '{selectedTS}',
                    totalHours: '{totalHours}',
                    totalRegHours: '{totalRegHours}',
                    totalOvtHours: '{totalOvtHours}',
                    totalOvt2Hours: '{totalOvt2Hours}',
                    totalTravelHours: '{totalTravelHours}'
                }
            },
            tpl: new Ext.XTemplate('<div class="user">{selected.data.tsEmpName}</div>' +
                '<div class="periods">{selected.data.startDate:date("'+DATE_FORMAT+'")} - {selected.data.endDate:date("'+DATE_FORMAT+'")}</div>' +
                '<div class="align-right"><span>Total</span><span>{totalHours}</span></div>'
            )
        },
        {
            xtype: 'list',
            grouped: true,
            // scrollable: {
            //     directionLock: true,
            //     x: false
            // },
            itemCls: 'ts-timesheet-row',
            //TODO show/hide other crew & time base on settings.tsCanViewCrewMemberTime
            itemTpl: new Ext.XTemplate('<h1>{[this.getEmployeeName(values)]}</h1>',
                '<div class="hours-row">{[this.getStartEndDates(values)]}</div>',
                {
                    //we need this because sometimes all we have is the empId
                    getEmployeeName: function (values) {
                        var settings = TS.app.settings;
                        if (!settings.tsCanViewCrewMemberTime) return '';
                        return Ext.getStore('TsEmployees').getById(values.empId).get('empName') + ': ' + Ext.getStore('Roles').getById(values.crewRoleId).get('crewRoleName');
                    },

                    getCrewRole: function (values) {
                        return Ext.getStore('Roles').getById(values.crewRoleId).get('crewRoleName');
                    },

                   getDayCount: function(min, max, unit){
                       if (unit === Ext.Date.DAY) {
                           return Math.round((max - min) / 86400000);
                       } else {
                           return this.callParent(arguments);
                       }
                   },

                    getStartEndDates: function (values) {
                        var d = Ext.Date,
                            settings = TS.app.settings,
                            startDate = new Date(settings.tsStartDate),
                            endDate = new Date(settings.tsEndDate),
                            cDate = startDate,
                            dayCount = ((startDate && endDate) ? this.getDayCount(startDate, endDate, 'd') + 1 : 0),
                            html = '',
                            ttlHrs = 0,
                            i = 0,
                        isHoliday = 0,
                        background = '';



                        for (; i < dayCount; i++) {
                            isHoliday = 0;
                            isHoliday = Ext.getStore('HolidaySchedule').findBy(function (rec) {
                                if (Ext.Date.format(new Date(rec.get('holidayDate')), DATE_FORMAT) == Ext.Date.format(new Date(cDate), DATE_FORMAT)) {
                                    return rec;
                                }
                            });

                            ttlHrs = this.getDailyHrsTtl(values.cells, cDate);
                            if(isHoliday > -1)
                                html += '<span style="background-color:rgba(0, 255, 255, 0.3);"><h2>' + d.format(cDate, HOURS_DATE_FORMAT_MODERN) + '</h2><span>' + ttlHrs + '</span></span>';
                            else
                                html += '<span><h2>' + d.format(cDate, HOURS_DATE_FORMAT_MODERN) + '</h2><span>' + ttlHrs + '</span></span>';
                            cDate = d.add(cDate, d.DAY, 1);
                        }

                        return html;
                    },

                    getDailyHrsTtl: function (cells, date) {
                        var settings = TS.app.settings,
                            found = cells.filter(function (obj) {
                                return new Date(obj.workDate).getUTCDate() === date.getUTCDate();
                            }),
                            ttl = 0,
                            c;

                        if (found.length > 0) {
                            c = found[0];
                            ttl += c.regHrs;
                            //check user configurations
                            if (settings.tsAllowOvtHrs) ttl += c.ovtHrs;
                            if (settings.tsAllowOvt2Hrs) ttl += c.ovt2Hrs;
                            if (settings.tsAllowTravelHrs) ttl += c.travelHrs;

                            return ttl;
                        }
                        return 0;
                    }
                }
            ),

            preventSelectionOnDisclose: false, // Let the disclosure also selects the record in the list
            // enables disclosure rendering and signifies recipient method
            onItemDisclosure: true,

            listeners: [
                {
                    disclose: 'onHours',
                    itemtap: 'onHoursTap'
                }
            ],

            bind: {
                store: '{tsrow}',
                selection: '{currentTSRow}'
            }
        },
        {
            xtype: 'component',
            height: 30,
            docked: 'bottom',
            centered: true,
            style: 'text-align: center',
            bind: {
                data: {
                    totalRegHours: '{totalRegHours}',
                    totalOvtHours: '{totalOvtHours}',
                    totalOvt2Hours: '{totalOvt2Hours}',
                    totalTravelHours: '{totalTravelHours}'
                }
            },
            tpl: new Ext.XTemplate('{[this.getTtlHours(values)]}', {
                    getTtlHours: function (values) {
                        var settings = TS.app.settings,
                            html = '<div class="align-right" style="font-size: smaller;">';

                        html += '<span>Reg: <span>' + values.totalRegHours + '</span>';
                        if (settings.tsAllowOvtHrs) {
                            html += '&nbsp;&nbsp;';
                            html += '<span>Ovt: <span>' + values.totalOvtHours + '</span>';
                        }
                        if (settings.tsAllowOvt2Hrs) {
                            html += '&nbsp;&nbsp;';
                            html += '<span>Ovt2: <span>' + values.totalOvt2Hours + '</span>';
                        }
                        if (settings.tsAllowTravelHrs) {
                            html += '&nbsp;&nbsp;';
                            html += '<span>Travel: <span>' + values.totalTravelHours + '</span>';
                        }

                        return html += '</div>';
                    }
                }
            )
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Save',
                    align: 'left',
                    itemId: 'tsSaveButton',
                    iconCls: 'x-fa fa-save',
                    handler: 'onSaveTS',
                    ui: 'action',
                    bind: {
                        disabled: '{tsDisabled}'
                    }
                },
                {
                    text: 'Submit',
                    align: 'right',
                    itemId: 'tsSubmitButton',
                    ui: 'action',
                    iconCls: 'x-fa fa-thumbs-o-up',
                    handler: 'onSubmitTS',
                    bind: {
                        disabled: '{tsDisabled}'
                    }
                }
            ]
        }
    ]
});
