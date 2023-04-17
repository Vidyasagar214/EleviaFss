Ext.define('TS.model.ts.TsRow', {
    extend: 'TS.model.Base',

    idProperty: 'seq',
    identifier: {
        type: 'sequential',
        seed: 10000
    },

    fields: [
        {
            name: 'seq',
            type: 'auto'
        },
        {
            name: 'rowNum',
            type: 'auto'
        },
        {
            name: 'clientId',
            type: 'string'
        },
        {
            name: 'clientName',
            type: 'string'
        },
        {
            name: 'clientNumber',
            type: 'string'
        },
        {
            name: 'wbs1',
            type: 'string',
            allowNull: true
        },
        {
            name: 'wbs1Name',
            type: 'string'
        },
        {
            name: 'wbs2',
            type: 'string',
            allowNull: true
        },
        {
            name: 'wbs2Name',
            type: 'string'
        },
        {
            name: 'wbs3',
            type: 'string',
            allowNull: true
        },
        {
            name: 'wbs3Name',
            type: 'string'
        },
        {
            name: 'chargeType',
            type: 'string'
        },
        {
            name: 'billCategory',
            type: 'string'
        },
        {
            name: 'laborCode',
            type: 'string',
            default: '001'
        },
        {
            name: 'empId',
            type: 'string'
        },
        {
            name: 'empName',
            type: 'string'
        },
        {
            name: 'crewRoleId',
            type: 'int'
        },
        {
            name: 'reqComments',
            type: 'boolean'
        },
        {
            name: 'tsheetStatus',
            type: 'string'
        },
        {
            name: 'cells', //list - should
            type: 'auto'
            //reference:'TS.model.ts.TsCell'
        },
        {
            name: 'attachments', // Should be list
            reference: 'TS.model.shared.Attachment'
        }
    ]
    // no proxy used by timesheet
});
