Ext.define('TS.model.ts.TsCell', {
    extend: 'TS.model.Base',

    fields: [
        {
            name: 'workDate',
            type: 'fssdate'
        },
        {
            name: 'startTime',
            type: 'fssdate'
        },
        {
            name: 'endTime',
            type: 'date'
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
    //no proxy part of Tsheet/Trow
});
