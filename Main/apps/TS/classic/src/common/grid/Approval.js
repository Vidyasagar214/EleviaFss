Ext.define('TS.common.grid.Approval', {
    extend: 'Ext.grid.Panel',
    xtype: 'grid-approval',

    requires: [
        'TS.model.ts.TsSummaryRow'
    ],

    controller: 'grid-approval',
    reference: 'tsgridapproval',
    timesheetId: null,
    selectedTimesheet: null,
    scrollable: true,

    plugins: [{
        ptype: 'employeetooltip'
    }],

    store: {
        model: 'TS.model.ts.TsSummaryRow',
        loader: {url: true},
        proxy: {
            type: 'default',
            directFn: 'TimeSheet.GetTimesheetApprovalSummary',
            paramOrder: 'dbi|username|empId|tsPeriodId',
            extraParams: {
                tsPeriodId: 0 // Default; is updated on load
            },
            reader: {
                type: 'default',
                rootProperty: 'data.rows'
            },
            pageSize: 1000
        },
        listeners: {
            load: function (t, records, successful, message) {
                var settings = TS.app.settings;
                if (!successful) {
                    var error = {mdBody: 'Load of Timesheet Approval Summary failed(' + message.error.mdBody + ')).'};
                    Ext.GlobalEvents.fireEvent('Error', error);
                }
            }
        }
    },

    columns: [{
        text: 'id',
        dataIndex: 'id',
        hidden: true
    }, {
        text: 'Seq',
        dataIndex: 'Seq',
        hidden: true
    }, {
        text: 'Employee',
        dataIndex: 'empId',
        flex: .5,
        renderer: function (value, meta, record) {
            meta.style = 'text-decoration: underline !important; cursor: pointer !important;';
            return value;
        }
    }, {
        text: 'Name',
        dataIndex: 'empName',
        flex: 1,
        renderer: function (value, meta, record) {
            meta.tdCls = 'empId';
            meta.style = 'text-decoration: underline !important; cursor: pointer !important;';
            return value;
        }
    }, {
        xtype: 'column-hours',
        sortable: false,
        bind: {
            dayCount: '{dayCount}',
            startDate: '{startDate}',
            isApproval: true
        },
        align: 'right'
    }, {
        dataIndex: 'expectedHours',
        hidden: true
    }, {
        text: 'Ttl Hrs',
        dataIndex: 'totalHrs',
        align: 'right',
        flex: .5,
        renderer: function (value, meta, record) {
            if (parseInt(value) < parseInt(record.get('expectedHrs'))) {
                meta.style = 'background-color: red;';
            }
            return value;
        }
    }, {
        text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Hrs'},
        dataIndex: 'totalFwaHrs',
        align: 'right',
        flex: .5,
        renderer: function (value, meta, record) {
            if (parseInt(value) != parseInt(record.get('totalHrs'))) {
                meta.style = 'background-color: #ffffad;';
            }
            return value;
        }
    }, {
        text: 'Reg Hrs',
        dataIndex: 'totalRegHrs',
        align: 'right',
        flex: .5
    }, {
        text: 'Ovt Hrs',
        dataIndex: 'totalOvtHrs',
        align: 'right',
        flex: .5,
        bind:{
            hidden: '{!settings.tsAllowOvtHrs}'
        }
    }, {
        text: 'Ovt2 Hrs',
        dataIndex: 'totalOvt2Hrs',
        align: 'right',
        flex: .5,
        bind:{
            hidden: '{!settings.tsAllowOvt2Hrs}'
        }
    }, {
        text: 'Travel Hrs',
        dataIndex: 'totalTravelHrs',
        align: 'right',
        flex: .5,
        bind:{
            hidden: '{!settings.tsAllowTravelHrs}'
        }
    }, {
        text: 'Status',
        dataIndex: 'statusString',
        align: 'right',
        flex: .5
    }, {
        xtype: 'actioncolumn',
        sortable: false,
        menuDisabled: true,
        text: 'Approve',
        flex: .5,
        align: 'center',
        items: [{
            iconCls: 'x-fa fa-check-circle greenIcon',
            tooltip: 'Approve',
            handler: 'acceptApproval',
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                return record.get('status') == TsStatus.Blank || (record.get('status' == TsStatus.Approved) && record.get('visionStatus') == 'U');
            }
        }]
    }, {
        xtype: 'actioncolumn',
        sortable: false,
        menuDisabled: true,
        text: 'Reject',
        flex: .5,
        align: 'center',
        items: [{
            iconCls: 'x-fa fa-times-circle redIcon',
            tooltip: 'Reject',
            handler: 'rejectApproval',
            isDisabled: function (view, rowIndex, colIndex, item, record) {
                return record.get('status') == TsStatus.Blank || (record.get('status' == TsStatus.Approved) && record.get('visionStatus') == 'U');
            }
        }]
    }],
    listeners: {
        cellclick: 'openTimesheetEditor'
    }
});