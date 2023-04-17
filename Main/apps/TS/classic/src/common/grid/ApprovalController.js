Ext.define('TS.common.grid.ApprovalController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.grid-approval',

    listen: {
        component: {
            // Refresh the grid whenever editor windows are closed
            'window-timesheetemployee': {
                close: function () {
                    this.getView().getView().refresh();
                }
            }
        },
        global: {
            'resetRejectPopup': 'sendApproveReject',
            'ApproveRejectTsAfterPinCheck': 'continueTimesheetApproval'
        }
    },

    acceptApproval: function (grid, rowIndex, colIndex) {
        var me = this,
            row = grid.getStore().getAt(rowIndex),
            settings = TS.app.settings,
            status = row.get('status');
        if (status == 'I') {
            Ext.Msg.show({
                title: 'Confirmation',
                message: 'Please confirm that you would like to approve this ' + settings.tsTitle.toLowerCase() + ' that is still IN-PROGRESS?',
                buttonText: {
                    yes: 'Confirm',
                    no: 'Cancel'
                },
                icon: Ext.Msg.QUESTION,
                fn: function (btn) {
                    if (btn === 'yes') {
                        me.sendApproveReject(grid, row, true);
                    } else if (btn === 'no') {
                        return;
                    }
                }
            });
        } else {
            me.sendApproveReject(grid, row, true);
        }

    },

    rejectApproval: function (grid, rowIndex, colIndex) {
        this.sendApproveReject(grid, grid.getStore().getAt(rowIndex), false);
    },

    sendApproveReject: function (grid, record, flag) {
        var me = this,
            settings = TS.app.settings,
            tsPeriodId = me.getView().selectedTimesheet.get('tsPeriodId'),
            timesheet = me.getView().selectedTimesheet.view,
            popup;

        if (settings.tsReqApprovalSignature) {
            popup = Ext.create('TS.view.tsa.TsaSubmitPin', {
                reference: 'tsaApprovalSubmitPinPanel',
                attType: 'Employee',
                title: !flag ? 'Reject ' + settings.tsTitle : 'Approve ' + settings.tsTitle,
                modal: true,
                associatedRecordId: tsPeriodId,
                grid: grid,
                record: record,
                flag: flag,
                attachmentsList: {
                    modelType: 'TSA',
                    tsPeriodId: tsPeriodId,
                    attachmentType: 'E'
                }
            }).show();
            popup.lookup('tsSubmitPinBtn').setText(!flag ? 'Reject ' : 'Approve ');
        } else {
            me.continueTimesheetApproval(grid, record, tsPeriodId, flag);
        }
    },

    continueTimesheetApproval: function (grid, record, tsPeriodId, flag, attachment) {
        var me = this,
            settings = TS.app.settings,
            signatureAttachment = attachment != null ? attachment.getData() : null;

        if(flag){  //comment = ''
            TimeSheet.ApproveRejectTimesheet(null, settings.username, tsPeriodId, record.get('empId'), flag, '', function (response, operation, success) {
                Ext.GlobalEvents.fireEvent('Message:Code', (flag ? 'timesheetApproveSuccess' : 'timesheetRejectSuccess'));
                //refresh grid
                grid.getStore().reload();
            }, me, {
                autoHandle: true
            });
        } else {
            Ext.Msg.prompt((flag ? 'Approval' : 'Rejection') + ' Comment', 'Please provide a comment for your ' + (flag ? 'approval' : 'rejection') + '.', function (btn, comment) {
                if (btn == 'ok') {
                    if (!flag && comment == '') {
                        //Ext.GlobalEvents.fireEvent('Message:Code', 'rejectionCommentRequired');
                        Ext.Msg.show({
                            title: 'Missing Comment',
                            message: 'Comments are required when rejecting a timesheet. Would you like to continue?',
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.WARNING,
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    Ext.GlobalEvents.fireEvent('resetRejectPopup', grid, record, flag);
                                }
                            }
                        });
                    } else {
                        if (comment == '') {
                            comment = 'NA';
                        }
                        //                               dbi,  username,          tsDate,     empId,               flag, comment, signatureAttachment
                        TimeSheet.ApproveRejectTimesheet(null, settings.username, tsPeriodId, record.get('empId'), flag, comment, function (response, operation, success) {
                            Ext.GlobalEvents.fireEvent('Message:Code', (flag ? 'timesheetApproveSuccess' : 'timesheetRejectSuccess'));
                            //refresh grid
                            grid.getStore().reload();
                        }, me, {
                            autoHandle: true
                        });
                    }
                }
            });
        }
    },

    populateCellHours: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var cell = this.getColumnCellData(colIndex, record),
            holidays = Ext.getStore('HolidaySchedule').getRange(),
            column = this.getView().columnManager.columns[colIndex],
            day;
        if (!cell) {
            day = Ext.Date.format(Ext.Date.parse(column.name, 'c'), DATE_FORMAT)
        }

        if (cell && (cell.ovtHrs || cell.ovt2Hrs || cell.travelHrs)) {
            metaData.tdStyle = 'background:#ffffad';
        } else {
            Ext.each(holidays, function (dt) {
                if (cell && cell.workDate) {
                    if (Ext.Date.format(new Date(cell.workDate), DATE_FORMAT) == Ext.Date.format(dt.get('holidayDate'), DATE_FORMAT))
                        metaData.tdStyle = 'background:#00FFFF';
                } else {
                    if (Ext.Date.format(new Date(day), DATE_FORMAT) == Ext.Date.format(dt.get('holidayDate'), DATE_FORMAT))
                        metaData.tdStyle = 'background:#00FFFF';
                }
            });
        }
        metaData.style = 'text-align:right;';

        return (cell ? (cell.regHrs + cell.ovtHrs + cell.ovt2Hrs + cell.travelHrs) : 0);

    },

    // Gets a cell object from the timesheet row record that matches a column index and record
    getColumnCellData: function (colIndex, record) {
        var column = this.getView().columnManager.columns[colIndex];
        if (!column) {
            return null;
        }
        var day = Ext.Date.format(Ext.Date.parse(column.name, 'c'), 'z'),
            value = record.get('cells'),
            returnCell = null;

        if (value && value.length > 0) {
            Ext.Array.each(value, function (cell) {
                var cellDay = Ext.Date.format(Ext.Date.parse(cell.workDate, 'c'), 'z');
                if (day == cellDay) {
                    returnCell = cell;
                }
            }, this);
        }

        return returnCell;
    },

    // Opens individual employee timesheet for period
    openTimesheetEditor: function (gridView, htmlElement, columnIndex, dataRecord) {
        if (columnIndex == 2 || columnIndex == 3) {
            var vm = this.getViewModel(),
                settings = TS.app.settings,
                w = window,
                d = document,
                e = d.documentElement,
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight || e.clientHeight || g.clientHeight,
                currentApproverCanModify = settings.tsApproverCanModify,
                selectedTsheet = vm.get('selectedTimesheet'),
                startDate = new Date(selectedTsheet.get('startDate')),
                tsDate = new Date(selectedTsheet.get('endDate'));

            if (dataRecord.get('status') == 'A' && dataRecord.get('visionStatus') == 'U') {
                vm.set('tsApproverCanModify', false);
            } else {
                vm.set('tsApproverCanModify', currentApproverCanModify);
            }
            vm.set('tsStatus', dataRecord.get('status') == 'A' && dataRecord.get('visionStatus') == 'U');

            Ext.create('TS.view.ts.TimesheetEmployee', {
                title: dataRecord.get('empName') + ': ' + Ext.Date.format(new Date(startDate), DATE_FORMAT) + ' - ' + Ext.Date.format(new Date(tsDate), DATE_FORMAT),
                employeeId: dataRecord.get('empId'),
                endDate: tsDate,
                modal: true,
                isPopup: true,
                employeeTimesheet: dataRecord,
                tsPeriodId: selectedTsheet.get('tsPeriodId'),
                width: x * .90,
                height: y * .90
            }).show();
        }
    }
});
