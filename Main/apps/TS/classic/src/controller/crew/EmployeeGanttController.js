/**
 * Created by steve.tess on 11/9/2017.
 */
Ext.define('TS.controller.crew.EmployeeGanttController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.panel-employeegantt',

    listen: {
        controller: {
            '*': {
                // 'updatesettings': 'reloadEventStore'
            }
        },

        global: {
            'ResetEmployeeViewGantt': 'filterBySelectedDate', //refreshEmployeeGantt
            'ResetEmployeeGanttAfterFwaSave':'refreshEmployeeGantt'
        },

        store: {
            'eventstore': {
                load: 'onEventStoreLoad'
            }
        }
    },

    init: function () {
        this.initViewModelBindings();
        this.callParent(arguments);
        this.goToDefaultStartDate(this.lookup('employee-scheduler'));
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    openSettingsWindow: function () {
        Ext.create('TS.view.crew.window.UserSettings').show();
    },

    openAboutFss: function(){
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    onEventStoreLoad: function () {
        if(Ext.first('#crewTabPanel').getActiveTab().getReference() != 'tabEmployeeViewGanttPanel'){
            return;
        }
        this.goToDefaultStartDate(this.lookup('employee-scheduler'));
    },

    goToDefaultStartDate: function (gantt) {
        var me = this,
            vm = me.getViewModel(),
            dt = new Date(),
            newDate = Ext.Date.add(dt, Ext.Date.DAY, 1);
        newDate.setHours(0, 0, 0, 0);
        if (vm.get('employeeViewGanttDate')) {
            gantt.setStartDate(vm.get('employeeViewGanttDate'));
        }
        else {
            gantt.setStartDate(newDate);
            vm.set('employeeViewGanttDate', newDate);
        }
    },

    onGanttRender: function (gantt) {
        var me = this,
            view = gantt.getSchedulingView(),
            settings = TS.app.settings,
            dt,
            newDate,
            dayNum,
            diff;
        gantt.setViewPreset('hourAndDay');
        gantt.getSchedulingView().setTimeResolution(Sch.util.Date.MINUTE, settings.schedTimeAxisGranularity);
        gantt.setTimeColumnWidth(100);

        if (gantt.highlightHolidays){
            Ext.each(gantt.getTimeAxis().getRange(), function (ta) {
                var workDate = ta.get('start'),
                    isHoliday = 0;
                isHoliday = Ext.getStore('HolidaySchedule').findBy(function (rec) {
                    if (Ext.Date.format(new Date(rec.get('holidayDate')), DATE_FORMAT) === Ext.Date.format(new Date(workDate), DATE_FORMAT)) {
                        return rec;
                    }
                });

                if (isHoliday > -1) {
                    ta.setCls('holiday');
                }
            });
        }
        gantt.createToolTip(me.getDataForTooltipTpl, me);
    },

    initViewModelBindings: function () {
        var me = this,
            viewModel = me.getViewModel(),
            scheduler = Ext.first('scheduler-employeeview'),
            store = scheduler.getResourceStore();

        /*
         If VisibleHoursStart is changed then filter the timeaxis,
         This is a two way bind. Model change and field change will lead both to filter action
         */
        //'{settings.schedVisibleHoursStart}'
        viewModel.bind('{settings.schedVisibleHoursStart}', function (obj) {

            if (obj) {
                me.timeAxisFilter();
            }

        }, me);

        /*
         If VisibleHoursEnd is changed then filter the timeaxis,
         This is a two way bind. Model change and field change will lead both to filter action
         */
        //'{settings.schedVisibleHoursEnd}'
        viewModel.bind('{settings.schedVisibleHoursEnd}', function (obj) {

            if (obj) {
                me.timeAxisFilter();
            }

        }, me);

        viewModel.bind('{settings.schedTimeAxisGranularity}', function (obj) {

            if (obj > 0) {
                scheduler.getSchedulingView().setTimeResolution('mi', obj);
            }

        }, me);

    },

    timeAxisFilter: function () {
        var viewModel = this.getViewModel(),
            scheduler = Ext.first('scheduler-employeeview'),
            settings = TS.app.settings,
            startTimeValue = new Date(settings.schedVisibleHoursStart), //scheduler.startDate
            endTimeValue = new Date(settings.schedVisibleHoursEnd), //scheduler.endDate
            endHours = endTimeValue ? endTimeValue.getHours() : 24,
            startHours = startTimeValue ? startTimeValue.getHours() : 0,
            preset;

        try {
            scheduler.getTimeAxis().clearFilter();
            scheduler.getTimeAxis().filterBy(function (tick) {
                return (tick.start.getHours() >= startHours && tick.start.getHours() <= endHours);
            });
        } catch (exception) {
            //<debug>
            console.debug('getCurrentZoomLevelIndex is returning a float', exception);
            //</debug>
        }
    },

    filterBySelectedDate: function(dt){
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            dt = vm.get('egSelectedDate') ? vm.get('egSelectedDate') : new Date(),
            scheduler = me.lookup('employee-scheduler'),
            eventStore = scheduler.getEventStore(),
            resourceStore = scheduler.getResourceStore(),
            newDate = new Date(dt);

        newDate.setHours(0, 0, 0, 0);
        vm.set('employeeViewGanttDate', newDate);
        resourceStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        resourceStore.load();
        eventStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        eventStore.load();
        //refresh UI
        scheduler.getView().refresh();
        vm.set('egSelectedDate','');
    },

    filterByLastDay: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            currentGanttDate = vm.get('employeeViewGanttDate'),
            scheduler = me.lookup('employee-scheduler'),
            eventStore = scheduler.getEventStore(),
            resourceStore = scheduler.getResourceStore(),
            newDate = new Date(currentGanttDate);

        newDate.setDate(newDate.getDate() - 1);
        vm.set('employeeViewGanttDate', newDate);
        resourceStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        resourceStore.load();
        eventStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        eventStore.load( function(records, opt, success){
            if(success){
                me.onGanttRender(scheduler);
            }
        });
        //refresh UI
        //scheduler.getView().refresh();
    },


    filterByToday: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            currentGanttDate = vm.get('employeeViewGanttDate'),
            scheduler = me.lookup('employee-scheduler'),
            eventStore = scheduler.getEventStore(),
            resourceStore = scheduler.getResourceStore(),
            newDate = new Date();

        newDate.setHours(0, 0, 0, 0);
        vm.set('employeeViewGanttDate', newDate);
        resourceStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        resourceStore.load();
        eventStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        eventStore.load(function(records, opt, success){
            if(success){
                me.onGanttRender(scheduler);
            }
        });
        //refresh UI
        //scheduler.getView().refresh();
    },


    filterByNextDay: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            currentGanttDate = vm.get('employeeViewGanttDate'),
            scheduler = me.lookup('employee-scheduler'),
            eventStore = scheduler.getEventStore(),
            resourceStore = scheduler.getResourceStore(),
            newDate = new Date(currentGanttDate);

        newDate.setDate(newDate.getDate() + 1);
        vm.set('employeeViewGanttDate', newDate);
        resourceStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        resourceStore.load();
        eventStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        eventStore.load(function(records, opt, success){
            if(success){
                me.onGanttRender(scheduler);
            }
        });
        //refresh UI
        //scheduler.getView().refresh();
    },

    filterLessThan: function (btn, pressed, eOpts) {
        var me = this,
            vm = me.getViewModel(),
            scheduler = me.lookup('employee-scheduler'),
            resourceStore = scheduler.getResourceStore();

        if (!pressed) {
            resourceStore.clearFilter();
            btn.setText('< 8 Hrs');
            btn.setTooltip('View Hours < 8');
        }
        else {
            resourceStore.filterBy(function (obj) {
                return obj.get('totalSchedHrs') < 8;
            });
            btn.setText('All Hrs');
            btn.setTooltip('View All Hrs');
        }

    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    filterReset: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            scheduler = me.lookup('employee-scheduler'),
            eventStore = scheduler.getEventStore(),
            resourceStore = scheduler.getResourceStore(),
            newDate = new Date();

        newDate.setHours(0, 0, 0, 0);
        newDate.setDate(newDate.getDate() + 1);
        vm.set('employeeViewGanttDate', newDate);
        resourceStore.clearFilter(true);
        resourceStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            employeeId: settings.empId
        });
        resourceStore.load();
        eventStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            employeeId: settings.empId
        });
        eventStore.load(function(records, opt, success){
           if(success){
               me.onGanttRender(scheduler);
           }
        });
        //refresh UI
        //scheduler.getView().refresh();
    },

    /**
     * @param {Sch.view.SchedulerGridView} scheduler
     * @param {Sch.model.Event} eventRecord
     * @param {Ext.event.Event} e
     */
    onEventDblClick: function (scheduler, record, e) {
        var me = this,
            vm = me.getViewModel();

        if (record) {
            //this.redirectTo('fwa/' + record.get('fwaId'));
            Ext.GlobalEvents.fireEvent('ShowSelectedFwa', record.get('fwaId'), record.get('schedStartDate'));
            vm.set('egSelectedDate', record.get('startDateTime'));
        }
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    refreshEmployeeGantt: function (component, e) {
        var me = this,
            scheduler = me.lookup('employee-scheduler'),
            eventStore = scheduler.getEventStore(),
            resourceStore = scheduler.getResourceStore();

        resourceStore.reload();
        eventStore.reload();
        //refresh UI
        scheduler.getView().refresh();
    },

    onGoToDate: function (component, e) {
        var me = this,
            goToDateWindow;

        if (me.goToDateWindow) {
            me.goToDateWindow.close();
        }

        goToDateWindow = Ext.create('TS.view.crew.GoToDate', {});
        goToDateWindow.setController('panel-employeegantt');
        goToDateWindow.show();
    },

    goToDate: function (component, e) {
        var me = this,
            vw = me.getView(),
            scheduler = Ext.first('scheduler-employeeview'),
            goToDate = new Date(Ext.first('#goToDateField').getValue());

        goToDate.setHours(0, 0, 0, 0);
        me.filterByGetDate(goToDate);
        me.getView().close();
    },

    filterByGetDate: function (goToDate) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            scheduler = Ext.first('scheduler-employeeview'),
            eventStore = scheduler.getEventStore(),
            resourceStore = scheduler.getResourceStore(),
            newDate = new Date(goToDate);

        //newDate.setDate(newDate.getDate() + 1);
        vm.set('employeeViewGanttDate', newDate);
        resourceStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        resourceStore.load();
        eventStore.getProxy().setExtraParams({
            dt: newDate.toDateString(),
            //dt: new Date().toDateString(),
            employeeId: settings.empId
        });
        eventStore.load(function(records, opt, success){
            if(success){
                me.onGanttRender(scheduler);
            }
        });
        //refresh UI
        //scheduler.getView().refresh();
    },

    cancelGoToDate: function (component, e) {
        this.getView().close();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    openStatusLegend: function () {
        Ext.create('TS.view.crew.window.Legend').show();
    }

});