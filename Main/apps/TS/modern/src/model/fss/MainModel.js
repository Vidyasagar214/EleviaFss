/**
 * Created by steve.tess on 5/16/2016.
 */
Ext.define('TS.model.fss.MainModel', {
    extend: 'TS.view.main.MainModel',

    alias: 'viewmodel.fss-main',

    stores: {
        fsslist: {
            model: 'TS.model.fss.FssList'
        }
    },

    constructor: function (config) {
        var me = this,
            store,
            settings = TS.app.settings,
            appAccessRaw = settings.appAccess.split('^'),
            appAccess = appAccessRaw.filter(function (el) {
                return el != '';
            }),
            appAccessRORaw = settings.appAccessRO.split('^'),
            appAccessRO = appAccessRORaw.filter(function (el) {
                return el != '';
            }),
            vw = me.getView();

        me.callParent([config]);

        store = me.getStore('fsslist');
        //SCHEDULER not available in modern
        // if (appAccess.indexOf('FS') >= 0) {
        //     store.add({app: 'Scheduler', name: settings.schedTitle, path: 'app-crew'})
        // }

        if (appAccess.indexOf('FF') >= 0) {
            settings.fsstext = settings.fwaLabelPlural;
            store.add({app: 'FWA', name: settings.fwaLabelPlural, path: 'app-fwa', icon: 'fss-fwa-list'});
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
                name: settings.tsTitle + ' Approvals',
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
            store.add({app: 'EXA', name: 'Expense Approvals', path: 'app-exa', icon: 'fss-expense-approval'});
            settings.expenseApprovalLinkDisplay = true;
            if (Ext.first('#expApprovalButton'))
                Ext.first('#expApprovalButton').setHidden(false);
        }
    },

    //Main model will implement this method
    getPageTitle: function () {
        return 'FSS';
    }

})
;