Ext.define('TS.controller.tsa.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.tsa-main',

    control: {
        'button[action=tssign]': {
            tap: 'tsSubmitPinClick'
        },
        'button[action=close]': {
            tap: 'onCloseSheet'
        },
        'button[action=tsa-sign]': {
            tap: 'tsaSubmitPinClick'
        }
    },

    onBackToFSS: function () {
        var me = this;
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS', me);
        Ext.Viewport.setActiveItem('app-fss');
    },

    editSelectedTimesheetPeriod: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            selection = vm.get('selectedTSA'),
            selectedDay = vm.get('selectedDay'),
            format = function (v) {
                return Ext.Date.format(v, DATE_FORMAT);
            },
            s = selection.get('startDate'),
            e = selection.get('endDate'),
            startDate,
            endDate,
            store;

        startDate = s;// new Date((s.getUTCMonth() + 1) + '/' + s.getUTCDate() + '/' + s.getUTCFullYear());
        endDate = e; //new Date((e.getUTCMonth() + 1) + '/' + e.getUTCDate() + '/' + e.getUTCFullYear());
        //added so we can build template for display of timesheet period dates & hours
        settings.tsStartDate = format(startDate);
        settings.tsEndDate = format(endDate);

        vm.set('startDate', startDate);
        vm.set('endDate', endDate);

        store = vm.getStore('tsaapprovallist');
        store.getProxy().setExtraParams({
            tsPeriodId: selection.get('tsPeriodId')
        });
        store.load({
            scope: me,
            callback: function () {
                // me.adjustTotalHours(store);
            }
        });

        me.getView().setActiveItem(1);
        selection.dirty = false;
        if (selectedDay) selectedDay.dirty = false;
    },

    onEditSelectedTimesheet: function () {

        var me = this,
            vm = me.getViewModel(),
            currentApproverCanModify = vm.get('tsApproverCanModify'),
            settings = TS.app.settings,
            currentTsRow = vm.get('currentTSARow'),
            selection = vm.get('selectedTSA'),
            selectedDay = vm.get('selectedDay'),
            format = function (v) {
                return Ext.Date.format(v, DATE_FORMAT);
            },
            s = selection.get('startDate'),
            e = selection.get('endDate'),
            startDate,
            endDate,
            store = vm.getStore('tsrow'),
            tsStore = vm.getStore('tsheet');

        if (currentTsRow.get('status') == TsStatus.Approved && currentTsRow.get('visionStatus') == 'U') {
            vm.set('tsApproverCanModify', false);
        } else {
            vm.set('tsApproverCanModify', currentApproverCanModify);
        }

        startDate = s; // new Date((s.getUTCMonth() + 1) + '/' + s.getUTCDate() + '/' + s.getUTCFullYear());
        endDate = e; //new Date((e.getUTCMonth() + 1) + '/' + e.getUTCDate() + '/' + e.getUTCFullYear());
        //added so we can build template for display of timesheet period dates & hours
        settings.tsStartDate = format(startDate);
        settings.tsEndDate = format(endDate);

        vm.set('startDate', startDate);
        vm.set('endDate', endDate);

        store.getProxy().setExtraParams({
            empId: currentTsRow.get('empId'),
            tsDate: endDate,
            includeCrewMembers: false // no other crew members, just selected employee
        });
        store.load({
            scope: me,
            callback: function () {
                me.adjustTotalHours(store, currentTsRow.get('empId'));
            }
        });
        //we need ts store for save/submit
        tsStore.getProxy().setExtraParams({
            empId: currentTsRow.get('empId')
        });
        tsStore.load();
        tsStore.filterBy(function (rec) {
            return rec.get('tsPeriodId') === selection.getId();
        });

        vm.set('tsStatus', selection.get('status'));
        // sets to dirty on load, so reset
        currentTsRow.dirty = false;
        if (selectedDay) selectedDay.dirty = false;
        me.getView().setActiveItem(2);
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
                    vm.set('currentTSARow', null);
                }
            });
        } else {
            view.setActiveItem(--idx);
            vm.set('currentTSARow', null);
        }
    },

    onCloseSheet: function (bt) {
        bt.up('sheet').hide();
    },

    onTsSelectionChange: function (rec, records, eOpts) {
        var me = this,
            rejectBtn = Ext.first('#rejectTsButton'),
            approveBtn = Ext.first('#approveTsButton');
        rejectBtn.setHidden(records[0].get('status') === TsStatus.Blank || (records[0].get('status') == TsStatus.Approved && records[0].get('visionStatus') == 'U'));
        approveBtn.setHidden(records[0].get('status') === TsStatus.Blank || (records[0].get('status') == TsStatus.Approved && records[0].get('visionStatus') == 'U'));
    },

    onMenuApprove: function (bt) {
        this.approveSelectedTimesheet();
        bt.up('tsa-editmenu').hide();
    },

    approveSelectedTimesheet: function () {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('currentTSARow'),
            status = selection.get('status'),
            settings = TS.app.settings,
            baseView = Ext.first('app-tsa'),
            sheet;
        if (status === 'I') {
            Ext.Msg.confirm('Confirmation', 'Please confirm that you would like to approve this ' + settings.tsTitle.toLowerCase() + ' that is still IN-PROGRESS? Timesheet validation rules will not be run.', function (btn) {
                if (btn === 'yes') {
                    me.onApproveTimeSheet();
                } else if (btn === 'no') {

                }
            });
        } else {

            me.onApproveTimeSheet();
        }
    },

    onApproveTimeSheet: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            selection = vm.get('selectedTSA'),
            periodId = selection.get('tsPeriodId'),
            baseView = Ext.first('app-tsa'),
            sheet;

        if (settings.tsReqApprovalSignature) {
            sheet = Ext.create({
                xtype: 'tsa-submitpin',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                attType: 'Employee',
                associatedRecordId: periodId,
                attachmentsList: {
                    modelType: 'TSA',
                    modelId: periodId,
                    attachmentType: 'E'
                }
            });
            baseView.add(sheet);
            sheet.show();
        } else {
            me.continueAfterApprovalSignature();
        }
    },

    continueAfterApprovalSignature: function (btn, attachment) {
        // var me = this
            // baseView = Ext.first('app-tsa');
            // sheet = Ext.create({
            //     xtype: 'tsa-approvereject',
            //     viewModel: {
            //         parent: me.getViewModel()
            //     },
            //     approvalType: 'Approval',
            //     attachment: attachment
            // });

        // Ext.first('#approveRejectTitleText').setTitle('Approval Comment');
        // Ext.first('#approveRejectCommentText').setHtml('Please provide a comment for your approval.');
        // if (btn) {
        //     btn.up('sheet').hide();
        // }
        // baseView.add(sheet);
        // sheet.show();

        this.sendApproveReject(btn, true);
    },

    onMenuReject: function (bt) {
        this.rejectSelectedTimesheet();
        bt.up('tsa-editmenu').hide();
    }
    ,

    rejectSelectedTimesheet: function () {
        var me = this,
            baseView = Ext.first('app-tsa'),
            sheet = Ext.create({
                xtype: 'tsa-approvereject',
                viewModel: {
                    parent: me.getViewModel()
                },
                approvalType: 'Rejection'
            });

        Ext.first('#approveRejectTitleText').setTitle('Rejection Comment');
        Ext.first('#approveRejectCommentText').setHtml('Please provide a comment for your rejection.');
        baseView.add(sheet);
        sheet.show();
    }
    ,

    sendApproveReject: function (bt, isApproval) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            currentTSARow = vm.get('currentTSARow'),
            tsPeriodId = vm.get('selectedTSA').get('tsPeriodId'),
            view = me.getView(),
            //isApproval = Ext.first('tsa-approvereject').approvalType === 'Approval',
            attachment = isApproval ? null : Ext.first('tsa-approvereject').attachment,
            comments = isApproval ? '' : Ext.first('#approveRejectComment').getValue(),
            idx = view.innerItems.indexOf(view.getActiveItem()),
            store = vm.getStore('tsaapprovallist'),
            approvalStore = vm.getStore('tsasheet'),
            signatureAttachment = attachment != null ? attachment.getData() : null;

        if (!isApproval && (!comments || comments == '')) {
            Ext.Msg.alert('Missing Comment', settings.tsTitle + ' comments are required when rejecting.');
            return;
        }
        //signatureAttachment,
        TimeSheet.ApproveRejectTimesheet(null, settings.username, tsPeriodId, currentTSARow.get('empId'), isApproval, comments || '', function (response, operation, success) {
            store.reload();
            approvalStore.reload();
        }, me, {
            autoHandle: true
        });

        bt.up('sheet').hide();
        //view.setActiveItem(--idx);
    }
    ,

    onHoursTap: function (list, index, target, record) {
        var me = this,
            vm = me.getViewModel();
        vm.set('currentTSRow', record);
        this.onHours(list, record);
    }
    ,

    onHours: function () {
        var d = Ext.Date,
            me = this,
            vm = me.getViewModel(),
            hoursview = vm.getStore('hoursview'),
            hoursList = Ext.first('ts-hours').down('list'),
            settings = TS.app.settings,
            cells = vm.get('currentTSRow').cells().getRange(),
            cDate = vm.get('startDate'),
            days = vm.get('dayCount'),
            deleteButton = Ext.first('#deleteRowButton'),
            copyButton = Ext.first('#copyRowButton'),
            employeeSelect = Ext.first('#hoursEmployee'),
            empId = vm.get('currentTSRow').get('empId'),
            arr = [],
            placeholderRec,
            dateString,
            i = 0,
            timePeriodTtl = 0,
            groupHeader = TS.common.Util.createGroupHeader(vm.get('currentTSRow')),
            n;

        //don't allow edit based on timesheet status & visionStatus
        if (vm.get('currentTSRow').get('status') == TsStatus.Approved && vm.get('currentTSRow').get('visionStatus') == 'U') {
            return false;
        }

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
                endTime: dateString
            });

            arr.push(placeholderRec);
            cDate = d.add(new Date(cDate), d.DAY, 1);
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
        //set remote sort so arr is not rearranged in store
        hoursview.setRemoteSort(true);
        hoursview.loadRawData(arr);
        //Change page
        me.getView().setActiveItem(3);
        me.calculatePeriodTtlHrs();
        //set employee name, only empId found when no project (i.e. no hours/entries)
        vm.get('currentTSRow').set('empName', Ext.getStore('TsEmployees').getById(empId).get('empName'));
        //because this is ts approval, we cannot delete or edit
        deleteButton.setHidden(!settings.tsApproverCanModify);
        copyButton.setHidden(!settings.tsApproverCanModify);
        employeeSelect.setReadOnly(true);
        Ext.first('ts-hours').down('titlebar[docked=top]').setTitle('Approval Hours');
        //dirty from being created, set to false
        vm.get('currentTSRow').dirty = false;
    }
    ,

    adjustTotalHours: function (store, empId) {
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
    }
    ,

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
    }
    ,

    onMenuTap: function (bt) {
        this.getView().add({xtype: 'tsa-editmenu'}).show();
    }
    ,

    onBackBt: function () {
        var view = this.getView(),
            idx = view.innerItems.indexOf(view.getActiveItem());

        view.setActiveItem(--idx);
    }
    ,

    onBeforeHoursBack: function (bt) {
        var me = this,
            ts = Ext.first('tsa-timesheet'),
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
    }
    ,

    onHoursEditTap: function (list, index, target, record) {
        var me = this,
            vm = me.getViewModel();
        vm.set('selectedDay', record);
        this.onHoursEdit(list, record);
    }
    ,

    onHoursEdit: function (list, rec) {
        var settings = TS.app.settings,
            vm = this.getViewModel(),
            selectedDay = vm.get('selectedDay'),
            isChief = false;
        //get copy of original, in case user cancels
        vm.set('regHrsCopy', selectedDay.get('regHrs'));
        vm.set('ovtHrsCopy', selectedDay.get('ovtHrs'));
        vm.set('ovt2HrsCopy', selectedDay.get('ovt2Hrs'));
        vm.set('travelHrsCopy', selectedDay.get('travelHrs'));
        vm.set('commentCopy', selectedDay.get('comment'));
        //&& !settings.tsCanEnterCrewMemberTime
        Ext.each(rec.get('hours'), function (item) {
            if (item.get('isChief') && item.get('empId') == settings.empId) {
                isChief = true;
            }
        })
        if (!isChief && settings.empId != rec.get('empId') && !vm.get('tsApproverCanModify')) {
            Ext.Msg.alert('Warning', 'User does not have rights to edit a ' + settings.crewLabel + ' member. May view only.');
            return;
        }
        Ext.first('#fwaField').setHidden(rec.get('fwaId') ? false : true);
        Ext.first('#fwaButton').setHidden(rec.get('fwaId') ? false : true);
        this.getView().setActiveItem(4);
        // fields not seeing settings values even thought they are there - work around
        Ext.first('#ovtHrsField').setHidden(!settings.tsAllowOvtHrs);
        Ext.first('#ovt2HrsField').setHidden(!settings.tsAllowOvt2Hrs);
        Ext.first('#travelHrsField').setHidden(!settings.tsAllowTravelHrs);
        Ext.first('ts-edit-hours').down('titlebar[docked=top]').setTitle('Edit Approval Hours');
        selectedDay.dirty = false;
    }
    ,

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
            ts = Ext.first('tsa-timesheet'),
            vm = me.getViewModel(),
            tsRow = vm.getStore('tsrow'),
            settings = TS.app.settings,
            currentTsRow = vm.get('currentTSRow'),
            billCatTable = Ext.getStore('BillCategory'),
            billCategory = billCatTable.getById(currentTsRow.get('billCategory')),
            billCategoryName = billCategory.get('description'),
            newTsRow = new TS.model.ts.TsRow({
                seq: tsRow.data.length + 1,
                rowNum: tsRow.data.length + 1,
                billCategory: currentTsRow.get('billCategory'),
                billCategoryName: billCategoryName,
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

    showFwa: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            workDate = vm.get('selectedDay'),
            baseView = Ext.first('app-tsa'),
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
            });

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

        // sheet.getViewModel().getView().getItems().items[5].setTitle(settings.clientLabel + ' Signature');
        // sheet.getViewModel().getView().getItems().items[6].setTitle(settings.crewChiefLabel + ' Signature');
    }
    ,

    loadFwaViewSheet: function (results, operation, success) {
        var me = this,
            vm = me.getViewModel(),
            data = results[0],
            attachments = data.get('attachments');

        vm.set('attachments', attachments);
        vm.set('selectedFWA', results[0]);
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
            //client approval
            Ext.first('#viewAllClientSignatureButton').setHidden(true);//clientSignatureCount <= 1
            //chief approval
            Ext.first('#viewAllChiefSignatureButton').setHidden(true);//chiefSignatureCount <= 1


            if (!data.get('clientApprovalImage')) {
                if (clientApproval && clientApproval.length > 0) {
                    clientApprovalDate = clientApproval[0].dateAttached;
                    Ext.first('#clientApprovalDate').setValue(Ext.Date.format(new Date(clientApprovalDate), 'm/d/Y h:i A'));
                    Ext.first('#clientApprovalImage').setSrc('data:application/octet-stream;base64,' + clientApproval[0].attachmentItem);
                }
            }

            if (!data.get('chiefApprovalImage')) {
                if (chiefApproval && chiefApproval.length > 0) {
                    chiefApprovalDate = chiefApproval[0].dateAttached;
                    Ext.first('#chiefApprovalDate').setValue(Ext.Date.format(new Date(chiefApprovalDate), 'm/d/Y h:i A'));
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
            baseView = Ext.first('app-tsa'),
            sheet = Ext.create({
                xtype: 'ts-fwanotes',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                }
            });

        baseView.add(sheet);
        sheet.show();
    }
    ,

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

    onManageHoursTapView: function () {
        var me = this,
            baseView = Ext.first('app-tsa'),
            sheet = Ext.create({
                xtype: 'ts-fwahours',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                }
            });

        baseView.add(sheet);
        sheet.show();
    }
    ,


    onEditHoursSave: function () {
        var me = this,
            vm = me.getViewModel(),
            selectedDay = vm.get('selectedDay'),
            ts = Ext.first('tsa-timesheet'),
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
    }
    ,

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
    }
    ,

    setCrewRole: function (combo, newValue, oldValue, eOpts) {
        var crewRole = Ext.first('#hoursCrewRole'),
            employee = newValue ? Ext.getStore('TsEmployees').getById(newValue.id) : null;
        if (employee) {
            crewRole.setValue(Ext.getStore('Roles').getById(employee.get('defaultCrewRoleId')));
        }
    }
    ,

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

    onSaveTS: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            tsheet = vm.getStore('tsheet'),
            rowData = vm.getStore('tsrow').getRange(),
            iLen = rowData.length,
            tsaapprovalStore = vm.getStore('tsaapprovallist'),
            tsRows = [],
            i = 0,
            message,
            timesheetData,
            hasProject = true;
        //get from store load, should only be one entry(rows(n)) for period
        vm.set('selectedTS', tsheet.data.items[0].data);
        timesheetData = vm.get('selectedTS');
        //retrieve associative data and place in the array
        for (; i < iLen; i++) {
            tsRows.push(rowData[i].getData(true));
        }
        //check wbs1 information
        hasProject = me.checkWbs1Information(tsRows);
        // if no wbs1 info stop save/submit
        if (!hasProject) return;
        //time zone convert
        Ext.each(tsRows, function (row) {
            Ext.each(row.cells, function (c) {
                c.workDate = TS.common.Util.getOutUTCDate(c.workDate);
                c.startTime = TS.common.Util.getOutUTCDate(c.startTime);
                c.endDate = TS.common.Util.getOutUTCDate(c.endDate);
            });

        });

        timesheetData.rows = tsRows;
        timesheetData.startDate = TS.common.Util.getOutUTCDate(timesheetData.startDate);
        timesheetData.endDate = TS.common.Util.getOutUTCDate(timesheetData.endDate);

        TimeSheet.Save(null, settings.username, timesheetData, vm.get('isTimesheetApproval'), function (response, operation, success) {
            if (response && response.success) {
                if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                    Ext.Msg.confirm('Warning', me.getWarningMessage(response), function (btn) {
                        if (btn === 'yes') {
                            TimeSheet.SaveSubmitAfterWarning(null, settings.username, timesheetData, false, signatureAttachment, function (response, operation, success) {
                                TS.Messages.getSimpleAlertMessage('timesheetSaveSuccess');
                                tsaapprovalStore.load();
                                me.onBackBt();
                            }, me, {
                                autoHandle: true
                            });
                        }
                    });
                } else {
                    TS.Messages.getSimpleAlertMessage('timesheetSaveSuccess');
                    tsaapprovalStore.load();
                    me.onBackBt();
                }
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', Ext.JSON.encode(response)); //message attribute is a list of TS.model.shared.Error
            }
        });
    }
    ,

    onSubmitTS: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            baseView = Ext.first('app-tsa'),
            tsheet = vm.getStore('tsheet'),
            rowData = vm.getStore('tsrow').getRange(),
            selection,
            periodId,
            empId,
            tsRows = [],
            sheet,
            hasProject = true;
        //retrieve associative data and place in the array
        for (var i = 0; i < rowData.length; i++) {
            tsRows.push(rowData[i].getData(true));
        }
        //check wbs1 information
        hasProject = me.checkWbs1Information(tsRows);
        // if no wbs1 info stop save/submit
        if (!hasProject) return;

        vm.set('selectedTS', tsheet.data.items[0].data);
        selection = vm.get('selectedTS');
        periodId = selection.tsPeriodId;
        empId = selection.empId;

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

            baseView.add(sheet);
            sheet.show();
        } else {
            me.doSubmitTimesheet();
        }
        //me.doSubmitTimesheet();
    },

    tsSubmitPinClick: function (bt) {
        var me = this,
            settings = TS.app.settings,
            pin = me.lookup('tsSubmitPinField').getValue(),
            view = me.getView(),
            button = me.lookup('saveSignatureButton');

        // if (!view.lookup('tsSubmitPinField').getValue()) {
        //     Ext.Msg.alert('Warning', 'PIN and Signature are both required');
        //     button.setDisabled(true);
        //     return;
        // }
        this.doSaveSignature(bt);
        // User.AuthenticatePin(window.userGlobal.dbi, pin, window.userGlobal.email, function (response, operation, success) {
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

    tsaSubmitPinClick: function (bt) {
        var me = this,
            settings = TS.app.settings,
            pin = me.lookup('tsSubmitPinField').getValue(),
            view = me.getView(),
            button = me.lookup('saveSignatureButton');

        // if (!view.lookup('tsSubmitPinField').getValue()) {
        //     Ext.Msg.alert('Warning', 'PIN and Signature are both required');
        //     button.setDisabled(true);
        //     return;
        // }

        // User.AuthenticatePin(window.userGlobal.dbi, pin, window.userGlobal.email, function (response, operation, success) {
        //     if (response.data) {
        //         //save signature
        //         this.doSaveApprovalSignature(bt);
        //     } else {
        //         Ext.GlobalEvents.fireEvent('Message:Code', 'tsSubmitPinBadField');
        //         me.lookup('tsSubmitPinField').setValue('');
        //         me.getView().setLoading(false);
        //     }
        // }, me, {
        //     autoHandle: true
        // });

        this.doSaveApprovalSignature(bt);
    },

    doSaveSignature: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedTSA'),
            periodId = selection.get('tsPeriodId'),
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
            description: settings.tsTitle + ' Submit Signature',
            file: file
        };

        me.convertFileToByteData(data.file, Ext.bind(function (byteData) {
            var attachmentRecord = Ext.create('TS.model.shared.Attachment', {
                owningModelType: data.type,
                owningModelId: data.associatedId + '||' + settings.empId,
                location: data.location,
                dateAttached: data.date || new Date(),
                attachmentType: data.attachmentType,
                extension: data.fileExt,
                filename: data.fileName,
                description: data.description,
                attachmentItem: byteData
            });

            me.doSubmitTimesheet(bt, attachmentRecord);
        }, me));

        bt.up('sheet').hide();
    },

    doSaveApprovalSignature: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedTSA'),
            periodId = selection.get('tsPeriodId'),
            draw = vw.down('ts-draw'),
            imageData = draw.toDataURL(), //get image data
            file = new Blob([imageData], {
                type: 'image/png'
            }),
            data;

        data = {
            type: 'TSA',
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
                location: data.location,
                dateAttached: data.date || new Date(),
                attachmentType: data.attachmentType,
                extension: data.fileExt,
                filename: data.fileName,
                description: data.description,
                attachmentItem: byteData
            });

            me.continueAfterApprovalSignature(bt, attachmentRecord);
        }, me));

        bt.up('sheet').hide();
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

    doSubmitTimesheet: function (bt, attachment) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            baseView = Ext.first('app-tsa'),
            tsaapprovalStore = vm.getStore('tsaapprovallist'),
            rowData = vm.getStore('tsrow').getRange(),
            tsheetStore = vm.getStore('tsheet'),
            timesheetData,
            iLen = rowData.length,
            tsRows = [],
            i = 0,
            message,
            signatureAttachment;

        vm.set('selectedTS', tsheetStore.data.items[0].data);
        timesheetData = vm.get('selectedTS');
        //retrieve associative data and place in the array
        for (; i < iLen; i++) {
            tsRows.push(rowData[i].getData(true));
        }
        //time zone convert
        Ext.each(tsRows, function (row) {
            Ext.each(row.cells, function (c) {
                c.workDate = TS.common.Util.getOutUTCDate(c.workDate);
                c.startTime = TS.common.Util.getOutUTCDate(new Date()); //dummy for now
                c.endDate = TS.common.Util.getOutUTCDate(new Date());
            });

        });
        timesheetData.rows = tsRows;
        timesheetData.startDate = TS.common.Util.getOutUTCDate(timesheetData.startDate);
        timesheetData.endDate = TS.common.Util.getOutUTCDate(timesheetData.endDate);

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to submit?", function (btn) {
            if (btn === 'yes') {
                signatureAttachment = attachment != null ? attachment.getData() : null;
                TimeSheet.Submit(null, settings.username, timesheetData, signatureAttachment, function (response, operation, success) {
                    if (response && response.success) {
                        if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                            // me.getWarningMessage(response);
                            Ext.Msg.confirm('Warning', me.getWarningMessage(response), function (btn) {
                                if (btn === 'yes') {
                                    TimeSheet.SaveSubmitAfterWarning(null, settings.username, timesheetData, true, signatureAttachment, function (response, operation, success) {
                                        TS.Messages.getSimpleAlertMessage('timesheetSubmitSuccess');
                                        tsaapprovalStore.load();
                                        me.onBackBt();
                                    }, me, {
                                        autoHandle: true
                                    });
                                }
                            });
                        } else {
                            TS.Messages.getSimpleAlertMessage('timesheetSubmitSuccess');
                            tsaapprovalStore.load();
                            me.onBackBt();
                        }
                    } else if (response) {
                        Ext.GlobalEvents.fireEvent('Error', Ext.JSON.encode(response)); // Message attribute is a list of TS.model.shared.Error
                    }
                });
            }
        });
    }
    ,

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
    }

});