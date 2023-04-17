Ext.define('TS.controller.ts.TimesheetEmployeeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-timesheetemployee',

    init: function () {
        // Initially mask the viewport and load the initial timesheet
        this.getView().setLoading(true);
        this.getEmployeeTimesheet();
    },

    listen: {
        global: {
            'SubmitEmployeeAfterPinCheck': 'doSubmitTimesheet'
        }
    },

    // View listener method
    startNewTimesheetRow: function (a, b, c) {
        this.fireEvent('newtimesheetrow', 0);
    },

    // Checks the current date for a suitable matching timesheet and loads it
    // If none is found, opens the select prompt
    getEmployeeTimesheet: function () {

        var me = this,
            tsRowGrid = Ext.first('grid-timesheetrow'), //me.lookup('tsrowGrid'),
            settings = TS.app.settings,
            initialTimesheet = null,
            employeeId = me.getView().getEmployeeId(),
            endDate = me.getView().getEndDate();

        TimeSheet.GetByEmployeeByDate(null, settings.username, 0, 1000, employeeId, endDate, false, function (response, operation, success) {

            initialTimesheet = response.data;

            if (initialTimesheet) {
                tsRowGrid.getStore().getProxy().setExtraParams({
                    empId: employeeId,
                    tsDate: endDate,
                    includeCrewMembers: false
                });

                tsRowGrid.getStore().load({
                    callback: function (results, operation, success) {
                        if (success) {
                            me.setTimesheetViewModel(Ext.create('TS.model.ts.Tsheet', initialTimesheet));
                        }
                    },
                    scope: me
                });

                if (initialTimesheet.status == 'A' && initialTimesheet.visionStatus == 'U') {
                    tsRowGrid.setDisabled(true);
                }

                tsRowGrid.columns[0].setHidden(true);
                me.getView().setLoading(false);
            }

        }, me, {
            autoHandle: true
        });
    },

    setTimesheetViewModel: function (record) {

        var tsViewModel = this.getView().lookupViewModel(),
            employeeId = this.getView().getEmployeeId(),
            settings = TS.app.settings,
            employee = Ext.getStore('TsEmployees').getById(employeeId);
        tsViewModel.set({
            startDate: record.get('startDate'),
            endDate: record.get('endDate')
        });
        // Default to selected user values
        record.set('empId', employeeId);
        record.set('crewRoleId', employee.get('defaultCrewRoleId'));
        tsViewModel.set('employeeSelectedTimesheet', record);
    },

    onSubmitTimesheet: function (button, event) {
        var selectedTsheet = this.getViewModel().get('selectedTimesheet'),
            periodId = selectedTsheet.get('tsPeriodId'),
            empId = selectedTsheet.get('empId'),
            settings = TS.app.settings;

        if (settings.tsReqSubmitSignature) {
            Ext.create('TS.view.ts.TsSubmitPin', {
                reference: 'fwaSubmitPinPanel',
                attType: 'Employee',
                button: button,
                event: event,
                modal: true,
                tsEmployee: true,
                associatedRecordId: periodId,
                attachmentsList: {
                    modelType: 'TS',
                    modelId: periodId,
                    attachmentType: 'E'
                }
            }).show();
        } else {
            this.doSubmitTimesheet(button, event);
        }
    },

    doSubmitTimesheet: function (button, event, attachment) {
        var me = this,
            settings = TS.app.settings,
            tsRecord = me.getViewModel().get('employeeSelectedTimesheet'),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            tsRows = Ext.Array.pluck(tsRowGrid.getStore().getRange(), 'data'),
            btnId = button.id,
            signature,
            store;

        tsRecord.set('rows', tsRows);

        Ext.Msg.confirm('Please Confirm', 'Are you sure you want to save your changes and submit?', function (btn) {
            if (btn === 'yes') {
                signature = attachment != null ? attachment.getData() : null;
                TimeSheet.Submit(null, settings.username, tsRecord.data, signature, function (response, operation, success) {
                    if (response && response.success) {
                        if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                            Ext.Msg.show({
                                title: 'Warning',
                                scrollable: true,
                                minHeight: 150,
                                minWidth: 300,
                                message: me.getWarningMessage(response),
                                buttons: Ext.MessageBox.YESNO,
                                buttonText: {
                                    yes: 'YES',
                                    no: 'NO'
                                },
                                icon: Ext.Msg.INFO,
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        TimeSheet.SaveSubmitAfterWarning(null, settings.username, tsRecord.data, true, signature, function (response, operation, success) {
                                            Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetSubmitSuccess');
                                            tsRowGrid.getStore().commitChanges();
                                            store = TS.app.getViewport().lookup('tsApprovalGrid').getStore();
                                            store.reload();
                                            me.getView().close();
                                        }, me, {
                                            autoHandle: true
                                        });
                                    } else {
                                        return;
                                    }
                                }
                            });
                        } else {
                            Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetSubmitSuccess');
                            tsRowGrid.getStore().commitChanges();
                            store = TS.app.getViewport().lookup('tsApprovalGrid').getStore();
                            store.reload();
                            me.getView().close();
                        }
                    } else if (response) {
                        Ext.GlobalEvents.fireEvent('Error', Ext.JSON.encode(response)); // Message attribute is a list of TS.model.shared.Error
                    }
                });
            }
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

    onSaveTimesheet: function (button, event) {

        var settings = TS.app.settings,
            me = this,
            tsRecord = me.getViewModel().get('employeeSelectedTimesheet'),
            tsRowGrid = Ext.first('grid-timesheetrow'),
            tsRows = Ext.Array.pluck(tsRowGrid.getStore().getRange(), 'data'),
            btnId = button.id,
            vm = me.getViewModel();

        tsRecord.set('rows', tsRows);

        TimeSheet.Save(null, settings.username, tsRecord.data, vm.get('isTimesheetApproval'), function (response, operation, success) {
            if (response && response.success) {
                if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                    Ext.Msg.show({
                        title: 'Warning',
                        scrollable: true,
                        minHeight: 150,
                        minWidth: 300,
                        message: me.getWarningMessage(response),
                        buttons: Ext.MessageBox.YESNO,
                        buttonText: {
                            yes: 'YES',
                            no: 'NO'
                        },
                        icon: Ext.Msg.INFO,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                TimeSheet.SaveSubmitAfterWarning(null, settings.username, tsRecord.data, false, null, function (response, operation, success) {
                                    var store = TS.app.getViewport().lookup('tsApprovalGrid').getStore();
                                    store.reload();
                                    Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetSaveSuccess');
                                    tsRowGrid.getStore().commitChanges();
                                    me.getView().close();
                                }, me, {
                                    autoHandle: true
                                });
                            } else {
                                return;
                            }
                        }
                    });
                } else {
                    var store = TS.app.getViewport().lookup('tsApprovalGrid').getStore();
                    store.reload();
                    Ext.GlobalEvents.fireEvent('Message:Code', 'timesheetSaveSuccess');
                    tsRowGrid.getStore().commitChanges();
                    me.getView().close();
                }
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error:MsgBox', Ext.JSON.encode(response)); //message attribute is a list of TS.model.shared.Error

            }
        });

    },

    approveTimesheet: function () {
        var settings = TS.app.settings,
            me = this,
            tsRecord = me.getViewModel().get('employeeSelectedTimesheet');
        if (tsRecord.get('status') != 'S') {
            Ext.Msg.confirm('Confirmation', 'Please confirm that you would like to approve this ' + settings.tsTitle.toLowerCase() + ' that is still IN-PROGRESS? Timesheet validation rules will not be run.', function (btn) {
                if (btn === 'yes') {
                    me.sendApproveReject(true);
                } else if (btn === 'no') {

                }
            });
        } else {
            me.sendApproveReject(true);
        }
    },

    rejectTimesheet: function () {
        this.sendApproveReject(false);
    },

    sendApproveReject: function (flag) {

        var me = this,
            settings = TS.app.settings,
            tsPeriodId = me.getView().getTsPeriodId(),
            empId = me.getView().getEmployeeId(),
            store;

        Ext.Msg.prompt((flag ? 'Approval' : 'Rejection') + ' Comment', 'Please provide a comment for your ' + (flag ? 'approval' : 'rejection') + '.', function (btn, comment) {
            if (btn == 'ok') {
                if (!flag && comment == '') {
                    Ext.GlobalEvents.fireEvent('Message:Code', 'rejectionCommentRequired');
                } else {
                    if (comment == '') {
                        comment = 'NA';
                    }
                    //	 dbi,  username,		  tsDate,	  empId,			   flag, comment
                    TimeSheet.ApproveRejectTimesheet(null, settings.username, tsPeriodId, empId, flag, comment, function (response, operation, success) {
                        Ext.GlobalEvents.fireEvent('Message:Code', (flag ? 'timesheetApproveSuccess' : 'timesheetRejectSuccess'));
                        //refresh parent grid
                        store = TS.app.getViewport().lookup('tsApprovalGrid').getStore();
                        store.reload();
                    }, me, {
                        autoHandle: true
                    });
                }
            }
        });
        me.getView().close();
    },

    onClose: function () {

        var me = this,
            tsPeriodId = me.getView().getTsPeriodId(),
            //this is the parent screen
            store = TS.app.getViewport().lookup('tsApprovalGrid').getStore(),
            //this is the popup screen with daily hours
            empStore = me.getView().lookup('employeeTimesheetGrid').store,
            records = empStore.getRange(),
            isDirty = false;

        Ext.each(records, function (rec) {
            if (rec.dirty) {
                isDirty = true;
            }
        });

        if (isDirty) {
            Ext.Msg.show({
                title: 'Warning'
                , msg: 'Changes have been made. Do you want to continue without saving?'
                , buttons: Ext.Msg.YESNO
                , callback: function (btn) {
                    if ('yes' === btn) {
                        store.getProxy().extraParams.tsPeriodId = tsPeriodId;
                        store.load();
                        me.getView().close();
                    } else {
                        return false;
                    }
                }
            });
        } else {
            store.getProxy().extraParams.tsPeriodId = tsPeriodId;
            store.load();
            me.getView().close();
        }
    },

    onClickClose: function () {
        this.getView().close();
    },

    onTsEmployeeClose: function (win) {
        var me = this,
            store = me.getView().lookup('employeeTimesheetGrid').store,
            records = store.getRange(),
            isDirty = false;

        Ext.each(records, function (rec) {
            if (rec.dirty) {
                isDirty = true;
            }
        });

        // user has already answered yes
        if (win.closeMe) {
            win.closeMe = false;
            return true;
        }

        if (isDirty) {
            // ask user if really close
            Ext.Msg.show({
                title: 'Warning'
                , msg: 'Changes have been made. Do you want to continue without saving?'
                , buttons: Ext.Msg.YESNO
                , callback: function (btn) {
                    if ('yes' === btn) {
                        store.rejectChanges();
                        // save the user answer
                        win.closeMe = true;
                        // call close once again
                        win.close();
                    }
                }
            });
        } else {
            store.rejectChanges();
            // save the user answer
            win.closeMe = true;
            // call close once again
            win.close();
        }

        // Always cancel closing if we get here
        return false;
    }
});