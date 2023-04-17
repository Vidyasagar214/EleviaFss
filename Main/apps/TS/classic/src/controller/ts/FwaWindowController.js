/**
 * Created by steve.tess on 8/24/2015.
 */
Ext.define('TS.controller.ts.FwaWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-fwawindow',

    requires: [
        'TS.model.fwa.Fwa'
    ],

    listen: {
        controller: {
            '*': {
                'loadFwaRecord': 'loadFwaRecord'
            }
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {
        this.getFwaRecord();
    },

    doCopyFwa: function () {
        var me = this,
            vw = me.getView(),
            fwaId = vw.fwaId;
        TS.app.redirectTo('copyfwa/' + fwaId);
        vw.close();
        Ext.first('#searchFwa').close();
    },

    doOpenFwa: function (component, e) {
        var me = this,
            vw = me.getView(),
            fwaId = vw.fwaId;
        TS.app.redirectTo('fwa/' + fwaId);
        vw.close();
        Ext.first('#searchFwa').close();
    },

    doClose: function () {
        this.getView().close();
    },

    getFwaRecord: function () {
        var me = this,
            fwaId = me.getView().fwaId,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            hasNotes,
            existingRecord;
        TS.model.fwa.Fwa.getProxy().setExtraParams({
            fwaDate: Ext.Date.format(me.getView().schedStartDate, 'Ymd')
        });
        TS.model.fwa.Fwa.load(fwaId, {
            success: function (record, operation) {
                existingRecord = (record === undefined ? me.getView().record : record);
                if (existingRecord) {
                    // Existing FWA
                    hasNotes = existingRecord.get('hasNotes');
                    vm.set('notesCls', (hasNotes ? 'x-fa fa-folder-open yellowIcon' : 'x-fa fa-folder yellowIcon'));
                    me.loadFwaRecord(existingRecord);
                    me.setFormReadOnly();
                }
            }
        })
    },

    loadFwaRecord: function (record) {
        var me = this,
            vm = me.getViewModel(),
            attachments,
            isScheduler,
            hasSignatures,
            form = me.getView(),
            myFwa = me.lookup('myFwa'),
            fwaWorkGrid = myFwa.lookup('fwaWorkGrid'),
            employeeHoursGrid = myFwa.lookup('employeeHoursGrid'),
            settings = TS.app.settings,
            currentStatus = record.get('fwaStatusId'),
            tsViewModel = me.getView().lookupViewModel();
        //hide toolbar to stop multiple instances of same windows
        myFwa.lookup('fwaToolbar').setHidden(true);
        tsViewModel.set('clientSigReq', record.get('clientSigReq'));
        tsViewModel.set('chiefSigReq', record.get('chiefSigReq'));

        me.forms = [];

        if (record && (!record.get('preparedByEmpId') || record.get('preparedByEmpId') == '')) {
            record.set('preparedByEmpId', settings.empId);
        }

        me.refreshFormValues(record);

        me.getViewModel().set('newFwa', false);
        me.getViewModel().set('fwaStatusId', record.get('fwaStatusId'));

        //check if being called in scheduler & no signatures yet
        attachments = record.get('attachments');
        isScheduler = me.getViewModel().get('isScheduler');
        hasSignatures = false;
        Ext.each(attachments, function (ob) {
            Ext.Object.each(ob, function (property, value) {
                if ((ob.attachmentType == "E" || ob.attachmentType == "S") && isScheduler) {
                    hasSignatures = true;
                }
            });
        });

        if (isScheduler && !hasSignatures) {
            myFwa.lookup('fwaApprovalSetupFieldset').setHidden(false);
            myFwa.lookup('fwaChiefApprovalFieldset').setHidden(true);
            myFwa.lookup('fwaClientApprovalFieldset').setHidden(true);
        } else {
            // Show approval signature setup if creating new FWA
            myFwa.lookup('fwaApprovalSetupFieldset').setHidden(currentStatus != 'C');
            // Hide the signature fieldsets if creating new FWA
            myFwa.lookup('fwaChiefApprovalFieldset').setHidden(currentStatus == 'C');
            myFwa.lookup('fwaClientApprovalFieldset').setHidden(currentStatus == 'C');
        }

        form.lookup('doOpenFwaButton').setHidden(form.config.isFromTS || !vm.get('canWindowFwaCopyOpen')); //doCopyFwaButton
        form.lookup('doCopyFwaButton').setHidden(form.config.isFromTS || !vm.get('canWindowFwaCopyOpen'));

        me.setUdfFields();
        //since we have duplicate names for udf_t values we need to assign value if combos
        // if (settings.udf_t1_isCombo) {
        //     Ext.first('#udf_t1_combo').setValue(record.get('udf_t1'));
        // }
        // if (settings.udf_t2_isCombo) {
        //     Ext.first('#udf_t2_combo').setValue(record.get('udf_t2'));
        // }
        // if (settings.udf_t3_isCombo) {
        //     Ext.first('#udf_t3_combo').setValue(record.get('udf_t3'));
        // }
        // if (settings.udf_t4_isCombo) {
        //     Ext.first('#udf_t4_combo').setValue(record.get('udf_t4'));
        // }
        // if (settings.udf_t5_isCombo) {
        //     Ext.first('#udf_t5_combo').setValue(record.get('udf_t5'));
        // }
        // if (settings.udf_t6_isCombo) {
        //     Ext.first('#udf_t6_combo').setValue(record.get('udf_t6'));
        // }
        // if (settings.udf_t7_isCombo) {
        //     Ext.first('#udf_t7_combo').setValue(record.get('udf_t7'));
        // }
        // if (settings.udf_t8_isCombo) {
        //     Ext.first('#udf_t8_combo').setValue(record.get('udf_t8'));
        // }
        // if (settings.udf_t9_isCombo) {
        //     Ext.first('#udf_t9_combo').setValue(record.get('udf_t9'));
        // }
        // if (settings.udf_t10_isCombo) {
        //     Ext.first('#udf_t10_combo').setValue(record.get('udf_t10'));
        // }

        me.onGetFwaDropdownValuesByWbs();
    },

    onGetFwaDropdownValuesByWbs: function () {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            wbs1 = Ext.first('#fwawbs1id').getValue(),
            wbs2 = Ext.first('#fwawbs2id').getValue(),
            wbs3 = Ext.first('#fwawbs3id').getValue(),
            contactField = Ext.first('#contactField'),
            record = Ext.first('form-fwa').getForm().getRecord();
        //get current values, not record values
        wbs1 = wbs1 ? wbs1 : '^';
        wbs2 = wbs2 ? wbs2 : '^';
        wbs3 = wbs3 && wbs3 != ' ' ? wbs3 : '^';

        Fwa.GetFwaDropdownValuesByWbs(null, settings.username, record.get('fwaId'), wbs1, wbs2, wbs3, function (response) {
            if (response && response.success) {
                //display warning message and continue
                if (response.message && response.message.mdType && response.message.mdType == 'warning') {
                    Ext.Msg.alert('Warning', response.message.mdBody);
                }
                if (response.data != '') {
                    var lists = response.data,
                        vw = me.getView();
                    Ext.each(lists, function (list) {
                        var data = [],
                            comboBox = Ext.first('#'+list.udfId + '_combo'),
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
                        Ext.first('#'+list.udfId + '_text').setHidden(true);
                        Ext.first('#'+list.udfId + '_combo').setHidden(false);
                        if (list.udfId.indexOf('udf_a') > -1)
                            Ext.first('#'+list.udfId + '_filler').setHidden(true);
                        comboBox.setStore(store);
                        comboBox.setHidden(false);

                        if (record.get(list.udfId)) {
                            comboBox.setValue(record.get(list.udfId));
                        }
                        me.setIsComboValue(list.udfId);
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

    setUdfFields: function () {
        var me = this,
            vm = me.getViewModel(),
            form = me.getView().lookup('myFwa'),
            settings = TS.app.settings;
        //hide rows if all values hidden
        if (vm.get('hideUdf_t2') && vm.get('hideUdf_t3') && vm.get('hideUdf_t4')) {
            form.lookup('udfRowOne').setHeight(0);
            form.lookup('udfRowOne').setHidden(true);
        }
        if (vm.get('hideUdf_t5') && vm.get('hideUdf_t6') && vm.get('hideUdf_t7')) {
            form.lookup('udfRowTwo').setHeight(0);
            form.lookup('udfRowTwo').setHidden(true);
        }
        if (vm.get('hideUdf_t8') && vm.get('hideUdf_t9') && vm.get('hideUdf_t10')) {
            form.lookup('udfRowThree').setHeight(0);
            form.lookup('udfRowThree').setHidden(true);
        }
        if (vm.get('hideUdf_l1')) {
            form.lookup('udfRowFour').setHeight(0);
            form.lookup('udfRowFour').setHidden(true);
        }

        form.show().expand();

    },



    refreshFormValues: function (record) {

        var me = this,
            vw = me.getView(),
            myFwa = me.lookup('myFwa'),
            form = myFwa.getForm(),
            fwaWorkGrid = myFwa.lookup('fwaWorkGrid'),
            fwaUnitsGrid = myFwa.lookup('fwaUnitGrid'),
            employeeHoursGrid = myFwa.lookup('employeeHoursGrid'),
            expensesGrid = myFwa.lookup('employeeExpensesGrid'),
            clientSignatureCt = 0,
            chiefSignatureCt = 0,
            utcDate,
            datesInRange,
            currentIndex = 0;

        if (!record || !form) {
            return;
        }

        // Load the core record
        form.loadRecord(record);

        // Load the work store
        fwaWorkGrid.setStore(record.get('workSchedAndPerf'));

        // Load the employee hours store
        employeeHoursGrid.setStore(record.get('hours'));
        //expensesGrid.setStore(record.get('expenses'));
        var empStore = employeeHoursGrid.getStore();
        if (record.get('recurrenceDatesInRange') && record.get('recurrenceDatesInRange').length > 0) {
            if (record.get('recurrenceDatesInRange').length == 1) {
                Ext.first('#lastDate').setDisabled(true);
                Ext.first('#nextDate').setDisabled(true);
            } else {
                datesInRange = record.get('recurrenceDatesInRange').sort(function (a, b) {
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
                    } else if (matches && currentIndex == record.get('recurrenceDatesInRange').length) {
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
        //clear any filters
        empStore.clearFilter();
        //filter all
        empStore.filterBy(function (wcRec) {
            return Ext.Date.format(new Date(wcRec.get('workDate')), DATE_FORMAT) === Ext.Date.format(new Date(Ext.first('#dateHeader').getValue()), DATE_FORMAT);
        });

        //Load Expenses
        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.exp.Expense'
        });
        if (record.get('expenses')) {
            store.loadData(record.get('expenses'));
            expensesGrid.setStore(store);
            record.set('expenses', store.getData());
            //expensesGrid.setDisabled(true);
        }

        // load units grid
        fwaUnitsGrid.setStore(record.get('units'));

        // Load the address fieldset
        var loc = record.get('loc');
        if (loc) {
            form.setValues(record.get('loc'));
        }

        // Refresh time fields
        myFwa.lookup('schedStartTimeField').setValue(record.get('schedStartDate'));
        myFwa.lookup('schedEndTimeField').setValue(record.get('schedEndDate'));

        //check date fields
        if (Ext.Date.format(record.get('dateOrdered'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            myFwa.lookup('dateOrderedField').setValue();
        }
        if (Ext.Date.format(record.get('dateRequired'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            myFwa.lookup('dateRequiredField').setValue();
        }

        if (Ext.Date.format(record.get('udf_d1_field'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            myFwa.lookup('udf_d1_field').setValue();
        }
        if (Ext.Date.format(record.get('udf_d2_field'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            myFwa.lookup('udf_d2_field').setValue();
        }
        if (Ext.Date.format(record.get('udf_d3_field'), DATE_FORMAT) < Ext.Date.format(new Date('1/1/2002'), DATE_FORMAT)) {
            myFwa.lookup('udf_d3_field').setValue();
        }
        // Reset approval signatures
        //this.resetSignature();

        // Load the approval signature field using attachments array from FWA
        if (record.get('attachments') && record.get('attachments').length > 0) {

            // Load the client signature field
            var clientSignature = Ext.Array.findBy(record.get('attachments'), function (attachment) {
                return Ext.String.capitalize(attachment.attachmentType) == 'S';
            });
            Ext.each(record.get('attachments'), function (attachment) {
                if (Ext.String.capitalize(attachment.attachmentType) == AttachmentType.ClientSignature) {
                    clientSignatureCt++;
                }
            });

            me.showSignature(clientSignature, 'S', clientSignatureCt);

            // Load the chief signature field
            var chiefSignature = Ext.Array.findBy(record.get('attachments'), function (attachment) {
                return Ext.String.capitalize(attachment.attachmentType) == 'E';
            });
            Ext.each(record.get('attachments'), function (attachment) {
                if (Ext.String.capitalize(attachment.attachmentType) == AttachmentType.EmpSignature) {
                    chiefSignatureCt++;
                }
            });

            me.showSignature(chiefSignature, 'E', chiefSignatureCt);
        }

    },

    resetSignature: function () {
        var myFwa = this.lookup('myFwa');
        var clientFieldset = myFwa.lookup('fwaClientApprovalFieldset'),
            chiefFieldset = myFwa.lookup('fwaChiefApprovalFieldset');
        //if (clientFieldset) {
        //    clientFieldset.resetApproval();
        //}
        //if (chiefFieldset) {
        //    chiefFieldset.resetApproval();
        //}
    },

    showSignature: function (data, signatureType, ct) {

        if (data) {
            // Load AttachmentData and handle as image
            var settings = TS.app.settings,
                myFwa = this.lookup('myFwa'),
                approvalFieldset = myFwa.lookup(signatureType === 'E' ? 'fwaChiefApprovalFieldset' : 'fwaClientApprovalFieldset'),
                attData;

            AttachmentData.GetAttachmentDataById(null, settings.username, data.attachmentId, function (response, operation, success) {
                // Set the base64 on the image preview
                attData = response.data.attachmentItem;
                approvalFieldset.down('image').show().setSrc('data:application/octet-stream;base64,' + attData);//.setSrc(Ext.util.Base64.decode(attData));
                approvalFieldset.down('button').hide();
                //show-hide all signatures button
                approvalFieldset.config.attachmentId = data.attachmentId;
                approvalFieldset.lookup('viewAllSignaturesButton').setHidden(ct <= 1);
                //load latest signature
                approvalFieldset.getController().refreshApproval(data.attachmentItem, data.dateAttached);
                // Set the approval date
                approvalFieldset.down('textfield').setValue(Ext.Date.format(new Date(data.dateAttached), DATE_FORMAT + ' h:i A'));
            }, this, {
                autoHandle: true
            });
        }
    },

    setFormReadOnly: function () {
        var me = this,
            vw = me.getView();
        // Set form fields as read only
        me.lookup('myFwa').getForm().getFields().each(function (field) {
            field.setReadOnly(true);
        });
        // Disable any buttons
        Ext.Array.each(vw.query('button'), function (button) {
            if (button.reference != 'fwaInstructionsButton' && button.reference != 'nextDate' && button.reference != 'lastDate')
                button.setDisabled(true);
        });
        if (vw.lookup('lookupButton')) {
            vw.lookup('lookupButton').setDisabled(true);
        }

        //disable grids
        Ext.Array.each(vw.query('grid'), function (grid) {
            grid.on('beforeedit', function () {
                return false;
            });
            grid.on('dblclick', function () {
                return false;
            });
        });

        //disable work code image buttons
        Ext.Array.each(vw.query('actioncolumn'), function (column) {
            Ext.Array.each(column.items, function (item) {
                //only turn off delete action
                item.disabled = true; //item.handler == 'deleteWorkItem';
            });
        });

        vw.lookup('doCopyFwaButton').setDisabled(false);
        vw.lookup('doCloseButton').setDisabled(false);
        vw.lookup('doOpenFwaButton').setDisabled(false);
        Ext.first('#viewAllSignaturesButton').setDisabled(false);
    }
});