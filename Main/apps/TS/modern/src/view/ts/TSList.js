Ext.define('TS.view.ts.TSList', {
    extend: 'Ext.grid.Grid',
    xtype: 'ts-list',

    isScheduler: false,
    // scrollable: {
    //     directionLock: true,
    //     x: false
    // },
    columns: [
        {
            text: 'Employee / Period',
            dataIndex: 'tsEmpName',
            cell: {
                innerCls: 'ts-multiline-cell',
                encodeHtml: false
            },
            renderer: function (value, rec) {
                var util = Ext.util.Format,
                    dateFn = util.date,
                    formatFn = util.format,
                    format = 'n/j/Y';

                return formatFn('<div>{0}</div><span>{1}</span>',
                    rec.get('tsEmpName'),
                    dateFn(rec.get('startDate'), DATE_FORMAT) + ' - ' + dateFn(rec.get('endDate'), DATE_FORMAT)
                );
            },
            flex: 1
        },
        {
            text: 'Status',
            dataIndex: 'statusString',
            width: 120
        },
        {
            dataIndex: 'tsPeriodId',
            hidden: true
        },
        {
            dataIndex: 'tsEmpId',
            hidden: true
        }
    ]
});
