/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.controller.exa.ExpApprovalDateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.expapprovaldate',

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this,
            store = me.getViewModel().getStore('expapprovaldatelist'), //Note how we access the correct store
            settings = TS.app.settings;

        store.getProxy().setExtraParams({
            empId: settings.empId
        });

        store.load();
    },

    selectExpenseApprovalDate: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('expapprovaldatelist'),
            record = grid.getSelection()[0],
            selectedDate = new Date(record.get('value')),
            approvalGrid = Ext.first('expapprovallist'),
            approvalListStore = approvalGrid.getStore();
        Ext.first('#approvalDateLabel').setHtml(Ext.Date.format(selectedDate, DATE_FORMAT));

        approvalListStore.getProxy().setExtraParams({
            expDate: selectedDate
        });

        approvalListStore.load({
            callback: this.afterExpenseApprovalDate,
            scope: this
        });
        approvalListStore.sort('empId', 'ASC');

        btn.up('window').close();
    },

    afterExpenseApprovalDate: function (results, operation, success) {

    },

    onExpApprovalDateClick: function (component, record, item, index, e) {
        Ext.first('#selectExpApprovalDateButton').setDisabled(false);
    },

    onCloseSelectExpense: function (btn, e) {
        btn.up('window').close();
    },
});