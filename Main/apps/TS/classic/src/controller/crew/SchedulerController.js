Ext.define('TS.controller.crew.SchedulerController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.panel-scheduler',

    requires: [
        'TS.view.crew.window.Legend',
        'TS.view.crew.window.UserSettings'
    ],

    currentViewPreset: null,

    listen: {
        controller: {
            '*': {
                'updatesettings': 'reloadEventStore'
            }
        },

        global: {
            'updateSchedulerStores': 'reloadSchedulerStores',
            'updateCrewResource': 'reloadCrewResource',
            'UpdateUnplannedStore': 'onReloadUnplanned',
            'ReloadEventStores': 'reloadEventStore',
            'ReloadEventStoreOnly': 'reloadEventStoreOnly',
            'RefreshSchedulerScreen': 'refreshSchedulerScreen',
            'ScrollToDateOnLoad': 'scrollToDateOnLoad'
        },

        store: {
            'eventstore': {
                load: 'onEventStoreLoad'
            }
        }
    },

    init: function () {
        var me = this;

        me.initViewModelBindings();
        me.callParent(arguments);
    },

    refreshScheduler: function () {
        var me = this,
            scheduler = me.lookup('scheduler') || Ext.first('scheduler-crew'),
            unplanned = me.lookup('unplannedfwagrid') || Ext.first('#unplannedfwagrid'),
            resourceStore = me.lookup('scheduler').getResourceStore() || Ext.first('#resourcestore');

        resourceStore.load(); //scheduler resource grid
        scheduler.getEventStore().load(); //scheduler event grid
        unplanned.getStore().load(); //unscheduled grid

    },

    onBackToFSS: function () {

        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    scrollToDateOnLoad: function () {
        var me = this,
            settings = TS.app.settings,
            scheduler = this.lookup('scheduler');
        me.goToDefaultStartDate(scheduler);
    },

    /*
     * Scheduler Store Load Listeners
     */
    onEventStoreLoad: function () {
        if (Ext.first('#crewTabPanel').getActiveTab().getReference() != 'tabSchedulerPanel') {
            return;
        }
        var me = this,
            settings = TS.app.settings,
            scheduler = this.lookup('scheduler');

        if (settings.gotDefaultDate)
            me.goToDefaultStartDate(scheduler);
        else {
            var newDate = new Date().setHours(12, 0, 0, 0);
            scheduler.scrollToDateCentered(new Date(newDate));
        }

    },
    /*
     * Scheduler Methods
     */
    // zoomToEntireMonth: function () {
    //     var me = this,
    //         scheduler = Ext.first('scheduler-crew');
    //     scheduler.setViewPreset('weekAndMonth', new Date() - 4, new Date() + 30, true);
    //     scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.WEEK, 1);
    //     scheduler.setTimeColumnWidth(400);
    //     //disable zoom in if 'D' since hourAndDay is max zoom in
    //     //me.lookup('zoomInBtn').setDisabled(true);
    //     Ext.first('#zoomInBtn').setTooltip('View last week');
    //     Ext.first('#zoomOutBtn').setTooltip('View next week');
    //     me.lookup('zoomWeeklyButton').setTooltip('Week View');
    // },

    onSchedulerRender: function (scheduler) {
        var me = this,
            view = scheduler.getSchedulingView(),
            settings = TS.app.settings,
            dt,
            newDate,
            dayNum,
            diff;
        // At this stage, we can reference the container Element for this component and setup the drop zone
        new TS.common.dd.CrewSchedulerDropZone(scheduler.getEl(), {
            schedulerView: view
        });

        me.clearTimeAxisFilter();
        switch (settings.schedDefaultTimeframe) {
            case 'W':// W = launch scheduler in “week view” (same behavior as clicking the Week View button)
                //enable zoom in if 'W'
                scheduler.setViewPreset('weekAndDay');
                scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.DAY, 1);
                scheduler.setTimeColumnWidth(150);
                Ext.first('#zoomInBtn').setTooltip('View last month');
                Ext.first('#zoomOutBtn').setTooltip('View next month');
                me.lookup('zoomWeeklyButton').setTooltip('Day View');
                break;
            case 'D':// D = launch scheduler in “day view” (what we have now)
                scheduler.setViewPreset('hourAndDay');
                scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.MINUTE, settings.schedTimeAxisGranularity);
                scheduler.setTimeColumnWidth(100);
                //disable zoom in if 'D' since hourAndDay is max zoom in
                //me.lookup('zoomInBtn').setDisabled(true);
                Ext.first('#zoomInBtn').setTooltip('View last week');
                Ext.first('#zoomOutBtn').setTooltip('View next week');
                me.lookup('zoomWeeklyButton').setTooltip('Week View');
                break;
            default:
                if (settings.schedTimeAxisGranularity == 1440) {
                    // me.lookup('zoomInBtn').setDisabled(false);
                    scheduler.setViewPreset('weekAndDay');
                    scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.DAY, 1);
                    scheduler.setTimeColumnWidth(150);
                    Ext.first('#zoomInBtn').setTooltip('View last month');
                    Ext.first('#zoomOutBtn').setTooltip('View next month');
                } else {
                    scheduler.setViewPreset('hourAndDay');
                    scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.MINUTE, settings.schedTimeAxisGranularity);
                    scheduler.setTimeColumnWidth(100);
                    Ext.first('#zoomInBtn').setTooltip('View last week');
                    Ext.first('#zoomOutBtn').setTooltip('View next week');
                    //disable zoom in if 'D' since hourAndDay is max zoom in
                    // me.lookup('zoomInBtn').setDisabled(true);
                }
                break;
        }

        if (scheduler.highlightHolidays) {
            Ext.each(scheduler.getTimeAxis().getRange(), function (ta) {
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
        //reset zoom out buttons
        // me.lookup('zoomOutBtn').setDisabled(false);
        // save level for reset button
        me.currentViewPreset = scheduler.getViewPreset();

        scheduler.createToolTip(me.getDataForTooltipTpl, me);

        if (scheduler.getResourceStore().sorters) {
            scheduler.getResourceStore().sorters.removeAll();
            //scheduler.getResourceStore().reload();
        }

        me.onEventStoreLoad();

        // me.refreshScheduler();
    },

    goToDefaultStartDate: function (scheduler) {
        var me = this,
            vm = me.getViewModel(),
            view = scheduler.getSchedulingView(),
            settings = TS.app.settings,
            dt,
            newDate,
            dayNum,
            diff;

        switch (settings.schedDefaultStartDay) {
            case 'W': // W = show next workday (M-F) as the day upon startup
                dt = new Date();
                if (dt.getDay() == 5) {
                    newDate = Ext.Date.add(dt, Ext.Date.DAY, 3);
                } else {
                    newDate = Ext.Date.add(dt, Ext.Date.DAY, 1);
                }
                break;
            case 'T':// T = show today as the day upon startup (this is what we do now)
                newDate = new Date();
                break;
            case 'M': // M = show next Monday as the day upon startup
                dt = new Date();
                dayNum = dt.getDay();
                if (dayNum == 0) newDate = Ext.Date.add(dt, Ext.Date.DAY, 1);
                else newDate = Ext.Date.add(dt, Ext.Date.DAY, (8 - dayNum));
                break;
            case 'D':// D = show next day (tomorrow) as the day upon startup
            default:
                dt = new Date();
                newDate = Ext.Date.add(dt, Ext.Date.DAY, 1);
                break;
        }

        if (vm.get('selectedDate')) {
            newDate = new Date(vm.get('selectedDate'));
            vm.set('selectedDate', '');
        }

        if (scheduler.getViewPreset() == 'weekAndDay') {
            newDate.setHours(0, 0, 0, 0);
            scheduler.scrollToDate(new Date(newDate));
        } else {
            newDate.setHours(12, 0, 0, 0);
            scheduler.scrollToDateCentered(new Date(newDate));
        }

    },

    setTimeAxisFilter: function () {
        var me = this,
            viewModel = this.getViewModel(),
            scheduler = Ext.first('scheduler-crew');
        //scheduler.startDate //'{settings.schedVisibleHoursStart}'
        viewModel.bind('{settings.schedVisibleHoursStart}', function (obj) {

            if (obj) {
                me.timeAxisFilter();
            }

        }, me);
        /*
         If VisibleHoursEnd is changed then filter the timeaxis,
         This is a two way bind. Model change and field change will lead both to filter action
         */
        scheduler.endDate  //'{settings.schedVisibleHoursEnd}'
        viewModel.bind('{settings.schedVisibleHoursEnd}', function (obj) {

            if (obj) {
                me.timeAxisFilter();
            }

        }, me);
    },

    onFWAGridRender: function (grid) {
        // Setup the drag zone
        new TS.common.dd.UnplannedFWADragZone(grid.getEl(), {
            grid: grid
        });
    },

    onFwaGridSelect: function (rowModel, record) {
        Ext.first('#schedRowCtField').setHidden(true);
        TS.app.settings.fromProjectTree = false;
        /*If calling from event rowdblclick use rowModel.selModel, if select event use rowModel*/
        Ext.GlobalEvents.fireEvent('UnscheduledFwaGridSelect', rowModel.selModel, record);
        //Ext.GlobalEvents.fireEvent('ShowSelectedFwa', record.get('fwaId'), record.get('schedStartDate'));
    },

    onEventDblClick: function (scheduler, record) {
        var me = this,
            vm = me.getViewModel();

        if (record) {
            TS.app.settings.fromProjectTree = false;
            vm.set('selectedDate', record.get('schedStartDate'));
            Ext.GlobalEvents.fireEvent('ShowSelectedFwa', record.get('fwaId'), record.get('schedStartDate'));
            //this.redirectTo('fwa/' + record.get('fwaId'));
            if (Ext.first('#schedRowCtField'))
                Ext.first('#schedRowCtField').setHidden(true);
        }
    },

    onEventLongPress: function (scheduler, eventRecord, e, eOpts) {
        var me = this,
            settings = TS.app.settings;
        if (settings.schedReadOnly == true) {
            return;
        }
        if (!eventRecord.get('availableForUseInField')) {
            Ext.MessageBox.show({
                title: 'Options',
                msg: 'Please select from options below.' +
                    '<br/><br/><select id="approval">' +
                    '   <option value="1">Unschedule ' + settings.fwaAbbrevLabel + ' ' + eventRecord.get('fwaName') + '</option>' +
                    '   <option value="2">Make ' + settings.fwaAbbrevLabel + ' available to the field</option></select>',
                buttons: Ext.MessageBox.OKCANCEL,
                fn: function (btn) {
                    if (btn == 'ok') {
                        if (Ext.get('approval').getValue() == "1") {
                            me.onEventLongPressContinue(scheduler, eventRecord, e, eOpts);
                        } else if (Ext.get('approval').getValue() == "2") {
                            me.onMakeAvailableClick(scheduler, eventRecord, e);
                        }
                    }
                }
            });
        } else {
            me.onEventLongPressContinue(scheduler, eventRecord, e, eOpts);
        }
    },

    onEventLongPressContinue: function (scheduler, eventRecord, e, eOpts) {
        var me = this,
            vm = me.getViewModel();
        vm.set('selectedDate', eventRecord.get('schedStartDate'));
        if (eventRecord) {
            //need to check if any hours assigned and stop
            var data = eventRecord.data,
                settings = TS.app.settings,
                hoursArr = data.hours.getRange(),
                unitsArr = data.units.getRange(),
                ttlHours = 0,
                ttlUnits = 0;
            //data.hours = Ext.Array.pluck(data.hours.getRange(), 'data');

            Ext.each(hoursArr, function (obj) {
                ttlHours += (obj.get('ovtHrs') + obj.get('ovt2Hrs') + obj.get('regHrs') + obj.get('travelHrs'));
            });
            Ext.each(unitsArr, function (obj) {
                ttlUnits += obj.get('quantity');
            });
            e.stopEvent();

            if (ttlHours > 0 || ttlUnits > 0) {
                Ext.Msg.show({
                    title: 'Warning',
                    message: settings.fwaAbbrevLabel + 's with hours entered or unit quantities entered cannot be unscheduled.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                Ext.Msg.setY(50);
                return;
            }

            me.__ddTask = eventRecord;
            if (eventRecord.get('recurrenceConfig')) {
                Ext.Msg.confirm('Please Confirm', 'Are you sure you want to unschedule ' + eventRecord.get('fwaNum') + ': ' + eventRecord.get('fwaName') + '? ' +
                    ' This a recurring ' + settings.fwaAbbrevLabel + ' and all instances will be unscheduled.',
                    me.onUnscheduleConfirm,
                    me
                );
            } else {
                Ext.Msg.confirm('Please Confirm', 'Are you sure you want to unschedule ' + eventRecord.get('fwaNum') + ': ' + eventRecord.get('fwaName') + '?',
                    me.onUnscheduleConfirm,
                    me
                );
            }
            Ext.Msg.setY(50);
        }
    },

    onEventKeyDown: function (view, eventRecord, e, eOpts) {
        if ((e.getKey() == e.SHIFT) && eventRecord) {
            //need to check if any hours assigned and stop
            var data = eventRecord.data,
                settings = TS.app.settings,
                hoursArr = data.hours.getRange(),
                ttlHours = 0;
            //data.hours = Ext.Array.pluck(data.hours.getRange(), 'data');
            Ext.each(hoursArr, function (obj) {
                ttlHours += (obj.get('ovtHrs') + obj.get('ovt2Hrs') + obj.get('regHrs') + obj.get('travelHrs'));
            });
            e.stopEvent();
            if (ttlHours > 0) {
                Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + 's with hours entered cannot be unscheduled.');
                return;
            }
            this.__ddTask = eventRecord;
            Ext.Msg.confirm('Please Confirm', 'Are you sure you want to unschedule ' + eventRecord.get('fwaNum') + ': ' + eventRecord.get('fwaName') + '?',
                this.onUnscheduleConfirm,
                this
            )
        }
    },

    onUnscheduleConfirm: function (btn) {
        if (btn === 'yes') {
            var me = this,
                fwa = me.__ddTask;
            fwa.set('scheduledCrewChiefId', '');
            fwa.set('scheduledCrewId', '');
            fwa.set('scheduledCrewName', '');
            fwa.set('hasCrew', false);
            fwa.set('schedStartDate', new Date('1/1/2001 12:00:00 AM'));
            fwa.set('schedEndDate', new Date('1/1/2001 12:00:00 AM'));
            fwa.set('recurrencePattern', '');
            fwa.set('recurrenceConfig', '');
            // fwa.set('dateOrdered', new Date('1/1/0001 12:00:00 AM'));
            // fwa.set('dateRequired', new Date('1/1/0001 12:00:00 AM'));
            fwa.set('fwaStatusId', FwaStatus.Create);
            fwa.set('hours', Ext.create('TS.data.field.HoursList'));
            //fwa.set('hoverRows', '');
            TS.model.fwa.Fwa.getProxy().setExtraParams({
                fwaDate: Ext.Date.format(fwa.get('schedStartDate'), 'Ymd')
            });
            TS.model.fwa.Fwa.load(fwa.get('fwaId'), {
                success: function (record) {
                    fwa = record;
                    fwa.set('scheduledCrewChiefId', '');
                    fwa.set('scheduledCrewId', '');
                    fwa.set('scheduledCrewName', '');
                    fwa.set('hasCrew', false);
                    fwa.set('schedStartDate', new Date('1/1/2001 12:00:00 AM'));
                    fwa.set('schedEndDate', new Date('1/1/2001 12:00:00 AM'));
                    fwa.set('recurrencePattern', '');
                    fwa.set('recurrenceConfig', '');
                    // fwa.set('dateOrdered', new Date('1/1/0001 12:00:00 AM'));
                    // fwa.set('dateRequired', new Date('1/1/0001 12:00:00 AM'));
                    fwa.set('fwaStatusId', FwaStatus.Create);
                    fwa.set('hours', Ext.create('TS.data.field.HoursList'));
                    fwa.set('nextDate', new Date('1/1/2001 12:00:00 AM'));
                    fwa.set('duration', 0);
                    me.setFwaUnscheduled(fwa);
                },
                failure: function (record, operation) {
                    Ext.GlobalEvents.fireEvent('Error', operation);
                },
                scope: me
            });
        }
    },

    setFwaUnscheduled: function (fwa) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            employeeScheduler = me.lookup('scheduler'),
            fwaStore = employeeScheduler.getEventStore(),
            unplannedFwaStore = me.lookup('unplannedfwagrid').getStore(),
            data,
            dateHolder;
        dateHolder = vm.get('selectedDate');
        //remove from event store
        fwaStore.remove(fwa);
        // Update the store fields
        data = Ext.clone(fwa.data);
        data.expenses = data.expenses && data.expenses.length > 0 ? Ext.Array.pluck(data.expenses.getRange(), 'data') : [];
        data.hours = Ext.Array.pluck(data.hours.getRange(), 'data');
        data.notes = Ext.Array.pluck(data.notes.getRange(), 'data');
        data.workSchedAndPerf = Ext.Array.pluck(data.workSchedAndPerf.getRange(), 'data');
        data.nonFieldActions = Ext.Array.pluck(data.nonFieldActions.getRange(), 'data');
        //check dateOrdered/dateRequired
        data = TS.Util.checkFwaForValidDates(data);
        //create array of fwa units
        data.units = Ext.Array.pluck(data.units.getRange(), 'data');
        //if null set to schedStartDate, else leave as is
        Ext.each(data.hours, function (hour) {
            if (!hour.startTime) {
                hour.startTime = new Date();
                hour.endTime = new Date();
            }
        });
        if (!data.nextDate)
            data.nextDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        else
            data.nextDate = TS.common.Util.getOutUTCDate(data.nextDate);
        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            if (unit.details) {
                unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
            }
        });
        //Time Zone
        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);
        //adjust for time zone
        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });
        //convert duration to minutes
        data.duration = 0;
        //check and save FWA
        //clear attachments - only used when coming FROM backend
        data.attachments = [];
        Fwa.Save(null, settings.username, settings.empId, data, true, false, function (response, success, operation) {
            if (response && response.success) {
                // update FWA tab
                //update employee view
                //Ext.GlobalEvents.fireEvent('ResetEmployeeView');
                Ext.GlobalEvents.fireEvent('ResetEmployeeViewGantt');
                Ext.GlobalEvents.fireEvent('UpdateFwaGridFromScheduler', response.data, false);
                //update crew assign
                Ext.GlobalEvents.fireEvent('ResetCrewAssign', response.data);
                //update unscheduled fwa
                unplannedFwaStore.getProxy().setExtraParams({
                    scheduledFwas: false,
                    isPreparedByMe: settings.schedFwaPreparedByMe,
                    timeZoneOffset: new Date().getTimezoneOffset()
                });
                //refresh event store
                if (dateHolder) vm.set('selectedDate', dateHolder);
                me.reloadEventStoreOnly();
                unplannedFwaStore.load();
                // unplannedFwaStore.add(response.data);
                // unplannedFwaStore.commitChanges();

            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
            me.getView().setLoading(false);
        }.bind(me));
    },

    // Catches the UnplannedFWA drop event fired from the schedulerview. The event drop is handled and synced with the server.
    onUnplannedFWADrop: function (view, droppedTask, targetResource, date) {
        var me = this,
            isOutsideHours = false,
            scheduler = Ext.first('scheduler-crew'),
            preset = scheduler.getViewPreset(),
            settings = TS.app.settings,
            isDayGranularity = settings.schedTimeAxisGranularity == 1440,
            minStartHour = settings.schedVisibleHoursStart.getHours(),
            minStartMinutes = settings.schedVisibleHoursStart.getMinutes(),
            maxEndHour = settings.schedVisibleHoursEnd.getHours(),
            maxEndMinutes = settings.schedVisibleHoursEnd.getMinutes(),
            maxStartMinutes = settings.schedVisibleHoursStart.getMinutes(),
            messageStartHrs = Ext.Date.format(new Date(settings.schedVisibleHoursStart), 'H:i'),
            messageEndHrs = Ext.Date.format(new Date(settings.schedVisibleHoursEnd), 'H:i'),
            timeSpan = droppedTask.get('schedHrsTtl') || 1;

        //if week view default to dropped task start time if not min date
        if (preset == 'weekAndDay') {
            if (droppedTask.get('schedStartDate') > new Date('1/1/2001 12:00:00 AM')) {
                date = droppedTask.get('schedStartDate');
            }
        }
        //check rights
        if (settings.schedReadOnly === true) {
            return false;
        }
        //set units date
        Ext.each(droppedTask.get('units').getRange(), function (unit) {
            unit.set('unitDate', date);
        });
        //check for work code
        if (droppedTask.get('workSchedAndPerf').getRange().length === 0) {
            Ext.Msg.alert('Warning', 'At least one(1) ' + settings.workCodeLabel + ' entry is required.');
            return false;
        }
        //check if drop is past start/end times
        if ((date.getHours() > maxEndHour || (date.getHours() == maxEndHour && date.getMinutes() > maxEndMinutes))) {
            // date.setHours(maxEndHour - timeSpan);
            // date.setMinutes(maxEndMinutes);
            isOutsideHours = true;
        } else if ((date.getHours() < minStartHour || (date.getHours() == minStartHour && date.getMinutes() < maxStartMinutes))) {
            // date.setHours(maxStartHour);
            // date.setMinutes(maxEndMinutes);
            isOutsideHours = true;
        }

        //check if recurrence and if so, go to crew assign; no need to check dates
        if (droppedTask.get('recurrenceConfig')) {
            me.assignCrewToFwa(targetResource, droppedTask);
        } else {
            //check outside set hours
            if (isOutsideHours) {
                me.__ddContext = targetResource;
                me.__ddTask = droppedTask;
                me.__ddDate = date;
                Ext.Msg.confirm('Please Confirm',
                    'Selected schedule is outside of set working hours of ' + messageStartHrs + ' to ' + messageEndHrs + ', do you wish to continue?',
                    me.onUnPlannedDropConfirm, //the button callback
                    me); //scope
                var window = Ext.WindowManager.getActive();
                window.el.setZIndex(1100000);

                return false;
            }

            //check selected crew
            if (droppedTask.get('scheduledCrewId')
                && droppedTask.get('scheduledCrewId').trim() != ''
                && (droppedTask.get('scheduledCrewId') != targetResource.get('crewId'))
                && droppedTask.get('scheduledCrewName')
                && droppedTask.get('scheduledCrewName').trim() != '') {
                me.__ddContext = targetResource;
                me.__ddTask = droppedTask;
                me.__ddDate = date;
                Ext.Msg.confirm('Please Confirm',
                    'The crew selected (' + targetResource.get('crewName') + ') does not match the assigned crew (' + droppedTask.get('scheduledCrewName') + ') of the FWA, Do you wish to continue?',
                    me.onUnPlannedDropConfirm, //the button callback
                    me); //scope
                var window = Ext.WindowManager.getActive();
                window.el.setZIndex(1100000);

                return false;
            }

            if (isDayGranularity) {
                me.onDayGranularity(date, droppedTask, targetResource);
                return false;
            }

            droppedTask.setStartEndDate(date, Sch.util.Date.add(date, Sch.util.Date.HOUR, droppedTask.get('schedHrsTtl') || 1));
            me.assignCrewToFwa(targetResource, droppedTask);
        }
    },

    onUnPlannedDropConfirm: function (btn) {
        if (btn === 'yes') {
            var me = this,
                droppedTask = me.__ddTask,
                targetResource = me.__ddContext,
                date = me.__ddDate,
                settings = TS.app.settings,
                isDayGranularity = settings.schedTimeAxisGranularity == 1440;
            //check selected crew
            if (droppedTask.get('scheduledCrewId')
                && droppedTask.get('scheduledCrewId').trim() != ''
                && (droppedTask.get('scheduledCrewId') != targetResource.get('crewId'))
                && droppedTask.get('scheduledCrewName')
                && droppedTask.get('scheduledCrewName').trim() != '') {
                me.__ddContext = targetResource;
                me.__ddTask = droppedTask;
                me.__ddDate = date;
                Ext.Msg.confirm('Please Confirm',
                    'The crew selected (' + targetResource.get('crewName') + ') does not match the assigned crew (' + droppedTask.get('scheduledCrewName') + ') of the FWA, Do you wish to continue?',
                    me.onDropConfirm, //the button callback
                    me); //scope
                var window = Ext.WindowManager.getActive();
                window.el.setZIndex(1100000);

                return false;
            }

            if (isDayGranularity) {
                me.onDayGranularity(date, droppedTask, targetResource);
                return false;
            }

            droppedTask.setStartEndDate(date, Sch.util.Date.add(date, Sch.util.Date.HOUR, droppedTask.get('schedHrsTtl') || 1));
            me.assignCrewToFwa(targetResource, droppedTask);
        }
    },

    onDropConfirm: function (btn) {
        if (btn === 'yes') {
            var settings = TS.app.settings,
                isDayGranularity = settings.schedTimeAxisGranularity == 1440;

            if (isDayGranularity) {
                this.onDayGranularity(this.__ddDate, this.__ddTask, this.__ddContext);
                return false;
            }

            this.__ddTask.setStartEndDate(this.__ddDate, Sch.util.Date.add(this.__ddDate, Sch.util.Date.HOUR, this.__ddTask.get('schedHrsTtl') || 1));
            this.assignCrewToFwa(this.__ddContext, this.__ddTask);
        }
    },

    onDayGranularity: function (date, droppedTask, targetResource) {
        var settings = TS.app.settings,
            scheduler = Ext.first('scheduler-crew'),
            startTime = scheduler.startDate,//settings.schedVisibleHoursStart,
            endTime = scheduler.endDate,//settings.schedVisibleHoursEnd,
            ttlHours = Ext.Date.diff(droppedTask.get('schedStartDate'), droppedTask.get('schedEndDate'), 'h');
        //default to fwa start time if > min date
        if (droppedTask.get('schedStartDate') > new Date('1/1/2001 12:00:00 AM')) {
            startTime = droppedTask.get('schedStartDate')
        }
        //strip off time and add user config scheduled start time
        date = new Date(Ext.Date.format(date, Ext.Date.patterns.ShortDate) + " " + Ext.Date.format(startTime, Ext.Date.patterns.ShortTime));
        //add hour difference from user config SchedVisibleHoursEnd
        var endDateTime = Ext.Date.add(new Date(date), Ext.Date.HOUR, ttlHours);
        droppedTask.setStartEndDate(date, endDateTime);
        this.assignCrewToFwa(targetResource, droppedTask);
    },

    assignCrewToFwa: function (crew, fwa) {
        var me = this,
            settings = TS.app.settings,
            employeeScheduler = me.lookup('scheduler'),
            fwaStore = employeeScheduler.getEventStore(),
            unplannedFwaStore = me.lookup('unplannedfwagrid').getStore(),
            daterange = employeeScheduler.getSchedulingView().getVisibleDateRange(),
            startDate = daterange.startDate,
            data;
        //Update the store fields
        fwa.assign(crew);
        data = me.cloneFwaData(fwa);
        //clear hours since this is being dropped
        data.hours = [];
        //TIME ZONE handled in method
        //check fwa first
        data = TS.Util.checkFwaForValidDates(data);

        TS.Util.onCheckPriorToEmployeeAssn(data, true, fwa.get('scheduledCrewId'), function (isOkay) {
            if (isOkay) {
                TS.Util.onCheckForDoubleBookedEmployees(fwa.get('fwaId'), fwa.get('scheduledCrewId'), data.schedStartDate, data.schedEndDate, function (status) {
                    if (status) {
                        // Remove this task from the store it currently belongs to - the unassigned grid store
                        unplannedFwaStore.remove(fwa);
                        //save FWA
                        //clear attachments - only used when coming FROM backend
                        data.attachments = [];
                        //if null set to schedStartDate, else leave as is
                        if (!data.nextDate)
                            data.nextDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
                        else
                            data.nextDate = TS.common.Util.getOutUTCDate(data.nextDate);
                        // //adjust for time zone
                        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
                        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);

                        Ext.each(data.notes, function (note) {
                            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
                            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
                        });
                        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);
                        Fwa.Save(null, settings.username, settings.empId, data, true, true, function (response, success, operation) {
                            if (response && response.success) {
                                // update FWA tab
                                //Ext.GlobalEvents.fireEvent('UpdateFwaGridFromScheduler', response.data, false);
                                //update crew assign
                                Ext.GlobalEvents.fireEvent('ResetCrewAssign', response.data);
                                //update employee view
                                Ext.GlobalEvents.fireEvent('ResetEmployeeView');
                                //check if recurring and if so call event reload
                                if (data.recurrenceConfig) {
                                    me.reloadEventStoreOnly();
                                    //TODO scroll back to where you where
                                    startDate.setHours(12, 0, 0, 0);
                                    employeeScheduler.scrollToDate(new Date(startDate));
                                }
                                // And finally convert to UTC and assign it to the resource event store
                                response.data.schedStartDate = TS.common.Util.getInUTCDate(response.data.schedStartDate);
                                response.data.schedEndDate = TS.common.Util.getInUTCDate(response.data.schedEndDate);
                                fwaStore.add(response.data);
                                fwaStore.commitChanges();
                            } else if (response) {
                                //reset values if error
                                fwa.set('scheduledCrewId', '');
                                fwa.set('schedStartDate', new Date('1/1/2001 12:00:00 AM'));
                                fwa.set('schedEndDate', new Date('1/1/2001 12:00:00 AM'));
                                unplannedFwaStore.add(fwa);
                                Ext.GlobalEvents.fireEvent('Error', response);
                            }
                            me.getView().setLoading(false);
                        }.bind(me));

                    } else {
                        fwaStore.remove(fwa);
                        return false;
                    }
                }.bind(me));
            } else {
                me.getView().setLoading(false);
                fwaStore.remove(fwa);
                return false;
            }
        });
    },

    /*
     * Toolbar Button Handlers
     */

    // Handles zoom in click
    zoomOutFull: function () {
        this.clearTimeAxisFilter();
        var scheduler = this.lookup('scheduler'),
            ret = scheduler.zoomOutFull();
        scheduler.goToNow();
    },

    zoomInFull: function () {
        this.clearTimeAxisFilter();
        var scheduler = this.lookup('scheduler'),
            ret = scheduler.zoomInFull();
        scheduler.goToNow();
    },

    zoomToWeekly: function () {
        var me = this,
            settings = TS.app.settings,
            scheduler = Ext.first('scheduler-crew'),
            view = scheduler.getSchedulingView(),
            dt = new Date();
        //me.setTimeAxisFilter();
        // me.lookup('zoomInBtn').setDisabled(false);
        // me.lookup('zoomOutBtn').setDisabled(false);
        if (scheduler.getViewPreset() == 'weekAndDay') {
            scheduler.setViewPreset('hourAndDay');
            scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.MINUTE, settings.schedTimeAxisGranularity);
            scheduler.setTimeColumnWidth(100);
            Ext.first('#zoomInBtn').setTooltip('View last week');
            Ext.first('#zoomOutBtn').setTooltip('View next week');
            me.lookup('zoomWeeklyButton').setTooltip('Week View');
            dt.setHours(12, 0, 0, 0);
            scheduler.scrollToDateCentered(new Date(dt));
        } else {
            scheduler.setViewPreset('weekAndDay');
            scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.DAY, 0);
            //scheduler.switchViewPreset('weekAndDay');
            scheduler.setTimeColumnWidth(150);
            Ext.first('#zoomInBtn').setTooltip('View last month');
            Ext.first('#zoomOutBtn').setTooltip('View next month');
            me.lookup('zoomWeeklyButton').setTooltip('Day View');
            dt = me.getWeekStartDay(dt);
            dt.setHours(0, 0, 0, 0);
            scheduler.scrollToDate(new Date(dt));
        }
    },

    getSunday: function (date) {
        // Copy date if provided, or use current date if not
        if (date.getDay() == 0)
            return date;
        date = date ? new Date(+date) : new Date();
        date.setHours(0, 0, 0, 0);
        // Set date to previous Sunday
        date.setDate(date.getDate() - date.getDay());
        return date;
    },

    getWeekStartDay: function (date) {
        // value as set in employee configuration
        const startDay = TS.app.settings.schedWeeklyStartDay;
        if (date.getDay() == startDay) {
            return date;
        } else if (startDay > date.getDay()) {
            date = Ext.Date.add(date, Ext.Date.DAY, (startDay - date.getDay()) * -1);
        } else {
            date = Ext.Date.add(date, Ext.Date.DAY, (date.getDay() - startDay) * -1);
        }
        date.setHours(0, 0, 0, 0);
        return date;
    },

    zoomToPreset: function () {
        var me = this,
            scheduler = Ext.first('scheduler-crew'),
            settings = TS.app.settings,
            view = scheduler.getSchedulingView(),
            preset = scheduler.getViewPreset(),
            dt = new Date();

        if (settings.schedDefaultTimeframe == 'W') {
            scheduler.setViewPreset('weekAndDay');
            scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.DAY, 1);
            scheduler.setTimeColumnWidth(150);
            Ext.first('#zoomInBtn').setTooltip('View last month');
            Ext.first('#zoomOutBtn').setTooltip('View next month');
            me.lookup('zoomWeeklyButton').setTooltip('Day View');
        } else {
            scheduler.setViewPreset('hourAndDay');
            scheduler.getSchedulingView().setTimeResolution(Sch.util.Date.MINUTE, settings.schedTimeAxisGranularity);
            scheduler.setTimeColumnWidth(100);
            //disable zoom in if 'D' since hourAndDay is max zoom in
            //me.lookup('zoomInBtn').setDisabled(true);
            Ext.first('#zoomInBtn').setTooltip('View last week');
            Ext.first('#zoomOutBtn').setTooltip('View next week');
            me.lookup('zoomWeeklyButton').setTooltip('Week View');
        }
        //scheduler.getEventStore().load();
        dt.setHours(12, 0, 0, 0);
        scheduler.scrollToDateCentered(new Date(dt));
    },

    zoomIn: function (obj, e, opts) {
        var me = this,
            scheduler = Ext.first('scheduler-crew'),
            view = scheduler.getSchedulingView(),
            dt = view.getDateFromDomEvent(e, 'round'),
            newDt = '';
        //me.setTimeAxisFilter();
        if (scheduler.getViewPreset() == 'hourAndDay') {
            newDt = Ext.Date.add(new Date(dt), Ext.Date.DAY, -7);

        } else { //weekAndDay
            newDt = Ext.Date.add(new Date(dt), Ext.Date.MONTH, -1);
        }
        newDt.setHours(12, 0, 0, 0);
        scheduler.scrollToDate(new Date(newDt));
    },

    // Handles zoom out click
    zoomOut: function (obj, e, opts) {
        var me = this,
            scheduler = Ext.first('scheduler-crew'),
            view = scheduler.getSchedulingView(),
            dt = view.getDateFromDomEvent(e, 'round'),
            newDt = '';
        //me.setTimeAxisFilter();
        if (scheduler.getViewPreset() == 'hourAndDay') {
            newDt = Ext.Date.add(new Date(dt), Ext.Date.DAY, 7);
        } else { //weekAndDay
            newDt = Ext.Date.add(new Date(dt), Ext.Date.MONTH, 1);
        }
        newDt.setHours(12, 0, 0, 0);
        scheduler.scrollToDate(new Date(newDt));
    },

    // Handles shift next click
    shiftNext: function (obj, e) {
        var scheduler = this.lookup('scheduler'),
            view = scheduler.getSchedulingView(),
            dt = view.getDateFromDomEvent(e, 'round'),
            newDt = '',
            me = this;

        if (scheduler.getViewPreset() == 'hourAndDay') {
            newDt = Ext.Date.add(new Date(dt), Ext.Date.DAY, 1);
            newDt.setHours(12, 0, 0, 0);
            scheduler.scrollToDateCentered(new Date(newDt));
        } else { //weekAndDay
            newDt = Ext.Date.add(new Date(dt), Ext.Date.DAY, 7);
            newDt = me.getSunday(newDt);
            newDt.setHours(12, 0, 0, 0);
            scheduler.scrollToDate(new Date(newDt));
        }
        //scheduler.shiftNext();
    },
    // Handles shift previous click
    shiftPrevious: function (obj, e) {
        var scheduler = this.lookup('scheduler'),
            view = scheduler.getSchedulingView(),
            dt = view.getDateFromDomEvent(e, 'round'),
            newDt = '',
            me = this;

        if (scheduler.getViewPreset() == 'hourAndDay') {
            newDt = Ext.Date.add(new Date(dt), Ext.Date.DAY, -1);
            newDt.setHours(12, 0, 0, 0);
            scheduler.scrollToDateCentered(new Date(newDt));
        } else { //weekAndDay
            newDt = Ext.Date.add(new Date(dt), Ext.Date.DAY, -7);
            newDt = me.getSunday(newDt);
            newDt.setHours(12, 0, 0, 0);
            scheduler.scrollToDate(new Date(newDt));
        }
        //scheduler.shiftPrevious();
    },

    /*
     * Helper Methods
     */

    clearTimeAxisFilter: function () {
        var scheduler = Ext.first('scheduler-crew');
        scheduler.getTimeAxis().clearFilter();
    },

    timeAxisFilter: function () {
        var viewModel = this.getViewModel(),
            scheduler = Ext.first('scheduler-crew'),
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
            ////TODO use below if we are going to use work day hours
            // preset = scheduler.zoomLevels[Math.floor(scheduler.getCurrentZoomLevelIndex())].preset;
            // switch (preset) {
            //     //case 'weekAndDay': uses custom time axis declared in Crew.js - MyTimeAxis
            //     case 'weekAndDay':
            //     case 'weekAndDayLetter':
            //         scheduler.getTimeAxis().filterBy(function (tick) {
            //             //filter out weekends
            //             //var workingDay = tick.start.getDay() !== 6 && tick.start.getDay() !== 0; // TODO - Figure out if we ever need this again
            //             //var workingDay = true;
            //             console.log();
            //             return workingDay && (tick.start.getHours() >= startHours && tick.start.getHours() <= endHours);
            //         });
            //
            //         break;
            //
            //     case 'hourAndDay':
            //     case 'weekAndMonth':
            //         scheduler.getTimeAxis().filterBy(function (tick) {
            //             return (tick.start.getHours() >= startHours && tick.start.getHours() <= endHours);
            //         });
            //
            //         break;
            //
            //     default:
            //         //console.log('never get here');
            //         this.clearTimeAxisFilter();
            //         break;
            //
            // }
        } catch (exception) {
            //<debug>
            console.debug('getCurrentZoomLevelIndex is returning a float', exception);
            //</debug>
        }
    },

    // getDataForTooltipTpl returns data for the toolTipTpl of the scheduler
    getDataForTooltipTpl: function (tip, fwa) {

        var settings = TS.app.settings,
            d = Ext.Date,
            wbs1 = settings.fwaDisplayWbs1 != 'N' ? fwa.get('wbs1') : '',
            wbs2 = settings.fwaDisplayWbs2 != 'N' ? fwa.get('wbs2') : '',
            wbs3 = settings.fwaDisplayWbs3 != 'N' ? fwa.get('wbs3') : '',
            wbs1Lbl = settings.fwaDisplayWbs1 != 'N' ? settings.wbs1Label : '',
            wbs2Lbl = settings.fwaDisplayWbs2 != 'N' ? settings.wbs2Label : '',
            wbs3Lbl = settings.fwaDisplayWbs3 != 'N' ? settings.wbs3Label : '';

        return {
            fwaLabel: settings.fwaAbbrevLabel,
            wbs1Label: wbs1Lbl,
            wbs2Label: wbs2Lbl,
            wbs3Label: wbs3Lbl,
            workCodeLabel: settings.workCodeLabel,
            workDescriptionLabel: settings.workDescriptionLabel,
            startDateLabel: 'Start',
            endDateLabel: 'End',
            clientLabel: settings.clientLabel,
            fwaName: fwa.get('fwaName'),
            fwaNumber: fwa.get('fwaNum'),
            clientId: fwa.get('clientName'),
            fwaWbs1: wbs1,
            fwaWbs2: wbs2,
            fwaWbs3: wbs3,
            startDate: d.format(fwa.get('schedStartDate'), DATE_FORMAT),
            endDate: d.format(fwa.get('schedEndDate'), DATE_FORMAT)
        }
    },

    openSettingsWindow: function () {
        Ext.create('TS.view.crew.window.UserSettings').show();
    },

    openStatusLegend: function () {
        Ext.create('TS.view.crew.window.Legend').show();
    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    printScheduleWindow: function () {
        var scheduler = this.lookup('scheduler');
        scheduler.print();
    },

    /*
     Handles an inner fwa drag or fwa resize event, which is considered as a reschedule event.
     The new start and end date are saved to the server.
     */

    onBeforeEventDropFinalize: function (scheduler, dragContext, e, eOpts) {
        var me = this,
            data = dragContext.draggedRecords[0].data,
            settings = TS.app.settings,
            hours = data.hours,
            units = data.units,
            ttlHours = 0,
            ttlUnits = 0,
            comments = '',
            crewMembers = dragContext.newResource.get('crewMembers'),
            newHours = [],
            workCode,
            workCodeAbbrev,
            workDate,
            empId,
            crewRoleId,
            fwa,
            origTimeStartHrs,
            origTimeStartMins,
            origTimeEndHrs,
            origTimeEndMins;

        if (Ext.first('#scheduler').getViewPreset() == 'weekAndDay') {
            origTimeStartHrs = dragContext.origStart.getHours();
            origTimeStartMins = dragContext.origStart.getMinutes();
            origTimeEndHrs = dragContext.origEnd.getHours();
            origTimeEndMins = dragContext.origEnd.getMinutes();

            dragContext.startDate.setHours(origTimeStartHrs);
            dragContext.startDate.setMinutes(origTimeStartMins);
            dragContext.endDate.setHours(origTimeEndHrs);
            dragContext.endDate.setMinutes(origTimeEndMins);
        }

        me.__ddContext = dragContext;
        //check rights
        if (settings.schedReadOnly === true) {
            me.__ddContext.finalize(false);
            return false;
        }
        //check if same crew && start/end dates
        if ((dragContext.resourceRecord == dragContext.newResource) && (data.schedStartDate == dragContext.startDate && data.schedEndDate == dragContext.endDate)) {
            me.__ddContext.finalize(true);
            return false;
        }
        //check if currently any hours/comments entered
        Ext.each(hours.getRange(), function (obj) {
            ttlHours += obj.get('regHrs') + obj.get('ovtHrs') + obj.get('ovt2Hrs') + obj.get('travelHrs');
            comments += obj.get('comment');
        });
        //check unit quantities
        Ext.each(units.getRange(), function (obj) {
            ttlUnits += obj.get('quantity');
        });
        //check if recurrence and stop
        if (dragContext.draggedRecords[0].get('recurrenceConfig')) {
            Ext.Msg.alert('Warning', 'This is a recurring ' + settings.fwaAbbrevLabel + '. ' + settings.crewLabel + ' and start/end times cannot be re-assigned.');
            me.__ddContext.finalize(false);
            return false;
        }
        ////check hours, comments & units when status approved or submitted
        if ((ttlHours != 0 || comments != '' || ttlUnits > 0) && (data.fwaStatusId == FwaStatus.Approved || data.fwaStatusId == FwaStatus.Submitted)) {
            Ext.Msg.alert('Warning', settings.crewLabel + ' and start/end times cannot be re-assigned if ' + settings.fwaAbbrevLabel + ' employee hours, comments or unit quantities have been entered.');
            me.__ddContext.finalize(false);
            return false;
        }
        //check and change unitDate
        Ext.each(dragContext.draggedRecords[0].get('units').getRange(), function (unit) {
            unit.set('unitDate', dragContext.startDate);
        });
        //check status and stop if needed
        me.onCheckFwaStatus(data, function (proceed) {
            if (!proceed) {
                me.__ddContext.finalize(false);
            } else {
                TS.Util.onCheckPriorToEmployeeAssn(data, true, dragContext.newResource.get('crewId'), function (isOkay) {
                    if (isOkay) {
                        TS.Util.onCheckForDoubleBookedEmployees(dragContext.draggedRecords[0].get('fwaId'), dragContext.newResource.get('crewId'), dragContext.startDate, dragContext.endDate, function (status) {
                            if (status) {
                                if (dragContext.draggedRecords[0].get('scheduledCrewId') != dragContext.newResource.get('crewId')) {
                                    //change crew id
                                    dragContext.draggedRecords[0].set('scheduledCrewId', dragContext.newResource.get('crewId'));
                                    dragContext.draggedRecords[0].set('hours', null);
                                }
                                dragContext.draggedRecords[0].data.schedStartDate = dragContext.startDate;
                                dragContext.draggedRecords[0].data.schedEndDate = dragContext.endDate;

                                me.onReScheduleFWA(scheduler, dragContext.draggedRecords[0].data, dragContext.startDate, dragContext.endDate, null, null);
                                me.__ddContext.finalize(true);
                            } else {
                                me.__ddContext.finalize(false);
                            }
                        }.bind(me));
                    } else {
                        me.__ddContext.finalize(false);
                    }
                });
            }
        }.bind(me));
        return false;
    },

    onBeforeEventResizeFinalize: function (scheduler, resizeContext, e, eOpts) {
        var me = this,
            data = resizeContext.eventRecord.data,
            settings = TS.app.settings;

        me.__ddContext = resizeContext;
        // check read only rights
        if (settings.schedReadOnly === true) {
            me.__ddContext.finalize(false);
            return false;
        }

        //check if start/end dates
        if (data.schedStartDate == resizeContext.start && data.schedEndDate == resizeContext.end) {
            me.__ddContext.finalize(true);
            return false;
        }
        //check if recurrence and stop
        if (data.recurrenceConfig) {
            Ext.Msg.alert('Warning', 'This is a recurring ' + settings.fwaAbbrevLabel + '. ' + settings.crewLabel + ' and start/end times cannot be re-assigned.');
            me.__ddContext.finalize(false);
            return false;
        }

        //check status and stop if needed
        me.onCheckFwaStatus(data, function (proceed) {
            if (!proceed) {
                me.__ddContext.finalize(false);
                return false;
            } else {
                TS.Util.onCheckPriorToEmployeeAssn(data, true, data.scheduledCrewId, function (isOkay) {
                    if (isOkay) {
                        TS.Util.onCheckForDoubleBookedEmployees(data.fwaId, data.scheduledCrewId, resizeContext.start, resizeContext.end, function (status) {
                            if (status) {
                                // resizeContext.eventRecord.set('schedStartDate', resizeContext.start);
                                // resizeContext.eventRecord.set('schedEndDate', resizeContext.end);
                                resizeContext.eventRecord.schedStartDate = resizeContext.start;
                                resizeContext.eventRecord.data.schedEndDate = resizeContext.end;

                                me.onReScheduleFWA(scheduler, data, resizeContext.start, resizeContext.end, null, null);
                                me.__ddContext.finalize(true);
                            } else {
                                me.__ddContext.finalize(false);
                            }
                        }.bind(me));
                    } else {
                        me.__ddContext.finalize(false);
                    }
                });

            }
        }.bind(me));
        return false;
    },

    onCheckFwaStatus: function (data, callback) {
        if (data.fwaStatusId == FwaStatus.Submitted || data.fwaStatusId == FwaStatus.Approved) {
            var me = this,
                message = ' Do you wish to continue?';
            Ext.Msg.confirm('Please Confirm', 'Changing crew or start/end times will change status to Scheduled.' + message, function (btn) {
                if (btn === 'yes') {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        } else {
            callback(true)
        }
    },

    onReScheduleFWA: function (scheduler, data, start, end, isDelete, eOpts) {
        var settings = TS.app.settings,
            me = this,
            cloneData;
        data.schedStartDate = start;
        data.schedEndDate = end;
        cloneData = Ext.clone(data);
        me.continueReScheduleFWA(me, cloneData, settings, isDelete);
    },

    continueReScheduleFWA: function (me, data, settings, isDelete) {
        //need to set work date since it is a hours dummy on load
        Ext.each(data.hours.getRange(), function (hr) {
            hr.set('workDate', new Date(data.schedStartDate));
        });
        data.expenses = data.expenses && data.expenses.length > 0 ? Ext.Array.pluck(data.expenses.getRange(), 'data') : [];
        data.hours = Ext.Array.pluck(data.hours.getRange(), 'data');
        data.notes = Ext.Array.pluck(data.notes.getRange(), 'data');
        data.workSchedAndPerf = Ext.Array.pluck(data.workSchedAndPerf.getRange(), 'data');
        data.nonFieldActions = Ext.Array.pluck(data.nonFieldActions.getRange(), 'data');
        //check dateOrdered/dateRequired
        data = TS.Util.checkFwaForValidDates(data);
        //create array of fwa units
        data.units = Ext.Array.pluck(data.units.getRange(), 'data');
        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            unit.unitDate = new Date(data.schedStartDate);
            if (unit.details && unit.details.loadCount > 0) {
                unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
            }
        });

        Ext.each(data.hours, function (hour) {
            if (!hour.startTime) {
                hour.startTime = new Date();
                hour.endTime = new Date();
            }
        });
        //if null set to schedStartDate, else leave as is
        if (!data.nextDate)
            data.nextDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        else
            data.nextDate = TS.common.Util.getOutUTCDate(data.nextDate);
        //adjust for time zone
        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);
        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });
        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);
        //check and save FWA
        //clear attachments - only used when coming FROM backend
        data.attachments = [];

        Fwa.Save(null, settings.username, settings.empId, data, true, true, function (response, success, operation) {
            if (response && response.success) {
                // update FWA tab
                Ext.GlobalEvents.fireEvent('UpdateFwaGridFromScheduler', response.data, isDelete);
                //update crew assign
                Ext.GlobalEvents.fireEvent('ResetCrewAssign', response.data);
                //update employee view
                Ext.GlobalEvents.fireEvent('ResetEmployeeView');
                //update scheduler grid
                //TODO remove comment if you want to refresh the Scheduler Gantt chart or use getView().refresh()
                //me.reloadEventStoreOnly();
                me.lookup('scheduler').getView().refresh();
                //send back updated fwa
                return response.data;
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
            me.getView().setLoading(false);
        }.bind(me));
    },

    initViewModelBindings: function () {
        var me = this,
            viewModel = me.getViewModel(),
            scheduler = Ext.first('scheduler-crew'),
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

        //filter out any crews with no crew members
        store.filterBy(function (record) {
            return record.get('crewCt') > 0;
        });
    },

    // Shows a map of all scheduled FWAs
    showFwaMap: function () {
        var scheduler = this.lookup('scheduler'),
            myStore = scheduler.getEventStore(),
            daterange = scheduler.getSchedulingView().getVisibleDateRange(),
            startDate = daterange.startDate,
            endDate = daterange.endDate;
        // Filter based on visible dates
        myStore.clearFilter(true);
        myStore.filterBy(function (record) {
            return record.get('schedStartDate') >= startDate && record.get('schedStartDate') <= endDate ||
                record.get('schedEndDate') >= startDate && record.get('schedEndDate') <= endDate;
        });

        // If no crews on screen, return
        if (myStore.data.getCount() == 0) return; // TODO -- Client - feedbackshould we send a message?

        // Display filtered map list
        Ext.create('TS.view.fwa.FwaMap', {
            fwaStore: myStore,
            bind: {
                title: '{settings.fwaAbbrevLabel} Location(s) for ' + Ext.Date.format(startDate, Ext.Date.defaultFormat) + ' - ' + Ext.Date.format(endDate, Ext.Date.defaultFormat)
            }
        }).show();
    },
    // Reloads the stores, responds to controller events such as updatesettings
    reloadSchedulerStores: function (fwa, beenSaved) {
        //console.log(991);
        var me = this,
            scheduler = me.lookup('scheduler'),
            unplanned = me.lookup('unplannedfwagrid'),
            settings = TS.app.settings,
            array = [],
            eventRecord;
        //reload scheduler resource store
        scheduler.getResourceStore().load(); //crew grid
        if (fwa) {
            if (fwa.fwaStatusId != FwaStatus.Create && fwa.hasCrew) {
                eventRecord = scheduler.getEventStore().findRecord('fwaId', fwa.fwaId);
                //THIS IS A NEW FWA and NEEDS TO CHECK DOUBLE BOOKED
                if (!eventRecord && !beenSaved) {
                    fwa.lastSubmittedDate = new Date('1/1/2001 12:00:00 AM');
                    fwa.lastApprovedDate = new Date('1/1/2001 12:00:00 AM');
                    TS.Util.onCheckPriorToEmployeeAssn(fwa, true, fwa.scheduledCrewId, function (isOkay) {
                        if (isOkay) {
                            TS.Util.onCheckForDoubleBookedEmployees(fwa.fwaId, fwa.scheduledCrewId, fwa.schedStartDate, fwa.schedEndDate, function (status) {
                                if (!status) {
                                    fwa.scheduledCrewChiefId = '';
                                    fwa.scheduledCrewId = '';
                                    fwa.scheduledCrewName = '';
                                    fwa.schedStartDate = new Date('1/1/2001 12:00:00 AM');
                                    fwa.schedEndDate = new Date('1/1/2001 12:00:00 AM');
                                    fwa.dateOrdered = new Date('1/1/2001 12:00:00 AM');
                                    fwa.dateRequired = new Date('1/1/2001 12:00:00 AM');
                                    fwa.lastSubmittedDate = new Date('1/1/2001 12:00:00 AM');
                                    fwa.lastApprovedDate = new Date('1/1/2001 12:00:00 AM');
                                    fwa.udf_d1 = new Date('1/1/2001 12:00:00 AM');
                                    fwa.udf_d2 = new Date('1/1/2001 12:00:00 AM');
                                    fwa.udf_d3 = new Date('1/1/2001 12:00:00 AM');
                                    fwa.fwaStatusId = FwaStatus.Create;
                                    fwa.expenses = null;
                                    fwa.hours = new Array(0); //Ext.Array.pluck(fwa.hours.getRange(), 'fwa');
                                    fwa.notes = new Array(0); //Ext.Array.pluck(fwa.notes.getRange(), 'data');
                                    Ext.each(fwa.workSchedAndPerf, function (obj) {
                                        array.push({
                                            actualHours: obj.actualHours,
                                            comments: obj.comments,
                                            id: obj.id,
                                            pctComplete: obj.pctComplete,
                                            picRequired: obj.picRequired,
                                            scheduledHours: obj.scheduledHours,
                                            workCodeAbbrev: obj.workCodeAbbrev,
                                            workCodeId: obj.workCodeId
                                        })
                                    });
                                    fwa.workSchedAndPerf = array;
                                    array = [];
                                    Ext.each(fwa.nonFieldActions, function (obj) {
                                        array.push({
                                            actionDateCompleted: obj.actionDateCompleted,
                                            actionItemDescr: obj.actionItemDescr,
                                            actionItemId: obj.actionItemId,
                                            actionNotes: obj.actionNotes,
                                            actionOwnerId: obj.actionOwnerId,
                                            actionTypeId: obj.actionTypeId,
                                            fwaId: obj.fwaId
                                        })
                                    });
                                    //if null set to schedStartDate, else leave as is
                                    if (!fwa.nextDate)
                                        fwa.nextDate = TS.common.Util.getOutUTCDate(fwa.schedStartDate);
                                    else
                                        fwa.nextDate = TS.common.Util.getOutUTCDate(fwa.nextDate);
                                    fwa.nonFieldActions = array;
                                    array = []; //FYI: no need to pre check this Save
                                    //clear attachments - only used when coming FROM backend
                                    fwa.attachments = [];
                                    fwa.duration = 0;
                                    Fwa.Save(null, settings.username, settings.empId, fwa, true, true, function (response, success, operation) {
                                        if (response && response.success) {
                                            me.continueReload();
                                        } else if (response && !response.success) {
                                            Ext.GlobalEvents.fireEvent('Error', response);
                                        }
                                    }.bind(me));
                                } else {
                                    me.continueReload();
                                }
                            }.bind(me));
                        } else {
                            me.continueReload();
                        }
                    }.bind(me));
                } else {
                    me.continueReload();
                }
            } else {
                me.continueReload();
            }
        } else {
            me.continueReload();
        }
    },

    continueReload: function () {
        var me = this,
            scheduler = this.lookup('scheduler') || Ext.first('scheduler-crew'),
            unplanned = this.lookup('unplannedfwagrid') || Ext.first('#unplannedfwagrid'),
            unplannedStore = unplanned.getStore();

        scheduler.getEventStore().removeAll();
        scheduler.getEventStore().load(); //scheduler grid
        unplannedStore.reload();
        //Ext.GlobalEvents.fireEvent('ResetCrewAssign');
        //Ext.first('#crewTabPanel').setActiveTab('tabSchedulerPanel');
    },

    ////onReloadUnplanned
    onReloadUnplanned: function () {
        var unplanned = this.lookup('unplannedfwagrid');
        unplanned.getStore().reload();
    },

    reloadEventStoreOnly: function () {
        var me = this,
            scheduler = me.lookup('scheduler'),
            settings = TS.app.settings,
            eventStore = scheduler.getEventStore();
        //Scheduled FWAs
        eventStore.getProxy().setExtraParams({
            scheduledFwas: true,
            isPreparedByMe: settings.schedFwaPreparedByMe,
            timeZoneOffset: new Date().getTimezoneOffset()
        });
        eventStore.load();
        scheduler.getView().refresh();
    },

    reloadEventStore: function (settings) {
        var me = this,
            scheduler = me.lookup('scheduler'),
            unplanned = me.lookup('unplannedfwagrid'),
            unplannedStore = unplanned.getStore(),
            eventStore = scheduler.getEventStore(),
            resourceStore = scheduler.getResourceStore();
        //clear preset
        me.currentViewPreset = '';
        //reload stores
        //Crews
        resourceStore.getProxy().setExtraParams({
            isPreparedByMe: settings.schedCrewPreparedByMe,
            timeZoneOffset: TIMEZONE_OFFSET
        });
        resourceStore.removeAll();
        resourceStore.load(function (records, opts, success) {
            if (records) {
                //Scheduled FWAs
                eventStore.getProxy().setExtraParams({
                    scheduledFwas: true,
                    isPreparedByMe: settings.schedFwaPreparedByMe,
                    timeZoneOffset: TIMEZONE_OFFSET
                });
                eventStore.removeAll();
                eventStore.load();
            }
        });
        //Unscheduled FWAs
        unplannedStore.getProxy().setExtraParams({
            scheduledFwas: false,
            isPreparedByMe: settings.schedFwaPreparedByMe,
            timeZoneOffset: TIMEZONE_OFFSET
        });
        unplannedStore.load();
        //refresh UI
        scheduler.getView().refresh();
        unplanned.getView().refresh();
        // calls not needed - leave for reference
        // me.onSchedulerRender(scheduler);
        //reload load time axis
        me.setTimeAxisFilter();

        //grid = Ext.first('scheduler-employeeview');
        resourceStore.load();
        eventStore.load();
    },

    reloadCrewResource: function () {
        this.lookup('scheduler').getResourceStore().reload();
        this.reloadSchedulerStores();
    },

    onShowUnscheduledFwaMap: function () {
        var myStore = this.lookup('unplannedfwagrid').getStore();
        // If no FWAs on screen, return
        if (myStore.data.getCount() == 0) return;
        // Display map list
        Ext.create('TS.view.fwa.FwaMap', {
            fwaStore: myStore,
            bind: {
                title: '{settings.fwaAbbrevLabel} Location(s) for unscheduled work.'
            }
        }).show();
    },

    prePostFwaActions: function (view, rowIndex, colIndex, item, e, record) {
        var me = this,
            settings = TS.app.settings,
            fwaId = record.get('fwaId'),
            grid,
            actionWindow,
            store;

        if (me.actionWindow) {
            me.actionWindow.close();
        }

        actionWindow = Ext.create('TS.view.fwa.FwaActions', {
            isGrid: true,
            fwaRecord: record,
            fwaId: fwaId
        });

        grid = Ext.first('grid-fwaactions');
        store = grid.getStore();

        Ext.each(record.get('nonFieldActions').getRange(), function (action) {
            store.add(action);
        });
        store.sort([
            {property: 'actionType', direction: 'DESC'}
        ]);
        actionWindow.show();
    },


    onGoToDate: function (component, e) {
        var me = this,
            goToDateWindow;

        if (me.goToDateWindow) {
            me.goToDateWindow.close();
        }

        goToDateWindow = Ext.create('TS.view.crew.GoToDate', {});
        goToDateWindow.setController('panel-scheduler');
        goToDateWindow.show();
    },

    cancelGoToDate: function (component, e) {
        this.getView().close();
    },

    goToDate: function (component, e) {
        var me = this,
            vw = me.getView(),
            scheduler = Ext.first('scheduler-crew'),
            goToDate = new Date(Ext.first('#goToDateField').getValue());
        goToDate.setHours(12, 0, 0, 0);
        if (scheduler.getViewPreset() == 'hourAndDay')
        {
            scheduler.scrollToDateCentered(new Date(goToDate));
        }
        else
        {
            scheduler.scrollToDate(new Date(goToDate));
        }
        scheduler.setTimeColumnWidth(100);
        me.getView().close();
    },

    onSelectGoToDate: function (field, value) {
        Ext.first('#goToDateButton').setDisabled(false);
    },

    onMakeAvailableClick: function (scheduler, eventRecord, eOpts) {
        var settings = TS.app.settings,
            me = this;

        if (!eventRecord.get('availableForUseInField')) {
            Ext.Msg.confirm('Please Confirm', 'Do you want to set ' + settings.fwaAbbrevLabel + ' ' + eventRecord.get('fwaName') + ' to available for use in the field?', function (btn) {
                if (btn == 'yes') {
                    Fwa.SetFwaAvailability(null, settings.username, settings.empId, eventRecord.get('fwaId'), function (response) {
                        if (response && response.success) {
                            //reload scheduler gantt chart
                            me.reloadEventStoreOnly();
                        } else if (response) {
                            Ext.GlobalEvents.fireEvent('Error', response);
                        }
                        me.getView().setLoading(false);
                    }.bind(me));
                }
            }, me);
        } else {
            return true;
        }
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    refreshSchedulerScreen: function (btn, event) {
        var me = this,
            dt = new Date(),
            scheduler = me.lookup('scheduler') || Ext.first('scheduler-crew'),
            unplanned = me.lookup('unplannedfwagrid') || Ext.first('#unplannedfwagrid'),
            resourceStore = me.lookup('scheduler').getResourceStore();

        resourceStore.load(); //scheduler resource grid
        scheduler.getEventStore().load(); //scheduler event grid
        unplanned.getStore().load(); //unscheduled grid

        // dt.setHours(12,0,0)
        //scheduler.scrollToDateCentered(new Date(dt));
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onSendSMS: function (component, e) {
        Ext.create('TS.common.window.SMS').show();
    },

    cloneFwaData: function (fwa) {
        var data;

        data = Ext.clone(fwa.data);
        data.expenses = data.expenses && data.expenses.length > 0 ? Ext.Array.pluck(data.expenses.getRange(), 'data') : [];
        data.hours = Ext.Array.pluck(data.hours.getRange(), 'data');
        data.notes = Ext.Array.pluck(data.notes.getRange(), 'data');
        data.workSchedAndPerf = Ext.Array.pluck(data.workSchedAndPerf.getRange(), 'data');
        data.nonFieldActions = Ext.Array.pluck(data.nonFieldActions.getRange(), 'data');
        //check dateOrdered/dateRequired
        data = TS.Util.checkFwaForValidDates(data);
        data.nextDate = data.schedStartDate;
        //create array of fwa units
        data.units = Ext.Array.pluck(data.units.getRange(), 'data');
        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            if (unit.details) {
                unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
            }
        });
        //convert duration to minutes
        data.duration = data.duration * 60;
        //return
        return data;
    },

    onResetSort: function (component, e) {
        var scheduler = Ext.first('scheduler-crew');
        scheduler.getResourceStore().sorters.removeAll();
        scheduler.getResourceStore().reload();
    },

    startNewFwa: function () {
        //TS.app.redirectTo('newfwa');
        Ext.GlobalEvents.fireEvent('StartNewFwa');
    }
});
