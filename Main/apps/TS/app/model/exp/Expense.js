/**
 * Created by steve.tess on 7/10/2018.
 */
Ext.define('TS.model.exp.Expense', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'expReportId', type: 'string'},
        {name: 'expId', type: 'string'},
        {
            name: 'expDate',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'reportDate',
            type: 'date',
            dateFormat: 'c'
        },
        {name: 'status', type: 'string'},
        {name: 'empId', type: 'string'},
        {name: 'fwaId', type: 'string'},
        {name: 'fwaNum', type: 'string'},
        {name: 'fwaName', type: 'string'},
        {name: 'category', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'amount', type: 'float'},
        {name: 'wbs1', type: 'string'},
        {name: 'wbs2', type: 'string'},
        {name: 'wbs3', type: 'string'},
        {name: 'billable', type: 'bool'},
        {name: 'companyPaid', type: 'bool'},
        {name: 'modified', type: 'auto'},
        {name: 'account', type: 'string'},
        {name: 'reason', type: 'string'},
        {
            name: 'readOnly',
            type: 'bool'
        },
        {
            name: 'readOnlyReason',
            type: 'string'
        },
        {name: 'other', type: 'string'},
        {name: 'miles', type: 'float'},
        {name: 'amountPerMile', type: 'float'},
        {name: 'eKGroup', type: 'string'},
        {name: 'attachmentsToDelete', type: 'auto'},
        {
            name: 'attachments',
            reference: 'TS.model.shared.Attachment' //this is a list
        },
        {
            name: 'attachmentsToAdd',
            type: 'auto'
        },
        {
            name: 'attachmentCtDoc',
            type: 'int'
        }
    ]


});