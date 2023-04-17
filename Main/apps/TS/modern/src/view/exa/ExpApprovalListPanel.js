/**
 * Created by steve.tess on 8/23/2018.
 */
Ext.define('TS.view.exa.ExpApprovalListPanel', {
    extend: 'Ext.container.Container',

    xtype: 'exp-approval-list-panel',

    layout: 'fit',
    title: 'Expense List',

    items:[
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            docked: 'top',
            bind:{
                title: 'Expenses for {formattedDate}'
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    align: 'left',
                    iconCls: 'x-fa fa-chevron-left',
                    handler: 'navigateBackToDateGrid'
                }
            ]
        },
        {
            xtype: 'list',
            reference: 'exa-approvals',
            bind: {
                store: '{expapprovallist}',
                selection: '{selectedExpReport}'
            },
            scrollable: {
                directionLock: true,
                x: false
            },
            itemTpl: new Ext.XTemplate('<div style="font-weight:bold" ><h1><b>Employee&nbsp;&nbsp;</b>{[this.getEmployeeName(values)]}</div></h1>',
                '<div style="width:100%;">' +
                '<div style="float:left;width:100px;font-weight:bold;">Rpt Name</div>' +
                '<div style="float:right;width:100px;font-weight:bold;">Status</div>' +
                '<div style="margin:0 auto;width:100px;font-weight:bold;text-align: right;">Amount</div>' +
                '</div>',
                '<table style="width: 90%">' +
                '<tr>' +
                '<td style="width: 33%; text-align: left;">{[this.getReportName(values)]}</td>' +
                '<td style="width: 33%;text-align: right;">{[this.getAmountTotal(values)]}</td>' +
                '<td style="width: 33%; text-align: right;">{[this.getStatus(values)]}</td>' +
                '</tr>' +
                '</table>',
                {
                    getEmployeeName: function (values) {
                        return values.empId + ' - ' + Ext.getStore('AllEmployees').getById(values.empId).get('empName');
                    },

                    getReportName: function (values) {
                        return values.reportName;
                    },

                    getAmountTotal: function (values) {
                        return Ext.util.Format.currency(values.ttlRptExpenses,'$',2);
                    },

                    getStatus: function (values) {
                        var record = Ext.getStore('FwaStatus').findRecord('value', values.status);
                        return (record ? record.get('description') : '');
                    }
                }),
            preventSelectionOnDisclose: false,
            onItemDisclosure: true,

            listeners: [
                {
                    itemsingletap: 'onEditSelectedExpenses',
                    selectionchange: 'onExpensesSelectionTap'
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [{
                text: 'Approve',
                ui: 'action',
                align: 'left',
                iconCls: 'x-fa fa-check-circle',
                itemId: 'approveButton',
                handler: 'approveSelectedExpReport',
                bind: {
                    disabled: '{!exa-approvals.selection}'
                }
            },{
                text: 'Reject',
                ui: 'decline',
                align: 'right',
                iconCls: 'x-fa fa-times-circle',
                itemId: 'rejectButton',
                handler: 'rejectSelectedExpReport',
                bind: {
                    disabled: '{!exa-approvals.selection}'
                }
            }]
        },
        {
            xtype: 'component',
            docked: 'bottom',
            height: 24,
            style: 'text-align:center;border-top:1px solid #ccc',
            html: '* Double tap expense to highlight.'
        }
    ]
});