Ext.define('TS.model.ts.TsSummary', {
    extend: 'TS.model.Base',

    idProperty: 'tsPeriodId',
    identifier: 'uuid',

    fields: [
        {
            name: 'tsPeriodId',
            type: 'auto'
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
            name: 'expectedHrs',
            type: 'auto'
        },
        {
            name: 'rows',
            type: 'auto'  //references TsSummaryRow is list<TsSummaryRow>
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'TimeSheet.GetTimesheetApprovalSummary',
        paramOrder: 'dbi|username|tsPeriodId'
    }
});
