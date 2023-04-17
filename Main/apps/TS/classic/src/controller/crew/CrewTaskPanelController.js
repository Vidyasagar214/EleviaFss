/**
 * Created by steve.tess on 6/7/2018.
 */
Ext.define('TS.controller.crew.CrewTaskPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.crewtaskpanel',

    listen: {
        global: {
            'ResetCrewTask': 'filterReset',
        }
    },
    /**
     * Called when the view is created
     */
    init: function () {
        // Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
        //     expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)), //30 days
        // }));
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            // grid = Ext.first('crewtaskgrid'),
            // store = grid.getStore(),
            label = Ext.first('#crewCurrentDate');


        if (label) {
            label.html = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT);
            vm.set('crewCurrentDate', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT));
            vm.set('dateDisplay', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT));
        }
        vm.set('isWeekView', false);
    },

    onBackToFSS: function () {

        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    filterByLastDay: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore(),
            yesterday = Ext.Date.format(Ext.Date.add(new Date(vm.get('crewCurrentDate')), Ext.Date.DAY, -1), DATE_FORMAT);

        if (vm.get('isWeekView')) {
            me.filterByWeekLast();
        } else {
            vm.set('crewCurrentDate', yesterday);
            vm.set('dateDisplay', Ext.Date.format(new Date(yesterday), DATE_FORMAT));
            store.clearFilter(true);
            //store.load();
            store.filterBy(function (item) {
                return Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) == Ext.Date.format(new Date(yesterday), DATE_FORMAT);
            })
            vm.set('isWeekView', false);
        }
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    filterByToday: function (component, e) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore(),
            currentDt = Ext.Date.format(new Date(), DATE_FORMAT);
        //console.log(currentDt);
        vm.set('crewCurrentDate', currentDt);
        vm.set('dateDisplay', Ext.Date.format(new Date(vm.get('crewCurrentDate')), DATE_FORMAT));
        store.clearFilter(true);
        store.filterBy(function (item) {
            return Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) == Ext.Date.format(new Date(currentDt), DATE_FORMAT);
        });
        vm.set('isWeekView', false);
    },

    onSaveToXcel: function () {
        var settings = TS.app.settings,
            vm = this.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            dt = Ext.Date.format(new Date(), DATE_FORMAT),
            selectedType = Ext.first('#groupByButtons').getValue(),
            selection = selectedType['groupByType'],
            label = selection == 'scheduledCrewName' ? settings.crewLabel : selection == 'clientName' ? settings.clientLabel : settings.wbs1Label,
            dailyWeeklyLabel = vm.get('isWeekView') ? 'Weekly ' : 'Daily ';
        grid.saveDocumentAs({
            type: 'excel',
            title: dailyWeeklyLabel + label + ' Task List',
            fileName: dt + '-' + label + '-Task List.xls'
        });
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    filterByNextDay: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore(),
            tomorrow = Ext.Date.format(Ext.Date.add(new Date(vm.get('crewCurrentDate')), Ext.Date.DAY, 1), DATE_FORMAT);
        if (vm.get('isWeekView')) {
            me.filterByWeekNext();
        } else {
            vm.set('crewCurrentDate', tomorrow);
            vm.set('dateDisplay', Ext.Date.format(new Date(tomorrow), DATE_FORMAT));
            store.clearFilter(true);
            store.filterBy(function (item) {
                return Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) == Ext.Date.format(new Date(tomorrow), DATE_FORMAT);
            })
            vm.set('isWeekView', false);
        }

    },

    onGroupChange: function (cmp, newValue, oldValue, eOpts) {
        var me = this,
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore();
        store.setGrouper(newValue["groupByType"]);
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    filterReset: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            crewCurrentDate = Ext.Date.format(new Date(), DATE_FORMAT),
            store = grid.getStore(),
            label = Ext.first('#crewCurrentDate');

        store.clearFilter(true);
        Ext.getBody().mask('Loading Tasks..');

        store.load(function (records, operation, success) {
            if (success)
                Ext.getBody().unmask();
        });

        vm.set('isWeekView', false);
        if (label) {
            label.html = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT);
            me.getViewModel().set('crewCurrentDate', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT));
            me.getViewModel().set('dateDisplay', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT));
        }
        //
        store.filterBy(function (item) {
            return Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) == Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT);
        });

    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    refreshCrewTask: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore(),
            label = Ext.first('#crewCurrentDate');

        store.clearFilter(true);
        store.reload();
        vm.set('isWeekView', false);
        // store.filterBy(function (item) {
        //     return Ext.Date.format(new Date(item.get('schedStartDate')), 'm-d-Y') == Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), 'm-d-Y');
        // })
        if (label) {
            label.html = Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT);
            me.getViewModel().set('crewCurrentDate', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT));
            me.getViewModel().set('dateDisplay', Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 1), DATE_FORMAT));
        }
    },

    openSettingsWindow: function (component, e) {
        Ext.create('TS.view.crew.window.UserSettings').show();
    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    onFwaGridDblClick: function (vw, record, item, index, e, eOpts) {
        var me = this,
            grid = Ext.first('#fwaListGrid');
        vw.deselect(record);
        //TODO send whole record across to save DB calls
        TS.app.settings.fromProjectTree = false;
        Ext.GlobalEvents.fireEvent('ShowSelectedFwa', record.get('fwaId'), record.get('schedStartDate'));
        Ext.first('#fwaForm').getForm().dirty = false;
        // if (me.getViewModel().get('isScheduler')) {
        //     //Ext.first('#refreshFwaListBtn').setHidden(true);
        // }
    },

    onGoToDate: function (component, e) {
        var me = this,
            goToDateWindow;

        if (me.goToDateWindow) {
            me.goToDateWindow.close();
        }

        goToDateWindow = Ext.create('TS.view.crew.GoToDate', {});
        goToDateWindow.setController('crewtaskpanel');
        goToDateWindow.show();
    },

    goToDate: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore(),
            goToDate = Ext.Date.format(new Date(Ext.first('#goToDateField').getValue()), DATE_FORMAT),
            dt;

        vm.set('crewCurrentDate', goToDate);
        vm.set('dateDisplay', Ext.Date.format(new Date(goToDate), DATE_FORMAT));
        store.clearFilter(true);
        //store.load();
        store.filterBy(function (item) {
            return Ext.Date.format(new Date(item.get('schedStartDate')), DATE_FORMAT) == Ext.Date.format(new Date(goToDate), DATE_FORMAT);
        });
        me.getView().close();
        vm.set('isWeekView', false);
    },

    cancelGoToDate: function (component, e) {
        this.getView().close();
    },

    filterByWeekLast: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore(),
            settings = TS.app.settings,
            dateNow = Ext.Date.add(new Date(vm.get('currentWeekStart')), Ext.Date.DAY, -7),
            weekStartDay = settings.schedWeeklyStartDay,
            startDate = Ext.Date.add(new Date(dateNow), Ext.Date.DAY, weekStartDay - dateNow.getDay()),
            endDate = Ext.Date.add(new Date(startDate), Ext.Date.DAY, 6);
        store.clearFilter(true);
        store.filterBy(function (item) {
            return Ext.Date.format(new Date(item.get('schedStartDate')), 'Y-m-d') >= Ext.Date.format(new Date(startDate), 'Y-m-d') &&
                Ext.Date.format(new Date(item.get('schedStartDate')), 'Y-m-d') <= Ext.Date.format(new Date(endDate), 'Y-m-d');
        });

        vm.set('crewCurrentDate', Ext.Date.format(startDate, DATE_FORMAT) + ' through ' + Ext.Date.format(endDate, DATE_FORMAT));
        vm.set('isWeekView', true);
        vm.set('currentWeekStart', startDate);
    },

    filterByWeekNext: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore(),
            settings = TS.app.settings,
            dateNow = Ext.Date.add(new Date(vm.get('currentWeekStart')), Ext.Date.DAY, 7),
            weekStartDay = settings.schedWeeklyStartDay,
            startDate = Ext.Date.add(new Date(dateNow), Ext.Date.DAY, weekStartDay - dateNow.getDay()),
            endDate = Ext.Date.add(new Date(startDate), Ext.Date.DAY, 6);
        store.clearFilter(true);
        store.filterBy(function (item) {
            return Ext.Date.format(new Date(item.get('schedStartDate')), 'Y-m-d') >= Ext.Date.format(new Date(startDate), 'Y-m-d') &&
                Ext.Date.format(new Date(item.get('schedStartDate')), 'Y-m-d') <= Ext.Date.format(new Date(endDate), 'Y-m-d');
        });

        vm.set('crewCurrentDate', Ext.Date.format(startDate, DATE_FORMAT) + ' through ' + Ext.Date.format(endDate, DATE_FORMAT));
        vm.set('isWeekView', true);
        vm.set('currentWeekStart', startDate);
    },

    filterByWeek: function () {
        var me = this,
            vm = me.getViewModel(),
            grid = Ext.first('#crewTaskGrid'),
            store = grid.getStore(),
            settings = TS.app.settings,
            dateNow = new Date(),
            weekStartDay = settings.schedWeeklyStartDay,
            startDate = Ext.Date.add(new Date(dateNow), Ext.Date.DAY, weekStartDay - dateNow.getDay()),
            endDate = Ext.Date.add(new Date(startDate), Ext.Date.DAY, 6);

        store.clearFilter(true);
        store.filterBy(function (item) {
            return Ext.Date.format(new Date(item.get('schedStartDate')), 'Y-m-d') >= Ext.Date.format(new Date(startDate), 'Y-m-d') &&
                Ext.Date.format(new Date(item.get('schedStartDate')), 'Y-m-d') <= Ext.Date.format(new Date(endDate), 'Y-m-d');
        });

        vm.set('crewCurrentDate', Ext.Date.format(startDate, DATE_FORMAT) + ' through ' + Ext.Date.format(endDate, DATE_FORMAT));
        vm.set('isWeekView', true);
        vm.set('currentWeekStart', startDate);
    }

});