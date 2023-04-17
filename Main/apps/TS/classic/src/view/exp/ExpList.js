/**
 * Created by steve.tess on 7/10/2018.
 */
Ext.define('TS.view.exp.ExpList', {
    extend: 'Ext.grid.Panel',

    xtype: 'explist',

    requires: [
        'TS.controller.exp.ExpListController',
        'TS.model.exp.ExpListModel'
    ],

    controller: 'explist',
    viewModel: 'explist',

    // stateful: true,
    // stateId: 'stateGridExpList',
    // //state events to save
    // stateEvents: ['columnmove', 'columnresize'],
    itemId: 'expListGrid',
    rowLines: false,

    bind: {
        store: '{explist}'
    },

    columns: [
        {
            dataIndex: 'id',
            hidden: true
        },
        {
            dataIndex: 'eKGroup',
            hidden: true
        },
        {
            dataIndex: 'reportDate',
            reference: 'expReportDate',
            hidden: true
        },
        {
            dataIndex: 'reportName',
            hidden: true
        },
        {
            dataIndex: 'expReportId',
            hidden: true
        },
        {
            dataIndex: 'expId',
            hidden: true
        },
        {
            xtype: 'datecolumn',
            text: 'Date',
            dataIndex: 'expDate',
            filter: {
                type: 'date'
            },
            plugins: 'responsive',
            flex: 1.5,
            format: ' m/d/Y',
            renderer: function (value) {
                var dt = new Date('1/1/2002'),
                    badDate = value < dt,
                    formattedDate = Ext.Date.format(new Date(value), DATE_FORMAT);
                return !badDate ? formattedDate : '';
            }
        }, {
            text: 'Employee',
            dataIndex: 'empId',
            flex: 2,
            menuDisabled: true,
            //only active employees when edit or new
            editor: 'field-employee',
            renderer: function (value) {
                //all employees when displaying
                var record = Ext.getStore('AllEmployees').getById(value),
                    tip = 'employeetooltip';
                return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
            },
            bind: {
                hidden: '{!isExa}'
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
            flex: 1.5
        }, {
            dataIndex: 'fwaName',
            text: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
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
                hidden: '{hideExpWbs3Name}'
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
            xtype: 'actioncolumn',
            reference: 'expenseCopyButton',
            flex: .5,
            resizable: true,
            menuDisabled: true,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-copy greyIcon',
                tooltip: 'Copy Expense',
                handler: 'copyExpenseItem',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    var settings = TS.app.settings;
                    return !settings.exCanModifyFwaExp && record.get('fwaId');
                }
            }]
        }, {
            xtype: 'actioncolumn',
            reference: 'expenseAttachDocButton',
            flex: .5,
            resizable: true,
            menuDisabled: true,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-paperclip greyIcon',
                tooltip: 'Attach Document',
                handler: 'attachExpenseDocument'
            }]
            ,renderer: function (value, metaData, rec, row, cell, store, view) {
                if (rec.get('attachmentCtDoc') > 0) {
                    metaData.style = 'background-color:#ff6666;';
                }
                return;
            }
        }, {
            xtype: 'actioncolumn',
            itemId: 'deleteColumn',
            menuDisabled: true,
            hideable: false,
            menuText: 'Delete',
            resizable: true,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-trash redIcon',
                tooltip: 'Delete Expense',
                handler: 'deleteExpense',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    var settings = TS.app.settings;
                    return !settings.exCanModifyFwaExp && record.get('fwaId');
                }
            }],
            flex: .5,
            bind: {
                //hidden: '{!isExaAndCanEdit}'
            }
        }
    ],

    listeners: {
        itemdblclick: 'onExpenseGridDblClick'
    }

});