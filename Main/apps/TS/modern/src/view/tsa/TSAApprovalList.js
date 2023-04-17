Ext.define('TS.view.tsa.TSAApprovalList', {
    extend: 'Ext.container.Container',
    xtype: 'tsa-approvallist',

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            title: {_tr: 'tsTitle', tpl: 'Approval {0}s'},
            cls: 'ts-navigation-header',
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    iconCls: 'x-fa fa-chevron-left',
                    align: 'left',
                    handler: 'onTsBackBt'
                }
            ]
        },
        {
            xtype: 'component',
            height: 20,
            docked: 'top',
            userCls: 'ts-user-details',
            bind: {
                data: '{selectedTSA}'
            },
            tpl: new Ext.XTemplate('<div class="periods">{[this.getDates(values)]}</div>',
                {
                    getDates: function (values) {
                        var start = TS.common.Util.createUTCDate(values.get('startDate')),
                            end = TS.common.Util.createUTCDate(values.get('endDate')),
                            format = function (v) {
                                return Ext.Date.format(v, DATE_FORMAT);
                            };
                        return format(start) + ' - ' + format(end);
                    }
                }
            ),
            style: 'background:#fff;text-align:center;font-weight:bold;padding-bottom:0.5em;font-size: 1em;'
        },
        {
            xtype: 'list',
            reference: 'approvals',
            bind: {
                store: '{tsaapprovallist}',
                selection: '{currentTSARow}'
            },
            // scrollable: {
            //     directionLock: true,
            //     x: false
            // },
            itemCls: 'ts-timesheet-row',
            itemTpl: new Ext.XTemplate('<h1>{[this.getEmployeeName(values)]}</h1>',
                '<div class="hours-row">{[this.getStartEndDates(values)]}</div>',
                '<div class="approval-hours">',
                '<label>Status=</label><span>{statusString},</span>',
                '<label>Total=</label><span style="{[this.getBackColor(values)]}">{totalHrs},</span>',
                '<label>FWA=</label><span style="{[this.getFwaBackColor(values)]}">{totalFwaHrs}</span></br>',
                '<label>Reg=</label><span style="{[this.getBackColor(values)]}">{totalRegHrs}',
                '{[this.getOvtHrs(values)]}',
                '{[this.getOvt2Hrs(values)]}',
                '{[this.getTravelHrs(values)]}</span>',

                '</div>',
                {
                    //we need this because sometimes all we have is the empId
                    getEmployeeName: function (values) {
                        return Ext.getStore('TsEmployees').getById(values.empId).get('empName');
                    },

                    getOvtHrs: function (values) {
                        var settings = TS.app.settings;
                        if (settings.tsAllowOvtHrs) {
                            return ', </span><label>Ovt=</label><span style=' + this.getBackColor(values) + '>' + values.totalOvtHrs + ''
                        } else {
                            return '';
                        }
                    },

                    getOvt2Hrs: function (values) {
                        var settings = TS.app.settings;
                        if (settings.tsAllowOvt2Hrs) {
                            return ', </span><label>Ovt2=</label><span style=' + this.getBackColor(values) + '>' + values.totalOvt2Hrs + ''
                        } else {
                            return '';
                        }
                    },

                    getTravelHrs: function (values) {
                        var settings = TS.app.settings;
                        if (settings.tsAllowTravelHrs) {
                            return ', </span><label>Travel=</label><span style=' + this.getBackColor(values) + '>' + values.totalTravelHrs + ''
                        } else {
                            return '';
                        }
                    },

                    getBackColor: function (values) {
                        if (values.totalHrs < values.expectedHrs) {
                            return 'color: #FFFFFF; background-color: #FF0000; font-weight: 500;'
                        }
                    },

                    getFwaBackColor: function (values) {
                        if (values.totalHrs !== values.totalFwaHrs) {
                            return 'background-color: #FFFFAD; font-weight: 500;'
                        }
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
                            i = 0;

                        for (; i < dayCount; i++) {
                            ttlHrs = this.getDailyHrsTtl(values.cells, cDate);
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
            preventSelectionOnDisclose: false,
            onItemDisclosure: true,

            listeners: [
                {
                    disclose: 'onEditSelectedTimesheet'
                },
                {
                    selectionchange: 'onTsSelectionChange'
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Approve',
                    itemId: 'approveTsButton',
                    ui: 'action',
                    bind: {
                        disabled: '{!approvals.selection}'
                    },
                    align: 'left',
                    iconCls: 'x-fa fa-check-circle',
                    handler: 'approveSelectedTimesheet'
                },
                {
                    text: 'Reject',
                    itemId: 'rejectTsButton',
                    ui: 'decline',
                    bind: {
                        disabled: '{!approvals.selection}'
                    },
                    align: 'right',
                    iconCls: 'x-fa fa-times-circle',
                    handler: 'rejectSelectedTimesheet'
                }
            ]
        }
    ]
});