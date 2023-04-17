Ext.define('TS.controller.fwa.AssignmentFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-fwa',

    mixins: ['TS.mixin.ControllerForm'],

    requires: [
        'Sch.util.Date',
        'TS.Util',
        'TS.common.window.Email',
        'TS.model.fwa.Fwa'
    ],

    controller: {
        listen: {
            '*': {
                'signatureUpload': 'afterSignatureUpload',
                'enableForm': 'setFormRead',
                'finishSubmit': 'onFinishSubmit'
            },

            'map-fwa': {
                'positionUpdate': 'refreshAddressValues'
            }
        },

        global: {
            'resetDirtyState': 'resetDirtyState',
            'ResetAttachmentCounts': 'onResetAttachmentCounts',
            'ReloadDocumentAttachments': 'showAttachDocWindow',
            'ReloadImageAttachments': 'showAttachPhotoWindow',
            'SetFormReadOnly': 'setFormReadOnly',
            'ResetFormAfterDelete': 'onResetForm',
            'ResetFormStartEndDates': 'clearDateFields',
            'NewFwaAddExpenses': 'updateFwaForm'
        }
    },

    control: {
        'fieldset-address textfield:not(numberfield)': {
            change: 'onAddressChange'
        }

    },

    init: function () {
        this.readyInitialRecord();
    },

    readyInitialRecord: function (record) {
        var me = this,
            wbs1 = me.lookup('fwawbs1id'),
            wbs2 = me.lookup('fwawbs2id'),
            wbs3 = me.lookup('fwawbs3id'),
            wbs2Store = wbs2.getStore(),
            wbs3Store = wbs3.getStore(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            isScheduler = vm.get('isScheduler'),
            existingRecord = (record === undefined ? me.getView().record : record);
        //empty fields for new fwa
        me.clearFwaInfoFields();
        me.clearAddressFields();
        //clear selected combo box values
        wbs1.clearValue();
        wbs2.clearValue();
        wbs3.clearValue();
        //clear wbs2 & wbs3 stores
        wbs2Store.removeAll();
        wbs3Store.removeAll();
        //clear all disable/hidden
        me.setFormRead();
        if (existingRecord) {
            // Existing FWA
            me.reloadUnitCodeStore(existingRecord);
            if (existingRecord.get('udf_d1') < new Date('1/1/0001 12:30:00 AM'))
                existingRecord.set('udf_d1', '');
            if (existingRecord.get('udf_d2') < new Date('1/1/0001 12:30:00 AM'))
                existingRecord.set('udf_d2', '');
            if (existingRecord.get('udf_d3') < new Date('1/1/0001 12:30:00 AM'))
                existingRecord.set('udf_d3', '');

            me.loadFwaRecord(existingRecord);
            //check security
            me.showHideBySecuritySettings(record);
            vm.set('newFwa', false);
            vm.set('isSubmitted', existingRecord.get('fwaStatusId') == FwaStatus.Submitted);
        } else {
            // New FWA
            Ext.first('form-fwa').show();
            vm.set('clientSigReq', false);
            vm.set('chiefSigReq', false);
            me.loadFwaRecord(Ext.create('TS.model.fwa.Fwa', {availableForUseInField: settings.availableForUseInField}));
            me.lookup('fwaWorkGrid').setReadOnlyGrid(false);
            vm.set('newFwa', true);
            vm.set('nextDate', new Date());
            //initialize
            vm.set('noWorkCodeRights', false);
            //set focus
            if (settings.fwaAutoNumbering) {
                me.lookup('fwaNumField').emptyText = '<auto-number>';
                me.lookup('fwaNameField').focus(false, 2000);
            } else {
                me.lookup('fwaNumField').emptyText = '';
                me.lookup('fwaNumField').focus(false, 2000); // Focus the FWA number field on new FWA open
            }
            //set defaults
            if (settings.fwaReqClientSignature == 'Y') {
                vm.set('clientSigReq', true);
                Ext.first('#clientSigReqCheckbox').setValue(true);
            }
            if (settings.fwaReqChiefSignature == 'Y') {
                vm.set('chiefSigReq', true);

                Ext.first('#chiefSigReqCheckbox').setValue(true);
            }
            // me.lookup('schedStartTimeField').setValue(settings.schedVisibleHoursStart);
            // me.lookup('schedEndTimeField').setValue(Ext.Date.add(new Date(settings.schedVisibleHoursStart),Ext.Date.HOUR,1));
            me.lookup('dateOrderedField').setValue(new Date());
            me.lookup('dateHeader').setValue(Ext.Date.format(new Date(), DATE_FORMAT));
            me.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(), DATE_FORMAT));
            //default to client selected value
            if (Ext.getStore('PriorityList').data.length > 0) {
                var priority = Ext.getStore('PriorityList').findRecord('priorityDefault', true);
                if (!priority) {
                    me.lookup('fieldPriorityField').setValue(Ext.getStore('PriorityList').first());
                } else {
                    me.lookup('fieldPriorityField').setValue(Ext.getStore('PriorityList').findRecord('priorityDefault', true));
                }
            }
            me.getView().resetDirtyState();
            Ext.first('#fwaDayCount').setValue(0);
            Ext.first('fieldset-datetime').setTitle('Dates & Times');
        }
    },

    onResetForm: function () {
        var me = this,
            units = Ext.first('grid-unit').getStore();
        me.clearFwaInfoFields();
        me.clearAddressFields();
        units.clearData();
        units.removeAll();
        //me.clearDateFields();
    },

    clearFwaInfoFields: function () {
        var me = this,
            form = me.getView().getForm();
        //suspend change event so method not called repeatedly
        form.getFields().each(function (item, index, length) {
            item.suspendCheckChange++;
        });
        //clear out fields
        me.lookup('fwawbs1id').clearValue();
        me.lookup('fwawbs2id').clearValue();
        me.lookup('fwawbs3id').clearValue();//setValue(''); old way

        me.lookup('fwawbs1name').setValue('');
        me.lookup('fwawbs2name').setValue('');
        me.lookup('fwawbs3name').setValue('');

        me.lookup('clientNameField').setValue('');
        me.lookup('contactField').setValue('');
        me.lookup('scheduledCrewNameDisplay').setValue('');
        me.lookup('contractCheckbox').setValue(false);


        //turn change events back on
        form.getFields().each(function (item, index, length) {
            item.suspendCheckChange--;
        });
    },

    clearAddressFields: function () {
        var vw = this.getView();
        vw.lookup('udf_a1_text').setValue('');
        vw.lookup('udf_a2_text').setValue('');
        vw.lookup('udf_a3_text').setValue('');
        vw.lookup('udf_a4_text').setValue('');
        vw.lookup('udf_a5_text').setValue('');
        vw.lookup('udf_a6_text').setValue('');

        Ext.first('#address1Field').setValue('');
        Ext.first('#address2Field').setValue('');
        Ext.first('#cityField').setValue('');
        Ext.first('#stateField').setValue('');
        Ext.first('#zipField').setValue('');
        Ext.first('#latitudeField').setValue('');
        Ext.first('#longitudeField').setValue('');
    },

    clearDateFields: function () {
        if (Ext.first('#schedStartDateField')) Ext.first('#schedStartDateField').setValue('');
        if (Ext.first('#schedEndDateField')) Ext.first('#schedEndDateField').setValue('');
        if (Ext.first('#schedStartTimeField')) Ext.first('#schedStartTimeField').setValue('');
        if (Ext.first('#schedEndTimeField')) Ext.first('#schedEndTimeField').setValue('');
    },

    /**/
    refreshAddressValues: function (record) {
        var rec = (record || this.getView().getRecord()),
            form = this.getView().getForm(),
            loc = rec.get('loc');
        if (loc) {
            form.setValues(rec.get('loc'));
        }
    },
    /*
     * Refreshes the whole form, handling some of the custom logic with nested fields and stores
     * Called in response to controller events
     */
    refreshFormValues: function (record, isCopy) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            isScheduler = vm.get('isScheduler'),
            loc,
            clientSignature,
            clientSignatureCt = 0,
            chiefSignature,
            chiefSignatureCt = 0,
            rec = (record || vw.getRecord()),
            form = vw.getForm(),
            fwaWorkGrid = Ext.first('grid-workauth'),// me.lookup('fwaWorkGrid'),
            fwaUnitGrid = Ext.first('grid-unit'),
            employeeHoursGrid = me.lookup('employeeHoursGrid'),
            employeeExpensesGrid = me.lookup('employeeExpensesGrid'),
            unitGrid = me.lookup('fwaUnitGrid'),
            settings = TS.app.settings,
            empHoursStore,
            empHoursModel,
            fwaWorkGridStore,
            fwaUnitStore,
            fwaRecord,
            empHoursDate,
            unitsHoursDate,
            datesInRange,
            nextDate,
            currentIndex = 0,
            durationStore,
            empHoursWorkDateColumn = employeeHoursGrid.lookup('workDateField'),
            crewStore = Ext.getStore('AllCrews').getById(rec.get('scheduledCrewId')),
            crewMembers = crewStore ? crewStore.get('crewMembers') : '',
            workCodeDateBar = vw.lookup('workCodeDateBar'),
            unitsDateBar = vw.lookup('unitsDateBar'),
            utcDate,
            unitCodeStore = Ext.getStore('UnitCode'),
            wbs1 = rec.get('wbs1') ? rec.get('wbs1') : '^',
            wbs2 = rec.get('wbs2') ? rec.get('wbs2') : '^',
            wbs3 = rec.get('wbs3') ? rec.get('wbs3') : '^';

        if (!rec || !form) {
            return;
        }
        //set time fields
        me.lookup('schedStartTimeField').setValue(rec.get('schedStartDate'));
        me.lookup('schedEndTimeField').setValue(rec.get('schedEndDate'));
        vm.set('rec', rec);
        vm.set('unitCodeCount', 0);
        // Load the core record
        form.loadRecord(rec);
        // Load the work store
        fwaWorkGrid.setStore(rec.get('workSchedAndPerf'));
        fwaWorkGridStore = fwaWorkGrid.getStore();
        fwaWorkGridStore.sort([
            {
                property: 'workCodeId',
                direction: 'ASC'
            }
        ]);

        //filter duration store based on user settings
        durationStore = Ext.getStore('Duration');
        durationStore.clearFilter(true);
        durationStore.filterBy(function (obj) {
            return obj.get('value') % settings.schedTimeAxisGranularity == 0;
        });

        //sort hour && recurrence dates
        if (rec.get('recurrenceDatesInRange')) {
            rec.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
        }
        rec.set('unitDatesInRange', rec.get('recurrenceDatesInRange'));
        //sort unit dates
        if (rec.get('unitDatesInRange')) {
            rec.get('unitDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
        }
        //check next date
        if (rec.get('nextDate') < new Date('1/1/0001 12:30:00 AM')) {
            rec.set('nextDate', new Date());
        }
        unitsHoursDate = rec.get('nextDate') ? rec.get('nextDate') : new Date(); //rec.get('recurrenceDatesInRange') ? rec.get('recurrenceDatesInRange')[0] : new Date();

        if (unitsHoursDate)
            vw.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(unitsHoursDate), DATE_FORMAT));
        //turn on/off unit last & next buttons
        if (rec.get('unitDatesInRange') && rec.get('unitDatesInRange').length > 0) {
            currentIndex = 0;
            if (rec.get('unitDatesInRange').length == 1) {
                vw.lookup('lastUnitDate').setDisabled(true);
                vw.lookup('nextUnitDate').setDisabled(true);
            } else {
                datesInRange = record.get('unitDatesInRange').sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), 'm/d/Y');
                    var matches = (utcDate == Ext.Date.format(vw.lookup('unitDateHeader').getValue(), 'm/d/Y'));
                    if (matches && currentIndex === 1) {
                        vw.lookup('lastUnitDate').setDisabled(true);
                        vw.lookup('nextUnitDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == rec.get('recurrenceDatesInRange').length) {
                        vw.lookup('nextUnitDate').setDisabled(true);
                        vw.lookup('lastUnitDate').setDisabled(false);
                        return false;
                    }
                });
            }
        } else {
            vw.lookup('lastUnitDate').setDisabled(true);
            vw.lookup('nextUnitDate').setDisabled(true);
        }
        vm.set('unitCodeCount', unitCodeStore.getRange().length);
        Ext.each(rec.get('units').getRange(), function (unit) {
            unit.readOnly = true
        });
        //load fwa units
        fwaUnitGrid.setStore(rec.get('units'));
        fwaUnitGrid.isScheduler = isScheduler;
        fwaUnitStore = fwaUnitGrid.getStore();
        fwaUnitStore.sort([
            {
                property: 'unitDate',
                direction: 'ASC'
            },
            {
                property: 'unitSeq',
                direction: 'ASC'
            }
        ]);
        /*comment out below to display all */
        //clear any filters
        fwaUnitStore.clearFilter(true);
        //filter all
        if (!isCopy)
            fwaUnitStore.filterBy(function (unitRec) {
                return Ext.Date.format(new Date(unitRec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(vw.lookup('unitDateHeader').getValue()), DATE_FORMAT);
            });
        /*
        end comment out here
        be sure to change add new unit method & set unit date bar to hidden
        * */
        //sort recurrence dates
        if (rec.get('recurrenceDatesInRange')) {
            rec.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
        }
        //reset currentIndex
        currentIndex = 0;
        empHoursDate = rec.get('nextDate') ? rec.get('nextDate') : new Date(); //rec.get('recurrenceDatesInRange') ? rec.get('recurrenceDatesInRange')[0] : new Date();

        if (empHoursDate)
            vw.lookup('dateHeader').setValue(Ext.Date.format(new Date(empHoursDate), DATE_FORMAT));
        //changed from show-hide work date and date bar based on is recurring to all using date bar
        empHoursWorkDateColumn.setHidden(true);
        workCodeDateBar.setHidden(false);
        //turn on/off last & next buttons
        if (rec.get('recurrenceDatesInRange') && rec.get('recurrenceDatesInRange').length > 0) {
            if (rec.get('recurrenceDatesInRange').length == 1) {
                vw.lookup('lastDate').setDisabled(true);
                vw.lookup('nextDate').setDisabled(true);
            } else {
                datesInRange = record.get('recurrenceDatesInRange').sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });
                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), 'm/d/Y');
                    var matches = (utcDate == Ext.Date.format(vw.lookup('unitDateHeader').getValue(), 'm/d/Y'));
                    if (matches && currentIndex == 1) {
                        vw.lookup('lastDate').setDisabled(true);
                        vw.lookup('nextDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == rec.get('recurrenceDatesInRange').length) {
                        vw.lookup('nextDate').setDisabled(true);
                        vw.lookup('lastDate').setDisabled(false);
                        return false;
                    }
                });
            }
        } else {
            vw.lookup('lastDate').setDisabled(true);
            vw.lookup('nextDate').setDisabled(true);
        }
        //load employee hours to grid // skip if copy
        if (!isCopy)
            employeeHoursGrid.setStore(rec.get('hours'));
        employeeHoursGrid.isScheduler = isScheduler;
        empHoursStore = employeeHoursGrid.getStore();
        empHoursModel = empHoursStore.getModel();
        //load all dates
        // if (rec.get('recurrenceDatesInRange')) {
        //     Ext.each(empHoursStore.collect('empId'), function (emp) {
        //         empHoursStore.clearFilter(true);
        //         empHoursStore.filter('empId', emp);
        //         Ext.each(empHoursStore.collect('crewRoleId'), function (roleId) {
        //             empHoursStore.filter('crewRoleId', roleId);
        //             Ext.each(empHoursStore.collect('workCodeAbbrev'), function (workCodeAbbrev) {
        //                 empHoursStore.filter('workCodeAbbrev', workCodeAbbrev);
        //                 Ext.each(empHoursStore.getRange(), function (record) {
        //                     //iterate through recurrence dates
        //                     Ext.each(rec.get('recurrenceDatesInRange'), function (dt) {
        //                         empHoursStore.filter('workDate', new Date(dt));
        //                         if (empHoursStore.getRange().length === 0 && crewMembers.getById(emp)) {
        //                             empHoursStore.add(new empHoursModel({
        //                                 workDate: new Date(dt),
        //                                 empId: emp,
        //                                 crewRoleId: roleId,
        //                                 workCodeId: '',
        //                                 laborCode: record.get('laborCode'),
        //                                 workCodeAbbrev: workCodeAbbrev,
        //                                 ovt2Hrs: 0,
        //                                 ovtHrs: 0,
        //                                 regHrs: 0,
        //                                 travelHrs: 0,
        //                                 modified: ''
        //                             }));
        //                         }
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // }
        //clear any filters
        empHoursStore.clearFilter(true);
        //filter all
        if (!isCopy)
            empHoursStore.filterBy(function (wcRec) {
                fwaRecord = Ext.first('#fwaForm').getRecord();
                return Ext.Date.format(new Date(wcRec.get('workDate')), 'm/d/Y') === Ext.Date.format(new Date(vw.lookup('dateHeader').getValue()), 'm/d/Y');
            });
        else {
            Ext.each(empHoursStore.getRange(), function (dt) {
                //console.log(dt);
                dt.set('regHrs', 0);
                dt.set('ovtHrs', 0);
                dt.set('ovt2Hrs', 0);
                dt.set('travelHrs', 0);
                dt.set('comment', '');
            });
        }
        empHoursStore.addFilter({
            filterFn: function (record) {
                return record.get('modified') !== 'D';
            }
        });
        // Load the address fieldset
        loc = rec.get('loc');
        if (loc) {
            form.setValues(rec.get('loc'));
        }
        //Load Expenses
        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.exp.Expense'
        });

        if (rec.get('expenses')) {
            store.loadData(rec.get('expenses'));
            store.addFilter({
                filterFn: function (record) {
                    return record.get('modified') !== 'D';
                }
            });
            employeeExpensesGrid.setStore(store);
            rec.set('expenses', store.getData());
        } else {
            employeeExpensesGrid.setStore(store);
        }

        //Clear out default dates if still in create status
        if (rec.get('fwaStatusId') == FwaStatus.Create) {
            me.lookup('schedStartDateField').setValue('');
            me.lookup('schedEndDateField').setValue('');
            me.lookup('schedStartTimeField').setValue('');
            me.lookup('schedEndTimeField').setValue('');
        }

        if (rec.get('dateRequired') < new Date('1/1/2010 12:30:00 AM')) {
            me.lookup('dateRequiredField').setValue('');
        }
        if (rec.get('dateOrdered') < new Date('1/1/2010 12:30:00 AM')) {
            me.lookup('dateOrderedField').setValue('');
        }

        if (rec.get('udf_d1') < new Date('1/1/2010 12:30:00 AM')) {
            me.lookup('udf_d1_field').setValue('');
        }
        if (rec.get('udf_d2') < new Date('1/1/2010 12:30:00 AM')) {
            me.lookup('udf_d2_field').setValue('');
        }
        if (rec.get('udf_d3') < new Date('1/1/2010 12:30:00 AM')) {
            me.lookup('udf_d3_field').setValue('');
        }

        // Reset approval signatures
        me.fireEvent('resetSignatures');

        // Load the approval signature field using attachments array from FWA
        if (rec.get('attachments') && rec.get('attachments').length > 0) {

            // Load the client signature field
            clientSignature = Ext.Array.findBy(rec.get('attachments'), function (attachment) {
                return Ext.String.capitalize(attachment.attachmentType) == AttachmentType.ClientSignature;
            });
            Ext.each(rec.get('attachments'), function (attachment) {
                if (Ext.String.capitalize(attachment.attachmentType) == AttachmentType.ClientSignature) {
                    clientSignatureCt++;
                }
            });

            me.showSignature(clientSignature, AttachmentType.ClientSignature, clientSignatureCt);

            // Load the chief signature field
            chiefSignature = Ext.Array.findBy(rec.get('attachments'), function (attachment) {
                return Ext.String.capitalize(attachment.attachmentType) == AttachmentType.EmpSignature;
            });
            Ext.each(rec.get('attachments'), function (attachment) {
                if (Ext.String.capitalize(attachment.attachmentType) == AttachmentType.EmpSignature) {
                    chiefSignatureCt++;
                }
            });

            me.showSignature(chiefSignature, AttachmentType.EmpSignature, chiefSignatureCt);
        }
        //set time duration sometimes does not show so force a call
        me.onTimeChange(this);
    },

    lastDate: function () {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            record = vw.getRecord(),
            hoursGrid = me.lookup('employeeHoursGrid'),
            store = hoursGrid.getStore(),
            model = store.getModel(),
            vm = me.getViewModel(),
            lastDt = vw.lookup('dateHeader').getValue(),
            datesInRange = record.get('recurrenceDatesInRange') ? record.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(b) - new Date(a);
            }) : [],
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
            if (new Date(Ext.Date.format(new Date(utcDate), 'm/d/Y')) < new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), 'm/d/Y');
                hasLastDate = true;
                return false;
            }
        });
        //check if date found
        if (hasLastDate) {
            store.clearFilter(true);
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }
        if (nextDate)
            vw.lookup('dateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        else
            vw.lookup('dateHeader').setValue(Ext.Date.format(new Date(), DATE_FORMAT));
        //turn arrows on/off
        vw.lookup('lastDate').setDisabled(currentIndex == dateArrayLength);
        vw.lookup('nextDate').setDisabled(false);
    },

    nextDate: function () {
        var me = this,
            vw = me.getView(),
            record = vw.getRecord(),
            hoursGrid = me.lookup('employeeHoursGrid'),
            store = hoursGrid.getStore(),
            model = store.model,
            vm = me.getViewModel(),
            lastDt = vw.lookup('dateHeader').getValue(),
            datesInRange = record.get('recurrenceDatesInRange') ? record.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            }) : [],
            crewStore = Ext.getStore('AllCrews').getById(record.get('scheduledCrewId')),
            crewMembers = crewStore ? crewStore.get('crewMembers') : '',
            nextDate = '',
            utcDate,
            hasNextDate = false,
            currentIndex = 0,
            settings = TS.app.settings,
            dateArrayLength = datesInRange.length;

        //go forward in dates
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
            store.clearFilter(true);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
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
                    property: 'crewRoleId',
                    direction: 'ASC'
                }
            ]);
        }
        if (nextDate)
            vw.lookup('dateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        else
            vw.lookup('dateHeader').setValue(Ext.Date.format(new Date(), DATE_FORMAT));
        //turn arrows on/off
        vw.lookup('nextDate').setDisabled(currentIndex == dateArrayLength);
        vw.lookup('lastDate').setDisabled(false);
    },

    addWorkDate: function () {
        var me = this,
            addWorkDateWindow,
            dateHeader = Ext.first('#dateHeader');

        if (me.addWorkDateWindow) {
            me.addWorkDateWindow.close();
        }

        addWorkDateWindow = Ext.create('TS.view.fwa.AddWorkDate', {});
        Ext.first('#addWorkDateField').setValue(new Date(dateHeader.getValue()));
        addWorkDateWindow.show();
    },
    /*
     * turn all on
     * */
    setFormRead: function () {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            toolbar = vw.lookup('fwaToolbar'),
            record = vw.getRecord(),
            form = vw.getForm(),
            settings = TS.app.settings;
        //enable time fields
        Ext.Array.each(vw.query('timefield'), function (time) {
            time.setReadOnly(false);
        });
        //enable grids
        Ext.Array.each(vw.query('grid'), function (grid) {
            grid.on('beforeedit', function () {
                return true;
            });
        });
        Ext.first('grid-unit').setDisabled(false);
        Ext.first('grid-workauth').setDisabled(false);
        Ext.first('grid-employeehours').setDisabled(false);
        //enable work code & employee hours image buttons
        Ext.Array.each(vw.query('actioncolumn'), function (column) {
            Ext.Array.each(column.items, function (item) {
                //only turn on delete action
                if (item.handler == 'deleteWorkItem' || item.handler == 'deleteEmployeeHours')
                    item.disabled = false;
            });
        });
        //disable Approval buttons
        vw.lookup('fwaClientApprovalFieldset').lookup('addSignatureButton').setDisabled(false);
        vw.lookup('fwaChiefApprovalFieldset').lookup('addSignatureButton').setDisabled(false);
        //enable mapping
        Ext.first('#mapLocationBtn').setHidden(false);
        // Set form fields as read
        vw.getForm().getFields().each(function (field) {
            field.setReadOnly(false);
        });
        // enable any buttons
        Ext.Array.each(vw.query('button'), function (button) {
            button.setDisabled(false);
        });
        //enable toolbar buttons
        vw.lookup('fwaInstructionsButton').setDisabled(false);
        // if (Ext.first('#toggleWorkButton'))
        //     Ext.first('#toggleWorkButton').setHidden(vm.get('isScheduler') || !settings.fwaDisplayStartButton);
        vw.lookup('fwaSubmitButton').setHidden(false);
        //vw.lookup('fwaApproveButton').setHidden(false);
        vw.lookup('showAttachDocButton').setHidden(false);
        vw.lookup('showAttachPhotoButton').setHidden(false);
        //vw.lookup('actionsButton').setHidden(false);
        vw.lookup('crewButton').setHidden(!me.getViewModel().get('isSchedulerOrNewFwa') && !settings.fwaReadOnly);
        vw.lookup('fwaSaveButton').setHidden(false);
        vw.lookup('fwaUpdateButton').setHidden(false);
    },
    /*
     * Sets the FWA form as read only
     */
    setFormReadOnly: function (isSearch) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            toolbar = vw.lookup('fwaToolbar'),
            record = vw.getRecord(),
            settings = TS.app.settings;

        //disable time fields
        Ext.Array.each(vw.query('timefield'), function (time) {
            time.setReadOnly(true);
        });
        //disable grids
        Ext.Array.each(me.getView().query('grid'), function (grid) {
            grid.on('beforeedit', function () {
                return false;
            });
        });
        //disable work code PIC REQUIRED
        Ext.Array.each(me.getView().query('checkcolumn'), function (column) {
            if (column.dataIndex == 'picRequired') {
                column.disabled = true;
            }
        });
        //disable work code & employee hours image buttons
        Ext.Array.each(me.getView().query('actioncolumn'), function (column) {
            Ext.Array.each(column.items, function (item) {
                //only turn off delete action
                item.disabled = item.handler == 'deleteWorkItem' || item.handler == 'deleteEmployeeHours' || item.handler == 'deleteUnit';
            });
        });
        //disable Approval buttons
        me.getView().lookup('fwaClientApprovalFieldset').lookup('addSignatureButton').setDisabled(true);
        me.getView().lookup('fwaChiefApprovalFieldset').lookup('addSignatureButton').setDisabled(true);
        //disable mapping
        Ext.first('#mapLocationBtn').setHidden(true);
        // Set form fields as read only
        me.getView().getForm().getFields().each(function (field) {
            field.setReadOnly(true);
        });
        // Disable any buttons
        Ext.Array.each(me.getView().query('button'), function (button) {
            if (button.reference != 'lastDate' && button.reference != 'nextDate') {
                button.setDisabled(true);
            }
        });
        //turn on certain buttons
        vw.lookup('fwaInstructionsButton').setDisabled(false);
        Ext.first('#showTimesheetExternalButton').setDisabled(false);
        Ext.first('#showPrintButton').setDisabled(false);
        Ext.first('#showEmailWindowButton').setDisabled(false);
        //pic/doc buttons set to View
        Ext.first('#showAttachPhotoButton').setDisabled(false);
        Ext.first('#showAttachDocButton').setDisabled(false);
        Ext.first('#searchButton').setDisabled(false);
        //if Chief, turn on more buttons
        if (me.checkForCrewChief(record, settings.empId) && !settings.schedReadOnly && !settings.fwaReadOnly) {
            //Ext.first('#showAttachPhotoButton').setDisabled(false);
            Ext.first('#searchButton').setDisabled(false);
            //Ext.first('#showAttachDocButton').setDisabled(false);
            Ext.first('#actionsButton').setDisabled(false);
            vw.lookup('fwaClientApprovalFieldset').setDisabled(false);
            vw.lookup('fwaClientApprovalFieldset').setDisabled(false);
        }
        if (isSearch && !settings.schedReadOnly && !fwaReadOnly) {
            me.getView().lookup('fwaToolbar').setHidden(true);
        }
        if (record.get('fwaApprovers').indexOf(settings.empId) !== -1 && !settings.schedReadOnly && !settings.fwaReadOnly) {
            vw.lookup('fwaApproveButton').setDisabled(false);
        }

        if (vm.get('isScheduler')
            && !settings.schedReadOnly
            && !settings.fwaReadOnly
            && record.get('fwaApprovers').indexOf(settings.empId) !== -1
            && !record.get('fwaApproversCanModify')
            && record.get('fwaStatusId') == FwaStatus.Submitted) {
            vw.lookup('fwaApproveButton').setDisabled(false);
            vw.lookup('searchButton').setDisabled(false);
            vw.lookup('doCopyFwaButton').setDisabled(false);
            if (vw.lookup('doOpenFwaButton'))
                vw.lookup('doOpenFwaButton').setDisabled(false);
        }
    },

