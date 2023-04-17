/**
 * Created by steve.tess on 7/16/2018.
 */
Ext.define('TS.view.exp.ExpenseReportList', {
    extend: 'Ext.grid.Panel',

    xtype: 'expreportlist',

    requires: [
        'TS.controller.exp.ExpReportController',
        'TS.model.exp.ExpReportModel'
    ],

    controller: 'expreport',
    viewModel: 'expreport',

    itemId: 'expReportListGrid',
    rowLines: false,

    bind: {
        store: '{expreportlist}'
    },

    columns: [
       {
            xtype: 'datecolumn',
            text: 'Date',
            dataIndex: 'reportDate',
            filter: {
                type: 'date'
            },
            plugins: 'responsive',
            flex: .75,
            format: ' m/d/Y',
            renderer: function (value) {
                var dt = new Date('1/1/2002'),
                    badDate = value < dt,
                    formattedDate = Ext.Date.format(new Date(value), DATE_FORMAT);
                return !badDate ? formattedDate : '';
            }
        }, {
            dataIndex: 'reportName',
            text: 'Report Name',
            flex: 1.25
        }, {
            dataIndex: 'status',
            text: 'Status',
            flex: 1,
            renderer: function (value) {
                var record = Ext.getStore('FwaStatus').findRecord('value', value);
                return (record ? record.get('description') : '');
            }
        }, //no need for action columns in selection , no save button
        {
            xtype: 'actioncolumn',
            width: 35,
            resizable: false,
            menuDisabled: true,
            hidden: true,
            items: [
                {
                    iconCls: 'x-fa fa-copy greyIcon',
                    tooltip: 'Copy',
                    handler: 'copyExpenseReport',
                    padding: '0 20 0 0',
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.get('expReportId') == '';
                    }
                }
            ]
        }, {
            xtype: 'actioncolumn',
            width: 35,
            resizable: false,
            menuDisabled: true,
            items: [
                {
                    iconCls: 'x-fa fa-trash redIcon',
                    tooltip: 'Delete',
                    handler: 'deleteExpenseReport',
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.get('expReportId') == '';
                    }
                }
            ]
        }

    ],

    listeners: {
        selectionchange: 'onSelectExpense',
        itemdblclick: 'onExpReportGridDblClick'
    }
});