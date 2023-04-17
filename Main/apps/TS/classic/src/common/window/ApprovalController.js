Ext.define('TS.common.window.ApprovalController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-approval',

    init: function () {

        var me = this,
            selectedTsheet = me.getView().selectedTsheet,
            startDate = Ext.Date.format(new Date(selectedTsheet.get('startDate')), Ext.Date.defaultFormat),
            endDate = Ext.Date.format(new Date(selectedTsheet.get('endDate')), Ext.Date.defaultFormat),
            tsPeriod;

        // Set the title based on the week period
        me.getView().setTitle('Timesheet Summary: ' + startDate + ' - ' + endDate);

        // Set the grid store's view's period ID
        tsPeriodId = me.getView().selectedTsheet.get('tsPeriodId');
        me.lookup('tsApprovalGrid').getStore().getProxy().extraParams.tsPeriodId = tsPeriodId;

    },

    listen: {
        global: {
            'RefreshParentGrid': 'refreshParentGrid'
        }
    },


    refreshParentGrid: function () {
        var store = this.lookup('tsApprovalGrid').getStore();
        store.reload();
    }

});

