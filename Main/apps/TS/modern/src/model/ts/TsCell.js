Ext.define('TS.model.ts.TsCell', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'workDate',
            type: 'string'
        },
        {
            name: 'startTime',
            type: 'string'
        },
        {
            name: 'endTime',
            type: 'string'
        },
        {
            name: 'regHrs',
            type: 'float'
        },
        {
            name: 'ovtHrs',
            type: 'float'
        },
        {
            name: 'ovt2Hrs',
            type: 'float'
        },
        {
            name: 'travelHrs',
            type: 'float'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'fwaId',
            type: 'string'
        },
        {
            name: 'fwaNum',
            type: 'string'
        },
        {
            name: 'rowNum',
            type: 'auto'
        }
    ]
});
