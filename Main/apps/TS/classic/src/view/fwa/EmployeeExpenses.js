/**
 * Created by steve.tess on 7/11/2018.
 */
Ext.define('TS.view.fwa.EmployeeExpenses', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-employeeexpenses',

    requires: [
        'TS.controller.fwa.EmployeeExpensesController'
    ],

    controller: 'grid-employeeexpenses',
    reference: 'employeeExpensesGrid',
    itemId: 'employeeExpensesGrid',

    scrollable: 'y',

    deferRowRender: true,

    bind: {
        disabled: '{!canModifyFwaExp}'
    },

    columns: [
        {
            dataIndex: 'id',
            hidden: true
        },
        {
            dataIndex: 'fwaId',
            hidden: true
        },
        {
            dataIndex: 'expReportId',
            hidden: true
        },
        {
            dataIndex: 'empId',
            hidden: true
        },
        {
            dataIndex: 'expId',
            hidden: true
        },
        {
            xtype: 'datecolumn',
            style: 'border-left: 1px solid #b0b0b0 !important;',
            text: 'Date',
            dataIndex: 'expDate',
            filter: {
                type: 'date'
            },
            plugins: 'responsive',
            flex: 1.5,
            format: ' m/d/Y',
            renderer: renderDate
            //     function (value, meta, record) {
            //     meta.style = "border-left: 1px solid #b0b0b0 !important;";
            //     var dt = new Date('1/1/2002'),
            //         badDate = value < dt,
            //         formattedDate = Ext.Date.format(new Date(value), DATE_FORMAT);
            //     return !badDate ? formattedDate : '';
            // }
        }, {
            text: 'Employee',
            dataIndex: 'empId',
            flex: 1,
            menuDisabled: true,
            //only active employees when edit or new
            editor: 'field-employee',
            renderer: function (value) {
                //all employees when displaying
                var record = Ext.getStore('AllEmployees').getById(value),
                    tip = 'employeetooltip';
                return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
            }
        }, {
            dataIndex: 'category',
            text: 'Category',
            flex: 2,
            renderer: function (value) {
                var record = Ext.getStore('ExpCategory').getById(value);
                return (record ? record.get('description') : '');
            }
        }, {
            dataIndex: 'description',
            text: 'Description',
            flex: 2
        }, {
            dataIndex: 'amount',
            align: 'right',
            text: 'Amount',
            renderer: Ext.util.Format.usMoney,
            flex: 1.5
        }, {
            dataIndex: 'fwaNum',
            text: {_tr: 'fwaAbbrevLabel', tpl: '{0}'},
            hidden: true,
            flex: 1.5
        }, {
            dataIndex: 'fwaName',
            text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
            hidden: true,
            flex: 3
        }, {
            dataIndex: 'wbs1',
            text: {_tr: 'wbs1Label', tpl: '{0}'},
            reference: 'wbs1Field',
            flex: 1.25,
            bind: {
                hidden: '{hideExpWbs1}'
            }
        }, {
            dataIndex: 'wbs1Name',
            text: {_tr: 'wbs1Label', tpl: '{0} Name'},
            flex: 2,
            bind: {
                hidden: '{hideExpWbs1Name}'
            }
        }, {
            dataIndex: 'wbs2',
            text: {_tr: 'wbs2Label', tpl: '{0}'},
            flex: 1,
            bind: {
                hidden: '{hideExpWbs2}'
            }
        }, {
            dataIndex: 'wbs2Name',
            text: {_tr: 'wbs2Label', tpl: '{0} Name'},
            flex: 2,
            bind: {
                hidden: '{hideExpWbs2Name}'
            }
        }, {
            dataIndex: 'wbs3',
            text: {_tr: 'wbs3Label', tpl: '{0}'},
            flex: 1,
            bind: {
                hidden: '{hideExpWbs3}'
            }
        }, {
            dataIndex: 'wbs3Name',
            text: {_tr: 'wbs3Label', tpl: '{0} Name'},
            flex: 2,
            bind: {
                hidden: '{!hideExpWbs3Name}'
            }
        }, {
            xtype: 'checkcolumn',
            dataIndex: 'billable',
            text: 'Billable?',
            flex: 1,
            disabled: true,
            disabledCls: '',
            bind: {
                hidden: '{!displayBillable}'
            }
        },
        {
            xtype: 'checkcolumn',
            dataIndex: 'companyPaid',
            text: 'Company Paid?',
            flex: 1,
            disabled: true,
            disabledCls: '',
            bind: {
                hidden: '{!displayCompanyPaid}'
            }
        }, {
            dataIndex: 'account',
            text: 'Account',
            flex: 1.25,
            bind: {
                hidden: '{hideAccount}'
            },
            renderer: function (value, meta, rec) {
                var record = Ext.getStore('ExpAccount').getById(value);
                return (record ? record.get('account') : '');
            }
        }, {
            dataIndex: 'account',
            text: 'Account Name',
            flex: 1.25,
            bind: {
                hidden: '{hideAccountName}'
            },
            renderer: function (value, meta, rec) {
                var record = Ext.getStore('ExpAccount').getById(value);
                return (record ? record.get('accountName') : '');
            }
        }, {
            dataIndex: 'modified',
            xtype: 'textfield',
            hidden: true
        }, {
            xtype: 'actioncolumn',
            reference: 'expenseCopyButton',
            width: 25,
            //flex: .5,
            resizable: true,
            menuDisabled: true,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-copy blackIcon',
                tooltip: 'Copy Expense',
                handler: 'copyExpenseItem'
            }]
        }, {
            xtype: 'actioncolumn',
            reference: 'expenseAttachDocButton',
            width: 25,
            //flex: .5,
            resizable: true,
            menuDisabled: true,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-paperclip blackIcon',
                tooltip: 'Attach Document',
                handler: 'attachExpenseDocument'
            }],
            renderer: function (value, metaData, rec, row, cell, store, view) {
                if (rec.get('attachmentCtDoc') > 0) {
                    metaData.style = 'background-color:#ff6666;';
                }
                return;
            }
        }, {
            xtype: 'actioncolumn',
            reference: 'expenseDeleteButton',
            style: 'border-right: 1px solid #b0b0b0 !important;',
            itemId: 'deleteColumn',
            menuDisabled: true,
            hideable: false,
            menuText: 'Delete',
            resizable: true,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-trash redIcon',
                tooltip: 'Delete Expense',
                handler: 'deleteExpense'
            }],
            width: 25,
            renderer: function (value, meta, rec) {
                meta.style = "border-right: 1px solid #b0b0b0 !important;";
                return;
            }
            //flex: .5
        }
    ],

    listeners: {
        itemdblclick: 'onEmployeeExpenseGridDblClick'
    },

    dockedItems: [{
        xtype: 'toolbar',
        style: 'background: #e6e6e6 !important;',
        dock: 'bottom',
        items: [
            {
                xtype: 'button',
                reference: 'newEmployeeExpense',
                itemId: 'newEmployeeExpense',
                handler: 'startNewExpenseRow',
                iconCls: 'x-fa fa-plus greenIcon',
                tooltip: 'Add Expense'
            }
        ]
    }]
});