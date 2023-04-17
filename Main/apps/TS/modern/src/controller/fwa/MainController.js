Ext.define('TS.controller.fwa.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.fwa-main',

    requires: [
        'Ext.util.Base64',
        'TS.model.fwa.CrewChief',
        'TS.model.shared.Attachment',
        'TS.model.shared.IdList',
        'TS.service.SynchronousCachedDirect',
        'TS.view.fwa.Photo',
        'TS.view.fwa.FWAEdit'
    ],

    mixins: {offline: "TS.controller.fwa.MainOfflineController"},
    constructor: function () {
        this.callParent(arguments);
        this.mixins.offline.constructor(this);
    },


    // These controls respond only to controls defined in the view that is bound to this controller
    control: {
        'button[action=camera]': {
            change: 'newFileLoaded',
            data: 'fileDataReceived'
        },

        //receive tap events from both edit an main menu buttons here
        'button[action=create-fwa]': {
            tap: 'onCreateFwa'
        },

        'button[action=close]': {
            tap: 'onCloseSheet'
        }
    },

    onSubmit: function (view, data) {
        this._onSaveSubmit(false, view, data);
        //view.destroy();
    },

    onSave: function (view, data) {
        this._onSaveSubmit(true, view, data);
        //view.destroy();
    },
    _onSaveSubmit: function (save, view, data) {
        // Save and submit call either saveFwa or submitFwa,
        // and have the same cleanup.
        var cleanup = (response) => {
            const vm = this.getViewModel();
            if (response && response.success) {
                view.destroy();
                vm.set('selectedFWA', '');
                if (!IS_OFFLINE) {
                    vm.getStore('fwalist').reload();
                }
            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        };

        if (save) {
            this.saveFwa(data).then(cleanup);
        } else {
            this.submitFwa(data).then(cleanup);
            // TODO set status so filter will hide submitted FWAs
            var store = this.getViewModel().get('fwalist');
            //check value on submit, if error grab message in cleanup
            if (store.findRecord('fwaId', data.fwaId))
                store.findRecord('fwaId', data.fwaId).set('fwaStatusId', FwaStatus.Submitted);
        }
    },

    initViewModel: function (vm) {
        const fwaList = vm.get('fwalist');
        // As the view model is created, the FWA list store has been created,
        // but it's empty. If the user is working offline, then load it from the
        // locally saved copy. Else, make the backend call as usual.
        if (IS_OFFLINE) {
            this._getFwaListData()
                .then(data => fwaList.loadRawData(data));
        } else {
            fwaList.getProxy().setExtraParams({
                isPreparer: TS.app.settings.schedFwaPreparedByMe,
                isScheduler: false,
                startDate: new Date().toDateString()
            });
            fwaList.load();
        }
    },

    init: function () {

        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            settings = TS.app.settings;

        vm.set('hasRights', settings.fwaCreateNew);
        //show/hide based on device
        if (Ext.first('fwa-list'))
            Ext.first('fwa-list').setHidden(IS_TABLET);
        //Ext.first('#description').setHidden(IS_TABLET);
        //show/hide offline for testing and final product
        vw.lookup('offLineButton').setHidden(!IS_CORDOVA_APP || !settings.supportOffline);
        //Ext.first('#fwaListToolbar')setHidden(IS_TABLET);
        vw.lookup('mainSelectBtn').setHidden(IS_TABLET);
        if (Ext.first('fwa-tabletlist')) {
            Ext.first('fwa-tabletlist').setHidden(!IS_TABLET);
            Ext.first('#wbs1Column').setHidden(!(settings.fwaDisplayWbs1 == 'B' || settings.fwaDisplayWbs1 == 'U'));
            Ext.first('#wbs1NameColumn').setHidden(!(settings.fwaDisplayWbs1 == 'B' || settings.fwaDisplayWbs1 == 'A'));
            Ext.first('#crewNameColumn').setHidden(settings.fwaDisplayCrew == 'N');
            Ext.first('#clientNameColumn').setHidden(settings.fwaDisplayClient == 'N');
        }

    },

    onCloseSheet: function (bt) {
        bt.up('sheet').hide();
    },

    onBackToFSS: function () {
        //reload user config in case scheduler has changed any settings for FWAs
        //this.reloadUserConfig();
        //Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS', this);
        Ext.Viewport.setActiveItem('app-fss');
    },

    reloadUserConfig: function () {
        var me = this,
            settings = TS.app.settings;
        UserConfig.GetByUsername(window.userGlobal.dbi, settings.username, 'FWA', function (response, operation, success) {
            if (response && response.success) {
                //reload settings
                Ext.GlobalEvents.fireEvent('Settings:Loaded', response.data, true);
            }
        }, me, {
            autoHandle: true
        });
    },

    checkForCrewChief: function (record, empId) {
        var isChief = false;
        if (!record) return false;
        if (record.get('scheduledCrewChiefId') == empId) {
            isChief = true;
        }

        Ext.each(record.hours().getRange(), function (item) {

            if (item.get('empId') == empId && item.get('isChief')) {
                isChief = true;
            }
        });

        return isChief;
    },

    onSelectionChange: function (t, records, eOpts) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            isCrewChief = me.checkForCrewChief(record, settings.empId),
            text = isCrewChief ? 'Edit Selected' : 'View Selected';
        vw.lookup('mainSelectBtn').setText(text);
        vw.lookup('mainSelectBtn').setDisabled(true);
    },

    onSelectionDoubleTap: function (t, index, target, record) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            isCrewChief = me.checkForCrewChief(record, settings.empId),
            text = isCrewChief ? 'Edit Selected' : 'View Selected';
        vw.lookup('mainSelectBtn').setText(text);
        vw.lookup('mainSelectBtn').setDisabled(false);
    },

    showTodayOnly: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            today = new Date(),
            store = vm.get('fwalist');

        if (btn.getText() == 'Show All') {
            store.clearFilter();
            btn.setText('Today Only');

        } else {
            btn.setText('Show All');
            store.filterBy(function (obj) {
                return Ext.Date.format(obj.get('nextDate'), DATE_FORMAT) == Ext.Date.format(today, DATE_FORMAT);
            });
        }
    },

    onLoadFwaEdit: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            fwaForm = !IS_OFFLINE ? me.getView().add({
                xtype: 'fwa-edit',
                title: 'Edit card',
                listeners: {
                    save: 'onSave',
                    submit: 'onSubmit'
                }
            }) : me.getView().add({
                xtype: 'fwa-edit-offline',
                title: 'Edit card',
                listeners: {
                    save: 'onSave',
                    submit: 'onSubmit'
                }
            }),
            vw = me.getView(),
            fwa;

        if (IS_TABLET) {
            fwa = TS.model.fwa.Fwa.createWithAssociations(Ext.first('fwa-tabletlist').getSelection());
            //add any attachments
            Ext.each(Ext.first('fwa-tabletlist').getSelection().data.attachments, function (attachment) {
            })
        } else {
            fwa = TS.model.fwa.Fwa.createWithAssociations(Ext.first('fwa-list').getSelection());
            //add any attachments
            Ext.each(Ext.first('fwa-list').getSelection().data.attachments, function (attachment) {
            })
        }

        fwa.attachments = fwa.data.attachments;

        fwa.set('nextDate', fwa.get('schedStartDate'));

        //console.log(fwa.get('recurrenceDatesInRange'));
        if (fwa.get('recurrencePattern')) {
            var len = fwa.get('recurrenceDatesInRange').length,
                startHour = fwa.get('schedStartDate').getHours(),
                endHour = fwa.get('schedEndDate').getHours(),
                startMinutes = fwa.get('schedStartDate').getMinutes(),
                endMinutes = fwa.get('schedEndDate').getMinutes(),
                recurrStart = fwa.get('recurrenceDatesInRange')[0],
                recurrEnd = fwa.get('recurrenceDatesInRange')[len - 1],
                startDate = new Date(recurrStart).setHours(startHour),
                endDate = new Date(recurrEnd).setHours(endHour);

            startDate = new Date(startDate).setMinutes(startMinutes);
            endDate = new Date(endDate).setMinutes(endMinutes);

            fwa.set('schedStartDate', new Date(startDate));
            fwa.set('schedEndDate', new Date(endDate));
        }

        vm.set('selectedFWA', fwa);
        var selection = vm.get('selectedFWA'), //Look directly in the viewModel
            settings = TS.app.settings,
            isCrewChief,
            isApprover,
            attachments,
            clientImg = fwaForm.lookup('clientApprovalImage'),
            chiefImg = fwaForm.lookup('chiefApprovalImage'),
            dateOrdered = Ext.first('#dateOrderedField'),
            orderedBy = Ext.first('#orderedByField'),
            dateRequired = Ext.first('#dateRequiredField'),
            udf1Date = Ext.first('#udf_d1_field'),
            udf2Date = Ext.first('#udf_d2_field'),
            udf3Date = Ext.first('#udf_d3_field'),
            workCodeUnitsFieldset = fwaForm.lookup('workCodeUnitFieldset'),
            clientSignatureCount = 0,
            chiefSignatureCount = 0,
            fieldsetText = '';

        settings.isLoading = true;
        //clear any locks
        me.setFormRead();
        //clear signature panels
        clientImg.setSrc(null);
        clientImg.setHidden(true);
        chiefImg.setSrc(null);
        chiefImg.setHidden(true);
        isCrewChief = me.checkForCrewChief(selection, settings.empId);
        isApprover = selection.get('fwaApprovers').indexOf(settings.empId) !== -1;

        if (selection.get('lastSubmittedDate') < new Date('1/1/0001 12:30:00 AM')) {
            selection.set('lastSubmittedDate', new Date('1/1/2001 12:00:00 AM'))
        }
        if (selection.get('lastApprovedDate') < new Date('1/1/0001 12:30:00 AM')) {
            selection.set('lastApprovedDate', new Date('1/1/2001 12:00:00 AM'))
        }

        if (selection.get('dateOrdered') < new Date('1/1/0001 12:30:00 AM')) {
            dateOrdered.setValue('');
        }

        if (selection.get('dateRequired') < new Date('1/1/0001 12:30:00 AM')) {
            dateRequired.setValue('');
            fwaForm.lookup('dateRequiredField').setValue('');
        }

        if (selection.get('udf_d1') < new Date('1/1/0001 12:30:00 AM')) {
            udf1Date.setValue('');
        }
        if (selection.get('udf_d2') < new Date('1/1/0001 12:30:00 AM')) {
            udf2Date.setValue('');
        }
        if (selection.get('udf_d3') < new Date('1/1/0001 12:30:00 AM')) {
            udf3Date.setValue('');
        }

        if (selection.getLoc()) {
            if (selection.getLoc().get('latitude') == '0') selection.getLoc().set('latitude', '');
            if (selection.getLoc().get('longitude') == '0') selection.getLoc().set('longitude', '');
        }

        if (!selection) {
            Ext.Msg.alert('FYI', 'Please select ' + settings.fwaAbbrevLabel + ' from list');
            return;
        }
        vm.set('newFwa', false);
        vm.set('isScheduler', false);
        vm.set('clientSigReq', selection.get('clientSigReq'));
        vm.set('chiefSigReq', selection.get('chiefSigReq'));
        vm.set('hasRights', settings.fwaCreateNew);
        vm.set('notesCls', selection.get('hasNotes') ? 'x-fa fa-folder-open' : 'x-fa fa-folder');
        //no need to check if isScheduler, since this is modern
        vm.set('wbsLocked', selection.get('wbsLocked'));

        if (!selection.get('preparedByEmpId') || selection.get('preparedByEmpId') == '') {
            selection.set('preparedByEmpId', settings.preparedByEmpId);
        }

        if (settings.fwaAutoNumbering) {
            fwaForm.lookup('fwaNumField').setLabel(settings.fwaAbbrevLabel + ' # (auto-number)');
            fwaForm.lookup('fwaNumField').setReadOnly(true);
        }

        attachments = selection.get('attachments');
        //reset to start
        Ext.first('#deleteClientSignatureButton').setHidden(true);
        Ext.first('#viewAllClientSignatureButton').setHidden(true);
        Ext.first('#clientApprovalButton').setWidth('100%');
        //chief approval
        Ext.first('#deleteChiefSignatureButton').setHidden(true);
        Ext.first('#viewAllChiefSignatureButton').setHidden(true);
        Ext.first('#chiefApprovalButton').setWidth('100%');
        //get FWA approval dates

        if (attachments || selection.get('clientApprovalImage') || selection.get('chiefApprovalImage')) {
            var clientApproval = selection.get('attachments').filter(function (data) {
                    return data.attachmentType == 'S' && data.owningModelType == 'Fwa';
                }),
                chiefApproval = selection.get('attachments').filter(function (data) {
                    return data.attachmentType == 'E' && data.owningModelType == 'Fwa';
                }),
                clientApprovalDate,
                clientApprovalImage,
                chiefApprovalDate,
                chiefApprovalImage;

            if (clientApproval && clientApproval.length > 0) {
                Ext.first('#fwaClientSignatures').setHidden(false);
                clientImg.config.attachmentId = clientApproval[0].attachmentId;
            }

            if (chiefApproval && chiefApproval.length > 0) {
                Ext.first('#fwaChiefSignatures').setHidden(false);
                chiefImg.config.attachmentId = chiefApproval[0].attachmentId;
            }

            Ext.each(selection.get('attachments'), function (data) {
                if (data.attachmentType == 'S' && data.owningModelType == 'Fwa') {
                    clientSignatureCount++;
                }
                if (data.attachmentType == 'E' && data.owningModelType == 'Fwa') {
                    chiefSignatureCount++;
                }
            });
            //show-hide view all, size segmented button
            //client approval

            Ext.first('#deleteClientSignatureButton').setHidden(clientSignatureCount == 0);
            Ext.first('#viewAllClientSignatureButton').setHidden(clientSignatureCount <= 1);
            Ext.first('#clientApprovalButton').setWidth(clientSignatureCount <= 1 ? '100%' : '75%');
            //chief approval
            Ext.first('#deleteChiefSignatureButton').setHidden(chiefSignatureCount == 0);
            Ext.first('#viewAllChiefSignatureButton').setHidden(chiefSignatureCount <= 1);
            Ext.first('#chiefApprovalButton').setWidth(chiefSignatureCount <= 1 ? '100%' : '75%');

            //if (!selection.get('clientApprovalImage')) {
            if (clientApproval && clientApproval.length > 0) {
                clientApprovalDate = clientApproval[0].dateAttached;
                selection.set('clientApprovalDate', clientApprovalDate);
                Ext.first('#clientApprovalDate').setValue(Ext.Date.format(new Date(clientApprovalDate), 'm/d/Y h:i A'));
                selection.set('clientApprovalImage', 'data:application/octet-stream;base64,' + clientApproval[0].attachmentItem);
                selection.set('clientApprovalImageId', clientApproval[0].attachmentId);
                fwaForm.lookup('clientApprovalImage').setSrc(selection.get('clientApprovalImage'));
                fwaForm.lookup('clientApprovalImage').setHidden(false);
                Ext.first('#deleteClientSignatureButton').setHidden(clientApproval.length > 0);
            } else {
                Ext.first('#deleteClientSignatureButton').setHidden(true);
                Ext.first('#clientApprovalButton').setWidth('100%');
            }
            //}

            //if (!selection.get('chiefApprovalImage')) {
            if (chiefApproval && chiefApproval.length > 0) {
                chiefApprovalDate = chiefApproval[0].dateAttached;
                selection.set('chiefApprovalDate', chiefApprovalDate);
                Ext.first('#chiefApprovalDate').setValue(Ext.Date.format(new Date(chiefApprovalDate), 'm/d/Y h:i A'));
                selection.set('chiefApprovalImage', 'data:application/octet-stream;base64,' + chiefApproval[0].attachmentItem);
                selection.set('chiefApprovalImageId', chiefApproval[0].attachmentId);
                fwaForm.lookup('chiefApprovalImage').setSrc(selection.get('chiefApprovalImage'));
                fwaForm.lookup('chiefApprovalImage').setHidden(false);
                Ext.first('#deleteChiefSignatureButton').setHidden(chiefApproval.length > 0);
            } else {
                Ext.first('#deleteChiefSignatureButton').setHidden(true);
                Ext.first('#chiefApprovalButton').setWidth('100%');
            }
            //}
        }

        if (selection.get('nonFieldActionCt') == 0 || vm.get('newFwa') || !settings.fwaDisplayActionsbutton) {
            fwaForm.lookup('nonFieldActionsButton').setHidden(true);
        } else {
            fwaForm.lookup('nonFieldActionsButton').setHidden(false);
        }

        if (!selection.get('scheduledCrewId')) {
            Ext.first('#crewPhoneButton').setHidden(true);
        }

        me.showHideBySecuritySettings(selection);
        if (selection.get('fwaStatusId') == FwaStatus.Submitted) {
            //set read only
            if (!settings.fwaAllowUnsubmit) {
                me.setFormReadOnly();
            }
        }
        if (selection.get('fwaStatusId') == FwaStatus.Submitted && isApprover) {
            //set read only
            if (!selection.get('fwaApproversCanModify')) {
                me.setFormReadOnly();
            }
        }
        if (selection.get('fwaStatusId') == FwaStatus.Submitted && isApprover && isCrewChief) {
            if (settings.fwaAllowUnsubmit || selection.get('fwaApproversCanModify')) {
                me.setFormRead();
            }
        }

        if (settings.hideSections.indexOf('W') == -1) {
            fieldsetText += settings.workCodeLabelPlural + ', ';
        }

        workCodeUnitsFieldset.setTitle('Manage');
        //now show edit screen
        vw.setActiveItem(fwaForm);
        //hide reset dates button if recurring
        Ext.first('#resetDatesBtn').setHidden(selection.get('recurrencePattern') != '' || !isCrewChief || (selection.get('recurrencePattern') == '' && selection.get('fwaStatusId') == FwaStatus.Approved));
        Ext.first('#schedStartDateField').setDisabled(selection.get('recurrencePattern') != '');
        Ext.first('#schedStartTimeField').setDisabled(selection.get('recurrencePattern') != '');
        Ext.first('#schedEndDateField').setDisabled(selection.get('recurrencePattern') != '');
        Ext.first('#schedEndTimeField').setDisabled(selection.get('recurrencePattern') != '');
        Ext.first('#isContractWorkCbx').setDisabled(true);
        Ext.first('#wbsLockedCbx').setHidden(true);
        Ext.first("#scheduledByField").setDisabled(!isCrewChief);
        Ext.first('#fieldPriorityField').setDisabled(!isCrewChief);
        //no expense entry/edit when working offline
        fwaForm.lookup('manageExpensesButton').setHidden(IS_OFFLINE);
        //Ext.first('#schedEndTimeField').setValue(vm.get('selectedFWA').get('schedEndDate'));

        if (selection.get('recurrencePattern'))
            Ext.first('#schedEndTimeField').setValue(selection.get('schedEndDate'));
        //because form is dirty after load, reset form to not dirty so we can check
        if (selection._loc) {
            selection._loc.dirty = false;
        }
        selection.dirty = false;
        me.resetIsLoading();
        //reset button
        me.getView().down('toolbar[docked=bottom]').items.items[1].setDisabled(true);

        Ext.first('#clientApprovalButton').setWidth(clientSignatureCount <= 1 ? '100%' : '75%');
        Ext.first('#chiefApprovalButton').setWidth(chiefSignatureCount <= 1 ? '100%' : '75%');

        selection.modified = {};
        selection.previousValues = {};
        selection.dirty = false;

        Ext.first('#toggleWorkButton').setText(selection.get('fwaStatusId') !== FwaStatus.InProgress ? 'Start' : 'Stop');
        Ext.first('#toggleWorkButton').setIconCls(selection.get('fwaStatusId') !== FwaStatus.InProgress ? 'x-fa fa-hourglass-start' : 'x-fa fa-hourglass-end');
        Ext.first('#toggleWorkButton').setHidden(vm.get('newFwa') || vm.get('isScheduler') || !settings.fwaDisplayStartButton);

    },

    resetIsLoading: function () {
        var task = Ext.create('Ext.util.DelayedTask', function () {
            //server calling method
            TS.app.settings.isLoading = false;
        }, this);
        task.delay(1000);
        //task.cancel()
    },

    setFormRead: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            selection = vm.get('selectedFWA'),
            isCrewChief = me.checkForCrewChief(selection, settings.empId),
            form = vw.lookup('fwaEditForm');
        //enable form fields
        form.enable();
        // enable any buttons
        Ext.Array.each(form.query('button'), function (button) {
            button.setDisabled(false);
        });
    },

    setFormReadOnly: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            selection = vm.get('selectedFWA'),
            isCrewChief = me.checkForCrewChief(selection, settings.empId) || (me.getViewModel().get('newFwa') && settings.fwaCreateNew),
            form = vw.lookup('fwaEditForm');

        //disable form fields
        form.disable();
        // Disable any buttons
        Ext.Array.each(form.query('button'), function (button) {
            button.setDisabled(true);
        });

        form.lookup('schedStartDateField').setReadOnly(true);
        form.lookup('schedStartTimeField').setReadOnly(true);
        form.lookup('schedEndDateField').setReadOnly(true);
        form.lookup('schedEndTimeField').setReadOnly(true);

        // turn on certain buttons
        form.lookup('saveFwaButton').setDisabled(true);
        form.lookup('submitFwaButton').setDisabled(true);
        form.lookup('fwaEditMenuButton').setDisabled(false);
        form.lookup('backButton').setDisabled(false);
        form.lookup('notesButton').setDisabled(false);
        form.lookup('manageHoursButton').setDisabled(false);
        form.lookup('manageWorkCodeButton').setDisabled(false);
        form.lookup('manageUnitsButton').setDisabled(false);
        form.lookup('nonFieldActionsButton').setDisabled(false);
        //form.lookup('mapButton').setDisabled(false);
        Ext.first('#crewPhoneButton').setDisabled(false);
        //turn on other buttons if chief
        if (isCrewChief) {
            form.lookup('clientApprovalButton').setDisabled(false);
            form.lookup('chiefApprovalButton').setDisabled(false);
        }
    },

    showHideBySecuritySettings: function (record) {
        var me = this,
            vm = me.getViewModel(),
            form = me.getView().lookup('fwaEditForm'),
            settings = TS.app.settings,
            isScheduler = me.getViewModel().get('isScheduler'),
            hasRights = me.getViewModel().get('hasRights'),
            isCrewChief = me.checkForCrewChief(record, settings.empId),
            canModify = (settings.fwaCanModify == 'A' || settings.fwaCanModify == 'M') && isCrewChief,
            saveButton = form.lookup('saveFwaButton'),
            submitButton = form.lookup('submitFwaButton');

        vm.set('hideFwaCopyButton', false);
        vm.set('hideFwaCreateButton', false);
        vm.set('hideAddWorkCode', false);
        vm.set('isNewOrHideCopy', false);
        vm.set('isNewOrHideCreate', false);

        //check security setting value for adding work codes
        if (settings.fwaAddWorkCode != 'A') {
            if (settings.fwaAddWorkCode == 'N') {
                vm.set('hideAddWorkCode', true);
            } else if (settings.fwaAddWorkCode == 'M') {
                if (!isCrewChief) {
                    vm.set('hideAddWorkCode', true);
                }
            }
        }

        //check security settings for modifying fwa
        if (!canModify) {
            me.setFormReadOnly();
        }

        //check if scheduler or is chief
        if (isCrewChief || canModify) {
            saveButton.setDisabled(false);
            submitButton.setDisabled(false);
        } else {
            saveButton.setDisabled(true);
            submitButton.setDisabled(true);
        }
        //check if cannot modify & can copy/create new Fwa
        if (!settings.fwaCreateNew) {
            vm.set('hideFwaCreateButton', true);
        } else {
            //copy fwa allowed even if cannot modify
            vm.set('hideFwaCopyButton', false);
        }
        //match up with isNew to show/hide edit menu items
        vm.set('isNewOrHideCopy', (vm.get('newFwa') || vm.get('hideFwaCopyButton')));
        vm.set('isNewOrHideCreate', (vm.get('newFwa') || vm.get('hideFwaCreateButton') || !isCrewChief));
    },

    onCreateFwa: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            fwaForm,
            store = vm.getStore('fwalist'),
            settings = TS.app.settings,
            submitButton,
            schedStore,
            scheduler,
            fwa,
            priority,
            colors;

        vm.set('selectedFWA', '');
        if (Ext.first('fwa-edit'))
            Ext.first('fwa-edit').destroy();

        fwaForm = vw.add({
            xtype: 'fwa-edit',
            title: 'Edit card',
            listeners: {
                save: 'onSave',
                submit: 'onSubmit'
            }
        });

        if (!Ext.os.is.Phone) {
            fwaForm.lookup('onlineFwaInfo').setMargin('0 40 0 0');
            fwaForm.lookup('onlineGeneralInformation').setMargin('0 40 0 0');
            fwaForm.lookup('onlineProjectLookup').setMargin('0 30 0 0');
            fwaForm.lookup('onlineProjectLookup').setRight('1em');
            fwaForm.lookup('onlineProjectLookup').setTop('-0.1em');
            fwaForm.lookup('onlineWorkAddress').setMargin('0 40 0 0');
            fwaForm.lookup('onlineDateTime').setMargin('0 40 0 0');
            fwaForm.lookup('workCodeUnitFieldset').setMargin('0 40 0 0');
            fwaForm.lookup('onlineApprovalReq').setMargin('0 40 0 0');
            fwaForm.lookup('onlineSignatures').setMargin('0 40 0 0');
        }

        submitButton = fwaForm.lookup('submitFwaButton');
        //reset fields
        vm.set('wbsLocked', false);
        fwaForm.lookup('schedStartDateField').setValue('');
        fwaForm.lookup('schedEndDateField').setValue('');
        fwaForm.lookup('udf_d1_field').setValue('');
        fwaForm.lookup('udf_d2_field').setValue('');
        fwaForm.lookup('udf_d3_field').setValue('');
        fwaForm.lookup('clientApprovalImage').setSrc('');
        fwaForm.lookup('chiefApprovalImage').setSrc('');
        fwaForm.lookup('clientApprovalImage').setHidden(true);
        fwaForm.lookup('chiefApprovalImage').setHidden(true);

        fwaForm.lookup('viewAllClientSignatureButton').setHidden(true);
        fwaForm.lookup('viewAllChiefSignatureButton').setHidden(true);

        fwaForm.lookup('deleteClientSignatureButton').setHidden(true);
        fwaForm.lookup('deleteChiefSignatureButton').setHidden(true);

        fwaForm.lookup('clientApprovalButton').setWidth('100%');
        fwaForm.lookup('chiefApprovalButton').setWidth('100%');

        fwaForm.lookup('schedStartTimeField').setValue('');
        fwaForm.lookup('schedEndTimeField').setValue('');

        //submitButton.setDisabled(true);
        //Associations aren't parsed when you call the model constructor, use new method instead (CCG specific)
        fwa = TS.model.fwa.Fwa.createWithAssociations({
                fwaId: '', //have to set as parameter rather than changing after record it's created
                availableForUseInField: settings.availableForUseInField
            }
        );
        //clear the dates on create
        fwa.set('schedStartDate', '');
        fwa.set('schedEndDate', '');
        fwa.set('udf_d1', '');
        fwa.set('udf_d2', '');
        fwa.set('udf_d3', '');

        if (settings.fwaAutoNumbering) {
            fwaForm.lookup('fwaNumField').setLabel(settings.fwaAbbrevLabel + ' # (auto-number)');
        }
        fwaForm.lookup('notesButton').setHidden(false);
        store.add(fwa);
        vm.set('newFwa', true);
        vm.set('selectedFWA', fwa);
        vm.get('selectedFWA').set('wbs1', '');
        vm.get('selectedFWA').set('wbs2', '');
        vm.get('selectedFWA').set('wbs3', '');
        vm.get('selectedFWA').set('clientName', '');
        vm.get('selectedFWA').set('wbsLocked', false);
        vm.get('selectedFWA').set('dateOrdered', new Date());
        vm.get('selectedFWA').set('schedStartDate', new Date(Ext.Date.format(new Date(), 'n/j/Y') + ' ' + Ext.Date.format(settings.schedVisibleHoursStart, 'g:i A')));
        var dt = vm.get('selectedFWA').get('schedStartDate');
        vm.get('selectedFWA').set('schedEndDate', new Date(Ext.Date.format(new Date(), 'n/j/Y') + ' ' + Ext.Date.format(Ext.Date.add(dt, Ext.Date.HOUR, 1), 'g:i A')));

        vw.setActiveItem(1);

        fwaForm.lookup('wbs1NameField').setValue('');
        fwaForm.lookup('wbs2NameField').setValue('');
        fwaForm.lookup('wbs3NameField').setValue('');
        fwaForm.lookup('clientNameField').setValue('');

        vm.get('selectedFWA').set('preparedByEmpId', settings.empId);

        if (!bt.up('fwa-mainmenu')) {
            bt.up('fwa-editmenu').hide();
        } else {
            bt.up('fwa-mainmenu').hide();
        }

        Ext.first('#dateTimeHeader').setTitle('Dates & Times');
        Ext.first('#schedStartDateField').setValue('');
        Ext.first('#schedEndDateField').setValue('');
        Ext.first('#schedStartTimeField').setValue('');
        Ext.first('#schedEndTimeField').setValue('');
    },

    newFileLoaded: function (cmp, event) {
        var me = this,
            btn = me.getView().down('button[action=camera]'),
            msg = 'Loading image data';

        // TODO Mask relevant components
        //init , listen for the result in data event
        //By default 'image/jpeg' will be returned, use 4th parameter to set mime to  'image/png'
        btn.getFileData(event, 128, 128);
    },

    fileDataReceived: function (data) {
        //TODO Unmask after data is received
        this.getView().down('#description').setData({
            description: 'Image Loaded',
            imagesrc: data
        });// for payload testing only

    },

    onMainMenuTap: function (bt) {
        if (IS_OFFLINE) {
            Ext.Msg.alert('FYI', 'While Off Line, no options available.');
            return;
        }
        var menu = this.getView().add(Ext.create({xtype: 'fwa-mainmenu'}));
        menu.show();
    },

    onAttachDoc: function (btn) {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            fwaId = fwa.get('fwaId'),
            grid = me.getView().down('grid'),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'window-document',
                //Fuse view modelsde
                viewModel: {
                    parent: me.getViewModel()
                },
                attType: 'Document',
                associatedRecordId: fwaId,
                attachmentsList: {
                    modelType: 'FWA',
                    modelId: fwaId,
                    includeItem: true,
                    attachmentType: AttachmentType.Document
                }
            }),
            //attachText = settings.fwaCanModify == 'A' ? 'Attach ' : 'View ';
            attachText = settings.fwaCanModify == 'A' ||
            (settings.fwaCanModify == 'M' && fwa.get('scheduledCrewChiefId') == settings.empId) ||
            (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify')) ? 'Attach ' : 'View ';
        fwa.dirty = settings.currentState;
        me.getView().setLoading(true, 'Loading Documents....');
        if (Ext.first('#attachFormFrame')) {
            if (settings.fwaCanModify == 'A' ||
                (settings.fwaCanModify == 'M' && fwa.get('scheduledCrewChiefId') == settings.empId) ||
                (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify'))) {
                Ext.first('#attachFormFrame').setHidden(false);
            } else {
                Ext.first('#attachFormFrame').setHidden(true);
            }
        }

        sheet.lookup('attachmentList').setTitle('Attachments' + me.getAttachmentCount(AttachmentType.Document));
        sheet.lookup('attachmentList').add(
            {
                xtype: 'attachments',
                attachmentParams: sheet.attachmentsList
            }
        );

        sheet.down('titlebar[docked=top]').setTitle(attachText + TS.app.settings.fwaAbbrevLabel + ' Document');
        //sheet.lookup('fromTemplateButton').setHidden(IS_CORDOVA_APP);
        setTimeout(function () {
            Ext.Viewport.add(sheet);
            sheet.show();
            if (IS_OFFLINE) {
                btn.up('fwa-editmenu-offline').hide();
            } else {
                btn.up('fwa-editmenu').hide();
            }
            me.getView().setLoading(false);
        }, 500);
    },

    getAttachmentCount: function (type) {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            docCt = fwa.get('attachmentCtDoc'),
            picCt = fwa.get('attachmentCtPhoto');

        if (type == AttachmentType.Photo) {
            return ' (' + picCt + ')';
        } else if (type == AttachmentType.Document) {
            return ' (' + docCt + ')';
        }
    },

    //Handler for FWA  from Edit Menu
    onAttachPhoto: function (btn) {
        var me = this,
            fwa = me.getViewModel().get('selectedFWA'),
            fwaId = fwa.get('fwaId'),
            grid = me.getView().down('grid'),
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'window-photo',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                attType: 'Photo',
                associatedRecordId: fwaId,
                attachmentsList: {
                    modelType: 'FWA',
                    modelId: fwaId,
                    includeItem: true,
                    attachmentType: AttachmentType.Photo
                }
            }),
            attachText = settings.fwaCanModify == 'A' ||
            (settings.fwaCanModify == 'M' && fwa.get('scheduledCrewChiefId') == settings.empId) ||
            (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify')) ? 'Attach ' : 'View ';

        me.getView().setLoading(true, 'Loading Attachments...');
        if (Ext.first('#attachFormFrame')) {
            if (settings.fwaCanModify == 'A' ||
                (settings.fwaCanModify == 'M' && fwa.get('scheduledCrewChiefId') == settings.empId) ||
                (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify'))) {
                Ext.first('#attachFormFrame').setHidden(false);
            } else {
                Ext.first('#attachFormFrame').setHidden(true);
            }
        }

        sheet.lookup('attachmentList').setTitle('Attachments' + me.getAttachmentCount(AttachmentType.Photo));
        sheet.lookup('attachmentList').add(
            {
                xtype: 'attachments',
                attachmentParams: sheet.attachmentsList
            }
        );

        sheet.down('titlebar[docked=top]').setTitle(attachText + TS.app.settings.fwaAbbrevLabel + ' Photo');

        setTimeout(function () {
            Ext.Viewport.add(sheet);
            sheet.show();
            if (IS_OFFLINE) {
                btn.up('fwa-editmenu-offline').hide();
            } else {
                btn.up('fwa-editmenu').hide();
            }

            me.getView().setLoading(false);
        }, 500);
    },

    onOpenEmail: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            fwaId = fwa.get('fwaId'),
            settings = TS.app.settings,
            employee = Ext.getStore('Employees').getById(settings.empId),
            data,
            sheet,
            list,
            store;

        if (fwa.dirty || settings.dirty) {
            settings.dirty = false;

            data = me.massageFwaData();

            sheet = Ext.create({
                xtype: 'window-email',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                },
                appType: 'FWA',
                fwa: data,
                modelId: fwaId,
                emailNote: {_tr: 'fwaAbbrevLabel', tpl: 'Attach {0}'}
            })
        } else {
            sheet = Ext.create({
                xtype: 'window-email',
                //Fuse view models
                viewModel: {
                    parent: this.getViewModel()
                },
                appType: 'FWA',
                modelId: fwaId,
                emailNote: {_tr: 'fwaAbbrevLabel', tpl: 'Attach {0}'}
            });
        }


        sheet.lookup('ccEmailField').setValue(employee.get('emailAddress'));
        list = Ext.first('#attachList');
        store = list.getStore();
        store.getProxy().setExtraParams({
            modelType: 'FWA',
            modelId: fwaId,
            includeItem: false,
            attachmentType: 'X'
        });
        store.reload({
            callback: this.loadUnSaved,
            scope: this
        });
        store.filterBy(function (obj) {
            return obj.get('attachmentType') != AttachmentType.ClientSignature && obj.get('attachmentType') != AttachmentType.EmpSignature;
        });
        sheet.lookup('ccEmailField');
        sheet.down('titlebar[docked=top]').setTitle('Email');
        sheet.down('formpanel').down('checkboxfield').setLabel(sheet.emailNote);
        if (btn)
            btn.up('fwa-editmenu').hide();
        Ext.Viewport.add(sheet);
        sheet.show();

    },


    loadUnSaved: function () {
        var me = this,
            list = Ext.first('#attachList'),
            store = list.getStore(),
            selection = me.getViewModel().get('selectedFWA'),
            attachmentsToAdd = selection.get('attachmentsToAdd') ? selection.get('attachmentsToAdd') : [];
        Ext.each(attachmentsToAdd, function (item) {
            store.add(item);
        });
    },

    onCellMapTap: function (cmp, e) {
        var rec = cmp.parent.getRecord(),//this is our data for map
            sheet;

        if (IS_OFFLINE) {
            Ext.Msg.alert('FYI', 'Currenly offline, no mapping available');
            return;
        }

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

    onPrintAll: function (bt) {
        var me = this,
            store = me.getViewModel().get('fwalist'),
            idArray = [],
            fwaNumArray = [],
            settings = TS.app.settings,
            view = me.getView(),
            sheet;
        store.each(function (rec) {
            idArray.push(rec.get('fwaId'));
            fwaNumArray.push(rec.get('fwaNum'));
        });

        sheet = Ext.create({
            xtype: 'window-print',
            //Fuse view models
            viewModel: {
                parent: me.getViewModel()
            },
            modelId: '_none_',
            appType: 'FWA',
            empId: settings.empId,
            isList: true,
            idArray: idArray,
            fwaNumArray: fwaNumArray
        });

        Ext.Viewport.add(sheet);
        sheet.down('titlebar[docked=top]').setTitle(settings.fwaAbbrevLabel + ' List');
        sheet.down('toolbar[docked=bottom]').setHidden(false);
        //Ext.first('#printCombinedButtonBar').show();
        sheet.show();

        bt.up('fwa-mainmenu').hide();
    },

    onPrint: function (bt) {
        var me = this,
            id = me.getViewModel().get('selectedFWA').get('fwaId'),
            settings = TS.app.settings,
            data = me.massageFwaData(),
            sheet = Ext.create({
                xtype: 'window-print',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                modelId: id,
                appType: 'FWA',
                fwa: data,
                empId: settings.empId,
                isList: false
            });

        Ext.first('#singleFile').setHidden(!sheet.isList);
        Ext.Viewport.add(sheet);
        sheet.down('titlebar[docked=top]').setTitle(settings.fwaAbbrevLabel + ' List');
        sheet.show();

        bt.up('fwa-editmenu').hide();
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

        //add any signature
        Ext.each(data.attachmentsToAdd, function (att) {
            if (!data.attachments)
                data.attachments = [];
            data.attachments.push(att);
        });
        //remove any deleted
        Ext.each(data.attachmentsToDelete, function (att) {
            if (!data.attachments)
                data.attachments = [];
            data.attachments.splice(att);
        });

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
        //TBD at later date
        Ext.each(data.hours, function (entry) {
            entry.startTime = new Date();
            entry.endTime = new Date();
        });

        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);
        return data;
    },

    onGroupMapClick: function (cmp, e) {
        var store = this.getViewModel().get('fwalist'),
            sheet;

        sheet = Ext.create({
            xtype: 'fwa-map',
            viewModel: {
                parent: this.getViewModel()
            },
            dataRecord: null,
            store: store
        });

        Ext.Viewport.add(sheet);
        sheet.show();
        cmp.up('fwa-mainmenu').hide();
    },

    onRefreshList: function (cmp, e) {
        var store = this.getViewModel().get('fwalist');
        store.reload();
        cmp.up('fwa-mainmenu').hide();
    },

    doCopyFwa: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            fwaId = vm.get('selectedFWA').get('fwaId'),
            store = vm.getStore('fwalist'),
            settings = TS.app.settings,
            fwa;

        view.setLoading(true);

        Fwa.Copy(null, settings.username, fwaId, function (response) {
            var dataObject = response.data,
                fwa,
                loc;

            dataObject.fwaId = ''; //remove fwaId before create new record to avoid conflicts

            //Associations aren't parsed when you call the model constructor, use new method instead (CCG specific)
            fwa = TS.model.fwa.Fwa.createWithAssociations(dataObject);

            //clear 0 values
            loc = fwa.getLoc();
            if (loc.get('latitude') == 0) loc.set('latitude', '');
            if (loc.get('longitude') == 0) loc.set('longitude', '');
            //clear date fields
            fwa.set('dateOrdered', '');
            fwa.set('dateRequired', '');
            fwa.set('udf_d1', '');
            fwa.set('udf_d2', '');
            fwa.set('udf_d3', '');

            //schedEndDate
            //schedStartDate
            vm.set('newFwa', true);
            fwa.set('isCopy', true);
            fwa.set('schedStartDate', new Date());
            fwa.set('schedEndDate', new Date());
            store.add(fwa);

            vm.set('selectedFWA', fwa);

            if (settings.fwaAutoNumbering) {
                me.getView().lookup('fwaEditForm').lookup('fwaNumField').setLabel(settings.fwaAbbrevLabel + ' # (auto-number)');
            }
            view.setActiveItem(1); // switching to the form

            view.setLoading(false);

            bt.up('fwa-editmenu').hide();
        }, me, {
            autoHandle: true
        });
    },

    approveFwaForm: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            settings = TS.app.settings;

        if (fwa.dirty) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    Ext.Msg.confirm('Please Confirm',
                        'Are you sure you want to approve ' + settings.fwaAbbrevLabel + ' ' + fwa.get('fwaNum') + ': ' + fwa.get('fwaName') + '?',
                        me.onApproveConfirm, //the button callback
                        me); //scope
                }
            });
        } else {
            Ext.Msg.confirm('Please Confirm',
                'Are you sure you want to approve ' + settings.fwaAbbrevLabel + ' ' + fwa.get('fwaNum') + ': ' + fwa.get('fwaName') + '?',
                me.onApproveConfirm, //the button callback
                me); //scope
        }

        bt.up('fwa-editmenu').hide();
    },

    searchFwaForm: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            wcStore = Ext.getStore('WorkCodes'),
            settings = TS.app.settings,
            checkBox,
            sheet,
            list;
        vm.set('isChief', me.checkForCrewChief(fwa, settings.empId));
        sheet = Ext.create({
            xtype: 'fwa-search',
            viewModel: {
                parent: me.getViewModel()
            },
            dataRecord: null,
            fwa: fwa
        });
        //preload search parameters
        Ext.first('#clientSearch').setValue(fwa.get('clientName'));
        //wbs values
        Ext.first('#wbs1Search').setValue(fwa.get('wbs1'));
        Ext.first('#wbs2Search').setValue(fwa.get('wbs2'));
        Ext.first('#wbs3Search').setValue(fwa.get('wbs3'));

        list = Ext.first('#workCodeList');
        list.setStore(wcStore);
        Ext.Viewport.add(sheet);
        sheet.show();
        bt.up(!IS_OFFLINE ? 'fwa-editmenu' : 'fwa-editmenu-offline').hide();
    },

    onApproveConfirm: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA');

        if (btn === 'yes') {
            Fwa.Approve(null, settings.username, settings.empId, fwa.get('fwaId'), vm.get('isScheduler'), function (response) {
                if (response.success) {
                    Ext.Msg.alert('Approved', settings.fwaAbbrevLabel + ' Approved');
                    me.getView().setActiveItem(0);
                }
            }, me, {
                autoHandle: true
            });
        }
    },

    removeFwaForm: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            fwa = vm.get('selectedFWA'),
            unitsEnabled = settings.fwaUnitsEnabled,
            additionalMessage,
            hrsReadOnly = false,
            hrsMessage = '',
            ttlHours = 0,
            ttlUnits = 0,
            unitsReadOnly = false,
            unitsMessage = '';

        Ext.each(fwa.hours().getRange(), function (entry) {
            if (entry.get('readOnly')) {
                hrsReadOnly = true;
                hrsMessage = entry.get('readOnlyReason');
            }
            ttlHours += entry.get('regHrs') + entry.get('ovtHrs') + entry.get('ovt2Hrs') + entry.get('travelHrs');
            if (entry.dirty) {
                fwa.dirty = true;
            }
        });

        Ext.each(fwa.units().getRange(), function (entry) {
            if (entry.get('readOnly')) {
                unitsReadOnly = true;
                unitsMessage = entry.get('readOnlyReason');
            }
            ttlUnits += entry.get('quantity');
            if (entry.dirty) {
                fwa.dirty = true;
            }
        });
        //FWA must be saved first before it can be deleted
        if (fwa.dirty) {
            Ext.Msg.alert('Unsaved Changes', 'Un-saved changes to Hours and or Units must be saved first before a ' + settings.fwaAbbrevLabel + ' can be removed.');
            return false;
        }

        if ((hrsReadOnly || unitsReadOnly) && (ttlHours > 0 || ttlUnits > 0)) {
            if (unitsEnabled) {
                if (ttlHours > 0 || ttlUnits > 0)
                    additionalMessage = 'Removal not allowed as time and unit processing has started. Contact the office.</br>' + (hrsMessage || unitsMessage);
                else
                    additionalMessage = 'Delete hour and/or unit quantity before removal is allowed.</br>' + (hrsMessage || unitsMessage);
            } else {
                if (ttlHours > 0)
                    additionalMessage = 'Removal not allowed as time processing has started. Contact the office.</br>' + (hrsMessage);
                else
                    additionalMessage = 'Delete hour quantity before removal is allowed.</br>' + (hrsMessage);
            }
            Ext.Msg.show({
                title: 'FYI',
                message: additionalMessage,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return false;
        } else if (ttlHours > 0 || ttlUnits > 0) {
            if (unitsEnabled) {
                additionalMessage = 'Delete hour and/or unit quantity before removal is allowed.</br>' + (hrsMessage || unitsMessage);
            } else {
                additionalMessage = 'Delete hour quantity before removal is allowed.</br>' + (hrsMessage);
            }
            Ext.Msg.show({
                title: 'FYI',
                message: additionalMessage,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return false;
        }

        Ext.Msg.confirm('Please Confirm',
            'Are you sure you want to remove ' + settings.fwaAbbrevLabel + ' ' + fwa.get('fwaNum') + ': ' + fwa.get('fwaName') +
            " from my crew's list?",
            me.onRemoveFwaFormConfirm,//the button callback
            me); //scope

        btn.up('fwa-editmenu').hide();
    },

    onRemoveFwaFormConfirm: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            store = vm.getStore('fwalist'),
            fwa = vm.get('selectedFWA');
        if (btn === 'yes') {
            Fwa.RemoveFwaStatus(null, settings.username, settings.empId, fwa.get('fwaId'), function (response) {
                if (response && response.success) {
                    fwa.dirty = false;
                    vm.set('fromSaveSubmit', true);
                    store.reload();
                    Ext.Msg.alert(
                        'Successfully Removed',
                        settings.fwaAbbrevLabel + ' has been successfully removed.',
                        function (btn) {
                            if (btn == 'ok') {
                                if (!vm.get('newFwa'))
                                    vm.set('selectedFWA', '');
                                fwa.set('clientApprovalImage', '');
                                fwa.set('chiefApprovalImage', '');
                            }
                        }
                    );
                } else if (response) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                }
                me.getView().setLoading(false);
            });
            me.getView().setActiveItem(0);
        }
    },

    onTaskList: function (bt) {
        var me = this,
            store,
            settings = TS.app.settings,
            sheet = Ext.create({
                xtype: 'dailytasklist',
                viewModel: {
                    parent: me.getViewModel()
                }
            }),
            grid;

        grid = Ext.first('#crewChiefGrid');

        Crew.GetCrewChiefList(null, settings.username, settings.empId, function (response) {
            if (response && response.success) {
                store = new Ext.data.Store({
                    //model: 'TS.model.shared.PrintTemplate',
                    data: response.data
                });
                grid.setStore(store);
                Ext.Viewport.add(sheet);
                sheet.show();
            }
        }, me, {
            autoHandle: true
        });

        bt.up('fwa-mainmenu').hide();
    },

    onCrewList: function (bt) {
        var me = this,
            store,
            settings = TS.app.settings,
            sheet,
            grid;

        if (!IS_TABLET) {
            sheet = Ext.create({
                xtype: 'dailycrewlist',
                viewModel: {
                    parent: me.getViewModel()
                }
            });
            grid = Ext.first('#crewGrid');
            Crew.GetList(null, settings.username, settings.empId, 0, 25, 'N', function (response) {
                if (response && response.success) {
                    store = new Ext.data.Store({
                        //model: 'TS.model.shared.PrintTemplate',
                        data: response.data
                    });
                    grid.setStore(store);
                }
            }, me, {
                autoHandle: true
            });
        } else {
            sheet = Ext.create({
                xtype: 'dailycrewtabletlist',
                viewModel: {
                    parent: me.getViewModel()
                }
            });

            Ext.first('#tabletCrewTaskDateHeader').setValue(Ext.Date.format(new Date(), DATE_FORMAT));
        }

        Ext.Viewport.add(sheet);
        sheet.show();

        bt.up('fwa-mainmenu').hide();

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

    takeOfflineOnline: function (btn) {
        var sheet,
            settings = TS.app.settings,
            fwaGridStore = Ext.first('fwa-list').getStore(),
            documentCt = 0,
            photoCt = 0;

        Ext.each(fwaGridStore.getRange(), function (fwa) {
            documentCt += fwa.get('attachmentCtDoc');
            photoCt += fwa.get('attachmentCtPhoto');
        });

        settings.documentCt = documentCt;
        settings.photoCt = photoCt;

        if (!JSON.parse(localStorage.getItem('isOffline'))) {
            localStorage.setItem('isOffline', true);
            localStorage.setItem('offlineDateTime', Ext.JSON.encode(new Date()));
            IS_OFFLINE = true;
        } else {
            localStorage.setItem('isOffline', false);
            localStorage.setItem('offlineDateTime', '');
            IS_OFFLINE = false;
        }

        btn.setText(IS_OFFLINE ? 'Go Online' : 'Go Offline');

        if (IS_OFFLINE) {
            this.goOffline();
        } else {
            this.goOnline();
        }

    }
});