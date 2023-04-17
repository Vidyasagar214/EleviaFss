Ext.define('TS.controller.crew.UserSettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-usersettings',

    doSaveSettings: function () {
        var me = this,
            form = this.lookup('settingsForm'),
            settingsData = form.getValues(),
            settings = TS.app.settings;
        //need to check for missing values because of merge
        //Ext.Object.merge({}, settings, settingsData)
        if (!settingsData.availableForUseInField) settingsData.availableForUseInField = 0;
        UserConfig.SaveUserConfig(null, settings.username, settingsData, function (response, operation, success) {
            if (response && response.success) {
                //Ext.Msg.alert('Success', 'Settings successfully saved.');
                me.reloadUserConfig(settingsData);
                me.closeView();
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, me, {
            autoHandle: true
        });
    },

    reloadUserConfig: function (settingsData) {
        var me = this,
            email = window.userGlobal.email || '';
        UserConfig.GetByUsername(window.userGlobal.dbi, window.userGlobal.encrypted_username, 'Scheduler', function (response, operation, success) {
            if (response && response.success) {
                //reload settings first
                Ext.GlobalEvents.fireEvent('Settings:Loaded', response.data, true);
                //then reload views
                me.fireEvent('updatesettings', response.data);
                //reload scheduler crew
                Ext.GlobalEvents.fireEvent('updateCrewResource');
                //reload crew grid
                Ext.GlobalEvents.fireEvent('ResetCrews');
                //reload event grid
                Ext.GlobalEvents.fireEvent('updateSchedulerStores');
                //reload crew assign grid
                Ext.GlobalEvents.fireEvent('ResetCrewAssign');
                //reload fwa grid
                Ext.GlobalEvents.fireEvent('UpdateFwaGridFromScheduler');

                //moved to FwaListController;
                setTimeout(function () {
                    Ext.GlobalEvents.fireEvent('ClearFwaListFilters');
                }, 1500);

            } else if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, me, {
            autoHandle: true
        });
    },

    saveSchedDefaults: function () {
        var me = this,
            settings = TS.app.settings,
            schedDefaults = '',
            crt = '^',
            fwalist = Ext.first('fwalist');

        //crew tab
        schedDefaults += Ext.first('#filterCrewLName').getValue() + crt;
        schedDefaults += Ext.first('#filterCrewFname').getValue() + crt;
        schedDefaults += Ext.first('#filterCrewDefaultCrewRoleName').getValue() + crt;
        schedDefaults += Ext.first('#filterCrewEmpGroupName').getValue() + crt;
        //crewAssign tab
        schedDefaults += Ext.first('#filterCrewAssignEmpName').getValue() + crt;
        schedDefaults += Ext.first('#filterCrewAssignCrewRoleName').getValue() + crt;
        schedDefaults += Ext.first('#filterCrewAssignEmpGroupName').getValue() + crt;
        //empView tab
        if (Ext.first('#filterEmpViewEmpGroupName'))
            schedDefaults += Ext.first('#filterEmpViewEmpGroupName').getValue() + crt;
        if (Ext.first('#filterEmpViewEmpName'))
            schedDefaults += Ext.first('#filterEmpViewEmpName').getValue() + crt;
        //emp schedule tab
        schedDefaults += Ext.first('#filterEmpViewGanttEmpGroupName').getValue() + crt;
        schedDefaults += Ext.first('#filterEmpViewGanttEmpName').getValue() + crt;
        //scheduler crew
        schedDefaults += Ext.first('#filterSchedulerCrew').getValue();

        UserConfig.SaveSchedulerDefaults(null, settings.username, schedDefaults, function (response, operation, success) {
            if (response && response.success) {
                //Ext.Msg.alert('Success', 'Settings successfully saved.');
                settings.schedFilters = schedDefaults;
                me.closeView();
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, me, {
            autoHandle: true
        });
    },

    onCloseWindow: function (component, e) {
        this.getView().close();
    }
});