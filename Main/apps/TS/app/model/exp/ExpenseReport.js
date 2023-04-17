/**
 * Created by steve.tess on 7/15/2018.
 */
Ext.define('TS.model.exp.ExpenseReport', {
    extend: 'TS.model.Base',

    required:[
        'TS.model.exp.Expense'
    ],

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'expReportId', type: 'string'},
        {name: 'empId', type: 'string'},
        {name: 'reportDate',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'formattedReportDate',
            mapping: function (data) {
                return Ext.Date.format(new Date(data.reportDate),DATE_FORMAT);
            }
        },
        {name: 'reportName', type: 'string'},
        {name: 'visionStatus', type: 'string'},
        {name: 'status', type: 'string'},
        {name: 'submittedBy', type: 'string'},
        {name: 'submittedDate', type: 'date'},
        {name: 'apprRejBy', type: 'string'},
        {name: 'apprRejDate', type: 'date'},
        {name: 'apprRejComment', type: 'string'},
        {name: 'signature', type: 'auto'},
        {name: 'expLines', type: 'auto'}
    ]

});