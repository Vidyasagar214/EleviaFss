Ext.define('TS.controller.crew.CrewAssignController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.crewassign',

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            fwa = vw.selectedFwa,
            grid = me.lookup('gridCrewAssignPopup'),
            store = Ext.getStore('AllCrews');

        fwa.set('fwaStatusId',FwaStatus.Create);
        if (vm.get('isScheduler')) {
            store.getProxy().setExtraParams({
                limit: 1000,
                isPreparedByMe: TS.app.settings.schedCrewPreparedByMe
            });
            store.load({
                callback: grid.setStore(store)
            });
        } else {
            grid.setStore(Ext.getStore('CrewsForNewFWA'));
            store = grid.getStore();
            store.clearFilter(true);
            vw.lookup('myCrewsOnlyButton').setValue(true);
        }

        if (fwa.get('fwaStatusId') == 'C') {
            me.lookup('deleteCrewBtn').setHidden(false);
        } else {
            me.lookup('deleteCrewBtn').setHidden(true);
        }
    },

    onSaveCrewAssign: function () {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            isScheduler = vm.get('name') == 'Scheduler',
            fwa = view.selectedFwa,
            grid = Ext.first('grid-crewassign'),
            store = grid.getStore(),
            record = grid.selection,
            crewDisplay = view.crewNameDisplay,
            settings = TS.app.settings,
            ttlHrs = 0;

        store.clearFilter(true);
        if (1 == 2) {
            if (!Ext.first('#schedStartDateField').getValue() || !Ext.first('#schedEndDateField').getValue()) {
                Ext.Msg.alert('Warning', 'Selected ' + settings.fwaAbbrevLabel + ' is missing Start Date and/or End Date fields');
                return;
            } else {
                TS.Util.onCheckForDoubleBookedEmployees(fwa.get('fwaId'), record.get('crewId'), fwa.get('schedStartDate'), fwa.get('schedEndDate'), function (status) {
                    if (status) {
                        settings.crewChange = true;
                        fwa.set('scheduledCrewId', record.get('crewId'));
                        fwa.set('scheduledCrewName', record.get('crewName'));
                        crewDisplay.setValue(record.get('crewName'));
                        view.close();
                    } else {
                        settings.crewChange = false;
                        return false;
                    }
                }.bind(me));
            }
        } else {
            Ext.each(fwa.get('hours').getRange(), function (hrs) {
                ttlHrs += hrs.get('regHrs') + hrs.get('ovtHrs') + hrs.get('ovt2Hrs') + hrs.get('travelHrs');
            });
            if (ttlHrs > 0 && vm.get('newFwa')) {
                Ext.Msg.confirm("Please Confirm", "<div align=\"center\">Employee Hours have been entered and will be deleted if the " + settings.crewLabel + " is changed. Do you wish to continue?</div>", function (btn) {
                    if (btn === 'yes') {
                        fwa.set('scheduledCrewId', record.get('crewId'));
                        fwa.set('scheduledCrewName', record.get('crewName'));
                        crewDisplay.setValue(record.get('crewName'));
                        view.close();
                    } else {

                    }
                });
            } else {
                fwa.set('scheduledCrewId', record.get('crewId'));
                fwa.set('scheduledCrewName', record.get('crewName'));
                crewDisplay.setValue(record.get('crewName'));
                view.close();
            }
        }
    },

    onCancelCrewAssign: function () {
        var me = this,
            grid = me.lookup('gridCrewAssignPopup'),
            store = grid.getStore();
        store.clearFilter(true);
        me.getView().close();
    },

    onCloseCrew: function () {
        var me = this,
            grid = me.lookup('gridCrewAssignPopup'),
            store = grid.getStore();
        store.clearFilter(true);
    },

    onResize: function (comp, width, height, eOpts) {
        var me = this,
            settings = TS.app.settings,
            grid = me.lookup('gridCrewAssignPopup');
        grid.setWidth(width);
    },

    onMyCrewsCheck: function (component, newValue, oldValue) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            store,// = Ext.getStore('CrewsForNewFWA'),
            grid = me.lookup('gridCrewAssignPopup');

        if (newValue) {
            grid.setStore(Ext.getStore('CrewsForNewFWA'));
            store = grid.getStore();
            store.clearFilter(true);
            store.filterBy(function (obj) {
                return obj.get('crewChiefEmpId') == settings.empId;
            });
        } else {
            grid.setStore(Ext.getStore('AllCrews'));
            store = grid.getStore();
            store.clearFilter(true);
            //need to check and see if a crew member
            store.filterBy(function (obj) {
                var cMember = false;
                Ext.each(obj.get('crewMembers').getRange(), function (crew) {
                    cMember = crew.get('crewMemberEmpId') === settings.empId;
                    if (cMember)
                        return false;
                });
                if (cMember || obj.get('crewChiefEmpId') == settings.empId || obj.get('preparedByEmpId') == settings.empId) {
                    return true;
                }
            });
        }
    },

    onDeleteCrew: function (component, e) {
        var me = this,
            view = me.getView(),
            fwa = view.selectedFwa,
            crewDisplay = view.crewNameDisplay;

        fwa.set('scheduledCrewId', '');
        fwa.set('scheduledCrewName', '');
        crewDisplay.setValue();
        view.close();
    },

    onSelectionCrewChange: function (obj, selected) {
        var me = this,
            view = me.getView(),
            saveBtn = view.lookup('selectCrewBtn');

        saveBtn.setDisabled(false);
    }
});
