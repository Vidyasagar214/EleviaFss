Ext.define('TS.view.grid.TimesheetPeriod', {
    extend: 'Ext.grid.Panel',

    requires: [
        'TS.model.ts.TsPeriod'
    ],

    xtype: 'grid-timesheetperiod',

    scrollable: true,
    reference: 'tsGrid',
    columns: [{
        flex: 1,
        xtype: 'datecolumn',
        text: 'Start Date',
        dataIndex: 'startDate',
        renderer: function (value) {
            var dt = value; // (new Date((value.getUTCMonth() + 1) + '/' + value.getUTCDate() + '/' + value.getUTCFullYear()));
            return Ext.Date.format(dt, DATE_FORMAT);
        }
    }, {
        flex: 1,
        xtype: 'datecolumn',
        text: 'End Date',
        dataIndex: 'endDate',
        renderer: function (value) {
            var dt = value;// (new Date((value.getUTCMonth() + 1) + '/' + value.getUTCDate() + '/' + value.getUTCFullYear()));
            return Ext.Date.format(dt, DATE_FORMAT);
        }
    }, {
        flex: 1,
        dataIndex: 'tsPeriodId',
        hidden: true
    }],

    initComponent: function () {
        Ext.apply(this, {
            store: Ext.Object.merge((this.store || {}), {
                model: 'TS.model.ts.TsPeriod',
                loader: {url: true}
            })
        });
        this.callParent(arguments);
    },

    listeners: {
        selectionchange: 'onSelectTimesheetPeriod'
    }
});