// Creates a model instance and loads an FWA directly from the proxy using the specified ID
    loadRemoteFwa: function (id, fwaDate, success) {
        var me = this,
            vm = me.getViewModel(),
            form = me.getView(),
            myForm = form.getForm(),
            wbs1 = me.lookup('fwawbs1id'),
            wbs2 = me.lookup('fwawbs2id'),
            wbs3 = me.lookup('fwawbs3id'),
            settings = TS.app.settings;
        //reset form to clear all old values
        me.onResetForm();
        me.setFormRead();

        if (fwaDate < new Date('1/1/2002')) {
            fwaDate = new Date();
        }
        TS.model.fwa.Fwa.getProxy().setExtraParams({
            fwaDate: Ext.Date.format(fwaDate, 'Ymd')
        });

        TS.model.fwa.Fwa.load(id, {
            success: function (record) {
                // //suspend change event so method not called repeatedly
                // myForm.getFields().each(function (item, index, length) {
                //     item.suspendCheckChange++;
                // });

                if (record.get('schedStartDate') < new Date('1/1/2002') || (!record.get('scheduledCrewId') && !record.get('recurrenceConfig'))) {
                    record.set('schedStartDate', '');
                }
                //TBD rework
                if ((record.get('unitDatesInRange') && record.get('unitDatesInRange').length == 1)) {
                    Ext.each(record.data.units.getRange(), function (unit) {
                        unit.set('unitDate', record.get('schedStartDate') ? record.get('schedStartDate') : new Date());
                    });
                }

                if (!record.get('scheduledCrewId') && !record.get('recurrenceConfig')) {
                    record.set('duration', 0);
                }
                if (record.get('udf_d1') < new Date('1/1/2002')) {
                    record.set('udf_d1', '');
                }
                if (record.get('udf_d2') < new Date('1/1/2002')) {
                    record.set('udf_d2', '');
                }
                if (record.get('udf_d3') < new Date('1/1/2002')) {
                    record.set('udf_d3', '');
                }

                wbs1.clearValue();
                wbs2.clearValue();
                wbs3.clearValue();
                vm.set('newFwa', false);
                me.reloadUnitCodeStore(record);
                //me.loadFwaRecord(record);
                // //suspend change event so method not called repeatedly
                // myForm.getFields().each(function (item, index, length) {
                //     item.suspendCheckChange--;
                // });

                myForm.dirty = false;
                me.setUdfFields();
                //since we have duplicate names for udf_t values we need to assign value if combos
                if (settings.udf_t1_isCombo) {
                    me.lookup('udf_t1_combo').setValue(record.get('udf_t1'));
                }
                if (settings.udf_t2_isCombo) {
                    me.lookup('udf_t2_combo').setValue(record.get('udf_t2'));
                }
                if (settings.udf_t3_isCombo) {
                    me.lookup('udf_t3_combo').setValue(record.get('udf_t3'));
                }
                if (settings.udf_t4_isCombo) {
                    me.lookup('udf_t4_combo').setValue(record.get('udf_t4'));
                }
                if (settings.udf_t5_isCombo) {
                    me.lookup('udf_t5_combo').setValue(record.get('udf_t5'));
                }
                if (settings.udf_t6_isCombo) {
                    me.lookup('udf_t6_combo').setValue(record.get('udf_t6'));
                }
                if (settings.udf_t7_isCombo) {
                    me.lookup('udf_t7_combo').setValue(record.get('udf_t7'));
                }
                if (settings.udf_t8_isCombo) {
                    me.lookup('udf_t8_combo').setValue(record.get('udf_t8'));
                }
                if (settings.udf_t9_isCombo) {
                    me.lookup('udf_t9_combo').setValue(record.get('udf_t9'));
                }
                if (settings.udf_t10_isCombo) {
                    me.lookup('udf_t10_combo').setValue(record.get('udf_t10'));
                }
                //me.lookup('fwaDayCount').setValue(record.get('recurrenceDatesInRange').length);
                if (record.get('recurrenceConfig') && !record.get('scheduledCrewId')) {
                    settings.noCrew = true;
                    //if no crew we need to just open recurrence and close (click) so it populates fields
                    me.onFwaRecurrsion(record);
                    setTimeout(function () {
                        Ext.first('#OKbutton').click();
                    }, 500);
                }
                record.set('unitDatesInRange', record.get('recurrenceDatesInRange'));
            },
            failure: function (record, operation) {
                Ext.GlobalEvents.fireEvent('Error', operation);
            },
            callback: function (record) {
                me.getView().setLoading(false);
            },
            scope: me
        });

    },

    setUdfFields: function () {
        var me = this,
            vm = me.getViewModel(),
            form = me.getView();
        //hide rows if all
        if (vm.get('hideUdf_t8_text') && vm.get('hideUdf_t9_text') && vm.get('hideUdf_t10_text') &&
            vm.get('hideUdf_t8_combo') && vm.get('hideUdf_t9_combo') && vm.get('hideUdf_t10_combo')) {
            form.lookup('udfRowThree').setHeight(0);
            form.lookup('udfRowThree').setHidden(true);
        }
        if (vm.get('hideUdf_t5_text') && vm.get('hideUdf_t6_text') && vm.get('hideUdf_t7_text' &&
            vm.get('hideUdf_t5_combo') && vm.get('hideUdf_t6_combo') && vm.get('hideUdf_t7_combo'))) {
            form.lookup('udfRowTwo').setHeight(0);
            form.lookup('udfRowTwo').setHidden(true);
        }
        if (vm.get('hideUdf_t2_text') && vm.get('hideUdf_t3_text') && vm.get('hideUdf_t4_text') &&
            vm.get('hideUdf_t2_combo') && vm.get('hideUdf_t3_combo') && vm.get('hideUdf_t4_combo')) {
            form.lookup('udfRowOne').setHeight(0);
            form.lookup('udfRowOne').setHidden(true);
        }

        form.show().expand();
    },

    saveFwaAddress: function () {
        var form = this.getView().getForm(),
            settings = TS.app.settings,
            data = Ext.clone(form.getRecord().data),
            address = data.loc;

        Fwa.SaveFwaLocation(null, settings.username, data.fwaId, address, function () {
            //commented out for now
            //Ext.GlobalEvents.fireEvent('Message:Code', 'fwaAddressSuccess');
        }, this, {
            autoHandle: true
        });

    },

    setLocationAddress: function () {
        var form = this.getView().getForm(),
            record = form.getRecord(),
            loc = record.get('loc'),
            hasValues = (loc.address1 || loc.address2 || loc.city || loc.state || loc.country || loc.latitude || loc.longitude || loc.zip);

        if (!hasValues && Ext.isIE) {
            Ext.Msg.alert('Warning', 'IE/Edge requires an entry for at least a State, Postal/Zip Code, Latitude/Longitude, Address or combination there of.');
            return false;
        }

        //form.updateRecord();
        Ext.create('TS.view.fwa.FwaMap', {
            fwaRecord: form.getRecord(),
            draggablePin: true,
            modal: true,
            isSingleFwa: true
        }).show();

    },

    onUdfComboChange: function (cb, newValue, oldValue) {
        var me = this,
            vm = me.getViewModel(),
            form = me.getView().getForm(),
            record = form.getRecord();
        record.set(cb.name, newValue);
    },

    onScheduledByChanged: function (field, newValue, oldValue) {
        var me = this,
            vm = me.getViewModel(),
            form = me.getView().getForm(),
            preparedBy = me.lookup('preparedByEmpIdField').getValue(),
            record = form.getRecord();
        record.set('preparedByEmpId', preparedBy);
    },

    checkDateDiff: function (startDate, schedVisibleHoursStart) {
        var sched = new Date(),
            start = new Date();
        sched.setHours(schedVisibleHoursStart.getHours());
        sched.setMinutes(schedVisibleHoursStart.getMinutes());
        sched.setSeconds(schedVisibleHoursStart.getSeconds());

        if (!startDate) return true;

        start.setHours(startDate.getHours());
        start.setMinutes(startDate.getMinutes());
        start.setSeconds(startDate.getSeconds());

        return sched > start;
    },

    updateFwaForm: function (button, event) {
        var me = this,
            settings = TS.app.settings;
        settings.isFwaUpdate = true;
        settings.fwaIsDirty = false;
        settings.schedulerNeedsRefresh = true;
        settings.crewAssignNeedsRefresh = true;
        settings.employeeGanttNeedsRefresh = true;
        settings.crewTaskNeedsRefresh = true;
        settings.fwaListNeedsRefresh = true;
        me.saveFwaForm(button, event);
    },

