Ext.define('TS.controller.ts.TimesheetRowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.grid-timesheetrow',

    listen: {
        controller: {
            '*': {
                'newtimesheetrow': 'insertNewTimesheetRow'
            }
        },
        component: {
            // Refresh the grid whenever editor windows are closed
            'window-houreditor, window-projecteditor, window-approval': {
                close: function () {
                    this.getView().getView().refresh();
                }
            }
        }
    },

    insertNewTimesheetRow: function (rowIndex, recordCopy) {
        // Add the new record to the store, and reset the EmpId
        var me = this,
            selectedEmp = Ext.first('window-timesheetemployee') ? Ext.first('window-timesheetemployee').employeeId : '',
            settings = TS.app.settings,
            store = me.getView().getStore(),
            grouperCfg = store.getGrouper().getConfig(),
            record,
            newRec = recordCopy || Ext.create('TS.model.ts.TsRow'),
            employee = Ext.getStore('TsEmployees').getById(selectedEmp || settings.empId),
            vm = me.getViewModel();

        //Sencha
        //EXTJS-16685
        //Grouped grid does not respect store.insert(index)

        //turn off so row is added at top
        store.setRemoteSort(false);
        store.clearGrouping();
        // If we are copying a record, set default cells
        if (recordCopy) {
            newRec.set('cells', [], {
                silent: true
            });
        }

        if(newRec.set('cells') == null){
            newRec.set('cells', [], {
                silent: true
            });
        }
        record = store.insert(rowIndex, newRec)[0];
        vm.set('isNewRecord', false);
        // Default to logged in user values
        // newRec.set('empId', settings.empId);
        // newRec.set('crewRoleId', employee.get('defaultCrewRoleId'));
        // newRec.set('isNewRecord', true);
        newRec.data.empId = selectedEmp || settings.empId;
        newRec.data.crewRoleId = employee.get('defaultCrewRoleId');
        newRec.data.isNewRecord = true;

        //turn back on
        store.group(grouperCfg);
        store.setRemoteSort(true);

        // If not a record copy, open the project editor
        if (!recordCopy) {
            me.showProjectEditor(me.getView(), newRec);
        }

        //------------

        me.getView().getView().refresh(); // TODO View should update automatically.
    },

    deleteTimesheetRow: function (grid, rowIndex) {
        //Workaround
        var store = grid.getStore(),
            settings = TS.app.settings,
            grouperCfg = store.getGrouper().getConfig();

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to delete this " + settings.tsTitle + " entry?", function (btn) {
            if (btn == 'yes') {
                store.setRemoteSort(false);
                store.clearGrouping();
                store.removeAt(rowIndex);
                store.group(grouperCfg);
                store.setRemoteSort(true);
            }
        });
    },

    copyTimesheetRow: function (grid, rowIndex) {
        var store = grid.getStore(),
            settings = TS.app.settings,
            rowCt = store.getRange().length,
            grouperCfg = store.getGrouper().getConfig(),
            data = store.getRange()[rowIndex],
            billCatTable = Ext.getStore('BillCategory'),
            billCategory = billCatTable.getById(data.get('billCategory')),
            billCategoryName = billCategory.get('description'),
            newTsRow = new TS.model.ts.TsRow({
                seq: rowCt + 1,
                rowNum: rowCt + 1,
                chargeType: data.get('chargeType'),
                clientId: data.get('clientId'),
                clientName: data.get('clientName'),
                clientNumber: data.get('clientNumber'),
                crewRoleId: data.get('crewRoleId'),
                empId: data.get('empId'),
                empName: data.get('empName'),
                laborCode: data.get('laborCode'),
                projectId: data.get('projectId'),
                tsheetStatus: data.get('tsheetStatus'),
                wbs1: data.get('wbs1'),
                wbs1Name: data.get('wbs1Name'),
                wbs2: data.get('wbs2'),
                wbs2Name: data.get('wbs2Name'),
                wbe3: data.get('wbe3'),
                wbs3Name: data.get('wbs3Name'),
                billCategory: data.get('billCategory'),
                billCategoryName: billCategoryName
            });

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to copy this " + settings.tsTitle + " row entry?", function (btn) {
            if (btn == 'yes') {
                store.setRemoteSort(false);
                store.clearGrouping();
                store.add(newTsRow);
                store.group(grouperCfg);
                store.setRemoteSort(true);
            }
        });
    },

    showProjectEditor: function (view, record) {
        var me = this,
            data = record.data,
            settings = TS.app.settings,
            win;

        if (me.win) {
            me.win.destroy();
        }

        me.win = Ext.create({
            xtype: 'window-projecteditor',
            projectData: data,
            parentView: view,
            groupRecords: view.getStore().getGroups().getByKey(''),
            group: '',
            modal: true
        });

        if (settings.tsDisplayLaborCode != 'N') {
            me.win.lookup('fwalaborcode').show();
        }

        if (settings.tsDisplayBillCat != 'N') {
            me.win.lookup('fwabillcatid').show();
        }
    },

    // Shows the editor for the timesheet row project fields
    startEditViaGroup: function (view, node, group, e, eOpts) {
        var me = this,
            vm = me.getViewModel(),
            record = e.record,
            data = record.data,
            settings = TS.app.settings,
            win,
            readOnly = true;
        //check tsheet status
        if (vm.get('isTimesheet')) {
            if (record.get('tsheetStatus') == TsStatus.Approved || record.get('tsheetStatus') == TsStatus.Submitted) {
                if (!settings.tsApproverCanModify && settings.tsIsApprover) {
                    if (!settings.tsAllowUnsubmit) {
                        return;
                    }
                }
                if (!settings.tsIsApprover) {
                    return;
                }
            }
        } else if (vm.get('isTimesheetApproval')) {
            if (record.get('tsheetStatus') == TsStatus.Approved || (record.get('tsheetStatus') == TsStatus.Submitted && !settings.tsAllowUnsubmit) || !settings.tsApproverCanModify) {
                return;
            }
        }


        // If we are actually clicking on the add row icon
        if (Ext.get(e.getTarget()).hasCls('add-group-tsrow')) {
            view.getStore().setRemoteSort(false);//remove remote sort so grid sort locally
            me.insertNewTimesheetRow(e.position.rowIdx, (e.record ? e.record.copy(null) : null));
            return false;
        }

        if (me.win) {
            me.win.destroy();
        }

        me.win = Ext.create({
            xtype: 'window-projecteditor',
            projectData: data,
            //TODO getGroups() returns Read-only records that should nobe modified!
            // http://docs.sencha.com/extjs/6.0/6.0.2-classic/#!/api/Ext.data.AbstractStore-method-getGroups
            // look for fix in this class controller
            parentView: view,
            groupRecords: view.getStore().getGroups().getByKey(group), // TODO Fix all usages
            group: group,
            readOnly: readOnly,
            modal: true
        });

        if (settings.tsDisplayLaborCode != 'N') {
            me.win.lookup('fwalaborcode').show();
        }

        if (settings.tsDisplayBillCat != 'N') {
            me.win.lookup('fwabillcatid').show();
        }
        //hide update button if popup
        me.win.lookup('updateProjectBtn').setHidden(vm.get('isFwaViewTS') || !settings.tsApproverCanModify);
    },

    populateCellHours: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var cell = this.getColumnCellData(colIndex, record),
            settings = TS.app.settings,
            holidays = Ext.getStore('HolidaySchedule').getRange(),
            column = this.getView().normalGrid.columnManager.columns[colIndex],
            day;

        if (!cell) {
            day = Ext.Date.format(Ext.Date.parse(column.name, 'c'), DATE_FORMAT)
        }
        ttl = 0;
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
        if (cell) {
            ttl += cell.regHrs;
            if (settings.tsAllowOvtHrs) ttl += cell.ovtHrs;
            if (settings.tsAllowOvt2Hrs) ttl += cell.ovt2Hrs;
            if (settings.tsAllowTravelHrs) ttl += cell.travelHrs;
            return ttl;
        } else {
            return 0;
        }
    },

    /*
     * Summary Methods
     */
    //daily total
    columnSummaryTotal: function (value, summaryData, dataIndex, metaData) {
        var me = this,
            vm = me.getViewModel(),
            columnIndex = metaData.column.fullColumnIndex,
            settings = TS.app.settings,
            renderValue = 0,
            ttlReg = 0,
            ttlOvt = 0,
            ttlOvt2 = 0,
            ttlTravel = 0,
            isTS = vm.get('isTimesheet'),
            isTSA = vm.get('isTimesheetApproval'),
            isEmployeeSelectedTS = vm.get('employeeSelectedTimesheet'),
            holidays = Ext.getStore('HolidaySchedule').getRange(),
            background = '',
            html;

        me.getView().getStore().each(function (record) {
            var cell = me.getColumnCellData(columnIndex, record);

            //only total hours for the user who is logged in but only if not a emp selected
            if (isEmployeeSelectedTS || isTSA) {
                if (cell) {
                    Ext.each(holidays, function (dt) {
                        if (Ext.Date.format(new Date(cell.workDate), DATE_FORMAT) == Ext.Date.format(dt.get('holidayDate'), DATE_FORMAT))
                            background = 'background:#00FFFF';
                    });
                    renderValue += (cell.regHrs);
                    if (settings.tsAllowOvtHrs) renderValue += cell.ovtHrs;
                    if (settings.tsAllowOvt2Hrs) renderValue += cell.ovt2Hrs;
                    if (settings.tsAllowTravelHrs) renderValue += cell.travelHrs;

                    ttlReg += cell.regHrs;
                    ttlOvt += cell.ovtHrs;
                    ttlOvt2 += cell.ovt2Hrs;
                    ttlTravel += cell.travelHrs;

                }
            } else {
                if (cell && record.get('empId') == settings.empId) {
                    renderValue += (cell.regHrs);

                    if (settings.tsAllowOvtHrs) renderValue += cell.ovtHrs;
                    if (settings.tsAllowOvt2Hrs) renderValue += cell.ovt2Hrs;
                    if (settings.tsAllowTravelHrs) renderValue += cell.travelHrs;

                    ttlReg += cell.regHrs;
                    ttlOvt += cell.ovtHrs;
                    ttlOvt2 += cell.ovt2Hrs;
                    ttlTravel += cell.travelHrs;

                    Ext.each(holidays, function (dt) {
                        if (Ext.Date.format(new Date(cell.workDate), DATE_FORMAT) == Ext.Date.format(dt.get('holidayDate'), DATE_FORMAT))
                            background = 'background:#00FFFF';
                    });
                }
            }
        }, me);

        html = '<div style="text-align:right;font-weight:bold;">' + renderValue + '</div>' +
            '<div><hr style="border-color:#8e8e8e"></div>' +
            '<div style="text-align:right;font-weight:bold;color:#707070">' + ttlReg + '</div>';
        if (settings.tsAllowOvtHrs) html += '<div style="text-align:right;font-weight:bold;color:#707070">' + ttlOvt + '</div>';
        if (settings.tsAllowOvt2Hrs) html += '<div style="text-align:right;font-weight:bold;color:#707070">' + ttlOvt2 + '</div>';
        if (settings.tsAllowTravelHrs) html += '<div style="text-align:right;font-weight:bold;color:#707070">' + ttlTravel + '</div>';

        return html;
    },
    //total total
    columnSummaryAllTotals: function (value, summaryData, dataIndex, metaData) {
        var renderValue = 0,
            ttlReg = 0,
            ttlOvt = 0,
            ttlOvt2 = 0,
            ttlTravel = 0,
            settings = TS.app.settings,
            isTsApproval = this.getView().isTsApproval,
            html;

        this.getView().getStore().each(function (record) {
            var cells = record.get('cells');
            //only total hours for the user who is logged in
            if (!cells) return;
            if (!isTsApproval) {
                if (record.get('empId') == settings.empId) {
                    Ext.Array.each(cells, function (cell) {
                        renderValue += (cell.regHrs);

                        if (settings.tsAllowOvtHrs) renderValue += cell.ovtHrs;
                        if (settings.tsAllowOvt2Hrs) renderValue += cell.ovt2Hrs;
                        if (settings.tsAllowTravelHrs) renderValue += cell.travelHrs;

                        ttlReg += cell.regHrs;
                        ttlOvt += cell.ovtHrs;
                        ttlOvt2 += cell.ovt2Hrs;
                        ttlTravel += cell.travelHrs;
                    });
                }
            } else {
                Ext.Array.each(cells, function (cell) {
                    renderValue += (cell.regHrs);

                    if (settings.tsAllowOvtHrs) renderValue += cell.ovtHrs;
                    if (settings.tsAllowOvt2Hrs) renderValue += cell.ovt2Hrs;
                    if (settings.tsAllowTravelHrs) renderValue += cell.travelHrs;

                    ttlReg += cell.regHrs;
                    ttlOvt += cell.ovtHrs;
                    ttlOvt2 += cell.ovt2Hrs;
                    ttlTravel += cell.travelHrs;
                });
            }
        });

        html = '<div style="text-align:right;font-weight:bold;white-space: nowrap;">' + parseFloat(Math.round((renderValue || 0) * 100) / 100).toFixed(2) + '</div>' +
            '<div><hr style="border-color:#8e8e8e"></div>' +
            '<div style="text-align:right;font-weight:bold;white-space: nowrap;color:#707070">' + parseFloat(Math.round((ttlReg || 0) * 100) / 100).toFixed(2) + '</div>';
        if (settings.tsAllowOvtHrs) html += '<div style="text-align:right;font-weight:bold;white-space: nowrap;color:#707070">' + parseFloat(Math.round((ttlOvt || 0) * 100) / 100).toFixed(2) + '</div>';
        if (settings.tsAllowOvt2Hrs) html += '<div style="text-align:right;font-weight:bold;white-space: nowrap;color:#707070">' + parseFloat(Math.round((ttlOvt2 || 0) * 100) / 100).toFixed(2) + '</div>';
        if (settings.tsAllowTravelHrs) html += '<div style="text-align:right;font-weight:bold;white-space: nowrap;color:#707070">' + parseFloat(Math.round((ttlTravel || 0) * 100) / 100).toFixed(2) + '</div>';

        return html;
    },

    columnSummaryAllTotalsHeader: function (value, summaryData, dataIndex, metaData) {
        var settings = TS.app.settings,
            html;
        html = '<div style="text-align:right;font-weight:bold;white-space: nowrap;"> Total Hrs: </div>' +
            '<div><hr style="border-color:#8e8e8e"></div>' +
            '<div style="text-align:right;font-weight:bold;white-space: nowrap;color:#707070;"> Reg: </div>';
        if (settings.tsAllowOvtHrs) html += '<div style="text-align:right;font-weight:bold;white-space: nowrap;color:#707070;"> Ovt: </div>';
        if (settings.tsAllowOvt2Hrs) html += '<div style="text-align:right;font-weight:bold;white-space: nowrap;color:#707070;"> Ovt2: </div>';
        if (settings.tsAllowTravelHrs) html += '<div style="text-align:right;font-weight:bold;white-space: nowrap;color:#707070;"> Travel: </div>';

        return html;
    },

    /*
     * Opens the hour editor when a grid cell is clicked
     */
    openHoursEditor: function (table, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var me = this,
            workDate = me.getView().normalGrid.columnManager.columns[cellIndex].name,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            cell,
            hourEditorView;
        //Only enable editing of hour cells.
        if (table.headerCt.getGridColumns()[cellIndex].dataIndex != 'Cells') return;

        //check if user can edit fellow employee hours
        if (!settings.tsCanEnterCrewMemberTime && settings.empId != record.get('empId') && !vm.get('isTimesheetApproval')) return;
        //if(vm.get('isTimesheetApproval') && !vm.get('tsApproverCanModify')) return;
        cell = me.getColumnCellData(cellIndex, record);
        // Close any existing open windows
        if (me.hourEditorView) {
            me.hourEditorView.close();
        }

        me.hourEditorView = Ext.create({
            xtype: 'window-houreditor',
            cell: cell,
            autoShow: true,
            tsRowRecord: record,
            tsWorkDate: workDate,
            modal: true
        });

        // //show- hide buttons if from FWA form
        me.hourEditorView.lookup('saveTsCellHoursBtn').setHidden(vm.get('isFwaViewTS'));
        me.hourEditorView.lookup('fwaButton').setHidden(vm.get('isFwaViewTS') || !cell || (cell && !cell['fwaId']));
        me.hourEditorView.lookup('fwaButton').setDisabled(false);
        me.getView().add(me.hourEditorView);
    },

    // Checks if a timesheet row is read only and stops any click events
    stopReadOnly: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        // Reject any clicks on a readonly row
        var vm = this.getViewModel(),
            settings = TS.app.settings;
        if (Ext.get(tr).hasCls('readonly-row') && !vm.get('isTsApprover') && !vm.get('isTimesheetApproval')) {
            return false;
        } else if ((record.get('tsheetStatus') == TsStatus.Approved) || (record.get('tsheetStatus') == TsStatus.Submitted && !settings.tsAllowUnsubmit)) {
            Ext.Msg.alert('Warning', settings.tsTitle + ' has been approved/submitted and hours cannot be changed.');
            return false;
        } else if (!settings.tsCanEnterCrewMemberTime && settings.empId != record.get('empId') && !vm.get('isTimesheetApproval')) {
            return false;
        }
    },

    // Gets a cell object from the timesheet row record that matches a column index and record
    getColumnCellData: function (colIndex, record) {
        var column = this.getView().normalGrid.columnManager.columns[colIndex];
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

    setProjectValues: function (wbs1, wbs2, wbs3) {
        // Up to editor
        Ext.first('window-projecteditor').getController().setProjectValues(wbs1, wbs2, wbs3);
    },

    setLaborCode: function (laborCode) {
        // Up to editor
        Ext.first('window-projecteditor').getController().setLaborCode(laborCode);
    },

    headerClickStartEnd: function (ct, column, e, t) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            empName = settings.empName,
            dt = Ext.Date.format(new Date(column.name), DATE_FORMAT),
            record = vm.get('selectedTimesheet'),
            startEndTimes = vm.get('selectedTimesheet').get('startEndTimes'),
            dayCount = Ext.Date.diff(record.get('startDate'), record.get('endDate'), Ext.Date.DAY) + 1;
        //show/hide start end time
        if (settings.displayStartEndTime != 'D') {
            return;
        }
        if(!startEndTimes || startEndTimes.length == 0){
            startEndTimes = [];
            for (var i = 0; i < dayCount; i++) {
                startEndTimes.push({
                    empId: record.get('empId'),
                    workDate: Ext.Date.add(record.get('startDate'), Ext.Date.DAY, i),
                    startTime: '6:00 AM',
                    endTime: '6:00 PM'
                });
            }
        }

        vm.get('selectedTimesheet').set('startEndTimes', startEndTimes);
        record.set('startEndTimes', startEndTimes);

        me.startEndTimeView = Ext.create({
            xtype: 'window-startendtimeeditor',
            title: 'Start/End Time for ' + empName + ' on ' + dt,
            autoShow: true,
            tsRowRecord: record,
            workDate: dt
        });
    },

    saveStartEndTime: function () {
        Ext.first('#startEndPopoup').close();
    },

    cancelStartEndTime: function () {
        Ext.first('#startEndPopoup').close();
    }
});
