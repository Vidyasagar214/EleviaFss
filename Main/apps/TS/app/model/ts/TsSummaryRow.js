Ext.define('TS.model.ts.TsSummaryRow', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {
            name: 'id',
            type: 'auto'
        },
        {
            name: 'seq',
            type: 'auto'
        },
        {
            name: 'empId',
            type: 'auto'
        },
        {
            name: 'empName',
            type: 'auto'
        },
        {
            name: 'org',
            type: 'auto'
        },
        {
            name: 'tsAllowOvtHrs',
            type: 'auto'
        },
        {
            name: 'tsAllowOvt2Hrs',
            type: 'auto'
        },
        {
            name: 'tsAllowTravelHrs',
            type: 'auto'
        },
        {
            name: 'totalRegHrs',
            type: 'auto'
        },
        {
            name: 'totalOvtHrs',
            type: 'auto'
        },
        {
            name: 'totalOvt2Hrs',
            type: 'auto'
        },
        {
            name: 'totalTravelHrs',
            type: 'auto'
        },
        {
            name: 'totalHrs',
            type: 'auto'
        },
        {
            name: 'totalFwaHrs',
            type: 'auto'
        },
        {
            name: 'expectedHrs',
            type: 'auto'
        },
        {
            name: 'status',
            type: 'auto'
        },
        {
            name: 'visionStatus',
            type: 'string'
        },
        {
            name: 'statusString',
            type: 'auto'
        },
        {
            name: 'cells',
            type: 'auto'  //references TsCell is list<TsCell>
        }
    ]
});
