Ext.define('TS.controller.ts.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.viewport-timesheet',

    requires: [
        'Ext.window.Toast'
    ],

    config: {
        warningMessage: null
    },

    listen: {
        global: {
            'GetWarningMessage': 'getWarningMessage',
            'ReloadAfterApproval': 'findCurrentTimesheet',
            'SubmitAfterPinCheck': 'continueSubmitTimesheet'
        }
    },

    routes: {
        'ts/:tsDate': 'getFwaTimesheet'
    },

    init: function () {
        // Initially mask the viewport and load the initial timesheet
        this.getView().setLoading(true);
        this.findCurrentTimesheet();
    },

    onBackToFSS: function () {
        this.checkUnsaved(Ext.bind(function () {
            Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
        }));
    },

    // View listener method
    startNewTimesheetRow: function () {
        this.fireEvent('newtimesheetrow', 0);
    },

    /*
     * Window Show Methods
     */

    // Opens a window containing the timesheet selection
    showTimesheetWindow: function () {
        this.checkUnsaved(Ext.bind(function () {
            var win = Ext.create('TS.view.ts.TimesheetSelect', {
                    buttons: [
                        {
                            text: 'Open',
                            handler: 'selectTimesheet',
                            itemId: 'selectTimesheetButton',
                            disabled: true
                        }, {
                            text: 'Cancel',
                            align: 'right',
                            handler: 'onCloseSelectTimesheet'

                        }
                    ]
                }),
                store = Ext.first('grid-timesheet').getStore();
            store.reload();
            win.show();
        }, this));
    },

    onSelectTimesheet: function () {
        if (Ext.first('#selectTimesheetButton'))
            Ext.first('#selectTimesheetButton').setDisabled(false);
    },

    onCloseSelectTimesheet: function () {
        Ext.first('window-timesheetselect').close();
    },
    // Opens a window containing employee grid
    showEmployeesWindow: function () {
        Ext.create('TS.view.ts.TimesheetEmployees', {
            reference: 'tsEmployeesWindow'
        }).show();
    },

    // Opens a window containing print options and triggers
    showPrintWindow: function () {
        var me = this,
            vw = me.getView(),
            selectedTsheet = me.getViewModel().get('selectedTimesheet'),
            periodId = selectedTsheet.get('tsPeriodId'),
            startDate = Ext.Date.format(new Date(selectedTsheet.get('startDate')), Ext.Date.defaultFormat),
            endDate = Ext.Date.format(new Date(selectedTsheet.get('endDate')), Ext.Date.defaultFormat),
            empId = selectedTsheet.get('empId');

        this.checkUnsaved(Ext.bind(function () {
            vw.fireEvent('showprinter', periodId, 'TS', 'Timesheet: ' + startDate + '-' + endDate, empId);
        }), true);
    },

    // Opens a window that shows a list of timesheets/options for copying
    showCopyWindow: function () {
        var win = Ext.create('TS.view.ts.TimesheetSelect', {
            reference: 'tsCopyWindow',
            buttons: [{
                text: 'Copy',
                handler: 'doCopyTimesheet'
            }]
        });
        Ext.first('grid-timesheet').getStore().load({
            callback: function () {
                win.show();
            }
        });
    },

    fillApprovalGrid: function () {
        var grid = this.lookup('tsApprovalGrid'),
            store = grid.getStore(),
            tsPeriod = this.getView().getViewModel().get('selectedTimesheet').get('tsPeriodId');

        if (tsPeriod) {
            store.getProxy().extraParams.tsPeriodId = tsPeriod;
            store.load();
            grid.selectedTimesheet = this.getView().getViewModel().get('selectedTimesheet');

        } else {
            Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetRequireSelectApprovals');
        }
    },

    showProjectLookupWindow: function () {
        var me = this,
            projectLookupWindow;

        if (me.projectLookupWindow) {
            me.projectLookupWindow.close(); // Close editor if it already exists
        }
        me.projectLookupWindow = Ext.create('TS.common.window.ProjectLookup', {
            callingPage: 'TS',
            app: e.app
        }).show();
    },

    showLaborCodeLookupWindow: function () {
        var me = this,
            laborCodeLookup;

        if (me.laborCodeLookup) {
            me.laborCodeLookup.close();
        }
        me.laborCodeLookup = Ext.create('TS.view.ts.LaborCodeLookup', {
            callingPage: 'TS'
        }).show();
    },

    /*
     * Timesheet Action Methods
     */

    // Shows a prompt and performs the approve action against a timesheet
    doApproveTimesheet: function () {
        // TODO - Uncomment and finalize implementation of timesheet approval, if still required given new approval process
        var settings = TS.app.settings,
            tsRecord = this.getViewModel().get('selectedTimesheet');
        //signatureAttachment = attachment != null ? attachment.getData() : null;
        Ext.Msg.confirm("Please Confirm", "Are you sure you want to approve this?", function (btn) {
            if (btn == 'yes') {
                TimeSheet.ApproveRejectTimesheet(null, settings.username, tsRecord.get('tsPeriodId'), tsRecord.get('tsEmpId'), true, 'NA', function (response, operation, success) {
                    Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetApproveSuccess');
                    //refresh grid
                    Ext.GlobalEvents.fireEvent('ReloadAfterApproval');
                }, this, {
                    autoHandle: true
                });
            }
        })
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

    openAboutFss: function () {
        var settings = TS.app.settings,
            popup = Ext.create('TS.view.crew.window.AboutFSS');

        Ext.first('#ttlInfo').setValue('<b>*Totals reflect those of ' + settings.empName + ' only. </b>');
        popup.setWidth(350);
        popup.show();
    },

    doSubmitTimesheet: function (button, event) {
        var me = this,
            tsRecord = me.getViewModel().get('selectedTimesheet'),
            periodId = tsRecord.get('tsPeriodId'),
            empId = tsRecord.get('empId'),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            tsRows = Ext.Array.pluck(tsRowGrid.getStore().getRange(), 'data'),
            settings = TS.app.settings,
            hasProject = me.checkWbs1Information(tsRows);
        tsRecord.set('rows', tsRows);
        // if no wbs1 info stop save/submit
        if (!hasProject) {
            return;
        } else {
            if (settings.tsReqSubmitSignature) {
                Ext.create('TS.view.ts.TsSubmitPin', {
                    reference: 'fwaSubmitPinPanel',
                    attType: 'Employee',
                    button: button,
                    event: event,
                    modal: true,
                    tsEmployee: false,
                    associatedRecordId: periodId,
                    attachmentsList: {
                        modelType: 'TS',
                        modelId: periodId,
                        attachmentType: 'E'
                    }
                }).show();
            } else {
                me.continueSubmitTimesheet(button, event);
            }
        }
    },

    doSaveTimesheet: function (button, event, attachment) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            tsRecord = me.getViewModel().get('selectedTimesheet'),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            tsRows = Ext.Array.pluck(tsRowGrid.getStore().getRange(), 'data'),
            signatureAttachment = attachment != null ? attachment.getData() : null,
            btnId = button.id,
            hasProject = me.checkWbs1Information(tsRows);
        tsRecord.set('rows', tsRows);
        // if no wbs1 info stop save/submit
        if (!hasProject) {
            return;
        } else {
            me.continueSaveTimesheet(button, event, signatureAttachment);
        }
    },

    continueSaveTimesheet: function (button, event, attachment) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            tsRecord = vm.get('selectedTimesheet'),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            store = tsRowGrid.getStore(),
            tsRows = Ext.Array.pluck(tsRowGrid.getStore().getRange(), 'data'),
            signatureAttachment = attachment != null ? attachment.getData() : null;
        //convert to Time Zone
        // Ext.each(tsRows, function (row) {
        //     Ext.each(row.cells, function (c) {
        //         c.workDate = TS.common.Util.getOutUTCDate(c.workDate);
        //         c.startTime = TS.common.Util.getOutUTCDate(c.startTime);
        //         c.endDate = TS.common.Util.getOutUTCDate(c.endDate);
        //     });
        // });
        tsRecord.set('rows', tsRows);
        // tsRecord.data.startDate = TS.common.Util.getOutUTCDate(tsRecord.data.startDate);
        // tsRecord.data.endDate = TS.common.Util.getOutUTCDate(tsRecord.data.endDate);
        //console.log(tsRecord.data);
        TimeSheet.Save(null, settings.username, tsRecord.data, vm.get('isTimesheetApproval'), function (response, operation, success) {
            if (response && response.success) {
                if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                    // Get the warning messages
                    //Ext.GlobalEvents.fireEvent('GetWarningMessage', response);
                    // me.getWarningMessage(response);
                    Ext.Msg.confirm('Please Confirm', me.getWarningMessage(response), function (btn) {
                        if (btn === 'yes') {
                            TimeSheet.SaveSubmitAfterWarning(null, settings.username, tsRecord.data, false, signatureAttachment, function (response, operation, success) {
                                if (response && response.success) {
                                    TS.Messages.getSimpleAlertMessage('timesheetSaveSuccess');
                                    store.reload();
                                    //tsRowGrid.getStore().commitChanges();
                                } else if (response && !response.success) {
                                    Ext.GlobalEvents.fireEvent('Error', response);
                                }

                            }, me, {
                                autoHandle: true
                            });
                        }
                    });
                } else {
                    TS.Messages.getSimpleAlertMessage('timesheetSaveSuccess');
                    tsRowGrid.getStore().commitChanges();
                }
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', Ext.JSON.encode(response)); //message attribute is a list of TS.model.shared.Error
            }
        });

    },

    continueSubmitTimesheet: function (button, event, attachment) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            tsRecord = vm.get('selectedTimesheet'),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            tsRows = Ext.Array.pluck(tsRowGrid.getStore().getRange(), 'data'),
            signatureAttachment = attachment != null ? attachment.getData() : null;
        // Ext.each(tsRows, function (row) {
        //     Ext.each(row.cells, function (c) {
        //         c.workDate = TS.common.Util.getOutUTCDate(c.workDate);
        //         c.startTime = TS.common.Util.getOutUTCDate(c.startTime);
        //         c.endDate = TS.common.Util.getOutUTCDate(c.endDate);
        //     });
        // });
        tsRecord.set('rows', tsRows);
        // tsRecord.data.startDate = TS.common.Util.getOutUTCDate(tsRecord.data.startDate);
        // tsRecord.data.endDate = TS.common.Util.getOutUTCDate(tsRecord.data.endDate);

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to submit?", function (btn) {
            if (btn === 'yes') {
                TimeSheet.Submit(null, settings.username, tsRecord.data, signatureAttachment, function (response, operation, success) {
                    if (response && response.success) {
                        if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                            // Get the warning messages
                            //Ext.GlobalEvents.fireEvent('GetWarningMessage', response);
                            // me.getWarningMessage(response);
                            Ext.Msg.confirm('Please Confirm', me.getWarningMessage(response), function (btn) {
                                if (btn === 'yes') {
                                    TimeSheet.SaveSubmitAfterWarning(null, settings.username, tsRecord.data, true, signatureAttachment, function (response, operation, success) {
                                        tsRecord.set('status', 'S');
                                        //set row status to lock if cannot re-submit
                                        Ext.each(tsRowGrid.getStore().getRange(), function (row) {
                                            if (row.get('empId') == settings.empId || settings.tsCanEnterCrewMemberTime) {
                                                row.set('tsheetStatus', tsRecord.get('status'));
                                            }
                                        });
                                        TS.Messages.getSimpleAlertMessage('timesheetSubmitSuccess');
                                        tsRowGrid.getStore().commitChanges();
                                    }, me, {
                                        autoHandle: true
                                    });
                                }
                            });
                        } else {
                            tsRecord.set('status', 'S');
                            Ext.each(tsRowGrid.getStore().getRange(), function (row) {
                                if (row.get('empId') == settings.empId || settings.tsCanEnterCrewMemberTime) {
                                    row.set('tsheetStatus', tsRecord.get('status'));
                                }
                            });
                            TS.Messages.getSimpleAlertMessage('timesheetSubmitSuccess');
                            tsRowGrid.getStore().commitChanges();
                        }
                    } else if (response) { // TODO -- Use Autohandle
                        Ext.GlobalEvents.fireEvent('Error', Ext.JSON.encode(response)); // Message attribute is a list of TS.model.shared.Error
                    }
                });
            }
        });
    },

    /*
     * Error Message Parsers
     */
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
            warningMessage = 'Unknown Error - Please Contact Support'
            //this.setWarningMessage(typeof errorData == 'string' ? errorData : 'Unknown Error - Please Contact Support');
        }
        return warningMessage;
    },


    doCopyTimesheet: function () {
        var me = this,
            copyWindow = me.lookup('tsCopyWindow'),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            rowData = tsRowGrid.getStore().getRange(),
            iLen = rowData.length,
            settings = TS.app.settings,
            hrsTtl = 0,
            i = 0;

        if (Ext.first('#ts-grid').getSelection().length == 0) {
            Ext.Msg.alert('FYI', 'Please select timesheet to copy');
            return;
        }

        for (; i < iLen; i++) {
            cells = rowData[i].getData(true);
            Ext.each(cells, function (cell) {
                Ext.each(cell.cells, function (obj) {
                    hrsTtl += obj.regHrs + obj.ovtHrs + obj.ovt2Hrs + obj.travelHrs;
                });
            });
        }

        if (hrsTtl != 0) {
            Ext.Msg.confirm('Please Confirm', 'The current ' + settings.tsTitle + ' will be replaced with the copied data, select “Yes” to proceed.', function (btn) {
                if (btn == 'yes') {
                    me.copyTimesheet();
                } else {
                    copyWindow.close();
                }
            });
        } else {
            me.copyTimesheet();
        }
    },

    copyTimesheet: function () {
        var me = this,
            vm = me.getViewModel(),
            copyWindow = me.lookup('tsCopyWindow'),
            tsRecord = vm.get('selectedTimesheet'),
            timesheetGrid = copyWindow.down('grid'),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            tsRows = Ext.Array.pluck(tsRowGrid.getStore().getRange(), 'data'),
            rowData = tsRowGrid.getStore().getRange(),
            iLen = rowData.length,
            viewModel = me.getView().lookupViewModel(),
            settings = TS.app.settings,
            hrsTtl = 0,
            i = 0;

        tsRecord.set('rows', tsRows);
        if (copyWindow && timesheetGrid.getSelection().length > 0) {
            var selected = timesheetGrid.getSelection()[0];
            TimeSheet.Copy(null, settings.username, settings.empId, selected.get('startDate'), selected.data, function (response, operation, success) {
                if (response && response.success) {
                    tsRowGrid.getStore().loadData(response.data.rows);
                    //Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetCopySuccess', function () {
                    copyWindow.close();
                    //});
                } else {
                    Ext.GlobalEvents.fireEvent('Error', response);
                }
            });
        } else {
            Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetRequireSelect');
            copyWindow.close();
        }
    },

    // Triggered when a timesheet is selected/opened
    selectTimesheet: function () {
        var win = Ext.first('window-timesheetselect'),
            record = win.down('grid').getSelection()[0],
            settings = TS.app.settings;

        if (record) {
            //reset disabled
            Ext.first('grid-timesheetrow').setDisabled(false);
            var store = Ext.first('grid-timesheetrow').getStore();
            store.getProxy().setExtraParams({
                tsDate: Ext.Date.format(record.get('endDate'), 'DateOnly'),
                includeCrewMembers: settings.tsCanViewCrewMemberTime
            });
            store.load({
                callback: this.afterTimesheetSelect,
                scope: this
            });
            Ext.each(store.getModifiedRecords(), function (model) {
                model.reject();
            });
        }
    },

    //triggered from fwa form & 'view timesheet' button
    getFwaTimesheet: function (tsDate) {
        var store = Ext.first('grid-timesheetrow').getStore();
        store.getProxy().setExtraParams({
            tsDate: Ext.Date.format(tsDate, 'DateOnly'),
            includeCrewMembers: settings.tsCanViewCrewMemberTime
        });
        store.load({
            callback: this.afterTimesheetSelect,
            scope: this
        });
    },

    // Triggered after a timesheet either succeeds or fails to open
    // Bound to the above callback for loading timesheet details
    afterTimesheetSelect: function (results, operation, success) {
        var win = Ext.first('window-timesheetselect'),
            record = win.down('grid').getSelection()[0],
            tsViewModel = this.getView().lookupViewModel(),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            settings = TS.app.settings,
            showToast = false,
            store;
        if (success) {
            this.setTimesheetViewModel(record);
            win.close();
            if (tsRowGrid) {
                tsRowGrid.getView().refresh();
                //TODO talk to SS, I think we need to see this in case we add a new timesheet row
                //hide the 'Who' column
                tsRowGrid.columns[0].setHidden(true);
                //disable if submitted or approved
                this.disableTimesheet(record.get('status'), tsRowGrid);
                //show the 'Who' column if employee listed other that who is logged in
                store = tsRowGrid.getStore();
                store.each(function (rec, id) {
                    rec.set('tsheetStatus', record.get('status'));
                    if (rec.get('empId') != settings.empId) {
                        tsRowGrid.columns[0].setHidden(false);
                        return false;
                    }
                    //console.log('wbs='+rec.get('wbs1')); // remove from store/grid if no wbs1
                    if (!rec.get('wbs1')) { //|| !rec.get('status')
                        store.remove(rec);
                        showToast = true;
                    }
                });
                Ext.each(store.getModifiedRecords(), function (model) {
                    model.reject();
                });
                if (showToast) {
                    Ext.toast({
                        html: 'Please add an entry by clicking "New Entry".',
                        title: 'Add Entry',
                        align: 'bl'
                    });
                }

                if (operation.getResponse().result.message && operation.getResponse().result.message.mdBody) {
                    var msg = operation.getResponse().result.message;
                    Ext.Msg.alert(msg.mdTitleBarText, msg.mdBody);
                }
            }
        } else {
            Ext.GlobalEvents.fireEvent('Error', operation.getError());
        }

    },

    setTimesheetViewModel: function (record) {
        var tsViewModel = this.getView().lookupViewModel(),
            settings = TS.app.settings,
            store = Ext.getStore('TsEmployees'),
            store2 = Ext.getStore('Employees'),
            employee = store.getById(settings.empId) || store2.getById(settings.empId);

        tsViewModel.set({
            startDate: record.get('startDate'),
            endDate: record.get('endDate')
        });

        // Default to logged in user values
        record.set('empId', settings.empId);
        record.set('crewRoleId', employee.get('defaultCrewRoleId'));

        tsViewModel.set('selectedTimesheet', record);
    },

    getUrlParams: function () {
        return Ext.Object.fromQueryString(location.search);
    },

    // Checks the current date for a suitable matching timesheet and loads it
    // If none is found, opens the select prompt
    findCurrentTimesheet: function () {

        var me = this,
            date = Ext.Date.format(new Date(), DATE_FORMAT),
            settings = TS.app.settings,
            initialTimesheet = null,
            startDate,
            endDate,
            tsRowGrid,
            store,
            showToast;
        TimeSheet.GetListByEmployee(null, settings.username, settings.empId, 0, 10000, function (response, operation, success) {
            if (response && response.success) {
                // Check each record start and end date for a match
                Ext.Array.each(response.data, function (row) {
                    startDate = Ext.Date.format(new Date(row.startDate), DATE_FORMAT);
                    endDate = Ext.Date.format(new Date(row.endDate), DATE_FORMAT);
                    if (Ext.Date.between(new Date(date), new Date(startDate), new Date(endDate))) {
                        initialTimesheet = row;
                        return false;
                    }
                }, me);
                // Open the timesheet, or open the prompt

                if (initialTimesheet) {
                    tsRowGrid = Ext.first('grid-timesheetrow');
                    tsRowGrid.currTimeSheet = initialTimesheet;
                    //tsRowGrid.setDisabled(true);
                    //disable if submitted or approved
                    me.disableTimesheet(initialTimesheet.status, tsRowGrid);
                    tsRowGrid.getStore().getProxy().setExtraParams({
                        tsDate: initialTimesheet.startDate,
                        includeCrewMembers: settings.tsCanViewCrewMemberTime
                    });

                    tsRowGrid.getStore().load({
                        callback: function (results, operation, success) {
                            if (success) {
                                me.setTimesheetViewModel(Ext.create('TS.model.ts.Tsheet', initialTimesheet));
                                tsRowGrid.getView().refresh();
                            }
                            //tsRowGrid.columns[0].setHidden(true);
                            store = tsRowGrid.getStore();
                            store.each(function (rec, id) {
                                if (!rec.get('wbs1')) { //|| !rec.get('status')
                                    store.remove(rec);
                                    showToast = true;
                                }

                                rec.set('tsheetStatus', initialTimesheet.status);
                                // if (rec.get('empId') == settings.empId) {
                                //     tsRowGrid.columns[0].setHidden(false);
                                //     //return false;
                                // }

                            });
                            store.commitChanges();
                            if (showToast && store.data.length == 0) {
                                Ext.toast({
                                    html: 'Please add an entry by clicking "New Entry".',
                                    title: 'Add Entry',
                                    align: 'bl'
                                });
                            }
                        },
                        scope: me
                    });

                } else {
                    Ext.toast({
                        html: 'Please select an initial timesheet.',
                        title: 'Timesheet',
                        align: 'bl'
                    });
                    me.showTimesheetWindow();
                }
                me.getView().setLoading(false);
            } else {
                Ext.GlobalEvents.fireEvent('Error', 'Failed to load initial timesheets (' + response.message.mdBody + ').'); // TODO - Localization
            }
        }.bind(me));
    },

    disableTimesheet: function (status, grid) {
        var me = this,
            newEntryBtn = me.lookup('newEntryBtn'),
            copyBtn = me.lookup('copyBtn'),
            saveBtn = me.lookup('saveBtn'),
            submitBtn = me.lookup('submitBtn'),
            settings = TS.app.settings;

        if ((status == 'A') || (status == 'S' && !settings.tsAllowUnsubmit)) {
            newEntryBtn.setDisabled(true);
            copyBtn.setDisabled(true);
            saveBtn.setDisabled(true);
            submitBtn.setDisabled(true);
            //grid.setDisabled(true);
        } else {
            newEntryBtn.setDisabled(false);
            copyBtn.setDisabled(false);
            saveBtn.setDisabled(false);
            submitBtn.setDisabled(false);
            //grid.setDisabled(false);
        }
    },

    // Checks if the timesheet row grid has any unsaved data, if so prompt the user
    checkUnsaved: function (callback, type) {
        var store = Ext.first('grid-timesheetrow').getStore(),
            msg = !type ? 'You have unsaved changes. Do you want to discard your changes and continue?' : 'You have unsaved changes. These changes need to be saved to be reflected. Do you want continue?';

        if (store.getModifiedRecords() && store.getModifiedRecords().length > 0) {
            Ext.Msg.confirm('Unsaved Changes', msg, function (btn) {
                if (btn == 'yes') {
                    callback();
                }
            });
        } else {
            callback();
        }
    },

    // Send email from Timesheet
    showEmailWindow: function () {
        var selectedTsheet = this.getViewModel().get('selectedTimesheet'),
            periodId = selectedTsheet.get('tsPeriodId'),
            empId = selectedTsheet.get('empId'),
            settings = TS.app.settings;

        this.checkUnsaved(Ext.bind(function () {
            Ext.create('TS.common.window.Email', {
                appType: 'TS',
                empId: empId,
                modelId: periodId,
                infoText: 'Attach ' + settings.tsTitle
            }).show();
        }), true);
    }

});
