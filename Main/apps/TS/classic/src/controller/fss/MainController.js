Ext.define('TS.controller.fss.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.fss-main',

    init: function () {
        TS.app.settings.crewLoaded = false;
        TS.app.settings.schedulerGanttLoaded = false;
        TS.app.settings.fwaListLoaded = false;
        TS.app.settings.crewAssignLoaded = false;
        TS.app.settings.availableViewLoaded = false;
        TS.app.settings.empScheduleGantt = false;
        TS.app.settings.crewTaskLoaded = false;

        TS.app.schedulerNeedsRefresh = false;
        TS.app.fwaListNeedsRefresh = false;
        TS.app.settings.crewAssignNeedsRefresh = false;
        TS.app.settings.employeeGanttNeedsRefresh = false;
        TS.app.settings.crewTaskNeedsRefresh = false;
    },

    onApplicationSelection: function (rowModel, record) {
        var me = this,
            settings = TS.app.settings;

        if (!record.get('app')) {
            Ext.first('fss-list').getSelectionModel().deselectAll();
            Ext.first('fss-list-east').getSelectionModel().deselectAll();
            return;
        }
        //used by scheduler to open specific tab
        settings.activeSchedTab = record.get('activeTab');

        Ext.GlobalEvents.fireEvent('ChangeViewport', record.get('app'));
        me.closeView();
    },

    onActionSelection: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            settings = TS.app.settings;

        if (!record.get('app')) {
            Ext.first('fss-list').getSelectionModel().deselectAll();
            Ext.first('fss-list-east').getSelectionModel().deselectAll();
            return;
        }
        //used by scheduler to open specific tab
        settings.activeSchedTab = record.get('activeTab');

        Ext.GlobalEvents.fireEvent('ChangeViewport', record.get('app'));
        me.closeView();
    }
});