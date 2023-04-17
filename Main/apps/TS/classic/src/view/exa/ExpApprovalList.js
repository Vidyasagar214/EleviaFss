/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.view.exa.ExpApprovalList', {
    extend: 'Ext.grid.Panel',

    xtype: 'expapprovallist',

    requires: [
        'TS.controller.exa.ExpApprovalListController',
        'TS.model.exa.ExpApprovalListModel'
    ],

    controller: 'expapprovallist',
    viewModel: 'expapprovallist',

    plugins: [{
        ptype: 'employeetooltip'
    }],

    // stateful: true,
    // stateId: 'stateGridExpList',
    // //state events to save
    // stateEvents: ['columnmove', 'columnresize'],
    itemId: 'expApprovalListGrid',
    rowLines: false,

    bind: {
        store: '{expapprovallist}'
    },

    disabledCls: '',

    columns: [
        {
            dataIndex: 'expReportId',
            hidden: true
        },
        {
            xtype: 'datecolumn',
            text: 'Date',
            dataIndex: 'reportDate',
            renderer: renderDate
            //hidden: true
        }, {
            text: 'Employee',
            dataIndex: 'empId',
            renderer: function (value, meta, record) {
                meta.style = 'text-decoration: underline !important; cursor: pointer !important;';
                return value;
            }
        },{
            text: 'Name',
            dataIndex: 'empId',
            flex: 1,
            menuDisabled: true,
            //only active employees when edit or new
            editor: 'field-employee',
            renderer: function (value, meta, record) {
                //all employees when displaying
                var record = Ext.getStore('AllEmployees').getById(value),
                    tip = 'employeetooltip';
                meta.tdCls = 'empId';
                meta.style = 'text-decoration: underline !important; cursor: pointer !important;';
                return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
            }
        }, {
            dataIndex: 'reportName',
            text: 'Report Name',
            flex: 1.25
        }, {
            dataIndex: 'ttlRptExpenses',
            align: 'right',
            text: 'Amount Total',
            renderer: Ext.util.Format.usMoney,
            flex: .5
        }, {
            dataIndex: 'status',
            text: 'Status',
            flex: 1,
            renderer: function (value) {
                var record = Ext.getStore('FwaStatus').findRecord('value', value);
                return (record ? record.get('description') : '');
            }
        }, {
            xtype: 'actioncolumn',
            sortable: false,
            menuDisabled: true,
            text: 'Approve',
            flex: .5,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-check-circle greenIcon',
                tooltip: 'Approve',
                handler: 'acceptApproval',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    if(!record.get('expLines') || record.get('expLines').length == 0 )
                        return true;
                    return record.get('status') == TsStatus.Blank || (record.get('status' == TsStatus.Approved) && record.get('visionStatus') == 'U');
                }
            }]
        }, {
            xtype: 'actioncolumn',
            sortable: false,
            menuDisabled: true,
            text: 'Reject',
            flex: .5,
            align: 'center',
            items: [{
                iconCls: 'x-fa fa-times-circle redIcon',
                tooltip: 'Reject',
                handler: 'rejectApproval',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    if(!record.get('expLines') || record.get('expLines').length == 0 )
                        return true;
                    return record.get('status') == TsStatus.Blank || (record.get('status' == TsStatus.Approved) && record.get('visionStatus') == 'U');
                }
            }]
        }
    ],
    listeners: {
        cellclick: 'openExpenseReportEditor'
    }

});