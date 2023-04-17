/**
 * Created by steve.tess on 7/12/2018.
 */
Ext.define('TS.controller.exp.ExpenseEditorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.expenseeditor',

    init: function () {
        var me = this,
            vw = me.getView();
        if (vw.expenseData)
            me.setExpenseDetails(vw.expenseData);
    },

    setExpenseDetails: function (data) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            vw = me.getView();

        me.lookup("expenseEditorForm").getForm().setValues({
            id: data.id,
            eKGroup: data.eKGroup,
            expReportId: data.expReportId,
            reportDate: data.reportDate,
            reportName: data.reportName,
            fwaNum: data.fwaNum,
            fwaName: data.fwaName,
            expId: data.expId,
            empId: data.empId,
            expDate: new Date(data.expDate),
            account: data.account,
            category: data.category,
            description: data.description,
            amount: data.amount,
            wbs1: data.wbs1,
            wbs2: data.wbs2,
            wbs3: data.wbs3,
            companyPaid: data.companyPaid,
            attachments: data.attachments,
            amountPerMile: data.amountPerMile == 0 ? settings.exMileageRate : data.amountPerMile,
            reason: data.reason,
            other: data.other,
            miles: data.miles,
            billable: data.billable
        });
        vm.set('wbs3id', data.wbs3);
        vm.set('fwaId', data.fwaId);

        if (!settings.exCanModifyFwaExp && data.fwaId != '') {
            vm.set('hasExpEditRights', false);
        } else if (settings.exIsApprover) {
            vm.set('hasExpEditRights', settings.exApproverCanModify);
        } else
            vm.set('hasExpEditRights', true);

        // if(!settings.expenseReadOnly){
        //     vw.lookup('updateExpenseBtn').setDisabled(true);
        // }
    },

    /**
     * @param {Ext.form.field.Field} component
     * @param {Object} newValue
     * @param {Object} oldValue
     */
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
        accountStore.clearFilter();
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
                //billableField.setValue(false);
            }
        } else {
            accountStore.filter('useOnRegularProjects', false);
            if (categoryRecord)
                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
            billableField.setValue(false);
            billableField.setDisabled(true);
        }

        //billableField.setHidden(!settings.exDisplayBillable);
        // if (accountField.getValue()) {
        //     if (accountStore.find('account', accountField.getValue()) == -1) {
        //         accountField.setValue('');
        //     }
        // }

        if (field.getValue()) {
            wbs2Store.removeAll();
            wbs3Store.removeAll();

            wbs2Store.getProxy().extraParams['wbs1'] = field.getValue();
            wbs2Store.getProxy().extraParams['app'] = 'EXP';
            wbs3Store.getProxy().extraParams['wbs1'] = field.getValue(); //TODO Shouldn't it be wbs2 as param ?

            wbs2Store.load();
            wbs3Store.load();
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

            wbs3Store.load();
            wbs3.setValue(vm.get('wbs3id'));
        }
    },

    onWbs3ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel();

        if (!field.getValue()) {
            field.setValue(vm.get('wbs3id'));
        }
    },

    showProjectLookupWindow: function (e) {
        var me = this,
            vm = me.getViewModel(),
            isFwa = vm.get('isFwa'),
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

    setProjectValues: function (wbs1, wbs2, wbs3) {
        var me = this,
            vm = me.getViewModel();
        Ext.first('#fwawbs1id').setValue(null);
        Ext.first('#fwawbs2id').setValue(null);
        Ext.first('#fwawbs3id').setValue(null);
        if (wbs3) {
            vm.set('wbs3id', wbs3.get('id'));
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
            Ext.first('#fwawbs2id').setValue(wbs2.get('id'));
            Ext.first('#fwawbs3id').setValue(wbs3.get('id'));
        } else if (wbs2) {
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
            Ext.first('#fwawbs2id').setValue(wbs2.get('id'));
        } else if (wbs1) {
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
        }
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    attachDocument: function (component, e) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            expense = vw.lookup("expenseEditorForm").getForm().getValues(),
            windowAttachment;

        if (me.windowAttachment) {
            me.windowAttachment.close();
        }

        me.windowAttachment = Ext.create('TS.view.exp.ExpAttachment', {
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

        me.saveExpenseDetails();
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    saveExpenseDetails: function (component, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            expense = vw.lookup("expenseEditorForm").getForm().getValues(),
            grid = Ext.first('explist') || Ext.first('grid-employeeexpenses'),
            store = grid.getStore(),
            wbs1 = vw.lookup('wbs1combo'),
            wbs2 = vw.lookup('wbs2combo'),
            wbs3 = vw.lookup('wbs3combo'),
            reportName = Ext.first('#expReportNameField').getValue(),
            expenseLine,
            record;

        if (!wbs1.getValue()) {
            Ext.Msg.alert('Error', '<div style="text-align: center;" >' + settings.wbs1Label + ' # is a required field.</div>');
            return;
        } else if (wbs1.displayTplData[0] && wbs1.displayTplData[0].wbs2Required && !wbs2.getValue()) {
            Ext.Msg.alert('Error', '<div style="text-align: center;" >' + settings.wbs2Label + ' is a required field.</div>');
            return;
        } else if (wbs2.displayTplData[0] && wbs2.displayTplData[0].wbs3Required && !wbs3.getValue()) {
            Ext.Msg.alert('Error', '<div style="text-align: center;" >' + settings.wbs3Label + ' is a required field.</div>');
            return;
        } else if (!expense.reportDate) {
            Ext.Msg.alert('Error', '<div style="text-align: center;" > Report Date is a required field.</div>');
            return;
        } else if (!expense.expDate) {
            Ext.Msg.alert('Error', '<div style="text-align: center;" > Expense Date is a required field.</div>');
            return;
        }

        if (!expense.category) {
            Ext.Msg.alert('Warning', '<div style="text-align: center;" > Category is a required field.</div>');
            return;
        }

        if (!expense.id) {
            expenseLine = Ext.create('TS.model.exp.Expense', {
                id: Ext.data.identifier.Uuid.Global.generate(),
                eKGroup: settings.empEkGroup,
                expReportId: expense.expReportId,
                reportDate: new Date(expense.reportDate),
                reportName: reportName,
                fwaNum: expense.fwaNum || me.getView().lookup('fwaNumField').getValue(),
                fwaName: expense.fwaName,
                expId: expense.expId,
                empId: expense.empId,
                expDate: new Date(expense.expDate),
                account: expense.account,
                category: expense.category,
                description: expense.description,
                amount: expense.amount,
                wbs1: expense.wbs1 || me.getView().lookup('wbs1combo').getValue(),
                wbs1Name: expense.wbs1Name,
                wbs2: expense.wbs2 || me.getView().lookup('wbs2combo').getValue(),
                wbs2Name: expense.wbs2Name,
                wbs3: expense.wbs3 || me.getView().lookup('wbs3combo').getValue(),
                wbs3Name: expense.wbs3Name,
                billable: Ext.first('#billableCheckbox').getValue(), // expense.billable,
                companyPaid: Ext.first('#companyPaidCheckbox').getValue(),// expense.companyPaid,
                attachmentsToAdd: expense.attachmentsToAdd,
                reason: expense.reason,
                modified: 'A',
                other: expense.other,
                miles: expense.miles
            });
            store.add(expenseLine);
        } else {
            record = store.findRecord('id', expense.id);
            record.set('reportDate', new Date(expense.reportDate));
            record.set('reportName', expense.reportName);
            record.set('eKGroup', expense.eKGroup);
            record.set('fwaNum', expense.fwaNum || me.getView().lookup('fwaNumField').getValue());
            record.set('fwaName', expense.fwaName);
            record.set('expDate', new Date(expense.expDate));
            record.set('account', expense.account);
            record.set('category', expense.category);
            record.set('description', expense.description);
            record.set('amount', expense.amount);
            record.set('wbs1', expense.wbs1 || me.getView().lookup('wbs1combo').getValue());
            record.set('wbs1Name', expense.wbs1Name);
            record.set('wbs2', expense.wbs2 || me.getView().lookup('wbs2combo').getValue());
            record.set('wbs2Name', expense.wbs2Name);
            record.set('wbs3', expense.wbs3 || me.getView().lookup('wbs3combo').getValue());
            record.set('wbs3Name', expense.wbs3Name);
            record.set('billable', Ext.first('#billableCheckbox').getValue());
            record.set('companyPaid', Ext.first('#companyPaidCheckbox').getValue());
            record.set('attachmentsToAdd', expense.attachmentsToAdd);
            record.set('reason', expense.reason);
            record.set('other', expense.other);
            record.set('miles', expense.miles);
            record.set('modified', 'M');
        }
        settings.nsExpenseEntry = false;
        vw.close();
    },

    cancelExpenseEditing: function (component, e) {
        //this.getView().close();
        component.up('window').close();

    },
    /**
     * @param {Ext.form.field.Field} component
     * @param {Object} newValue
     * @param {Object} oldValue
     */
    getCategoryDetails: function (field, newValue, oldValue) {
        var me = this,
            vw = me.getView(),
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
            accountField = me.lookup('account'),
            accountStore = accountField.getStore();

        accountStore.clearFilter();
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
            if (wbs1Store.getRange().length > 0) {
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
            } else {
                wbs1Store.load({
                    callback: function (records, operation, success) {
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
                })
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

        billableField.setValue(record.get('billByDefault'));
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
            amountField = vw.lookup('amountField');

        amountField.setValue(milesField.getValue() * (mileageRate.getValue()));
    },

    /**
     * @param {Ext.form.field.Field} component
     * @param {Object} newValue
     * @param {Object} oldValue
     */
    onBillableChange: function (component, newValue, oldValue) {
        return;
        var me = this,
            settings = TS.app.settings,
            categoryField = me.lookup('categoryField'),
            categoryStore = categoryField.getStore(),
            categoryRecord,
            wbs1Field = me.lookup('wbs1combo'),
            wbs1Store = wbs1Field.getStore(),
            chargeType,
            accountField = me.lookup('account'),
            accountStore = accountField.getStore();

        if (!categoryField.getValue()) {
            return;
        } else {
            categoryRecord = categoryStore.findRecord('category', categoryField.getValue());
        }

        accountStore.clearFilter();
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

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    showFwa: function (component, e) {
        var me = this,
            vm = me.getViewModel(),
            fwaId = vm.get('fwaId');
        me.getSelectedFwa(fwaId);
    },

    getSelectedFwa: function (fwaId) {
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
            fwaId: fwaId,
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
        if(!component.getValue()) return;
        var rec = component.getStore().findRecord('fwaNum', newValue),
            wbs1 = rec.get('wbs1'),
            wbs2 = rec.get('wbs2'),
            wbs3 = rec.get('wbs3');
        Ext.first('#fwawbs1id').setValue(wbs1);
        Ext.first('#fwawbs2id').setValue(wbs2);
        Ext.first('#fwawbs3id').setValue(wbs3);
    },

    /**
     * @param {Ext.form.field.Field} component
     * @param {Object} newValue
     * @param {Object} oldValue
     */
    onExpenseChange: function (component, newValue, oldValue) {
        var me = this,
            vw = me.getView(), grid = Ext.first('explist') || Ext.first('grid-employeeexpenses'),
            expense = vw.lookup("expenseEditorForm").getForm().getValues(),
            store = grid.getStore(),
            record = store.findRecord('id', expense.id);

        if (record) {
            record.set('modified', 'M');
        }
    }

});