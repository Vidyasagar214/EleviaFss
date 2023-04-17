/*
 * Settings Controller
 */

Ext.define('TS.controller.Settings', {
    extend: 'Ext.app.Controller',

    requires: [
        'TS.Util',
        'TS.service.SynchronousCachedDirect'
    ],

    stores: [
        'TS.store.WorkCodes',
        'TS.store.Employees',
        'TS.store.AllEmployees',
        'TS.store.Roles',
        'TS.store.ActiveRoles',
        'TS.store.EmpGroups',
        'TS.store.MyEmpGroup',
        'TS.store.PriorityList',
        'TS.store.NonFieldActionItem',
        'TS.store.AllCrews',
        'TS.store.CrewsForNewFWA',
        'TS.store.ActionType',
        'TS.store.WorkCodeList',
        'TS.store.BillCategory',
        'TS.store.TsEmployees',
        'TS.store.UnitCode',
        'TS.store.EquipmentList',
        'TS.store.Schedulers',
        'TS.store.ActionOwners',
        'TS.store.Duration',
        'TS.store.DaySequence',
        'TS.store.WeekdaySequence',
        'TS.store.MonthSequence',
        'TS.store.FwaStatus',
        'TS.store.HoursList',
        'TS.store.Providers',
        'TS.store.ExpCategory',
        'TS.store.ExpAccount',
        'TS.store.ExpFwaList',
        'TS.store.HolidaySchedule',
        'TS.store.LaborCodes',
        'TS.store.EmployeeSkillSetList',
        'TS.store.EmployeeRegistrationList',
        'TS.store.WeekdayByIndex'
        // 'TS.store.UDFList1',
        // 'TS.store.UDFList2'
    ],

    listen: {
        global: {
            'Settings:Loaded': 'doSynchronousCachedDirect'
        }
    },

    /*
     * Load the static stores based on user configuration
     * Initialize anything else that needs to happen after user settings have loaded
     */

    doSynchronousCachedDirect: function(settingsData, fromSettings) {
        if (MobileApp) {
            // TODO: Add a catch clause.
            TS.service.SynchronousCachedDirect.init()
                .then(() => this.onSettingsLoad(settingsData, fromSettings))
                .catch(error => {
                });
        } else {
            this.onSettingsLoad(settingsData, fromSettings);
        }

    },

    onSettingsLoad: function (settingsData, fromSettings) {
        TS.app.settings = Ext.create('TS.model.admin.UserConfig', settingsData).data;
        //Configure dictionary
        TS.common.TR.dictionary = 'TS.app.settings';
        if (fromSettings) {
            return;
        }
        // Grab any autoloading stores, and set a single firing load callback
        // Trigger off the rest of the app when all the global stores have loaded
        var loadedStores = 0;

        Ext.data.StoreManager.each(function (store) {
            if (store.settingsDependency) {
                store.on('load', function () {
                    loadedStores++;
                    if (loadedStores >= this.stores.length) {
                        Ext.GlobalEvents.fireEvent('App:Ready'); // Fire the app ready event to create the viewport
                    }
                }, this, {
                    single: true
                });
                store.load(function (records, op, success) {
                    if (!success) {
                        Ext.GlobalEvents.fireEvent('Error', {
                            message: 'Failure on call to ' + op.getResponse().action + '.' + op.getResponse().method + ' (' + op.error.mdBody + ').'
                        });
                    }
                });
            }
        }, this);
    }

});
