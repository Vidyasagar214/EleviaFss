/**
 * Created by steve.tess on 7/11/2018.
 */
Ext.define('TS.controller.fwa.EmployeeExpensesController', {
    extend: 'TS.common.grid.BaseGridController',
    alias: 'controller.grid-employeeexpenses',

    init: function () {

    },

    onNewEmployeeExpense: function (component, e) {
        var me = this,
            grid = this.getView(),
            store = grid.store,
            model = store.model,
            form = Ext.first('#fwaForm').getForm(),
            record = form.getRecord();

        //turn off sort so row stays when added and does not sort
        store.setRemoteSort(false);
        store.add(new model({
            expDate: new Date(),
            reportDate: new Date(),
            fwaId: record.get('fwaId'),
            fwaNum: record.get('fwaNum'),
            fwaName: record.get('fwaName'),
            wbs1: record.get('wbs1'),
            wbs2: record.get('wbs2'),
            wbs3: record.get('wbs3'),
            expReportId: '',
            expId: '',
            id: Ext.data.identifier.Uuid.Global.generate()
        }));
        //turn sort back on
        store.setRemoteSort(true);
        form.dirty = true;
        //set focus so combo box will pop open as listener is set in field-workcode
        grid.getPlugins()[0].startEditByPosition({row: store.data.length - 1, column: 0});
    },

    deleteExpenseItem: function (grid, rowIndex) {
        var fwa = this.getView().up('form').getRecord(),
            form = Ext.first('#fwaForm').getForm(),
            store = grid.store,
            record = store.getAt(rowIndex);
        form.dirty = true;
        store.remove(record);
    },

    attachExpDocument: function (grid, rowIndex) {
        var me = this,
            settings = TS.app.settings,
            windowAttachment,
            expense = grid.getStore().getAt(rowIndex),
            fwa = me.getView().up('form').getRecord();

        if (me.windowAttachment) {
            me.windowAttachment.close();
        }

        me.windowAttachment = Ext.create('TS.view.fwa.Attachment', {
            attType: 'Document',
            location: settings.documentStorageLoc,
            associatedRecordId: expense.get('expId'),
            attachmentsList: {
                modelType: 'EXP',
                modelId: expense.get('expId'),
                attachmentType: AttachmentType.Expense
            },
            autoShow: true,
            modal: true
        });

        me.windowAttachment.lookup('includeTemplates').setHidden(true);
    },

    expenseChanged: function () {
        var me = this,
            form = Ext.first('#fwaForm').getForm();
        form.dirty = true;
    },

    onEmployeeExpenseGridDblClick: function (component, record, item, index, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            record = e.record,
            data = record.data,
            settings = TS.app.settings,
            catRecord = Ext.getStore('ExpCategory').getById(record.get('category')),
            detailType = catRecord.get('detailType'),
            reasonField,
            otherField,
            milesField,
            amountPerMileField,
            win,
            readOnly;

        if (data.readOnly) {
            Ext.Msg.alert('Warning', data.readOnlyReason + ' and cannot be edited');
            return;
        }

        if (vm.data.name == 'EXP') {
            return false;
        }

        if (me.win) {
            me.win.close();
        }

        win = Ext.create({
            xtype: 'fwa-expenseeditor',
            expenseData: data,
            modal: true,
            record: record
        });

        reasonField = win.lookup('reasonField');
        otherField = win.lookup('otherField');
        milesField = win.lookup('milesField');
        amountPerMileField = win.lookup('amountPerMileField');

        win.lookup('fwaButton').setHidden(true);
        vm.get('isFwa')
        win.lookup('attachButton').setHidden(true);
        win.lookup('fwaNumField').setHidden(true);
        win.lookup('fwaNameField').setHidden(true);
        vm.set('existingExpenseLoaded', true);
        win.lookup("expenseEditorForm").getForm().setValues({
            id: data.id,
            expReportId: data.expReportId,
            reportDate: data.reportDate,
            fwaNum: data.fwaNum,
            fwaName: data.fwaName,
            eKGroup: settings.empEkGroup,
            expId: data.expId,
            empId: data.empId,
            expDate: new Date(data.expDate),
            account: data.account,
            category: data.category,
            description: data.description,
            amount: data.amount || 0,
            wbs1: data.wbs1,
            wbs2: data.wbs2,
            wbs3: data.wbs3,
            wbs1Name: data.wbs1Name,
            wbs2Name: data.wbs2Name,
            wbs3Name: data.wbs3Name,
            billable: data.billable,
            companyPaid: data.companyPaid,
            attachments: data.attachments,
            amountPerMile: data.amountPerMile == 0 ? settings.exMileageRate : data.amountPerMile,
            reason: data.reason,
            other: data.other,
            miles: data.miles
        });

        switch (detailType) {
            case 'M':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                otherField.setHidden(false);
                otherField.setFieldLabel('Travel From/To');
                milesField.setHidden(false);
                amountPerMileField.setHidden(false);
                break;
            case 'B':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                otherField.setHidden(false);
                otherField.setFieldLabel('Name of each person');
                break;
            case 'G':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                break;
        }

        win.lookup('fwaNumField').setDisabled(true);
        win.lookup('wbs1combo').setDisabled(true);
        win.lookup('wbs2combo').setDisabled(true);
        win.lookup('wbs3combo').setDisabled(true);
        win.lookup('fwawbs3name').setReadOnly(true);
        win.lookup('fwawbs3name').setValue(data.wbs3Name);

        // var task = Ext.create('Ext.util.DelayedTask', function() {
        //     //server calling method
        //     win.lookup('fwawbs3name').setValue(data.wbs3Name);
        // }, this);
        // task.delay(500);
    },

    expenseDetails: function (grid, rowIndex) {
        var me = this,
            settings = TS.app.settings,
            store = grid.store,
            record = store.getAt(rowIndex),
            win;

        if (me.win) {
            me.win.close();
        }
        if (record.get('amountPerMile') == 0) {
            record.set('amountPerMile', settings.exMileageRate);
        }

        win = Ext.create({
            xtype: 'window-addexpensedetails',
            expenseData: record.data,
            modal: true
        }).show();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    startNewExpenseRow: function (component, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            form = Ext.first('#fwaForm').getForm(),
            record = form.getRecord() || settings.selectedFwa,
            rptId = Ext.data.identifier.Uuid.Global.generate().replace(/-/g, ''),
            wbs1 = Ext.first('#fwawbs1id'),
            wbs2 = Ext.first('#fwawbs2id'),
            wbs3 = Ext.first('#fwawbs3id'),
            win;

        if (1 == 2) { //if(vm.get('newFwa')){
            Ext.Msg.alert(('FYI'), 'A new ' + settings.fwaAbbrevLabel + ' must be updated or saved before adding expenses.');
            return;
            // settings.addNewExpenses = true;
            // Ext.first('#fwaUpdateButton').click();
        } else {
            if (me.win) {
                me.win.close();
            }

            win = Ext.create({
                xtype: 'fwa-expenseeditor',
                parentView: vw,
                modal: true
            });
            vm.set('existingExpenseLoaded', false);
            //default to logged in user
            //win.lookup('id').setValue(Ext.data.identifier.Uuid.Global.generate());
            win.lookup('empid').setValue(settings.empId);
            win.lookup('expId').setValue(Ext.data.identifier.Uuid.Global.generate().replace(/-/g, ''));
            win.lookup('empEkGroupField').setValue(settings.empEkGroup);
            win.lookup('expReportId').setValue(rptId);
            win.lookup('expReportDateField').setHidden(false);
            win.lookup('expReportDateField').setValue(Ext.Date.format(new Date(), DATE_FORMAT));
            win.lookup('expDate').setValue(new Date());
            win.lookup('billableCheckbox').setDisabled(true);
            win.lookup('amountPerMileField').setValue(settings.exMileageRate);
            win.lookup('fwaButton').setHidden(true);
            win.lookup('attachButton').setHidden(true); //vm.get('isFwa')
            win.lookup('fwaNumField').setHidden(true);
            win.lookup('fwaNameField').setHidden(true);
            win.lookup('fwaNumField').setReadOnly(true);
            win.lookup('fwaNameField').setReadOnly(true);

            if (!wbs1.getValue()) {
                Ext.Msg.alert('Warning', '<div style="text-align: center;" >General Information ' + settings.wbs1Label + '# is a required field.</div>');
                win.close();
                return;
            } else if (wbs1.displayTplData[0] && wbs1.displayTplData[0].wbs2Required && !wbs2.getValue()) {
                Ext.Msg.alert('Warning', '<div style="text-align: center;" >General Information ' + settings.wbs2Label + ' is a required field.</div>');
                win.close();
                return;
            } else if (wbs2.displayTplData[0] && wbs2.displayTplData[0].wbs3Required && !wbs3.getValue()) {
                Ext.Msg.alert('Warning', '<div style="text-align: center;" >General Information ' + settings.wbs3Label + ' is a required field.</div>');
                win.close();
                return;
            } else if (vm.get('isFwa') && !expense.reportDate) {
                Ext.Msg.alert('Warning', '<div style="text-align: center;" > Report Date is a required field.</div>');
                win.close();
                return;
            }
            // if (!expense.expDate) {
            //     Ext.Msg.alert('Warning', '<div style="text-align: center;" > Expense Date is a required field.</div>');
            //     win.close();
            //     return;
            // }
            //default to current fwa num, wbs1, wbs2 and wbs3 when new expense
            if (record.get('fwaId')) {
                win.lookup('fwaIdField').setValue(record.get('fwaId'));
                win.lookup('fwaNumField').setValue(record.get('fwaNum'));
                win.lookup('wbs1combo').setValue(record.get('wbs1'));
                win.lookup('wbs2combo').setValue(record.get('wbs2'));

                win.lookup('wbs1combo').setDisabled(true);

                var task = Ext.create('Ext.util.DelayedTask', function () {
                    //server calling method
                    win.lookup('wbs3combo').setValue(record.get('wbs3'));
                }, this);
                task.delay(500);
                //task.cancel();

            } else {
                win.lookup('fwaIdField').setValue(record.get('fwaId'));
                win.lookup('fwaNumField').setValue(Ext.first('#fwaNumField').getValue());
                win.lookup('wbs1combo').setValue(Ext.first('#fwawbs1id').getValue());
                win.lookup('wbs2combo').setValue(Ext.first('#fwawbs2id').getValue());
                win.lookup('wbs3combo').setValue(Ext.first('#fwawbs3id').getValue());
                win.lookup('wbs1combo').setDisabled(true);
                win.lookup('wbs2combo').setDisabled(true);
                win.lookup('wbs3combo').setDisabled(true);
            }
        }

    },
    copyExpenseItem: function (grid, rowIndex) {
        var settings = TS.app.settings,
            store = grid.getStore(),
            lastEntry = store.getAt(rowIndex),
            newExpense;

        if (lastEntry) {
            newExpense = lastEntry.copy(null);
            newExpense.set('id', Ext.data.identifier.Uuid.Global.generate());
            newExpense.set('expId', Ext.data.identifier.Uuid.Global.generate());
            newExpense.set('amount', null);
            store.add(newExpense);
        }
    },

    attachExpenseDocument: function (grid, rowIndex) {
        var me = this,
            settings = TS.app.settings,
            windowAttachment,
            expense = grid.getStore().getAt(rowIndex),
            form = Ext.first('#fwaForm').getForm(),
            record = form.getRecord();

        if (me.windowAttachment) {
            me.windowAttachment.close();
        }
        settings.isExpenseGrid = true;
        me.windowAttachment = Ext.create('TS.view.fwa.Attachment', {
            attType: 'Document',
            location: settings.documentStorageLoc,
            record: expense,
            associatedRecordId: expense.get('expId'),
            attachmentsList: {
                modelType: 'EXP',
                modelId: expense.get('expId'),
                record: expense,
                attachmentType: AttachmentType.Expense
            },
            autoShow: true,
            modal: true
        });

        me.windowAttachment.lookup('includeTemplates').setHidden(true);
    },

    deleteExpense: function (grid, rowIndex) {
        var store = grid.getStore(),
            settings = TS.app.settings,
            record = store.getAt(rowIndex),
            expReportId = record.get('expReportId'),
            expId = record.get('expId');

        if (record.get('readOnly')) {
            Ext.Msg.alert('Warning', data.readOnlyReason + ' and cannot be deleted');
            return;
        }

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to delete this expense?", function (btn) {
            if (btn == 'yes') {
                record.set('modified', 'D');
            }
        });
    },

    setProjectValues: function (wbs1, wbs2, wbs3) {
        var me = this,
            vm = me.getViewModel();
        Ext.first('#exp_fwawbs1id').setValue(null);
        Ext.first('#exp_fwawbs2id').setValue(null);
        Ext.first('#exp_fwawbs3id').setValue(null);
        if (wbs3) {
            vm.set('wbs3id', wbs3.get('id'));
            Ext.first('#exp_fwawbs1id').setValue(wbs1.get('id'));
            Ext.first('#exp_fwawbs2id').setValue(wbs2.get('id'));
            Ext.first('#exp_fwawbs3id').setValue(wbs3.get('id'));
        } else if (wbs2) {
            Ext.first('#exp_fwawbs1id').setValue(wbs1.get('id'));
            Ext.first('#exp_fwawbs2id').setValue(wbs2.get('id'));
        } else if (wbs1) {
            Ext.first('#exp_fwawbs1id').setValue(wbs1.get('id'));
        }
    },

    getCategoryDetails: function (field, newValue, oldValue) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            reasonField = vw.lookup('reasonField'),
            otherField = vw.lookup('otherField'),
            milesField = vw.lookup('milesField'),
            amountPerMileField = vw.lookup('amountPerMileField'),
            billableField = vw.lookup('billableCheckbox'),
            record = Ext.getStore('ExpCategory').getById(newValue),
            billByDefault = record.get('billByDefault'),
            detailType = record.get('detailType'),
            categoryStore = field.getStore(),
            categoryRecord = categoryStore.findRecord('category', field.getValue()),
            wbs1Field = me.lookup('wbs1combo'),
            wbs1Store = wbs1Field.getStore(),
            chargeType,
            amountField = vw.lookup('amountField'),
            accountField = me.lookup('account'),
            wbs1 = Ext.first('#fwawbs1id'),
            wbs2 = Ext.first('#fwawbs2id'),
            wbs3 = Ext.first('#fwawbs3id'),
            accountStore = accountField.getStore();

        if (vm.get('existingExpenseLoaded')) {
            vm.set('existingExpenseLoaded', false);
            return;
        }

        amountField.setValue(0);
        accountStore.clearFilter(true);
        billableField.setDisabled(false);
        if (!wbs1Field.getValue()) {
            billableField.setValue(billByDefault);
            if (billByDefault) {
                accountStore.filter('useOnRegularProjects', true);
                accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
            } else {
                accountStore.filter('useOnRegularProjects', false);
                accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
            }
        } else {
            chargeType = wbs1Store.findRecord('id', wbs1Field.getValue()).get('chargeType');
            billableField.setValue(billByDefault);
            if (chargeType == 'R') {
                accountStore.filter('useOnRegularProjects', true);
                if (billableField.getValue()) {
                    accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                } else {
                    accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                }
                billableField.setHidden(!settings.exDisplayBillable);
            } else {
                accountStore.filter('useOnRegularProjects', false);
                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
                billableField.setValue(false);
                billableField.setDisabled(true);
            }
        }

        reasonField.setHidden(true);
        otherField.setHidden(true);
        milesField.setHidden(true);
        amountPerMileField.setHidden(true);

        switch (detailType) {
            case 'M':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                otherField.setHidden(false);
                otherField.setFieldLabel('Travel From/To');
                milesField.setHidden(false);
                amountPerMileField.setHidden(false);
                break;
            case 'B':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                otherField.setHidden(false);
                otherField.setFieldLabel('Name of each person');
                break;
            case 'G':
                reasonField.setHidden(false);
                reasonField.setFieldLabel('Business reason for expense');
                break;
        }

        billableField.setValue(record.get('billByDefault'))
    },

    /**
     * @param {Ext.Component} component
     * @param {Ext.event.Event} event
     */
    setMileageAmount: function (component, event) {
        var me = this,
            vw = me.getView(),
            milesField = vw.lookup('milesField'),
            mileageRate = vw.lookup('amountPerMileField'),
            amountField = vw.lookup('amountField'),
            miles = milesField.getValue();

        amountField.setValue(milesField.getValue() * (mileageRate.getValue()));
        milesField.setValue(miles);
    },

    /**
     * @param {Ext.form.field.Field} component
     * @param {Object} newValue
     * @param {Object} oldValue
     */
    onBillableChange: function (component, newValue, oldValue) {
        var me = this,
            settings = TS.app.settings,
            categoryField = me.lookup('categoryField'),
            categoryStore = categoryField.getStore(),
            categoryRecord = categoryStore.findRecord('category', categoryField.getValue()),
            wbs1Field = me.lookup('wbs1combo'),
            wbs1Store = wbs1Field.getStore(),
            chargeType,
            accountField = me.lookup('account'),
            accountStore = accountField.getStore();

        accountStore.clearFilter(true);
        if (wbs1Store.getRange().length == 0) return;

        if (!wbs1Field.getValue()) {
            accountStore.filter('useOnRegularProjects', false);
            accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
            component.setValue(false);
            component.setDisabled(true);
        } else {
            chargeType = wbs1Store.findRecord('id', wbs1Field.getValue()).get('chargeType');
            if (chargeType == 'R') {
                if (component.getValue()) {
                    accountStore.filter('useOnRegularProjects', true);
                    accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                } else {
                    accountStore.filter('useOnRegularProjects', false);
                    accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                }
                component.setHidden(!settings.exDisplayBillable);
            } else {
                accountStore.filter('useOnRegularProjects', false);
                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
                component.setValue(false);
                component.setDisabled(true);
            }
        }
    },

    onWbs1ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            wbs1 = me.lookup('wbs1combo'),
            wbs2 = me.lookup('wbs2combo'),
            wbs3 = me.lookup('wbs3combo'),
            chargeTypeField = me.lookup('chargeType'),
            categoryField = me.lookup('categoryField'),
            accountField = me.lookup('account'),
            billableField = me.lookup('billableCheckbox'),
            chargeType = field.getStore().findRecord('id', newValue).get('chargeType'),
            categoryStore = categoryField.getStore(),
            categoryRecord = categoryStore.findRecord('category', categoryField.getValue()),
            billByDefault = categoryRecord ? categoryRecord.get('billByDefault') : false,
            accountStore = accountField.getStore(),
            wbs2Store = wbs2.getStore(),
            wbs3Store = wbs3.getStore();

        chargeTypeField.setValue(chargeType);
        accountStore.clearFilter(true);
        //billableField.setDisabled(false);
        if (chargeType == 'R') {
            billableField.setValue(billByDefault);
            accountStore.filter('useOnRegularProjects', true);
            billableField.setDisabled(false);
            if (billableField.getValue()) {
                if (categoryRecord) {
                    accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                }
            } else {
                if (categoryRecord) {
                    accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                }
                //accountStore.filter('useOnRegularProjects', false);
                billableField.setValue(false);
            }
        } else {
            accountStore.filter('useOnRegularProjects', false);
            if (categoryRecord)
                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
            billableField.setValue(false);
            billableField.setDisabled(true);
        }

        //billableField.setHidden(!settings.exDisplayBillable);
        if (accountField.getValue()) {
            if (accountStore.find('account', accountField.getValue()) == -1) {
                accountField.setValue('');
            }
        }

        if (field.getValue()) {
            wbs2Store.removeAll();
            wbs2Store.getProxy().extraParams['wbs1'] = field.getValue();
            wbs2Store.getProxy().extraParams['app'] = 'FWA';
            wbs2Store.load();
        }
    },

    onWbs2ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel(),
            wbs1 = me.lookup('wbs1combo'),
            wbs2 = me.lookup('wbs2combo'),
            wbs3 = me.lookup('wbs3combo'),
            wbs3Store = wbs3.getStore();

        if (field.getValue()) {
            wbs3Store.removeAll();
            wbs3Store.getProxy().extraParams['wbs1'] = wbs1.getValue();
            wbs3Store.getProxy().extraParams['wbs2'] = field.getValue();
            wbs3Store.getProxy().extraParams['app'] = 'FWA';
            wbs3.getStore().load();
        }
    },

    onWbs3ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel();

        if (field.getSelectedRecord()) {
            me.lookup(field.nameField).setValue(field.getSelectedRecord().get('name'));
        } else {
            me.lookup(field.nameField).setValue(null);
        }
        if (!field.getValue()) {
            field.setValue(vm.get('wbs3id'));
        }
    },

    showProjectLookupWindow: function (e) {
        var me = this,
            vm = me.getViewModel(),
            isFwa = true,
            callingPage = isFwa ? 'EE' : 'EL',
            projectLookupWindow;

        if (me.projectLookupWindow) {
            me.projectLookupWindow.close(); // Close editor if it already exists
        }

        me.projectLookupWindow = Ext.create('TS.common.window.ProjectLookup', {
            callingPage: callingPage,
            app: e.app
        }).show();
    },

    showFwa: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            fwaId = vm.get('fwaId');
        me.getSelectedFwa(fwaId);
    },

    attachDocument: function (component, e) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            expense = vw.lookup("expenseEditorForm").getForm().getValues(),
            windowAttachment;

        if (me.windowAttachment) {
            me.windowAttachment.close();
        }

        me.windowAttachment = Ext.create('TS.view.fwa.Attachment', {
            attType: 'Document',
            location: settings.documentStorageLoc,
            associatedRecordId: expense.expId,
            attachmentsList: {
                modelType: 'EXP',
                modelId: expense.expId,
                attachmentType: AttachmentType.Expense,
                expenseEditor: true,
                record: vw.record
            },
            autoShow: true,
            modal: true
        });

        Ext.first('#includeTemplates').setHidden(true);

    },

    saveExpenseDetails: function (component, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            expense = vw.lookup("expenseEditorForm").getForm().getValues(),
            rptDate = vw.lookup('expReportDateField').getValue(),
            grid = Ext.first('explist') || Ext.first('grid-employeeexpenses'),
            store = grid.getStore(),
            wbs1 = vw.lookup('wbs1combo'),
            wbs2 = vw.lookup('wbs2combo'),
            wbs3 = vw.lookup('wbs3combo'),
            expenseLine,
            record;

        expense.reportDate = rptDate;

        if (!wbs1.getValue()) {
            Ext.Msg.alert('Warning', '<div style="text-align: center;" >' + settings.wbs1Label + '# is a required field.</div>');
            return;
        } else if (wbs1.displayTplData[0] && wbs1.displayTplData[0].wbs2Required && !wbs2.getValue()) {
            Ext.Msg.alert('Warning', '<div style="text-align: center;" >' + settings.wbs2Label + ' is a required field.</div>');
            return;
        } else if (wbs2.displayTplData[0] && wbs2.displayTplData[0].wbs3Required && !wbs3.getValue()) {
            Ext.Msg.alert('Warning', '<div style="text-align: center;" >' + settings.wbs3Label + ' is a required field.</div>');
            return;
        } else if (vm.get('isFwa') && !expense.reportDate) {
            Ext.Msg.alert('Warning', '<div style="text-align: center;" > Report Date is a required field.</div>');
            return;
        }
        if (!expense.expDate) {
            Ext.Msg.alert('Warning', '<div style="text-align: center;" > Expense Date is a required field.</div>');
            return;
        }

        if (!expense.category) {
            Ext.Msg.alert('Warning', '<div style="text-align: center;" > Category is a required field.</div>');
            return;
        }

        if (!expense.id) {
            expenseLine = Ext.create('TS.model.exp.Expense', {
                id: Ext.data.identifier.Uuid.Global.generate(),
                expReportId: expense.expReportId,
                reportDate: new Date(),
                fwaId: expense.fwaId,
                fwaNum: expense.fwaNum,
                fwaName: expense.fwaName,
                expId: expense.expId ? expense.expId : Ext.data.identifier.Uuid.Global.generate().replace(/-/g, ''),
                empId: expense.empId,
                expDate: new Date(expense.expDate),
                account: expense.account,
                category: expense.category,
                description: expense.description,
                amount: expense.amount,
                wbs1: wbs1.getValue(),
                wbs1Name: expense.wbs1Name,
                wbs2: expense.wbs2,
                wbs2Name: expense.wbs2Name,
                wbs3: expense.wbs3,
                wbs3Name: expense.wbs3Name,
                billable: Ext.first('#billableCheckbox').getValue(), // expense.billable,
                companyPaid: Ext.first('#companyPaidCheckbox').getValue(),// expense.companyPaid,
                attachmentsToAdd: expense.attachmentsToAdd,
                reason: expense.reason,
                other: expense.other,
                miles: expense.miles,
                modified: expense.modified
            });
            store.add(expenseLine);
        } else {
            record = store.findRecord('id', expense.id);
            record.set('fwaId', expense.fwaId);
            record.set('fwaNum', expense.fwaNum);
            record.set('fwaName', expense.fwaName);
            record.set('expDate', new Date(expense.expDate));
            record.set('account', expense.account);
            record.set('category', expense.category);
            record.set('description', expense.description);
            record.set('amount', expense.amount);
            record.set('wbs1', wbs1.getValue());
            record.set('wbs1Name', expense.wbs1Name);
            record.set('wbs2', expense.wbs2);
            record.set('wbs2Name', expense.wbs2Name);
            record.set('wbs3', expense.wbs3);
            record.set('wbs3Name', expense.wbs3Name);
            record.set('billable', Ext.first('#billableCheckbox').getValue());
            record.set('companyPaid', Ext.first('#billableCheckbox').getValue());
            record.set('attachmentsToAdd', expense.attachmentsToAdd);
            record.set('reason', expense.reason);
            record.set('other', expense.other);
            record.set('miles', expense.miles);
            record.set('modified', expense.modified)
        }

        vw.close();
    },

    cancelExpenseEditing: function (component, e) {
        var vm = this.getViewModel();
        vm.set('existingExpenseLoaded', false);
        if (Ext.first('#modifiedCheckbox'))
            Ext.first('#modifiedCheckbox').setValue('');
        component.up('window').close();
    },

    getSelectedFwa: function (id) {
        var settings = TS.app.settings,
            w = window,
            d = document,
            e = d.documentElement,
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        if (this.lookup('fwaForm') != null) {
            this.lookup('fwaForm').close();
        }

        Ext.create('TS.view.ts.FwaWindow', {
            title: settings.fwaAbbrevLabel + ' for Expense',
            id: id, //TODO Remove id!
            modal: true,
            isPopup: true,
            isFromTS: true,
            width: x * .90,
            height: y * .90
        }).show();
    },

    /**
     * @param {Ext.form.field.Field} component
     * @param {Object} newValue
     * @param {Object} oldValue
     */
    onFwaSelect: function (component, newValue, oldValue) {
        var settings = TS.app.settings,
            rec = component.getStore().findRecord('fwaNum', newValue),
            wbs1 = '',
            wbs2 = '',
            wbs3 = '';
        if (!rec) {
            rec = settings.selectedFwa;
        }

        if (rec) {
            wbs1 = rec.get('wbs1');
            wbs2 = rec.get('wbs2');
            wbs3 = rec.get('wbs3');
        }


        if (Ext.first('#exp_fwawbs1id'))
            Ext.first('#exp_fwawbs1id').setValue(wbs1.trim());
        if (Ext.first('#exp_fwawbs2id'))
            Ext.first('#exp_fwawbs2id').setValue(wbs2.trim());
        if (Ext.first('#exp_fwawbs3id'))
            Ext.first('#exp_fwawbs3id').setValue(wbs3.trim());
    },

    /**
     * @param {Ext.form.field.Field} component
     * @param {Object} newValue
     * @param {Object} oldValue
     */
    onExpenseChange: function (component, newValue, oldValue) {
        if (component.dirty)
            component.up('form').items.items[27].setValue('M');
    }

});