// Saves an FWA
// Bound to the FWA form save button
//checks FWA start/end datetimes
//calls saveFwaFormConfirm
    saveFwaForm: function (button, event) {
        var me = this,
            vm = me.getViewModel(),
            form = me.getView().getForm(),
            record = form.getRecord(),
            startTime = me.lookup('schedStartTimeField').getValue(),
            endTime = me.lookup('schedEndTimeField').getValue(),
            startDate = me.lookup('schedStartDateField').getValue(),
            endDate = me.lookup('schedEndDateField').getValue(),
            crewName = me.lookup('scheduledCrewNameDisplay').getValue(),
            preparedBy = me.lookup('preparedByEmpIdField').getValue(),
            settings = TS.app.settings,
            isScheduler = vm.get('isScheduler'),
            wcGridRowCt = Ext.first('grid-workauth').getStore().getRange.length,
            startTimeGreater = me.checkDateDiff(startDate, settings.schedVisibleHoursStart),
            startDateHoursStart = Ext.Date.format(new Date(startDate), 'H:i:s'),
            isRecurrence = record.get('recurrencePattern'),
            ttlHours = 0,
            ttlUnits = 0,
            myMessage = '',
            noWorkCode = false,
            wbs1Field = me.lookup('fwawbs1id'),
            wbs2Field = me.lookup('fwawbs2id'),
            wbs3Field = me.lookup('fwawbs3id');

        settings.fwaIsDirty = false;

        if (wbs1Field.getSelectedRecord() && wbs1Field.getSelectedRecord().data.wbs2Required) {
            if (!wbs2Field.getSelectedRecord() && !wbs2Field.getValue()) {
                Ext.Msg.alert('Warning', settings.wbs2Label + ' selection is required');
                return;
            }
        }
        if (wbs2Field.getSelectedRecord() && wbs2Field.getSelectedRecord().data.wbs3Required) {
            if (!wbs3Field.getSelectedRecord() && !wbs3Field.getValue()) {
                Ext.Msg.alert('Warning', settings.wbs3Label + ' selection is required ');
                return;
            }
        }

        //wbs1Field.getSelectedRecord().data.wbs2Required
        //wbs2Field.getSelectedRecord().data.wbs3Required
        //clear attachments - only used when coming FROM backend
        record.set('attachments', []);
        //check start end dates & times
        if (startDate && endDate && !isRecurrence) {
            if (Date(Ext.Date.format(startDate, DATE_FORMAT)) > Date(Ext.Date.format(endDate, DATE_FORMAT))) {
                Ext.Msg.alert('Warning', 'Start Date must be less than or equal to End Date.');
                return;
            }
            if (startTime && endTime && Ext.Date.format(startDate, DATE_FORMAT) == Ext.Date.format(endDate, DATE_FORMAT)) {
                if (Ext.Date.format(startTime, 'H:i:s') > Ext.Date.format(endTime, 'H:i:s') && Date(Ext.Date.format(startDate, DATE_FORMAT)) === Date(Ext.Date.format(endDate, DATE_FORMAT))) {
                    Ext.Msg.alert('Warning', 'Start Time must be less than End Time.');
                    return;
                }
            } else if (!startTime && !endTime) {
                Ext.Msg.alert('Warning', 'Start Time and End Time are required fields');
                return;
            } else if (startTime && !endTime) {
                Ext.Msg.alert('Warning', 'End Time is a required field');
                return;
            } else if (!startTime && endTime) {
                Ext.Msg.alert('Warning', 'Start Time is a required field');
                return;
            }
        } else if (!startDate && endDate) {
            Ext.Msg.alert('Warning', 'Start Date is a required field');
            return;
        } else if (startDate && !endDate) {
            Ext.Msg.alert('Warning', 'End Date is a required field');
            return;
        }

        if (!preparedBy && !record.get('preparedByEmpId')) {
            Ext.Msg.alert('Warning', 'Scheduled By is a required field.');
            return;
        }

        Ext.each(Ext.first('grid-workauth').getStore().getRange(), function (wc) {
            if (!wc.get('workCodeId')) {
                noWorkCode = true;
            }
        });

        if (noWorkCode) {
            Ext.Msg.alert('Warning', 'All ' + settings.workCodeLabelPlural + ' require a code to be selected. Either select a code or delete row to continue');
            return;
        }

        if (record.get('fwaStatusId') == FwaStatus.Create || vm.get('newFwa')) { //and/or Unit quantities
            myMessage += 'Employee Hours may not be entered into an unscheduled ' + settings.fwaAbbrevLabel + '.';
        } else {
            myMessage += settings.fwaAbbrevLabel + 's with hours entered cannot be unscheduled.'; //or unit quantities
        }
        //format wc start/end time

        Ext.each(record.get('hours').getRange(), function (obj) {
            if (!obj.get('startTime'))
                obj.set('startTime', new Date('2000-01-01T00:00:00'));

            if (!obj.get('endTime'))
                obj.set('endTime', new Date('2000-01-01T00:00:00'));
        });

        if (!startDate && !endDate) {
            //check if any hours/units entered
            Ext.each(record.get('hours').getRange(), function (obj) {
                ttlHours += (obj.get('ovtHrs') + obj.get('ovt2Hrs') + obj.get('regHrs') + obj.get('travelHrs'));
            });
            // Ext.each(record.get('units').getRange(), function (obj) {
            //     ttlUnits += obj.get('quantity');
            // });

            if (ttlHours > 0) { // || ttlUnits > 0
                Ext.Msg.show({
                    title: 'Warning',
                    message: myMessage,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                return false;
            }
        }

        if (vm.get('newFwa')) {
            if (!isScheduler) {
                if (!startDate || !endDate || !startTime || !endTime || !crewName || wcGridRowCt == 0) {
                    Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' ' + settings.crewLabel + ', ' + settings.workCodeLabelPlural + ', Start Date/Time and End Date/Time are required fields when creating a new ' + settings.fwaAbbrevLabel + '.');
                    me.getView().setLoading(false);
                    return;
                }
            }
        }

        // check for required fields
        if (settings.fwaAutoNumbering && me.lookup('fwaNameField').getValue() == '') {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' Name is a required field.');
            me.getView().setLoading(false);
            return;
        } else if (!settings.fwaAutoNumbering && (me.lookup('fwaNumField').getValue() == '')) {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + '# is a required field.');
            me.getView().setLoading(false);
            return;
        } else if (!settings.fwaAutoNumbering && me.lookup('fwaNameField').getValue() == '') {
            Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + 'Name is a required field.');
            me.getView().setLoading(false);
            return;
        }

        //check start time against group calendar start time
        if (startDate && startTimeGreater && isScheduler && startTime) {
            var checkTime = Ext.Date.format(startTime, 'g:i A'),
                schedStartTime = Ext.Date.format(settings.schedVisibleHoursStart, 'g:i A');

            Ext.Msg.confirm('Please Confirm', 'Start time (' + checkTime + ') is earlier than visible start time (' + schedStartTime + ') on calendar, do you wish to continue? ', function (btn) {
                if (btn == 'yes') {
                    me.checkForRemovedStatus(record, button, event);
                } else {
                    me.getView().setLoading(false);
                }
            });

        } else {
            me.checkForRemovedStatus(record, button, event);
        }
    },

    checkForRemovedStatus: function (record, button, event) {
        var me = this;
        if (record.get('fwaStatusId') === FwaStatus.Removed) {
            Ext.Msg.confirm('Please Confirm', 'Do you wish to reset the \'Remove\' status back to \'Saved\'?', function (btn) {
                if (btn == 'yes') {
                    record.set('fwaStatusId', FwaStatus.Saved);
                    me.saveFwaFormContinue(button, event);
                } else {
                    me.saveFwaFormContinue(button, event);
                }
            });
        } else {
            me.saveFwaFormContinue(button, event);
        }
    },

    saveFwaFormContinue: function (button, event) {
        // Start start/end dates
        var me = this,
            startTime = me.lookup('schedStartTimeField').getValue(),
            endTime = me.lookup('schedEndTimeField').getValue(),
            startDate = me.lookup('schedStartDateField').getValue(),
            endDate = me.lookup('schedEndDateField').getValue(),
            settings = TS.app.settings,
            startTimeSame = Ext.Date.format(settings.schedVisibleHoursStart, 'H:i:s') == Ext.Date.format(startTime, 'H:i:s'),
            endTimeSame = Ext.Date.format(settings.schedVisibleHoursEnd, 'H:i:s') == Ext.Date.format(endTime, 'H:i:s');

        //warn if times entered but no dates
        if ((startTime && !startTimeSame && !startDate) || (endTime && !endTimeSame && !endDate)) {
            me.__button = button;
            me.__event = event;

            Ext.Msg.confirm('Please Confirm',
                'When ' + settings.fwaAbbrevLabel + ' start and/or end times are entered, dates should also be entered. Do you want to continue (entered times will be ignored)?',
                me.onSaveConfirm, //the button callback
                me); //scope
            var window = Ext.WindowManager.getActive();
            window.el.setZIndex(1100000); //TODO ?

            return false;
        } else {
            me.saveFwaFormConfirm(button, event);
        }
    },

    onSaveConfirm: function (btn) {
        var me = this;
        if (btn === 'yes') {
            me.saveFwaFormConfirm(me.__button, me.__event);
        }
    },

    checkFwaHoursTotal: function (empHours) {
        var ttlHrs = 0;
        Ext.each(empHours, function (emp) {
            ttlHrs += emp.regHrs + emp.ovtHrs + emp.ovt2Hrs + emp.travelHrs;
        });

        return ttlHrs;
    },

    checkDailyTtlHours: function (empHours) {
        var empList = [],
            dayList = [],
            ttlHrs = 0,
            tempValue,
            settings = TS.app.settings,
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

// Saves an FWA
// Bound to the FWA form save button
    saveFwaFormConfirm: function (button) {
        Ext.GlobalEvents.fireEvent('Loadmask', this.getView(), 'savingFwa');
        // Get the form and record reference
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            form = me.getView().getForm(),
            record = form.getRecord(),
            fwaCall = button.getReference(),
            isNew = me.getViewModel().get('newFwa'),
            startTime = me.lookup('schedStartTimeField').getValue(),
            endTime = me.lookup('schedEndTimeField').getValue(),
            startDate = me.lookup('schedStartDateField').getValue(),
            endDate = me.lookup('schedEndDateField').getValue(),
            settings = TS.app.settings,
            isScheduler = me.getViewModel().get('isScheduler'),
            dateOrdered = me.lookup('dateOrderedField').getValue(),
            dateRequired = me.lookup('dateRequiredField').getValue(),
            udf_d1 = me.lookup('udf_d1_field').getValue(),
            udf_d2 = me.lookup('udf_d2_field').getValue(),
            udf_d3 = me.lookup('udf_d3_field').getValue(),
            regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            match,
            data = null,
            wcStore = null,
            wcId,
            end = null,
            actionList,
            obj,
            rec,
            fwawbs1id = Ext.first('#fwawbs1id'),
            fwawbs2id = Ext.first('#fwawbs2id'),
            fwawbs3id = Ext.first('#fwawbs3id'),
            fwaUnitGrid = Ext.first('grid-unit'),
            items = form.getFields().items;

        //if start/end dates set & has crew, then work codes required
        if (startDate && endDate && record.get('scheduledCrewId') && record.get('workSchedAndPerf').getRange().length == 0) {
            Ext.Msg.alert('Warning', 'At least one(1) ' + settings.workCodeLabel + ' entry is required when start/end date & crew entered.');
            me.getView().setLoading(false);
            return false;
        }
        //if in field & have start/end date & employee hours; then a crew is required
        if (!isScheduler && vm.get('newFwa') && startDate && endDate && record.get('hours').getRange().length > 0 && !record.get('scheduledCrewId')) {
            Ext.Msg.alert('Warning', 'A ' + settings.crewLabel + ' selection is required when start/end date & employee hours are entered.');
            me.getView().setLoading(false);
            return false;
        }
        // Update the record from the form
        // If it does not exist, create it from the values
        if (!record) {
            form._record = Ext.create('TS.model.fwa.Fwa', {availableForUseInField: settings.availableForUseInField});
            record = form._record;
        }

        form.updateRecord();

        if (startTime && startDate) {
            Sch.util.Date.copyTimeValues(startDate, startTime);
            record.data.schedStartDate = new Date(startDate);
        } else {
            // Set to Date min value
            record.data.schedStartDate = new Date('1/1/0001 12:00:00 AM');
        }

        if (endTime && endDate) {
            Sch.util.Date.copyTimeValues(endDate, endTime);
            record.data.schedEndDate = endDate;
        } else {
            // Set to Date min value
            record.data.schedEndDate = new Date('1/1/0001 12:00:00 AM');
        }

        if (endDate && startDate) {
            end = me.lookup('schedEndTimeField');
            if (endDate == startDate)
                if (endTime < startTime) {
                    end.setValidation('End time must be greater that start time.');
                } else {
                    end.setValidation(true);
                }
        }

        if (record.get('dateOrdered') == null || record.get('dateOrdered') <= new Date('1/1/0001 12:30:00 AM')) {
            record.data.dateOrdered = new Date('1/1/2001 12:00:00 AM');
        }
        if (record.get('dateRequired') == null || record.get('dateRequired') <= new Date('1/1/0001 12:30:00 AM')) {
            record.data.dateRequired = new Date('1/1/2001 12:00:00 AM');
        }

        if (record.get('udf_d1') == null || record.get('udf_d1') <= new Date('1/1/0001 12:30:00 AM')) {
            record.data.udf_d1 = new Date('1/1/2001 12:00:00 AM');
        }
        if (record.get('udf_d2') == null || record.get('udf_d2') <= new Date('1/1/0001 12:30:00 AM')) {
            record.data.udf_d2 = new Date('1/1/2001 12:00:00 AM');
        }
        if (record.get('udf_d3') == null || record.get('udf_d3') <= new Date('1/1/0001 12:30:00 AM')) {
            record.data.udf_d3 = new Date('1/1/2001 12:00:00 AM');
        }

        if (!TS.Util.isValidDate(record.get('lastSubmittedDate')) || !record.get('lastSubmittedDate') || record.get('lastSubmittedDate') <= new Date('1/1/0001 12:30:00 AM')) {
            record.data.lastSubmittedDate = new Date('1/1/2001 12:00:00 AM');
        }
        if (!TS.Util.isValidDate(record.get('lastApprovedDate')) || !record.get('lastApprovedDate') || record.get('lastApprovedDate') <= new Date('1/1/0001 12:30:00 AM')) {
            record.data.lastApprovedDate = new Date('1/1/2001 12:00:00 AM');
        }
        //if not recurring set to schedStartDate, else leave as is
        if (!record.get('nextDate'))
            record.set('nextDate', TS.common.Util.getOutUTCDate(record.get('schedStartDate')));
        else
            record.set('nextDate', TS.common.Util.getOutUTCDate(record.get('nextDate')));

        //manipulate duplicate UDF_T1 values (have both textBox and combo Box) leaves a comma
        record.set('udf_t1', me.lookup('udf_t1_combo').getValue() ? me.lookup('udf_t1_combo').getValue() : me.lookup('udf_t1_text').getValue());
        record.set('udf_t2', me.lookup('udf_t2_combo').getValue() ? me.lookup('udf_t2_combo').getValue() : me.lookup('udf_t2_text').getValue());
        record.set('udf_t3', me.lookup('udf_t3_combo').getValue() ? me.lookup('udf_t3_combo').getValue() : me.lookup('udf_t3_text').getValue());
        record.set('udf_t4', me.lookup('udf_t4_combo').getValue() ? me.lookup('udf_t4_combo').getValue() : me.lookup('udf_t4_text').getValue());
        record.set('udf_t5', me.lookup('udf_t5_combo').getValue() ? me.lookup('udf_t5_combo').getValue() : me.lookup('udf_t5_text').getValue());
        record.set('udf_t6', me.lookup('udf_t6_combo').getValue() ? me.lookup('udf_t6_combo').getValue() : me.lookup('udf_t6_text').getValue());
        record.set('udf_t7', me.lookup('udf_t7_combo').getValue() ? me.lookup('udf_t7_combo').getValue() : me.lookup('udf_t7_text').getValue());
        record.set('udf_t8', me.lookup('udf_t8_combo').getValue() ? me.lookup('udf_t8_combo').getValue() : me.lookup('udf_t8_text').getValue());
        record.set('udf_t9', me.lookup('udf_t9_combo').getValue() ? me.lookup('udf_t9_combo').getValue() : me.lookup('udf_t9_text').getValue());
        record.set('udf_t10', me.lookup('udf_t10_combo').getValue() ? me.lookup('udf_t10_combo').getValue() : me.lookup('udf_t10_text').getValue());
        //address fields
        record.set('udf_a1', me.lookup('udf_a1_combo').getValue() ? me.lookup('udf_a1_combo').getValue() : me.lookup('udf_a1_text').getValue());
        record.set('udf_a2', me.lookup('udf_a2_combo').getValue() ? me.lookup('udf_a2_combo').getValue() : me.lookup('udf_a2_text').getValue());
        record.set('udf_a3', me.lookup('udf_a3_combo').getValue() ? me.lookup('udf_a3_combo').getValue() : me.lookup('udf_a3_text').getValue());
        record.set('udf_a4', me.lookup('udf_a4_combo').getValue() ? me.lookup('udf_a4_combo').getValue() : me.lookup('udf_a4_text').getValue());
        record.set('udf_a5', me.lookup('udf_a5_combo').getValue() ? me.lookup('udf_a5_combo').getValue() : me.lookup('udf_a5_text').getValue());
        record.set('udf_a6', me.lookup('udf_a6_combo').getValue() ? me.lookup('udf_a6_combo').getValue() : me.lookup('udf_a6_text').getValue());

        //replace , commas in field because of duplicate name fields
        record.set('udf_t1', record.get('udf_t1').replace(/,/g, ''));
        record.set('udf_t2', record.get('udf_t2').replace(/,/g, ''));
        record.set('udf_t3', record.get('udf_t3').replace(/,/g, ''));
        record.set('udf_t4', record.get('udf_t4').replace(/,/g, ''));
        record.set('udf_t5', record.get('udf_t5').replace(/,/g, ''));
        record.set('udf_t6', record.get('udf_t6').replace(/,/g, ''));
        record.set('udf_t7', record.get('udf_t7').replace(/,/g, ''));
        record.set('udf_t8', record.get('udf_t8').replace(/,/g, ''));
        record.set('udf_t9', record.get('udf_t9').replace(/,/g, ''));
        record.set('udf_t10', record.get('udf_t10').replace(/,/g, ''));
        //replace in address fields
        record.set('udf_a1', record.get('udf_a1').replace(/,/g, ''));
        record.set('udf_a2', record.get('udf_a2').replace(/,/g, ''));
        record.set('udf_a3', record.get('udf_a3').replace(/,/g, ''));
        record.set('udf_a4', record.get('udf_a4').replace(/,/g, ''));
        record.set('udf_a5', record.get('udf_a5').replace(/,/g, ''));
        record.set('udf_a6', record.get('udf_a6').replace(/,/g, ''));

        if (!TS.Util.hasRequiredUdfValues(record)) {
            me.getView().setLoading(false);
            return;
        }

        data = Ext.clone(form.getRecord().data);

        //get checkbox values
        data.availableForUseInField = me.lookup('availableCheckbox').getValue();
        data.wbsLocked = me.lookup('wbsLockedCheckbox').getValue();
        data.isContractWork = me.lookup('contractCheckbox').getValue();
        data.udf_c1 = me.lookup('udf_c1_Checkbox').getValue();
        //Clear UI GUID from FwaId if new FWA
        if (isNew) {
            data.fwaId = '';
        }

        //get emp hours & expense stores and clear filter since tables could be filtered
        Ext.first('grid-employeehours').getStore().clearFilter(true);
        Ext.first('grid-employeeexpenses').getStore().clearFilter(true);
        var expenseStore = Ext.first('grid-employeeexpenses').getStore();
        // Update the store fields
        data.expenses = Ext.Array.pluck(expenseStore.getRange(), 'data'); // data.expenses ? Ext.Array.pluck(expenseStore.getRange(), 'data') : null;
        data.hours = Ext.Array.pluck(data.hours.getRange(), 'data');

        //format wc start/end time
        Ext.each(data.hours, function (obj) {
            if (obj.startTime) {
                obj.startTime = (obj.startTime);
            } else
                obj.startTime = new Date('2001-01-01T00:00:00');
            if (obj.endTime) {
                obj.endTime = (obj.endTime)
            } else
                obj.endTime = new Date('2001-01-01T00:00:00');
        });

        data.notes = Ext.Array.pluck(data.notes.getRange(), 'data');
        //adjust for time zone
        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });

        //add any missing work code ids
        wcStore = Ext.getStore('WorkCodes');
        Ext.Array.each(data.hours, function (item) {
            wcStore = Ext.getStore('WorkCodes');
            wcStore.clearFilter(true);
            wcStore.filterBy(function (rec) {
                if (rec.get('workCodeAbbrev') == (item.workCodeAbbrev)) {
                    wcId = rec.get('workCodeId');
                    return true;
                }
            });
            item.isChief = item.crewRoleId ? Ext.getStore('Roles').getById(item.crewRoleId).get('crewRoleIsChief') : false;
            item.workCodeId = (wcId ? wcId : '');
        });
        //check if hours per day/ per employee exceed 24
        if (me.checkDailyTtlHours(data.hours)) {
            me.getView().setLoading(false);
            return;
        }
        //load non-field actions
        Ext.each(data.nonFieldActions.getRange(), function (item) {
            match = regex.exec(item.getId());
            if (!match) {
                obj = Ext.getStore('NonFieldActionItem').getById(item.getId());
                if (obj) {
                    item.set('actionItemDescr', obj.get('actionItemDescr'));
                    item.set('actionItemId', obj.get('actionItemId'));
                } else {
                    item.set('actionItemDescr', item.getId());
                    item.set('actionItemId', item.getId());
                }
            } else { // this is a UUID match
                obj = Ext.getStore('NonFieldActionItem').getById(item.getId());
                if (obj) {
                    item.set('actionItemDescr', obj.get('actionItemDescr'));
                    item.set('actionItemId', obj.get('actionItemId'));
                } else {
                    item.set('actionItemDescr', item.get('actionItemDescr'));
                    item.set('actionItemId', item.get('actionItemDescr'));
                    item.setId(item.get('actionItemDescr'));
                }
            }
        });

        Ext.each(data.nonFieldActions.getRange(), function (obj) {
            if (obj.get('actionDateCompleted')) {
                obj.set('actionTempSaveData', 'Completed');
            } else if (obj.get('actionOwnerId')) {
                obj.set('actionTempSaveData', 'Owner');
            } else {
                obj.set('actionTempSaveData', 'New');
            }
        });

        actionList = {
            fwaId: data.fwaId,
            nonFieldActions: Ext.Array.pluck(data.nonFieldActions.getRange(), 'data')
        };
        data.nonFieldActions = actionList.nonFieldActions;
        //create array
        data.workSchedAndPerf = Ext.Array.pluck(data.workSchedAndPerf.getRange(), 'data');
        //check for required grid values
        if (vm.get('newFwa') && !isScheduler) {
            if (data.workSchedAndPerf.length === 0) {
                Ext.Msg.alert('Warning', 'At least one(1) ' + settings.workCodeLabel + ' entry is required.');
                me.getView().setLoading(false);
                return;
            }
        }
        //add any missing work code ids
        Ext.Array.each(data.workSchedAndPerf, function (item) {
            wcStore = Ext.getStore('WorkCodes');
            wcStore.clearFilter(true);
            wcStore.filterBy(function (rec) {
                if (rec.get('workCodeAbbrev').match(item.workCodeAbbrev)) {
                    wcId = rec.get('workCodeId');
                    return true;
                }
            });
            item.workCodeId = (wcId ? wcId : '');
        });

        //create array of fwa units
        fwaUnitGrid.getStore().clearFilter(true);
        if (fwaUnitGrid && fwaUnitGrid.getStore().getRange().length >= data.units.getRange().length) {
            data.units = Ext.Array.pluck(fwaUnitGrid.getStore().getRange(), 'data');
        } else {
            data.units = Ext.Array.pluck(data.units.getRange(), 'data');
        }
        //create array of unit details for each fwa unit
        Ext.each(data.units, function (unit) {
            if (unit.details.length == 0) {
                unit.details = []; //if no details, create empty array
            } else {
                if (!Ext.isArray(unit.details))
                    unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
            }
            // if (new Date().getTimezoneOffset() < 0) {
            //     Ext.each(data.units, function (ud) {
            //         ud.unitDate = Ext.Date.add(ud.unitDate, Ext.Date.DAY, 1);
            //     });
            // }
        });

        //check date if minus timezone
        // if (new Date().getTimezoneOffset() < 0) {
        //     Ext.each(data.hours, function (wd) {
        //         wd.workDate = Ext.Date.add(wd.workDate, Ext.Date.DAY, 1);
        //     });
        // }
        //check latitude/longitude
        if (!data.loc.latitude) data.loc.latitude = 0;
        if (!data.loc.longitude) data.loc.longitude = 0;
        //convert duration to minutes
        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);
        //check for any special associations
        data = TS.Util.checkFwaForValidDates(data);

        TS.Util.onCheckPriorToEmployeeAssn(data, isScheduler, data.scheduledCrewId, function (isOkay) {
            if (isOkay) {
                //determine if a save or submit
                if (fwaCall == 'fwaSaveButton' || fwaCall == 'fwaUpdateButton' || fwaCall == 'showAttachDocButton') {
                    data.fwaStatusId = FwaStatus.Saved;
                    if (vm.get('newFwa') || settings.hasCrewChange) {
                        var ttlHours = me.checkFwaHoursTotal(data.hours);
                        if (!data.schedStartDate || data.schedStartDate < new Date('1/1/0001 12:30:00 AM')) {
                            data.schedStartDate = new Date('1/1/2001 12:00:00 AM');
                        }
                        if (!data.schedEndDate || data.schedEndDate < new Date('1/1/0001 12:30:00 AM')) {
                            data.schedEndDate = new Date('1/1/2001 12:00:00 AM');
                        }
                        TS.Util.onCheckForDoubleBookedEmployees(data.fwaId, data.scheduledCrewId, data.schedStartDate, data.schedEndDate, function (status) {
                            if (!status) {
                                if (!isScheduler && data.scheduledCrewId && data.schedStartDate && data.schedEndDate && ttlHours == 0) {
                                    vw.lookup('scheduledCrewNameDisplay').setValue('');
                                    vw.lookup('schedStartDateField').setValue('');
                                    vw.lookup('schedStartTimeField').setValue('');
                                    vw.lookup('schedEndDateField').setValue('');
                                    vw.lookup('schedEndTimeField').setValue();
                                }
                                if (me.getView())
                                    me.getView().setLoading(false);
                            } else {
                                if (!data.schedStartDate || data.schedStartDate < new Date('1/1/0001 12:30:00 AM')) {
                                    data.schedStartDate = new Date('1/1/2001 12:00:00 AM');
                                }
                                if (!data.schedEndDate || data.schedEndDate < new Date('1/1/0001 12:30:00 AM')) {
                                    data.schedEndDate = new Date('1/1/2001 12:00:00 AM');
                                }

                                data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
                                data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);
                                Fwa.Save(null, settings.username, settings.empId, data, isScheduler, false, function (response) {
                                    if (response && response.success) {
                                        form.getRecord().dirty = false;
                                        if (response.message.mdBody != '') {
                                            Ext.Msg.alert(settings.fwaAbbrevLabel + ' Saved', settings.fwaAbbrevLabel + ' has been saved (' + response.message.mdBody + ')');
                                        } else {
                                            if (fwaCall == 'fwaSaveButton')
                                                TS.Messages.getSimpleAlertMessage('fwaSaveSuccess');
                                            else
                                                TS.Messages.getSimpleAlertMessage('fwaUpdateSuccess');
                                        }
                                        me.continueReload(response.data, form, items);
                                    } else if (response) {
                                        Ext.GlobalEvents.fireEvent('Error', response);
                                    }
                                    if (me.getView())
                                        me.getView().setLoading(false);
                                }.bind(me));
                            }
                        });
                    } else {
                        if (!data.schedStartDate || data.schedStartDate < new Date('1/1/0001 12:30:00 AM')) {
                            data.schedStartDate = new Date('1/1/2001 12:00:00 AM');
                        }
                        if (!data.schedEndDate || data.schedEndDate < new Date('1/1/0001 12:30:00 AM')) {
                            data.schedEndDate = new Date('1/1/2001 12:00:00 AM');
                        }

                        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
                        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);

                        Fwa.Save(null, settings.username, settings.empId, data, isScheduler, false, function (response) {
                            if (response && response.success) {
                                if (response.message.mdBody != '') {
                                    Ext.Msg.alert(settings.fwaAbbrevLabel + ' Saved', settings.fwaAbbrevLabel + ' has been saved (' + response.message.mdBody + ')');
                                } else {
                                    if (fwaCall == 'fwaSaveButton')
                                        TS.Messages.getSimpleAlertMessage('fwaSaveSuccess');
                                    else
                                        TS.Messages.getSimpleAlertMessage('fwaUpdateSuccess');
                                }
                                form.getRecord().dirty = false;
                                me.continueReload(response.data, form, items);
                            } else if (response) {
                                Ext.GlobalEvents.fireEvent('Error', response);
                            }
                            if (me.getView())
                                me.getView().setLoading(false);
                        }.bind(me));
                    }
                } else {
                    if (isScheduler && data.recurrenceConfig && record.recurrenceIsDirty) {
                        Ext.Msg.show({
                            title: 'Warning',
                            message: 'There have been changes to the recurrence. Are you sure you want to \'Submit\', rather than simply \'Save\' for further access by the field?',
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            fn: Ext.bind(function (btn) {
                                if (btn === 'yes') {
                                    if (data.recurrenceConfig) {
                                        Ext.create('TS.view.fwa.SubmitRecurring', {fwa: data}).show();
                                    } else {
                                        me.onFinishSubmit(data);
                                    }
                                } else {
                                    me.getView().setLoading(false);
                                }
                            }, me)
                        });
                    } else {
                        if (data.recurrenceConfig) {
                            Ext.create('TS.view.fwa.SubmitRecurring', {fwa: data}).show();
                        } else {
                            me.onFinishSubmit(data);
                        }
                    }
                }
            } else {
                me.getView().setLoading(false);
            }
        });
    },

    continueSubmitWithDate: function (data) {
        var me = this;
        me.onFinishSubmit(data);
    },

    continueReload: function (data, form, items) {
        var me = this;
        Ext.first('#fwaForm').getForm().dirty = false;
        form.getRecord().dirty = false;
        form.dirty = false;
        Ext.each(items, function (i) {
            i.dirty = false;
        });
        me.afterFwaSave(data);
    },

    onFinishSubmit: function (data) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            halt = false;
        //check for dates
        if (data.schedStartDate < new Date('1/1/2002')) {
            Ext.Msg.alert('Warning', 'Unscheduled FWAs can not be SUBMITTED.');
            me.getView().setLoading(false);
            return;
        } else if (data.schedEndDate < new Date('1/1/2002')) {
            Ext.Msg.alert('Warning', 'Unscheduled FWAs can not be SUBMITTED.');
            me.getView().setLoading(false);
            return;
        }
        //convert duration to minutes
        data.duration = Ext.Date.diff(data.schedStartDate, data.schedEndDate, Ext.Date.MINUTE);
        //check for employee hours entry
        if (data.hours.length === 0) {
            Ext.Msg.alert('Warning', 'An employee entry is required in "Employee Hours" is required on Submit.');
            me.getView().setLoading(false);
            return;
        } else {
            Ext.each(data.hours, function (entry) {
                //check for employee & work code selection
                if (!entry.workCodeId || !entry.empId) {
                    Ext.Msg.alert('Warning', 'Both an Employee and ' + settings.workCodeLabel + ' selection required with each Employee Hour entry on Submit.');
                    me.getView().setLoading(false);
                    halt = true;
                }
            });
        }
        //set status
        data.fwaStatusId = FwaStatus.Submitted;
        //return for correction of errors
        if (halt) return;
        // Chief signature is required but doesn't exist
        if (data.chiefSigReq && (!me.signatureExists(data.attachments, AttachmentType.EmpSignature) && !me.getView().lookup('fwaChiefApprovalFieldset').lookup('signatureImage').src)) {
            Ext.GlobalEvents.fireEvent('Message:Code', 'fwaSubmitNoChiefSig');
            me.getView().setLoading(false);
            // Client signature is required but doesn't exist
        } else if (data.clientSigReq && (!me.signatureExists(data.attachments, AttachmentType.ClientSignature) && !me.getView().lookup('fwaClientApprovalFieldset').lookup('signatureImage').src)) {
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
            vm = me.getViewModel(),
            message;
        data = TS.Util.checkFwaForValidDates(data);

        if (data.nextDate.getFullYear() < 2040)
            data.nextDate = TS.common.Util.getOutUTCDate(data.nextDate);
        //clear attachments - only used when coming FROM backend
        data.schedStartDate = TS.common.Util.getOutUTCDate(data.schedStartDate);
        data.schedEndDate = TS.common.Util.getOutUTCDate(data.schedEndDate);
        //adjust for time zone
        Ext.each(data.notes, function (note) {
            note.createDate = TS.common.Util.getOutUTCDate(note.createDate);
            note.modDate = TS.common.Util.getOutUTCDate(note.modDate);
        });
        data.attachments = [];
        Ext.first('#fwaForm').getForm().dirty = false;
        Ext.first('#fwaForm').getForm().getRecord().dirty = false;
        Fwa.Submit(null, username, empId, data, vm.get('isScheduler'), function (response) {
            if (response && response.success) {
                TS.Messages.getSimpleAlertMessage('fwaSubmitSuccess');
                me.afterFwaSave(response.data, true);
                Ext.first('#fwaForm').getForm().dirty = false;
                Ext.first('#fwaForm').getForm().getRecord().dirty = false;
                if (Ext.first('#schedRowCtField'))
                    Ext.first('#schedRowCtField').setHidden(false);
            } else if (response) {
                me.nextDate();
                me.lastDate();
                me.nextUnitDate();
                me.lastUnitDate();
                Ext.GlobalEvents.fireEvent('Error', response);
            }
            if (me.getView())
                me.getView().setLoading(false);
        }, me, {
            autoHandle: false // We need to call setLoading(false) whether success or fail
        });

    },

    toggleWork: function () {

        var me = this,
            record = me.getView().getForm().getRecord(),
            settings = TS.app.settings,
            newStatusId;
        // Work is In Progress; button stops work
        if (record.get('fwaStatusId') !== FwaStatus.InProgress) {
            Fwa.StartWork(null, settings.username, record.get('fwaId'), Ext.bind(me.handleToggleWorkResponse, me));
            newStatusId = FwaStatus.InProgress;
            // Work is Scheduled or Saved; button starts work
        } else {
            Fwa.EndWork(null, settings.username, record.get('fwaId'), Ext.bind(me.handleToggleWorkResponse, me));
            newStatusId = FwaStatus.Saved;
        }
        // Update the local status to match the remote
        record.set('fwaStatusId', newStatusId);
        me.getViewModel().set('fwaStatusId', newStatusId);

    },

    handleToggleWorkResponse: function (response, operation) {
        if (response && response.success) {
            // Determine response and fields to assign
            var messageCode = (operation.method === 'StartWork' ? 'fwaStartWorkSuccess' : 'fwaStopWorkSuccess');
            Ext.GlobalEvents.fireEvent('Message:Code', messageCode);
            Ext.each(response.data, function (arr) {
                var cmp = Ext.ComponentQuery.query('[name=' + arr.Key + ']')
                Ext.each(cmp, function (c) {
                    c.setValue(arr.Value);
                })
            })

        } else if (response) {
            Ext.GlobalEvents.fireEvent('Error', response);
        }
    },

    afterFwaSave: function (fwa, isSubmit) {

        var me = this,
            vm = me.getViewModel(),
            isScheduler = vm.get('isScheduler'),
            settings = TS.app.settings,
            scheduler = Ext.first('scheduler-crew'),
            store,
            grid,
            form;
        //me.getView().resetDirtyState();

        if (settings.isFwaUpdate) {
            store = Ext.first('fwalist').getStore();
            store.reload();
            setTimeout(function () {
                me.loadRemoteFwa(fwa.fwaId, fwa.schedStartDate);
                settings.isFwaUpdate = false;
                settings.fromProjectTree = false;
            }, 500);
            // if(settings.addNewExpenses){
            //     //Ext.Msg.alert(('FYI'), 'The new '+ settings.fwaAbbrevLabel+' has been updated so Expenses can be added.');
            //     settings.addNewExpenses = false;
            //     Ext.first('#newEmployeeExpense').click();
            // }
        } else {
            if (isScheduler) {
                settings.schedulerNeedsRefresh = true;
                settings.crewAssignNeedsRefresh = true;
                settings.employeeGanttNeedsRefresh = true;
                settings.crewTaskNeedsRefresh = true;
                settings.fwaListNeedsRefresh = true;
                Ext.first('#refreshFwaListBtn').show();
                if (!fwa.dateOrdered || new Date(fwa.dateOrdered) < new Date('1/1/0001 12:30:00 AM')) {
                    fwa.dateOrdered = new Date('1/1/2001 12:00:00 AM');
                }
                if (!fwa.dateRequired || new Date(fwa.dateRequired) < new Date('1/1/0001 12:30:00 AM')) {
                    fwa.dateRequired = new Date('1/1/2001 12:00:00 AM');
                }
                if (!fwa.lastSubmittedDate || new Date(fwa.lastSubmittedDate) <= new Date('1/1/0001 12:30:00 AM')) {
                    fwa.lastSubmittedDate = new Date('1/1/2001 12:00:00 AM');
                }
                if (!fwa.lastApprovedDate || new Date(fwa.lastApprovedDate) <= new Date('1/1/0001 12:30:00 AM')) {
                    fwa.lastApprovedDate = new Date('1/1/2001 12:00:00 AM');
                }

                //update tabs here if needed
                if ((!fwa.scheduledCrewId && typeof (fwa) == 'object') || (fwa.schedStartDate == '0001-01-01T00:00:00' && typeof (fwa) == 'object')) {
                    //Ext.GlobalEvents.fireEvent('UpdateUnplannedStore', fwa);
                    // store = Ext.first('fwalist').getStore();
                    // store.reload();
                    if (vm.get('parentPage') == 'tabFwaPanel') {
                        Ext.first('fwalist').expand();
                        Ext.first('fwalist').show();
                        Ext.first('#crewTabPanel').setActiveTab('tabFwaPanel');
                        Ext.first('fwalist').getStore().reload();
                        //Ext.GlobalEvents.fireEvent('ClearFwaListFilters')
                    } else {
                        settings.schedulerNeedsRefresh = true;
                        Ext.first('#crewTabPanel').setActiveTab('tabFwaPanel');
                        setTimeout(function(){
                            Ext.first('#crewTabPanel').setActiveTab('tabSchedulerPanel');
                        }, 1000);
                    }

                } else if (vm.get('parentPage') == 'tabCrewPanel') {
                    settings.crewNeedsRefresh = true;
                    Ext.first('#crewTabPanel').setActiveTab('tabCrewPanel');
                } else if (vm.get('parentPage') == 'tabSchedulerPanel') {
                    settings.schedulerNeedsRefresh = true;
                    grid = Ext.first('fwalist');
                    //reload store to reflect addition/changes
                    grid.getStore().load({
                        callback: function () {
                            me.onClearFilters();
                        }
                    });
                    Ext.first('#crewTabPanel').setActiveTab('tabFwaPanel');
                    setTimeout(function(){
                        Ext.first('#crewTabPanel').setActiveTab('tabSchedulerPanel');
                    }, 1000);
                } else if (vm.get('parentPage') == 'tabFwaPanel') {
                    grid = Ext.first('fwalist');
                    grid.expand();
                    grid.show();
                    //reload store to reflect addition/changes
                    grid.getStore().load({
                        callback: function () {
                            //me.onClearFilters(); //per email 10/11/2022
                        }
                    });

                    Ext.first('#crewTabPanel').setActiveTab('tabFwaPanel');
                    // var task = Ext.create('Ext.util.DelayedTask', function() {
                    //     me.onClearFilters();
                    // }, this);
                    // task.delay(1000);
                } else if (vm.get('parentPage') == 'tabCrewAssignPanel') {
                    settings.crewAssignNeedsRefresh = true;
                    Ext.first('#crewTabPanel').setActiveTab('tabFwaPanel');
                    setTimeout(function(){
                        Ext.first('#crewTabPanel').setActiveTab('tabCrewAssignPanel');
                    }, 1000);
                } else if (vm.get('parentPage') == 'tabEmployeeViewGanttPanel') {
                    settings.employeeGanttNeedsRefresh = true;
                    Ext.first('#crewTabPanel').setActiveTab('tabFwaPanel');
                    setTimeout(function(){
                        Ext.first('#crewTabPanel').setActiveTab('tabEmployeeViewGanttPanel');
                    }, 1000);
                } else if (vm.get('parentPage') == 'tabCrewTaskPanel') {
                    settings.crewTaskNeedsRefresh = true;
                    Ext.first('#crewTabPanel').setActiveTab('tabFwaPanel');
                    setTimeout(function(){
                        Ext.first('#crewTabPanel').setActiveTab('tabCrewTaskPanel');
                    }, 1000);
                }

                me.clearDateFields();
                Ext.first('#showFwaMapButton').show();
                Ext.first('#printAllButton').show();
                Ext.first('#fwaSearchButton').setHidden(false);
                Ext.first('#clearButton').setHidden(false);
                if (Ext.first('#newFwaButton'))
                    Ext.first('#newFwaButton').setHidden(false);
                Ext.first('#schedFwaGridToolbar').setHidden(false);
                if (Ext.first('#fwaGridButtonNew'))
                    Ext.first('#fwaGridButtonNew').setHidden(true);
                if (Ext.first('#fwaGridButton'))
                    Ext.first('#fwaGridButton').setHidden(true);

                if (Ext.first('#schedRowCtField'))
                    Ext.first('#schedRowCtField').setHidden(false);

                if (Ext.first('form-fwa'))
                    Ext.first('form-fwa').collapse();
                if (Ext.first('fwalist'))
                    Ext.first('fwalist').expand();
            } else {
                me.clearDateFields();
                store = Ext.first('fwalist').getStore();
                store.reload();
                Ext.GlobalEvents.fireEvent('ChangeViewport', 'FWA');
                Ext.first('form-fwa').collapse();
                Ext.first('fwalist').expand();
            }
        }
    },

    onClearFilters: function () {
        var me = Ext.first('fwalist'),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            vw = me.getView(),
            store = me.getStore();

        store.remoteFilter = false;
        store.clearFilter();

        var allRecords = [];

        Ext.each(store.getData().items, function (rec) {
            allRecords.push(rec.get('fwaId'));
        });

        store.filterBy(function (rec) {
            if (rec.get('recurrenceConfig') && rec.get('recurrCt') > 1) {
                return false;
            } else {
                return true;
            }
        });

        Ext.first('#btnViewLastWeek').setHidden(true);
        Ext.first('#btnViewNextWeek').setHidden(true);
        Ext.first('#labelFwaCurrentDate').setHidden(true);
        Ext.first('#btnWeekView').setText('Week View');
    },

    resetDirtyState: function () {
        this.getView().resetDirtyState();
    },

    onResetAttachmentCounts: function (attachmentType, isDelete) {
        var me = this,
            fwa = me.getView().getRecord(),
            recordId = fwa.get('fwaId'),
            settings = TS.app.settings,
            docBtn = null,
            docCt = fwa.get('attachmentCtDoc'),
            picBtn = null,
            picCt = fwa.get('attachmentCtPhoto'),
            attachText = me.getAttachmentText(fwa);

        if (attachmentType == AttachmentType.Photo) {
            picBtn = me.getView().lookup('showAttachPhotoButton');
            if (isDelete) {
                picBtn.setText(attachText + ' Photo (' + (picCt - 1) + ')');
                fwa.set('attachmentCtPhoto', (picCt - 1));
            } else {
                picBtn.setText(attachText + ' Photo (' + (picCt + 1) + ')');
                fwa.set('attachmentCtPhoto', (picCt + 1));
            }
        } else if (attachmentType == AttachmentType.Document) {
            docBtn = me.getView().lookup('showAttachDocButton');
            if (isDelete) {
                docBtn.setText(attachText + ' Doc (' + (docCt - 1) + ')');
                fwa.set('attachmentCtDoc', docCt - 1)
            } else {
                docBtn.setText(attachText + ' Doc (' + (docCt + 1) + ')');
                fwa.set('attachmentCtDoc', docCt + 1)
            }
        }
    },

    getAttachmentText: function (fwa) {
        var settings = TS.app.settings,
            vm = this.getViewModel();

        if (settings.fwaCreateNew) {
            return 'Attach';
        } else if (vm.get('isScheduler')) {
            return settings.fwaCanModify == 'A' ||
            (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify')) ? 'Attach' : 'View';
        } else {
            return settings.fwaCanModify == 'A' ||
            (settings.fwaCanModify == 'M' && fwa.get('scheduledCrewChiefId') !== settings.empId) ||
            (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify')) ? 'Attach' : 'View';
        }

    },

    reloadUnitCodeStore: function (record) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            unitCodeStore = Ext.getStore('UnitCode');

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
            if (vm.get('newFwa')) {
                settings.fromProjectTree = false;
            } else if (!settings.fromProjectTree) {
                me.loadFwaRecord(record);
            } else {
                settings.fromProjectTree = false;
            }
        });
    },

    /*
     * Loads a record into the FWA
     */
    loadFwaRecord: function (record, isCopy) {
        var me = this,
            wbs1 = me.lookup('fwawbs1id'),
            wbs2 = me.lookup('fwawbs2id'),
            wbs3 = me.lookup('fwawbs3id'),
            vw = me.getView(),
            vm = me.getViewModel(),
            form = me.getView(),
            myForm = form.getForm(),
            settings = TS.app.settings,
            fwaWorkGrid = me.lookup('fwaWorkGrid'),
            employeeHoursGrid = me.lookup('employeeHoursGrid'),
            unitGrid = me.lookup('fwaUnitGrid'),
            currentStatus = record.get('fwaStatusId'),
            clientName = me.lookup('clientNameField'),
            tsViewModel = me.getView().lookupViewModel(),
            hasNotes = record.get('hasNotes'),
            hasRecurrence = record.get('recurrencePattern') != '',
            picCt = record.get('attachmentCtPhoto') || 0,
            docCt = record.get('attachmentCtDoc') || 0,
            sigCt = record.get('attachmentCtSig') || 0,
            attachments,
            isScheduler = me.getViewModel().get('name') == 'Scheduler',
            isCrewChief = me.checkForCrewChief(record, settings.empId),
            isApprover = record.get('fwaApprovers').indexOf(settings.empId) !== -1,
            hasSignatures = false,
            docBtn = form.lookup('showAttachDocButton'),
            picBtn = form.lookup('showAttachPhotoButton'),
            attachText = me.getAttachmentText(record),
            hideDisplayClientSig = currentStatus == FwaStatus.Create || settings.hideSections.indexOf('CS') != -1,
            hideDisplayChiefSig = currentStatus == FwaStatus.Create || settings.hideSections.indexOf('ES') != -1,
            items,
            schedStore,
            scheduler,
            wbs1Store,
            wbs2Store,
            wbs3Store;

        settings.selectedRecord = record;
        settings.isFwaCopy = isCopy;

        if (wbs1)
            wbs1Store = wbs1.getStore();
        if (wbs2) {
            wbs2Store = wbs2.getStore();
            wbs2.clearValue();
            wbs2Store.removeAll();
        }
        if (wbs3) {
            wbs3Store = wbs3.getStore();
            wbs3.clearValue();
            wbs3Store.removeAll();
        }

        if (record.get('fwaId') || vm.get('newFwa'))
            Ext.first('#fieldPriorityField').setHidden(false);
        //handles cases where scheduler is read only and fwa has rights
        if (isScheduler && settings.schedReadOnly && !settings.fwaReadOnly) {
            isScheduler = false;
        }

        if (record.get('schedStartDate') < new Date('1/1/2002')) {
            record.set('schedStartDate', null);
        }
        //reset all fields
        me.setFormRead();
        //empty fields for new fwa
        me.clearFwaInfoFields();
        me.clearAddressFields();
        //reset text
        docBtn.setText(attachText + ' Doc');
        picBtn.setText(attachText + ' Photo');
        tsViewModel.set('clientSigReq', record.get('clientSigReq'));
        tsViewModel.set('chiefSigReq', record.get('chiefSigReq'));
        //tsViewModel.set('notesCls', (hasNotes ? 'x-fa fa-folder-open yellowIcon' : 'x-fa fa-folder yellowIcon'));
        tsViewModel.set('hasRights', settings.fwaCreateNew);
        if (hasNotes) {
            vw.lookup('fwaInstructionsButton').setHidden(true);
            vw.lookup('fwaInstructionsButtonFull').setHidden(false);
        } else {
            vw.lookup('fwaInstructionsButton').setHidden(false);
            vw.lookup('fwaInstructionsButtonFull').setHidden(true);
        }
        tsViewModel.set('wbsLocked', isScheduler || vm.get('newFwa') ? false : record.get('wbsLocked'));
        tsViewModel.set('recurrenceBtn', (hasRecurrence ? 'x-fa fa-edit' : 'x-fa fa-plus'));
        tsViewModel.set('showCreate', (hasRecurrence ? false : true));
        me.forms = [];
        //check if user is a scheduler on a new FWA
        //TBD On Load NEWFWA
        if ((!record.get('preparedByEmpId') || record.get('preparedByEmpId') == '')) {
            schedStore = Ext.getStore('Schedulers');
            //schedStore.filter('isScheduler', true);
            scheduler = schedStore.getById(settings.empId);
            if (scheduler && scheduler.get('isScheduler')) {
                record.set('preparedByEmpId', settings.empId);
            }
        }
        me.setFormRead();
        me.getViewModel().set('isSubmitted', record.get('fwaStatusId') == FwaStatus.Submitted);
        me.showHideBySecuritySettings(record);
        me.refreshFormValues(record, isCopy);

        if (isCopy) {
            me.lookup('udf_d1_field').setValue('');
            me.lookup('udf_d2_field').setValue('');
            me.lookup('udf_d3_field').setValue('');
        }
        vm.set('hasWbs2', record.get('wbs2') ? true : false);
        vm.set('hasWbs3', record.get('wbs3') ? true : false);

        me.resetOriginalValues(form);
        me.getViewModel().set('newFwa', false);
        me.getViewModel().set('a' +
            'fwaStatusId', record.get('fwaStatusId'));
        //check if being called in scheduler & no signatures yet
        attachments = record.get('attachments');

        Ext.each(attachments, function (ob) {
            if (sigCt > 0 && isScheduler && !settings.fwaReadOnly) {
                hasSignatures = true;
            }
        });

        if (docCt > 0) {
            docBtn = form.lookup('showAttachDocButton');
            docBtn.setText(attachText + ' Doc (' + docCt + ')');
        }
        if (picCt > 0) {
            picBtn = form.lookup('showAttachPhotoButton');
            picBtn.setText(attachText + ' Photo (' + picCt + ')');
        }

        if (isScheduler && !hasSignatures && currentStatus != FwaStatus.Submitted) {
            me.lookup('fwaApprovalSetupFieldset').setHidden(false);
            me.lookup('fwaChiefApprovalFieldset').setHidden(true);
            me.lookup('fwaClientApprovalFieldset').setHidden(true);
        } else {
            // Show approval signature setup if creating new FWA
            me.lookup('fwaApprovalSetupFieldset').setHidden(currentStatus != FwaStatus.Create);
            // Hide the signature fieldsets if creating new FWA or user config says hide
            me.lookup('fwaChiefApprovalFieldset').setHidden(hideDisplayClientSig);
            me.lookup('fwaClientApprovalFieldset').setHidden(hideDisplayChiefSig);
        }

        if (settings.fwaUnitsEnabled) {             //'Manage ' +
            me.lookup('workCodeUnitPanel').setTitle(settings.workCodeLabelPlural + ' and ' + settings.unitLabelPlural);
        } else {                                    //'Manage ' +
            me.lookup('workCodeUnitPanel').setTitle(settings.workCodeLabelPlural);
        }
        //show-collapse
        if (localStorage.getItem('addressDatePanelOpen') == 'false')
            me.lookup('addressDatePanel').collapse();
        if (localStorage.getItem('signaturePanelOpen') == 'false')
            me.lookup('signaturePanel').collapse();
        if (localStorage.getItem('workCodeUnitPanelOpen') == 'false')
            me.lookup('workCodeUnitPanel').collapse();
        if (localStorage.getItem('empHoursPanelOpen') == 'false')
            me.lookup('empHoursPanel').collapse();
        if (localStorage.getItem('expensesPanelOpen') == 'false')
            me.lookup('expensesPanel').collapse();

        if (currentStatus == FwaStatus.Approved) {
            //form.lookup('toggleWorkButton').setHidden(true);
            form.lookup('fwaSubmitButton').setHidden(true);
            form.lookup('removeFwaFormButton').setHidden(true);
            form.lookup('fwaApproveButton').setHidden(true);
            form.lookup('showAttachDocButton').setHidden(true);
            form.lookup('showAttachPhotoButton').setHidden(true);
            form.lookup('actionsButton').setHidden(true);
            form.lookup('crewButton').setHidden(!me.getViewModel().get('isSchedulerOrNewFwa'));
            form.lookup('fwaSaveButton').setHidden(!isScheduler);
            form.lookup('fwaUpdateButton').setHidden(!isScheduler);
        }

        if (currentStatus == FwaStatus.Submitted && !isScheduler) {
            if (!settings.fwaAllowUnsubmit) {
                me.setFormReadOnly();
            }
        }

        if (currentStatus == FwaStatus.Submitted && isApprover) {
            if (!record.get('fwaApproversCanModify')) {
                me.setFormReadOnly();
            }
        }

        if (currentStatus == FwaStatus.Submitted && !isScheduler && isApprover && isCrewChief) {
            if (settings.fwaAllowUnsubmit || record.get('fwaApproversCanModify')) {
                me.setFormRead();
            }
        }

        form.lookup('fwaApproveButton').setHidden(true);
        if (currentStatus == FwaStatus.Create) {
            form.lookup('fwaSubmitButton').setHidden(true);
            form.lookup('removeFwaFormButton').setHidden(true);
            form.lookup('fwaApproveButton').setHidden(true);
        } else if (currentStatus == FwaStatus.Removed) {
            form.lookup('removeFwaFormButton').setHidden(true);
            form.lookup('fwaApproveButton').setHidden(true);
        } else {
            form.lookup('fwaSubmitButton').setHidden(false);
            form.lookup('removeFwaFormButton').setHidden(false);
            if (settings.fwaIsApprover)
                form.lookup('fwaApproveButton').setHidden(false);
        }

        //check dates
        if (record.get('schedStartDate') < new Date('1/1/2002')) {
            me.lookup('schedStartDateField').setValue('');
            me.lookup('schedEndDateField').setValue('');
            me.lookup('schedStartTimeField').setValue('');
            me.lookup('schedEndTimeField').setValue('');
        }
        if (Ext.Date.format(record.get('dateOrdered'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            me.lookup('dateOrderedField').setValue();
        }
        if (Ext.Date.format(record.get('dateRequired'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            me.lookup('dateRequiredField').setValue();
        }

        if (Ext.Date.format(record.get('udf_d1'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            me.lookup('udf_d1_field').setValue();
        }
        if (Ext.Date.format(record.get('udf_d2'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            me.lookup('udf_d2_field').setValue();
        }
        if (Ext.Date.format(record.get('udf_d3'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            me.lookup('udf_d3_field').setValue();
        }

        me.getViewModel().set('fwaStatusId', record.get('fwaStatusId'));
        wbs1.setValue(record.get('wbs1'));
        wbs2.setValue(record.get('wbs2'));
        wbs3.setValue(record.get('wbs3'));

        //disable button if a recurring FWA
        me.lookup('resetStartEndDateTimeBtn').setDisabled(hasRecurrence || (!isCrewChief && record.get('scheduledCrewId') && record.get('preparedByEmpId') != settings.empId) || !isScheduler && record.get('preparedByEmpId') != settings.empId || (!hasRecurrence && record.get('fwaStatusId') == FwaStatus.Approved));

        me.lookup('schedEndDateField').setReadOnly(hasRecurrence);
        me.lookup('schedEndTimeField').setReadOnly(hasRecurrence);
        me.lookup('schedStartDateField').setReadOnly(hasRecurrence);
        me.lookup('schedStartTimeField').setReadOnly(hasRecurrence);
        //me.lookup('recurDurationDate').setReadOnly(hasRecurrence);

        if (record.get('recurrenceConfig') || isScheduler) {
            form.lookup('removeFwaFormButton').setHidden(true);
        }

        if (record.get('recurrenceConfig') && isScheduler && currentStatus != FwaStatus.Create) {
            //form.lookup('crewButton').setDisabled(true);
            form.lookup('crewButton').setDisabled(false);
        }

        //Ext.first('#recurrenceButton').setText(hasRecurrence ? 'Edit Recurrence' : 'Create Recurrence');
        //hasRecurrence && !isCrewChief || !isScheduler && hasRecurrence
        if (hasRecurrence && !isScheduler) {
            Ext.first('#recurrenceButton').setText('View Recurrence');
            Ext.first('#recurrenceButton').setDisabled(false);
        }

        Ext.first('#recurrenceButton').setHidden(!isScheduler);
        if (hasRecurrence) {
            Ext.first('fieldset-datetime').setTitle('Dates & Times (*recurring)');
        }
        //clear dirty values
        items = Ext.first('#fwaForm').getForm().getFields().items;
        Ext.each(items, function (i) {
            i.dirty = false;
            i.wasDirty = false;
        });
        //handles cases where scheduler and fwa are both read only
        if ((vm.get('isScheduler') && settings.schedReadOnly && settings.fwaReadOnly) || (record.get('fwaStatusId') == 'C' && settings.schedReadOnly)) {
            me.setFormReadOnly();
        } else if (!vm.get('isScheduler') && settings.fwaReadOnly) {
            me.setFormReadOnly();
        }
        Ext.first('#fwaForm').getForm().dirty = false;
        Ext.first('#fwaForm').getForm().getRecord().dirty = false;
        settings.hasCrewChange = false;

        if (currentStatus == FwaStatus.Create) {
            me.lookup('addUnitDateBtn').setDisabled(true);
            me.lookup('addWorkDateBtn').setDisabled(true);
        }

        Ext.first('#recurrenceButton').setHidden(!vm.get('showCreate'));
        Ext.first('#recurrenceButtonEdit').setHidden(vm.get('showCreate'));

        if (hasRecurrence && !vm.get('isScheduler')) {
            Ext.first('#recurrenceButtonEdit').setText('View Recurrence');
        }

        if (isCopy) {
            clientName.setValue(record.get('clientName'));
            Ext.first('#fwaDayCount').setValue(0);
            Ext.first('grid-employeehours').getStore().removeAll();
        }

    },

    checkForCrewChief: function (record, empId) {
        var isChief = false;
        if (!record) return false;
        if (!record.data) return false;
        if (record && record.get('scheduledCrewChiefId') == '') return false;

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

    showHideBySecuritySettings: function (record) {
        if (record.dirty && record.phantom) return;
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            isScheduler = vm.get('isScheduler'),
            hasRights = vm.get('hasRights'),
            copyButton = me.getView().lookup('doCopyFwaButton'),
            fwaHeader = Ext.first('header-fwa'),
            saveButton = me.getView().lookup('fwaSaveButton'),
            submitButton = me.getView().lookup('fwaSubmitButton'),
            isCrewChief = me.checkForCrewChief(record, settings.empId) || (vm.get('newFwa') && settings.fwaCreateNew),
            canModify = ((settings.fwaCanModify == 'A' || settings.fwaCanModify == 'M') && isCrewChief) || (vm.get('newFwa') && settings.fwaCreateNew),
            newFwaButton = null,
            wcGrid = me.lookup('fwaWorkGrid');

        if (isScheduler && settings.schedReadOnly) {
            isScheduler = false;
        }

        if (fwaHeader) {
            newFwaButton = Ext.first('#newFwaButton');
        }

        if (!vm.get('newFwa') && !isScheduler) {
            me.getView().lookup('preparedByEmpIdField').setReadOnly(!isCrewChief);
            me.getView().lookup('fieldPriorityField').setReadOnly(!isCrewChief);
        }
        //initialize
        vm.set('noWorkCodeRights', false);
        //check security setting value for adding work codes
        if (!isScheduler && !vm.get('newFwa')) {
            if (settings.fwaAddWorkCode != 'A') {
                if (settings.fwaAddWorkCode == 'N') {
                    vm.set('noWorkCodeRights', true);
                    //disable delete work code also
                    Ext.Array.each(me.getView().query('actioncolumn'), function (column) {
                        Ext.Array.each(column.items, function (item) {
                            //only turn off delete action
                            item.disabled = item.handler == 'deleteWorkItem';
                        });
                    });
                } else if (settings.fwaAddWorkCode == 'M') {
                    if (!isCrewChief) {
                        vm.set('noWorkCodeRights', true);
                        Ext.Array.each(me.getView().query('actioncolumn'), function (column) {
                            Ext.Array.each(column.items, function (item) {
                                //only turn off delete action
                                item.disabled = item.handler == 'deleteWorkItem';
                            });
                        });
                    }
                }
            }
        }

        //check security settings for modifying fwa
        if (!isScheduler) {
            if (record.get('fwaStatusId') == FwaStatus.Create && !me.getViewModel().get('newFwa')) return;
            if (!canModify) {
                me.setFormReadOnly();
            }
        }

        //check if scheduler or is chief
        if (isScheduler || canModify) {
            saveButton.setDisabled(false);
            submitButton.setDisabled(false);
        } else {
            saveButton.setDisabled(true);
            submitButton.setDisabled(true);
        }

        //check if cannot modify & can copy/create new Fwa
        if (!isScheduler) {
            if (!settings.fwaCreateNew) {
                if (newFwaButton) {
                    newFwaButton.setHidden(true);
                }
            } else {
                //copy fwa allowed even if cannot create new
                copyButton.setDisabled(false);
                if (!isCrewChief) {
                    if (newFwaButton) {
                        newFwaButton.setHidden(false);
                    }
                }
            }
        }

    },

    showSignature: function (data, signatureType, ct) {
        if (data) {
            // Load AttachmentData and handle as image
            var me = this,
                settings = TS.app.settings,
                approvalFieldset = me.lookup(signatureType === AttachmentType.EmpSignature ? 'fwaChiefApprovalFieldset' : 'fwaClientApprovalFieldset');
            //show-hide all signatures button
            approvalFieldset.config.attachmentId = data.attachmentId;
            approvalFieldset.lookup('viewAllSignaturesButton').setHidden(ct <= 1);
            //load latest signature
            approvalFieldset.getController().refreshApproval(data.attachmentItem, data.dateAttached);
        }
    },

    /*
     * Destroy the form on hide
     */
    onFwaFormHide: function () {
        this.closeView();
    },

    onWbs1ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView(),
            wbs1 = me.lookup('fwawbs1id'),
            wbs2 = me.lookup('fwawbs2id'),
            wbs3 = me.lookup('fwawbs3id'),
            wbs2Store = wbs2.getStore(),
            wbs3Store = wbs3.getStore(),
            record = me.getView().getForm().getRecord();
        //need to check if event is a period '.' keystroke
        if (newValue && newValue.slice(-1) == '.') {
            return false;
        }
        // Set the read only label box
        if (field.getSelectedRecord()) {
            me.lookup(field.nameField).setValue(field.getSelectedRecord().get('name'));
            if (field.getSelectedRecord().get('clientId')) {
                Ext.first('#clientNameField').setValue(field.getSelectedRecord().get('clientName'));
                Ext.first('#clientIdField').setValue(field.getSelectedRecord().get('clientId'));
            }
        } else if (record.get('wbs1name')) {
            me.lookup(field.nameField).setValue(record.get('wbs1name'));
            if (record.get('clientId')) {
                Ext.first('#clientNameField').setValue(record.get('clientName'));
                Ext.first('#clientIdField').setValue(record.get('clientId'));
            }
        } else {
            me.lookup(field.nameField).setValue(null);
        }
        // Clear the other WBS field stores
        wbs2.clearValue();
        wbs3.clearValue();
        if (field.getValue()) {
            wbs2Store.removeAll();
            wbs3Store.removeAll();
            wbs2Store.getProxy().extraParams['wbs1'] = field.getValue();
            wbs2Store.getProxy().extraParams['app'] = 'FWA';
            wbs3Store.getProxy().extraParams['wbs1'] = field.getValue();
            wbs2Store.load();
            wbs3Store.load();
        }

        //need to check if old value exists, change listener happens when you first touch editor combobox
        if (!vm.get('hasWbs2') && field.getValue() && !vm.get('newFwa')) {
            me.getFwaUnitsByWbs();
        }

        if (vm.get('newFwa') && field.getValue()) {
            if (!record.get('wbs2') && !vm.get('hasWbs2')) {
                me.onGetFwaInfoForWbs();
            }
        }
        if (!vm.get('hasWbs2') && field.getValue()) {
            me.onGetFwaDropdownValuesByWbs();
        }
    },

    onWbs2ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel(),
            wbs1 = me.lookup('fwawbs1id'),
            wbs2 = me.lookup('fwawbs2id'),
            wbs3 = me.lookup('fwawbs3id'),
            wbs3Store = wbs3.getStore(),
            record = me.getView().getForm().getRecord();

        //console.log(field.getSelectedRecord());
        if (field.getSelectedRecord()) {
            me.lookup(field.nameField).setValue(field.getSelectedRecord().get('name'));
        } else if (record.get('wbs2name')) {
            me.lookup(field.nameField).setValue(record.get('wbs2name'));
        } else {
            me.lookup(field.nameField).setValue(null);
        }

        //wbs3.clearValue();
        //wbs3Store.removeAll();
        if (field.getValue()) {
            wbs3 = me.lookup('fwawbs3id');
            wbs3.getStore().removeAll();
            wbs3.getStore().getProxy().extraParams['wbs1'] = wbs1.getValue();
            wbs3.getStore().getProxy().extraParams['wbs2'] = field.getValue();
            wbs3.getStore().getProxy().extraParams['app'] = 'FWA';
            wbs3.getStore().load({
                callback: function (records, operation, success) {
                    if (wbs3.getValue()) {
                        Ext.each(records, function (rec) {
                            if (rec.get('id') == wbs3.getValue()) {
                                Ext.first('#fwawbs3name').setValue(rec.get('name'));
                                return false;
                            }
                        });
                    } else {
                        wbs3.clearValue();
                        Ext.first('#fwawbs3name').setValue('');
                    }
                }
            });
        }

        if (!vm.get('hasWbs3') && field.getValue() && vm.get('newFwa')) {
            me.getFwaUnitsByWbs();
        }

        if (vm.get('newFwa') && field.getValue() && !vm.get('hasWbs3')) {
            me.onGetFwaInfoForWbs();
            vm.set('hasWbs2', null);
        }

        if (!vm.get('hasWbs3') && field.getValue()) {
            me.onGetFwaDropdownValuesByWbs();
        }

    },

    onWbs3ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel(),
            wbs3 = me.lookup('fwawbs3id'),
            wbs1 = me.lookup('fwawbs1id').getValue(),
            wbs2 = me.lookup('fwawbs2id').getValue(),
            record = me.getView().getForm().getRecord();
        //console.log();
        if (field.getSelectedRecord()) {
            me.lookup(field.nameField).setValue(field.getSelectedRecord().get('name'));
        } else if (record.get('wbs3name')) {
            me.lookup(field.nameField).setValue(record.get('wbs3name'));
        } else {
            me.lookup(field.nameField).setValue(null);
        }

        if (wbs1 && wbs2) {
            me.getFwaUnitsByWbs();
            me.onGetFwaDropdownValuesByWbs();
        }

        if (vm.get('newFwa') && field.getValue() && wbs1 && wbs2) {
            me.onGetFwaInfoForWbs();
            vm.set('hasWbs3', null);
        }

    },

    onGetFwaDropdownValuesByWbs: function () {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            wbs1 = me.lookup('fwawbs1id').getValue(),
            wbs2 = me.lookup('fwawbs2id').getValue(),
            wbs3 = me.lookup('fwawbs3id').getValue(),
            contactField = me.lookup('contactField'),
            record = me.getView().getForm().getRecord();
        //get current values, not record values
        wbs1 = wbs1 ? wbs1 : '^';
        wbs2 = wbs2 ? wbs2 : '^';
        wbs3 = wbs3 ? wbs3 : '^';

        Fwa.GetFwaDropdownValuesByWbs(null, settings.username, record.get('fwaId'), wbs1, wbs2, wbs3, function (response) {
            if (response && response.success) {
                //display warning message and continue
                if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                    Ext.Msg.alert('Warning', response.message.mdBody);
                }
                if (response.data != '') {
                    var lists = response.data,
                        vm = me.getViewModel(),
                        vw = me.getView();
                    Ext.each(lists, function (list) {
                        var data = [],
                            comboBox = vw.lookup(list.udfId + '_combo'),
                            store = Ext.create('Ext.data.Store', {
                                fields: ['key', 'value']
                            });
                        //data.push({key:'', value: ''});
                        Ext.each(list.valuesAndTexts, function (value) {
                            var item = {
                                key: value.Key,
                                value: value.Value
                            };
                            data.push(item);
                        })
                        store.setData(data);
                        vw.lookup(list.udfId + '_text').setHidden(vm.get('hideUdf_' + list.udfId.split('_')[1] + '_text'));
                        if (list.udfId.indexOf('udf_a') > -1) {
                            if (vm.get('hideUdf_' + list.udfId.split('_')[1] + '_text') && vm.get('hideUdf_' + list.udfId.split('_')[1] + '_combo'))
                                vw.lookup(list.udfId + '_filler').setHidden(false);
                        }
                        comboBox.setStore(store);
                        comboBox.setHidden(vm.get('hideUdf_' + list.udfId.split('_')[1] + '_combo'));

                        if (record.get(list.udfId)) {
                            comboBox.setValue(record.get(list.udfId));
                        }
                        //me.setIsComboValue(list.udfId);
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

        if (TS.app.settings.isFwaCopy) return;

        var me = this,
            settings = TS.app.settings,
            fwaNameField = me.lookup('fwaNameField'),
            crewNameField = me.lookup('scheduledCrewNameDisplay'),
            fwaNumField = me.lookup('fwaNumField'),
            contactInfoField = me.lookup('contactField'),
            contractWorkField = me.lookup('contractCheckbox'),
            loc = me.getView().getForm().getRecord().data.loc,
            units = Ext.first('grid-unit').getStore(),
            wbsLocked = me.lookup('wbsLockedCheckbox'),
            udfT1 = me.lookup('udf_t1_text'),
            udfT2 = me.lookup('udf_t2_text'),
            udfT3 = me.lookup('udf_t3_text'),
            udfT4 = me.lookup('udf_t4_text'),
            udfT5 = me.lookup('udf_t5_text'),
            udfT6 = me.lookup('udf_t6_text'),
            udfT7 = me.lookup('udf_t7_text'),
            udfT8 = me.lookup('udf_t8_text'),
            udfT9 = me.lookup('udf_t9_text'),
            udfT10 = me.lookup('udf_t10_text'),

            udfT1Combo = me.lookup('udf_t1_combo'),
            udfT2Combo = me.lookup('udf_t2_combo'),
            udfT3Combo = me.lookup('udf_t3_combo'),
            udfT4Combo = me.lookup('udf_t4_combo'),
            udfT5Combo = me.lookup('udf_t5_combo'),
            udfT6Combo = me.lookup('udf_t6_combo'),
            udfT7Combo = me.lookup('udf_t7_combo'),
            udfT8Combo = me.lookup('udf_t8_combo'),
            udfT9Combo = me.lookup('udf_t9_combo'),
            udfT10Combo = me.lookup('udf_t10_combo'),

            udfA1 = me.lookup('udf_a1_text'),
            udfA2 = me.lookup('udf_a2_text'),
            udfA3 = me.lookup('udf_a3_text'),
            udfA4 = me.lookup('udf_a4_text'),
            udfA5 = me.lookup('udf_a5_text'),
            udfA6 = me.lookup('udf_a6_text'),

            udfA1Combo = me.lookup('udf_a1_combo'),
            udfA2Combo = me.lookup('udf_a2_combo'),
            udfA3Combo = me.lookup('udf_a3_combo'),
            udfA4Combo = me.lookup('udf_a4_combo'),
            udfA5Combo = me.lookup('udf_a5_combo'),
            udfA6Combo = me.lookup('udf_a6_combo'),

            udfD1 = me.lookup('udf_d1_field'),
            udfD2 = me.lookup('udf_d2_field'),
            udfD3 = me.lookup('udf_d3_field'),
            udfC1 = me.lookup('udf_c1_Checkbox'),
            workCodes = Ext.first('grid-workauth').getStore(),
            hours = Ext.first('grid-employeehours').getStore(),
            clientSigReqCheckbox = Ext.first('#clientSigReqCheckbox'),
            chiefSigReqCheckbox = Ext.first('#chiefSigReqCheckbox'),
            empGroupId = settings.empGroupId,
            models = [],
            locModel = [],
            wbs1 = me.lookup('fwawbs1id').getValue() || '^',
            wbs2 = me.lookup('fwawbs2id').getValue() || '^',
            wbs3 = me.lookup('fwawbs3id').getValue() || '^',
            fwaInfo = Ext.create('TS.model.fwa.FwaInfo'),
            unitCodeStore = Ext.getStore('UnitCode');

        me.clearAddressFields();
        me.lookup('contactField').setValue('');
        me.lookup('udf_t1_text').setValue('');
        me.lookup('udf_t2_text').setValue('');
        me.lookup('udf_t3_text').setValue('');
        me.lookup('udf_t4_text').setValue('');
        me.lookup('udf_t5_text').setValue('');
        me.lookup('udf_t6_text').setValue('');
        me.lookup('udf_t7_text').setValue('');
        me.lookup('udf_t8_text').setValue('');
        me.lookup('udf_t9_text').setValue('');
        me.lookup('udf_t10_text').setValue('');

        udfT1Combo.setValue('');
        udfT2Combo.setValue('');
        udfT3Combo.setValue('');
        udfT4Combo.setValue('');
        udfT5Combo.setValue('');
        udfT6Combo.setValue('');
        udfT7Combo.setValue('');
        udfT8Combo.setValue('');
        udfT9Combo.setValue('');
        udfT10Combo.setValue('');

        me.lookup('udf_a1_text').setValue('');
        me.lookup('udf_a2_text').setValue('');
        me.lookup('udf_a3_text').setValue('');
        me.lookup('udf_a4_text').setValue('');
        me.lookup('udf_a5_text').setValue('');
        me.lookup('udf_a6_text').setValue('');

        udfA1Combo.setValue('');
        udfA2Combo.setValue('');
        udfA3Combo.setValue('');
        udfA4Combo.setValue('');
        udfA5Combo.setValue('');
        udfA6Combo.setValue('');

        me.lookup('udf_d1_field').setValue('');
        me.lookup('udf_d2_field').setValue('');
        me.lookup('udf_d3_field').setValue('');
        me.lookup('contractCheckbox').setValue(false);
        me.lookup('clientSigReqCheckbox').setValue(false);
        me.lookup('chiefSigReqCheckbox').setValue(false);
        me.lookup('udf_c1_Checkbox').setValue(false);
        if (!wbs1 && !wbs2 && !wbs3) {
            return;
        }
        //delete any lingering entries
        hours.removeAll();
        workCodes.removeAll();
        units.removeAll();

        Fwa.GetFwaInfoForWbs(null, empGroupId, wbs1 || '^', wbs2 || '^', wbs3 || '^', function (response) {

            if (response && response.success) {
                if (!response.data) return;
                fwaInfo = response.data;
                models = fwaInfo.fieldInfo.split('^');
                Ext.each(models, function (model) {
                    model.trim();
                    if (model.indexOf('fwaName') == 0) { // && fwaNameField.getValue() == ''
                        fwaNameField.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('fwaNumber') == 0 && fwaNumField.getValue() == '') {
                        fwaNumField.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('contactInfo') == 0) { //&& contactInfoField.getValue() == ''
                        contactInfoField.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('isContractWork') == 0) {
                        contractWorkField.setValue(model.split('=')[1] !== 'N');
                    }
                    if (model.indexOf('wbsLocked') == 0) {
                        wbsLocked.setValue(model.split('=')[1] !== 'N');
                    }
                    if (model.indexOf('udfT1') == 0 && model.split('=')[0].length < 6) {
                        udfT1.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT2') == 0) {
                        udfT2.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT3') == 0) {
                        udfT3.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT4') == 0) {
                        udfT4.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT5') == 0) {
                        udfT5.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT6') == 0) {
                        udfT6.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT7') == 0) {
                        udfT7.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT8') == 0) {
                        udfT8.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT9') == 0) {
                        udfT9.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfT10') == 0) {
                        udfT10.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('clientSigReq') == 0) {
                        clientSigReqCheckbox.setValue(model.split('=')[1] !== 'N');
                    }
                    if (model.indexOf('chiefSigReq') == 0) {
                        chiefSigReqCheckbox.setValue(model.split('=')[1] !== 'N');
                    }
                    if (model.indexOf('loc.address1') == 0) {
                        Ext.first('#address1Field').setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('loc.address2') == 0) {
                        Ext.first('#address2Field').setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('loc.city') == 0) {
                        Ext.first('#cityField').setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('loc.state') == 0) {
                        Ext.first('#stateField').setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('loc.zip') == 0) {
                        Ext.first('#zipField').setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('loc.latitude') == 0) {
                        Ext.first('#latitudeField').setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('loc.longitude') == 0) {
                        Ext.first('#longitudeField').setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfA1') == 0) {
                        udfA1.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfA2') == 0) {
                        udfA2.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfA3') == 0) {
                        udfA3.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfA4') == 0) {
                        udfA4.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfA5') == 0) {
                        udfA5.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfA6') == 0) {
                        udfA6.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfD1') == 0) {
                        udfD1.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfD2') == 0) {
                        udfD2.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfD3') == 0) {
                        udfD3.setValue(model.split('=')[1]);
                    }
                    if (model.indexOf('udfC1') == 0) {
                        udfD3.setValue(model.split('=')[1] !== 'N');
                    }

                });

                Ext.each(locModel, function (loc) {

                });

                Ext.each(fwaInfo.workInfo, function (wc) {
                    workCodes.add(Ext.create('TS.model.fwa.Work', {
                        workCodeId: wc.workCodeId,
                        workCodeAbbrev: wc.workCodeAbbrev,
                        scheduledHours: wc.scheduledHours,
                        actualHours: wc.actualHours,
                        comments: wc.comments,
                        picRequired: wc.picRequired,
                        pctComplete: wc.pctComplete
                    }));
                });

                if (workCodes.getRange().length > 0 && crewNameField.getValue()) {
                    var crew = Ext.getStore('AllCrews').findRecord('crewName', crewNameField.getValue()),
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

                Ext.each(fwaInfo.unitInfo, function (unit) {
                    units.add(Ext.create('TS.model.fwa.Unit', {
                        unitCodeId: unit.unitCodeId,
                        quantity: unit.quantity,
                        equipmentId: unit.equipmentId,
                        equipmentName: unit.equipmentName,
                        comments: unit.comments,
                        details: unit.details,
                        unitSeq: unit.unitSeq,
                        unitDate: unit.unitDate <= '0001-01-01T00:00:00' ? new Date() : unit.unitDate
                    }));
                });

                settings.fwaactionsInfo = [];
                Ext.each(fwaInfo.FieldActionsInfo, function (action) {
                    settings.fwaactionsInfo.push(Ext.create('TS.model.fwa.FwaAction', {
                        actionItemId: action.actionItemId,
                        actionItemDescr: action.actionItemDescr,
                        actionTypeId: action.actionTypeId,
                        actionOwnerId: action.actionOwnerId ? actionOwnerId : settings.empId,
                        actionDateCompleted: action.actionDateCompleted,
                        actionNotes: action.actionNotes
                    }));
                });

            } else if (response) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, me, {
            autoHandle: true
        });

    },

    /*
     * Bound to the form fields in address-fieldset, keeps the form model synced
     */
    onAddressChange: function (field, newValue) {
        var record = this.getView().getRecord(),
            updateValue = {};
        updateValue[field.getName()] = newValue;
        record.set('loc', Ext.Object.merge(record.get('loc'), updateValue));
        field.resetOriginalValue();
        this.fireEvent('refreshGeocoding', record.get('loc'));
    },

    /*
     * Attachment Window handlers
     */
    showAttachPhotoWindow: function (owningModelId) {

        var me = this,
            windowAttachment,
            settings = TS.app.settings,
            id = (typeof owningModelId) == 'string' ? owningModelId : me.getView().getRecord().getId();
        if (me.windowAttachment) {
            me.windowAttachment.close();
        }

        me.windowAttachment = Ext.create('TS.view.fwa.Attachment', {
            attType: 'Photo',
            location: settings.imageStorageLoc,
            modal: true,
            autoShow: true,
            associatedRecordId: id,
            attachmentsList: {
                modelType: 'FWA',
                modelId: id,
                attachmentType: AttachmentType.Photo
            }
        });

        me.windowAttachment.lookup('includeTemplates').setHidden(true);
    },

    showAttachDocWindow: function (owningModelId) {
        var me = this,
            recordId = owningModelId,
            settings = TS.app.settings,
            windowAttachment,
            id = (typeof owningModelId) == 'string' ? owningModelId : me.getView().getRecord().getId();

        if (me.windowAttachment) {
            me.windowAttachment.close();
        }

        me.windowAttachment = Ext.create('TS.view.fwa.Attachment', {
            attType: 'Document',
            location: settings.documentStorageLoc,
            modal: true,
            associatedRecordId: id,
            attachmentsList: {
                modelType: 'FWA',
                modelId: id,
                attachmentType: AttachmentType.Document
            },
            autoShow: true
        });
    },

    showSignatureWindow: function (component) {
        var settings = TS.app.settings;
        Ext.create('TS.common.window.Signature', {
            attType: (component.up('fieldset').signatureType === AttachmentType.ClientSignature ? 'Signature' : 'Employee'),
            location: settings.imageStorageLoc,
            associatedRecordId: this.getView().getRecord().getId()
        }).show();
    },

    showTimesheetExternal: function () {
        var record = this.getView().getRecord();
        if (record) {
            this.getSelectedTimesheet(record.get('schedEndDate'));
        }
    },

    getSelectedTimesheet: function (endDate) {

        var view = this.getViewModel(),
            settings = TS.app.settings,
            initialTimesheet = null,
            w = window,
            d = document,
            e = d.documentElement,
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;

        TimeSheet.GetByEmployeeByDate(null, settings.username, 0, 1000, settings.empId, endDate, false, function (response) {

            initialTimesheet = response.data;
            view.set('startDate', new Date(initialTimesheet.startDate));
            view.set('endDate', new Date(initialTimesheet.endDate));
            view.set('hideColumn', true);

            var startDate = Ext.Date.format(new Date(initialTimesheet.startDate), Ext.Date.defaultFormat),
                tsDate = Ext.Date.format(new Date(initialTimesheet.endDate), Ext.Date.defaultFormat);

            view.set('isFwaViewTS', true);
            Ext.create('TS.view.ts.TimesheetEmployee', {
                title: settings.empName + ': ' + startDate + ' - ' + tsDate,
                employeeId: initialTimesheet.tsEmpId,
                endDate: tsDate,
                employeeTimesheet: initialTimesheet,
                tsPeriodId: initialTimesheet.tsPeriodId,
                modal: true,
                isViewOnly: true,
                isHidden: true,
                width: x * .90,
                height: y * .90
            }).show();

        }, this, {
            autoHandle: true
        });
    },

// Controller listen callbacks
    afterSignatureUpload: function (signatureType, imageSrc) {
        // Was this signature from a client or a chief?
        var fieldsetReference = (signatureType === 'Signature' ? 'fwaClientApprovalFieldset' : 'fwaChiefApprovalFieldset');
        this.lookup(fieldsetReference).down('datefield').setValue(new Date()); // TODO - Where does this wire up to the model?
        this.lookup(fieldsetReference).getController().refreshApproval(imageSrc);
    },

    showProjectLookupWindow: function (e) {
        var me = this,
            projectLookupWindow;

        if (me.projectLookupWindow) {
            me.projectLookupWindow.close(); // Close editor if it already exists
        }
        me.projectLookupWindow = Ext.create('TS.common.window.ProjectLookup', {
            callingPage: 'FWA',
            app: e.app
        }).show();
    },

    setProjectValues: function (wbs1, wbs2, wbs3) {
        var me = this,
            vm = me.getViewModel();
        // Set values of wbs' dropdowns and let event onWbsComboChange do the work
        vm.set('wbs1Value', '');
        vm.set('wbs2Value', '');
        vm.set('wbs3Value', '');
        me.lookup('fwawbs1id').setValue(null);
        me.lookup('fwawbs2id').setValue(null);
        me.lookup('fwawbs3id').setValue(null);
        TS.app.settings.fromProjectTree = true;
        if (wbs3) {
            vm.set('wbs3Value', wbs3.get('id'));
            vm.set('hasWbs2', true);
            vm.set('hasWbs3', true);
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
            Ext.first('#fwawbs2id').setValue(wbs2.get('id'));
            Ext.first('#fwawbs3id').setValue(wbs3.get('id'));
        } else if (wbs2) {
            vm.set('hasWbs2', true);
            vm.set('hasWbs3', false);
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
            Ext.first('#fwawbs2id').setValue(wbs2.get('id'));
        } else if (wbs1) {
            vm.set('hasWbs2', false);
            vm.set('hasWbs3', false);
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
        }
    },

    showPrinter: function () {
        var action = arguments[arguments.length - 1],
            settings = TS.app.settings,
            view = this.getView(),
            myClone = view.getRecord().clone();

        if (view.getForm().isDirty() || view.getForm().dirty) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    view.fireEvent('showprinter', myClone.get('fwaId'), 'FWA', myClone.get('fwaNum'), settings.empId);
                }
            });
        } else {
            view.fireEvent('showprinter', myClone.get('fwaId'), 'FWA', myClone.get('fwaNum'));
        }
    },

    showEmailWindow: function (btn) {
        var action = arguments[arguments.length - 1],
            me = this,
            view = me.getView(),
            modelId = view.getRecord().get('fwaId'),
            settings = TS.app.settings,
            data,
            emailWindow,
            data,
            fwa = Ext.first('#fwaForm').getForm(),
            items = fwa.getFields().items;

        if (me.emailWindow) {
            me.emailWindow.close();
        }

        if (fwa.dirty || settings.saveFirst) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    if (me.emailWindow) {
                        me.emailWindow.close();
                    }
                    data = me.massageFwaData();
                    data.attachments = [];
                    me.emailWindow = Ext.create('TS.common.window.Email', {
                        appType: 'FWA',
                        fwa: data,
                        modelId: modelId,
                        modal: true,
                        infoText: ' Attach ' + settings.fwaAbbrevLabel,
                        saveFirst: settings.saveFirst
                    }).show();
                }
            });
        } else {
            if (me.emailWindow) {
                me.emailWindow.close();
            }

            me.emailWindow = Ext.create('TS.common.window.Email', {
                appType: 'FWA',
                modal: true,
                modelId: modelId,
                infoText: ' Attach ' + settings.fwaAbbrevLabel,
                saveFirst: false
            }).show();
        }
    },

    onDateValidityChange: function (d, isValid, eOpts) {
        if (!isValid) {
            var vm = this.getViewModel(),
                rec = vm.get('rec');
            if (rec.get('fwaId')) {
                Ext.Msg.alert('Error', d.lastActiveError);
                if (d.reference == "schedStartDateField") {
                    d.setValue(rec.get('schedStartDate'));
                } else {
                    d.setValue(rec.get('schedEndDate'));
                }
            }
        }
    },

    onTimeValidityChange: function (t, isValid, eOpts) {
        if (!isValid) {
            var vm = this.getViewModel(),
                rec = vm.get('rec');
            if (rec.get('fwaId')) {
                Ext.Msg.alert('Error', t.lastActiveError);
                if (t.reference == "schedStartTimeField") {
                    t.setValue(rec.get('schedStartDate'));
                } else {
                    t.setValue(rec.get('schedEndDate'));
                }
            }
        }
    },

    onStartDateChange: function (t, nValue, oValue) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            record = vw.getRecord(),
            startDate = me.lookup('schedStartDateField').getValue(),
            endDate = me.lookup('schedEndDateField'),
            startTime = me.lookup('schedStartTimeField'),
            endTime = me.lookup('schedEndTimeField');

        if (!vw.config.isPopup && (nValue && oValue) && nValue != oValue && t.dirty && !t.wasDirty) {
            if (me.hasEmpHours(record.get('hours').getRange())) {
                Ext.Msg.alert('Warning', settings.crewLabel + ' and start/end times cannot be re-assigned if ' + settings.fwaAbbrevLabel + ' employee hours or comments have been entered.');
                t.suspendEvent('change');
                t.setValue(t.originalValue);
                t.resumeEvent('change');
            } else {
                if (!endDate.getValue() || endDate.getValue() < startDate.getValue())
                    endDate.setValue(startDate);
                //date header om Employee Hours
                if (me.getViewModel().get('newFwa')) {
                    vw.lookup('dateHeader').setValue(Ext.Date.format(new Date(startDate), DATE_FORMAT));
                    vw.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(startDate), DATE_FORMAT));
                }
            }
        }

        if (me.getViewModel().get('newFwa') && nValue) {
            endDate.setValue(new Date(nValue));
            if (!startTime.getValue())
                startTime.setValue(new Date(settings.schedVisibleHoursStart));
            if (!endTime.getValue())
                endTime.setValue(Ext.Date.add(new Date(settings.schedVisibleHoursStart), Ext.Date.HOUR, 1));
            //date header om Employee Hours
            vw.lookup('dateHeader').setValue(Ext.Date.format(new Date(startDate), DATE_FORMAT));
            vw.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(startDate), DATE_FORMAT));
        }

        me.onTimeChange(t);

        if (record.get('fwaStatusId') == FwaStatus.Create) {
            vw.lookup('dateHeader').setValue(Ext.Date.format(new Date(startDate), DATE_FORMAT));
            vw.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(startDate), DATE_FORMAT));
            Ext.each(record.get('units').getRange(), function (unit) {
                unit.set('unitDate', Ext.Date.format(new Date(startDate), DATE_FORMAT));
            });
        }

    },

    onEndDateChange: function (t, nValue, oValue) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            record = vw.getRecord(),
            startDate = vw.lookup('schedStartDateField').getValue(),
            endDate = vw.lookup('schedEndDateField').getValue();
        //durationField = vw.lookup('recurDurationDate');

        //durationField.setDisabled(false);
        if (!vw.config.isPopup && (nValue && oValue) && nValue != oValue && t.dirty && !t.wasDirty) {
            if (me.hasEmpHours(record.get('hours').getRange())) {
                Ext.Msg.alert('Warning', settings.crewLabel + ' and start/end times cannot be re-assigned if ' + settings.fwaAbbrevLabel + ' employee hours have been entered.');
                t.suspendEvent('change');
                t.setValue(t.originalValue);
                t.resumeEvent('change');
            } else {
                if (!startDate) {
                    vw.lookup('schedStartDateField').setValue(endDate);
                }
            }
        }
        me.onTimeChange(t);
    },

    startEndTimeChange: function (t, nValue, oValue) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            record = vw.getRecord(),
            startDate = me.lookup('schedStartDateField').getValue(),
            endDate = me.lookup('schedEndDateField').getValue(),
            startTimeValue = me.lookup('schedStartTimeField').getValue(),
            endTime = me.lookup('schedEndTimeField');

        if (!vw.config.isPopup && (nValue && oValue) && nValue != oValue && t.dirty && !t.wasDirty) {
            if (me.hasEmpHours(record.get('hours').getRange())) {
                Ext.Msg.alert('Warning', settings.crewLabel + ' and start/end times cannot be re-assigned if ' + settings.fwaAbbrevLabel + ' employee hours have been entered.');
                t.suspendEvent('change');
                t.setValue(oValue);
                t.resumeEvent('change');
            }
        }
        if (t.name == 'schedStartDate') {
            vw.lookup('schedEndTimeField').setValue(Ext.Date.add(new Date(t.getValue()), Ext.Date.HOUR, 1));
        }
        me.onTimeChange(t);
    },

    hasEmpHours: function (fwaHours) {
        var hasHours = false;
        Ext.each(fwaHours, function (hrs) {
            if (hrs.get('ovt2Hrs') + hrs.get('ovtHrs') + hrs.get('regHrs') + hrs.get('travelHrs') > 0) {
                hasHours = true;
            }
        });
        return hasHours;
    },

    hasFwaUnits: function (units) {
        var hasUnits = false;
        Ext.each(units, function (unit) {
            if (unit.get('quantity') > 0) {
                hasUnits = true;
            }
        });
        return hasUnits;
    },

    onDateOrderedChange: function () {

    },

    assignCrew: function () {
        var me = this,
            vm = me.getViewModel(),
            record = me.getView().getRecord(),
            hasUnits = me.hasFwaUnits(record.get('units').getRange()),
            hasHours = me.hasEmpHours(record.get('hours').getRange()),
            settings = TS.app.settings,
            store,
            crewAssign;

        // if (record.get('recurrenceConfig') && record.get('fwaStatusId') != FwaStatus.Create) {
        //     Ext.Msg.alert('Warning', 'This is a recurring ' + settings.fwaAbbrevLabel + '. ' + settings.crewLabel + ' cannot be re-assigned.');
        //     return false;
        // }

        if (hasUnits || hasHours) {
            Ext.Msg.alert('Warning', 'Crew cannot be re-assigned because Hours and/or Units have been entered.');
            return false;
        }

        if (me.crewAssign) {
            me.crewAssign.close();
        }

        me.crewAssign = Ext.create('TS.view.crew.CrewAssign', {
            selectedFwa: record,
            crewNameDisplay: me.lookup('scheduledCrewNameDisplay'),
            modal: true
        });

        store = Ext.first('grid-crewassign').getStore();
        store.filterBy(function (obj) {
            return obj.get('crewStatus') === 'A';
        });

        me.crewAssign.lookup('myCrewsOnlyButton').setHidden(vm.get('isScheduler'));
        me.crewAssign.show();
    },

    loadFwaNotes: function () {
        var me = this,
            vw = me.getView(),
            fwa = vw.getRecord(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            isCrewChief = me.checkForCrewChief(fwa, settings.empId) || vm.get('newFwa') || vm.get('isFwaScheduler'),
            arr = [],
            placeholderRec;
        //used to turn the notes editable
        vm.set('isCrewChief', isCrewChief);

        if (me.fwaNotes) {
            me.fwaNotes.close();
        }

        Ext.each(fwa.get('notes').getRange(), function (note) {
            placeholderRec = {
                empId: note.get('empId'),
                seq: note.get('seq'),
                contents: note.get('contents'),
                createDate: TS.common.Util.getInUTCDate(note.get('createDate')),
                modDate: TS.common.Util.getInUTCDate(note.get('modDate')),
                modUser: note.get('modUser'),
                canEdit: note.get('empId') == settings.empId,
                formattedDateEmployee: note.get('formattedDateEmployee')
            };
            arr.push(placeholderRec);
        });

        me.fwaNotes = Ext.create('TS.view.fwa.FwaNotes', {
            title: settings.fwaAbbrevLabel + ' Notes for ' + fwa.get('fwaNum'),
            modal: true,
            hidden: settings.schedReadOnly,// && settings.fwaReadOnly,
            fwa: fwa
        });
        Ext.first('#postNoteButton').setHidden(vw.config.isPopup);
        //load data for template
        Ext.first('#fwanotes').setData(arr);
        me.fwaNotes.show();
        //scroll to last entry
        Ext.first('#fwanotes').getTargetEl().scroll('b', 100000, true);
    },

    doCopyFwa: function () {
        var fwa = this.getView().getRecord(),
            form = Ext.first('#fwaForm').getForm();
        Ext.GlobalEvents.fireEvent('CopyFwa', fwa.get('fwaId'));
        //TS.app.redirectTo('copyfwa/' + fwa.get('fwaId'));
    },

    approveFwaForm: function () {
        var me = this,
            settings = TS.app.settings,
            fwa = me.getView().getRecord(),
            isDirty = me.getView().getForm().isDirty(),
            form = me.getView().getForm(),
            items = form.getFields().items,
            extraMessage = '',
            lastRecurrDate;
        //special allowances for recurring
        if (fwa.get('recurrencePattern')) {
            lastRecurrDate = fwa.get('recurrenceDatesInRange')[fwa.get('recurrenceDatesInRange').length - 1];
            if (new Date() > new Date(lastRecurrDate) && fwa.get('fwaStatusId') != FwaStatus.Submitted && fwa.get('fwaStatusId') != FwaStatus.Approved) {
                Ext.Msg.alert('Warning', 'A ' + settings.fwaAbbrevLabel + ' must be submitted before it can be approved.');
                return false;
            }
            if (fwa.get('lastSubmittedDate') <= fwa.get('lastApprovedDate')) {
                if (fwa.get('fwaStatusId') != FwaStatus.Submitted && fwa.get('fwaStatusId') != FwaStatus.Approved) {
                    Ext.Msg.alert('Warning', 'A ' + settings.fwaAbbrevLabel + ' must be submitted before it can be approved.');
                    return false;
                }
            }
        } else {
            //check status
            if (fwa.get('fwaStatusId') != FwaStatus.Submitted && fwa.get('fwaStatusId') != FwaStatus.Approved) {
                Ext.Msg.alert('Warning', 'A ' + settings.fwaAbbrevLabel + ' must be submitted before it can be approved.');
                return false;
            }
        }
        //check dirty
        Ext.each(items, function (i) {
            if (i.dirty) { // && i.originalValue
                fwa.dirty = true;
            }
        });

        if (fwa.get('recurrencePattern')) { //the previous submitted date of <date>?
            extraMessage = ' for all days up to the previous submitted date of  ' + Ext.Date.format(new Date(fwa.get('lastSubmittedDate')), 'Y-m-d') + '?';
        } else {
            extraMessage = ' on ' + Ext.Date.format(new Date(fwa.get('lastSubmittedDate')), 'Y-m-d') + '?';
        }
        if (isDirty || form.dirty) {
            Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                if (btn == 'yes') {
                    Ext.Msg.confirm('Please Confirm',
                        'Are you sure you want to approve ' + settings.fwaAbbrevLabel + ' ' + fwa.get('fwaNum') + ': ' + fwa.get('fwaName') + extraMessage,
                        me.onApproveConfirm, //the button callback +
                        me); //scope
                }
            });
        } else {
            Ext.Msg.confirm('Please Confirm',
                'Are you sure you want to approve ' + settings.fwaAbbrevLabel + ' ' + fwa.get('fwaNum') + ': ' + fwa.get('fwaName') + extraMessage,
                me.onApproveConfirm, //the button callback
                me); //scope
        }
    },

    removeFwaForm: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            fwa = me.getView().getRecord(),
            unitsEnabled = settings.fwaUnitsEnabled,
            additionalMessage,
            hrsReadOnly = false,
            hrsMessage = '',
            ttlHours = 0,
            ttlUnits = 0,
            unitsReadOnly = false,
            unitsMessage = '';

        Ext.each(fwa.get('hours').getRange(), function (entry) {
            if (entry.get('readOnly')) {
                hrsReadOnly = true;
                hrsMessage = entry.get('readOnlyReason');
            }
            ttlHours += entry.get('regHrs') + entry.get('ovtHrs') + entry.get('ovt2Hrs') + entry.get('travelHrs');
        });

        if (unitsEnabled) {
            Ext.each(fwa.get('units').getRange(), function (entry) {
                if (entry.get('readOnly')) {
                    unitsReadOnly = true;
                    unitsMessage = entry.get('readOnlyReason');
                }
                ttlUnits += entry.get('quantity');
            });
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

        if (vm.get('isScheduler')) {
            additionalMessage = ' from the field crew list';
        } else {
            additionalMessage = " from my crew's list";
        }
        Ext.Msg.confirm('Please Confirm',
            'Are you sure you want to remove ' + settings.fwaAbbrevLabel + ' ' + fwa.get('fwaNum') + ': ' + fwa.get('fwaName') + additionalMessage + '?',
            me.onRemoveFwaFormConfirm, //the button callback
            me
        ); //scope
    },

    onRemoveFwaFormConfirm: function (btn) {
        var me = this,
            settings = TS.app.settings,
            fwa = me.getView().getRecord();
        if (btn === 'yes') {
            Fwa.RemoveFwaStatus(null, settings.username, settings.empId, fwa.get('fwaId'), function (response) {
                if (response.success) {
                    Ext.Msg.alert('Removed', settings.fwaAbbrevLabel + ' has been successfully removed.');
                    me.afterFwaSave(fwa, true);
                } else if (!response.success) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                }
            }, me, {
                autoHandle: true
            });
        }
    },

    checkUnsaved: function () {
        var action = arguments[arguments.length - 1],
            isDirty = this.lookup('fwaForm').getForm().isDirty(),
            form = this.lookup('fwaForm').getForm();
        if (this.lookup('fwaForm')) {
            if (isDirty || form.dirty) {
                Ext.Msg.confirm('Unsaved Changes', 'You have unsaved changes. Do you want to discard your changes and continue?', function (btn) {
                    if (btn === 'yes') {
                        form.dirty = false;
                        action.resume();
                        Ext.GlobalEvents.fireEvent('resetDirtyState');
                    } else {
                        action.stop();
                        //Ext.GlobalEvents.fireEvent('Route:Silent');
                    }
                });
            } else {
                action.resume();
            }
        } else {
            action.resume();
        }
    },

    onApproveConfirm: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            fwa = me.getView().getRecord();

        if (btn === 'yes') {
            Fwa.Approve(null, settings.username, settings.empId, fwa.get('fwaId'), vm.get('isScheduler'), function (response) {
                if (response.success) {
                    Ext.Msg.alert('Approved', settings.fwaAbbrevLabel + ' Approved');
                    me.afterFwaSave(fwa, true);
                } else if (!response.success) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                }
            }, me, {
                autoHandle: true
            });
        }
    },

    showSearchWindow: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            fwa = me.getView().getRecord(),
            wcStore = Ext.getStore('WorkCodes'),
            searchWindow,
            list;

        if (me.searchWindow) {
            me.searchWindow.close();
        }

        vm.set('isChief', me.checkForCrewChief(fwa, settings.empId));
        me.searchWindow = Ext.create('TS.view.fwa.SearchFwa', {
            modal: true,
            fwaId: fwa.get('fwaId')
        });

        //default to current values for search
        Ext.first('#clientSearch').setValue(fwa.get('clientName'));
        Ext.first('#wbs1Search').setValue(fwa.get('wbs1'));
        Ext.first('#wbs2Search').setValue(fwa.get('wbs2'));
        Ext.first('#wbs3Search').setValue(fwa.get('wbs3'));
        me.getViewModel().set('selectFwaId', fwa.get('fwaId'));
        me.getViewModel().set('selectClientId', fwa.get('clientId'));
        me.searchWindow.show();
    },

    prePostFwaActions: function () {
        var me = this,
            record = me.getView().getForm().getRecord(),
            settings = TS.app.settings,
            grid,
            actionWindow,
            store;

        if (me.actionWindow) {
            me.actionWindow.close();
        }

        actionWindow = Ext.create('TS.view.fwa.FwaActions',
            {
                isGrid: false,
                fwaId: record.get('fwaId')
            });
        grid = Ext.first('grid-fwaactions');
        store = grid.getStore();
        //new code for pre=loaded actions

        if (settings.fwaactionsInfo && settings.fwaactionsInfo.length > 0) {
            Ext.each(settings.fwaactionsInfo, function (action) {
                store.add(action);
            });
            settings.fwaactionsInfo = [];
        }

        Ext.each(record.get('nonFieldActions').getRange(), function (action) {
            if (action.get('actionOwnerId') == '') {
                action.set('actionOwnerId', settings.empId);
            }
            store.add(action);
        });
        store.sort([
            {property: 'actionType', direction: 'DESC'}
        ]);
        actionWindow.show();
    },

    getFwaUnitsByWbs: function () {
        var me = this,
            vm = me.getViewModel(),
            form = Ext.first('#fwaForm').getForm(),
            settings = TS.app.settings,
            record = form.getRecord(),
            fwaUnitGrid = me.lookup('fwaUnitGrid'),
            unitCodeStore = Ext.getStore('UnitCode'),
            wbs1 = me.lookup('fwawbs1id').getValue(),
            wbs2 = me.lookup('fwawbs2id').getValue(),
            wbs3 = me.lookup('fwawbs3id').getValue(),
            contactField = me.lookup('contactField'),
            fwaUnitStore,
            data = [],
            fwaUnits = [];
        //get current values, not record values
        wbs1 = wbs1 ? wbs1 : '^';
        wbs2 = wbs2 ? wbs2 : '^';
        wbs3 = wbs3 ? wbs3 : '^';
        //create array of fwa units

        if (fwaUnitGrid.getStore().getRange().length == 0) {
            return;
        }
        data = Ext.Array.pluck(fwaUnitGrid.getStore().getRange(), 'data');
        //create array of unit details for each fwa unit
        Ext.each(data, function (unit) {
            if (Ext.typeOf(unit.details) != 'array')
                unit.details = Ext.Array.pluck(unit.details.getRange(), 'data');
        });
        UnitCode.GetFwaUnitsByWbs(null, settings.username, record.get('fwaId'), wbs1, wbs2, wbs3, data, function (response) {
            if (response && response.success) {
                //display warning message and continue
                if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                    Ext.Msg.alert('Warning', response.message.mdBody);
                    contactField.focus();
                    record.set('units', response.data);

                }
                //create Unit store and load
                var store = Ext.create('Ext.data.Store', {
                    model: 'TS.model.fwa.Unit'
                });

                //
                store.loadData(response.data);
                fwaUnitGrid.setStore(store);
                fwaUnitStore = fwaUnitGrid.getStore();
                fwaUnitStore.sort([{
                    property: 'unitSeq',
                    direction: 'ASC'
                }]);

            } else if (!response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }.bind(me));

    },

    onFwaRecurrsion: function (thisFwa) {
        var me = this,
            fwa = thisFwa && thisFwa.data ? thisFwa : me.getView().getRecord(),
            vm = me.getViewModel(),
            isScheduler = vm.get('isScheduler'),
            isNewFwa = vm.get('newFwa'),
            settings = TS.app.settings,
            isChief = me.checkForCrewChief(fwa, settings.empId),
            recurrsion;

        if (me.recurrsion) {
            me.recurrsion.close();
        }

        me.recurrsion = Ext.create('TS.view.fwa.Recurrsion', {
            modal: true,
            fwaRecord: fwa,
            fwaId: fwa.get('fwaId'),
            fwaStartDate: fwa.get('schedStartDate')
        });

        Ext.Array.each(me.recurrsion.query('button'), function (button) {
            if (!isScheduler) button.setDisabled(true);
            if (button.handler == 'onCancelRecurrence') button.setDisabled(false);
        });

        if(!settings.noCrew)
            me.recurrsion.show();
        settings.noCrew = false;
    },

    onResetDates: function () {
        var me = this;
        me.lookup('dateOrderedField').setValue('');
        me.lookup('dateRequiredField').setValue('');
        me.lookup('udf_d1_field').setValue('');
        me.lookup('udf_d2_field').setValue('');
        me.lookup('udf_d3_field').setValue('');
    },

    onResetStartEndDateTime: function () {
        var me = this,
            settings = TS.app.settings,
            startTime = me.lookup('schedStartTimeField'),
            endTime = me.lookup('schedEndTimeField'),
            startDate = me.lookup('schedStartDateField'),
            endDate = me.lookup('schedEndDateField');
        Ext.Msg.confirm("Please Confirm", "This will clear Start/End Dates & Times and un-schedule the " + settings.fwaAbbrevLabel + ". Do you wish to continue?", function (btn) {
            if (btn === 'yes') {
                startTime.setValue('');
                endTime.setValue('');
                endDate.setValue('');
                startDate.setValue('');
            }
        });
    },

    onTimeChange: function (t) {
        var me = this,
            vw = me.getView(),
            startDt = vw.lookup('schedStartDateField').getValue(),
            endDt = vw.lookup('schedEndDateField').getValue(),
            start = vw.lookup('schedStartTimeField').getValue(),
            startIsStandard = new Date(vw.lookup('schedStartDateField').getValue()).toString().includes('Standard'),
            endIsDaylight = new Date(vw.lookup('schedEndDateField').getValue()).toString().includes('Daylight'),
            startIsDaylight = new Date(vw.lookup('schedStartDateField').getValue()).toString().includes('Daylight'),
            endIsStandard = new Date(vw.lookup('schedEndDateField').getValue()).toString().includes('Standard'),
            end = vw.lookup('schedEndTimeField').getValue(),
            duration = vw.lookup('recurDurationDate'),
            fwa = vw.getRecord(),
            dayCount = vw.lookup('fwaDayCount'),
            newend,
            diff;

        if (startDt && endDt && start && end) {
            if (fwa.get('recurrenceConfig')) {
                //determine difference in minutes
                if (end < start) {
                    newend = Ext.Date.add(new Date(end), Ext.Date.DAY, 1);
                    //determine difference in minutes
                    diff = Ext.Date.diff(newend, start, Ext.Date.MINUTE);
                    diff = diff * -1;
                } else {
                    //determine difference in minutes
                    diff = Ext.Date.diff(start, end, Ext.Date.MINUTE);
                }
                //generate dates with time
                Sch.util.Date.copyTimeValues(startDt, start);
                Sch.util.Date.copyTimeValues(endDt, end);
                if (fwa.get('recurrenceDatesInRange'))
                    dayCount.setValue(fwa.get('recurrenceDatesInRange').length);
                else
                    dayCount.setValue(fwa.get('recurrenceConfig').count);
            } else {
                //generate dates with time
                Sch.util.Date.copyTimeValues(startDt, start);
                Sch.util.Date.copyTimeValues(endDt, end);
                //determine difference in minutes
                diff = Ext.Date.diff(startDt, endDt, Ext.Date.MINUTE);
                dayCount.setValue(Ext.Date.diff(startDt, endDt, Ext.Date.DAY) + 1);
            }
            //divide to get hours
            diff = diff / 60;
            if (diff > 0) {
                if (!fwa.get('recurrenceConfig')) {
                    if (startIsStandard && endIsDaylight) {
                        diff += 1;
                    } else if (startIsDaylight && endIsStandard) {
                        diff -= 1;
                    }
                }
                duration.setValue(diff);
            } else
                duration.setValue();
        }
    },

    beforeRenderTimeField: function (component) {
        var settings = TS.app.settings;
        component.increment = settings.schedTimeAxisGranularity;
        //console.log(component.increment);
    },

    lastUnitDate: function (component, e) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            record = vw.getRecord(),
            unitsGrid = me.lookup('fwaUnitGrid'),
            store,
            lastDt = vw.lookup('unitDateHeader').getValue(),
            unitDatesInRange = [],
            nextDate = '',
            utcDate = '',
            hasLastDate = false,
            currentIndex = 0,
            dateArrayLength;

        if (record.get('unitDatesInRange') && record.get('unitDatesInRange').length > 1) {
            unitDatesInRange = record.get('unitDatesInRange').sort(function (a, b) {
                return new Date(b) - new Date(a);
            });
        }
        dateArrayLength = unitDatesInRange.length;
        //go backwards
        Ext.each(unitDatesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), 'm/d/Y')) < new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), 'm/d/Y');
                hasLastDate = true;
                return false;
            }
        });

        unitsGrid.setStore(record.get('units'));
        store = unitsGrid.getStore();
        //check if date found
        if (hasLastDate) {
            store.clearFilter(true);
            store.setRemoteFilter(false);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }
        if (nextDate)
            vw.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        else
            vw.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(), DATE_FORMAT));
        //turn arrows on/off
        vw.lookup('lastUnitDate').setDisabled(currentIndex == dateArrayLength);
        vw.lookup('nextUnitDate').setDisabled(false);
    },

    nextUnitDate: function (component, e) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            record = vw.getRecord(),
            unitsGrid = me.lookup('fwaUnitGrid'),
            store,
            lastDt = vw.lookup('unitDateHeader').getValue(),
            unitDatesInRange = [],
            nextDate = '',
            utcDate,
            hasNextDate = false,
            currentIndex = 0,
            dateArrayLength = unitDatesInRange.length;

        if (record.get('unitDatesInRange') && record.get('unitDatesInRange').length > 1) {
            unitDatesInRange = record.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
        }
        dateArrayLength = unitDatesInRange.length;
        //go forward in dates
        Ext.each(unitDatesInRange, function (dt) {
            currentIndex++;
            utcDate = new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear();
            if (new Date(Ext.Date.format(new Date(utcDate), 'm/d/Y')) > new Date(lastDt)) {
                nextDate = Ext.Date.format(new Date(utcDate), 'm/d/Y');
                hasNextDate = true;
                return false;
            }
        });

        unitsGrid.setStore(record.get('units'));
        store = unitsGrid.getStore();
        //check if date found
        if (hasNextDate) {
            store.clearFilter(true);
            store.filterBy(function (rec) {
                return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(nextDate), DATE_FORMAT);
            });
        }
        if (nextDate)
            vw.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(nextDate), DATE_FORMAT));
        else
            vw.lookup('unitDateHeader').setValue(Ext.Date.format(new Date(), DATE_FORMAT));
        //turn arrows on/off
        vw.lookup('nextUnitDate').setDisabled(currentIndex == dateArrayLength);
        vw.lookup('lastUnitDate').setDisabled(false);
    },

    addUnitDate: function (component, e) {
        var me = this,
            addUnitDateWindow,
            unitDateHeader = Ext.first('#unitDateHeader');

        if (me.addUnitDateWindow) {
            me.addUnitDateWindow.close();
        }

        addUnitDateWindow = Ext.create('TS.view.fwa.AddUnitDate', {});
        Ext.first('#addUnitDateField').setValue(new Date(unitDateHeader.getValue()));
        addUnitDateWindow.show();
    },

    onCrewChange: function (component, newValue, oldValue) {
        var settings = TS.app.settings,
            me = this,
            vm = me.getViewModel(),
            crewNameField = me.lookup('scheduledCrewNameDisplay'),
            workCodes = Ext.first('grid-workauth').getStore(),
            hours = Ext.first('grid-employeehours').getStore();

        if (oldValue && newValue != oldValue) {
            settings.hasCrewChange = true;
        }

        if (vm.get('newFwa') && newValue) {
            hours.removeAll();
            if (workCodes.getRange().length > 0 && crewNameField.getValue()) {
                var crew = Ext.getStore('AllCrews').findRecord('crewName', crewNameField.getValue()),
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
        }
    },

    onHoursDateHeaderChange: function (component, newValue, oldValue) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            unitDateHeader = vw.lookup('unitDateHeader'),
            newDate = Ext.Date.format(new Date(newValue), DATE_FORMAT),
            record = vw.getRecord(),
            datesInRange;

        unitDateHeader.setValue(Ext.Date.format(new Date(newValue), DATE_FORMAT));
        if (record && record.get('recurrenceDatesInRange')) {
            datesInRange = record.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
            if (Ext.Date.format(new Date(datesInRange[datesInRange.length - 1]), DATE_FORMAT) == newValue) {
                vw.lookup('nextDate').setDisabled(true);
                vw.lookup('nextUnitDate').setDisabled(true);
            } else {
                vw.lookup('nextDate').setDisabled(false);
                vw.lookup('lastUnitDate').setDisabled(false);
            }
            if (Ext.Date.format(new Date(datesInRange[0]), DATE_FORMAT) == newValue) {
                vw.lookup('lastDate').setDisabled(true);
                vw.lookup('lastUnitDate').setDisabled(true);
            } else {
                vw.lookup('lastDate').setDisabled(false);
                vw.lookup('lastUnitDate').setDisabled(false);
            }
        }

    },

    onUnitsDateHeaderChange: function (component, newValue, oldValue) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            hoursDateHeader = vw.lookup('dateHeader'),
            newDate = Ext.Date.format(new Date(newValue), DATE_FORMAT),
            record = vw.getRecord(),
            datesInRange;

        hoursDateHeader.setValue(newDate);
        if (record && record.get('recurrenceDatesInRange')) {
            datesInRange = record.get('recurrenceDatesInRange').sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
            if (Ext.Date.format(new Date(datesInRange[datesInRange.length - 1]), DATE_FORMAT) == newValue) {
                vw.lookup('nextDate').setDisabled(true);
                vw.lookup('nextUnitDate').setDisabled(true);
            } else {
                vw.lookup('nextDate').setDisabled(false);
                vw.lookup('lastUnitDate').setDisabled(false);
            }
            if (Ext.Date.format(new Date(datesInRange[0]), DATE_FORMAT) == newValue) {
                vw.lookup('lastDate').setDisabled(true);
                vw.lookup('lastUnitDate').setDisabled(true);
            } else {
                vw.lookup('lastDate').setDisabled(false);
                vw.lookup('lastUnitDate').setDisabled(false);
            }
        }
    },

    onClickRefreshInfo: function () {
        var me = this;
        me.onGetFwaInfoForWbs();
    }


});
