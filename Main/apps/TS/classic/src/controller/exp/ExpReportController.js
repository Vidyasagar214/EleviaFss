/**
 * Created by steve.tess on 7/16/2018.
 */
Ext.define('TS.controller.exp.ExpReportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.expreport',


    init: function () {

        var me = this,
            store = me.getViewModel().getStore('expreportlist'), //Note how we access the correct store
            settings = TS.app.settings;

        store.getProxy().setExtraParams({
            empId: settings.empId
        });

        store.load();
    },

    /**
     * @param {Ext.view.View} component
     * @param {Ext.data.Model} record
     * @param {HTMLElement} item
     * @param {Number} index
     * @param {Ext.event.Event} e
     */
    onExpReportGridDblClick: function (component, record, item, index, e) {
       Ext.GlobalEvents.fireEvent('SelectExpenseReport', record);
    },

    /**
     * @param {Ext.selection.Model} component
     * @param {Ext.data.Model[]} selected
     */
    onSelectExpense: function (component, selected) {
        var settings = TS.app.settings;
        settings.expenseReportId = selected[0].data;
        if (Ext.first('#selectExpenseButton'))
            Ext.first('#selectExpenseButton').setDisabled(false);
    },

    copyExpenseReport: function (grid, rowIndex) {
        var store = grid.getStore(),
            settings = TS.app.settings,
            record = store.getAt(rowIndex),
            expenseLines = [],
            newExpenseRpt;

        if (record) {
            newExpenseRpt = record.copy(null);
            newExpenseRpt.set('id', Ext.data.identifier.Uuid.Global.generate());
            newExpenseRpt.set('oldRptId', record.get('expReportId'));
            newExpenseRpt.set('reportName', '');
            newExpenseRpt.set('reportDate', new Date());
            newExpenseRpt.set('expReportId', '');
            newExpenseRpt.set('signature', null);
            settings.expenseReportCopy = true;
            store.add(newExpenseRpt);
        }
    },

    deleteExpenseReport: function (grid, rowIndex) {
        var store = grid.getStore(),
            settings = TS.app.settings,
            record = store.getAt(rowIndex),
            expReportId = record.get('expReportId');

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to delete this expense report?", function (btn) {
            if (btn == 'yes') {
                if (expReportId) {
                    Exp.DeleteExpenseReport(null, settings.username, expReportId, function (response, operation, success) {
                        if (response && response.success) {
                            store.removeAt(rowIndex);
                        } else if (response) {
                            store.reload();
                            Ext.GlobalEvents.fireEvent('Error', response);
                        }
                    }.bind(this));
                } else {
                    store.removeAt(rowIndex);
                }
            }
        });
    }
});