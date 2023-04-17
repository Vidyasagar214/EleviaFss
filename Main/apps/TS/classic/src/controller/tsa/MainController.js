Ext.define('TS.controller.tsa.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.timesheetapproval',

    /**
     * Called when the view is created
     */
    init: function () {
        this.getView().setLoading(true);
        this.showTimesheetWindow();
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    // Opens a window containing the timesheet selection
    showTimesheetWindow: function () {
        var win = Ext.create('TS.view.ts.TimesheetPeriodApprovalSelect', {
                buttons: [
                    {
                        text: 'Open',
                        handler: 'selectTimesheet',
                        itemId: 'selectTimesheetApprovalButton',
                        disabled: true
                    }, {
                        text: 'Cancel',
                        align: 'right',
                        handler: 'onCancelTimesheet'
                    }
                ]
            }),
            grid = Ext.first('grid-timesheetperiod'),
            store = grid.getStore();
        store.load();
        win.show();
    },

    // Triggered when a timesheet is selected/opened
    selectTimesheet: function () {

        var win = Ext.first('window-timesheetperiodapprovalselect'),
            record = win.down('grid').getSelection()[0];
        if (record) {
            this.getView().selectedTimesheet = record;
            var store = this.lookup('tsApprovalGrid').getStore();
            store.getProxy().setExtraParams({
                tsPeriodId: record.get('tsPeriodId')
            });
            store.load({
                callback: this.afterTimesheetSelect,
                scope: this
            });
            store.sort('crewRoleId', 'ASC');
        }
    },

    onCancelTimesheet: function (obj, e) {
        Ext.first('window-timesheetperiodapprovalselect').close();
    },

    onSelectTimesheetPeriod: function () {
        Ext.first('#selectTimesheetApprovalButton').setDisabled(false);
    },

    // Triggered after a timesheet either succeeds or fails to open
    // Bound to the above callback for loading timesheet details
    afterTimesheetSelect: function (results, operation, success) {
        if (!Ext.first('window-timesheetperiodapprovalselect'))// && !Ext.first('window-timesheetperiodapprovalselect').items)
            return;
        var win = Ext.first('window-timesheetperiodapprovalselect'),
            record = win.down('grid').getSelection()[0],
            tsViewModel = this.getView().lookupViewModel(),
            tsRowGrid = this.lookup('tsApprovalGrid');
        tsRowGrid.selectedTimesheet = this.getView().selectedTimesheet;
         if (success) {
            this.setTimesheetViewModel(record);
            win.close();
            if (tsRowGrid) {
                tsRowGrid.getView().refresh();
            }
        } else {
            Ext.GlobalEvents.fireEvent('Error', operation.getError());
        }

        if(operation.getResponse().result.message && operation.getResponse().result.message.mdBody){
            var msg = operation.getResponse().result.message;
            Ext.Msg.alert(msg.mdTitleBarText, msg.mdBody);
        }
    },

    setTimesheetViewModel: function (record) {
        var tsViewModel = this.getView().lookupViewModel(),
            settings = TS.app.settings,
            store = Ext.getStore('TsEmployees'),
            store2 = Ext.getStore('Employees'),
            employee = store.getById(settings.empId) || store2.getById(settings.empId),
            startDt,
            endDt;

        startDt = record.get('startDate'); //new Date((record.get('startDate').getUTCMonth() + 1) + '/' + record.get('startDate').getUTCDate() + '/' + record.get('startDate').getUTCFullYear());
        endDt = record.get('endDate'); // new Date((record.get('endDate').getUTCMonth() + 1) + '/' + record.get('endDate').getUTCDate() + '/' + record.get('endDate').getUTCFullYear());
        tsViewModel.set({
            startDate: startDt,
            endDate: endDt
        });
        // Default to logged in user values
        record.set('empId', settings.empId);
        record.set('CrewRoleId', employee.get('defaultCrewRoleId'));

        tsViewModel.set('selectedTimesheet', record);
    }
});
