Ext.define('TS.controller.fwa.EmployeeHoursController', {
    extend: 'TS.common.grid.BaseGridController',
    alias: 'controller.grid-employeehours',

    requires: [
        'TS.Messages'
    ],

    init: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = me.getStore();
    },

    onNewEmployeeHours: function () {
        var me = this,
            settings = TS.app.settings,
            addEmployeeWindow,
            dateHeader = Ext.first('#dateHeader');

        if (me.addEmployeeWindow) {
            me.addEmployeeWindow.close();
        }

        addEmployeeWindow = Ext.create('TS.view.fwa.AddEmployeeHours', {});
        Ext.first('#employeeDate').setValue(new Date(dateHeader.getValue()));
        Ext.first('#empGroupSelection').setValue(settings.empGroupId);
        addEmployeeWindow.show();
    },

    saveNewEmployee: function () {
        var me = this,
            vw = me.getView(),
            form = Ext.first('#fwaForm').getForm(),
            rec = form.getRecord(),
            empFormValues = vw.lookup('addEmployeeHoursForm').getForm().getValues(),
            grid = Ext.first('#empHoursGrid'),
            store = grid.getStore(),
            model = store.model,
            lastItem = store.last(),
            lastDt = Ext.first('#fwaForm').lookup('dateHeader').getValue(),
            rowAdd = 0,
            datesInRange = rec.get('recurrenceDatesInRange'),
            hasNewDate = false,
            utcDate,
            currentIndex = 0,
            workDate = Ext.Date.format(new Date(empFormValues.workDate), 'Y-m-d');

        if (!empFormValues.workDate ||
            !empFormValues.empGroupId ||
            !empFormValues.employeeId ||
            !empFormValues.crewRoleId ||
            !empFormValues.workCodeAbbrev) {
            Ext.Msg.alert('Warning', 'A Work Date, Employee Group, Employee, Crew role, Labor Code, and ' + TS.app.settings.workCodeLabel + ' are required to be selected. Either select or click Cancel to continue');
            return;
        }

        if (!datesInRange) datesInRange = [];
        Ext.each(datesInRange, function (dt) {
            if (dt == workDate + 'T00:00:00') {
                hasNewDate = true;
                return false;
            }
        });

        //if does not exists - add to dateRange
        if (!hasNewDate) {
            datesInRange.push(workDate + 'T00:00:00');
        }
        store.clearFilter(true);
        store.setRemoteSort(false);
        store.getSorters().removeAll();
        store.add(new model({
            isChief: empFormValues.crewRoleId ? Ext.getStore('Roles').getById(empFormValues.crewRoleId).get('crewRoleIsChief') : false,
            workDate: new Date(empFormValues.workDate),
            empId: empFormValues.employeeId,
            crewRoleId: empFormValues.crewRoleId,
            workCodeId: '',
            workCodeAbbrev: empFormValues.workCodeAbbrev,
            ovt2Hrs: 0,
            ovtHrs: 0,
            regHrs: 0,
            travelHrs: 0,
            modified: 'A',
            laborCode: empFormValues.laborCode
        }));
        store.commitChanges();
        store.filterBy(function (rec) {
            return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(empFormValues.workDate), DATE_FORMAT);
        });
        store.setRemoteSort(true);

        Ext.first('#dateHeader').setValue(Ext.Date.format(new Date(empFormValues.workDate), DATE_FORMAT));
        //turn on/off last & next buttons
        if (datesInRange && datesInRange.length > 0) {
            if (datesInRange.length == 1) {
                Ext.first('#lastDate').setDisabled(true);
                Ext.first('#nextDate').setDisabled(true);
            } else {
                datesInRange = datesInRange.sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                    var matches = (utcDate == Ext.first('#dateHeader').getValue());
                    if (matches && currentIndex == 1) {
                        Ext.first('#lastDate').setDisabled(true);
                        Ext.first('#nextDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == datesInRange.length) {
                        Ext.first('#nextDate').setDisabled(true);
                        Ext.first('#lastDate').setDisabled(false);
                        return false;
                    }
                });
            }
        } else {
            Ext.first('#lastDate').setDisabled(true);
            Ext.first('#nextDate').setDisabled(true);
        }

        form.dirty = true;
        vw.close();
    },

    cancelNewEmployee: function () {
        var grid = Ext.first('#empHoursGrid'),
            store = grid.getStore();
        // store.clearFilter(true);
        this.getView().close();
    },

    closeNewEmployee: function () {
        var grid = Ext.first('#empHoursGrid'),
            store = grid.getStore();
        // store.clearFilter(true);
    },

    empHoursChanged: function (comp, newValue, oldValue, eOpts) {
        var me = this,
            grid = Ext.first('#empHoursGrid'),
            store = grid.getStore(),
            selection = Ext.first('grid-employeehours').selection,
            form = Ext.first('#fwaForm').getForm();
        store.setRemoteSort(false);
        store.getSorters().removeAll();
        form.dirty = true;
        selection.set('modified', 'M');
        store.setRemoteSort(true);
    },

    // Handles deletion button on the grid
    deleteEmployeeHours: function (grid, rowIndex) {
        var form = Ext.first('#fwaForm').getForm(),
            store = grid.store,
            settings = TS.app.settings,
            record = store.getAt(rowIndex),
            //record = form.getRecord(),
            fwaStatus = form.getRecord().get('fwaStatusId'),
            isScheduler = this.getView().isScheduler;

        if ((fwaStatus != FwaStatus.Approved && isScheduler) || (fwaStatus == FwaStatus.Approved && (settings.fwaIsApprover && settings.fwaCanModify != 'N'))) {
            if (record.get('readOnly') && (record.get('readOnlyReason').includes('is approved') || record.get('readOnlyReason').includes('have been approved'))) {

            } else {
                if (record.get('readOnly')) {
                    TS.Messages.getReadOnlyMessage(record.get('readOnlyReason'));
                    return false;
                }
            }
        } else {
            if (record.get('readOnly')) {
                TS.Messages.getReadOnlyMessage(record.get('readOnlyReason'));
                return false;
            }
        }
        form.dirty = true;
        //grid.getStore().getAt(rowIndex).drop();
        grid.getStore().addFilter({
            filterFn: function (record) {
                return record.get('modified') !== 'D';
            }
        });
        record.set('modified', 'D');
    },

    onHoursCommentEdit: function (grid, rowIndex) {
        //settings.chiefRoleIds.indexOf('^'+row.get('CrewRoleId')+'^') = -1
        var settings = TS.app.settings,
            //check if work date hidden when fwa is recurring
            workDateHidden = this.getView().lookup('workDateField').hidden,
            wcIndex = workDateHidden ? 2 : 3,
            form = Ext.first('#fwaForm').getForm(),
            store = grid.grid.getStore(),
            noDataFlow = settings.fwaChiefDataFlowToCrew == 'N',
            flowHours = settings.fwaChiefDataFlowToCrew == 'H' || settings.fwaChiefDataFlowToCrew == 'B',
            flowComments = settings.fwaChiefDataFlowToCrew == 'C' || settings.fwaChiefDataFlowToCrew == 'B',
            comment,
            workCode,
            hours;
        //mark dirty
        form.dirty = true;
        //ignore any edit based on user config
        if (noDataFlow) return;

        //check if chief comments and set crew member comments if blank
        if (flowComments && rowIndex.field == 'comment' && settings.chiefRoleIds.indexOf('^' + rowIndex.record.get('crewRoleId') + '^') > -1) {
            comment = rowIndex.value;
            workCode = rowIndex.row.cells[wcIndex].textContent;
            Ext.Array.each(store.data.items, function (row) {
                if (settings.chiefRoleIds.indexOf('^' + row.get('crewRoleId') + '^') == -1 && row.get('workCodeAbbrev') == workCode && !row.get('comment')) {
                    row.set('comment', comment);
                }
            }, this);
        }

        if (flowHours && rowIndex.value > 0) {
            if (rowIndex.field == 'regHrs' && settings.chiefRoleIds.indexOf('^' + rowIndex.record.get('crewRoleId') + '^') > -1) {
                hours = rowIndex.value;
                workCode = rowIndex.row.cells[wcIndex].textContent;
                Ext.Array.each(store.data.items, function (row) {
                    if (settings.chiefRoleIds.indexOf('^' + row.get('crewRoleId') + '^') == -1 && row.get('workCodeAbbrev') == workCode && row.get('regHrs') == '0.00') {
                        row.set('regHrs', hours);
                    }
                }, this);
            }

            if (rowIndex.field == 'ovtHrs' && settings.chiefRoleIds.indexOf('^' + rowIndex.record.get('crewRoleId') + '^') > -1) {
                hours = rowIndex.value;
                workCode = rowIndex.row.cells[wcIndex].textContent;
                Ext.Array.each(store.data.items, function (row) {
                    if (settings.chiefRoleIds.indexOf('^' + row.get('crewRoleId') + '^') == -1 && row.get('workCodeAbbrev') == workCode && row.get('ovtHrs') == '0.00') {
                        row.set('ovtHrs', hours);
                    }
                }, this);
            }

            if (rowIndex.field == 'ovt2Hrs' && settings.chiefRoleIds.indexOf('^' + rowIndex.record.get('crewRoleId') + '^') > -1) {
                hours = rowIndex.value;
                workCode = rowIndex.row.cells[wcIndex].textContent;
                Ext.Array.each(store.data.items, function (row) {
                    if (settings.chiefRoleIds.indexOf('^' + row.get('crewRoleId') + '^') == -1 && row.get('workCodeAbbrev') == workCode && row.get('ovt2Hrs') == '0.00') {
                        row.set('ovt2Hrs', hours);
                    }
                }, this);
            }
        }

        if (rowIndex.field == 'travelHrs' && settings.chiefRoleIds.indexOf('^' + rowIndex.record.get('crewRoleId') + '^') > -1) {
            hours = rowIndex.value;
            workCode = rowIndex.row.cells[3].textContent;
            Ext.Array.each(store.data.items, function (row) {
                if (settings.chiefRoleIds.indexOf('^' + row.get('crewRoleId') + '^') == -1 && row.get('workCodeAbbrev') == workCode && row.get('travelHrs') == '0.00') {
                    row.set('travelHrs', hours);
                }
            }, this);
        }
    },

    saveNewWorkDate: function () {
        var me = this,
            vw = me.getView(),
            form = Ext.first('#fwaForm').getForm(),
            rec = form.getRecord(),
            grid = Ext.first('#empHoursGrid'),
            store = grid.getStore(),
            model = store.model,
            lastItem = store.last(),
            lastDt = Ext.first('#fwaForm').lookup('dateHeader').getValue(),
            rowAdd = 0,
            datesInRange = rec.get('recurrenceDatesInRange'),
            hasNewDate = false,
            utcDate,
            currentIndex = 0,
            crewStore = Ext.getStore('AllCrews').getById(rec.get('scheduledCrewId')),
            crewMembers = crewStore ? crewStore.get('crewMembers') : '',
            workDate = Ext.Date.format(new Date(Ext.first('#addWorkDateField').getValue()), 'Y-m-d'),
            nextDate = Ext.Date.format(new Date(Ext.first('#addWorkDateField').getValue()), 'm/d/Y');

        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            if (dt == workDate + 'T00:00:00') {
                hasNewDate = true;
                return false;
            }
        });
        //if does not exists - add to dateRange
        if (!hasNewDate) {
            if (!datesInRange) {
                rec.set('recurrenceDatesInRange', []);
                datesInRange = rec.get('recurrenceDatesInRange');
            }
            datesInRange.push(workDate + 'T00:00:00');
            //nextDate = Ext.Date.format(new Date(workDate), DATE_FORMAT);
            currentIndex++;
        }

        Ext.each(store.collect('empId'), function (emp) {
            store.clearFilter(true);
            store.filter('empId', emp);
            Ext.each(store.collect('crewRoleId'), function (roleId) {
                store.filter('crewRoleId', roleId);
                Ext.each(store.collect('workCodeAbbrev'), function (workCodeAbbrev) {
                    store.filter('workCodeAbbrev', workCodeAbbrev);
                    Ext.each(store.getRange(), function (rec) {
                        store.filter('workDate', new Date(nextDate));
                        if (store.getRange().length == 0 && crewMembers.getById(emp)) {
                            store.add(new model({
                                workDate: new Date(nextDate),
                                empId: emp,
                                crewRoleId: roleId,
                                workCodeId: '',
                                workCodeAbbrev: workCodeAbbrev,
                                ovt2Hrs: 0,
                                ovtHrs: 0,
                                regHrs: 0,
                                travelHrs: 0
                            }));
                        }
                    });

                });
            });
        });
        store.clearFilter(true);
        store.setRemoteFilter(false);
        store.filterBy(function (rec) {
            return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
        });

        Ext.first('#fwaForm').lookup('dateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        currentIndex = 0;
        if (datesInRange && datesInRange.length > 0) {
            if (datesInRange.length == 1) {
                Ext.first('#fwaForm').lookup('lastDate').setDisabled(true);
                Ext.first('#fwaForm').lookup('nextDate').setDisabled(true);
            } else {
                datesInRange = datesInRange.sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                    var matches = (utcDate == Ext.Date.format(Ext.first('#addWorkDateField').getValue(), DATE_FORMAT));
                    if (matches && currentIndex == 1) {
                        Ext.first('#fwaForm').lookup('lastDate').setDisabled(true);
                        Ext.first('#fwaForm').lookup('nextDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == rec.get('recurrenceDatesInRange').length) {
                        Ext.first('#fwaForm').lookup('lastDate').setDisabled(false);
                        Ext.first('#fwaForm').lookup('nextDate').setDisabled(true);
                        return false;
                    }
                });
            }
        } else {
            Ext.first('#fwaForm').lookup('lastDate').setDisabled(true);
            Ext.first('#fwaForm').lookup('nextDate').setDisabled(true);
        }
        vw.close();
    },

    cancelNewWorkDate: function () {
        this.getView().close();
    },

    setEmployeeHoursRole: function (component, newValue, oldValue) {
        var me = this,
            vw = me.getView(),
            roleStore = Ext.getStore('Roles'),
            grid = Ext.first('#empHoursGrid'),
            store = grid.getStore(),
            employee = Ext.getStore('Employees').getById(newValue),
            len = store.getRange().length;
        if (employee) {
            vw.lookup('employeeHoursRole').setValue(employee.get('defaultCrewRoleId'));
            //vw.lookup('laborCodeField').setValue(employee.get('tsDefLaborCode'));
            if (len > 0) {
                if (me.getViewModel().getData().rec.getData().workSchedAndPerf.getRange().length == 1) {
                    vw.lookup('workCodeCombo').setValue(me.getViewModel().getData().rec.getData().workSchedAndPerf.getRange()[0]);
                }
            }
            vw.lookup('saveNewEmployeeBtn').setDisabled(false);
        } else {
            vw.lookup('saveNewEmployeeBtn').setDisabled(true);
        }
    },

    checkReadOnly: function (editor, context, e) {
        var settings = TS.app.settings,
            form = Ext.first('#fwaForm').getForm(),
            record = form.getRecord(),
            fwaStatus = record.get('fwaStatusId'),
            isScheduler = this.getView().isScheduler,
            returnValue = true;

        if ((fwaStatus != FwaStatus.Approved && isScheduler) || (fwaStatus == FwaStatus.Approved && (settings.fwaIsApprover && settings.fwaCanModify != 'N'))) {
            if (context.record.get('readOnly') && (context.record.get('readOnlyReason').includes('is approved') || context.record.get('readOnlyReason').includes('have been approved'))) {
                return true;
            } else {
                if (context.record.get('readOnly')) {
                    TS.Messages.getReadOnlyMessage(context.record.get('readOnlyReason'));
                    return false;
                }
            }
        } else {
            if (context.record.get('readOnly')) {
                TS.Messages.getReadOnlyMessage(context.record.get('readOnlyReason'));
                return false;
            }
        }
        return true;
    },

    // Checks if a timesheet row is read only and stops any click events
    stopReadOnly: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        // Reject any clicks on a readonly row
        var vm = this.getViewModel(),
            settings = TS.app.settings,
            isScheduler = this.getView().isScheduler,
            isCrewChief = this.checkForCrewChief(settings.selectedRecord, settings.empId) || (vm.get('newFwa') && settings.fwaCreateNew);
        if(isScheduler){
            return true;
        } else {
            if(isCrewChief){
                return true;
            } else{
                if (settings.empId != record.get('empId')) {
                    return false;
                }
            }
        }
    },

    checkForCrewChief: function (record, empId) {
         var isChief = false,
            settings = TS.app.settings;
        if (!record) return false;
        if (record.get('scheduledCrewChiefId') == empId) {
            isChief = true;
        }

        Ext.each(record.get('hours').getRange(), function (item) {
            if (item.get('empId') == empId && item.get('isChief')) {
                isChief = true;
            }
        });

        return isChief;
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    showLaborCodeLookupWindowFromNew: function (comp, e) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            laborCode = '',
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
            lValue5,
            laborCodeLookup;

        if (me.laborCodeLookup) {
            me.laborCodeLookup.close(); // Close editor if it already exists
        }

        me.laborCodeLookup = Ext.create('TS.view.fwa.EmpLaborCodeLookup', {
            callingPage: 'EmpHoursNew'
        }).show();

        gridContainer = me.laborCodeLookup.lookup('laborCodeGridsContainer');

        for (var level = 0; level < settings.tsLcLevels; level++) {
            switch (level + 1) {
                case 1:
                    start = settings.tsLc1Start - 1;
                    end = settings.tsLc1Len;
                    lValue1 = Ext.util.Format.substr(laborCode, start, end);
                    grid1 = gridContainer.items.items[level];
                    store1 = grid1.getStore();
                    grid1.getSelectionModel().select(store1.find('lcCode', lValue1), true);
                    break;
                case 2:
                    start = settings.tsLc2Start - 1;
                    end = settings.tsLc2Len;
                    lValue2 = Ext.util.Format.substr(laborCode, start, end);
                    grid2 = gridContainer.items.items[level];
                    store2 = grid2.getStore();
                    grid2.getSelectionModel().select(store2.find('lcCode', lValue2), true);
                    break;
                case 3:
                    start = settings.tsLc3Start - 1;
                    end = settings.tsLc3Len;
                    lValue3 = Ext.util.Format.substr(laborCode, start, end);
                    grid3 = gridContainer.items.items[level];
                    store3 = grid3.getStore();
                    grid3.getSelectionModel().select(store3.find('lcCode', lValue3), true);
                    break;
                case 4:
                    start = settings.tsLc4Start - 1;
                    end = settings.tsLc4Len;
                    lValue4 = Ext.util.Format.substr(laborCode, start, end);
                    grid4 = gridContainer.items.items[level];
                    store4 = grid4.getStore();
                    grid4.getSelectionModel().select(store4.find('lcCode', lValue4), true);
                    break;
                case 5:
                    start = settings.tsLc5Start - 1;
                    end = settings.tsLc5Len;
                    lValue5 = Ext.util.Format.substr(laborCode, start, end);
                    grid5 = gridContainer.items.items[level];
                    store5 = grid5.getStore();
                    grid5.getSelectionModel().select(store5.find('lcCode', lValue5), true);
                    break;
            }
        }
    },

    onStartTimeChange: function (t, newValue, oldValue, eOpts) {
        var me = this,
            grid = Ext.first('#empHoursGrid'),
            store = grid.getStore(),
            selection = Ext.first('grid-employeehours').selection,
            form = Ext.first('#fwaForm').getForm();

        store.setRemoteSort(false);
        store.getSorters().removeAll();
        form.dirty = true;
        selection.set('modified', 'M');
        selection.set('startTime', newValue);
        selection.set('endTime', Ext.Date.add(new Date(newValue), Ext.Date.HOUR, 1));
        store.setRemoteSort(true);
    },

    onEndTimeChange: function (t, newValue, oldValue, eOpts) {
        var me = this,
            vw = me.getView(),
            grid = Ext.first('#empHoursGrid'),
            store = grid.getStore(),
            selection = Ext.first('grid-employeehours').selection,
            form = Ext.first('#fwaForm').getForm();

        if (Ext.Date.format(new Date(newValue), 'H:i') <= Ext.Date.format(new Date(selection.get('startTime')), 'H:i')) {
            Ext.Msg.alert('FYI', 'End Time must be greater than Start Time.');
            vw.lookup('myEndTime').setValue(Ext.Date.add(new Date(selection.get('startTime')), Ext.Date.HOUR, 1));
            selection.set('endTime', Ext.Date.add(new Date(selection.get('startTime')), Ext.Date.HOUR, 1));
        } else {
            store.setRemoteSort(false);
            store.getSorters().removeAll();
            form.dirty = true;
            selection.set('modified', 'M');
            selection.set('endTime', newValue);
            store.setRemoteSort(true);
        }
    },

    /**
     * @param {grid}
     * @param {row index}
     */
    showLaborCodeLookupWindow: function (grid, rowIndex) {
        var me = this,
            vm = me.getViewModel(),
            store = grid.store,
            settings = TS.app.settings,
            record = store.getAt(rowIndex),
            laborCode = record.get('laborCode'),
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
            lValue5,
            laborCodeLookup;
        if (me.laborCodeLookup) {
            me.laborCodeLookup.close(); // Close editor if it already exists
        }

        settings.selectedIndex = rowIndex;

        me.laborCodeLookup = Ext.create('TS.view.fwa.EmpLaborCodeLookup', {
            callingPage: 'FWA'
        }).show();

        gridContainer = me.laborCodeLookup.lookup('laborCodeGridsContainer');

        for (var level = 0; level < settings.tsLcLevels; level++) {
            switch (level + 1) {
                case 1:
                    start = settings.tsLc1Start - 1;
                    end = settings.tsLc1Len;
                    lValue1 = Ext.util.Format.substr(laborCode, start, end);
                    grid1 = gridContainer.items.items[level];
                    store1 = grid1.getStore();
                    grid1.getSelectionModel().select(store1.find('lcCode', lValue1), true);
                    break;
                case 2:
                    start = settings.tsLc2Start - 1;
                    end = settings.tsLc2Len;
                    lValue2 = Ext.util.Format.substr(laborCode, start, end);
                    grid2 = gridContainer.items.items[level];
                    store2 = grid2.getStore();
                    grid2.getSelectionModel().select(store2.find('lcCode', lValue2), true);
                    break;
                case 3:
                    start = settings.tsLc3Start - 1;
                    end = settings.tsLc3Len;
                    lValue3 = Ext.util.Format.substr(laborCode, start, end);
                    grid3 = gridContainer.items.items[level];
                    store3 = grid3.getStore();
                    grid3.getSelectionModel().select(store3.find('lcCode', lValue3), true);
                    break;
                case 4:
                    start = settings.tsLc4Start - 1;
                    end = settings.tsLc4Len;
                    lValue4 = Ext.util.Format.substr(laborCode, start, end);
                    grid4 = gridContainer.items.items[level];
                    store4 = grid4.getStore();
                    grid4.getSelectionModel().select(store4.find('lcCode', lValue4), true);
                    break;
                case 5:
                    start = settings.tsLc5Start - 1;
                    end = settings.tsLc5Len;
                    lValue5 = Ext.util.Format.substr(laborCode, start, end);
                    grid5 = gridContainer.items.items[level];
                    store5 = grid5.getStore();
                    grid5.getSelectionModel().select(store5.find('lcCode', lValue5), true);
                    break;
            }
        }
    },

    setLaborCode: function (laborCode) {
        var store = Ext.first('grid-employeehours').getStore(),
            settings = TS.app.settings,
            record = store.getAt(settings.selectedIndex);
        // Set value of labor code field
        if (laborCode) {
            record.set('laborCode', laborCode);
        }
    }


});