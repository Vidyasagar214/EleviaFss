Ext.define('TS.model.ts.Tsheet', {
    extend: 'Ext.data.Model',

    idProperty: 'tsheetId',
    identifier: 'uuid',

    requires: [
        'TS.model.ts.TsRow'
    ],

    fields: [
        {
            name: 'tsheetId',
            type: 'string'
        },
        {
            name: 'tsEmpId',
            type: 'string'
        },
        {
            name: 'tsEmpName',
            type: 'string'
        },
        {
            name: 'tsPeriodId',
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
            name: 'status',
            type: 'string'
        },
        {
            name: 'visionStatus',
            type: 'string'
        },
        {
            name: 'statusString',
            type: 'string'
        },
        {
            name: 'submittedBy',
            type: 'string'
        },
        {
            name: 'submittedDate',
            type: 'auto'
        },
        {
            name: 'approvedBy',
            type: 'string'
        },
        {
            name: 'approvedDate',
            type: 'auto'
        },
        {
            name: 'signature',
            type: 'auto'
        },
        {
            name: 'comments',
            type: 'string' //limit to 255 characters
        }
    ],

    hasMany: [
        {
            model: 'TS.model.ts.TsRow',
            role: 'rows'
        }
    ],

    proxy: {
        type: 'default',
        directFn: 'TimeSheet.Save',
        paramOrder: 'dbi|username|timesheet'
    }
});