Ext.define('TS.model.ts.TsPeriod', {
    extend: 'TS.model.Base',

    idProperty: 'tsheetId',

    fields: [
        {
            name: 'tsheetId',
            type: 'string'
        },
        {
            name: 'tsPeriod',
            type: 'int'
        },
        {
            name: 'startDate',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'endDate',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'closed',
            type: 'boolean'
        },
        {
            name: 'whenToSync',
            type: 'string'
        },
        {
            name: 'periodType',
            type: 'auto'
        },
        {
            name: 'acctPeriod',
            type: 'string'
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'TimeSheet.GetTimesheetPeriods',
        paramOrder: 'dbi|username'
    }
});
