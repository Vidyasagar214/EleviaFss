Ext.define('TS.controller.fss.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.fss-main',

    mixins: {offline: "TS.controller.fwa.MainOfflineController"},
    constructor: function () {
        this.callParent(arguments);
        this.mixins.offline.constructor(this);
    },

    init: function () {
        var me = this;

        if (IS_OFFLINE && MobileApp && TS.app.settings.supportOffline) {
            Ext.Msg.confirm("Confirmation", "Application is currently offline (@" + Ext.Date.format(new Date(JSON.parse(localStorage.getItem('offlineDateTime'))), 'm/d/y h:i A') +
                "). Would you like to sync-up and go back on line?", function (btn) {
                if (btn === 'yes') {
                    //call sync-up method in fwa\MainOfflineController
                    me.goOnline();
                    //refresh grid
                    me.reloadGrid();
                } else if (btn === 'no') {
                    // do nothing for now
                }
            });
        }

        me.showHideFssButttonList();
    },

    showHideFssButttonList: function () {
        var settings = TS.app.settings,
            appAccessRaw = settings.appAccess.split('^'),
            appAccess = appAccessRaw.filter(function (el) {
                return el != '';
            }),
            appAccessRORaw = settings.appAccessRO.split('^'),
            appAccessRO = appAccessRORaw.filter(function (el) {
                return el != '';
            }),
            store = this.getStore('fsslist'),
            fwaButton = Ext.first('#fwaListButton'),
            tsButton = Ext.first('#tsButton'),
            tsApprovalButton = Ext.first('#tsApprovalButton'),
            expButton = Ext.first('#expensesButton'),
            expApprovalButton = Ext.first('#expApprovalButton');

        fwaButton.setHidden(appAccess.indexOf('FF') === -1);
        tsButton.setHidden(appAccess.indexOf('FT') === -1 || IS_OFFLINE);
        tsApprovalButton.setHidden(!settings.tsIsApprover || IS_OFFLINE);
        expButton.setHidden(appAccess.indexOf('FE') == -1 || IS_OFFLINE );
        expApprovalButton.setHidden(!settings.exIsApprover || IS_OFFLINE);

        settings.fwaReadOnly = false;
        settings.timesheetReadOnly = false;
        settings.expenseReadOnly = false;

        if (appAccessRO.indexOf('FF') >= 0) {
            settings.fwaReadOnly = true;
        }
        if (appAccessRO.indexOf('FT') >= 0) {
            settings.timesheetReadOnly = true;
        }
        if (appAccessRO.indexOf('FE') >= 0) {
            settings.expenseReadOnly = true;
        }
    },

    reloadGrid: function () {
        var me = this,
            store = me.getStore('fsslist'),
            settings = TS.app.settings,
            appAccessRaw = settings.appAccess.split('^'),
            appAccess = appAccessRaw.filter(function (el) {
                return el != '';
            }),
            vw = me.getView();

        store.removeAll();

        if (appAccess.indexOf('FF') >= 0) {
            store.add({app: 'FWA', name: settings.fwaLabelPlural, path: 'app-fwa', icon: 'fss-fwa-list'});
            settings.fwaLinkDisplay = true;
            if (Ext.first('#fwaListButton'))
                Ext.first('#fwaListButton').setHidden(false);
        }
        if (appAccess.indexOf('FT') >= 0 && !IS_OFFLINE) {
            store.add({app: 'TS', name: settings.tsTitle + 's', path: 'app-ts', icon: 'fss-timesheet'});
            settings.timesheetLinkDisplay = true;
            if (Ext.first('#tsButton'))
                Ext.first('#tsButton').setHidden(false);
        }
        if (settings.tsIsApprover && !IS_OFFLINE) {
            store.add({
                app: 'TSA',
                name: settings.tsTitle + ' Approval',
                path: 'app-tsa',
                icon: 'fss-timesheet-approval'
            });
            settings.timesheetApprovalLinkDisplay = true;
            if (Ext.first('#tsApprovalButton'))
                Ext.first('#tsApprovalButton').setHidden(false);
        }

        if (appAccess.indexOf('FE') >= 0 && !IS_OFFLINE) {
            store.add({app: 'EXP', name: 'Expenses', path: 'app-exp', icon: 'fss-expenses'});
            settings.expenseLinkDisplay = true;
            if (Ext.first('#expensesButton'))
                Ext.first('#expensesButton').setHidden(false);
        }
        if (settings.exIsApprover && !IS_OFFLINE) {
            store.add({app: 'EXA', name: 'Expense Approval', path: 'app-exa', icon: 'fss-expense-approval'});
            settings.timesheetApprovalLinkDisplay = true;
            if (Ext.first('#expApprovalButton'))
                Ext.first('#expApprovalButton').setHidden(false);
        }
    },

    onButtonApplicationClick: function (obj, e, rec) {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('fsslist'),
            selectedFSS = store.findRecord('name', obj.getText());

        Ext.GlobalEvents.fireEvent('ChangeViewport', selectedFSS.get('app'));
        Ext.Viewport.setActiveItem(selectedFSS.get('path'));
        me.closeView();

        if (selectedFSS.get('app') == 'FWA')
            Ext.first('#offLineButton').setText(IS_OFFLINE ? 'Go Online' : 'Go Offline');
    },

    onApplicationSelection: function (obj, e, eOpts) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            selectedFSS = vm.get('selectedFSS');

        // if(IS_OFFLINE && selectedFSS.get('app') == 'FWA'){
        //     Ext.Msg.alert('FYI', 'Currently working offline');
        // }

        Ext.GlobalEvents.fireEvent('ChangeViewport', selectedFSS.get('app'));
        Ext.Viewport.setActiveItem(selectedFSS.get('path'));
        me.closeView();

        if (selectedFSS.get('app') == 'FWA')
            Ext.first('#offLineButton').setText(IS_OFFLINE ? 'Go Online' : 'Go Offline');
    }
});