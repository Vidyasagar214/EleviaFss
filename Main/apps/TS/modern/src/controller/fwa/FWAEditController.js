Ext.define('TS.controller.fwa.FWAEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fwa-edit',

    requires: [
        'TS.Util',
        'TS.common.dataview.Attachments',
        'TS.view.fwa.ManageExpenses',
        'TS.common.window.Signature',
        'TS.view.fwa.SignatureList'
    ],

    uses: [
        'TS.view.fwa.ManageExpenses'
    ],

    listen: {
        controller: {
            'fwa-map': {
                positionUpdate: 'refreshAddressValues'
            }
        }
    },

    init: function () {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            store = Ext.getStore('CrewsForNewFWA');

        store.clearFilter();

        if (vm.get('isNew')) {
            store.filterBy(function (obj) {
                return obj.get('crewChiefEmpId') == settings.empId;
            });
        }


        if (Ext.first('#allCrewButton')) {
            Ext.first('#myCrewsButton').setStyle('color:white;background-color:#939393;font-weight: bold;');
            Ext.first('#allCrewButton').setStyle('background-color: #f6f6f6;color: #606060;font-weight: normal;');
        }

    },

    control: {
        'button[action=navigation-back]': {
            tap: 'navigateToGrid'
        },
        'button[action=camera]': {
            change: 'newFileLoaded',
            data: 'fileDataReceived'
        },
        'button[action=close]': {
            tap: 'closeSheet'
        },
        'button[action=showUnitDetails]': {
            tap: 'onUnitDetailsTap'
        },
        'button[action=select-laborcode]': {
            tap: 'onSelectLaborCode'
        }
    },

    addHours: function (bt) {
        var grid = bt.up('sheet').down('grid'),
            plugin = grid.findPlugin('grideditable'),
            rec = Ext.create('TS.model.fwa.FwaHours'),
            selection = this.getViewModel().get('selectedFWA');

        if (selection._workSchedAndPerf.getRange().length == 0) {
            Ext.Msg.alert('FYI', 'A work code has not been entered');
            return;
        }

        rec.set('workDate', selection.get('nextDate') != 'Invalid Date' ? new Date(Ext.Date.format(new Date(selection.get('nextDate')), DATE_FORMAT)) : Ext.Date.format(new Date(), DATE_FORMAT));
        rec.set('empGroupId', TS.app.settings.empGroupId);
        rec.set('modified', 'A');

        if (selection._workSchedAndPerf.getRange().length == 1) {
            TS.app.settings.defaultWorkCode = selection._workSchedAndPerf.getRange()[0].get('workCodeId');
        }
        rec.dirty = true;
        selection.hours().add(rec);
        plugin.startEdit(rec);
        Ext.first('#hoursWorkDate').setValue(selection.get('nextDate') != 'Invalid Date' ? new Date(Ext.Date.format(new Date(selection.get('nextDate')), DATE_FORMAT)) : Ext.Date.format(new Date(), DATE_FORMAT));
    },

    hasEditHourRights: function (rec) {
        var settings = TS.app.settings,
            isChief = false;

        Ext.each(rec.get('hours'), function (item) {
            if (rec.get('isChief') && rec.get('empId') == settings.empId) {
                isChief = true;
            }
        })

        if (!isChief && settings.empId !== rec.get('empId') && !settings.tsCanEnterCrewMemberTime) {
            Ext.Msg.alert('Warning', 'User does not have rights to edit a ' + settings.crewLabel + ' member.');
            Ext.first('#gridPlugin').setDisabled(true);
            return false;
        }
        Ext.first('#gridPlugin').setDisabled(false);
        return true
    },

    onEmployeeChange: function (t, newValue, oldValue, eOpts) {
        // if (!oldValue) return;
        // //get crew role id
        var crewRoleId = newValue.get('defaultCrewRoleId'),
            //get crew role select
            crewSelect = this.getView().lookup('employeeCrewRole');
        //default to employee crew role
        crewSelect.setValue(crewRoleId);
    },

    addWorkCodes: function (bt) {
        let grid = bt.up('sheet').down('grid'),
            plugin = grid.findPlugin('grideditable'),
            rec = Ext.create('TS.model.fwa.Work'),
            vm = this.getViewModel(),
            selection = vm.get('selectedFWA'),
            workCodeStore = Ext.getStore('WorkCodes').getRange();

        if (workCodeStore.length === 1)
            rec.set('workCodeId', workCodeStore[1]);
        selection.workSchedAndPerf().add(rec);
        //plugin.hidePhotoButton(true);
        plugin.startEdit(rec);
        vm.set('fromSaveSubmit', true);
    },

    addUnits: function (bt) {
        let grid = bt.up('sheet').down('grid'),
            unitGrid = grid.lookup('unitCodeGrid'),
            plugin = grid.findPlugin('grideditable'),
            dateBarDate = Ext.first('#manageUnits').lookup('unitsDateHeader').getValue(),
            rec = Ext.create('TS.model.fwa.Unit', {unitDate: new Date(dateBarDate)}),
            vm = this.getViewModel(),
            unitCodeStore = Ext.getStore('UnitCode'),
            selection = vm.get('selectedFWA'),
            wbs1 = selection.get('wbs1'),
            wbs2 = selection.get('wbs2'),
            wbs3 = selection.get('wbs3'),
            settings = TS.app.settings;

        if (!wbs1) {
            Ext.Msg.alert('Warning', 'A ' + settings.wbs1Label + '# selection is required.');
            return;
        }

        //CHANGED LOAD TO ON first ENTRY
        // unitCodeStore.getProxy().setExtraParams({
        //     wbs1: wbs1 ? wbs1 : '^',
        //     wbs2: wbs2 ? wbs2 : '^',
        //     wbs3: wbs3 ? wbs3 : '^',
        //     includeInactive: false
        // });
        //unitCodeStore.reload();
        //only allow active unit codes when loading new
        unitCodeStore.filterBy(function (row) {
            return row.get('status') === 'A';
        });

        plugin.hideDetails(true);
        //check if any units available, stop if none
        if (unitCodeStore.getRange().length === 0) {
            Ext.Msg.alert('FYI', 'No units available for current ' + settings.wbs1Label + '#: ' + wbs1 + '.');
            return;
        }
        //check store length, if 0 then create new store
        if (selection.units().length === 0) {
            selection._units = Ext.create('Ext.data.Store', {
                model: 'TS.model.fwa.Unit'
            });
            unitGrid.setStore(selection._units);
        }
        selection.units().add(rec);
        plugin.startEdit(rec);
        vm.set('fromSaveSubmit', true);
    },

    addUnitDetails: function (bt) {
        var grid = bt.up('sheet').down('grid'),
            plugin = grid.findPlugin('grideditable'),
            rec = Ext.create('TS.model.fwa.UnitDetail', {dtDate: new Date()}),
            vm = this.getViewModel(),
            selection = vm.get('selectedUnit');

        // vm.get('selectedUnitDetails').add(rec);
        selection.get('details').add(rec);
        plugin.startEdit(rec);
        grid.refresh();
    },

    closeSheet: function (bt) {
        //need to check if closing after adding a row
        if (Ext.first('#workCodeGrid')) {
            var grid = Ext.first('#workCodeGrid'),
                items = grid.getStore().getRange();
            Ext.each(items, function (item) {
                if (item.phantom && !item.get('workCodeId')) {
                    grid.getStore().remove(item);
                }
            });
            Ext.first('fwa-manageworkcodes').destroy();
        } else if (Ext.first('#unitCodeGrid')) {
            var grid = Ext.first('#unitCodeGrid'),
                items = grid.getStore().getRange();
            Ext.each(items, function (item) {
                if (item.phantom && !item.get('unitCodeId')) {
                    grid.getStore().remove(item);
                }
            });
            Ext.first('fwa-manageunits').destroy();
        } else if (Ext.first('#expensesGrid')) {
            var grid = Ext.first('#expensesGrid'),
                store = grid.getStore();
            store.clearFilter();
        } else if (Ext.first('#hoursGrid')) {
            var grid = Ext.first('#hoursGrid'),
                store = grid.getStore();
            store.clearFilter();
        }
        if (bt.up('sheet'))
            bt.up('sheet').hide();
    },

    closeSignatureSheet: function (bt) {
        Ext.first('window-signature').destroy();
    },

    closeSignatureInfoSheet: function (bt) {
        Ext.first('fwa-signatureInfo').destroy();
    },

    closeTemplateSheet: function (bt) {
        bt.up('sheet').hide();
        if (Ext.first('window-document'))
            Ext.first('window-document').hide();
    },

    closeEditNotesSheet: function (bt) {
        var me = this,
            vw = me.getView(),
            oldValue = vw.getViewModel().note;
        //reset to old value
        me.getViewModel().set('selectedNote.contents', oldValue);
        if (me.sheet) me.sheet.hide();
        else if (bt.up('sheet')) bt.up('sheet').hide();
    },

    closeDetailsSheet: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedUnit'),
            unitDetails = selection.get('details'),
            unitGrid = Ext.first('#unitCodeGrid'),
            unitGridPlugin = unitGrid.getPlugins()[0],
            ttlMiles = 0;

        Ext.each(unitDetails.getRange(), function (detail) {
            ttlMiles += detail.get('lValue3');
        });
        selection.set('quantity', ttlMiles);
        Ext.first('#quantity').setValue(ttlMiles);

        if (me.sheet) me.sheet.hide();
        else if (bt.up('sheet')) bt.up('sheet').hide();
    },

    onManageClientApproval: function () {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            id = fwa.get('fwaId'),
            data = me.massageFwaData(),
            imageSrc = fwa.get('clientApprovalImage'),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'window-signature',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                },
                attType: AttachmentType.ClientSignature,
                associatedRecordId: id
            }),
            workCodes = '',
            ttlHrs = 0;

        sheet.lookup('sendEmailField').setHidden(false);
        sheet.lookup('emailAddressField').setHidden(false);

        //if (IS_OFFLINE) {
        // Ext.each(fwa.workSchedAndPerf().getRange(), function (wc) {
        //     workCodes += wc.get('workCodeAbbrev') + ', ';
        // });
        // workCodes = workCodes.substring(0, workCodes.length - 2);
        // Ext.each(fwa.hours().getRange(), function (hr) {
        //     ttlHrs += hr.get('regHrs') + hr.get('ovtHrs') + hr.get('ovt2Hrs') + hr.get('travelHrs');
        // });
        // //fwa
        // sheet.lookup('fwaInfoField').setLabel('<b>' + settings.fwaAbbrevLabel + '</b>');
        // sheet.lookup('fwaInfoField').setValue(fwa.get('fwaNum') + ' : ' + fwa.get('fwaName'));
        // //work codes
        // sheet.lookup('workCodeField').setLabel('<b>' + settings.workCodeLabelPlural + '</b>');
        // sheet.lookup('workCodeField').setValue(workCodes);
        // //total hours
        // sheet.lookup('empHoursField').setLabel('<b>Ttl Emp Hours </b>');
        // sheet.lookup('empHoursField').setValue(ttlHrs);
        //} else {
        // Fwa.GetSignatureBlock(null, settings.username, settings.empId, data, AttachmentType.ClientSignature, function (response) {
        // if (response && response.success) {
        //     sheet.lookup('fwaInfoField').setHtml(response.data);
        //     sheet.lookup('workCodeField').setHidden(true);
        //     sheet.lookup('empHoursField').setHidden(true);
        // } else if (response) {
        //     Ext.GlobalEvents.fireEvent('Error', response);
        // }
        //});
        //}
        sheet.down('titlebar[docked=top]').setTitle(settings.clientLabel + ' Approval');
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    getFwaInfoForSignature: function (btn) {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            type = btn.getParent().getParent().attType,
            id = fwa.get('fwaId'),
            data = me.massageFwaData(),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'fwa-signatureInfo',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                },
                attType: type,
                associatedRecordId: id
            })

        Fwa.GetSignatureBlock(null, settings.username, settings.empId, data, type, function (response) {
            if (response && response.success) {
                sheet.lookup('fwaInfoField').setHtml(response.data);
                sheet.lookup('workCodeField').setHidden(true);
                sheet.lookup('empHoursField').setHidden(true);
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        });

        sheet.down('titlebar[docked=top]').setTitle(settings.fwaAbbrevLabel + ' Information');
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onManageChiefApproval: function () {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            id = fwa.get('fwaId'),
            data = me.massageFwaData(),
            imageSrc = fwa.get('chiefApprovalImage'),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'window-signature',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                attType: AttachmentType.EmpSignature,
                associatedRecordId: id
            }),
            workCodes = '',
            ttlHrs = 0;
        sheet.lookup('sendEmailField').setHidden(true);
        sheet.lookup('emailAddressField').setHidden(true);

        // if (IS_OFFLINE) { // || 1 == 1
        //     Ext.each(fwa.workSchedAndPerf().getRange(), function (wc) {
        //         workCodes += wc.get('workCodeAbbrev') + ', ';
        //     });
        //     workCodes = workCodes.substring(0, workCodes.length - 2);
        //     Ext.each(fwa.hours().getRange(), function (hr) {
        //         ttlHrs += hr.get('regHrs') + hr.get('ovtHrs') + hr.get('ovt2Hrs') + hr.get('travelHrs');
        //     });
        //     //fwa
        //     sheet.lookup('fwaInfoField').setLabel('<b>' + settings.fwaAbbrevLabel + '</b>');
        //     sheet.lookup('fwaInfoField').setValue(fwa.get('fwaNum') + ' : ' + fwa.get('fwaName'));
        //     //work codes
        //     sheet.lookup('workCodeField').setLabel('<b>' + settings.workCodeLabelPlural + '</b>');
        //     sheet.lookup('workCodeField').setValue(workCodes);
        //     //total hours
        //     sheet.lookup('empHoursField').setLabel('<b>Ttl Emp Hours </b>');
        //     sheet.lookup('empHoursField').setValue(ttlHrs);
        // } else {
        //     Fwa.GetSignatureBlock(null, settings.username, settings.empId, data, AttachmentType.EmpSignature, function (response) {
        //         if (response && response.success) {
        //             sheet.lookup('fwaInfoField').setValue(response.data);
        //             sheet.lookup('workCodeField').setHidden(true);
        //             sheet.lookup('empHoursField').setHidden(true);
        //         } else if (response) {
        //             Ext.GlobalEvents.fireEvent('Error', response);
        //         }
        //     });
        // }
        sheet.down('titlebar[docked=top]').setTitle(settings.crewChiefLabel + ' Approval');
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    massageFwaData: function () {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            startDate = fwa.get('schedStartDate'),
            endDate = fwa.get('schedEndDate'),
            data;

        if (!startDate) {
            fwa.set('schedStartDate', new Date('1/1/0001 12:00:00 AM'));
        }
        if (!endDate) {
            fwa.set('schedEndDate', new Date('1/1/0001 12:00:00 AM'));
        }
        if ((fwa.get('nextDate') == 'Invalid Date') || !fwa.get('nextDate') || new Date(fwa.get('nextDate')) < new Date('Mon Jan 01 1 00:30:00 GMT-0600 (Central Standard Time)')) {
            fwa.set('nextDate', new Date());
        }
        data = fwa.getData(true);
        data = TS.Util.checkFwaForValidDates(data);

        //set blank recurrence if new
        if (vm.get('newFwa')) {
            data.recurrenceConfig = null;
        }
        //need to set to zero if no values, else json will bomb
        if (data.loc) {
            if (data.loc.latitude == '') data.loc.latitude = 0;
            if (data.loc.longitude == '') data.loc.longitude = 0;
        }
        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
        });
        //get notes from model in case they have been manipulated
        if (vm.get('selectedFWA').get('notes'))
            data.notes = Ext.Array.pluck(vm.get('selectedFWA').get('notes').getRange(), 'data');

        if (!data.nextDate)
            data.nextDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        else
            data.nextDate = TS.common.Util.getOutUTCDate(data.nextDate);
        //convert for Time Zone
        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);
        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });
        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);

        Ext.each(data.hours, function (entry) {
            entry.startTime = new Date();
            entry.endTime = new Date();
        });
        return data;
    },

    onManageNotesTap: function () {
        var me = this,
            vm = me.getViewModel(),
            notesview = vm.getStore('notesview'),
            settings = TS.app.settings,
            fwa = vm.get('selectedFWA'),
            arr = [],
            placeholderRec,
            sheet,
            notesList;

        Ext.each(fwa.notes().getRange(), function (note) {
            placeholderRec = Ext.create('TS.model.fwa.FwaNote', {
                empId: note.get('empId'),
                seq: note.get('seq'),
                contents: note.get('contents'),
                createDate: note.get('createDate'),
                modDate: note.get('modDate'),
                modUser: note.get('modUser'),
                canEdit: note.get('empId') == settings.empId,
                formattedDateEmployee: note.get('formattedDateEmployee')
            });
            arr.push(placeholderRec);
        });

        notesview.setRemoteSort(false);
        notesview.loadRawData(arr);
        sheet = Ext.create({
            xtype: 'fwa-notes',
            //Fuse view models
            viewModel: {
                parent: vm
            }
        });
        notesList = Ext.first('#notesList');
        notesview.sort('modDate', 'ASC');
        Ext.Viewport.add(sheet);
        sheet.show();
        // get last note entered and scroll to it
        setTimeout(function () {
            notesList.getScrollable().doScrollTo(0, 1000000);
        }, 500);
    },

    onTextAreaChange: function (t, n, o) {
        if (n) {
            Ext.first('#postNoteButton').setDisabled(false);
        } else {
            Ext.first('#postNoteButton').setDisabled(true)
        }
    },

    onNotesAdd: function (obj, e) {
        var me = this,
            settings = TS.app.settings,
            empStore = Ext.getStore('AllEmployees'),
            emp = empStore.getById(settings.empId),
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            newNote = Ext.create('TS.model.fwa.FwaNote', {
                empId: settings.empId,
                contents: '',
                createUser: settings.usernameDisplay,
                createDate: new Date(),
                modDate: new Date(),
                modUser: settings.usernameDisplay,
                canEdit: true,
                formattedDateEmployee: 'Me', //Ext.Date.format(new Date(), 'D, M d, Y h:i A') + '   ' + emp.get('empName'),
                order: 0,
                isNew: true
            });

        vm.set('selectedNote', newNote);
        selection.notes().add(newNote);
        sheet = Ext.create({
            xtype: 'fwa-editnotes',
            //Fuse view models
            viewModel: {
                parent: vm
            }
        });

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onEditNotesDelete: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            notesList = Ext.first('#notesList'),
            store = notesList.getStore('notesview'),
            editedNote = vm.get('selectedNote'),
            record;

        record = store.findRecord('seq', editedNote.get('seq'));
        store.remove(record);
        vm.get('selectedFWA').set('notes', store);
        notesList.refresh();
        btn.up('sheet').hide();
    },

    onNotesEdit: function (list, rec) {
        var vm = this.getViewModel(),
            selectedNote = vm.get('selectedNote'),
            sheet;

        sheet = Ext.create({
            xtype: 'fwa-editnotes',
            //Fuse view models
            viewModel: {
                parent: vm,
                note: selectedNote.get('contents')
            }
        });
        sheet.lookup('fwaNotesDeleteBtn').setHidden(false);
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onNotesEditTap: function (list, index, target, record) {
        var me = this,
            vm = me.getViewModel();
        vm.set('selectedNote', record);
        if (!record.get('canEdit')) {
            Ext.Msg.alert('FYI', 'Past notes cannot be edited.');
            return;
        }
        me.onNotesEdit(list, record);
    },

    onEditNotesSave: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            notesList = Ext.first('#notesList'),
            editedNote = Ext.first('#textAreaMessage'), //vm.get('selectedNote'),
            store = Ext.first('#notesList').getStore(),
            settings = TS.app.settings,
            empStore = Ext.getStore('AllEmployees'),
            emp = empStore.getById(settings.empId),
            message;

        message = Ext.create('TS.model.fwa.FwaNote', {
            empId: settings.empId,
            contents: editedNote.getValue(),
            createUser: settings.usernameDisplay,
            createDate: new Date(),
            modDate: new Date(),
            modUser: settings.usernameDisplay,
            canEdit: true,
            formattedDateEmployee: Ext.Date.format(new Date(), 'D, M d, Y h:i A') + '   ' + emp.get('empName'),
            order: 0,
            isNew: true
        });

        store.insert(store.getCount(), message);
        vm.get('selectedFWA').set('notes', store);
        editedNote.setValue();
        // get last note entered and scroll
        setTimeout(function () {
            notesList.getScrollable().doScrollTo(0, 1000000);
        }, 500);
    },

    doSaveNotes: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            editedNote = vm.get('selectedNote'),
            store = Ext.first('#notesList').getStore();

        vm.get('selectedFWA').set('notes', store);
        bt.up('sheet').hide();
    },

    onClearNotes: function (bt) {
        var notes = this.getView().lookup('fwaNotes');
        notes.setValue('');
    },

    doEditNotes: function (btn) {
        Ext.first('fwa-notes').down().setActiveItem(1); // move to second tab
    },

    onCloseEditNotes: function (btn) {
        Ext.first('fwa-notes').down().setActiveItem(0);
    },

    onManageHoursTap: function () {
        var me = this,
            disabled = me.getView().getDisabled(),
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            vw = me.getView(),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'fwa-managehours',
                //Fuse view models
                viewModel: {
                    parent: vm
                },
                showOvtHrs: settings.tsAllowOvtHrs,
                showOvt2Hrs: settings.tsAllowOvt2Hrs,
                showTravelHrs: settings.tsAllowTravelHrs
            }),
            hoursGrid = sheet.lookup('hoursGrid'),
            form = hoursGrid.getPlugins()[0].getFormConfig(),
            fwa = vm.get('selectedFWA'),
            crewStore = Ext.getStore('AllCrews').getById(fwa.get('scheduledCrewId')),
            crewMembers = crewStore ? crewStore.get('crewMembers') : '',
            empHoursDate,
            empHoursWorkDateColumn = sheet.lookup('workDateField'),
            workCodeDateBar = sheet.lookup('workCodeDateBar'),
            store = vm.get('selectedFWA.hours'),
            model = store.model,
            datesInRange,
            utcDate,
            currentIndex = 0;

        Ext.each(store.getRange(), function (row) {
            var emp = Ext.getStore('Employees').getById(row.get('empId'));
            if (emp) row.set('empGroupId', emp.get('empGroupId'));
        });
        //when new: set next date to start date if exists
        if (vm.get('newFwa') && fwa.get('schedStartDate') && fwa.get('schedStartDate') != 'Invalid Date') {
            empHoursDate = fwa.get('schedStartDate');
        } else if (vm.get('newFwa') && !fwa.get('schedStartDate')) {
            empHoursDate = new Date();
            fwa.set('nextDate', empHoursDate);
        } else if (!fwa.get('nextDate') || new Date(fwa.get('nextDate')) < new Date('Mon Jan 01 1 00:30:00 GMT-0600 (Central Standard Time)')) {
            empHoursDate = new Date();
            fwa.set('nextDate', empHoursDate);
        } else if (fwa.get('nextDate') == 'Invalid Date') {
            empHoursDate = new Date();
            fwa.set('nextDate', empHoursDate);
        } else {
            empHoursDate = fwa.get('nextDate');
        }

        empHoursWorkDateColumn.setHidden(true);
        workCodeDateBar.setHidden(false);
        sheet.lookup('dateHeader').setValue(Ext.Date.format(new Date(empHoursDate), DATE_FORMAT));

        store.setRemoteFilter(false);

        store.clearFilter();

        if (store.getRange().length > 0)
            store.filterBy(function (rec) {
                rec.dirty = false;
                if (vm.get('newFwa'))
                    return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) == Ext.first('#dateHeader').getValue();
                else
                    return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(fwa.get('nextDate')), DATE_FORMAT) && rec.get('modified') !== 'D';
            });
        //sort
        store.sort([
            {
                property: 'workCodeId',
                direction: 'ASC'
            },
            {
                property: 'isChief',
                direction: 'DESC'
            },
            {
                property: 'lastName',
                direction: 'ASC'
            }
        ]);
        //turn on/off last & next buttons
        if (fwa.get('recurrenceDatesInRange') && fwa.get('recurrenceDatesInRange').length > 0) {
            if (fwa.get('recurrenceDatesInRange').length == 1) {
                sheet.lookup('lastDate').setDisabled(true);
                sheet.lookup('nextDate').setDisabled(true);
            } else {
                datesInRange = fwa.get('recurrenceDatesInRange').sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                    var matches = (utcDate == sheet.lookup('dateHeader').getValue());
                    if (matches && currentIndex == 1) {
                        sheet.lookup('lastDate').setDisabled(true);
                        sheet.lookup('nextDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == fwa.get('recurrenceDatesInRange').length) {
                        sheet.lookup('nextDate').setDisabled(true);
                        sheet.lookup('lastDate').setDisabled(false);
                        return false;
                    }
                });
            }
        } else {
            sheet.lookup('nextDate').setDisabled(true);
            sheet.lookup('lastDate').setDisabled(true);
        }

        hoursGrid.getPlugins()[0].disableSubmit(disabled);
        //set show/hide based on FWA
        hoursGrid.getPlugins()[0].setEnableDeleteButton(!disabled);
        hoursGrid.getColumns()[1].setHidden(!settings.fwaDisplayWorkCodeInHours);
        hoursGrid.getPlugins()[0].hideOvtHrs(!settings.tsAllowOvtHrs);
        hoursGrid.getPlugins()[0].hideOvt2Hrs(!settings.tsAllowOvt2Hrs);
        hoursGrid.getPlugins()[0].hideTravelHrs(!settings.tsAllowTravelHrs);
        hoursGrid.getPlugins()[0].hideWorkCode(!settings.fwaDisplayWorkCodeInHours);

        sheet.lookup('addHoursButton').setDisabled(disabled);
        Ext.Viewport.add(sheet);
        selection.dirty = false;
        sheet.show();
    },

    loadDefaultCrew: function (store) {
        store.clearFilter();
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            record = vm.get('selectedFWA'),
            model = store.model,
            lastDt = Ext.first('#manageHours').lookup('dateHeader').getValue(),
            datesInRange = record.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            }),
            crewStore = Ext.getStore('AllCrews').getById(record.get('scheduledCrewId')),
            crewMembers = crewStore ? crewStore.get('crewMembers') : '';

        Ext.each(store.collect('empId'), function (emp) {
            store.clearFilter();
            store.filter('empId', emp);
            Ext.each(store.collect('crewRoleId'), function (roleId) {
                store.filter('crewRoleId', roleId);
                Ext.each(store.collect('workCodeAbbrev'), function (workCodeAbbrev) {
                    store.filter('workCodeAbbrev', workCodeAbbrev);
                    Ext.each(store.getRange(), function (rec) {
                        Ext.each(datesInRange, function (dt) {
                            store.filter('workDate', new Date(dt));
                            if (store.getRange().length == 0 && crewMembers.getById(emp)) {
                                store.add(new model({
                                    workDate: new Date(dt),
                                    empId: emp,
                                    crewRoleId: roleId,
                                    workCodeId: Ext.getStore('WorkCodes').findRecord('workCodeAbbrev', workCodeAbbrev).get('workCodeId'),
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
        });
    },

    closeHoursSheet: function (bt) {
        //we need to clear any filter since we are paging
        var me = this,
            vm = me.getViewModel(),
            store = vm.get('selectedFWA.hours');
        // we need to check if adding new and tapped close and no cancel
        if (Ext.first('#hoursGrid')) {
            var grid = Ext.first('#hoursGrid'),
                items = grid.getStore().getRange();
            Ext.each(items, function (item) {
                if (item.phantom && !item.get('empId')) {
                    grid.getStore().remove(item);
                }
            });
        }
        store.clearFilter();
        bt.up('sheet').hide();
    },

    lastDate: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            record = vm.get('selectedFWA'),
            hoursGrid = Ext.first('#hoursGrid'),
            store = hoursGrid.getStore(),
            model = store.model,
            lastDt = Ext.first('#manageHours').lookup('dateHeader').getValue(),
            datesInRange = record.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(b) - new Date(a);
            }),
            crewStore = Ext.getStore('AllCrews').getById(record.get('scheduledCrewId')),
            crewMembers = crewStore ? crewStore.get('crewMembers') : '',
            nextDate = '',
            utcDate = '',
            hasLastDate = false,
            currentIndex = 0,
            dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) < new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasLastDate = true;
                return false;
            }
        });
        //check if date found
        if (hasLastDate) {
            Ext.each(store.collect('empId'), function (emp) {
                store.clearFilter();
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
                                    workCodeId: Ext.getStore('WorkCodes').findRecord('workCodeAbbrev', workCodeAbbrev).get('workCodeId'),
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

            store.clearFilter();
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }

        Ext.first('#manageHours').lookup('dateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#manageHours').lookup('lastDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#manageHours').lookup('nextDate').setDisabled(false);
    },

    onAddWorkDate: function () {
        var me = this,
            vm = me.getViewModel(),
            sheet = Ext.create({
                xtype: 'fwa-addworkdatehours',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            });
        Ext.Viewport.add(sheet);
        sheet.lookup('addWorkDatePicker').setValue(Ext.first('#manageHours').lookup('dateHeader').getValue());
        sheet.show();
    },

    saveAddWorkDate: function (bt, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            record = vm.get('selectedFWA'),
            hoursGrid = Ext.first('#hoursGrid'),
            store = hoursGrid.getStore(),
            model = store.model,
            hasNewDate = false,
            utcDate,
            currentIndex = 0,
            datesInRange = record.get('recurrenceDatesInRange'),
            workDate = Ext.Date.format(new Date(Ext.first('#addWorkDatePicker').getValue()), 'Y-m-d'),
            newDate = Ext.Date.format(new Date(Ext.first('#addWorkDatePicker').getValue()), DATE_FORMAT);
        //if none create empty array
        if (!datesInRange) {
            record.set('recurrenceDatesInRange', []);
            datesInRange = record.get('recurrenceDatesInRange');
        }

        //check if date selected exists
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            if (dt == workDate + 'T00:00:00') {
                hasNewDate = true;
                return false;
            }
        });
        //if does not exists - add to dateRange
        if (!hasNewDate) {
            datesInRange.push(workDate + 'T00:00:00');
            //increment index  so count is correct
            currentIndex++;
        }

        Ext.each(store.collect('empId'), function (emp) {
            store.clearFilter();
            store.filter('empId', emp);
            Ext.each(store.collect('crewRoleId'), function (roleId) {
                store.filter('crewRoleId', roleId);
                Ext.each(store.collect('workCodeAbbrev'), function (workCodeAbbrev) {
                    store.filter('workCodeAbbrev', workCodeAbbrev);
                    Ext.each(store.getRange(), function (rec) {
                        store.filter('workDate', new Date(newDate));
                        if (store.getRange().length == 0) {
                            store.add(new model({
                                workDate: new Date(newDate),
                                empId: emp,
                                crewRoleId: roleId,
                                workCodeId: Ext.getStore('WorkCodes').findRecord('workCodeAbbrev', workCodeAbbrev).get('workCodeId'),
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
        store.clearFilter();
        store.setRemoteFilter(false);
        store.filterBy(function (rec) {
            return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(newDate), DATE_FORMAT);
        });

        Ext.first('#manageHours').lookup('dateHeader').setValue(Ext.Date.format(new Date(newDate), DATE_FORMAT));
        //turn arrows on/off
        currentIndex = 0;
        if (datesInRange && datesInRange.length > 0) {
            if (datesInRange.length == 1) {
                Ext.first('#manageHours').lookup('lastDate').setDisabled(true);
                Ext.first('#manageHours').lookup('nextDate').setDisabled(true);
            } else {
                datesInRange = datesInRange.sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                    var matches = (utcDate == Ext.Date.format(new Date(vw.lookup('addWorkDatePicker').getValue()), DATE_FORMAT));
                    if (matches && currentIndex == 1) {
                        Ext.first('#manageHours').lookup('lastDate').setDisabled(true);
                        Ext.first('#manageHours').lookup('nextDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == datesInRange.length) {
                        Ext.first('#manageHours').lookup('lastDate').setDisabled(false);
                        Ext.first('#manageHours').lookup('nextDate').setDisabled(true);
                        return false;
                    }
                });
            }
        } else {
            Ext.first('#manageHours').lookup('lastDate').setDisabled(true);
            Ext.first('#manageHours').lookup('nextDate').setDisabled(true);
        }
        // Ext.first('#manageHours').lookup('nextDate').setDisabled(currentIndex == datesInRange.length);
        // Ext.first('#manageHours').lookup('lastDate').setDisabled(false);

        bt.up('sheet').hide();
    },

    nextDate: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            record = vm.get('selectedFWA'),
            hoursGrid = Ext.first('#hoursGrid'),
            store = hoursGrid.getStore(),
            model = store.model,
            lastDt = Ext.first('#manageHours').lookup('dateHeader').getValue(),
            datesInRange = record.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            }),
            crewStore = Ext.getStore('AllCrews').getById(record.get('scheduledCrewId')),
            crewMembers = crewStore ? crewStore.get('crewMembers') : '',
            nextDate = '',
            utcDate = '',
            hasNextDate = false,
            currentIndex = 0,
            dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) > new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasNextDate = true;
                return false;
            }
        });
        //check if date found
        if (hasNextDate) {
            Ext.each(store.collect('empId'), function (emp) {
                store.clearFilter();
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
                                    workCodeId: Ext.getStore('WorkCodes').findRecord('workCodeAbbrev', workCodeAbbrev).get('workCodeId'),
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
            store.clearFilter();
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }
        Ext.first('#manageHours').lookup('dateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#manageHours').lookup('nextDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#manageHours').lookup('lastDate').setDisabled(false);
    },

    onManageWorkCodesTap: function () {
        var me = this,
            settings = TS.app.settings,
            disabled = me.getView().getDisabled(),
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            sheet = Ext.create({
                xtype: 'fwa-manageworkcodes',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                }
            }),
            wcGrid = sheet.lookup('workCodeGrid'),
            wcGridPlugin = wcGrid.getPlugins()[0],
            form = wcGridPlugin.getFormConfig();

        wcGrid.getColumns()[2].setHidden(settings.fwaWorkCodeActual == 'H');//vm.get('fwaHideActualHours')
        wcGrid.getColumns()[2].setEditable(settings.fwaWorkCodeActual == 'R');//!vm.get('fwaReadOnlyActualHours')
        sheet.lookup('addWorkCodeButton').setDisabled((disabled || vm.get('hideAddWorkCode')) && !vm.get('newFwa'));
        // hide or disable photo as needed
        wcGridPlugin.disableSubmit((disabled || vm.get('hideAddWorkCode')) && !vm.get('newFwa'));
        //set show/hide based on FWA
        wcGridPlugin.setEnableDeleteButton(!disabled && !vm.get('hideAddWorkCode'));
        wcGridPlugin.hidePhotoButton(vm.get('newFwa'));
        wcGridPlugin.setPhotoRequiredHidden(vm.get('newFwa'));
        //check user settings for WC Actual Hrs
        wcGridPlugin.setActualHrsReadOnly(settings.fwaWorkCodeActual == 'R');
        wcGridPlugin.setActualHrsHidden(settings.fwaWorkCodeActual == 'H');
        //check for percent complete
        wcGridPlugin.setPercentCompleteHidden(!settings.fwaDisplayWorkCodePctComplete);

        if (settings.fwaAddWorkCode != 'A') {
            if (settings.fwaAddWorkCode == 'N') {
                wcGridPlugin.setScheduledHrsReadOnly((disabled || vm.get('hideAddWorkCode')) && !vm.get('newFwa'));
            } else if (settings.fwaAddWorkCode == 'M') {
                wcGridPlugin.setScheduledHrsReadOnly((disabled || vm.get('hideAddWorkCode')) && !vm.get('newFwa'));
            }
        }

        Ext.Viewport.add(sheet);
        if (selection)
            selection.dirty = false;
        sheet.show();
    },

    onManageUnitsTap: function () {
        var me = this,
            vm = me.getViewModel(),
            record = vm.get('selectedFWA'),
            unitCodeStore = Ext.getStore('UnitCode');

        if (!IS_OFFLINE) {
            unitCodeStore.removeAll();
            unitCodeStore.getProxy().setExtraParams({
                start: 0,
                limit: 25,
                wbs1: record.get('wbs1') ? record.get('wbs1') : '^',
                wbs2: record.get('wbs2') ? record.get('wbs2') : '^',
                wbs3: record.get('wbs3') ? record.get('wbs3') : '^',
                includeInactive: true
            });
            unitCodeStore.load(function (recs, op, success) {
                me.onManageUnitsTapContinue(record);
            });
        } else {
            me.onManageUnitsTapContinue(record);
        }
    },

    onManageUnitsTapContinue: function () {
        if (!this.getView()) return;
        var me = this,
            disabled = me.getView() ? me.getView().getDisabled() : true,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            sheet = Ext.create({
                xtype: 'fwa-manageunits',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            }),
            unitsGrid = sheet.lookup('unitCodeGrid'),
            unitGridPlugin = unitsGrid.findPlugin('grideditable'),
            fwa,
            empUnitsDate,
            unitDateBar = sheet.lookup('unitDateBar'),
            store,
            datesInRange,
            utcDate,
            currentIndex = 0;

        if (vm) {
            fwa = vm.get('selectedFWA');
            store = vm.get('selectedFWA.units')
        } else {
            return;
        }
        //per request 9/3/2017 when new: set next date to start date if exists
        if (vm.get('newFwa') && fwa.get('schedStartDate')) {
            empUnitsDate = fwa.get('schedStartDate');
        } else if (vm.get('newFwa') && !fwa.get('schedStartDate')) {
            empUnitsDate = new Date();
        } else if (!fwa.get('nextDate') || new Date(fwa.get('nextDate')) < new Date('Mon Jan 01 1 00:30:00 GMT-0600 (Central Standard Time)')) {
            empUnitsDate = new Date();
        } else {
            empUnitsDate = fwa.get('nextDate');
        }
        //empUnitsDateColumn.setHidden(true);
        unitDateBar.setHidden(false);
        sheet.lookup('unitsDateHeader').setValue(Ext.Date.format(new Date(empUnitsDate), DATE_FORMAT));

        store.setRemoteFilter(false);
        store.clearFilter();
        store.filterBy(function (rec) {
            rec.dirty = false;
            //if (Ext.os.is.iOS) // && !fwa.get('recurrenceConfig'))
            return Ext.Date.format(Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(Date(fwa.get('empUnitsDate')), DATE_FORMAT);
            // else
            //     return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(fwa.get('empUnitsDate')), DATE_FORMAT);
        });
        // match dates for recurring
        fwa.set('unitDatesInRange', fwa.get('recurrenceDatesInRange'));
        //turn on/off last & next buttons
        if (fwa.get('unitDatesInRange') && fwa.get('unitDatesInRange').length > 0) {
            if (fwa.get('unitDatesInRange').length == 1) {
                sheet.lookup('lastUnitsDate').setDisabled(true);
                sheet.lookup('nextUnitsDate').setDisabled(true);
            } else {
                datesInRange = fwa.get('unitDatesInRange').sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                    var matches = (utcDate == sheet.lookup('unitsDateHeader').getValue());
                    if (matches && currentIndex == 1) {
                        sheet.lookup('lastUnitsDate').setDisabled(true);
                        sheet.lookup('nextUnitsDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == fwa.get('unitDatesInRange').length) {
                        sheet.lookup('nextUnitsDate').setDisabled(true);
                        sheet.lookup('lastUnitsDate').setDisabled(false);
                        return false;
                    }
                });
            }
        } else {
            sheet.lookup('nextUnitsDate').setDisabled(true);
            sheet.lookup('lastUnitsDate').setDisabled(true);
        }

        unitGridPlugin.disableSubmit(disabled);
        unitGridPlugin.hideDetails(disabled);
        unitGridPlugin.hideDeleteButton(!disabled);
        sheet.lookup('addUnitsButton').setDisabled(disabled);
        Ext.Viewport.add(sheet);

        if (fwa.get('recurrencePattern')) {
            store.clearFilter();
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(sheet.lookup('unitsDateHeader').getValue()), DATE_FORMAT);
            });
        }
        selection.dirty = false;
        sheet.show();
    },

    onUnitDetailsTap: function () {
        var me = this,
            settings = TS.app.settings,
            disabled = me.getView().getDisabled(),
            vm = me.getViewModel(),
            grid = me.getView().down('grid'),
            sheet = Ext.create({
                xtype: 'fwa-manageunitdetails',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            }),
            unitGrid = sheet.lookup('unitDetailsGrid'),
            unitGridPlugin = unitGrid.getPlugins()[0],
            form = unitGridPlugin.getFormConfig(),
            selected = grid.selected,
            unitCode = selected.items[0];
        unitGridPlugin.disableSubmit(disabled);
        unitGridPlugin.hideDeleteButton(!disabled);

        if (!unitCode) {
            Ext.Msg.alert('Warning', 'Please save new ' + settings.unitLabel + ' first.');
            return;
        }

        //check if new fwa unit
        if (!vm.get('selectedUnit')) {
            vm.set('selectedUnit', Ext.create('TS.model.fwa.Unit'));
        }

        vm.set('selectedUnitDetails', vm.get('selectedUnit').get('details'));
        Ext.each(vm.get('selectedUnitDetails').getRange(), function (detail) {
            detail.phantom = false;
        });
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onProjectLookup: function (btn) {
        var vm = this.getViewModel(),
            settings = TS.app.settings,
            selection = vm.get('selectedFWA'),
            hours = selection.hours().data,
            ttlHrs = 0,
            sheet;
        vm.set('isExpense', !btn.getParent().getParent().viewModelKey);

        Ext.each(hours.getRange(), function (empHrs) {
            ttlHrs += empHrs.get('regHrs') + empHrs.get('ovtHrs') + empHrs.get('ovt2Hrs') + empHrs.get('travelHrs');
        });

        if (ttlHrs > 0) {
            Ext.Msg.confirm("Please Confirm", "<div align=\"center\">Employee Hours have been entered and will be deleted if the " + settings.wbs1Label + " is changed. Do you wish to continue?</div>", function (btn) {
                if (btn === 'yes') {
                    sheet = Ext.create({
                        xtype: 'projectlookuptree',
                        //Fuse view models
                        viewModel: {
                            parent: vm
                        },
                        app: 'FWA'
                    });
                    Ext.Viewport.add(sheet);
                    sheet.show();
                }
            });
        } else {
            sheet = Ext.create({
                xtype: 'projectlookuptree',
                //Fuse view models
                viewModel: {
                    parent: vm
                },
                app: 'FWA'
            });

            Ext.Viewport.add(sheet);
            sheet.show();
        }
    },

    onSelectProject: function (bt) {
        var me = this,
            vw = me.getView(),
            parentVM = me.getViewModel().getParent().getData().selectedFWA,
            projectTree = vw.lookup('project-treelist'),
            selection = projectTree.getViewModel().getData().treelist.selection,
            settings = TS.app.settings,
            wbsArray;

        if (!selection) {
            Ext.Msg.alert('FYI', 'Please select ' + settings.wbs1Label + ' from list');
            return;
        }

        //set new data in model
        wbsArray = selection.getId().split('^');//array of wbs id's (1,2,3)
        if (me.getViewModel().getParent().getData().isExpense) {
            Ext.first('#exp_fwawbs1id').setValue(wbsArray[0]);
            Ext.first('#exp_fwawbs2id').setValue(wbsArray[1] || '');
            Ext.first('#exp_fwawbs3id').setValue(wbsArray[2] || '');
        } else {
            parentVM.set('wbs1', wbsArray[0]);
            parentVM.set('wbs2', wbsArray[1] || '');
            parentVM.set('wbs3', wbsArray[2] || '');
            parentVM.set('clientId', selection.get('clientId'));
        }
        bt.up('sheet').hide();
    },
    //handler for fwa expense documents
    onAttachExpDoc: function (bt) {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            fwaId = fwa.get('fwaId'),
            grid = me.getView().down('grid'),
            settings = TS.app.settings,
            selected = grid.selected,
            expense = selected.items[0];

        if (!expense) {
            Ext.Msg.alert('Warning', 'Please save new expense first.');
            return;
        }

        var sheet = Ext.create({
                xtype: 'exp-window-document',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                fromFwa: true,
                attType: 'Document',
                location: settings.documentStorageLoc,
                associatedRecordId: expense.get('expId'),
                attachmentsList: {
                    modelType: 'EXP',
                    modelId: expense.get('expId'),
                    includeItem: true,
                    attachmentType: AttachmentType.Expense,
                    location: settings.documentStorageLoc
                }
            }),
            // attachText = settings.exCanModifyFwaExp && fwa.get('scheduledCrewChiefId') == settings.empId ||
            // (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && settings.exApproverCanModify) ? 'Attach ' : 'View ';
            attachText = 'Attach ';

        if (Ext.first('#attachFormFrame')) {
            // if ((settings.exCanModifyFwaExp && fwa.get('scheduledCrewChiefId') == settings.empId) ||
            //     (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && settings.exApproverCanModify)) {
            //     Ext.first('#attachFormFrame').setHidden(false);
            // } else {
            //     Ext.first('#attachFormFrame').setHidden(true);
            // }
            Ext.first('#attachFormFrame').setHidden(false);
        }
        sheet.lookup('attachmentList').add(
            {
                xtype: 'attachments',
                attachmentParams: sheet.attachmentsList
            }
        );

        sheet.down('titlebar[docked=top]').setTitle(attachText + ' Expense Document');
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    //handler for Work Code documents
    onAttachDoc: function (bt) {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            fwaId = fwa.get('fwaId'),
            grid = me.getView().down('grid'),
            settings = TS.app.settings,
            selected = grid.selected,
            workCode = selected.items[0];

        if (!workCode) {
            Ext.Msg.alert('Warning', 'Please save new ' + settings.workCodeLabel + ' first.');
            return;
        }
        var sheet = Ext.create({
                xtype: 'window-document',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                attType: 'Document',
                location: settings.documentStorageLoc,
                associatedRecordId: fwaId + '||' + workCode.get('workCodeId'),
                attachmentsList: {
                    modelType: 'FWA',
                    modelId: fwaId + '||' + workCode.get('workCodeId'),
                    includeItem: true,
                    attachmentType: AttachmentType.Document
                }
            }),
            //attachText = settings.fwaCanModify === 'A' ? 'Attach ' : 'View ';
            attachText = settings.fwaCanModify == 'A' ||
            (settings.fwaCanModify == 'M' && fwa.get('scheduledCrewChiefId') == settings.empId) ||
            (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify')) ? 'Attach ' : 'View ';

        if (Ext.first('#attachFormFrame')) {
            if (settings.fwaCanModify == 'A' ||
                (settings.fwaCanModify == 'M' && fwa.get('scheduledCrewChiefId') == settings.empId) ||
                (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify'))) {
                Ext.first('#attachFormFrame').setHidden(false);
            } else {
                Ext.first('#attachFormFrame').setHidden(true);
            }
        }

        sheet.lookup('attachmentList').add(
            {
                xtype: 'attachments',
                attachmentParams: sheet.attachmentsList
            }
        );

        sheet.lookup('fromTemplateButton').setHidden(true);
        sheet.down('titlebar[docked=top]').setTitle(attachText + TS.app.settings.workCodeLabel + ' Document');
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    //Handler for Work Code Photos
    onAttachPhoto: function (bt) {
        var me = this,
            vw = me.getView(),
            fwa = me.getViewModel().get('selectedFWA'),
            fwaId = fwa.get('fwaId'),
            grid = vw.down('grid'),
            settings = TS.app.settings,
            selected = grid.selected,
            workCode = selected.items[0];
        if (!workCode) {
            Ext.Msg.alert('Warning', 'Please save new ' + settings.workCodeLabel + ' first.');
            return;
        }

        var sheet = Ext.create({
                xtype: 'window-photo',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                attType: 'Photo',
                location: settings.imageStorageLoc,
                associatedRecordId: fwaId + '||' + workCode.get('workCodeId'),
                attachmentsList: {
                    modelType: 'FWA',
                    modelId: fwaId + '||' + workCode.get('workCodeId'),
                    includeItem: true,
                    attachmentType: AttachmentType.Photo
                }
            }),
            //attachText = settings.fwaCanModify === 'A' ? 'Attach ' : 'View ';
            attachText = settings.fwaCanModify == 'A' ||
            (settings.fwaCanModify == 'M' && selected.get('scheduledCrewChiefId') == settings.empId) ||
            (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify')) ? 'Attach ' : 'View ';

        if (Ext.first('#attachFormFrame')) {
            if (settings.fwaCanModify == 'A' ||
                (settings.fwaCanModify == 'M' && fwa.get('scheduledCrewChiefId') == settings.empId) ||
                (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify'))) {
                Ext.first('#attachFormFrame').setHidden(false);
            } else {
                Ext.first('#attachFormFrame').setHidden(true);
            }
        }
        sheet.lookup('attachmentList').add(
            {
                xtype: 'attachments',
                attachmentParams: sheet.attachmentsList
            }
        );

        sheet.down('titlebar[docked=top]').setTitle(attachText + TS.app.settings.workCodeLabel + ' Photo');
        Ext.Viewport.add(sheet);

        sheet.show();
    },

    onSignatureWindowOpen: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            clientSignatureCount = 0,
            chiefSignatureCount = 0,
            selection = vm.get('selectedFWA');
    },

    onClearDirty: function () {
        var me = this,
            vm = me.getViewModel(),
            clientSignatureCount = 0,
            chiefSignatureCount = 0,
            selection = vm.get('selectedFWA');

        selection.modified = {};
        selection.previousValues = {};
        selection.dirty = false;

        Ext.each(selection.get('attachments'), function (data) {
            if (data.attachmentType == 'S' && data.owningModelType == 'Fwa') {
                clientSignatureCount++;
            }
            if (data.attachmentType == 'E' && data.owningModelType == 'Fwa') {
                chiefSignatureCount++;
            }
        });

        Ext.each(selection.hours, function (obj) {
            obj.dirty = false;
        });

        Ext.first('#deleteClientSignatureButton').setHidden(clientSignatureCount === 0);
        Ext.first('#viewAllClientSignatureButton').setHidden(clientSignatureCount <= 1);

        Ext.first('#deleteChiefSignatureButton').setHidden(chiefSignatureCount === 0);
        Ext.first('#viewAllClientSignatureButton').setHidden(clientSignatureCount <= 1);

        Ext.first('#clientApprovalButton').setWidth(clientSignatureCount <= 1 ? '100%' : '75%');
        Ext.first('#chiefApprovalButton').setWidth(chiefSignatureCount <= 1 ? '100%' : '75%');
    },

    checkIsDirty: function (selection) {
        var hours = [],
            workCodes = [],
            units = [];

        //check hours/work code for dirty
        if (selection.hours()) {
            hours = selection.hours().getRange();
        }
        if (selection.workSchedAndPerf()) {
            workCodes = selection.workSchedAndPerf().getRange();
        }
        if (selection.units()) {
            units = selection.units().getRange();
        }

        Ext.each(hours, function (obj) {
            var m = obj.modified;
            if (m && (m.workDate || m.empId || m.crewRoleId || m.workCodeId || m.laborCode || m.regHrs || m.ovtHrs || m.ovt2Hrs || m.travelHrs || m.comments)) {
                selection.dirty = true;
            }
        });
        Ext.each(workCodes, function (obj) {
            var m = obj.modified;
            if (obj.dirty) {
                selection.dirty = true;
            }
        });

        Ext.each(units, function (obj) {
            var m = obj.modified;
            if (m && (m.comments || m.equipmentId || m.quantity || m.unitCodeId || m.unitDate)) {
                selection.dirty = true;
            }
        });

        //check location for dirty
        if (selection._loc.dirty) {
            selection.dirty = true;
        }

        return selection.dirty;
    },

    udfCheckBoxChange: function (component, newValue, oldValue) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm ? vm.get('selectedFWA') : '';
        if (selection)
            selection.dirty = true;
    },

    navigateToGrid: function (bt) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            settings = TS.app.settings,
            store = vm.getStore('fwalist'),
            hours = [],
            workCodes = [],
            units = [];

        //check hours/work code for dirty
        if (selection.hours()) {
            hours = selection.hours().getRange()
        }
        if (selection.workSchedAndPerf()) {
            workCodes = selection.workSchedAndPerf().getRange();
        }
        if (selection.units()) {
            units = selection.units().getRange();
        }

        if (!vm.get('fromSaveSubmit')) {
            Ext.each(hours, function (obj) {
                if (obj.dirty) {
                    selection.dirty = true;
                }
            });

            Ext.each(workCodes, function (obj) {
                if (obj.dirty) {
                    selection.dirty = true;
                }
            });

            Ext.each(units, function (obj) {
                if (obj.dirty) {
                    selection.dirty = true;
                }
            });

            //check location for dirty
            if (IS_OFFLINE) {
                //do nothing
            } else if (selection._loc.dirty) {
                selection.dirty = true;
            }
        }

        //check for dirty and warn
        if (selection.dirty) {

            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    // switching to the grid
                    // (we are 1 level below so search up for tabpanel)
                    Ext.first('app-fwa').setActiveItem(0);
                    selection.dirty = false;
                    store.reload();
                    // if (!vm.get('newFwa'))
                    //     vm.set('selectedFWA', '');
                    if (Ext.first('fwa-edit'))
                        Ext.first('fwa-edit').destroy();
                } else {
                    //store.rejectChanges();
                    //vw.destroy();
                }
            });
        } else {
            // switching to the grid
            // (we are 1 level below so search up for tabpanel)
            Ext.first('app-fwa').setActiveItem(0);
            if (!vm.get('newFwa')) {
                vm.set('selectedFWA', '');
            } else {
                vm.getStore('fwalist').reload();
            }
            if (Ext.first('fwa-edit'))
                Ext.first('fwa-edit').destroy();
            //vw.destroy();
        }
        selection.set('clientApprovalImage', '');
        selection.set('chiefApprovalImage', '');
        Ext.first('#mainSelectBtn').setDisabled(true);
    },

    checkDailyTtlHours: function (empHours) {
        var empList = [],
            dayList = [],
            ttlHrs = 0,
            tempValue,
            exceeds24 = false;

        //check if hours per day/ per employee exceed 24
        for (var i = 0; i < empHours.length; i++) { // loop through store records
            tempValue = empHours[i].empId; //grab the value for the series field
            Ext.Array.include(empList, tempValue); // populate aWindows with unique values
            tempValue = Ext.Date.format(empHours[i].workDate, DATE_FORMAT);
            Ext.Array.include(dayList, tempValue);
        }
        //iterate thru list
        Ext.each(empList, function (empId) {
            Ext.each(dayList, function (dt) {
                ttlHrs = 0;
                Ext.each(empHours, function (hours) {
                    if (hours.empId == empId && Ext.Date.format(hours.workDate, DATE_FORMAT) == dt) {
                        ttlHrs += hours.regHrs + hours.ovtHrs + hours.ovt2Hrs + hours.travelHrs;
                    }
                });
                if (ttlHrs > 24) {
                    exceeds24 = true;
                }
            })
        });
        //check if emp hours exceed 24 hrs
        if (exceeds24) {
            Ext.Msg.alert('Warning', 'Employee hours entered for work date exceed 24. Please correct.');
        }
        return exceeds24;
    },


    checkDateDiff: function (startDate, schedVisibleHoursStart) {
        var sched = new Date(),
            start = new Date();
        sched.setHours(schedVisibleHoursStart.getHours());
        sched.setMinutes(schedVisibleHoursStart.getMinutes());
        sched.setSeconds(schedVisibleHoursStart.getSeconds());

        start.setHours(startDate.getHours());
        start.setMinutes(startDate.getMinutes());
        start.setSeconds(startDate.getSeconds());

        return sched > start;
    },

    onSaveFwa: function () {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            startDate = fwa.get('schedStartDate'),
            endDate = fwa.get('schedEndDate'),
            settings = TS.app.settings,
            wbs1combo = me.lookup('wbs1combo'),
            wbs2combo = me.lookup('wbs2combo'),
            wbs3combo = me.lookup('wbs3combo'),
            startDateField = Ext.first('#schedStartDateField'),
            endDateField = Ext.first('#schedEndDateField'),
            ttlHours = 0,
            ttlUnits = 0;

        if (wbs1combo.getSelection() && wbs1combo.getSelection().data.wbs2Required) {
            if (!wbs2combo.getSelection()) {
                Ext.Msg.alert('Warning', settings.wbs2Label + ' selection is required');
                return;
            }
        }
        if (wbs2combo.getSelection() && wbs2combo.getSelection().data.wbs3Required) {
            if (!wbs3combo.getSelection()) {
                Ext.Msg.alert('Warning', settings.wbs3Label + ' selection is required ');
                return;
            }
        }
        if (!TS.Util.hasRequiredUdfValues(fwa)) {
            return;
        }

        //clear attachments if not offline - need to save to memory - only used when coming FROM backend
        if (!IS_OFFLINE)
            fwa.set('attachments', []);

        if (!startDate && !endDate) {
            //check if any hours/units entered
            Ext.each(fwa.hours().getRange(), function (obj) {
                ttlHours += (obj.get('ovtHrs') + obj.get('ovt2Hrs') + obj.get('regHrs') + obj.get('travelHrs'));
            });
            Ext.each(fwa.units().getRange(), function (obj) {
                ttlUnits += obj.get('quantity');
            });

            if (ttlHours > 0 || ttlUnits > 0) {
                Ext.Msg.show({
                    title: 'Warning',
                    message: settings.fwaAbbrevLabel + 's with hours entered or unit quantities entered cannot be unscheduled.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                return false;
            }
        }

        if (settings.fwaAutoNumbering && fwa.get('fwaName') == '') {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' Name is a required field.');
            return;
        } else if (!settings.fwaAutoNumbering && (fwa.get('fwaName') == '' || fwa.get('fwaNum') == '')) {
            Ext.Msg.alert('Warning', 'Both' + settings.fwaAbbrevLabel + '# and ' + settings.fwaAbbrevLabel + 'Name are required fields.');
            return;
        }

        if (!IS_OFFLINE && !wbs1combo.getValue()) { // || !me.lookup('schedCrewfield').getValue()
            Ext.Msg.alert('Warning', settings.wbs1Label + '# is a required field.');
            return;
        }

        //check if hours per day/ per employee exceed 24
        if (me.checkDailyTtlHours(fwa.getData(true).hours)) {
            me.getView().setLoading(false);
            return;
        }
        //settings.schedVisibleHoursStart.getTime() > startDate.getTime()
        if (startDate && me.checkDateDiff(startDate, settings.schedVisibleHoursStart)) {
            var startTime = Ext.Date.format(startDate, 'g:i A'),
                schedStartTime = Ext.Date.format(settings.schedVisibleHoursStart, 'g:i A');
            Ext.Msg.confirm('Please Confirm', 'Start time (' + startTime + ') is earlier than visible start time (' + schedStartTime + ') on calendar, do you wish to continue? ', function (btn) {
                if (btn == 'yes') {
                    me.continueSave();
                } else {
                    me.getView().setLoading(false);
                }
            });
        } else {
            me.continueSave();
        }
    },

    continueSave: function () {
        var me = this,
            vm = me.getViewModel(),
            data,
            message,
            scheduledBy = Ext.first('#scheduledByField'),
            vw = me.getView(),
            store = vm.getStore('fwalist'),
            fwa = vm.get('selectedFWA'),
            startDate = fwa.get('schedStartDate'),
            endDate = fwa.get('schedEndDate'),
            endDateTime = Ext.first('#schedEndTimeField').getValue(),
            dateOrdered = fwa.get('dateOrdered'),
            orderedBy = fwa.get('orderedBy'),
            dateRequired = fwa.get('dateRequired'),
            udf_d1 = fwa.get('udf_d1'),
            udf_d2 = fwa.get('udf_d2'),
            udf_d3 = fwa.get('udf_d3'),
            isScheduler = me.getViewModel().get('isScheduler'),
            settings = TS.app.settings;

        if (!fwa.get('preparedByEmpId')) {
            Ext.Msg.alert('Warning', 'Scheduled By is a required field.');
            return;
        }
        //check required fields when a new FWA in the field
        if (vm.get('newFwa')) {

            // if (!startDate || !endDate) {
            //     Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' Start Date/Time and End Date/Time are required fields.');
            //     return;
            // }
            if (fwa.workSchedAndPerf().getRange().length === 0) {
                Ext.Msg.alert('Warning', 'At least one(1) ' + settings.workCodeLabel + ' entry is required.');
                return;
            }
            if (startDate && endDate && fwa.hours().getRange().length > 0 && !fwa.get('scheduledCrewId')) {
                Ext.Msg.alert('Warning', 'A ' + settings.crewLabel + ' selection is required when start/end date & employee hours are entered.');
                return false;
            }
        }

        Ext.each(fwa.hours().getRange(), function (item) {
            item.set('isChief', Ext.getStore('Roles').getById(item.get('crewRoleId')).get('crewRoleIsChief'));

            if (item.get('startTime'))
                item.set('startTime', Ext.Date.format(new Date(item.get('startTime')), DATE_FORMAT + ' H:i'));
            else
                item.set('startTime', new Date('2001-01-01T00:00:00'));

            if (item.get('endTime'))
                item.set('endTime', Ext.Date.format(new Date(item.get('endTime')), DATE_FORMAT + ' H:i'));
            else
                item.set('endTime', new Date('2001-01-01T00:00:00'));
        });

        if (!startDate) {
            fwa.set('schedStartDate', new Date('1/1/0001 12:00:00 AM'));
        }
        if (!endDate) {
            fwa.set('schedEndDate', new Date('1/1/0001 12:00:00 AM'));
        } else {
            fwa.set('schedEndDate', endDateTime);
        }

        if ((fwa.get('nextDate') == 'Invalid Date') || !fwa.get('nextDate') || new Date(fwa.get('nextDate')) < new Date('Mon Jan 01 1 00:30:00 GMT-0600 (Central Standard Time)')) {
            fwa.set('nextDate', new Date());
        }
        if (startDate > endDate) {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' start date/time must be earlier than end date/time.');
            return;
        }

        if (endDate < startDate) {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' end date/time must be later than start date/time.');
            return;
        }
        fwa.set('schedEndDate', endDateTime);
        data = fwa.getData(true); //retrieve data plus associations
        //check udf_c1
        data.udf_c1 = vw.lookup('udf_c1_field').getChecked();
        //check for valid dates
        data = TS.Util.checkFwaForValidDates(data);
        //set blank recurrence if new
        if (vm.get('newFwa')) {
            data.recurrenceConfig = null;
        }

        data.loc.address1 = vw.lookup('address1Field').getValue() || '';
        data.loc.address2 = vw.lookup('address2Field').getValue() || '';
        data.loc.city = vw.lookup('cityField').getValue() || '';
        data.loc.state = vw.lookup('stateField').getValue() || '';
        data.loc.zip = vw.lookup('zipField').getValue() || '';
        //need to set to zero if no values, else json will bomb
        data.loc.latitude = vw.lookup('locLatitude').getValue() || 0;
        data.loc.longitude = vw.lookup('locLongitude').getValue() || 0;

        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            if (unit.details)
                unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
        });

        me.getView().setLoading(true, 'Saving FWA...');
        //get notes from model in case they have been manipulated
        if (vm.get('selectedFWA').get('notes'))
            data.notes = Ext.Array.pluck(vm.get('selectedFWA').get('notes').getRange(), 'data');

        //if not recurring or null set to schedStartDate, else leave as is
        if (!data.nextDate)
            data.nextDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        else
            data.nextDate = TS.common.Util.getOutUTCDate(data.nextDate);

        data.expenses = data.expenses ? data.expenses : [];
        //convert for Time Zone
        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);

        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });
        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);
        // check for any special associations

        TS.Util.onCheckPriorToEmployeeAssn(data, false, data.scheduledCrewId, function (isOkay) {
            if (isOkay) {
                if (vm.get('newFwa')) {
                    TS.Util.onCheckForDoubleBookedEmployees(data.fwaId, data.scheduledCrewId, data.schedStartDate, data.schedEndDate, function (status) {
                        if (!status) {
                            if (data.scheduledCrewId && data.schedStartDate && data.schedEndDate && data.hours.length == 0) {
                                vw.lookup('schedCrewfield').setValue('');
                                vw.lookup('schedCrewfield_OL').setValue('');
                                vw.lookup('dateOrderedField').setValue('');
                                vw.lookup('dateRequiredField').setValue('');
                                vw.lookup('schedStartDateField').setValue('');
                                vw.lookup('schedStartTimeField').setValue('');
                                vw.lookup('schedEndDateField').setValue('');
                                vw.lookup('schedEndTimeField').setValue('');
                            }
                            me.getView().setLoading(false);
                        } else {
                            //clear attachments - only used when coming FROM backend
                            data.attachments = [];
                            //clear out any selected templates
                            data.availableTemplates = null;
                            me.fireViewEvent('save', data);
                            fwa.set('attachmentsToAdd', null);
                        }
                    });
                } else {
                    if (!IS_OFFLINE)
                        data.attachments = [];
                    //clear out any selected templates
                    data.availableTemplates = null;
                    me.fireViewEvent('save', data);
                    fwa.set('attachmentsToAdd', null);

                }
            } else {
                me.getView().setLoading(false);
            }
        });
    },

    onSubmitFwa: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            wbs1combo = me.lookup('wbs1combo'),
            wbs2combo = me.lookup('wbs2combo'),
            wbs3combo = me.lookup('wbs3combo'),
            data = vm.get('selectedFWA').data;

        if (wbs1combo.getSelection() && wbs1combo.getSelection().data.wbs2Required) {
            if (!wbs2combo.getSelection()) {
                Ext.Msg.alert('Warning', settings.wbs2Label + ' selection is required');
                return;
            }
        }
        if (wbs2combo.getSelection() && wbs2combo.getSelection().data.wbs3Required) {
            if (!wbs3combo.getSelection()) {
                Ext.Msg.alert('Warning', settings.wbs3Label + ' selection is required ');
                return;
            }
        }

        if (!TS.Util.hasRequiredUdfValues(vm.get('selectedFWA'))) {
            return;
        }

        if (data.recurrencePattern) {
            settings.fwaList = vm.getStore('fwalist');
            me.onSubmitRecurring(data, me.getView());
        } else {
            me.onSubmitFwaStart();
        }
    },


    onSubmitFwaStart: function (dt) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            startDate = fwa.get('schedStartDate'),
            endDate = fwa.get('schedEndDate'),
            endDateTime = Ext.first('#schedEndTimeField').getValue(),
            dateOrdered = fwa.get('dateOrdered'),
            orderedBy = fwa.get('orderedBy'),
            dateRequired = fwa.get('dateRequired'),
            udf_d1 = fwa.get('udf_d1'),
            udf_d2 = fwa.get('udf_d2'),
            udf_d3 = fwa.get('udf_d3'),
            settings = TS.app.settings,
            halt = false,
            ttlHours,
            ttlUnits;

        if (dt)
            fwa.set('nextDate', dt);

        //clear attachments - only used when coming FROM backend
        if (!IS_OFFLINE)
            fwa.set('attachments', []);
        //clear out any selected templates
        //data.availableTemplates = null;
        //check required fields when a new FWA
        if (!startDate && !endDate) {
            //check if any hours/units entered
            Ext.each(fwa.hours().getRange(), function (obj) {
                ttlHours += (obj.get('ovtHrs') + obj.get('ovt2Hrs') + obj.get('regHrs') + obj.get('travelHrs'));
            });
            Ext.each(fwa.units().getRange(), function (obj) {
                ttlUnits += obj.get('quantity');
            });

            if (ttlHours > 0 || ttlUnits > 0) {
                Ext.Msg.show({
                    title: 'Warning',
                    message: settings.fwaAbbrevLabel + 's with hours entered or unit quantities entered cannot be unscheduled.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                return false;
            }
        }

        if (!fwa.get('preparedByEmpId')) {
            Ext.Msg.alert('Warning', 'Scheduled By is a required field.');
            return;
        }
        if (!startDate || !endDate) {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' Start Date/Time and End Date/Time are required fields.');
            return;
        }
        if (fwa.workSchedAndPerf().getRange().length === 0) {
            Ext.Msg.alert('Warning', 'At least one(1) ' + settings.workCodeLabel + ' entry is required.');
            return;
        }

        if (fwa.hours().getRange().length === 0) {
            Ext.Msg.alert('Warning', 'An Employee Hours  entry is required on Submit.');
            return;
        } else {
            Ext.each(fwa.hours().getRange(), function (entry) {
                //check for employee &  work code selection
                if (!entry.get('workCodeId') || !entry.get('empId')) {
                    Ext.Msg.alert('Warning', 'Both an Employee and ' + settings.workCodeLabel + ' selection required with each Employee Hour entry on Submit.');
                    halt = true;
                }
            });
        }

        if (halt) return;

        Ext.each(fwa.hours().getRange(), function (item) {
            item.set('isChief', Ext.getStore('Roles').getById(item.get('crewRoleId')).get('crewRoleIsChief'));

            if (item.get('startTime'))
                item.set('startTime', Ext.Date.format(new Date(item.get('startTime')), DATE_FORMAT + ' H:i'));
            else
                item.set('startTime', new Date('2001-01-01T00:00:00'));

            if (item.get('endTime'))
                item.set('endTime', Ext.Date.format(new Date(item.get('endTime')), DATE_FORMAT + ' H:i'));
            else
                item.set('endTime', new Date('2001-01-01T00:00:00'));
        });

        //me.getView().setLoading(true, 'Submitting FWA...');

        if (!startDate) {
            fwa.set('schedStartDate', new Date('1/1/0001 12:00:00 AM'));
        }
        if (!endDate) {
            fwa.set('schedEndDate', new Date('1/1/0001 12:00:00 AM'));
        } else {
            fwa.set('schedEndDate', endDateTime);
        }
        //check required fields when a new FWA in the field
        if (vm.get('newFwa')) {
            if (fwa.workSchedAndPerf().getRange().length === 0) {
                Ext.Msg.alert('Warning', 'At least one(1) ' + settings.workCodeLabel + ' entry is required.');
                return;
            }
            if (startDate && endDate && fwa.hours().getRange().length > 0 && !fwa.get('scheduledCrewId')) {
                Ext.Msg.alert('Warning', 'A ' + settings.crewLabel + ' selection is required when start/end date & employee hours are entered.');
                return false;
            }
        }

        if (startDate && me.checkDateDiff(startDate, settings.schedVisibleHoursStart)) {

            var startTime = Ext.Date.format(startDate, 'g:i A'),
                schedStartTime = Ext.Date.format(settings.schedVisibleHoursStart, 'g:i A');
            Ext.Msg.confirm('Warning', 'Start time (' + startTime + ') is earlier than visible start time (' + schedStartTime + ') on calendar, do you wish to continue? ', function (btn) {
                if (btn == 'yes') {
                    me.continueSubmit();
                } else {
                    me.getView().setLoading(false);
                }
            });
        } else {
            me.continueSubmit();
        }

    },

    continueSubmit: function () {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            fwa = vm.get('selectedFWA'),
            data,
            startDate = fwa.get('schedStartDate'),
            endDate = fwa.get('schedEndDate'),
            settings = TS.app.settings;

        if (startDate > endDate) {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' start date/time must be earlier than end date/time.');
            me.getView().setLoading(false);
            return;
        }

        if (endDate < startDate) {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' end date/time must be later than start date/time.');
            me.getView().setLoading(false);
            return;
        }

        data = fwa.getData(true); //retrieve data plus associations
        data.attachments = fwa.attachments;
        //check for valid dates
        data = TS.Util.checkFwaForValidDates(data);
        // get address values in case of changes
        data.loc.address1 = Ext.first('#address1Field').getValue() || '';
        data.loc.address2 = Ext.first('#address2Field').getValue() || '';
        data.loc.city = Ext.first('#cityField').getValue() || '';
        data.loc.state = Ext.first('#stateField').getValue() || '';
        data.loc.zip = Ext.first('#zipField').getValue() || '';
        //need to set to zero if no values, else json will bomb
        data.loc.latitude = Ext.first('#latitudeField').getValue() || 0;
        data.loc.longitude = Ext.first('#longitudeField').getValue() || 0;

        if (data.loc.latitude == 0 && data.loc.longitude == 0) {
            if (data.loc.address1 == '' && data.loc.address2 == '' && data.loc.city == '' && data.loc.state == '' && data.loc.zip == '' &&
                data.loc.latitude == 0 && data.loc.longitude == 0) {
                Ext.Msg.alert('Required Field(s)', 'Address, City, State, or Zip/Postal Code is required.');
                return;
            } else if (data.loc.city != '' && data.loc.state == '' && data.loc.zip == '') {
                Ext.Msg.alert('Required Field(s)', 'State or Zip/Postal Code is required when City if specified.');
                return;
            } else if ((data.loc.address1 != '' || data.loc.address2 != '') && (data.loc.city == '' && data.loc.state == '' && data.loc.zip == '')) {
                Ext.Msg.alert('Required Field(s)', 'City, State, or Zip/Postal Code is required with an Address.');
                return;
            }
        } else if ((data.loc.latitude != 0 && data.loc.longitude == 0) || (data.loc.latitude == 0 && data.loc.longitude != 0)) {
            Ext.Msg.alert('Required Field(s)', 'Latitude & Longitude both required if one is used and no other address fields.');
            return
        }

        data.expenses = data.expenses ? Ext.Array.pluck(data.expenses, 'data') : null;
        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
        });
        //get notes from model in case they have been manipulated
        if (fwa.get('notes'))
            data.notes = Ext.Array.pluck(fwa.get('notes').getRange(), 'data');

        me.onFinishSubmit(data);

    },

    onFinishSubmit: function (data) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings;
        // Chief signature is required but doesn't exist

        if (data.chiefSigReq && !me.signatureExists(data.attachments, AttachmentType.EmpSignature)) {
            Ext.GlobalEvents.fireEvent('Message:Code', 'fwaSubmitNoChiefSig');
            me.getView().setLoading(false);
            // Client signature is required but doesn't exist
        } else if (data.clientSigReq && !me.signatureExists(data.attachments, AttachmentType.ClientSignature)) {

            Ext.Msg.show({
                title: 'Submit without ' + settings.clientLabel + ' Approval?',
                message: 'This ' + settings.fwaAbbrevLabel + ' requires a ' + settings.clientLabel + ' signature, but does not have one. Do you still want to submit?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: Ext.bind(function (btn) {
                    if (btn === 'yes') {
                        me.handleFwaSubmission(settings.username, settings.empId, data);
                    } else {
                        // Return to FWA view, disable loading mask
                        me.getView().setLoading(false);
                    }
                }, me)
            });
            // No signature is required, or required signatures exist
        } else {
            me.handleFwaSubmission(settings.username, settings.empId, data);
        }
    },

    // Returns true if a signature of the given type exists
    signatureExists: function (attachments, type) {
        // No attachments exist; no signature
        if (!attachments || attachments.length == 0) {
            return false;
        }

        // Search the attachments for signatures of the given type
        var signature = Ext.Array.findBy(attachments, function (attachment) {
            return Ext.String.capitalize(attachment.attachmentType) == type;
        });

        // Convert our result to boolean before returning
        return !!signature;

    },

    handleFwaSubmission: function (username, empId, data) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            vw = me.getView(),
            fwa = vm.get('selectedFWA'),
            store = vm.getStore('fwalist') ? vm.getStore('fwalist') : settings.fwaList;
        //if not recurring or null set to schedStartDate, else leave as is
        if (!data.nextDate || data.nextDate == 'Invalid Date') {
            data.nextDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        } else if (data.nextDate.getFullYear() < 2014) {
            data.nextDate = TS.common.Util.getOutUTCDate(data.nextDate);
        }
        //convert for Time Zone
        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);
        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });
        //convert duration to minutes
        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);
        data.fwaStatusId = FwaStatus.Submitted;
        //clear out any selected templates
        data.availableTemplates = null;
        //check for any special associations

        TS.Util.onCheckPriorToEmployeeAssn(data, false, data.scheduledCrewId, function (isOkay) {
            if (isOkay) {
                // var  ret = Ext.first('fwa-edit').getController().fireViewEvent('submit', data);
                // fwa.set('attachmentsToAdd', null);
                Fwa.Submit(null, settings.username, settings.empId, data, false, function (response) {
                    if (response && response.success) {
                        //vm.set('selectedFWA', '');
                        store.load();
                        Ext.first('app-fwa').setActiveItem(0);
                    } else if (response && !response.success) {
                        Ext.GlobalEvents.fireEvent('Error', response);
                    }
                }, this, {
                    autoHandle: true
                });
            }
        });
    },

    newFileLoaded: function (cmp, event, t) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            dt = Ext.Date.format(new Date(), 'time'),
            formatDt = Ext.Date.format(new Date(), 'Y-m-d'),
            settings = TS.app.settings,
            btn = me.getView().down('button[action=camera]'),
            msg = 'Loading image data',
            fileName = cmp.value.replace(/C:\\fakepath\\/g, ''),
            path = vw.lookup('filePathField'),
            filenameField = vw.lookup('filenameField'),
            descriptionField = vw.lookup('descriptionField'),
            fileNameOnly = fileName.split('.')[0],
            pathValue = path.getValue();

        filenameField.setValue(fileNameOnly);//formatDt + ' ' +
        descriptionField.setValue(fileNameOnly);

        if (!pathValue || pathValue == '') {
            path.setValue(fileName);
        } else {
            // check for illegal characters  * . " / \ [ ] : ; | = < > ?
            pathValue = pathValue.replace('*', '').replace('"', '').replace('/', '').replace('\\', '').replace('[', '').replace(']', '').replace(':', '');
            pathValue = pathValue.replace(';', '').replace('|', '').replace('=', '').replace('<', '').replace('>', '').replace('?', '');
            //check for duplicates and remove
            Ext.each(fwa.get('attachments'), function (file) {
                if (file.filename == pathValue) {
                    path.setValue(fileName);
                }
            });
            //check for .jpg
            if (pathValue.indexOf('.jpg') === -1)
                pathValue += '.jpg';
            path.setValue(pathValue);
        }

        //cmp.value.replace(/C:\\fakepath\\/g, ''); //strip off C:\fakepath\ in case being used from a desktop
        //By default 'image/jpeg' will be returned, use 4th parameter to set mime to  'image/png'

        if (Ext.Viewport.getOrientation() == 'portrait')
            btn.getFileData(event, 480, 640);
        else if (Ext.Viewport.getOrientation() == 'landscape') {
            btn.getFileData(event, 640, 480);
        } else {
            btn.getFileData(event, 640, 640);
        }
        me.getView().lookup('loadPhoto').enable();
    },

    fileDataReceived: function (data) {
        //set preview window
        this.getView().down('#description').setData({
            description: 'Image Loaded',
            imagesrc: data
        });
    },

    reverseStringReturnExtention: function (s) {
        var sArray = s.split(''),
            rString = sArray.reverse(),
            jArray = rString.join(''),
            rExt = jArray.split('.')[0];

        sArray = rExt.split('');
        rString = sArray.reverse();
        return rString.join('');
    },

    onFileUploadChange: function (obj, newValue) {
        var me = this,
            ext = me.reverseStringReturnExtention(newValue),
            descriptionField = me.lookup('descriptionField'),
            filenameField = me.lookup('filenameField'),
            dt = Ext.Date.format(new Date(), 'Y-m-d'),
            fileObject = obj.el.down('input[type=file]').dom.files[0],
            dateStamp = Math.floor(Date.now() / 1000),
            dsString = dateStamp.toString().substring(6),
            file,
            fileName,
            fileNameOnly,
            txtField,
            captureType,
            promise,
            uploadField;

        if (obj.initialConfig.iconCls == 'x-fa fa-file-text' && (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'zip')) {
            Ext.Msg.alert('Warning', 'Not an acceptable document type.');
            return;
        }
        //chrome and others
        fileName = newValue.replace(/C:\\fakepath\\/g, '');
        //add timestamp
        fileName = fileName.split('.')[0] + '_' + dsString + '.' + fileName.split('.')[1];
        //IE & Edge
        file = fileName.split('\\');
        fileName = file[file.length - 1];

        fileNameOnly = fileName.replace('.' + ext, '');

        txtField = me.getView().lookup('filePathField');
        uploadField = me.getView().lookup('fileUploadField');
        txtField.setValue(fileName.split('/')[0]);

        filenameField.setValue(fileNameOnly);//dt + ' ' +
        descriptionField.setValue(fileNameOnly);
        if (obj.initialConfig.iconCls == 'x-fa fa-camera')
            me.setImagePreview(fileObject);

        Ext.first('#loadDoc').enable();
    },

    setImagePreview: function (file) {
        var me = this,
            fileField = me.lookup('fileUploadField'),
            settings = TS.app.settings,
            imageView,
            reader;

        imageView = me.lookup('imagePreview');
        if (file && file.type.match('image.*')) {
            reader = new FileReader();
            reader.onload = function (e) {
                imageView.setSrc(e.target.result);
                settings.myImage = '<img src="' + imageView.getSrc() + '" />';
            };
            reader.readAsDataURL(file);
            reader.onloadend = function (evt) {
                var img = new Image();
                img.src = evt.target.result;
                settings.myImage = img;
            };
            imageView.setHidden(false);
        }
    },

    loadFwaDoc: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            fileAttributes = vw.lookup('filePathField').getValue().split('.'),
            fileName = vw.lookup('filePathField').getValue(),
            extension = fileAttributes[fileAttributes.length - 1],
            description = me.lookup('descriptionField').getValue(),
            filename = me.lookup('filenameField'),
            fwa = vm.get('selectedFWA'),
            attachmentsToAdd = fwa.get('attachmentsToAdd') || [],
            docCt = fwa.get('attachmentCtDoc'),
            filefield = Ext.ComponentQuery.query('filefield')[0],
            file = filefield.el.down('input[type=file]').dom.files[0],
            attachment,
            attachmentData,
            dataRecord,
            base64String;
        //do in case file name has multiple . in it
        if (fileAttributes.indexOf('.') > -1) {
            for (var i = 0; i < fileAttributes.length - 1; i++) {
                fileName += fileAttributes[i] + '.';
            }
            //strip last .
            fileName = fileName.substring(0, fileName.length - 1);
        }
        fileName = fileAttributes[0];
        //fileName = fileName.substring(0, fileName.length - 1);
        me.getView().setLoading(true, 'Saving Document...');
        if (!description || !filename) {
            Ext.Msg.alert('FYI', 'Both Filename and Description are required fields');
            me.getView().setLoading(false);
            return;
        }

        attachment = Ext.create('TS.model.shared.Attachment', {
            attachmentType: AttachmentType.Document,
            attachedByEmpId: settings.empId,
            dateAttached: new Date(),
            description: description,
            extension: extension,
            filename: fileName,
            owningModelId: vw.associatedRecordId,
            location: settings.documentStorageLoc,
            owningModelType: 'Fwa'
        });
        me.convertFileToByteData(file, Ext.bind(function (byteData) {
            dataRecord = Ext.create('TS.model.shared.AttachmentData', {
                attachmentItem: byteData
            });
            attachment.set('attachmentItem', dataRecord.get('attachmentItem'));
            attachmentsToAdd.push(attachment.getData());
            fwa.set('attachmentsToAdd', attachmentsToAdd);
            vw.setLoading(false);
        }, me));

        me.onResetAttachmentCounts(AttachmentType.Document, false);
        btn.up('sheet').hide();
    },

    onResetAttachmentCounts: function (attachmentType, isDelete) {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            docCt = fwa.get('attachmentCtDoc'),
            picCt = fwa.get('attachmentCtPhoto');

        if (attachmentType == AttachmentType.Photo) {
            if (isDelete) {
                fwa.set('attachmentCtPhoto', (picCt - 1));
            } else {
                fwa.set('attachmentCtPhoto', (picCt + 1));
            }
        } else if (attachmentType == AttachmentType.Document) {
            if (isDelete) {
                fwa.set('attachmentCtDoc', docCt - 1)
            } else {
                fwa.set('attachmentCtDoc', docCt + 1)
            }
        }
    },

    uploadFwaTemplate: function (btn) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            fwaId = selection.get('fwaId'),
            grid = vw.lookup('templateGrid'),
            selections = grid.getSelections();

        Ext.each(selections, function (template) {
            me.getTemplateDocument(template, vw, fwaId);
        });
        btn.up('sheet').hide();
    },

    getTemplateDocument: function (template, vw, fwaId) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            settings = TS.app.settings,
            tType = template.get('templateType'),
            offset = new Date().getTimezoneOffset() / 60,
            saveFirst = false,
            fwaData = me.massageFwaData(),
            data;

        selection.dirty = me.checkIsDirty(selection);
        saveFirst = selection.dirty || false;
        fwaData.attachments = [];

        Document.GetUnsavedFwaDocument(null, settings.username, settings.empId, template.get('templateId'), template.get('templateApp'), fwaId, fwaData, tType, 'Y', offset, saveFirst, function (response, operation, success) {
            if (success && response.data) {
                if (saveFirst) {
                    selection.set('attachmentsToAdd', []);
                    selection.dirty = false;
                }
                data = {
                    associatedId: fwaId,
                    attachedByEmpId: settings.empId,
                    attachmentType: 'D',
                    location: settings.documentStorageLoc,
                    fileExt: tType == 'H' ? 'html' : 'xlsx',
                    fileName: template.get('filename'),
                    description: template.get('description'),
                    file: response.data,
                    type: 'FWA'
                };
                me.performTemplateUpload(data, vw, template);
            } else {
                if (success && !response.data) {
                    Ext.Msg.alert('Warning', 'No data returned for selected template.')
                } else {
                    Ext.Msg.alert('Warning', 'No data returned for selected template.')
                }
            }
        }, me, {
            autoHandle: true
        });
    },

    performTemplateUpload: function (data, view, template) {
        var me = this,
            vw = me.getView(),
            grid = vw.lookup('templateGrid'),
            vm = me.getViewModel(),
            dataRecord,
            selection = vm.get('selectedFWA'),
            attachmentRecord = Ext.create('TS.model.shared.Attachment', {
                owningModelType: data.type,
                owningModelId: data.associatedId,
                dateAttached: data.date || new Date(),
                attachedByEmpId: data.attachedByEmpId,
                attachmentType: data.attachmentType,
                location: data.location,
                extension: data.fileExt,
                filename: data.fileName,
                description: data.description
            }),
            record = vm.get('selectedFWA'),
            attachmentsToAdd = record.get('attachmentsToAdd') || [],
            docCt = record.get('attachmentCtDoc');

        view.setLoading(true);
        dataRecord = Ext.create('TS.model.shared.AttachmentData', {
            attachmentItem: data.file
        });
        attachmentRecord.set('attachmentItem', dataRecord.get('attachmentItem'));
        attachmentRecord.set('base64String', dataRecord.get('attachmentItem'));
        attachmentsToAdd.push(attachmentRecord.getData());
        record.set('attachmentsToAdd', attachmentsToAdd);
        view.setLoading(false);

        grid.deselect(template);

        selection.dirty = true;
        if (grid.getSelectionCount() === 0) {
            Ext.first('window-templates').destroy();
            Ext.first('window-document').destroy();
        }

        record.set('attachmentCtDoc', docCt + 1)
    },

    loadTemplates: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            fwaId = fwa.get('fwaId'),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'window-templates',
                fwa: fwa,
                //Fuse view models
                viewModel: {
                    parent: vm
                },
                attType: 'Document',
                location: settings.documentStorageLoc,
                associatedRecordId: fwaId,
                attachmentsList: {
                    modelType: 'FWA',
                    modelId: fwaId,
                    includeItem: true,
                    attachmentType: AttachmentType.Document
                }
            }),
            grid = sheet.lookup('templateGrid'),
            wbs1 = fwa.get('wbs1'),
            wbs2 = fwa.get('wbs2'),
            wbs3 = fwa.get('wbs3'),
            fwaNum = fwa.get('fwaNum'),
            // plugin = grid.getPlugins()[0],
            store;
        //plugin.setEnableDeleteButton(false);
        Document.GetTemplateList(null, settings.username, 'FWA', fwaId, function (response) {
            if (response && response.success) {
                store = new Ext.data.Store({
                    model: 'TS.model.shared.PrintTemplate',
                    data: response.data
                });
                store.filterBy(function (record) {
                    return (record.get('templateApp') === 'FWA');
                }, me);

                Ext.each(store.getRange(), function (item) {
                    var dt = Ext.Date.format(new Date(), 'Y-m-d h.i A'),
                        filename = dt + ' ' + item.get('templateName'),
                        hasLEM = filename.toUpperCase().indexOf('LEM') !== -1;
                    if (hasLEM) {
                        dt = Ext.Date.format(new Date(), 'm-d-Y');
                        filename = 'LHB_LEM ';
                        if (wbs1) filename += ' ' + wbs1;
                        // if (wbs2) filename += '-' + wbs2;
                        // if (wbs3) filename += '-' + wbs3;
                        filename += ' ' + dt + ' FWA ' + fwaNum;
                    }
                    item.set('filename', filename);
                    item.set('description', dt + ' ' + item.get('templateName'));
                });
                grid.setStore(store);

                // fwa.set('availableTemplates', store.data);
                //sheet.down('titlebar[docked=top]').setTitle(attachText + TS.app.settings.fwaAbbrevLabel + ' Document');
                Ext.Viewport.add(sheet);
                sheet.show();
            }
        }, me, {
            autoHandle: true
        });
    },

    checkExists: function (data, key) {
        if (key in data)
            return data[key];

        return null;
    },

    convertToDegrees: function (val) {
        var d0 = val[0].numerator,
            d1 = val[0].denominator,
            d = d0 / d1,

            m0 = val[1].numerator,
            m1 = val[1].denominator,
            m = m0 / m1,

            s0 = val[2].numerator,
            s1 = val[2].denominator,
            s = s0 / s1;

        return d + (m / 60.0) + (s / 3600.0);
    },

    loadFwaPhoto: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            fileAttributes = vw.lookup('fileUploadField').getValue().split('.'), //filePathField
            fileName = vw.lookup('filePathField').getValue(), //fileUploadField
            extension = fileAttributes[fileAttributes.length - 1],
            description = vw.lookup('descriptionField').getValue(),
            filename = me.lookup('filenameField'),
            fwa = vm.get('selectedFWA'),
            attachmentsToAdd = fwa.get('attachmentsToAdd') || [],
            filefield = Ext.ComponentQuery.query('filefield')[0],
            file = filefield.el.down('input[type=file]').dom.files[0],
            attachment,
            attachmentData,
            dataRecord,
            base64String;

        //do in case file name has multiple . in it
        if (fileAttributes.indexOf('.') > -1) {
            for (var i = 0; i < fileAttributes.length - 1; i++) {
                fileName += fileAttributes[i] + '.';
            }
            //strip last .
            fileName = fileName.substring(0, fileName.length - 1);
        }
        me.getView().setLoading(true, 'Saving Photo...');

        if (!description || !filename) {
            Ext.Msg.alert('FYI', 'Both Filename and Description are required fields');
            me.getView().setLoading(false);
            return;
        }
        attachment = Ext.create('TS.model.shared.Attachment', {
            attachmentType: AttachmentType.Photo,
            attachedByEmpId: settings.empId,
            dateAttached: new Date(),
            description: description,
            extension: extension,
            filename: fileName.replace('.' + extension, ''),
            owningModelId: vw.associatedRecordId,
            owningModelType: 'Fwa'
        });

        me.convertFileToByteData(file, Ext.bind(function (byteData) {
            dataRecord = Ext.create('TS.model.shared.AttachmentData', {
                attachmentItem: byteData
            });
            attachment.set('attachmentItem', dataRecord.get('attachmentItem'));
            attachmentsToAdd.push(attachment.getData());
            fwa.set('attachmentsToAdd', attachmentsToAdd);
            vw.setLoading(false);
        }, me));

        me.onResetAttachmentCounts(AttachmentType.Photo, false);
        btn.up('sheet').hide();
    },

    onEditMenuTap: function (bt) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            settings = TS.app.settings,
            menu = vw.up('tabpanel').add(Ext.create({xtype: 'fwa-editmenu', viewModel: {}})),
            lastRecurrDate;

        if (selection.get('attachmentCtPhoto') > 0)
            Ext.first('#fwaPhotoButton').setText('Photo ' + '(' + selection.get('attachmentCtPhoto') + ')');
        if (selection.get('attachmentCtDoc') > 0)
            Ext.first('#fwaDocButton').setText('Doc ' + '(' + selection.get('attachmentCtDoc') + ')');

        if (selection.get('recurrenceConfig')) {
            lastRecurrDate = selection.get('recurrenceDatesInRange')[selection.get('recurrenceDatesInRange').length - 1];
            if (selection.get('lastSubmittedDate') > selection.get('lastApprovedDate') && selection.get('fwaApprovers').indexOf(settings.empId) !== -1
                && (new Date() < new Date(lastRecurrDate) || selection.get('fwaStatusId') == FwaStatus.Submitted)) {
                Ext.first('#approveFwaButton').setDisabled(false);
                if (!selection.get('fwaApproversCanModify')) {
                    Ext.first('#fwaCopyButton').setDisabled(true);
                    Ext.first('#fwaPhotoButton').setDisabled(true);
                    Ext.first('#fwaCreateButton').setDisabled(true);
                }
            } else {
                if (selection.get('fwaStatusId') == FwaStatus.Submitted && selection.get('fwaApprovers').indexOf(settings.empId) !== -1) {
                    //enable  FWA Approve button
                    Ext.first('#approveFwaButton').setDisabled(false);
                    if (!selection.get('fwaApproversCanModify')) {
                        Ext.first('#fwaCopyButton').setDisabled(true);
                        Ext.first('#fwaPhotoButton').setDisabled(true);
                        Ext.first('#fwaCreateButton').setDisabled(true);
                    }
                }
            }
        } else if (selection.get('fwaStatusId') == FwaStatus.Submitted && selection.get('fwaApprovers').indexOf(settings.empId) !== -1) {
            //enable  FWA Approve button
            Ext.first('#approveFwaButton').setDisabled(false);
            if (!selection.get('fwaApproversCanModify')) {
                Ext.first('#fwaCopyButton').setDisabled(true);
                Ext.first('#fwaPhotoButton').setDisabled(true);
                Ext.first('#fwaCreateButton').setDisabled(true);
            }
        }

        if (settings.fwaCanModify == 'N' || (selection.get('fwaApprovers').indexOf(settings.empId) !== -1 && !selection.get('fwaApproversCanModify'))) {
            Ext.first('#fwaCopyButton').setDisabled(true);
            //Ext.first('#fwaPhotoButton').setDisabled(true); //can still see, but cannot edit
            Ext.first('#fwaCreateButton').setDisabled(true);
        }

        //match up with isNew to show/hide edit menu items
        vm.set('isNewOrHideCopy', (vm.get('newFwa') || vm.get('hideFwaCopyButton')));

        menu.show();
    },

    onEditMenuOfflineTap: function (bt) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            settings = TS.app.settings,
            menu = vw.up('tabpanel').add(Ext.create({xtype: 'fwa-editmenu-offline', viewModel: {}})),
            lastRecurrDate;

        if (selection.get('attachmentCtPhoto') > 0)
            Ext.first('#fwaPhotoButton').setText('Photo ' + '(' + selection.get('attachmentCtPhoto') + ')');
        if (selection.get('attachmentCtDoc') > 0)
            Ext.first('#fwaDocButton').setText('Doc ' + '(' + selection.get('attachmentCtDoc') + ')');

        if (selection.get('recurrenceConfig')) {
            lastRecurrDate = selection.get('recurrenceDatesInRange')[selection.get('recurrenceDatesInRange').length - 1];
            if (selection.get('lastSubmittedDate') > selection.get('lastApprovedDate') && selection.get('fwaApprovers').indexOf(settings.empId) !== -1
                && (new Date() < new Date(lastRecurrDate) || selection.get('fwaStatusId') == FwaStatus.Submitted)) {
                if (!selection.get('fwaApproversCanModify')) {
                    Ext.first('#fwaCopyButton').setDisabled(true);
                    Ext.first('#fwaPhotoButton').setDisabled(true);
                }
            }
        }
        menu.show();
        settings.currentState = selection.dirty;
    },

    refreshAddressValues: function (record) {
        var rec = this.getViewModel().get('selectedFWA'),
            vw = this.getView();
        if (rec) {
            vw.lookup('locLatitude').setValue(rec.getLoc().get('latitude'));
            vw.lookup('locLongitude').setValue(rec.getLoc().get('longitude'));
        }
    },

    onMapLocationTap: function (cmp, e) {
        var rec = this.getViewModel().get('selectedFWA'),
            sheet;

        sheet = Ext.create({
            xtype: 'fwa-map',
            viewModel: {
                parent: this.getViewModel()
            },
            dataRecord: rec
        });

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    doSaveSignature: function (bt) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            settings = TS.app.settings,
            attType = me.getView().attType,
            // Get the references and image data, convert to blob
            //draw = me.lookup('sigDrawPanel'),
            draw = vw.down('ts-draw'),
            imageData = draw.toDataURL(),
            //imageData = draw.getImage('stream'),
            file = new Blob([imageData.data], {
                type: 'image/png'
            }),
            base64 = imageData.split('base64,')[1],
            binary_string = window.atob(base64),
            len = binary_string.length,
            bytesArray = [],
            emailAddress = vw.lookup('emailAddressField'),
            sendEmail = vw.lookup('sendEmailField').getValue(),
            offset = new Date().getTimezoneOffset() / 60,
            fwaUnitGrid = Ext.first('grid-unit'),
            useEmailPopup = false,
            sendAttachedEmail = false,
            saveFirst = true,
            emailData,
            fwaData,
            data;

        for (var i = 0; i < len; i++) {
            bytesArray[i] = binary_string.charCodeAt(i);
        }

        if (attType == 'S') {
            if (vw.lookup('sendEmailField').getChecked() && !vw.lookup('emailAddressField').getValue()) {
                useEmailPopup = true;
            } else if (vw.lookup('sendEmailField').getChecked() && vw.lookup('emailAddressField').getValue()) {
                var ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                    testResult = ereg.test(vw.lookup('emailAddressField').getValue());
                if (!testResult) {
                    Ext.Msg.alert('Error', 'Please enter a valid email address');
                    return;
                } else {
                    sendAttachedEmail = true;
                    emailData = {
                        app: 'FWA',
                        attachFwa: '1',
                        attachForm: true,
                        modelId: fwa.get('fwaId'),
                        body: 'Copy of signed ' + settings.fwaAbbrevLabel + ' attached',
                        cc: window.userGlobal.email,
                        empId: settings.empId,
                        subject: fwa.get('fwaName'),
                        to: emailAddress.getValue()
                    };
                }
            }
        }

        data = {
            type: 'Fwa',
            location: settings.imageStorageLoc,
            associatedId: vw.associatedRecordId,
            attachedByEmpId: settings.empId,
            attachmentType: vw.attType,
            fileExt: 'png',
            fileName: 'signature_' + Ext.data.identifier.Uuid.Global.generate(), // TODO - How should this be autogenerated?
            description: 'Approval Signature',
            file: file,
            bytesArray: bytesArray
        };

        me.performRecordUpload(data, function () {
            bt.up('sheet').hide();
            me.afterSignatureUpload(data.attachmentType, imageData);
            if (sendAttachedEmail) {
                //fwaData = fwa.getData(true);
                fwaData = Ext.first('app-fwa').getController().massageFwaData();
                fwaData.attachments = [];

                Email.SendEmailWithUnsaved(null, settings.username, settings.empId, emailData, fwaData, offset, saveFirst, function (response, operation, success) {
                    if (success) {
                        if (saveFirst) {
                            Ext.Msg.alert('Success', settings.fwaAbbrevLabel + ' email successfully sent.');
                            fwa.set('attachmentsToAdd', []);
                            fwa.dirty = false;
                        } else {
                            Ext.Msg.alert('Success', '<p style="text-align:center">Email successfully sent.</p>');
                        }
                    }
                }, this, {
                    autoHandle: true,
                    failure: function () {
                        //me.getView().setLoading(false);
                    }.bind(me)
                });
            } else if (useEmailPopup) {
                Ext.first('app-fwa').getController().onOpenEmail();
            }
        });
    },

    performRecordUpload: function (data, successCallback) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            attachmentsToAdd = fwa.get('attachmentsToAdd') || [],
            dataRecord,
            settings = TS.app.settings,
            attachmentRecord = Ext.create('TS.model.shared.Attachment', {
                owningModelType: data.type,
                owningModelId: data.associatedId,
                attachedByEmpId: data.attachedByEmpId,
                dateAttached: Ext.Date.format(data.date || new Date(), DATE_FORMAT + ' g:i A'),
                attachmentType: data.attachmentType,
                location: data.location,
                extension: data.fileExt,
                filename: data.fileName,
                description: data.description
                // includeEmail: data.includeEmail,
                // emailAddress: data.emailAddress
            });

        if (data.attachmentType == AttachmentType.ClientSignature) {
            if (fwa.get('clientApprovalImageId')) {
                attachmentRecord.set('attachmentId', fwa.get('clientApprovalImageId'));
            }
        } else if (data.attachmentType == AttachmentType.EmpSignature) {
            if (fwa.get('chiefApprovalImageId')) {
                attachmentRecord.set('attachmentId', fwa.get('chiefApprovalImageId'));
            }
        }
        vw.setLoading(true);

        me.convertFileToByteData(data.file, Ext.bind(function (byteData) {
            var saveType = (data.attachmentType.charAt(0) == AttachmentType.Document || data.attachmentType.charAt(0) == AttachmentType.Expense) ? 'Document' : (data.attachmentType.charAt(0) == AttachmentType.Photo) ? 'Photo' : 'Signature';
            if (saveType == 'Signature')
                dataRecord = Ext.create('TS.model.shared.AttachmentData', {
                    attachmentItem: data.bytesArray,
                    attachmentId: attachmentRecord.get('attachmentId')
                });
            else
                dataRecord = Ext.create('TS.model.shared.AttachmentData', {
                    attachmentItem: byteData,
                    attachmentId: attachmentRecord.get('attachmentId')
                });
            //new
            attachmentRecord.set('attachmentItem', dataRecord.get('attachmentItem'));
            attachmentsToAdd.push(attachmentRecord.getData());
            fwa.set('attachmentsToAdd', attachmentsToAdd);
            vw.setLoading(false);
            if (successCallback) {
                successCallback();
            }
            //end new
        }, me));
    },

    afterSignatureUpload: function (signatureType, imageData) {
        var me = this,
            vw = me.getView(),
            selection = me.getViewModel().get('selectedFWA'),
            date = new Date(),
            target = signatureType === AttachmentType.ClientSignature ? 'client' : 'chief',
            img = Ext.first('#' + target + 'ApprovalImage'); // Ext.first('fwa-edit-view').down('image[reference=' + target + 'ApprovalImage]');

        selection.set(target + 'ApprovalDate', Ext.Date.format(new Date(date), 'm/d/y h:i A'));
        selection.set(target + 'ApprovalImage', imageData);

        img.setSrc(imageData);
        img.show();
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

    onProjectSearchChange: function (field, newVal) {
        var tree = field.up('tree-list'),
            vm = tree.getViewModel(),
            store = vm.getStore('navItems');

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

    sendEmail: function (bt) {
        var me = this,
            vw = me.getView(),
            form = me.lookup('emailForm').getForm(),
            selection = me.getViewModel().get('selectedFWA'),
            record = form.getRecord(),
            emailData = me.lookup('emailForm').getValues(),
            offset = new Date().getTimezoneOffset() / 60,
            settings = TS.app.settings,
            saveFirst = false,
            fwaData,
            list,
            selections,
            attachList = [];

        if (vw.appType == 'Timesheet')
            vw.appType = 'TS';

        list = Ext.first('#attachList');
        if (list.getSelectionCount() > 0) {
            selections = list.getSelections();
            Ext.each(selections, function (item) {
                attachList.push(item.data);
            })
        }

        me.getView().setLoading(true, 'Sending Email');
        // Extra email params
        emailData.app = vw.appType;
        emailData.empId = settings.empId;
        emailData.modelId = me.getView().modelId;
        emailData.attachments = attachList;
        emailData.keepAfterSent = false; //TODO set this up to read from user config
        emailData.attachForm = emailData.attachForm == 'true' ? true : false;
        //check for dirty if FWA

        if (me.getView().appType != 'TS') {
            selection.dirty = me.checkIsDirty(selection);
            saveFirst = selection.dirty;
            fwaData = me.massageFwaData();
        }
        // Perform any validation
        if (form.isValid() && (emailData.body && emailData.to && emailData.subject)) {
            if (fwaData) {
                fwaData.attachments = [];
                Email.SendEmailWithUnsaved(null, settings.username, settings.empId, emailData, fwaData, offset, saveFirst, function (response, operation, success) {
                    bt.up('sheet').hide();
                    if (saveFirst) {
                        Ext.Msg.alert('Success', settings.fwaAbbrevLabel + ' has been saved and email sent.');
                        selection.set('attachmentsToAdd', []);
                        selection.dirty = false;
                    } else {
                        Ext.Msg.alert('Success', '<p style="text-align:center">Email successfully sent.</p>');
                    }
                }, this, {
                    autoHandle: true,
                    failure: function () {
                        me.getView().setLoading(false);
                    }.bind(me)
                });
            } else {
                Email.SendEmail(null, settings.username, emailData, offset, function (response, operation, success) {
                    bt.up('sheet').hide();
                    Ext.GlobalEvents.fireEvent('Message:Code', 'sendEmailSuccess');
                }, this, {
                    autoHandle: true,
                    failure: function () {
                        me.getView().setLoading(false);
                    }.bind(me)
                });
            }
        } else {
            Ext.GlobalEvents.fireEvent('Message:Code', 'sendEmailMissingFields');
            me.getView().setLoading(false);
        }

    },

    toggleWork: function (bt) {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            settings = TS.app.settings,
            newStatusId;

        // Work is In Progress; button stops work
        if (fwa.get('fwaStatusId') !== FwaStatus.InProgress) {
            Fwa.StartWork(null, settings.username, fwa.get('fwaId'), Ext.bind(me.handleToggleWorkResponse, me));
            newStatusId = FwaStatus.InProgress;
            // Work is Scheduled or Saved; button starts work
        } else {
            Fwa.EndWork(null, settings.username, fwa.get('fwaId'), Ext.bind(me.handleToggleWorkResponse, me));
            newStatusId = FwaStatus.Saved;

        }
        // Update the local status to match the remote
        fwa.set('fwaStatusId', newStatusId);
        bt.setText(fwa.get('fwaStatusId') !== FwaStatus.InProgress ? 'Start' : 'Stop');
        bt.setIconCls(fwa.get('fwaStatusId') !== FwaStatus.InProgress ? 'x-fa fa-hourglass-start' : 'x-fa fa-hourglass-end');
    },

    handleToggleWorkResponse: function (response, operation) {
        var messageCode = (operation.method === 'StartWork' ? 'fwaStartWorkSuccess' : 'fwaStopWorkSuccess'),
            vm = this.getViewModel(),
            selectedFWA = vm.get('selectedFWA');
        if (response && response.success) {
            Ext.each(response.data, function (arr) {
                selectedFWA.set(arr.Key, arr.Value);
            })
            Ext.GlobalEvents.fireEvent('Message:Code', messageCode);
        } else if (response) {
            Ext.GlobalEvents.fireEvent('Error', response);
        }
    },

    onExpWbs1Change: function (rec, newValue, oldValue, eOpts) {
        var nameField = Ext.first('#wbs1NameField'),
            record = rec.getStore().findRecord('id', newValue.get('id')),
            me = this;
        //set wbs1 name
        nameField.setValue(record.get('name'));
        //set account
        me.setAccount();
    },

    setAccount: function () {
        var me = this,
            settings = TS.app.settings,
            categoryField = me.lookup('categoryEditField'),
            categoryStore = categoryField.getStore(),
            categoryRecord = categoryStore.findRecord('category', categoryField.getValue()),
            wbs1Field = me.lookup('wbs1combo'),
            wbs1Store = wbs1Field.getStore(),
            accountField = me.lookup('accountField'),
            accountNameField = me.lookup('accountNameField'),
            accountStore = accountField.getStore(),
            billableField = me.lookup('billableField'),
            chargeType,
            acctRecord;

        if (wbs1Field.getValue() && categoryRecord) {
            chargeType = wbs1Store.findRecord('id', wbs1Field.getValue()).get('chargeType');
            accountStore.clearFilter();
            if (chargeType == 'R') {
                if (billableField.getChecked()) {
                    accountStore.filter('useOnRegularProjects', true);
                    accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                    acctRecord = accountStore.findRecord('account', accountField.getValue());
                    accountNameField.setValue(acctRecord.get('accountName'));
                } else {
                    accountStore.filter('useOnRegularProjects', false);
                    accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                    acctRecord = accountStore.findRecord('account', accountField.getValue());
                    accountNameField.setValue(acctRecord.get('accountName'));
                }
                billableField.setHidden(!settings.exDisplayBillable);
            } else {
                accountStore.filter('useOnRegularProjects', false);
                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
                billableField.setChecked(false);
                billableField.setHidden(true);
                acctRecord = accountStore.findRecord('account', accountField.getValue());
                accountNameField.setValue(acctRecord.get('accountName'));
            }
        }
    },

    onExpCategoryChange: function (obj, newValue, oldValue, eOpts) {
        if (!newValue) return;
        var me = this,
            record = Ext.getStore('ExpCategory').getById(newValue.get('category')),
            reasonField = me.lookup('reasonField'),
            otherField = me.lookup('otherField'),
            milesField = me.lookup('milesField'),
            amountPerMileField = me.lookup('amountPerMileField'),
            billableField = me.lookup('billableField'),
            detailType;
        reasonField.setHidden(true);
        otherField.setHidden(true);
        milesField.setHidden(true);
        amountPerMileField.setHidden(true);

        if (record) {
            detailType = record.get('detailType');
            switch (detailType) {
                case 'M':
                    reasonField.setHidden(false);
                    reasonField.setLabel('Business reason</br>for expense');
                    otherField.setHidden(false);
                    otherField.setLabel('Travel From/To');
                    milesField.setHidden(false);
                    amountPerMileField.setHidden(false);
                    break;
                case 'B':
                    reasonField.setHidden(false);
                    reasonField.setLabel('Business reason</br>for expense');
                    otherField.setHidden(false);
                    otherField.setLabel('Name of</br>each person');
                    break;
                case 'G':
                    reasonField.setHidden(false);
                    reasonField.setLabel('Business reason</br>for expense');
                    break;
            }

            billableField.setValue(record.get('billByDefault'));
        }

        me.setAccount();
    },

    onExpWbsChange: function (rec, newValue, oldValue, eOpts) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedEXP'),
            wbs1 = selection && selection.get('wbs1') ? selection.get('wbs1') : vw.lookup('wbs1combo') && vw.lookup('wbs1combo').getSelection() ? vw.lookup('wbs1combo').getSelection().get('id') : '',
            wbs2 = selection && selection.get('wbs2') ? selection.get('wbs2') : vw.lookup('wbs2combo') && vw.lookup('wbs2combo').getSelection() ? vw.lookup('wbs2combo').getSelection().get('id') : '',
            wbs3 = selection ? selection.get('wbs3') : '',
            wbs1Selection = Ext.first('#fwawbs1id').getSelection();

        if (rec.getName() == 'wbs2') {
            if (newValue)
                rec.getParent().innerItems[7].setValue(rec.getStore().findRecord('id', newValue.get('id')).get('name'));
        } else if (rec.getName() == 'wbs3') {
            if (newValue)
                rec.getParent().innerItems[9].setValue(rec.getStore().findRecord('id', newValue.get('id')).get('name'));
        }

    },

    onWbsChange: function (rec, newValue, oldValue, eOpts) {

        if (IS_OFFLINE) return;

        var me = this,
            settings = TS.app.settings,
            empGroupId = settings.empGroupId,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            wbs1 = selection && selection.get('wbs1') ? selection.get('wbs1') : vw.lookup('wbs1combo') && vw.lookup('wbs1combo').getSelection() ? vw.lookup('wbs1combo').getSelection().get('id') : '',
            wbs2 = selection && selection.get('wbs2') ? selection.get('wbs2') : vw.lookup('wbs2combo') && vw.lookup('wbs2combo').getSelection() ? vw.lookup('wbs2combo').getSelection().get('id') : '',
            wbs3 = selection ? selection.get('wbs3') : '',
            wbs1Selection = Ext.first('#fwawbs1id').getSelection(),
            isScheduler = me.getViewModel().get('isScheduler'),
            models = [],
            locModel = [];

        if (wbs1Selection && selection) {
            selection.set('clientId', wbs1Selection.get('clientId'));
        }

        if (rec.modelName == 'Wbs1' && wbs2 == '' && wbs1 != '') {
            if (vm.get('newFwa') && vm.get('selectedFWA').get('wbs1')) {
                me.onGetFwaInfoForWbs();
            }
        } else if (rec.modelName == 'Wbs2') {
            if (vm.get('newFwa')) {
                me.onGetFwaInfoForWbs();
            }
        } else if (rec.modelName == 'Wbs3') {
            if (vm.get('newFwa')) {
                me.onGetFwaInfoForWbs();
            }
        }

        if (selection && wbs2 == '')
            me.getFwaUnitsByWbs();

        //check if required
        if (rec.getRequired() && !rec.getValue()) {
            rec.setRequiredCls('required-background');
        } else {
            rec.setRequiredCls('');
        }

        if (!wbs1 && !wbs2 && !wbs3) return;
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
                        settings = TS.app.settings,
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
                        if (!vm.get('hideUdf_' + list.udfId.split('_')[1] + '_combo')) {
                            vw.lookup(list.udfId + '_text').setHidden(true);
                            comboBox.setHidden(false);
                        }
                        comboBox.setStore(store);
                        if (currentValue != '' && currentValue != null) {
                            comboBox.setValue(currentValue);
                        } else {
                            comboBox.setValue('');
                        }
                        //me.setIsComboValue(list.udfId)
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


    onGetFwaInfoForWbs: function () {
        var me = this,
            settings = TS.app.settings,
            empGroupId = settings.empGroupId,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            vw = me.getView(),
            wbs1 = selection && selection.get('wbs1') ? selection.get('wbs1') : vw.lookup('wbs1combo') && vw.lookup('wbs1combo').getSelection() ? vw.lookup('wbs1combo').getSelection().get('id') : '',
            wbs2 = selection && selection.get('wbs2') ? selection.get('wbs2') : vw.lookup('wbs2combo') && vw.lookup('wbs2combo').getSelection() ? vw.lookup('wbs2combo').getSelection().get('id') : '',
            wbs3 = selection && selection.get('wbs3') ? selection.get('wbs3') : vw.lookup('wbs3combo') && vw.lookup('wbs3combo').getSelection() ? vw.lookup('wbs3combo').getSelection().get('id') : '',
            unitCodeStore = Ext.getStore('UnitCode'),
            models = [],
            locModel = [],
            units = selection.units().data,
            workCodes = selection.workSchedAndPerf().data,
            hours = selection.hours().data,
            fwaInfo = Ext.create('TS.model.fwa.FwaInfo'),
            recordsToRemove = [];

        Fwa.GetFwaInfoForWbs(null, empGroupId, wbs1 || '^', wbs2 || '^', wbs3 || '^', function (response) {
            if (response && response.success) {
                fwaInfo = response.data;
                models = fwaInfo.fieldInfo.split('^');
                Ext.each(models, function (model) {

                    model.trim();

                    if (model.indexOf('fwaName') === 0) { // && selection.get('fwaName') == ''
                        selection.set('fwaName', model.split('=')[1]);
                    }
                    if (model.indexOf('fwaNumber') === 0 && selection.get('fwaNum') === '') {
                        selection.set('fwaNum', model.split('=')[1]);
                    }
                    if (model.indexOf('contactInfo') === 0) { // && selection.get('contactInfo') == ''
                        selection.set('contactInfo', model.split('=')[1]);
                    }
                    if (model.indexOf('isContractWork') == 0) {
                        selection.set('isContractWork', model.split('=')[1] !== 'N');
                    }
                    if (model.indexOf('wbsLocked') === 0) {
                        selection.set('wbsLocked', model.split('=')[1] !== 'N');
                    }
                    if (model.indexOf('udfT1') === 0) {
                        selection.set('udf_t1', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT2') === 0) {
                        selection.set('udf_t2', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT3') === 0) {
                        selection.set('udf_t3', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT4') === 0) {
                        selection.set('udf_t4', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT5') === 0) {
                        selection.set('udf_t5', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT6') === 0) {
                        selection.set('udf_t6', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT7') === 0) {
                        selection.set('udf_t7', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT8') == 0) {
                        selection.set('udf_t8', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT9') == 0) {
                        selection.set('udf_t9', model.split('=')[1]);
                    }
                    if (model.indexOf('udfT10') === 0) {
                        selection.set('udf_t10', model.split('=')[1]);
                    }
                    if (model.indexOf('clientSigReq') === 0) {
                        selection.set('clientSigReq', model.split('=')[1] !== 'N');
                    }
                    if (model.indexOf('chiefSigReq') === 0) {
                        selection.set('chiefSigReq', model.split('=')[1] !== 'N');
                    }
                    if (model.indexOf('loc.address1') === 0) {
                        selection.set('address1', model.split('=')[1]);
                        Ext.first('#address1Field').setValue(selection.get('address1'));
                    }
                    if (model.indexOf('loc.address2') === 0) {
                        selection.set('address2', model.split('=')[1]);
                        Ext.first('#address2Field').setValue(selection.get('address2'));
                    }
                    if (model.indexOf('loc.city') === 0) {
                        selection.set('city', model.split('=')[1]);
                        Ext.first('#cityField').setValue(selection.get('city'));
                    }
                    if (model.indexOf('loc.state') === 0) {
                        selection.set('state', model.split('=')[1]);
                        Ext.first('#stateField').setValue(selection.get('state'));
                    }
                    if (model.indexOf('loc.zip') === 0) {
                        selection.set('zip', model.split('=')[1]);
                        Ext.first('#zipField').setValue(selection.get('zip'));
                    }
                    if (model.indexOf('loc.latitude') === 0) {
                        selection.set('latitude', model.split('=')[1]);
                        Ext.first('#latitudeField').setValue(selection.get('latitude'));
                    }
                    if (model.indexOf('loc.longitude') === 0) {
                        selection.set('longitude', model.split('=')[1]);
                        Ext.first('#longitudeField').setValue(selection.get('longitude'));
                    }
                    if (model.indexOf('udfA1') === 0) {
                        selection.set('udf_a1', model.split('=')[1]);
                    }
                    if (model.indexOf('udfA2') === 0) {
                        selection.set('udf_a2', model.split('=')[1]);
                    }
                    if (model.indexOf('udfA3') === 0) {
                        selection.set('udf_a3', model.split('=')[1]);
                    }
                    if (model.indexOf('udfA4') === 0) {
                        selection.set('udf_a4', model.split('=')[1]);
                    }
                    if (model.indexOf('udfA5') === 0) {
                        selection.set('udf_a5', model.split('=')[1]);
                    }
                    if (model.indexOf('udfA6') === 0) {
                        selection.set('udf_a6', model.split('=')[1]);
                    }
                    if (model.indexOf('udfD1') === 0) {
                        selection.set('udf_d1', model.split('=')[1]);
                    }
                    if (model.indexOf('udfD2') === 0) {
                        selection.set('udf_d2', model.split('=')[1]);
                    }
                    if (model.indexOf('udfD3') === 0) {
                        selection.set('udf_d3', model.split('=')[1]);
                    }
                });

                //clear out any old values
                workCodes.clear();
                Ext.each(fwaInfo.workInfo, function (wc) {
                    workCodes.add(Ext.create('TS.model.fwa.Work', {
                        workCodeId: wc.workCodeId,
                        workCodeAbbrev: wc.workCodeAbbrev,
                        scheduledHours: wc.scheduledHours,
                        actualHours: wc.actualHours,
                        comments: wc.comments,
                        picRequired: wc.picRequired,
                        pctComplete: wc.pctComplete,
                        fwaInfo: true
                    }));
                });
                //clear out any old values
                Ext.each(hours.getRange(), function (empHrs) {
                    recordsToRemove.push(empHrs);
                });
                hours.remove(recordsToRemove);
                if (workCodes.length > 0 && selection.get('scheduledCrewId')) {
                    var crew = Ext.getStore('AllCrews').findRecord('crewId', selection.get('scheduledCrewId')),
                        crewMembers = crew.get('crewMembers'),
                        workDate = new Date(Ext.Date.format(new Date(), DATE_FORMAT));
                    Ext.each(crewMembers.getRange(), function (cm) {
                        var emp = Ext.getStore('AllEmployees').findRecord('empId', cm.get('empId'));
                        Ext.each(workCodes.getRange(), function (wc) {
                            hours.add(Ext.create('TS.model.fwa.FwaHours', {
                                workDate: workDate,
                                empId: cm.get('empId'),
                                empGroupId: '',
                                modified: 'A',
                                workCodeId: wc.get('workCodeId'),
                                workCodeAbbrev: wc.get('workCodeAbbrev'),
                                //laborCode: emp.get('tsDefLaborCode'),
                                crewRoleId: cm.get('crewMemberRoleId')
                            }));
                        });
                    });
                }

                //clear out any old values
                units.clear();
                Ext.each(fwaInfo.unitInfo, function (unit) {
                    units.add(Ext.create('TS.model.fwa.Unit', {
                        unitCodeId: unit.unitCodeId,
                        quantity: unit.quantity,
                        unitDate: unit.unitDate <= '0001-01-01T00:00:00' ? new Date() : unit.unitDate,
                        equipmentId: unit.equipmentId,
                        equipmentName: unit.equipmentName,
                        comments: unit.comments,
                        details: unit.details,
                        unitSeq: unit.unitSeq,
                        fwaInfo: true
                    }));
                });

                settings.fwaactionsInfo = [];
                Ext.each(fwaInfo.FieldActionsInfo, function (action) {
                    settings.fwaactionsInfo.push(Ext.create('TS.model.fwa.FwaAction', {
                        actionItemId: action.actionItemId,
                        actionItemDescr: action.actionItemDescr,
                        actionTypeId: action.actionTypeId,
                        actionOwnerId: action.actionOwnerId,
                        actionDateCompleted: action.actionDateCompleted,
                        actionNotes: action.actionNotes
                    }));
                });
            }
        }, me, {
            autoHandle: true
        });
    },

    getFwaUnitsByWbs: function () {
        var me = this,
            vm = me.getViewModel(),
            selection = Ext.first('#unitCodeGrid'),
            settings = TS.app.settings,
            record = vm.get('selectedFWA'),
            unitCodeStore = Ext.getStore('UnitCode'),
            wbs1 = me.lookup('wbs1combo').getValue(),
            wbs2 = me.lookup('wbs2combo').getValue(),
            wbs3 = me.lookup('wbs3combo').getValue(),
            data,
            store,
            units,
            fwaUnits = [];

        //get current values, not record values
        wbs1 = wbs1 ? wbs1 : '^';
        wbs2 = wbs2 ? wbs2 : '^';
        wbs3 = wbs3 ? wbs3 : '^';
        //get current units
        if (record.units().getRange().length == 0) {
            return;
        }
        data = record.units() && record.units().length != 0 ? record.units().getRange() : [];
        //load current fwa units
        if (data.length != 0) {
            Ext.each(data, function (obj) {
                fwaUnits.push({
                    unitCodeId: obj.get('unitCodeId'),
                    unitSeq: obj.get('unitSeq'),
                    quantity: obj.get('quantity'),
                    equipmentId: obj.get('equipmentId'),
                    equipmentName: obj.get('equipmentName'),
                    comments: obj.get('comments'),
                    details: Ext.Array.pluck(obj.get('details').getRange(), 'data')
                });
            });
        }

        // check current and load available units
        UnitCode.GetFwaUnitsByWbs(null, settings.username, record.get('fwaId'), wbs1, wbs2, wbs3, fwaUnits, function (response) {
            if (response && response.success) {
                //display warning message and continue
                if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                    Ext.Msg.alert('Warning', response.message.mdBody);
                    record.units().data.removeAll();
                    Ext.each(response.data, function (unit) {
                        record.units().data.add(Ext.create('TS.model.fwa.Unit', {
                            unitDate: unit.unitDate,
                            readOnly: unit.readOnly,
                            readOnlyReason: unit.readOnlyReason,
                            unitCodeId: unit.unitCodeId,
                            quantity: unit.quantity,
                            equipmentId: unit.equipmentId,
                            equipmentName: unit.equipmentName,
                            comments: unit.comments,
                            details: unit.details
                        }));
                    })
                }
                //reload unit code drop down
                unitCodeStore.getProxy().setExtraParams({
                    wbs1: wbs1,
                    wbs2: wbs2,
                    wbs3: wbs3,
                    includeInactive: true
                });
                unitCodeStore.reload();
                //create Unit store and load
                var store = Ext.create('Ext.data.Store', {
                    model: 'TS.model.fwa.Unit'
                });

                store.loadData(response.data);
                // units = selection.units();
                // units = store;
            } else if (!response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }.bind(me));

    },

    onResetDates: function () {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            //selection = vm.get('selectedFWA'),
            startDateField = Ext.first('#schedStartDateField'),
            endDateField = Ext.first('#schedEndDateField');
        //selection.set('scheduledCrewId', '');
        Ext.Msg.confirm("Please Confirm", "This will clear Start/End Dates & Times and un-schedule the " + settings.fwaAbbrevLabel + ". Do you wish to continue?", function (btn) {
            if (btn === 'yes') {
                startDateField.setValue('');
                endDateField.setValue('');
                Ext.first('#schedStartTimeField').setValue('');
                Ext.first('#schedEndTimeField').setValue('');
            }
        });
    },

    onResetOrderedDates: function () {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            orderedDateField = Ext.first('#resetOrderedDatesBtn'),
            orderedByField = Ext.first('#orderedByField'),
            requiredDateField = Ext.first('#dateRequiredField'),
            udf_d1_field = Ext.first('#udf_d1_field'),
            udf_d2_field = Ext.first('#udf_d2_field'),
            udf_d3_field = Ext.first('#udf_d3_field');

        selection.set('dateOrdered', '');
        selection.set('dateRequired', '');
        selection.set('orderedBy', '');
        selection.set('udf_d1', '');
        selection.set('udf_d2', '');
        selection.set('udf_d3', '');

        orderedByField.setValue('');
        orderedDateField.setValue('');
        requiredDateField.setValue('');
        udf_d1_field.setValue('');
        udf_d2_field.setValue('');
        udf_d3_field.setValue('');

        // Ext.Msg.confirm("Please Confirm", "This will clear Date(s) Ordered/Required. Do you wish to continue?", function (btn) {
        //     if (btn === 'yes')
        //     {
        //         orderedDateField.setValue('');
        //         requiredDateField.setValue('');
        //     }
        // });
    },

    onStartDateChange: function (obj, newValue, oldValue) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm ? vm.get('selectedFWA') : null,
            endDate,
            startDateField = Ext.first('#schedStartDateField'),
            endDateField = Ext.first('#schedEndDateField'),
            startTimeField = Ext.first('#schedStartTimeField'),
            time = new Date().toTimeString(),
            dt;

        // if (vm && startDateField.getValue() && vm.get('newFwa')) {
        //     vm.set('dateHeader', startDateField.getValue());
        //     endDateField.setValue(startDateField.getValue());
        // }

        if (selection) {
            selection.set('schedStartDate', new Date(Ext.Date.format(startDateField.getValue(), 'n/j/Y') + ' ' + Ext.Date.format(startDateField.getValue(), 'g:i A')));
            //selection.set('schedEndDate', new Date(Ext.Date.format(endDateField.getValue(), 'n/j/Y') + ' ' + Ext.Date.format(endDateField.getValue(),'g:i A')));
            startDate = selection.get('schedStartDate');
            endDate = selection.get('schedEndDate');
            //we want to keep the current end time
            if (startDate) {
                if (endDate)
                    dt = endDate.toDateString();
                else
                    dt = startDate.toDateString();
                if (endDate) {
                    time = endDate.toTimeString();
                } else {
                    dt = new Date(dt + ' ' + time);
                    dt = Ext.Date.add(dt, Ext.Date.HOUR, 1);
                    selection.set('schedEndDate', new Date(dt));
                }
            }
        }

        if (newValue != oldValue && oldValue && vm)
            if (vm.get('selectedFWA'))
                vm.get('selectedFWA').dirty = true;
    },

    onEndDateChange: function (comp, newValue, oldValue) {
        var vm = this.getViewModel(),
            startDateField = Ext.first('#schedStartDateField'),
            endDateField = Ext.first('#schedEndDateField');

        if (endDateField.getValue() < startDateField.getValue() && newValue) {
            Ext.Msg.alert('Warning', 'End Date must be greater than or equal to Start Date');
            endDateField.setValue();
        }

        if (newValue != oldValue && oldValue && vm)
            if (vm.get('selectedFWA'))
                vm.get('selectedFWA').dirty = true;
    },

    onWorkCodeSelection: function (bt) {
        var me = this,
            grid = bt.up('sheet').down('grid'),
            plugin = grid.findPlugin('grideditable'),
            selection = me.getViewModel().get('selectedWSP');
        //plugin.hidePhotoButton(false);
        plugin.startEdit(selection);
    },

    onHoursSelection: function (bt) {
        var me = this,
            grid = bt.up('sheet').down('grid'),
            plugin = grid.findPlugin('grideditable'),
            selection = me.getViewModel().get('selectedHRS'),
            settings = TS.app.settings,
            hoursEditor = Ext.first('#employeeHours'),
            empId = selection.get('empId');

        plugin.startEdit(selection);
        // if (settings.empId != empId && !settings.tsCanEnterCrewMemberTime) {
        //     plugin.disableEmployeeHours(true);
        // }
    },

    searchPrior: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            settings = TS.app.settings,
            wcList = Ext.first('#workCodeList'),
            fwa = vm.get('selectedFWA'),
            searchParameters = '',
            wcString = '',
            searchForm = vw.lookup('searchForm'),
            resultSet = vw.lookup('searchResultSet'),
            resultList = vw.lookup('fwaResultList'),
            store = resultList.getStore(),
            checkBoxFieldset = vw.lookup('checkBoxFieldset');

        vw.setLoading(true);
        Ext.each(wcList.getSelections(), function (wc) {
            wcString += wc.get('workCodeAbbrev') + ',';
        });
        // get Client ID
        searchParameters += Ext.first('#clientSearch').getValue() ? '^' + 'ClientID=' + fwa.get('clientId') : '';
        //get WBS values
        searchParameters += Ext.first('#wbs1Search').getValue() ? '^' + 'WBS1=' + Ext.first('#wbs1Search').getValue() : '';
        searchParameters += Ext.first('#wbs2Search').getValue() ? '^' + 'WBS2=' + Ext.first('#wbs2Search').getValue() : '';
        searchParameters += Ext.first('#wbs3Search').getValue() ? '^' + 'WBS3=' + Ext.first('#wbs3Search').getValue() : '';
        //get start/end dates
        searchParameters += Ext.first('#startDateSearch').getValue() ? '^' + 'StartDate=' + Ext.Date.format(Ext.first('#startDateSearch').getValue(), 'Y-m-d') : '';
        searchParameters += Ext.first('#endDateSearch').getValue() ? '^' + 'EndDate=' + Ext.Date.format(Ext.first('#endDateSearch').getValue(), 'Y-m-d') : '';
        //get work codes
        searchParameters += wcString ? '^' + 'WC=' + wcString : '';
        //remove first ^
        searchParameters = searchParameters.substr(1);

        store.getProxy().setExtraParams(
            {
                fwaId: fwa.get('fwaId') ? fwa.get('fwaId') : '',
                searchParameters: searchParameters
            }
        );
        store.load();

        searchForm.setHidden(true);
        Ext.first('#clearSelectionButton').setHidden(true);
        resultSet.setHidden(false);
        Ext.first('#searchButton').setHidden(true);
        Ext.first('#resetSearchButton').setHidden(false);
        Ext.first('#viewButton').setHidden(false);
        vw.setLoading(false);

    },

    resetSearch: function () {
        var me = this,
            vw = me.getView(),
            searchForm = vw.lookup('searchForm'),
            resultSet = vw.lookup('searchResultSet'),
            checkBoxFieldset = vw.lookup('checkBoxFieldset');
        searchForm.setHidden(false);
        Ext.first('#clearSelectionButton').setHidden(false);
        resultSet.setHidden(true);
        Ext.first('#searchButton').setHidden(false);
        Ext.first('#resetSearchButton').setHidden(true);
        Ext.first('#viewButton').setHidden(true);
    },

    viewSelectedResult: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            resultList = vw.lookup('fwaResultList'),
            selection = resultList.getSelections()[0],
            store = vm.getParent().getStore('viewfwa'),
            sheet = Ext.create({
                xtype: 'fwa-view',
                //Fuse view models
                viewModel: {
                    parent: vm.getParent(),
                    fwa: selection
                }
            });

        store.getProxy().setExtraParams({
            id: selection.get('fwaId'),
            fwaDate: Ext.Date.format(selection.get('schedStartDate'), 'Ymd')
        });

        sheet.setController('fwa-edit');
        store.load();
        sheet.down('titlebar[docked=top]').setTitle('Selected ' + TS.app.settings.fwaAbbrevLabel);
        Ext.Viewport.add(sheet);
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
                    parent: vm
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
            sheet = Ext.create({
                xtype: 'ts-fwaworkcodes',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            });
        vm.set('fwa', fwa);
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onManageUnitsTapView: function () {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            baseView = Ext.first('app-ts'),
            sheet = Ext.create({
                xtype: 'ts-fwaunits',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            });
        vm.set('fwa', fwa);
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onManageHoursTapView: function () {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            baseView = Ext.first('app-fwa'),
            sheet = Ext.create({
                xtype: 'ts-fwahours',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            });

        vm.set('fwa', fwa);
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onManageExpensesTapView: function () {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            baseView = Ext.first('app-fwa'),
            sheet = Ext.create({
                xtype: 'ts-fwaexpenses',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            });

        vm.set('fwa', fwa);
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onActionLookup: function () {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            baseView = Ext.first('app-fwa'),
            sheet = Ext.create({
                xtype: 'fwa-nonfieldactions',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                }
            });

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onCrewPhoneClick: function (obj) {
        var me = this,
            baseView = Ext.first('app-fwa'),
            sheet = Ext.create({
                xtype: 'fwa-crewphones',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                }
            }),
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            crewId = fwa.get('scheduledCrewId'),
            employees = Ext.getStore('Employees').getRange(),
            crew = Ext.getStore('AllCrews').getById(crewId),
            crewMembers = crew.getData().crewMembers.getRange(),
            html = '',
            infoArray = [],
            empName;
        vm.set('crewPhoneList', html);
        Ext.each(crewMembers, function (m) {
            Ext.each(employees, function (obj) {
                if (obj.getId() == m.getId()) {
                    empName = obj.get('empName');
                }
            });
            infoArray.push({name: empName, phone: m.get('crewMemberPhone'), email: m.get('crewMemberEmail')});
            html += '<div>' + empName + '  ' + m.get('crewMemberPhone') + '  ' + m.get('crewMemberEmail') + '</div>'
        });
        vm.set('crewPhoneList', infoArray);
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    doOpenFwa: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            fwaId = vm.get('fwa').id,
            fwaDate = vm.get('fwa').get('schedStartDate'),
            parentVm = vm.getParent(),
            store = parentVm.getStore('fwalist'),
            settings = TS.app.settings,
            fwa;

        view.setLoading(true);
        Fwa.Get(null, settings.username, Ext.Date.format(fwaDate, 'Ymd'), fwaDate, function (response) {
            var dataObject = response.data;

            //Associations aren't parsed when you call the model constructor, use new method instead (CCG specific)
            fwa = TS.model.fwa.Fwa.createWithAssociations(dataObject);

            parentVm.set('newFwa', true);
            store.add(fwa);
            parentVm.set('selectedFWA', fwa);

            view.setLoading(false);
            bt.up('sheet').hide();
            Ext.first('fwa-search').hide();
        }, me, {
            autoHandle: true
        });
    },

    doCopyFwa: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            fwaId = vm.get('selectedFWA').get('fwaId'),
            parentVm = vm.getParent(),
            store = parentVm.getStore('fwalist'),
            settings = TS.app.settings,
            fwa,
            loc;

        view.setLoading(true);

        Fwa.Copy(null, settings.username, fwaId, function (response) {
            var dataObject = response.data;

            dataObject.fwaId = ''; //remove fwaId before create new record to avoid conflicts
            //Associations aren't parsed when you call the model constructor, use new method instead (CCG specific)
            fwa = TS.model.fwa.Fwa.createWithAssociations(dataObject);
            //clear 0 values
            loc = fwa.getLoc();
            if (loc.get('latitude') == 0) loc.set('latitude', '');
            if (loc.get('longitude') == 0) loc.set('longitude', '');
            //clear date fields
            if (Ext.Date.format(new Date(fwa.get('dateOrdered')), DATE_FORMAT) == '01/01/0001') fwa.set('dateOrdered', '');
            if (Ext.Date.format(new Date(fwa.get('dateRequired')), DATE_FORMAT) == '01/01/0001') fwa.set('dateRequired', '');

            if (Ext.Date.format(new Date(fwa.get('udf_d1')), DATE_FORMAT) == '01/01/0001') fwa.set('udf_d1', '');
            if (Ext.Date.format(new Date(fwa.get('udf_d2')), DATE_FORMAT) == '01/01/0001') fwa.set('udf_d2', '');
            if (Ext.Date.format(new Date(fwa.get('udf_d3')), DATE_FORMAT) == '01/01/0001') fwa.set('udf_d3', '');


            fwa.set('schedStartDate', new Date());

            parentVm.set('newFwa', true);
            store.add(fwa);
            parentVm.set('selectedFWA', fwa);

            if (settings.fwaAutoNumbering) {
                Ext.first('fwa-edit').lookup('fwaNumField').setLabel(settings.fwaAbbrevLabel + ' # (auto-number)');
            }

            view.setLoading(false);
            bt.up('sheet').hide();
            Ext.first('fwa-search').hide();
        }, me, {
            autoHandle: true
        });
    },

    onClearSelections: function (bt) {
        Ext.first('#workCodeList').deselectAll();
    },

    onClearSearchDates: function (bt) {
        Ext.first('#startDateSearch').setValue();
        Ext.first('#endDateSearch').setValue();
    },

    viewAllClientSignatures: function () {
        var me = this,
            vm = me.getViewModel(),
            signaturelist = vm.getStore('signaturelist'),
            settings = TS.app.settings,
            fwa = vm.get('selectedFWA'),
            arr = [],
            placeholderRec,
            sheet,
            signatureWindow;

        if (!signaturelist) {
            signaturelist = Ext.create('Ext.data.Store', {
                model: 'TS.model.shared.Attachment',
                sorters: [
                    {
                        property: 'dateAttached',
                        direction: 'ASC'
                    }
                ]
            });
        }

        Ext.each(fwa.get('attachments'), function (signature) {
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
        sheet.lookup('signatureList').setStore(signaturelist);
        sheet.lookup('signatureListTitle').setTitle(settings.clientLabel + ' Signature List');
        //signatureWindow = Ext.first('#signatureList');
        signaturelist.sort('dateAttached', 'DESC');
        Ext.Viewport.add(sheet);
        sheet.show();
        // get last signature entered and scroll to it if sorted ASC
        // setTimeout(function () {
        //     signatureWindow.getScrollable().doScrollTo(0, 1000000);
        // }, 500);
    },

    viewAllChiefSignatures: function () {
        var me = this,
            vm = me.getViewModel(),
            signaturelist = vm.getStore('signaturelist'),
            settings = TS.app.settings,
            fwa = vm.get('selectedFWA'),
            arr = [],
            placeholderRec,
            sheet,
            signatureWindow;

        Ext.each(fwa.get('attachments'), function (signature) {
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
        //signatureWindow = Ext.first('#signatureList');
        signaturelist.sort('dateAttached', 'DESC');
        Ext.Viewport.add(sheet);
        sheet.show();
        // get last signature entered and scroll to it if sorted ASC
        // setTimeout(function () {
        //     signatureWindow.getScrollable().doScrollTo(0, 1000000);
        // }, 500);
    },

    onDeleteClientSignatureClick: function () {
        var me = this,
            vw = me.getView(),
            attachmentId = vw.lookup('clientApprovalImage').config.attachmentId,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'), //Look directly in the viewModel
            settings = TS.app.settings,
            attachmentsToDelete = selection.get('attachmentsToDelete') || [],
            clientApproval = selection.get('attachments').filter(function (data) {
                return data.attachmentType == AttachmentType.ClientSignature && data.owningModelType == 'Fwa';
            }),
            img,
            clientIdx;
        //find the image
        Ext.each(clientApproval, function (item) {
            if (item.attachmentId == attachmentId) {
                img = item;
                return false;
            }
        });
        //get the indexes
        clientIdx = clientApproval.indexOf(img);
        //confirm delete
        Ext.Msg.confirm('Signature Delete', 'Are you sure you want to delete this ' + settings.clientLabel + ' signature?', function (btn) {
            if (btn == 'yes') {
                //remove object
                attachmentsToDelete.push(attachmentId);
                clientApproval.splice(clientIdx, 1);
                Ext.Array.remove(selection.get('attachments'), img);
                //refresh screen
                if (clientApproval.length > 0) {
                    vw.lookup('clientApprovalImage').config.attachmentId = clientApproval[0].attachmentId;
                    selection.set('clientApprovalDate', clientApproval[0].dateAttached);
                    selection.set('clientApprovalImage', Ext.util.Base64.decode(clientApproval[0].attachmentItem));
                    selection.set('clientApprovalImageId', clientApproval[0].attachmentId);
                    Ext.first('#clientApprovalImage').setSrc(selection.get('clientApprovalImage'));
                    Ext.first('#clientApprovalImage').setHidden(false);
                } else {
                    vw.lookup('clientApprovalImage').config.attachmentId = '';
                    selection.set('clientApprovalDate', '');
                    selection.set('clientApprovalImage', '');
                    selection.set('clientApprovalImageId', '');
                    Ext.first('#clientApprovalImage').setSrc('');
                    Ext.first('#clientApprovalImage').setHidden(true);
                }
                Ext.first('#deleteClientSignatureButton').setHidden(clientApproval.length == 0);
                Ext.first('#viewAllClientSignatureButton').setHidden(clientApproval.length <= 1);
                Ext.first('#clientApprovalButton').setWidth(clientApproval.length <= 1 ? '100%' : '75%');

                if (!selection.get('attachmentsToDelete')) {
                    selection.set('attachmentsToDelete', attachmentsToDelete);
                } else {
                    selection.get('attachmentsToDelete').push(attachmentId);
                }
            }
        });

    },

    onDeleteChiefSignatureClick: function () {
        var me = this,
            vw = me.getView(),
            attachmentId = vw.lookup('chiefApprovalImage').config.attachmentId,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'), //Look directly in the viewModel
            settings = TS.app.settings,
            attachmentsToDelete = selection.get('attachmentsToDelete') || [],
            chiefApproval = selection.get('attachments').filter(function (data) {
                return data.attachmentType == AttachmentType.EmpSignature && data.owningModelType == 'Fwa';
            }),
            img,
            clientIdx;

        //find the image
        Ext.each(chiefApproval, function (item) {
            if (item.attachmentId == attachmentId) {
                img = item;
                return false;
            }
        });
        //get the indexes
        clientIdx = chiefApproval.indexOf(img);
        //confirm delete
        Ext.Msg.confirm('Signature Delete', 'Are you sure you want to delete this ' + settings.crewChiefLabel + ' signature?', function (btn) {
            if (btn == 'yes') {
                //remove object
                attachmentsToDelete.push(attachmentId);
                chiefApproval.splice(clientIdx, 1);
                Ext.Array.remove(selection.get('attachments'), img);
                //refresh screen
                if (chiefApproval.length > 0) {
                    vw.lookup('chiefApprovalImage').config.attachmentId = chiefApproval[0].attachmentId;
                    selection.set('chiefApprovalDate', chiefApproval[0].dateAttached);
                    selection.set('chiefApprovalImage', 'data:application/octet-stream;base64,' + chiefApproval[0].attachmentItem);
                    selection.set('chiefApprovalImageId', chiefApproval[0].attachmentId);
                    Ext.first('#chiefApprovalImage').setSrc(selection.get('chiefApprovalImage'));
                    Ext.first('#chiefApprovalImage').setHidden(false);
                } else {
                    vw.lookup('chiefApprovalImage').config.attachmentId = '';
                    selection.set('chiefApprovalDate', '');
                    selection.set('chiefApprovalImage', '');
                    selection.set('chiefApprovalImageId', '');
                    Ext.first('#chiefApprovalImage').setSrc('');
                    Ext.first('#chiefApprovalImage').setHidden(true);
                }
                Ext.first('#deleteChiefSignatureButton').setHidden(chiefApproval.length == 0);
                Ext.first('#viewAllChiefSignatureButton').setHidden(chiefApproval.length <= 1);
                Ext.first('#chiefApprovalButton').setWidth(chiefApproval.length <= 1 ? '100%' : '75%');

                if (!selection.get('attachmentsToDelete')) {
                    selection.set('attachmentsToDelete', attachmentsToDelete);
                } else {
                    selection.get('attachmentsToDelete').push(attachmentId);
                }
            }
        });
    },

    onMyCrewOnlyClick: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            dropDown = Ext.first('field-crewlist'),
            store;
        settings.crewListType = 'newFwaCrewList';
        dropDown.setStore(Ext.getStore('CrewsForNewFWA'));
        store = dropDown.getStore();
        store.filterBy(function (obj) {
            return obj.get('crewChiefEmpId') === settings.empId;
        });

        bt.setStyle('color:white;background-color:#939393;font-weight: bold;');
        Ext.first('#allCrewButton').setStyle('background-color: #f6f6f6;color: #606060;font-weight: normal;');
        Ext.first('#crewLabel').setValue('');
        vm.get('selectedFWA').set('scheduledCrewId', '');
    },

    onAllCrewsClick: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            dropDown = Ext.first('field-crewlist'),
            store,
            cMember = false;
        settings.crewListType = 'AllCrewList';
        dropDown.setStore(Ext.getStore('AllCrews'));
        store = dropDown.getStore();
        store.clearFilter();
        //need to check and see if a crew member
        store.filterBy(function (obj) {
            Ext.each(obj.get('crewMembers').getRange(), function (crew) {
                cMember = crew.get('crewMemberEmpId') === settings.empId;
                if (cMember)
                    return false;
            });
            if (cMember || obj.get('crewChiefEmpId') === settings.empId || obj.get('preparedByEmpId') === settings.empId) {
                return true;
            }
        });

        bt.setStyle('color:white;background-color:#939393;font-weight: bold;');
        Ext.first('#myCrewsButton').setStyle('background-color: #f6f6f6;color: #606060;font-weight: normal;');
        vm.get('selectedFWA').set('scheduledCrewId', '');
        Ext.first('#crewLabel').setValue('');
    },

    onUdfComboClick: function (obj) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            udf = obj.getItemId(),
            whichUdf = udf.split('_')[1],
            udfLabel = me.getUdfLabel(whichUdf),
            udfText = me.getUdfText(whichUdf),
            vm = me.getViewModel(),
            sheet = Ext.create({
                xtype: 'fwa-udtf-combo',
                //Fuse view models
                viewModel: {
                    parent: vm,
                    whichUdf: udf
                }
            }),
            fwa = vm.get('selectedFWA');
        //get copy in case user makes a change, then cancels or closes
        settings.origUdfValue = fwa.get(udf);
        vm.get('selectedFWA').set('udfText', udfText);
        if (whichUdf.substring(0, 1) == 'a')
            sheet.lookup('udfTitle').setTitle(udfLabel); //'Address ' +
        else
            sheet.lookup('udfTitle').setTitle(settings.wbs1Label + ' ' + udfLabel);

        if (Ext.os.is.Android && Ext.os.is.Phone) {
            Ext.first('#toolbarButtons').setDocked('top');
        }
        Ext.Viewport.add(sheet);
        sheet.show();
    },


    onAddressClick: function (obj) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            settings = TS.app.settings,
            address = obj.getItemId(),
            whichAddress = address.split('_')[1],
            addressLabel = me.getAddressLabel(whichAddress),
            addressText = me.getAddressText(whichAddress),
            sheet = Ext.create({
                xtype: 'address_text',
                //Fuse view models
                viewModel: {
                    parent: vm,
                    whichAddress: whichAddress
                }
            });
        //get copy in case user makes a change, then cancels or closes
        settings.origAddressValue = fwa.get(address);
        vm.get('selectedFWA').set('addressText', addressText);

        sheet.lookup('addressTitle').setTitle(addressLabel)
        if (Ext.os.is.Android && Ext.os.is.Phone) {
            Ext.first('#toolbarButtons').setDocked('top');
        }
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onAddressNumericClick: function (obj) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            settings = TS.app.settings,
            address = obj.getItemId(),
            whichAddress = address.split('_')[1],
            addressLabel = me.getAddressLabel(whichAddress),
            addressText = me.getAddressText(whichAddress),
            sheet = Ext.create({
                xtype: 'address_numeric',
                //Fuse view models
                viewModel: {
                    parent: vm,
                    whichAddress: whichAddress
                }
            });
        //get copy in case user makes a change, then cancels or closes
        settings.origAddressValue = fwa.get(address);
        vm.get('selectedFWA').set('addressText', addressText);

        sheet.lookup('addressTitle').setTitle(addressLabel)
        if (Ext.os.is.Android && Ext.os.is.Phone) {
            Ext.first('#toolbarButtons').setDocked('top');
        }
        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onUdfClick: function (obj) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            udf = obj.getItemId(),
            whichUdf = udf.split('_')[1],
            udfLabel = me.getUdfLabel(whichUdf),
            udfText = me.getUdfText(whichUdf),
            vm = me.getViewModel(),
            sheet = Ext.create({
                xtype: 'fwa-udtf',
                //Fuse view models
                viewModel: {
                    parent: vm,
                    whichUdf: udf
                }
            }),
            fwa = vm.get('selectedFWA');
        //get copy in case user makes a change, then cancels or closes
        settings.origUdfValue = fwa.get(udf);
        vm.get('selectedFWA').set('udfText', udfText);

        if (whichUdf.substring(0, 1) == 'a')
            sheet.lookup('udfTitle').setTitle('Address ' + udfLabel);
        else
            sheet.lookup('udfTitle').setTitle(settings.wbs1Label + ' ' + udfLabel);

        if (Ext.os.is.Android && Ext.os.is.Phone) {
            Ext.first('#toolbarButtons').setDocked('top');
        }

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    getAddressText: function (addressType) {
        var me = this,
            vm = me.getViewModel().get('selectedFWA.loc');
        switch (addressType) {
            case 'address1':
                return Ext.first('#address1Field').getValue() || ''; // vm.get('address1');
            case 'address2':
                return Ext.first('#address2Field').getValue() || ''; //return vm.get('address2');
            case 'city':
                return Ext.first('#cityField').getValue() || ''; //return vm.get('city');
            case 'state':
                return Ext.first('#stateField').getValue() || ''; //vm.get('state');
            case 'zip':
                return Ext.first('#zipField').getValue() || ''; //vm.get('zip');
            case 'latitude':
                return Ext.first('#latitudeField').getValue() || ''; //vm.get('latitude');
            case 'longitude':
                return Ext.first('#longitudeField').getValue() || ''; //vm.get('longitude');
        }
    },

    getUdfText: function (udfType) {
        var me = this,
            vm = me.getViewModel().get('selectedFWA');
        switch (udfType) {
            case 't1':
                return vm.get('udf_t1');
            case 't2':
                return vm.get('udf_t2');
            case 't3':
                return vm.get('udf_t3');
            case 't4':
                return vm.get('udf_t4');
            case 't5':
                return vm.get('udf_t5');
            case 't6':
                return vm.get('udf_t6');
            case 't7':
                return vm.get('udf_t7');
            case 't8':
                return vm.get('udf_t8');
            case 't9':
                return vm.get('udf_t9');
            case 't10':
                return vm.get('udf_t10');
            case 'a1':
                return vm.get('udf_a1');
            case 'a2':
                return vm.get('udf_a2');
            case 'a3':
                return vm.get('udf_a3');
            case 'a4':
                return vm.get('udf_a4');
            case 'a5':
                return vm.get('udf_a5');
            case 'a6':
                return vm.get('udf_a6');
        }
    },

    getAddressLabel: function (addressType) {
        switch (addressType) {
            case'address1':
                return 'Address 1';
            case'address2':
                return 'Address 2';
            case'city':
                return 'City';
            case'state':
                return 'State';
            case'zip':
                return 'Zip/Postal Code';
            case'longitude':
                return 'Longitude';
            case'latitude':
                return 'Latitude';
        }
    },

    getUdfLabel: function (udfType) {
        var settings = TS.app.settings;
        switch (udfType) {
            case 't1':
                return settings.udf_t1_Label;
            case 't2':
                return settings.udf_t2_Label;
            case 't3':
                return settings.udf_t3_Label;
            case 't4':
                return settings.udf_t4_Label;
            case 't5':
                return settings.udf_t5_Label;
            case 't6':
                return settings.udf_t6_Label;
            case 't7':
                return settings.udf_t7_Label;
            case 't8':
                return settings.udf_t8_Label;
            case 't9':
                return settings.udf_t9_Label;
            case 't10':
                return settings.udf_t10_Label;
            case 'a1':
                return settings.udf_a1_Label;
            case 'a2':
                return settings.udf_a2_Label;
            case 'a3':
                return settings.udf_a3_Label;
            case 'a4':
                return settings.udf_a4_Label;
            case 'a5':
                return settings.udf_a5_Label;
            case 'a6':
                return settings.udf_a6_Label;
        }

    },

    onAddressSave: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA.loc'),
            addressId = vm.whichAddress;
        Ext.first('#' + addressId + 'Field').setValue(Ext.first('#addressEditValue').getValue());
        btn.up('sheet').hide();
    },


    onUdfSave: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            udfId = vm.whichUdf;
        fwa.set(udfId, fwa.get('udfText'));
        btn.up('sheet').hide();
    },

    onUdfComboSave: function (btn) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            udfId = vm.whichUdf;

        vw.lookup(udfId).setValue(fwa.get('udfText'));

        fwa.set(udfId, fwa.get('udfText'));
        btn.up('sheet').hide();
    },

    closeAddressSheet: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA');
        fwa.set(vm.address, settings.origAddressValue);
        bt.up('sheet').hide();
    },

    closeUdfSheet: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA');
        fwa.set(vm.whichUdf, settings.origUdfValue);
        bt.up('sheet').hide();
    },

    convertUtcDates: function (recItem) {
        var info = recItem;

        if (info) {
            while (info.indexOf('^fromUTC(') > -1) {
                var start = info.indexOf('^fromUTC(') + 9,
                    end = info.indexOf(')^'),
                    oldDt = '',
                    dt = '',
                    newDt = '',
                    D = Ext.Date,
                    offset = new Date().getTimezoneOffset();
                oldDt = new Date(info.substring(start, end));
                dt = D.add(oldDt, D.MINUTE, offset * -1);
                newDt = Ext.Date.format(dt, DATE_FORMAT + ' g:i A');
                info = info.replace('^fromUTC(' + info.substring(start, end) + ')^', newDt);
            }
        } else {
            // info = info.replace(/\^fromUTC\(/g, '');
            // info = info.replace(/\)\^/g, '');
        }
        return info;
    },

    onSelectionCrewChange: function (component, records) {
        var me = this,
            settings = TS.app.settings,
            grid = Ext.first('#crewTaskGrid'),
            searchDt = !me.lookup('crewTaskDateHeader').getValue() ? new Date() : me.lookup('crewTaskDateHeader').getValue(),
            currentDate = Ext.Date.format(new Date(searchDt), DATE_FORMAT),
            crewId = records[0].get('crewId'),
            store = grid.getStore();
        settings.selectedCrewId = crewId;

        if (!store) {
            Fwa.GetDailyFwaList(null, settings.username, settings.empId, currentDate, function (response) {
                if (response && response.success) {

                    Ext.each(response.data, function (record) {
                        record.topLevelDescription = me.convertUtcDates(record.topLevelDescription);
                        record.detailsDescription = me.convertUtcDates(record.detailsDescription);
                    });

                    store = new Ext.data.Store({
                        model: 'TS.model.fwa.FwaDailyList',
                        data: response.data
                    });
                    var schedStartDts = [],
                        uniqueDates;
                    schedStartDts = me.loadUniqueDateStore();
                    uniqueDates = schedStartDts.filter(function (item, pos) {
                        return schedStartDts.indexOf(item) == pos;
                    });
                    settings.startDates = uniqueDates;
                    Ext.each(store.getRange(), function (fwa) {
                        //fwa.set('schedStartDate', TS.common.Util.getInUTCDate(fwa.get('schedStartDate')));
                        fwa.set('schedStartDate', TS.common.Util.getNewInUTCDate(fwa.get('schedStartDate')));
                    });
                    me.loadCrewTaskGrid(grid, store, crewId, currentDate);
                }
            }, me, {
                autoHandle: true
            });
        } else {
            me.loadCrewTaskGrid(grid, store, crewId, currentDate);
        }

    }
    ,

    onSelectionCrewChiefChange: function (component, records) {
        var me = this,
            settings = TS.app.settings,
            grid = Ext.first('#taskGrid'),
            searchDt = !me.lookup('taskDateHeader').getValue() ? new Date() : me.lookup('taskDateHeader').getValue(),
            currentDate = Ext.Date.format(new Date(searchDt), DATE_FORMAT),
            crewChiefId = records.get('crewChiefEmpId'),
            store = grid.getStore();
        settings.selectedCrewChiefId = crewChiefId;

        if (!store) {
            Fwa.GetDailyFwaList(null, settings.username, settings.empId, currentDate, function (response) {
                if (response && response.success) {

                    Ext.each(response.data, function (record) {
                        record.topLevelDescription = me.convertUtcDates(record.topLevelDescription);
                        record.detailsDescription = me.convertUtcDates(record.detailsDescription);
                    });

                    store = new Ext.data.Store({
                        model: 'TS.model.fwa.FwaDailyList',
                        data: response.data
                    });

                    Ext.each(store.getRange(), function (fwa) {
                        fwa.set('schedStartDate', TS.common.Util.getNewInUTCDate(fwa.get('schedStartDate')));
                        //fwa.set('schedStartDate', TS.common.Util.getInUTCDate(fwa.get('schedStartDate')));
                    });
                    var schedStartDts = [],
                        uniqueDates;
                    schedStartDts = me.loadUniqueDateStore();
                    uniqueDates = schedStartDts.filter(function (item, pos) {
                        return schedStartDts.indexOf(item) == pos;
                    });
                    settings.startDates = uniqueDates;
                    me.loadCrewChiefTaskGrid(grid, store, crewChiefId, currentDate);
                }
            }, me, {
                autoHandle: true
            });
        } else {
            me.loadCrewChiefTaskGrid(grid, store, crewChiefId, currentDate);
        }
    }
    ,

    loadUniqueDateStore: function () {
        var schedStartDts = [];
        //add 14 dates in past
        for (var i = 14; i > 0; i--) {
            var newDate = new Date();
            newDate.setDate(newDate.getDate() - i);
            schedStartDts.push(Ext.Date.format(newDate, DATE_FORMAT));
        }
        //add 30 dates in future
        for (var i = 0; i < 30; i++) {
            var newDate = new Date();
            newDate.setDate(newDate.getDate() + i);
            schedStartDts.push(Ext.Date.format(newDate, DATE_FORMAT));
        }
        return schedStartDts;
    }
    ,

    loadCrewTaskGrid: function (grid, store, selectedCrewId, currentDate) {
        var me = this,
            settings = TS.app.settings,
            maxDate = Ext.Array.max(settings.startDates),
            minDate = Ext.Array.min(settings.startDates),
            taskDateBar = me.getView().lookup('crewTaskDateBar'),
            crewGrid = Ext.first('#crewGrid'),
            //crewGridCt = crewGrid.length(),
            ct = 0,
            crewId;

        settings.selectedCrewId = selectedCrewId;
        store.clearFilter();

        Ext.each(crewGrid.getStore().getRange(), function (row) {
            crewId = row.get('crewId');
            if (store.findRecord('scheduledCrewId', crewId)) {
                crewGrid.listItems[ct].cells[1].setStyle('color: red; font-weight: bolder;');
                //crewGrid.getItemAt(ct).cells[1].setStyle('color: red; font-weight: bolder');
            } else {
                //crewGrid.getItemAt(ct).cells[1].setStyle('color: black; font-weight: normal;');
                crewGrid.listItems[ct].cells[1].setStyle('color: black; font-weight: normal;');
            }
            ct++;
        });

        store.filterBy(function (rec) {
            return rec.get('scheduledCrewId') === selectedCrewId &&
                Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT) === Ext.Date.format(new Date(currentDate), DATE_FORMAT);
        });
        grid.setStore(store);
        //grid.setTitle('Tasks for ' + currentDate);
        Ext.first('#crewTaskDateHeader').setValue(currentDate);

        Ext.first('#lastCrewTaskDate').setDisabled(!minDate || currentDate == minDate);
        Ext.first('#nextCrewTaskDate').setDisabled(!maxDate || currentDate == maxDate);

        grid.setHidden(false);
        taskDateBar.setHidden(false);

    }
    ,

    loadCrewChiefTaskGrid: function (grid, store, crewChiefId, currentDate) {
        var me = this,
            settings = TS.app.settings,
            maxDate = Ext.Array.max(settings.startDates),
            minDate = Ext.Array.min(settings.startDates),
            taskDateBar = me.getView().lookup('taskDateBar'),
            chiefGrid = Ext.first('#crewChiefGrid'),
            ct = 0,
            chiefId;

        settings.selectedCrewChiefId = crewChiefId;
        store.clearFilter();

        Ext.each(chiefGrid.getStore().getRange(), function (row) {
            chiefId = row.get('crewChiefEmpId');
            if (store.findRecord('scheduledCrewChiefId', chiefId)) {
                //chiefGrid.getItemAt(ct).cells[1].setStyle('color: red; font-weight: bolder');
                chiefGrid.listItems[ct].cells[1].setStyle('color: red; font-weight: bolder');
            } else {
                //chiefGrid.getItemAt(ct).cells[1].setStyle('color: black; font-weight: normal;');
                chiefGrid.listItems[ct].cells[1].setStyle('color: black; font-weight: normal;');
            }
            ct++;
        });

        store.filterBy(function (rec) {
            return rec.get('scheduledCrewChiefId') === crewChiefId &&
                Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT) === Ext.Date.format(new Date(currentDate), DATE_FORMAT);
        });
        grid.setStore(store);
        //grid.setTitle('Tasks for ' + currentDate);
        Ext.first('#taskDateHeader').setValue(currentDate);

        Ext.first('#lastTaskDate').setDisabled(!minDate || currentDate == minDate);
        Ext.first('#nextTaskDate').setDisabled(!maxDate || currentDate == maxDate);

        grid.setHidden(false);
        taskDateBar.setHidden(false);
    }
    ,

    lastUnitsDate: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            record = vm.get('selectedFWA'),
            hoursGrid = Ext.first('#unitCodeGrid'),
            store = hoursGrid.getStore(),
            model = store.model,
            lastDt = Ext.first('#manageUnits').lookup('unitsDateHeader').getValue(),
            datesInRange = record.get('unitDatesInRange').sort(function (a, b) {
                return new Date(b) - new Date(a);
            }),
            utcDate = '',
            nextDate,
            hasLastDate = false,
            currentIndex = 0,
            dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) < new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasLastDate = true;
                return false;
            }
        });
        //check if date found
        if (hasLastDate) {
            store.clearFilter();
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }

        Ext.first('#manageUnits').lookup('unitsDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#manageUnits').lookup('lastUnitsDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#manageUnits').lookup('nextUnitsDate').setDisabled(false);
    }
    ,

    nextUnitsDate: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            record = vm.get('selectedFWA'),
            unitsGrid = Ext.first('#unitCodeGrid'),
            store = unitsGrid.getStore(),
            model = store.model,
            lastDt = Ext.first('#manageUnits').lookup('unitsDateHeader').getValue(),
            datesInRange = record.get('unitDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            }),
            nextDate = '',
            utcDate = '',
            hasNextDate = false,
            currentIndex = 0,
            dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) > new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasNextDate = true;
                return false;
            }
        });
        //check if date found
        if (hasNextDate) {
            store.clearFilter();
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }
        Ext.first('#manageUnits').lookup('unitsDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#manageUnits').lookup('nextUnitsDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#manageUnits').lookup('lastUnitsDate').setDisabled(false);
    }
    ,

    onAddUnitsDate: function () {
        var me = this,
            vm = me.getViewModel(),
            sheet = Ext.create({
                xtype: 'fwa-addunitsdate',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            });
        Ext.Viewport.add(sheet);
        sheet.lookup('addUnitDatePicker').setValue(Ext.first('#manageUnits').lookup('unitsDateHeader').getValue());
        sheet.show();
    }
    ,

    saveAddUnitDate: function (bt) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            record = vm.get('selectedFWA'),
            unitsGrid = Ext.first('#unitCodeGrid'),
            store = unitsGrid.getStore(),
            model = store.model,
            hasNewDate = false,
            utcDate,
            currentIndex = 0,
            datesInRange = record.get('unitDatesInRange'),
            unitDate = Ext.Date.format(new Date(Ext.first('#addUnitDatePicker').getValue()), 'Y-m-d'),
            newDate = Ext.Date.format(new Date(Ext.first('#addUnitDatePicker').getValue()), DATE_FORMAT);
        //if none create empty array
        if (!datesInRange) {
            record.set('unitDatesInRange', []);
            datesInRange = record.get('unitDatesInRange');
        }
        //check if date selected exists
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            if (dt == unitDate + 'T00:00:00') {
                hasNewDate = true;
                return false;
            }
        });
        //if does not exists - add to dateRange
        if (!hasNewDate) {
            datesInRange.push(unitDate + 'T00:00:00');
            //increment index  so count is correct
            currentIndex++;
        }
        Ext.each(store.getRange(), function (rec) {
            store.filter('unitDate', new Date(newDate));
            if (store.getRange().length == 0) {
                store.add(new model({
                    unitCodeId: rec.get('unitCodeId'),
                    unitSeq: store.getRange() && store.getRange().length > 0 ? store.getRange().length + 1 : 1,
                    unitDate: new Date(newDate),
                    equipmentId: rec.get('equipmentId'),
                    equipmentName: rec.get('equipmentName')
                }));
            }
        });

        store.clearFilter();
        store.setRemoteFilter(false);
        store.filterBy(function (rec) {
            return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(newDate), DATE_FORMAT);
        });

        Ext.first('#manageUnits').lookup('unitsDateHeader').setValue(Ext.Date.format(new Date(newDate), DATE_FORMAT));
        //turn arrows on/off
        currentIndex = 0;
        if (datesInRange && datesInRange.length > 0) {
            if (datesInRange.length == 1) {
                Ext.first('#manageUnits').lookup('lastUnitsDate').setDisabled(true);
                Ext.first('#manageUnits').lookup('nextUnitsDate').setDisabled(true);
            } else {
                datesInRange = datesInRange.sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                    var matches = (utcDate == Ext.Date.format(new Date(vw.lookup('addUnitDatePicker').getValue()), DATE_FORMAT));
                    if (matches && currentIndex == 1) {
                        Ext.first('#manageUnits').lookup('lastUnitsDate').setDisabled(true);
                        Ext.first('#manageUnits').lookup('nextUnitsDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == datesInRange.length) {
                        Ext.first('#manageUnits').lookup('lastUnitsDate').setDisabled(false);
                        Ext.first('#manageUnits').lookup('nextUnitsDate').setDisabled(true);
                        return false;
                    }
                });
            }
        } else {
            Ext.first('#manageUnits').lookup('lastUnitsDate').setDisabled(true);
            Ext.first('#manageUnits').lookup('nextUnitsDate').setDisabled(true);
        }
        bt.up('sheet').hide();
    }
    ,

    lastTaskDate: function () {
        var me = this,
            settings = TS.app.settings,
            taskGrid = Ext.first('#taskGrid'),
            store = taskGrid.getStore(),
            lastDt = Ext.first('#taskDateHeader').getValue(),
            datesInRange = settings.startDates.sort(function (a, b) {
                return new Date(b) - new Date(a);
            }),
            utcDate = '',
            nextDate,
            grid,
            crewChiefId,
            hasLastDate = false,
            currentIndex = 0,
            dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) < new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasLastDate = true;
                return false;
            }
        });
        //check if date found
        if (hasLastDate) {
            grid = Ext.first('#taskGrid');
            crewChiefId = settings.selectedCrewChiefId;
            store = grid.getStore();

            Fwa.GetDailyFwaList(null, settings.username, settings.empId, nextDate, function (response) {
                if (response && response.success) {

                    Ext.each(response.data, function (record) {
                        record.topLevelDescription = me.convertUtcDates(record.topLevelDescription);
                        record.detailsDescription = me.convertUtcDates(record.detailsDescription);
                    });

                    store = new Ext.data.Store({
                        model: 'TS.model.fwa.FwaDailyList',
                        data: response.data
                    });
                    Ext.each(store.getRange(), function (fwa) {
                        fwa.set('schedStartDate', TS.common.Util.getNewInUTCDate(fwa.get('schedStartDate')));
                        //fwa.set('schedStartDate', TS.common.Util.getInUTCDate(fwa.get('schedStartDate')));
                    });
                    me.loadCrewChiefTaskGrid(grid, store, crewChiefId, nextDate);
                }
            }, me, {
                autoHandle: true
            });
        }
        Ext.first('#taskDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#lastTaskDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#nextTaskDate').setDisabled(false);
        taskGrid.deselectAll();
    }
    ,

    lastCrewTaskDate: function () {
        var me = this,
            settings = TS.app.settings,
            taskGrid = Ext.first('#crewTaskGrid'),
            store = taskGrid.getStore(),
            lastDt = Ext.first('#crewTaskDateHeader').getValue(),
            datesInRange = settings.startDates.sort(function (a, b) {
                return new Date(b) - new Date(a);
            }),
            utcDate = '',
            nextDate,
            grid,
            crewId,
            hasLastDate = false,
            currentIndex = 0,
            dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) < new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasLastDate = true;
                return false;
            }
        });
        //check if date found
        if (hasLastDate) {
            grid = Ext.first('#crewTaskGrid');
            crewId = settings.selectedCrewId;
            store = grid.getStore();

            Fwa.GetDailyFwaList(null, settings.username, settings.empId, nextDate, function (response) {
                if (response && response.success) {

                    Ext.each(response.data, function (record) {
                        record.topLevelDescription = me.convertUtcDates(record.topLevelDescription);
                        record.detailsDescription = me.convertUtcDates(record.detailsDescription);
                    });

                    store = new Ext.data.Store({
                        model: 'TS.model.fwa.FwaDailyList',
                        data: response.data
                    });
                    Ext.each(store.getRange(), function (fwa) {
                        //fwa.set('schedStartDate', TS.common.Util.getInUTCDate(fwa.get('schedStartDate')));
                        fwa.set('schedStartDate', TS.common.Util.getNewInUTCDate(fwa.get('schedStartDate')));
                    });
                    me.loadCrewTaskGrid(grid, store, crewId, nextDate);
                }
            }, me, {
                autoHandle: true
            });
        }

        Ext.first('#crewTaskDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#lastCrewTaskDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#nextCrewTaskDate').setDisabled(false);
        taskGrid.deselectAll();
    }
    ,

    nextTaskDate: function () {
        var me = this,
            settings = TS.app.settings,
            taskGrid = Ext.first('#taskGrid'),
            store = taskGrid.getStore(),
            lastDt = Ext.first('#taskDateHeader').getValue(),
            datesInRange = settings.startDates.sort(function (a, b) {
                return new Date(a) - new Date(b);
            }),
            utcDate = '',
            nextDate,
            grid,
            store,
            crewChiefId,
            hasNextDate = false,
            currentIndex = 0,
            dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) > new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasNextDate = true;
                return false;
            }
        });
        //check if date found
        if (hasNextDate) {
            grid = Ext.first('#taskGrid');
            crewChiefId = settings.selectedCrewChiefId;
            store = grid.getStore();

            Fwa.GetDailyFwaList(null, settings.username, settings.empId, nextDate, function (response) {
                if (response && response.success) {

                    Ext.each(response.data, function (record) {
                        record.topLevelDescription = me.convertUtcDates(record.topLevelDescription);
                        record.detailsDescription = me.convertUtcDates(record.detailsDescription);
                    });

                    store = new Ext.data.Store({
                        model: 'TS.model.fwa.FwaDailyList',
                        data: response.data
                    });
                    Ext.each(store.getRange(), function (fwa) {
                        fwa.set('schedStartDate', TS.common.Util.getNewInUTCDate(fwa.get('schedStartDate')));
                        // fwa.set('schedStartDate', TS.common.Util.getInUTCDate(fwa.get('schedStartDate')));
                    });
                    me.loadCrewChiefTaskGrid(grid, store, crewChiefId, nextDate);
                }
            }, me, {
                autoHandle: true
            });
        }

        Ext.first('#taskDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#nextTaskDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#lastTaskDate').setDisabled(false);
        taskGrid.deselectAll();
    }
    ,

    nextCrewTaskDate: function () {
        var me = this,
            settings = TS.app.settings,
            taskGrid = Ext.first('#crewTaskGrid'),
            store = taskGrid.getStore(),
            lastDt = Ext.first('#crewTaskDateHeader').getValue(),
            datesInRange = settings.startDates.sort(function (a, b) {
                return new Date(a) - new Date(b);
            }),
            utcDate = '',
            grid,
            crewId,
            nextDate,
            hasNextDate = false,
            currentIndex = 0,
            dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) > new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasNextDate = true;
                return false;
            }
        });
        //check if date found
        if (hasNextDate) {
            grid = Ext.first('#crewTaskGrid');
            crewId = settings.selectedCrewId;
            store = grid.getStore();

            Fwa.GetDailyFwaList(null, settings.username, settings.empId, nextDate, function (response) {
                if (response && response.success) {

                    Ext.each(response.data, function (record) {
                        record.topLevelDescription = me.convertUtcDates(record.topLevelDescription);
                        record.detailsDescription = me.convertUtcDates(record.detailsDescription);
                    });

                    store = new Ext.data.Store({
                        model: 'TS.model.fwa.FwaDailyList',
                        data: response.data
                    });
                    Ext.each(store.getRange(), function (fwa) {
                        fwa.set('schedStartDate', TS.common.Util.getNewInUTCDate(fwa.get('schedStartDate')));
                        //fwa.set('schedStartDate', TS.common.Util.getInUTCDate(fwa.get('schedStartDate')));
                    });
                    me.loadCrewTaskGrid(grid, store, crewId, nextDate);
                }
            }, me, {
                autoHandle: true
            });
        }

        Ext.first('#crewTaskDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#nextCrewTaskDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#lastCrewTaskDate').setDisabled(false);
        taskGrid.deselectAll();
    }
    ,

    onSelectionFWAChange: function (component, index, target, record, e, eOpts) { //this, index, target, record, e, eOpts
        var settings = TS.app.settings,
            data = record.data,
            details = data.detailsDescription,
            sheet = Ext.create({
                xtype: 'my-messagebox',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                }
            });
        sheet.lookup('myInfo').setValue(details);
        Ext.Viewport.add(sheet);
        sheet.show();
    }
    ,

    closeCrewChiefs: function () {

    }
    ,

    onSelectionTemplateChange: function (component, records) { //component, index, target, record, e, eOpts
        var me = this,
            vw = me.getView(),
            uploadBtn = vw.lookup('loadTemplateDoc'),
            grid = vw.lookup('templateGrid');

        uploadBtn.setDisabled(grid.getSelectionCount() == 0);
    }
    ,

    lastTabletCrewTaskDate: function () {
        var me = this,
            settings = TS.app.settings,
            taskGrid = Ext.first('#tableCrewTaskGrid'),
            store = taskGrid.getStore(),
            lastDt = Ext.first('#tabletCrewTaskDateHeader').getValue(),
            datesInRange,
            schedStartDts = [],
            utcDate = '',
            nextDate,
            hasLastDate = false,
            currentIndex = 0,
            uniqueDates = [],
            dateArrayLength;

        store.clearFilter();
        Ext.each(store.getRange(), function (task) {
            schedStartDts.push(Ext.Date.format(new Date(task.get('schedStartDate')), DATE_FORMAT));
        });
        uniqueDates = schedStartDts.filter(function (item, pos) {
            return schedStartDts.indexOf(item) == pos;
        });
        settings.startDates = uniqueDates;
        datesInRange = settings.startDates.sort(function (a, b) {
            return new Date(b) - new Date(a);
        });

        dateArrayLength = datesInRange.length;
        //go backwards
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) < new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasLastDate = true;
                return false;
            }
        });
        //check if date found
        if (hasLastDate) {
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                var recDate = Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT);
                return recDate === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }

        Ext.first('#tabletCrewTaskDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#lastTabletCrewTaskDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#nextTabletCrewTaskDate').setDisabled(false);
        taskGrid.deselectAll();
    }
    ,

    nextTabletCrewTaskDate: function () {
        var me = this,
            settings = TS.app.settings,
            taskGrid = Ext.first('#tableCrewTaskGrid'),
            store = taskGrid.getStore(),
            lastDt = Ext.first('#tabletCrewTaskDateHeader').getValue(),
            datesInRange,
            schedStartDts = [],
            utcDate = '',
            nextDate,
            hasLastDate = false,
            currentIndex = 0,
            uniqueDates = [],
            dateArrayLength;

        store.clearFilter();
        Ext.each(store.getRange(), function (task) {
            schedStartDts.push(Ext.Date.format(new Date(task.get('schedStartDate')), DATE_FORMAT));
        });
        uniqueDates = schedStartDts.filter(function (item, pos) {
            return schedStartDts.indexOf(item) == pos;
        });
        settings.startDates = uniqueDates;
        datesInRange = settings.startDates.sort(function (a, b) {
            return new Date(a) - new Date(b);
        });

        dateArrayLength = datesInRange.length;
        //go forward
        Ext.each(datesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), DATE_FORMAT)) > new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), DATE_FORMAT);
                hasLastDate = true;
                return false;
            }
        });
        //check if date found
        if (hasLastDate) {
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                var recDate = Ext.Date.format(new Date(rec.get('schedStartDate')), DATE_FORMAT);
                return recDate === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }

        Ext.first('#tabletCrewTaskDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        //turn arrows on/off
        Ext.first('#nextTabletCrewTaskDate').setDisabled(currentIndex == dateArrayLength);
        Ext.first('#lastTabletCrewTaskDate').setDisabled(false);
        taskGrid.deselectAll();
    }
    ,

    onManageExpensesTap: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'fwa-manageexpenses',
                //Fuse view models
                viewModel: {
                    parent: vm
                }
            }),
            expensesGrid = sheet.lookup('expensesGrid'),
            expGridPlugin = expensesGrid.getPlugins()[0],
            toolbar = expGridPlugin.getToolbarConfig(),
            submitBt = toolbar.items[1],
            store = vm.get('selectedFWA.expenses');

        expGridPlugin.hideExpBillable(!settings.exDisplayBillable);
        expGridPlugin.hideExpFields(settings);

        if (store) {
            store.setRemoteFilter(false);
            store.clearFilter();
            // store.filterBy(function (rec) {
            //     rec.dirty = false;
            //     return rec.get('modified') !== 'D';
            // });
        }

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    addExpense: function (bt) {
        var grid = bt.up('sheet').down('grid'),
            settings = TS.app.settings,
            vm = this.getViewModel(),
            selection = vm.get('selectedFWA'),
            plugin = grid.findPlugin('grideditable'),
            rec = Ext.create('TS.model.exp.Expense', {
                eKGroup: settings.empEkGroup,
                mileageRate: settings.exMileageRate,
                reportDate: new Date(),
                expDate: new Date(),
                expId: Ext.data.identifier.Uuid.Global.generate().replace(/-/g, ''),
                modified: 'A',
                empId: settings.empId,
                fwaId: selection.get('fwaId'),
                fwaNum: selection.get('fwaNum'),
                fwaName: selection.get('fwaName'),
                wbs1: selection.get('wbs1'),
                wbs2: selection.get('wbs2'),
                wbs3: selection.get('wbs3')
            });
        //bt.setDisabled(true);
        selection.expenses().add(rec);
        plugin.startEdit(rec);
        vm.set('fromSaveSubmit', true);
    },

    onLaborCodeLookup: function () {
        var me = this,
            vm = me.getViewModel(),
            laborCode = Ext.first('#laborCodeField').getValue(),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'emp-laborcodelookup',
                viewModel: {
                    parent: vm
                },
                app: 'FWA'
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

        Ext.Viewport.add(sheet);
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
                    grid1.select(store1.findRecord('lcCode', lValue1), true);
                    grid1.scrollToRecord(store1.findRecord('lcCode', lValue1), true);
                    break;
                case 2:
                    start = settings.tsLc2Start - 1;
                    end = settings.tsLc2Len;
                    lValue2 = Ext.util.Format.substr(laborCode, start, end);
                    grid2 = gridContainer.items.items[level];
                    store2 = grid2.getStore();
                    grid2.select(store2.findRecord('lcCode', lValue2), true);
                    grid2.scrollToRecord(store2.findRecord('lcCode', lValue2), true);
                    break;
                case 3:
                    start = settings.tsLc3Start - 1;
                    end = settings.tsLc3Len;
                    lValue3 = Ext.util.Format.substr(laborCode, start, end);
                    grid3 = gridContainer.items.items[level];
                    store3 = grid3.getStore();
                    grid3.select(store3.findRecord('lcCode', lValue3), true);
                    grid3.scrollToRecord(store3.findRecord('lcCode', lValue3), true);
                    break;
                case 4:
                    start = settings.tsLc4Start - 1;
                    end = settings.tsLc4Len;
                    lValue4 = Ext.util.Format.substr(laborCode, start, end);
                    grid4 = gridContainer.items.items[level];
                    store4 = grid4.getStore();
                    grid4.select(store4.findRecord('lcCode', lValue4), true);
                    grid4.scrollToRecord(store4.findRecord('lcCode', lValue4), true);
                    break;
                case 5:
                    start = settings.tsLc5Start - 1;
                    end = settings.tsLc5Len;
                    lValue5 = Ext.util.Format.substr(laborCode, start, end);
                    grid5 = gridContainer.items.items[level];
                    store5 = grid5.getStore();
                    grid5.select(store5.findRecord('lcCode', lValue5), true);
                    grid5.scrollToRecord(store5.findRecord('lcCode', lValue5), true);
                    break;
            }
        }

    },

    addLaborCodeGrid: function (laborLevel, sheet) {
        var laborGrid = Ext.create({xtype: 'grid-tslaborcode'}),
            lcStore = Ext.getStore('LaborCodes');

        lcStore.clearFilter();
        lcStore.addFilter({
            filterFn: function (record) {
                return record.get('lcLevel') === laborLevel;
            }
        });
        //CREATE NEW INSTANCE
        laborGrid.setStore(Ext.create('Ext.data.Store', {
            model: 'TS.model.shared.LaborCode',
            remoteFilter: false
        }));

        //add each record
        Ext.each(lcStore.getRange(), function (rec) {
            laborGrid.getStore().add(rec);
        });

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

    onSelectLaborCode: function (bt, record, index, eOpts) {
        var viewModel = this.getViewModel(),
            settings = TS.app.settings,
            // Labor Code Level of this record
            laborCode = Ext.first('#laborCodeField'),
            // If no laborCodes/laborLabels set, init a new array
            laborCodes = (viewModel.get('laborCodes') || []),
            lc = '';

        Ext.each(laborCodes, function (code) {
            if (code)
                lc += code;
        });
        laborCode.setValue(lc);
        bt.up('sheet').hide();
    },

    onSubmitRecurring: function (vw) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            sheet = Ext.create({
                xtype: 'fwa-submit-recurring',
                //Fuse view models
                fwa: fwa,
                vw: vw,
                viewModel: {
                    parent: vm
                },
                listeners: {
                    save: 'onSave',
                    submit: 'onSubmit'
                }
            });

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    closeSubmitRecurringSheet: function (btn) {
        var me = this;
        //me.getView().setLoading(false);
        btn.up('sheet').hide();
    },

    continueSubmitRecurringFwa: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            fwa = vw.fwa,
            settings = TS.app.settings,
            selectedDate = vw.lookup('selectedDate').getValue(),
            submitAll = vw.lookup('submitEntireFwaCbx').getChecked;

        if (submitAll) {
            fwa.nextDate = TS.common.Util.getInUTCDate(new Date(2040, 11, 31, 0, 0, 0));
        } else {
            fwa.nextDate = TS.common.Util.getInUTCDate(new Date(selectedDate));
        }

        //me.handleFwaSubmission(settings.username, settings.empId, fwa.data);
        me.onSubmitFwaStart(fwa.nextDate);
        btn.up('sheet').hide();
    },

    itemChange: function (cmp, newValue, oldValue) {
        var vm = this.getViewModel(),
            settings = TS.app.settings;

        if (!settings.isLoading) {
            if (newValue != oldValue && vm) { //checkFwaFor
                if (vm.get('selectedFWA'))
                    vm.get('selectedFWA').dirty = true;
            }
        }

        if (cmp.getRequired() && !cmp.getValue()) {
            cmp.setRequiredCls('required-background');
        } else {
            cmp.setRequiredCls('');
        }
    },

    onBeforeCrewChange: function (crew, value, oldValue, eOpts) {

    },

    onAction: function (obj, e, opts) {

    },

    onCrewChange: function (crew, newValue, oldValue, eOpts) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            //fwa = vm.get('selectedFWA'),
            // workCodes = fwa.workSchedAndPerf().data,
            // hours = fwa.hours().data,
            ttlHrs = 0;
        if (!vm) return;
        if (!vm.get('newFwa') || !newValue || !oldValue) return;
        // else
        if (vm.get('newFwa') && newValue) {
            me.resetEmployeeHours(newValue.get('crewId'));
        }
    },

    resetEmployeeHours: function (crewId) {
        var me = this,
            settings = TS.app.settings,
            empGroupId = settings.empGroupId,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            workCodes = selection.workSchedAndPerf().data,
            hours = selection.hours().data,
            recordsToRemove = [],
            crew,
            crewMembers,
            workDate,
            emp;

        if (workCodes.length > 0 && crewId) {
            Ext.each(hours.getRange(), function (empHrs) {
                recordsToRemove.push(empHrs);
            });
            hours.remove(recordsToRemove);
            crew = Ext.getStore('AllCrews').findRecord('crewId', crewId);
            crewMembers = crew.get('crewMembers');
            workDate = new Date(Ext.Date.format(new Date(), DATE_FORMAT));
            Ext.each(crewMembers.getRange(), function (cm) {
                emp = Ext.getStore('AllEmployees').findRecord('empId', cm.get('empId'));
                Ext.each(workCodes.getRange(), function (wc) {
                    hours.add(Ext.create('TS.model.fwa.FwaHours', {
                        workDate: workDate,
                        empId: cm.get('empId'),
                        empGroupId: empGroupId,
                        modified: 'A',
                        workCodeId: wc.get('workCodeId'),
                        workCodeAbbrev: wc.get('workCodeAbbrev'),
                        //laborCode: emp.get('tsDefLaborCode'),
                        crewRoleId: cm.get('crewMemberRoleId')
                    }));
                });
            });
        }
    },

    onWorkCodeRemoved: function (rec) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            workCodes = selection.workSchedAndPerf().data,
            hours = selection.hours().data,
            recordsToRemove = [],
            ttlHrs = 0;

        if (this.getViewModel().getParent().get('newFwa')) {
            workCodes.remove(rec);
            Ext.each(hours.getRange(), function (empHrs) {
                //TODO need to check hours yet
                if (empHrs.get('workCodeId') == rec.get('workCodeId')) {
                    recordsToRemove.push(empHrs);
                }
            });
            hours.remove(recordsToRemove);
        }
    },

    onWorkCodeAdded: function (rec) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedFWA'),
            hours = selection.hours().data;

        if (this.getViewModel().getParent().get('newFwa')) {

            var crew = Ext.getStore('AllCrews').findRecord('crewId', selection.get('scheduledCrewId')),
                crewMembers = crew.get('crewMembers');

            Ext.each(crewMembers.getRange(), function (cm) {
                var emp = Ext.getStore('AllEmployees').findRecord('empId', cm.get('empId'));
                hours.add(Ext.create('TS.model.fwa.FwaHours', {
                    workDate: new Date(Ext.Date.format(new Date(), DATE_FORMAT)),
                    empId: cm.get('empId'),
                    empGroupId: '',
                    modified: 'A',
                    workCodeId: rec.workCodeId,
                    workCodeAbbrev: rec.workCodeAbbrev,
                    //laborCode: emp.get('tsDefLaborCode'),
                    crewRoleId: cm.get('crewMemberRoleId')
                }));
            });
        }
    },

    onNewFwaCrewSelectClick: function () {
        var me = this,
            store,
            settings = TS.app.settings,
            sheet,
            grid;

        sheet = Ext.create({
            xtype: 'newfwacrewlist',
            viewModel: {
                parent: me.getViewModel()
            }
        });
        grid = Ext.first('#newFwaCrewGrid');
        if (settings.crewListType === 'AllCrewList') {
            grid.setTitle = 'New ' + settings.fwaAbbrevLabel + ' ' + settings.crewLabel + ' List';
            grid.setStore(Ext.getStore('AllCrews'));
        } else {
            grid.setTitle = settings.crewLabel + ' List'
            grid.setStore(Ext.getStore('CrewsForNewFWA'));
        }
        grid.setHideHeaders(true);

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    onNewFwaCrewChange: function (obj, record) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            selection = vm.get('selectedFWA'),
            hours = selection.hours().data,
            currentCrew = Ext.first('#crewLabel').getValue(),
            ttlHrs = 0;
        //check for hour entries
        Ext.each(hours.getRange(), function (empHrs) {
            ttlHrs += empHrs.get('regHrs') + empHrs.get('ovtHrs') + empHrs.get('ovt2Hrs') + empHrs.get('travelHrs');
        });

        if (ttlHrs > 0 && currentCrew) {
            Ext.Msg.confirm("Please Confirm", "<div align=\"center\">Employee Hours have been entered and will be deleted if the " + settings.crewLabel + " is changed. Do you wish to continue?</div>", function (btn) {
                if (btn === 'yes') {
                    Ext.first('#crewLabel').setValue(record[0].get('crewName'));
                    Ext.first('newfwacrewlist').hide();
                } else {
                    Ext.first('newfwacrewlist').hide();
                }
            });
        } else {
            Ext.first('#crewLabel').setValue(record[0].get('crewName'));
            Ext.first('newfwacrewlist').hide();
        }
    }

});