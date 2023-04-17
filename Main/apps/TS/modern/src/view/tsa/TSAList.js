Ext.define('TS.view.tsa.TSAList', {
    extend: 'Ext.grid.Grid',
    xtype: 'tsa-list',

    isScheduler: false,
    // scrollable: {
    //     directionLock: true,
    //     x: false
    // },
    
    columns: [
        {
            text: 'Start',
            dataIndex: 'startDate',
            renderer: function (value, rec) {
                var d = new Date(rec.get('startDate'));
                return Ext.Date.format(d, DATE_FORMAT);// (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            },
            flex: 1
        },
        {
            text: 'End',
            dataIndex: 'endDate',
            renderer: function (value, rec) {
                var d = new Date(rec.get('endDate'));
                return Ext.Date.format(d, DATE_FORMAT); //return (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
            },
            flex: 1
        },
        {
            dataIndex: 'tsPeriodId',
            hidden: true
        }
    ]

});