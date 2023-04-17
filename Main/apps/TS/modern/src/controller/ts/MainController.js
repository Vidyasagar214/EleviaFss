Ext.define('TS.controller.ts.MainController', {
    extend: 'TS.view.main.MainController',

    alias: 'controller.ts-main',

    control: {
        'button[action=tssign]': {
            tap: 'tsSubmitPinClick'
        },

        'button[action=close]': {
            tap: 'onCloseSheet'
        },

        'button[action=copy-ts]': {
            tap: 'onCopyTimesheet'
        },

        'button[action=select-project]': {
            tap: 'onSelectProject'
        },

        'button[action=select-laborcode]': {
            tap: 'onSelectLaborCode'
        },

        'button[action=save-project]': {
            tap: 'onProjectSave'
        }
    },

    init: function () {

    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
        Ext.Viewport.setActiveItem('app-fss');
    },

    findCurrentTimesheet: function () {
        this.getView().setLoading(true);
        var me = this,
            vm = me.getViewModel(),
            tsDate = new Date(),
            settings = TS.app.settings,
            initialTimesheet = null,
            date = Ext.Date.format(new Date(), DATE_FORMAT),
            grid = Ext.first('ts-list'),
            store = grid.getStore(),
            selection,
            startDate,
            endDate;

        TimeSheet.GetListByEmployee(null, settings.username, settings.empId, 0, 10000, function (response, operation, success) {
            if (response && response.success) {
                Ext.Array.each(response.data, function (row) {
                    startDate = Ext.Date.format(new Date(row.startDate), DATE_FORMAT);
                    endDate = Ext.Date.format(new Date(row.endDate), DATE_FORMAT);
                    if (Ext.Date.between(new Date(date), new Date(startDate), new Date(endDate))) {
                        initialTimesheet = row;
                        return false;
                    }
                }, this);

                if (initialTimesheet) {
                    if (store) {
                        selection = store.findRecord('tsPeriodId', initialTimesheet.tsPeriodId);
                        if (selection) {
                            if (response.message.mdBody) {
                                var msg = response.message;
                                Ext.Msg.alert(msg.mdTitleBarText, msg.mdBody);
                            }
                            grid.setSelection(selection);
                            me.editSelectedTimesheet();
                        }
                    }
                }
            }
        });

        this.getView().setLoading(false);
    },

    editSelectedTimesheet: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            currentTsRow = vm.get('currentTSRow'),
            selectedDay = vm.get('selectedDay'),
            tsViewList = Ext.first('ts-timesheet').down('list'),
            format = function (v) {
                return Ext.Date.format(v, DATE_FORMAT);
            },
            selection = vm.get('selectedTS'),
            startDate = selection.get('startDate'),// TS.common.Util.createUTCDate(selection.get('startDate')),
            endDate = selection.get('endDate'), // TS.common.Util.createUTCDate(selection.get('endDate')),
            // startDate = TS.common.Util.getInUTCDate(selection.get('startDate')),
            // endDate = TS.common.Util.getInUTCDate(selection.get('endDate')),
            store;
        //added so we can build template for display of timesheet period dates & hours
        settings.tsStartDate = format(startDate);
        settings.tsEndDate = format(endDate);

        vm.set('startDate', startDate);
        vm.set('endDate', endDate);
        store = vm.getStore('tsrow');
        store.getProxy().setExtraParams({
            tsDate: endDate,
            includeCrewMembers: settings.tsCanViewCrewMemberTime
        });
        store.load({
            scope: me,
            callback: function (results, operation, success) {
                if (store.getRange().length > 0) {
                    if (operation.getResponse().result.message && operation.getResponse().result.message.mdBody) {
                        var msg = operation.getResponse().result.message;
                        Ext.Msg.alert(msg.mdTitleBarText, msg.mdBody);
                    }
                    me.adjustTotalHours(store);
                    store.sort('crewRoleId', 'ASC');
                    store.filterBy(function (rec) {
                        if (settings.tsCanViewCrewMemberTime) {
                            return true;
                        } else {
                            return rec.get('empId') === settings.empId;
                        }
                    });

                    vm.set('tsStatus', selection.get('status'));
                    if (selection.get('status') == TsStatus.Approved || (selection.get('status') == TsStatus.Submitted && !settings.tsAllowUnsubmit)) {
                        Ext.first('#tsSaveButton').setDisabled(true);
                        Ext.first('#tsSubmitButton').setDisabled(true);
                    }
                    // sets to dirty on load, so reset
                    if (currentTsRow) currentTsRow.dirty = false;
                    if (selectedDay) selectedDay.dirty = false;
                    me.getView().setActiveItem(1);
                    tsViewList.setOnItemDisclosure(!vm.get('tsDisabled'));
                }
            }
        });
    },

    onMenuTap: function () {
        this.getView().add({xtype: 'ts-editmenu'}).show();
    },

    onBackBt: function () {
        var view = this.getView(),
            idx = view.innerItems.indexOf(view.getActiveItem());

        view.setActiveItem(--idx);
    },

    onTsBackBt: function () {
        var me = this,
            vm = me.getViewModel(),
            currentTsRow = vm.get('currentTSRow'),
            selectedDay = vm.get('selectedDay'),
            view = me.getView(),
            idx = view.innerItems.indexOf(view.getActiveItem()),
            settings = TS.app.settings;

        if ((currentTsRow && currentTsRow.dirty) || (selectedDay && selectedDay.dirty)) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved ' + settings.tsTitle + ' changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    view.setActiveItem(--idx);
                }
            });
        } else {
            view.setActiveItem(--idx);
        }
    },

    onHoursTap: function (list, index, target, record) {
        var me = this,
            vm = me.getViewModel();
        vm.set('currentTSRow', record);
        this.onHours(list, record);
    },

    onHours: function (list, rec) {
        var d = Ext.Date,
            me = this,
            vm = me.getViewModel(),
            hoursview = vm.getStore('hoursview'),
            hoursList = Ext.first('ts-hours').down('list'),
            settings = TS.app.settings,
            cells = vm.get('currentTSRow').cells().getRange(),
            cDate = vm.get('startDate'),
            days = vm.get('dayCount'),
            currentTsRow = vm.get('currentTSRow'),
            deleteButton = Ext.first('#deleteRowButton'),
            copyButton = Ext.first('#copyRowButton'),
            arr = [],
            placeholderRec,
            dateString,
            i = 0,
            timePeriodTtl = 0,
            groupHeader =  TS.common.Util.createGroupHeader(vm.get('currentTSRow')),
            n;

        vm.set('groupHeader', groupHeader);
        //generate data for N days according to timesheet
        for (; i < days; i++) {
            dateString = new Date(cDate).toISOString();
            placeholderRec = Ext.create('TS.model.ts.TsCell', {
                workDate: dateString,
                regHrs: 0,
                ovtHrs: 0,
                ovt2Hrs: 0,
                travelHrs: 0,
                comment: '',
                fwaId: '',
                fwaNum: '',
                startTime: dateString,
                endTime: dateString,
                empId: rec.get('empId')
            });

            arr.push(placeholderRec);
            cDate = d.add(cDate, d.DAY, 1);
        }
        //Match with cells data
        if (cells && cells.length > 0) {
            for (i = 0; i < cells.length; i++) {
                for (n = 0; n < arr.length; n++) {
                    if (new Date(cells[i].get('workDate')).getUTCDate() === new Date(arr[n].get('workDate')).getUTCDate()) {

                        arr[n].set(cells[i].getData());

                        timePeriodTtl += cells[i].get('regHrs');
                        //check user configurations
                        if (settings.tsAllowOvtHrs) timePeriodTtl += cells[i].get('ovtHrs');
                        if (settings.tsAllowOvt2Hrs) timePeriodTtl += cells[i].get('ovt2Hrs');
                        if (settings.tsAllowTravelHrs) timePeriodTtl += cells[i].get('travelHrs');
                        break;
                    }
                }
            }
        }
        //set vm value for employee read-only
        vm.set('isNewRecord', rec.get('isNewRecord') || false);
        //set remote sort so arr is not rearranged in store
        hoursview.setRemoteSort(true);
        hoursview.loadRawData(arr);
        //Change page
        me.getView().setActiveItem(2);
        me.calculatePeriodTtlHrs();
        //check rights in settings
        deleteButton.setHidden(settings.empId !== rec.get('empId'));
        copyButton.setHidden(settings.empId !== rec.get('empId'));
        hoursList.setOnItemDisclosure(settings.empId !== rec.get('empId') && !settings.tsCanEnterCrewMemberTime);
        currentTsRow.dirty = false;
    },

    onHoursEditTap: function (list, index, target, record) {
        var me = this,
            vm = me.getViewModel();
        vm.set('selectedDay', record);
        this.onHoursEdit(list, record);
    },

    setHoursReadOnly: function(rec){
        var settings = TS.app.settings,
            vw = this.getView(),
            vm = this.getViewModel(),
        isDisabled = false;

        if(rec.get('fwaId')  && !settings.tsCanModifyFwaHours)
        {
            isDisabled = true;
        }
        if (settings.empId != rec.get('empId') && !settings.tsCanEnterCrewMemberTime && !vm.get('isTimesheetApproval')) {
            isDisabled = true;
        }
        if (vm.get('isTimesheetApproval') && !vm.get('tsApproverCanModify')) {
            isDisabled = true;
        }

        vw.lookup('employeeHours').setDisabled(isDisabled);
        vw.lookup('updateHoursButton').setDisabled(isDisabled);
        vw.lookup('editHoursTitle').setTitle(isDisabled ? 'Edit Hours-Read Only' : 'Edit Hours')
    },

    onHoursEdit: function (list, rec) {
        var settings = TS.app.settings,
            vw = this.getView(),
            vm = this.getViewModel(),
            selectedDay = vm.get('selectedDay'),
            wd = new Date(selectedDay.get('workDate')),
            //utcDate = TS.common.Util.getInUTCDate(wd);
            isChief = false,
            utcDate = wd;// TS.common.Util.createUTCDate(wd);
        selectedDay.set('workDate', utcDate);

        //get copy of original, in case user cancels
        vm.set('regHrsCopy', selectedDay.get('regHrs'));
        vm.set('ovtHrsCopy', selectedDay.get('ovtHrs'));
        vm.set('ovt2HrsCopy', selectedDay.get('ovt2Hrs'));
        vm.set('travelHrsCopy', selectedDay.get('travelHrs'));
        vm.set('commentCopy', selectedDay.get('comment'));

        this.setHoursReadOnly(rec);

        Ext.each(rec.get('hours'), function(item){
            if(item.get('isChief') && item.get('empId') == settings.empId){
                isChief = true;
            }
        })
        if (!isChief && settings.empId !== rec.get('empId') && !settings.tsCanEnterCrewMemberTime) {
            Ext.Msg.alert('Warning', 'User does not have rights to edit a ' + settings.crewLabel + ' member. May view only.');
            return;
        }

        Ext.first('#fwaField').setHidden(!rec.get('fwaId'));
        Ext.first('#fwaButton').setHidden(!rec.get('fwaId'));

        var workDate = selectedDay.get('workDate'),
            isHoliday = 0;
        isHoliday = Ext.getStore('HolidaySchedule').findBy(function (rec) {
            if (Ext.Date.format(new Date(rec.get('holidayDate')), DATE_FORMAT) == Ext.Date.format(new Date(workDate), DATE_FORMAT)) {
                return rec;
            }
        });

        if (isHoliday > -1) {
            // Ext.first('#regHrsField').getCls().push('holiday');
            // Ext.first('#ovtHrsField').getCls().push('holiday');
            // Ext.first('#ovt2HrsField').getCls().push('holiday');
            // Ext.first('#travelHrsField').getCls().push('holiday');
            Ext.first('#regHrsField').setCls('holiday');
            Ext.first('#ovtHrsField').setCls('holiday');
            Ext.first('#ovt2HrsField').setCls('holiday');
            Ext.first('#travelHrsField').setCls('holiday');
        } else {
            Ext.first('#regHrsField').setCls('');
            Ext.first('#ovtHrsField').setCls('');
            Ext.first('#ovt2HrsField').setCls('');
            Ext.first('#travelHrsField').setCls('');
        }

        this.getView().setActiveItem(3);
        selectedDay.dirty = false;
    },

    onRowDelete: function () {
        var me = this,
            ts = Ext.first('ts-timesheet'),
            vm = me.getViewModel(),
            tsRow = vm.getStore('tsrow'),
            settings = TS.app.settings,
            currentTsRow = vm.get('currentTSRow');

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to delete this " + settings.tsTitle + " entry?", function (btn) {
            if (btn === 'yes') {
                tsRow.removeAt(tsRow.indexOfId(currentTsRow.getId()));
                me.onBackBt();
                //refresh list and any other calculated visuals
                ts.down('list').refresh();
                me.adjustTotalHours(tsRow);
            }
        });
    },

    onRowCopy: function () {
        var me = this,
            ts = Ext.first('ts-timesheet'),
            vm = me.getViewModel(),
            tsRow = vm.getStore('tsrow'),
            settings = TS.app.settings,
            currentTsRow = vm.get('currentTSRow'),
            newTsRow = new TS.model.ts.TsRow({
                seq: tsRow.data.length + 1,
                rowNum: tsRow.data.length + 1,
                billCategory: currentTsRow.get('billCategory'),
                chargeType: currentTsRow.get('chargeType'),
                clientId: currentTsRow.get('clientId'),
                clientName: currentTsRow.get('clientName'),
                clientNumber: currentTsRow.get('clientNumber'),
                crewRoleId: currentTsRow.get('crewRoleId'),
                empId: currentTsRow.get('empId'),
                empName: currentTsRow.get('empName'),
                laborCode: currentTsRow.get('laborCode'),
                projectId: currentTsRow.get('projectId'),
                tsheetStatus: currentTsRow.get('tsheetStatus'),
                wbs1: currentTsRow.get('wbs1'),
                wbs1Name: currentTsRow.get('wbs1Name'),
                wbs2: currentTsRow.get('wbs2'),
                wbs2Name: currentTsRow.get('wbs2Name'),
                wbs3: currentTsRow.get('wbs3'),
                wbs3Name: currentTsRow.get('wbs3Name'),
                cells: []
            });

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to copy this " + settings.tsTitle + " row entry?", function (btn) {
            if (btn === 'yes') {
                tsRow.add(newTsRow);
                me.onBackBt();
                //refresh list and any other calculated visuals
                ts.down('list').refresh();
                me.adjustTotalHours(tsRow);
            }
        });
    },

    onPrint: function (bt) {

        var me = this,
            vm = me.getViewModel(),
            currentTsRow = vm.get('currentTSRow'),
            selectedDay = vm.get('selectedDay'),
            selection = me.getViewModel().get('selectedTS'),
            periodId = selection.get('tsPeriodId'),
            startDate = Ext.Date.format(new Date(selection.get('startDate')), Ext.Date.defaultFormat),
            endDate = Ext.Date.format(new Date(selection.get('endDate')), Ext.Date.defaultFormat),
            empId = selection.get('empId'), //TODO see if we need to use tsEmpId
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'window-print',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                modelId: periodId,
                appType: 'TS',
                empId: empId,
                isList: false
            });
        Ext.first('#singleFile').setHidden(!sheet.isList);
        if ((currentTsRow && currentTsRow.dirty) || (selectedDay && selectedDay.dirty)) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved ' + settings.tsTitle + ' changes. These changes need to be saved to be reflected. Do you want continue?', function (btn) {
                if (btn === 'yes') {
                    Ext.Viewport.add(sheet);
                    sheet.down('titlebar[docked=top]').setTitle(settings.tsTitle + ': ' + startDate + '-' + endDate);
                    sheet.show();

                    bt.up('ts-editmenu').hide();
                }
            });
        } else {
            Ext.Viewport.add(sheet);
            sheet.down('titlebar[docked=top]').setTitle(settings.tsTitle + ': ' + startDate + '-' + endDate);
            sheet.show();

            bt.up('ts-editmenu').hide();
        }
    },

    onEmail: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            currentTsRow = vm.get('currentTSRow'),
            selectedDay = vm.get('selectedDay'),
            selection = me.getViewModel().get('selectedTS'),
            periodId = selection.get('tsPeriodId'),
            empId = selection.get('empId'), //TODO see if we need to use tsEmpId
            settings = TS.app.settings,
            employee = Ext.getStore('TsEmployees').getById(settings.empId),//logged in user
            sheet = Ext.create({
                xtype: 'window-email',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                appType: 'Timesheet',
                empId: empId,
                modelId: periodId,
                emailNote: {_tr: 'tsTitle', tpl: 'Attach {0}'}
            });

        if ((currentTsRow && currentTsRow.dirty) || (selectedDay && selectedDay.dirty)) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved ' + settings.tsTitle + ' changes. These changes need to be saved to be reflected. Do you want continue?', function (btn) {
                if (btn === 'yes') {
                    sheet.lookup('ccEmailField').setValue(employee.get('emailAddress'));
                    sheet.down('titlebar[docked=top]').setTitle('Email');
                    sheet.down('formpanel').down('checkboxfield').setLabel(sheet.emailNote);
                    sheet.down('formpanel').down('button').setHidden(true);
                    Ext.Viewport.add(sheet);
                    sheet.show();
                    bt.up('ts-editmenu').hide();
                }
            });
        } else {
            sheet.lookup('ccEmailField').setValue(employee.get('emailAddress'));
            sheet.down('titlebar[docked=top]').setTitle('Email');
            sheet.down('formpanel').down('checkboxfield').setLabel(sheet.emailNote);
            sheet.down('formpanel').down('button').setHidden(true);
            Ext.Viewport.add(sheet);
            sheet.show();
            bt.up('ts-editmenu').hide();
        }
    },

    onTSCopy: function (bt) {
        var me = this,
            baseView = Ext.first('app-ts'),
            sheet = Ext.create({
                xtype: 'ts-select',
                viewModel: {
                    parent: me.getViewModel()
                }
            });

        baseView.add(sheet); // add to base view, rather than to Viewport. This ensures that code is accessible from this very same controller
        sheet.show();
        bt.up('ts-editmenu').hide();
    },

    checkWbs1Information: function (tsRows) {
        var settings = TS.app.settings,
            hasProject = true;
        Ext.each(tsRows, function (obj) {
            if (!obj.wbs1) {
                Ext.Msg.alert('Warning', 'Missing required ' + settings.wbs1Label + ' information on an entry');
                hasProject = false;
            }
        });
        return hasProject;
    },

    onCloseStartEndTime: function (me) {
        me.up('sheet').destroy();
    },

    onSaveStartEnd: function (me) {
        var settings = TS.app.settings,
            selectedTS = me.getParent().parent.selectedTS,
            empId = settings.empId,
            selectedDate = new Date(Ext.first('#workDateLabel').getHtml()),
            startTime = Ext.first('#startTimeField').getValue(),
            endTime = Ext.first('#endTimeField').getValue(),
            startEndTimes = me.getParent().parent.startEndTimes,
            bob,
            timeObject = Ext.Array.findBy(startEndTimes, function (item) {
                if (Ext.Date.format(new Date(item.workDate), DATE_FORMAT) === Ext.Date.format(new Date(selectedDate), DATE_FORMAT))
                    return true;
            })

        if (startTime >= endTime || startTime === endTime) {
            bob = Ext.Msg.alert("Warning", 'End Time must be greater than Start Time.');
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
        } else if (startTime && !endTime) {
            bob = Ext.Msg.alert("Warning", 'End Time is a required field.');
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
        } else if (!startTime && endTime) {
            bob = Ext.Msg.alert("Warning", 'Start Time is a required field.');
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
        } else if (!startTime || !endTime) {
            bob = Ext.Msg.alert("Warning", 'Start/End Times are required fields.');
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
        } else if(startTime === endTime){
            bob = Ext.Msg.alert("Warning", 'Start/End Times cannot equal each other.');
            setTimeout(function () {
                bob.close();
            }, MSG_CLOSE);
        }else {
            timeObject.empId = empId;
            timeObject.startTime = Ext.Date.format(startTime, 'h:i A');
            timeObject.endTime = Ext.Date.format(endTime, 'h:i A');
            me.up('sheet').destroy();
        }
    },

    onSaveTS: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            timesheetData = vm.get('selectedTS').getData(true),
            rowData = vm.getStore('tsrow').getRange(), //.sort([{property: 'workDate', direction: 'ASC'}]),
            iLen = rowData.length,
            tsheetStore = vm.getStore('tsheet'),
            tsRows = [],
            i = 0,
            message,
            hasProject = true;

        // retrieve associative data and place in the array
        for (; i < iLen; i++) {
            tsRows.push(rowData[i].getData(true));
        }
        //check wbs1 information
        hasProject = me.checkWbs1Information(tsRows);
        // if no wbs1 info stop save/submit
        if (!hasProject) return;

        // Ext.each(tsRows, function (row) {
        //     Ext.each(row.cells, function (c) {
        //         if (c.workDate <= new Date('0001-01-01 00:00:00')) {
        //             c.workDate = new Date('2001-01-01 00:00:00');
        //         }
        //     });
        // });
        timesheetData.rows = tsRows;

        var data = timesheetData;
        TimeSheet.Save(null, settings.username, data, vm.get('isTimesheetApproval'), function (response, operation, success) {
            if (response && response.success) {
                if (response.message && response.message.mdType && response.message.mdType === 'warning') {
                    Ext.Msg.show({
                        title: 'Warning',
                        scrollable: true,
                        height: 275,
                        message: me.getWarningMessage(response),
                        buttons: Ext.MessageBox.YESNO,
                        buttonText: {
                            yes: 'YES',
                            no: 'NO'
                        },
                        icon: Ext.Msg.INFO,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                TimeSheet.SaveSubmitAfterWarning(null, settings.username, data, false, null, function (response, operation, success) {
                                    TS.Messages.getSimpleAlertMessage('timesheetSaveSuccess');
                                    tsheetStore.load({
                                        callback:  me.onBackBt()
                                    });
                                }, me, {
                                    autoHandle: true
                                });
                            } else {
                                return;
                            }
                        }
                    });
                } else {
                    TS.Messages.getSimpleAlertMessage('timesheetSaveSuccess');
                    tsheetStore.load({
                        callback:  me.onBackBt()
                    });
                }
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error:MsgBox', Ext.JSON.encode(response)); //message attribute is a list of TS.model.shared.Error
            }
        });
    },

    onSubmitTS: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedTS'),
            periodId = selection.get('tsPeriodId'),
            empId = selection.get('empId'),
            settings = TS.app.settings,
            baseView = Ext.first('app-ts'),
            rowData = vm.getStore('tsrow').getRange(),
            sheet,
            tsRows = [],
            hasProject = true;
        //retrieve associative data and place in the array
        for (var i = 0; i < rowData.length; i++) {
            tsRows.push(rowData[i].getData(true));
        }
        //check wbs1 information
        hasProject = me.checkWbs1Information(tsRows);
        // if no wbs1 info stop save/submit
        if (!hasProject) return;

        if (settings.tsReqSubmitSignature) {
            sheet = Ext.create({
                xtype: 'ts-submitpin',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                attType: 'Employee',
                associatedRecordId: periodId,
                attachmentsList: {
                    modelType: 'TS',
                    modelId: periodId,
                    attachmentType: 'E'
                }
            });

            if (localStorage.getItem('integratedLogin') != 'undefined' && JSON.parse(localStorage.getItem('integratedLogin'))) {
                Ext.first('#tsSubmitPinField').setLabel('PIN');
            } else {
                Ext.first('#tsSubmitPinField').setLabel('Password');
            }
            baseView.add(sheet);
            sheet.show();
        } else {
            me.doSubmitTimesheet(bt);
        }
    },

    doSubmitTimesheet: function (bt, attachment) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            timesheet = vm.get('selectedTS'),
            timesheetData = vm.get('selectedTS').getData(true),
            rowData = vm.getStore('tsrow').getRange(),
            tsheetStore = vm.getStore('tsheet'),
            tsasheetStore = vm.getStore('tsasheet'),
            iLen = rowData.length,
            tsRows = [],
            i = 0,
            message,
            signatureAttachment;
        //retrieve associative data and place in the array
        for (; i < iLen; i++) {
            tsRows.push(rowData[i].getData(true));
        }

        Ext.each(tsRows, function (row) {
            Ext.each(row.cells, function (c) {
                c.workDate = TS.common.Util.getOutUTCDate(c.workDate);
                c.startTime = TS.common.Util.getOutUTCDate(new Date());
                c.endTime = TS.common.Util.getOutUTCDate(new Date());
            });

        });
        timesheetData.rows = tsRows;
        // timesheetData.startDate = TS.common.Util.getOutUTCDate(timesheetData.startDate);
        // timesheetData.endDate = TS.common.Util.getOutUTCDate(timesheetData.endDate);
        Ext.Msg.confirm("Please Confirm", "Are you sure you want to submit?", function (btn) {
            if (btn === 'yes') {
                signatureAttachment = attachment != null ? attachment.getData() : null;
                TimeSheet.Submit(null, settings.username, timesheetData, signatureAttachment, function (response, operation, success) {
                    if (response && response.success) {
                        if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                            Ext.Msg.show({
                                title: 'Warning',
                                scrollable: true,
                                height: 275,
                                message: me.getWarningMessage(response),
                                buttons: Ext.MessageBox.YESNO,
                                buttonText: {
                                    yes: 'YES',
                                    no: 'NO'
                                },
                                icon: Ext.Msg.INFO,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        TimeSheet.SaveSubmitAfterWarning(null, settings.username, timesheetData, true, signatureAttachment, function (response, operation, success) {
                                            bt.up('sheet').hide();
                                            TS.Messages.getSimpleAlertMessage('timesheetSubmitSuccess');
                                            tsheetStore.load({
                                                callback:  me.onBackBt()
                                            });
                                        }, me, {
                                            autoHandle: true
                                        });
                                    } else {
                                        return;
                                    }
                                }
                            });
                        } else {
                            if (bt && bt.up('sheet')) {
                                bt.up('sheet').hide();
                            }
                            TS.Messages.getSimpleAlertMessage('timesheetSubmitSuccess');
                            tsheetStore.load({
                                callback:  me.onBackBt()
                            });
                        }

                    } else if (response) {
                        Ext.GlobalEvents.fireEvent('Error:MsgBox', Ext.JSON.encode(response)); // Message attribute is a list of TS.model.shared.Error
                        if (bt.up('ts-submitpin')) {
                            bt.up('ts-submitpin').hide();
                        }
                    }
                });
            }
            //bt.up('ts-submitpin').hide();
        });
    },

    getWarningMessage: function (errorData) {
        var warningMessage;
        if (errorData) {
            if (errorData.message) {
                errorData = errorData.message;
            }
            // Message is object
            if (typeof errorData == 'object' && errorData.mdBody) {
                var message = '',
                    responseArray = '';
                // Decode JSON object
                try {
                    responseArray = JSON.parse(errorData.mdBody);
                    // Concatenate the object's values
                    Ext.Array.each(responseArray, function (response) {
                        message += response.errorValue + '<br>';
                    });
                    // Not a JSON object
                } catch (exception) {
                    message = errorData.mdBody;
                }
                //TODO@Sencha
                warningMessage = message += 'Do you wish to continue?';
                //this.setWarningMessage(message += 'Do you wish to continue?');

                // Message is string
            } else {
                warningMessage = errorData.message;
                // this.setWarningMessage(errorData.message);
            }
        } else {
            warningMessage = 'Unknown Error - Please Contact Support';
            //this.setWarningMessage(typeof errorData == 'string' ? errorData : 'Unknown Error - Please Contact Support');
        }
        return warningMessage;
    },

    onCloseSheet: function (bt) {
        bt.up('sheet').hide();
    },

    tsSubmitPinClick: function (bt) {
        var me = this,
            settings = TS.app.settings,
            //loginType = TS.common.Util.getLoginType() || localStorage.getItem('loginType'),
            pin = me.lookup('tsSubmitPinField').getValue(),
            view = me.getView(),
            button = me.lookup('saveSignatureButton');

        // if (!view.lookup('tsSubmitPinField').getValue()) {
        //     Ext.Msg.alert('Warning', 'PIN and Signature are both required');
        //     button.setDisabled(true);
        //     return;
        // }

        this.doSaveSignature(bt);

        // User.AuthenticatePin(window.userGlobal.dbi, pin, window.userGlobal.username, function (response, operation, success) {
        //     if (response.data) {
        //         //save signature
        //         this.doSaveSignature(bt);
        //     } else {
        //         Ext.GlobalEvents.fireEvent('Message:Code', 'tsSubmitPinBadField');
        //         me.lookup('tsSubmitPinField').setValue('');
        //         me.getView().setLoading(false);
        //     }
        // }, me, {
        //     autoHandle: true
        // });
    },

    doSaveSignature: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            selection = vm.get('selectedTS'),
            periodId = selection.get('tsPeriodId'),
            vw = me.getView(),
            draw = vw.down('ts-draw'),
            imageData = draw.toDataURL(), //get image data
            file = new Blob([imageData], {
                type: 'image/png'
            }),
            data;

        data = {
            type: 'TS',
            location: settings.imageStorageLoc,
            associatedId: periodId,
            attachmentType: 'E',
            fileExt: 'png',
            fileName: 'signature_' + Ext.data.identifier.Uuid.Global.generate(), // TODO - How should this be autogenerated?
            description: settings.tsTitle + ' Approval Signature',
            file: file
        };

        me.convertFileToByteData(data.file, Ext.bind(function (byteData) {
            var attachmentRecord = Ext.create('TS.model.shared.Attachment', {
                owningModelType: data.type,
                owningModelId: data.associatedId + '||' + settings.empId,
                dateAttached: data.date || new Date(),
                attachmentType: data.attachmentType,
                location: data.location,
                extension: data.fileExt,
                filename: data.fileName,
                description: data.description,
                attachmentItem: byteData
            });

            me.doSubmitTimesheet(bt, attachmentRecord);
        }, me));

        //bt.up('sheet').hide();
    },

    convertFileToByteData: function (file, callback) {
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                // Convert to plain array for sending through to Ext.Direct
                var byteArray = new Uint8Array(e.target.result),
                    returnArray = [];
                for (var i = 0; i < byteArray.length; i++) {
                    returnArray[i] = byteArray[i];
                }
                callback(returnArray);
            };
        })(file);
        reader.readAsArrayBuffer(file);
    },

    onCopyTimesheet: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            rowStore = vm.getStore('tsrow'),
            rowData = rowStore.getRange(),
            iLen = rowData.length,
            selection = vm.get('selectedTSCopy'),
            settings = TS.app.settings,
            cells,
            hrsTtl = 0,
            i = 0;

        for (; i < iLen; i++) {
            cells = rowData[i].getData(true);
            Ext.each(cells, function (cell) {
                Ext.each(cell.cells, function (obj) {
                    hrsTtl += obj.regHrs + obj.ovtHrs + obj.ovt2Hrs + obj.travelHrs;
                });
            });
        }

        if (hrsTtl != 0) {
            Ext.Msg.confirm('Warning', 'The current ' + settings.tsTitle + ' will be replaced with the copied data, select “Yes” to proceed.', function (btn) {
                if (btn == 'yes') {
                    me.copyTimesheet(bt);
                }
                bt.up('sheet').hide();
            });
        } else {
            me.copyTimesheet(bt);
        }
    },

    copyTimesheet: function (bt) {
        var vm = this.getViewModel(),
            rowStore = vm.getStore('tsrow'),
            rowData = rowStore.getRange(),
            iLen = rowData.length,
            selection = vm.get('selectedTSCopy'),
            currentSelection = vm.get('selectedTS'),
            settings = TS.app.settings,
            copiedTS,
            copiedTSRow,
            cells,
            hrsTtl = 0,
            i = 0;

        TimeSheet.Copy(null, settings.username, settings.empId, selection.get('startDate'), selection.data, function (response, operation, success) {
            if (response && response.success) {
                copiedTSRow = response.data.rows;
                rowStore.loadData(copiedTSRow);
                // Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetCopySuccess', function () {
                bt.up('sheet').hide();
                // });
            } else {
                Ext.GlobalEvents.fireEvent('Error', response);
                bt.up('sheet').hide();
            }
        });
    },

    onManageEntry: function () {
        var me = this,
            settings = TS.app.settings,
            baseView = Ext.first('app-ts'),
            sheet = Ext.create({
                xtype: 'ts-projects',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                isNewProject: true
            }),
            store = me.getStore('tsrow');

        if (!settings.tsCanEnterCrewMemberTime) {
            Ext.first('#addTimesheetBtn').setHidden(true);
        }

        baseView.add(sheet);
        sheet.show();
    },

    onSelectProject: function (bt) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            projectTree = vw.lookup('project-treelist'),
            selection = projectTree.getViewModel().getData().treelist.selection,
            settings = TS.app.settings,
            currentTsRow = vm.get('currentTSRow'),
            wbsArray;

        if (!selection) {
            Ext.Msg.alert('FYI', 'Please select ' + settings.wbs1Label + ' from list');
            return;
        }
        //set new data in model
        wbsArray = selection.getId().split('^');//array of wbs id's (1,2,3)
        Ext.first('#fwawbs1id').setValue(wbsArray[0]);
        Ext.first('#fwawbs2id').setValue(wbsArray[1] || '');
        Ext.first('#fwawbs3id').setValue(wbsArray[2] || '');

        bt.up('sheet').hide();
    },

    onProjectLookup: function () {
        var baseView = Ext.first('app-ts'),
            sheet = Ext.create({
                xtype: 'ts-projectlookuptree',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                },
                app: 'TS'
            });

        baseView.add(sheet);
        sheet.show();
    },

    onLaborCodeLookup: function () {
        var me = this,
            vm = me.getViewModel(),
            laborCode = vm.get('currentTSRow').get('laborCode'),
            baseView = Ext.first('app-ts'),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'ts-laborcodelookup',
                viewModel: {
                    parent: vm
                },
                app: 'TS'
            }),
            start,
            end,
            gridContainer,
            grid1,
            grid2,
            grid3,
            grid4,
            grid5,
            store1,
            store2,
            store3,
            store4,
            store5,
            lValue1,
            lValue2,
            lValue3,
            lValue4,
            lValue5;

        for (var laborLevel = 1; laborLevel <= settings.tsLcLevels; laborLevel++) {
            this.addLaborCodeGrid(laborLevel, sheet);
        }

        baseView.add(sheet);
        sheet.show();

        gridContainer = Ext.first('#ts-laborCodeGridsContainer');
        for (var level = 0; level < settings.tsLcLevels; level++) {
            switch (level + 1) {
                case 1:
                    start = settings.tsLc1Start - 1;
                    end = settings.tsLc1Len;
                    lValue1 = Ext.util.Format.substr(laborCode, start, end);
                    grid1 = gridContainer.items.items[level];
                    store1 = grid1.getStore();
                    store1.load(function () {
                        grid1.select(store1.findRecord('lcCode', lValue1), true);
                        grid1.scrollToRecord(store1.findRecord('lcCode', lValue1), true);
                    });
                    break;
                case 2:
                    start = settings.tsLc2Start - 1;
                    end = settings.tsLc2Len;
                    lValue2 = Ext.util.Format.substr(laborCode, start, end);
                    grid2 = gridContainer.items.items[level];
                    store2 = grid2.getStore();
                    store2.load(function () {
                        grid2.select(store2.findRecord('lcCode', lValue2), true);
                        grid2.scrollToRecord(store2.findRecord('lcCode', lValue2), true);
                    });
                    break;
                case 3:
                    start = settings.tsLc3Start - 1;
                    end = settings.tsLc3Len;
                    lValue3 = Ext.util.Format.substr(laborCode, start, end);
                    grid3 = gridContainer.items.items[level];
                    store3 = grid3.getStore();
                    store3.load(function () {
                        grid3.select(store3.findRecord('lcCode', lValue3), true);
                        grid3.scrollToRecord(store3.findRecord('lcCode', lValue3), true);
                    });
                    break;
                case 4:
                    start = settings.tsLc4Start - 1;
                    end = settings.tsLc4Len;
                    lValue4 = Ext.util.Format.substr(laborCode, start, end);
                    grid4 = gridContainer.items.items[level];
                    store4 = grid4.getStore();
                    store4.load(function () {
                        grid4.select(store4.findRecord('lcCode', lValue4), true);
                        grid4.scrollToRecord(store4.findRecord('lcCode', lValue4), true);
                    });
                    break;
                case 5:
                    start = settings.tsLc5Start - 1;
                    end = settings.tsLc5Len;
                    lValue5 = Ext.util.Format.substr(laborCode, start, end);
                    grid5 = gridContainer.items.items[level];
                    store5 = grid5.getStore();
                    store5.load(function () {
                        grid5.select(store5.findRecord('lcCode', lValue5), true);
                        grid5.scrollToRecord(store5.findRecord('lcCode', lValue5), true);
                    });
                    break;
            }
        }

    },

    addLaborCodeGrid: function (laborLevel, sheet) {
        // Create a new grid component for the given laborLevel
        var laborGrid = Ext.create({xtype: 'grid-tslaborcode'});

        laborGrid.setStore(Ext.create('Ext.data.Store', {
            model: 'TS.model.ts.LaborCode',
            autoLoad: true,
            remoteFilter: false,
            filters: {
                property: 'lcLevel',
                value: laborLevel
            }
        }));

        sheet.items.items[2].add(laborGrid);
    },

    selectLaborCode: function (el, record, index, eOpts) {
        var viewModel = this.getViewModel(),
            settings = TS.app.settings,
            // Labor Code Level of this record
            level = record.get('lcLevel'),
            // If no laborCodes/laborLabels set, init a new array
            laborCodes = (viewModel.get('laborCodes') || []),
            laborLabels = (viewModel.get('laborLabels') || []);

        // Update the arrays of selected items on the viewModel
        laborCodes[level] = record.get('lcCode');
        laborLabels[level] = record.get('lcLabel');

        viewModel.set('laborCodes', laborCodes);
        viewModel.set('laborLabels', laborLabels);

        // For displaying on the view, we need to remove null values,
        // then collapse the arrays into strings using the delimiter setting.
        viewModel.set('laborCodeString', laborCodes.filter(function (e) {
            return e
        }).join(settings.tsLcDelimiter));
        viewModel.set('laborLabelString', laborLabels.filter(function (e) {
            return e
        }).join(' / '));
    },

    onSelectLaborCode: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            vw = me.getView(),
            laborCodeString = vm.get('laborCodeString'),
            laborCode = Ext.first('#fwalaborcode');

        if (!laborCodeString || laborCodeString == '') {
            Ext.Msg.alert('FYI', 'Please select ' + settings.laborCodeLabel + ' from list');
            return;
        }
        laborCode.setValue(laborCodeString);
        vm.set('laborCodeString', '');
        vm.set('laborLabelString', '');

        bt.up('sheet').hide();
    },

    adjustTotalHours: function (store) {
        var data = store.getRange(),
            settings = TS.app.settings,
            empId = settings.empId,
            vm = this.getViewModel(),
            len = data.length,
            hours = 0,
            i = 0,
            n = 0,
            reg = 0,
            ovt = 0,
            ovt2 = 0,
            travel = 0,
            cells,
            day;

        store.each(function (rec, id) {
            if (!rec.get('wbs1')) { //|| !rec.get('status')
                store.remove(rec);
            }
        });

        if (store.getRange().length == 0) {
            Ext.Msg.alert('FYI', 'No ' + settings.tsTitle + ' entries for selected period.');
        }

        for (; i < len; i++) {
            //we only total hours for the logged in employee
            if (data[i].data.empId == empId) {
                cells = data[i].cells().getRange();

                for (n = 0; n < cells.length; n++) {
                    day = cells[n];
                    hours += day.get('regHrs');
                    reg += day.get('regHrs');
                    ovt += day.get('ovtHrs');
                    ovt2 += day.get('ovt2Hrs');
                    travel += day.get('travelHrs');
                    //check user configurations
                    if (settings.tsAllowOvtHrs) hours += day.get('ovtHrs');
                    if (settings.tsAllowOvt2Hrs) hours += day.get('ovt2Hrs');
                    if (settings.tsAllowTravelHrs) hours += day.get('travelHrs');

                }
            }
        }

        vm.set('totalHours', hours);
        vm.set('totalRegHours', reg);
        vm.set('totalOvtHours', ovt);
        vm.set('totalOvt2Hours', ovt2);
        vm.set('totalTravelHours', travel);
    },

    onAddTimesheet: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            list = bt.up('ts-projects').down('#ts-projectlist'),
            settings = TS.app.settings,
            emp = Ext.getStore('TsEmployees').getById(settings.empId),
            record = vm.get('selectedProject'),
            tsrow = vm.get('tsrow'),
            currentRow, newRecord, index, data, rowData, empData;

        //Find original baseline record index in tsrow store based on 'seq'
        index = tsrow.findExact('seq', record.get('seq'));

        //Get correct record based on index
        currentRow = tsrow.getAt(index);
        rowData = currentRow.getData();
        empData = emp.getData();

        //Create initial data for new record we will be inserting
        data = {
            empId: empData.empId,
            empName: empData.empName,
            laborCode: empData.tsDefLaborCode,
            billCategory: empData.tsDefBillCategory,
            crewRoleId: empData.defaultCrewRoleId,
            chargeType: rowData.chargeType,
            clientId: rowData.clientId,
            clientName: rowData.clientName,
            wbs1: rowData.wbs1,
            wbs2: rowData.wbs2,
            wbs3: rowData.wbs3,
            wbs1Name: rowData.wbs1Name,
            wbs2Name: rowData.wbs2Name,
            wbs3Name: rowData.wbs3Name,
            isNewRecord: true // used to lock/unlock employee list
        };
        // Create new record with associations (need for cells)
        newRecord = TS.model.ts.TsRow.createWithAssociations(data);
        //Add new row to timesheet
        tsrow.add(newRecord);
        list.setSelection(null); //clear selection
        bt.up('sheet').hide();

    },

    onAddNewProject: function () {
        var d = Ext.Date,
            settings = TS.app.settings,
            vm = this.getViewModel(),
            ts = Ext.first('ts-timesheet'),
            newRecord = Ext.create('TS.model.ts.TsRow'),
            emp = Ext.getStore('TsEmployees').getById(settings.empId),
            store = vm.getStore('tsrow'),
            cDate = vm.get('startDate'),
            days = vm.get('dayCount'),
            arr = [],
            placeholderRec,
            dateString,
            i = 0,
            tab;
        //set defaults for new record
        newRecord.set('empId', emp.get('empId'));
        newRecord.set('empName', emp.get('empName'));
        newRecord.set('laborCode', emp.get('tsDefLaborCode'));
        newRecord.set('billCategory', emp.get('tsDefBillCategory'));
        newRecord.set('crewRoleId', emp.get('defaultCrewRoleId'));
        // newRecord.set('cells', []);
        //create empty cells
        for (; i < days; i++) {
            dateString = new Date(cDate).toISOString();
            placeholderRec = Ext.create('TS.model.ts.TsCell', {
                workDate: dateString,
                regHrs: 0,
                ovtHrs: 0,
                ovt2Hrs: 0,
                travelHrs: 0,
                comment: '',
                fwaId: '',
                fwaNum: '',
                startTime: dateString,
                endTime: dateString
            });
            //grab just data so no constructor brackets
            arr.push(placeholderRec.data);
            cDate = d.add(cDate, d.DAY, 1);
        }
        newRecord.set('cells', arr);

        Ext.first('ts-projects').down().setActiveItem(1); // move to second tab
        //set title
        tab = Ext.first('ts-projects').down().getActiveItem();
        tab.down('titlebar[docked=top]').setTitle('Add ' + settings.wbs1Label);
        //add new timesheet project to viewmodel
        vm.set('currentTSRow', newRecord);
        //once done we have to add it to the list on tab0 so user can select it.
        store.add(newRecord);
        ts.down('list').refresh();
    },

    onEditProjectTap: function (list, index, target, record) {
        this.onEditProject(list, record);
    },

    onEditProject: function (list, record) {
        var settings = TS.app.settings,
            vm = this.getViewModel(),
            tsrow = vm.get('tsrow'),
            tab,
            index;
        // Because there might be multiple rows matching the same project we have to be careful
        // Here we set currentTSRow to tsrow record that is matching id of project (seq) SEQ IS NOT THE PROJECT ID IT IS ONLY THE ORDER FOR DISPLAY ,
        // Important: After any edits, we have to reload the tsrow so all relevant records are updated in views and bounds
        index = tsrow.findExact('seq', record.get('seq'));
        //tell what we will be editing
        vm.set('currentTSRow', tsrow.getAt(index));
        vm.set('projectId', tsrow.getAt(index).get('projectId'));

        Ext.first('ts-projects').down().setActiveItem(1); // move to second tab
        //set title
        tab = Ext.first('ts-projects').down().getActiveItem();
        tab.down('titlebar[docked=top]').setTitle('Edit ' + settings.wbs1Label);
    },

    onProjectSave: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            ts = Ext.first('ts-timesheet'),
            tsplist = Ext.first('#ts-projectlist'),
            tsrow = vm.getStore('tsrow').getRange(),
            rowStore = vm.getStore('tsrow'),
            currentTsRow = vm.get('currentTSRow'),
            projectId = vm.get('projectId'),
            settings = TS.app.settings,
            i = 0,
            wbs1 = Ext.first('#fwawbs1id'),
            wbs1Selection = wbs1.getSelection(),
            wbs2 = Ext.first('#fwawbs2id'),
            wbs3 = Ext.first('#fwawbs3id');

        if (!wbs1.getValue()) {
            Ext.Msg.alert('Warning', 'Missing required ' + settings.wbs1Label + ' information');
            return;
        }

        if (wbs2 && wbs2.getStore().getData().length > 0) {
            if (!wbs2.getValue()) {
                Ext.Msg.alert('Warning', 'Missing required ' + settings.wbs2Label + ' information');
                return;
            }
        }

        if (wbs3 && wbs3.getStore().getData().length > 0) {
            if (!wbs3.getValue()) {
                Ext.Msg.alert('Warning', 'Missing required ' + settings.wbs3Label + ' information');
                return;
            }
        }

        currentTsRow.set('wbs1Name', Ext.first('#fwawbs1name').getHtml());
        currentTsRow.set('wbs2Name', Ext.first('#fwawbs2name').getHtml());
        currentTsRow.set('wbs3Name', Ext.first('#fwawbs3name').getHtml());
        currentTsRow.set('clientId', wbs1Selection.get('clientId'));
        currentTsRow.set('clientName', wbs1Selection.get('clientName'));

        if (currentTsRow.dirty) {
            for (; i < tsrow.length; i++) {
                if (tsrow[i].get('projectId') === projectId) {
                    tsrow[i].set('wbs1', currentTsRow.get('wbs1'));
                    tsrow[i].set('wbs2', currentTsRow.get('wbs2'));
                    tsrow[i].set('wbs3', currentTsRow.get('wbs3'));
                    tsrow[i].set('wbs1Name', currentTsRow.get('wbs1Name'));
                    tsrow[i].set('wbs2Name', currentTsRow.get('wbs2Name'));
                    tsrow[i].set('wbs3Name', currentTsRow.get('wbs3Name'));
                    tsrow[i].set('laborCode', currentTsRow.get('laborCode'));
                    tsrow[i].set('billCategory', currentTsRow.get('billCategory'));
                    tsrow[i].set('clientId', currentTsRow.get('clientId'));
                    tsrow[i].set('clientName', currentTsRow.get('clientName'));
                }
            }
            //refresh list to reflect project changes and grouping
            ts.down('list').refresh(); //<- doesn't happen automatically
        }
        bt.up('sheet').hide();
        me.getView().setActiveItem(1);
    },

    onProjectCancel: function (list, record) {
        var me = this,
            vm = me.getViewModel(),
            currentRow = vm.get('currentTSRow'),
            store = vm.getStore('tsrow');

        //reset values on a cancel/back
        if (currentRow.dirty) {
            currentRow.set('wbs1', currentRow.getModified('wbs1') || currentRow.get('wbs1'));
            currentRow.set('wbs2', currentRow.getModified('wbs2') || currentRow.get('wbs2'));
            currentRow.set('wbs3', currentRow.getModified('wbs3') || currentRow.get('wbs3'));
            currentRow.set('billcategory', currentRow.getModified('billcategory') || currentRow.get('billcategory'));
            currentRow.set('laborCode', currentRow.getModified('laborCode') || currentRow.get('laborCode'));
            if (currentRow.phantom) store.remove(currentRow);
        }
        Ext.first('ts-projects').down().setActiveItem(0); // move back to first tab tab
    },

    showFwa: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            workDate = vm.get('selectedDay'),
            baseView = Ext.first('app-ts'),
            fwaId = workDate.get('fwaId'),
            settings = TS.app.settings,
            store = vm.getStore('timesheetfwa'),
            sheet = Ext.create({
                xtype: 'fwa-view',
                //Fuse view models
                viewModel: {
                    parent: vm,
                    isFromTS: true
                }
            }),
            attachments;

        store.getProxy().setExtraParams({
            username: settings.username,
            id: fwaId,
            fwaDate: Ext.Date.format(workDate.get('schedStartDate'), 'Ymd')
        });

        store.load({
            callback: me.loadFwaViewSheet,
            scope: me
        });

        baseView.add(sheet);
        sheet.down('titlebar[docked=top]').setTitle(settings.fwaAbbrevLabel + ' for ' + settings.tsTitle);
        Ext.first('#fwaOpenButton').setHidden(true);
        Ext.first('#fwaCopyButton').setHidden(true);

        sheet.show();
        //clientApprovalButton
        // sheet.getViewModel().getView().getItems().items[5].setTitle(settings.clientLabel + ' Signature');
        // sheet.getViewModel().getView().getItems().items[6].setTitle(settings.crewChiefLabel + ' Signature');
    },

    loadFwaViewSheet: function (results, operation, success) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            data = results[0],
            attachments = data.get('attachments');
        vm.set('selectedFWA', data);
        vm.set('attachments', attachments);
        if (attachments || data.get('clientApprovalImage') || data.get('chiefApprovalImage')) {
            var clientApproval = data.get('attachments').filter(function (data) {
                    return data.attachmentType == 'S' && data.owningModelType == 'Fwa';
                }),
                chiefApproval = data.get('attachments').filter(function (data) {
                    return data.attachmentType == 'E' && data.owningModelType == 'Fwa';
                }),
                clientSignatureCount = 0,
                chiefSignatureCount = 0,
                clientApprovalDate,
                clientApprovalImage,
                chiefApprovalDate,
                chiefApprovalImage;

            Ext.each(data.get('attachments'), function (data) {
                if (data.attachmentType == 'S' && data.owningModelType == 'Fwa') {
                    clientSignatureCount++;
                }
                if (data.attachmentType == 'E' && data.owningModelType == 'Fwa') {
                    chiefSignatureCount++;
                }
            });

            if (Ext.Date.format(vm.get('selectedFWA').get('udf_d1'), DATE_FORMAT) < '01/01/2002')
                vm.get('selectedFWA').set('udf_d1', '');
            if (Ext.Date.format(vm.get('selectedFWA').get('udf_d2'), DATE_FORMAT) < '01/01/2002')
                vm.get('selectedFWA').set('udf_d2', '');
            if (Ext.Date.format(vm.get('selectedFWA').get('udf_d3'), DATE_FORMAT) < '01/01/2002')
                vm.get('selectedFWA').set('udf_d3', '');

            //show-hide view all, size segmented button
            // //client approval
            Ext.first('#viewAllClientSignatureButton').setHidden(true);//clientSignatureCount <= 1
            //chief approval
            Ext.first('#viewAllChiefSignatureButton').setHidden(true);//chiefSignatureCount <= 1

            if (!data.get('clientApprovalImage')) {
                if (clientApproval && clientApproval.length > 0) {
                    clientApprovalDate = clientApproval[0].dateAttached;
                    Ext.first('#clientApprovalDate').setValue(Ext.Date.format(new Date(clientApprovalDate), DATE_FORMAT +' h:i A'));
                    Ext.first('#clientApprovalImage').setSrc('data:application/octet-stream;base64,' + clientApproval[0].attachmentItem);
                }
            }

            if (!data.get('chiefApprovalImage')) {
                if (chiefApproval && chiefApproval.length > 0) {
                    chiefApprovalDate = chiefApproval[0].dateAttached;
                    Ext.first('#chiefApprovalDate').setValue(Ext.Date.format(new Date(chiefApprovalDate), DATE_FORMAT +' h:i A'));
                    Ext.first('#chiefApprovalImage').setSrc('data:application/octet-stream;base64,' + chiefApproval[0].attachmentItem);
                }
            }
        }

        me.onGetFwaDropdownValuesByWbs();
    },

    onGetFwaDropdownValuesByWbs: function () {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            vw = me.getView(),
            selection = vm.get('selectedFWA'),
            wbs1 = selection && selection.get('wbs1') ? selection.get('wbs1') : vw.lookup('wbs1combo') && vw.lookup('wbs1combo').getSelection() ? vw.lookup('wbs1combo').getSelection().get('id') : '^',
            wbs2 = selection && selection.get('wbs2') ? selection.get('wbs2') : vw.lookup('wbs2combo') && vw.lookup('wbs2combo').getSelection() ? vw.lookup('wbs2combo').getSelection().get('id') : '^',
            wbs3 = selection && selection.get('wbs3') ? selection.get('wbs3') : vw.lookup('wbs3combo') && vw.lookup('wbs3combo').getSelection() ? vw.lookup('wbs3combo').getSelection().get('id') : '^';
        if (!selection) return;
        Fwa.GetFwaDropdownValuesByWbs(null, settings.username, selection.get('fwaId'), wbs1, wbs2, wbs3, function (response) {
            if (response && response.success) {
                //display warning message and continue
                if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                    Ext.Msg.alert('Warning', response.message.mdBody);
                }
                if (response.data != '') {
                    var lists = response.data,
                        vw = me.getView(),
                        vm = me.getViewModel();
                    Ext.each(lists, function (list) {
                        var data = [],
                            currentValue = selection.get(list.udfId),
                            comboBox = vw.lookup(list.udfId + '_combo'),
                            store = Ext.create('Ext.data.Store', {
                                fields: ['key', 'value']
                            });
                        //data.push({key: '0', value: ''});
                        Ext.each(list.valuesAndTexts, function (value) {
                            var item = {
                                key: value.Key,
                                value: value.Value
                            };
                            data.push(item);
                        })
                        store.setData(data);
                        if (vw.lookup(list.udfId + '_text'))
                            vw.lookup(list.udfId + '_text').setHidden(true);
                        if (comboBox) {
                            comboBox.setHidden(false);
                            comboBox.setStore(store);
                            if (currentValue != '' && currentValue != null) {
                                comboBox.setValue(currentValue);
                            } else {
                                comboBox.setValue('');
                            }
                            me.setIsComboValue(list.udfId)
                        }
                    });
                }
            } else if (!response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }.bind(me));
    },

    setIsComboValue: function (udfId) {
        var settings = TS.app.settings;
        if (udfId == 'udf_a1') {
            settings.udf_a1_isCombo = true;
        } else if (udfId == 'udf_a2') {
            settings.udf_a2_isCombo = true;
        } else if (udfId == 'udf_a3') {
            settings.udf_a3_isCombo = true;
        } else if (udfId == 'udf_a4') {
            settings.udf_a4_isCombo = true;
        } else if (udfId == 'udf_a5') {
            settings.udf_a5_isCombo = true;
        } else if (udfId == 'udf_a6') {
            settings.udf_a6_isCombo = true;
        } else if (udfId == 'udf_t1') {
            settings.udf_t1_isCombo = true;
        } else if (udfId == 'udf_t2') {
            settings.udf_t2_isCombo = true;
        } else if (udfId == 'udf_t3') {
            settings.udf_t3_isCombo = true;
        } else if (udfId == 'udf_t4') {
            settings.udf_t4_isCombo = true;
        } else if (udfId == 'udf_t5') {
            settings.udf_t5_isCombo = true;
        } else if (udfId == 'udf_t6') {
            settings.udf_t6_isCombo = true;
        } else if (udfId == 'udf_t7') {
            settings.udf_t7_isCombo = true;
        } else if (udfId == 'udf_t8') {
            settings.udf_t8_isCombo = true;
        } else if (udfId == 'udf_t9') {
            settings.udf_t9_isCombo = true;
        } else if (udfId == 'udf_t10') {
            settings.udf_t10_isCombo = true;
        }
    },

    viewAllClientSignatures: function () {
        var me = this,
            vm = me.getViewModel(),
            signaturelist = vm.getStore('signaturelist'),
            settings = TS.app.settings,
            arr = [],
            placeholderRec,
            sheet,
            signatureWindow;

        Ext.each(vm.get('attachments'), function (signature) {
            if (signature.attachmentType == AttachmentType.ClientSignature && signature.owningModelType == 'Fwa') {
                placeholderRec = Ext.create('TS.model.shared.Attachment', {
                    attachmentId: signature.attachmentId,
                    dateAttached: signature.dateAttached,
                    attachmentItem: 'data:application/octet-stream;base64,' + signature.attachmentItem,
                    attachedByEmpId: signature.attachedByEmpId
                });
                arr.push(placeholderRec);
            }
        });

        signaturelist.setRemoteSort(false);
        signaturelist.loadRawData(arr);
        sheet = Ext.create({
            xtype: 'fwa-signaturelist',
            //Fuse view models
            viewModel: {
                parent: vm
            }
        });
        sheet.lookup('signatureListTitle').setTitle(settings.clientLabel + ' Signature List');
        signaturelist.sort('dateAttached', 'DESC');
        Ext.Viewport.add(sheet);
        sheet.show();
    },


    viewAllChiefSignatures: function () {
        var me = this,
            vm = me.getViewModel(),
            signaturelist = vm.getStore('signaturelist'),
            settings = TS.app.settings,
            arr = [],
            placeholderRec,
            sheet,
            signatureWindow;

        Ext.each(vm.get('attachments'), function (signature) {
            if (signature.attachmentType == AttachmentType.EmpSignature && signature.owningModelType == 'Fwa') {
                placeholderRec = Ext.create('TS.model.shared.Attachment', {
                    attachmentId: signature.attachmentId,
                    dateAttached: signature.dateAttached,
                    attachmentItem: 'data:application/octet-stream;base64,' + signature.attachmentItem,
                    attachedByEmpId: signature.attachedByEmpId
                });
                arr.push(placeholderRec);
            }
        });

        signaturelist.setRemoteSort(false);
        signaturelist.loadRawData(arr);
        sheet = Ext.create({
            xtype: 'fwa-signaturelist',
            //Fuse view models
            viewModel: {
                parent: vm
            }
        });
        sheet.lookup('signatureListTitle').setTitle(settings.crewChiefLabel + ' Signature List');
        signaturelist.sort('dateAttached', 'DESC');
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onManageNotesTap: function () {
        var me = this,
            baseView = Ext.first('app-ts'),
            sheet = Ext.create({
                xtype: 'ts-fwanotes',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                }
            });

        baseView.add(sheet);
        sheet.show();
    },

    onManageNotesTapView: function () {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('fwa'),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'ts-fwanotes',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                }
            });

        Ext.each(fwa.notes().getRange(), function (note) {
            note.set('canEdit', note.get('empId') == settings.empId);
        });

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onManageWorkCodesTapView: function () {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            baseView = Ext.first('app-ts'),
            sheet = Ext.create({
                xtype: 'ts-fwaworkcodes',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                }
            });

        vm.set('fwa', fwa);
        // baseView.add(sheet);
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onManageUnitsTapView: function () {
        var me = this,
            baseView = Ext.first('app-ts'),
            sheet = Ext.create({
                xtype: 'ts-fwaunits',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                }
            });

        baseView.add(sheet);
        sheet.show();
    },

    onManageHoursTapView: function () {
        var me = this,
            baseView = Ext.first('app-ts'),
            sheet = Ext.create({
                xtype: 'ts-fwahours',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                }
            });

        baseView.add(sheet);
        sheet.show();
    },

    onBeforeHoursBack: function () {
        var me = this,
            ts = Ext.first('ts-timesheet'),
            vm = me.getViewModel(),
            hours = vm.getStore('hoursview'),
            tsrow = vm.getStore('tsrow'),
            cells = tsrow.getById(vm.get('currentTSRow').id).cells(),
            data = hours.getRange(),
            i = 0,
            index,
            len = data.length,
            cData, n, nLen, clone;
        // Reassemble the data back in to original store so the data can be properly saved

        for (; i < len; i++) {
            cData = data[i];
            index = -1;
            //if data for particular cell is modified
            if (cData.dirty) {
                // find the origin
                clone = Ext.clone(cData.data);
                clone.id = '';
                nLen = cells.getRange().length;

                for (n = 0; n < nLen; n++) {
                    if (new Date(cells.getAt(n).get('workDate')).getUTCDate() === new Date(cData.get('workDate')).getUTCDate()) {
                        index = n;
                        break;
                    }
                }

                if (index > -1) {
                    //existing record - let's merge
                    cells.getAt(index).set(cData.getData());

                } else {
                    //no data found, add record
                    cells.add(Ext.create('TS.model.ts.TsCell', clone));
                }
            }
        }

        me.onBackBt();
        vm.notify(); // Flush bindings
        //refresh list and any other calculated visuals
        ts.down('list').deselect(vm.get('currentTSRow'), true);
        ts.down('list').refresh();
        me.adjustTotalHours(tsrow);
    },

    onBeforeEditHoursBack: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            selectedDay = vm.get('selectedDay'),
            newReg = selectedDay.get('regHrs'),
            newOvt = selectedDay.get('ovtHrs'),
            newOvt2 = selectedDay.get('ovt2Hrs'),
            newTravel = selectedDay.get('travelHrs'),
            newComment = selectedDay.get('comment'),
            reg = vm.get('regHrsCopy'),
            ovt = vm.get('ovtHrsCopy'),
            ovt2 = vm.get('ovt2HrsCopy'),
            travel = vm.get('travelHrsCopy'),
            comment = vm.get('commentCopy'),
            hoursList = Ext.first('ts-hours').down('list');

        if (reg != newReg || ovt != newOvt || ovt2 != newOvt2 || travel != newTravel || comment != newComment) {
            //reset values to original
            selectedDay.set('comment', comment);
            selectedDay.set('ovt2Hrs', ovt2);
            selectedDay.set('ovtHrs', ovt);
            selectedDay.set('regHrs', reg);
            selectedDay.set('travelHrs', travel);
        }

        hoursList.deselect(selectedDay, true);
        me.calculatePeriodTtlHrs();
        selectedDay.dirty = false;
        me.onBackBt();
    },

    onEditHoursSave: function () {
        var me = this,
            vm = me.getViewModel(),
            ts = Ext.first('ts-timesheet'),
            settings = TS.app.settings,
            selectedDay = vm.get('selectedDay'),
            workDate = selectedDay.get('workDate'),
            //format string as date value
            fDate = Ext.Date.format(new Date(workDate), DATE_FORMAT),// Ext.Date.format(TS.common.Util.getOutUTCDate(workDate), DATE_FORMAT),
            newReg = selectedDay.get('regHrs'),
            newOvt = selectedDay.get('ovtHrs'),
            newOvt2 = selectedDay.get('ovt2Hrs'),
            newTravel = selectedDay.get('travelHrs'),
            newComment = selectedDay.get('comment'),
            reg = vm.get('regHrsCopy'),
            ovt = vm.get('ovtHrsCopy'),
            ovt2 = vm.get('ovt2HrsCopy'),
            travel = vm.get('travelHrsCopy'),
            comment = vm.get('commentCopy'),
            hoursList = Ext.first('ts-hours').down('list');

        if (reg != newReg || ovt != newOvt || ovt2 != newOvt2 || travel != newTravel || comment != newComment) {
            selectedDay.dirty = true;
        }
        //refresh list and any other calculated visuals
        selectedDay.set('workDate', fDate);
        hoursList.deselect(selectedDay, true);
        ts.down('list').refresh();

        me.calculatePeriodTtlHrs();
        me.onBackBt();
    },

    calculatePeriodTtlHrs: function () {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            hours = vm.get('hoursview').getRange(),
            timePeriodTtl = 0,
            timePeriodRegTtl = 0,
            timePeriodOvtTtl = 0,
            timePeriodOvt2Ttl = 0,
            timePeriodTravelTtl = 0,
            i = 0;

        for (; i < hours.length; i++) {
            timePeriodTtl += hours[i].get('regHrs');
            timePeriodRegTtl += hours[i].get('regHrs');
            //check user configurations
            if (settings.tsAllowOvtHrs) {
                timePeriodTtl += hours[i].get('ovtHrs');
                timePeriodOvtTtl += hours[i].get('ovtHrs');
            }
            if (settings.tsAllowOvt2Hrs) {
                timePeriodTtl += hours[i].get('ovt2Hrs');
                timePeriodOvt2Ttl += hours[i].get('ovt2Hrs');
            }
            if (settings.tsAllowTravelHrs) {
                timePeriodTtl += hours[i].get('travelHrs');
                timePeriodTravelTtl += hours[i].get('travelHrs');
            }
        }

        vm.set('periodTtlHrs', timePeriodTtl);
        vm.set('periodTtlRegHrs', timePeriodRegTtl);
        vm.set('periodTtlOvtHrs', timePeriodOvtTtl);
        vm.set('periodTtlOvt2Hrs', timePeriodOvt2Ttl);
        vm.set('periodTtlTravelHrs', timePeriodTravelTtl);
    },

    onProjectSearchChange: function (field, newVal) {
        var tree = field.up('tree-list') || field.up(''),
            vm = tree.getViewModel(),
            store = vm.getStore('navItems');
        if (newVal === '') {
            store.clearFilter();
        } else {
            //store.filter('text', newVal);
            store.filterBy(function (rec) {
                if (rec.get('model') == 'Wbs2' || rec.get('model') == 'Wbs3') return true;
                if (rec.get('text').match(newVal) || rec.get('id').match(newVal)) {
                    return true;
                }
            })
        }
    },

    setCrewRole: function (combo, newValue, oldValue, eOpts) {
        var crewRole = Ext.first('#hoursCrewRole'),
            employee = newValue ? Ext.getStore('TsEmployees').getById(newValue.id) : null;
        if (employee) {
            crewRole.setValue(Ext.getStore('Roles').getById(employee.get('defaultCrewRoleId')));
        }
    },

    /**
     * @param {Ext.field.Text} component
     * @param {Number} newValue
     * @param {Number} oldValue
     */
    onTsHoursChange: function (component, newValue, oldValue) {
        if (!newValue) {
            newValue = 0;
        }
    },

    /**
     * @param {Ext.field.Text} component
     * @param {Ext.field.Input} input
     * @param {Ext.event.Event} e
     */
    onClearIconTap: function (component, input, e) {
        component.setValue(0);
    },

    onSearchButtonClick: function (field) {
        var tree = field.up('tree-list'),
            vm = tree.getViewModel(),
            store = vm.getStore('navItems'),
            newVal = Ext.first('#searchField').getValue() ? Ext.first('#searchField').getValue() : '';

        if (newVal === '') {
            store.clearFilter();
        } else {
            store.clearFilter();
            store.filterBy(function (rec) {
                if (rec.get('model') == 'Wbs2' || rec.get('model') == 'Wbs3') return true;
                if (rec.get('text').toLowerCase().match(newVal.toLowerCase()) || rec.get('id').toLowerCase().match(newVal.toLowerCase())) {
                    return true;
                }
            })
        }
    },

    onCheckHoliday: function (obj) {
        var workDate = obj.getParent().component.innerItems[4].getValue(),
            isHoliday = 0;
        isHoliday = Ext.getStore('HolidaySchedule').findBy(function (rec) {
            if (Ext.Date.format(new Date(rec.get('holidayDate')), DATE_FORMAT) == Ext.Date.format(new Date(workDate), DATE_FORMAT)) {
                return rec;
            }
        });

        if (isHoliday > -1) {
            obj.setCls = 'holiday';
        }
    },


    getStartEndTimes: function (obj, event) {
        var me = this,
            vm = me.getViewModel(),
            startEndTimes = vm.get('selectedTS').get('startEndTimes') || [],
            empId = vm.get('selectedTS').get('tsEmpId'),
            startDate = vm.get('selectedTS').get('startDate'),
            endDate = vm.get('selectedTS').get('endDate'),
            dayCount = Ext.Date.diff(startDate, endDate, Ext.Date.DAY) + 1,
            userName = vm.get('selectedTS').get('tsEmpName'),
            selectedDate = obj.selectedDate,

            timeObject = Ext.Array.findBy(startEndTimes, function (item) {
                if (Ext.Date.format(new Date(item.workDate), DATE_FORMAT) === Ext.Date.format(new Date(selectedDate), DATE_FORMAT))
                    return true;
            });

        Ext.first('#userNameLabel').setHtml(userName);
        Ext.first('#workDateLabel').setHtml(Ext.Date.format(timeObject.workDate, DATE_FORMAT));
        Ext.first('#startTimeField').setValue(startEndTimes[0].startTime);
        Ext.first('#endTimeField').setValue(startEndTimes[0].endTime);
    }

});
