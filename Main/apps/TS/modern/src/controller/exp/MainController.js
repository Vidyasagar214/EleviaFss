/**
 * Created by steve.tess on 7/23/2018.
 */
Ext.define('TS.controller.exp.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.exp-main',

    // initViewModel(vm) {
    //     const fwaList = vm.get('fwalist');
    //     fwaList.setProxy({
    //         type: 'default',
    //         directFn: 'Fwa.GetList',
    //         paramOrder: 'dbi|username|start|limit|empId|startDate|isPreparer|isScheduler'
    //     });
    // },

    init: function () {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('expreportlist'),
            settings = TS.app.settings;
        me.getView().setLoading(true);
        store.getProxy().setExtraParams({
            empId: settings.empId
        });

        store.load({
            scope: me,
            callback: function () {
                me.afterStoreLoad(store);
            }
        });
        me.getView().setLoading(false);
    },
    control: {
        'button[action=navigation-back]': {
            tap: 'navigateToGrid'
        },
        'button[action=navigation-back-expList]': {
            tap: 'navigateToExpList'
        },
        'button[action=expsign]': {
            tap: 'expSubmitPinClick'
        }
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
        Ext.Viewport.setActiveItem('app-fss');
        //this.closeView();
    },

    navigateToGrid: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedExpReport'),
            store = vm.getStore('expreportlist'),
            listStore = vm.getStore('explist');

        store.rejectChanges();
        listStore.removeAll();
        store.reload();
        Ext.first('app-exp').setActiveItem(0);
    },

    navigateToExpList: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            listStore = vm.getStore('explist');

        listStore.rejectChanges();
        Ext.first('app-exp').setActiveItem(1);
    },

    afterStoreLoad: function (store) {
    },

    /**
     * @param {Ext.dataview.DataView} component
     * @param {Number} index
     * @param {Ext.Element/Ext.dataview.component.DataItem} target
     * @param {Ext.data.Model} record
     * @param {Ext.event.Event} e
     */
    editSelectedExpReport: function (component, index, target, record, e) {

        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            store = vm.getStore('explist'),
            selection = vm.get('selectedExpReport'),
            rptNameText = vw.lookup('reportNameText'),
            rptStatus = vw.lookup('reportStatusText'),
            status;

        settings.component = component;
        settings.index = index;
        settings.target = target;
        settings.record = record;
        settings.e = e;
        if (record.get('expReportId') && record.get('status')) {
            status = Ext.getStore('FwaStatus').findRecord('value', record.get('status')).get('description');
        } else {
            record.set('expReportId', me.create_UUID());
            vw.lookup('reportStatusText').setValue(Ext.getStore('FwaStatus').findRecord('value', FwaStatus.InProgress).get('description'));
            status = FwaStatus.InProgress;
        }

        store.getProxy().setExtraParams({
            expReportId: record.get('expReportId') || record.get('oldRptId')
        });
        store.load({
            scope: me,
            callback: function () {
                me.afterExpenseLoad(store, record.get('oldRptId'));
            }
        });

        if (record.get('reportName') != '') {
            rptNameText.setValue(record.get('reportName'));
            if (!record.get('status')) record.set('status', FwaStatus.InProgress);
            rptStatus.setValue(Ext.getStore('FwaStatus').findRecord('value', record.get('status')).get('description'));
            rptNameText.setReadOnly(true);
        } else {
            rptNameText.setValue('FSS ' + Ext.Date.format(record.get('reportDate'), 'Y-m-d') + '-' + record.get('empId'));
            //store.removeAll();
            rptNameText.setPlaceHolder('Enter Report Name');
            rptNameText.setReadOnly(true);
        }
        selection.dirty = false;

        //rptStatus.setValue(status);
        vw.setActiveItem(1);
    },

    afterExpenseLoad: function (store, oldRptId) {
        var settings = TS.app.settings;
        if (settings.expenseReportCopy) {
            Ext.each(store.getRange(), function (exp) {
                exp.set('id', Ext.data.identifier.Uuid.Global.generate());
                exp.set('expReportId', '');
                exp.set('expDate', new Date());
                exp.set('amount', null);
            });
            settings.expenseReportCopy = false;
        }
    },

    addNewExpReport: function (bt) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = vm.getStore('expreportlist'),
            settings = TS.app.settings,
            newExpReport = Ext.create('TS.model.exp.ExpenseReport', {
                createDate: new Date(),
                createUser: settings.empId,
                empId: settings.empId,
                reportDate: new Date(),
                expLines: [],
                status: FwaStatus.InProgress
            });

        vm.set('selectedExpReport', newExpReport);
        store.add(newExpReport);
        vw.lookup('reportNameText').setReadOnly(false);
        vw.lookup('reportStatusText').setValue(Ext.getStore('FwaStatus').findRecord('value', FwaStatus.InProgress).get('description'));
        bt.up('exprpt-editmenu').hide();
        vw.setActiveItem(1);
    },

    onEditMenuTap: function () {
        var me = this,
            vw = me.getView(),
            menu = Ext.first('app-exp').add({xtype: 'exp-editmenu'});

        menu.show();
    },

    onCategoryChange: function (component, nValue, oValue) {
        var me = this,
            vw = me.getView(),
            reasonField = vw.lookup('reasonField'),
            otherField = vw.lookup('otherField'),
            milesField = vw.lookup('milesField'),
            amountPerMileField = vw.lookup('amountPerMileField'),
            billableField = vw.lookup('billableCheckBoxField'),
            detailType;
        //change and set account
        me.setAccount(null, null, null);
        //reset all to start
        reasonField.setHidden(true);
        otherField.setHidden(true);
        milesField.setHidden(true);
        amountPerMileField.setHidden(true);

        if (nValue) {
            record = Ext.getStore('ExpCategory').getById(nValue.get('category'));
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
    },

    /**
     * @param {Ext.dataview.DataView} component
     * @param {Number} index
     * @param {Ext.Element/Ext.dataview.component.DataItem} target
     * @param {Ext.data.Model} record
     * @param {Ext.event.Event} e
     */
    editSelectedExpense: function (cmp, location,) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedEXP'),
            settings = TS.app.settings;

        if (selection.get('amountPerMile') == 0)
            selection.set('amountPerMile', settings.exMileageRate);
        // clone in case we cancel edit
        vm.set('originalValues', selection.clone());

        vw.lookup('showFwaButton').setHidden(!selection.get('fwaId'));
        vw.lookup('fwaNumberField').setHidden(!selection.get('fwaId'));
        vw.lookup('fwaNameField').setHidden(!selection.get('fwaId'));

        if (selection.get('fwaId')) {
            if (settings.expenseReadOnly) {
                vm.set('hasExpEditRights', false);
            } else
                vm.set('hasExpEditRights', settings.exCanModifyFwaExp);
        } else {
            if (settings.expenseReadOnly) {
                vm.set('hasExpEditRights', false);
            } else
                vm.set('hasExpEditRights', true);
        }

        vw.lookup('expenseEditMenuButton').setHidden(false);
        me.getView().setActiveItem(2);
    },

    onCancelExp: function () {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            selected = vm.get('selectedEXP'),
            original = vm.get('originalValues'),
            listStore = vm.getStore('explist'),
            record = listStore.getById(selected.id);
        //removes changed record
        listStore.remove(record);
        //add back original values
        listStore.add(original);
        //listStore.reload();
        listStore.sort([
            {
                property: 'sortOrder',
                direction: 'ASC'
            }
        ]);
        //reset originalValues
        vm.set('originalValues', null);

        //
        // Ext.first('app-exp').setActiveItem(0);
        // me.editSelectedExpReport(settings.component,settings.index,settings.target,settings.record,settings.e);
        vm.set('hasExpEditRights', true);
        Ext.first('app-exp').setActiveItem(1);
    },

    onWbs1Change: function (rec, newValue, oldValue, eOpts) {
        this.setAccount(null, null, null);
    },

    onWbsChange: function (rec, newValue, oldValue, eOpts) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedEXP'),
            wbs1,
            wbs2,
            wbs3,
            locModel = [];
        if (selection) {
            wbs1 = selection && selection.get('wbs1') ? selection.get('wbs1') : vw.lookup('wbs1combo') && vw.lookup('wbs1combo').getSelection() ? vw.lookup('wbs1combo').getSelection().get('id') : '';
            wbs2 = selection && selection.get('wbs2') ? selection.get('wbs2') : vw.lookup('wbs2combo') && vw.lookup('wbs2combo').getSelection() ? vw.lookup('wbs2combo').getSelection().get('id') : '';
            wbs3 = selection ? selection.get('wbs3') : '';
        }

        Ext.first('#fwawbs2id').setValue(wbs2);
        Ext.first('#fwawbs3id').setValue(wbs3);
    },

    onProjectLookup: function (btn) {
        var sheet = Ext.create({
            xtype: 'exp-projectlookuptree',
            //Fuse view models
            viewModel: {
                parent: this.getViewModel()
            },
            app: 'EXP'
        });

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    addNewExpense: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = vm.getStore('explist'),
            expReport = vm.get('selectedExpReport'),
            expense = Ext.create('TS.model.exp.Expense', {
                id: Ext.data.identifier.Uuid.Global.generate(),
                empId: settings.empId,
                expReportId: expReport.get('expReportId'),
                expId: me.create_UUID(),
                reportDate: expReport.get('reportDate'),
                reportName: expReport.get('reportName'),
                amountPerMile: settings.exMileageRate,
                eKGroup: settings.empEkGroup,
                expDate: new Date(expReport.get('reportDate')),
                modified: 'A',
                status: 'I',
                wbs1: '',
                wbs2: '',
                wbs3: '',
                account: '',
                reason: ''
            });

        store.add(expense);
        Ext.first('#wbs1NameLabel').setValue('');
        Ext.first('#wbs2NameLabel').setValue('');
        Ext.first('#wbs3NameLabel').setValue('');

        vw.lookup('wbs2combo').setValue('');
        vw.lookup('wbs3combo').setValue('');

        vm.set('selectedEXP', expense);
        Ext.first('#showFwaButton').hide();
        Ext.first('#fwaNameField').setValue('');
        vw.lookup('fwaNumberField').setHidden(true);
        vw.lookup('fwaNameField').setHidden(true);
        vw.setActiveItem(2);
        bt.up('explist-editmenu').destroy();
    },

    create_UUID: function () {
        return Ext.data.identifier.Uuid.Global.generate().replace(/-/g, '');  //uuid;
    },

    onSaveExpReport: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = vm.getStore('explist'),
            expReportStore = vm.get('expreportlist'),
            settings = TS.app.settings,
            expenseList,
            expReport = vm.get('selectedExpReport'),
            rptDate = vw.lookup('reportDateField').getHtml();

        expReport.set('reportName', vw.lookup('reportNameText').getValue());
        expReport.set('reportDate', new Date(vw.lookup('reportDateField').getHtml()));
        expReport.set('expReportId', expReport.get('expReportId') || me.create_UUID());

        if (!expReport.get('reportName') || !expReport.get('reportDate')) {
            Ext.Msg.alert('Error', 'Both Report Date and Report Name are required fields');
            return;
        }

        store.removeFilter();
        expenseList = Ext.Array.pluck(store.getRange(), 'data');


        // if (expenseList.length == 0 && !settings.deletedExpense) {
        //     Ext.Msg.alert('Warning', 'No entries have been entered for Expense Report: ' + expReport.get('reportName'));
        //     return;
        // }

        expReport.set('submittedBy', '');
        expReport.set('submittedDate', new Date(2001, 1, 1));
        expReport.set('apprRejDate', new Date(2001, 1, 1));
        expReport.set('status', FwaStatus.InProgress);

        expReport = expReport.data;
        expReport.expLines = expenseList;

        // expReport.reportDate = TS.common.Util.getOutUTCDate(expReport.reportDate);
        Ext.each(expReport.expLines, function (exp) {
            // exp.expDate = TS.common.Util.getOutUTCDate(exp.expDate);
            // exp.reportDate = TS.common.Util.getOutUTCDate(exp.reportDate);
            exp.status = FwaStatus.Submitted;
        });

        Exp.SaveExpReport(null, settings.username, expReport, function (response) {
            if (response && response.success) {
                TS.Messages.getSimpleAlertMessage('expenseSaveSuccess');
                settings.deletedExpense = false;
                expReportStore.reload();
                vm.set('selectedEXP','');
            } else if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, this, {
            autoHandle: true
        });

        vw.setActiveItem(0);
    },

    onSubmitExp: function (bt, attachment) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            store = vm.getStore('explist'),
            expReportStore = vm.get('expreportlist'),
            expenseList = Ext.Array.pluck(store.getRange(), 'data'),
            expReport = vm.get('selectedExpReport'),
            signatureAttachment;

        signatureAttachment = attachment != null ? attachment.getData().attachmentItem : null;
        expReport.set('signature', signatureAttachment);
        expReport.set('submittedBy', settings.empId);
        expReport.set('submittedDate', new Date());
        expReport.set('apprRejDate', new Date(2001, 1, 1));
        expReport.set('status', FwaStatus.Submitted);

        expReport = expReport.data;
        expReport.expLines = expenseList;

        // expReport.reportDate = TS.common.Util.getOutUTCDate(expReport.reportDate);
        // Ext.each(expReport.expLines, function(exp){
        //     exp.expDate = TS.common.Util.getOutUTCDate(exp.expDate);
        //     exp.reportDate = TS.common.Util.getOutUTCDate(exp.reportDate);
        // });

        Exp.SubmitExpReport(null, settings.username, expReport, signatureAttachment, function (response) {
            if (response && response.success) {
                TS.Messages.getSimpleAlertMessage('expenseSubmitSuccess');
                expReportStore.load ({
                    callback: this.changeTab(vw),
                    scope: this
                });
            } else if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, this, {
            autoHandle: true
        });
    },

    changeTab: function(vw){
        vw.setActiveItem(0);
    },

    doSubmitExpenseReport: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedExpReport'),
            expReportId = selection.get('expReportId'),
            expId = selection.get('expId'),
            empId = selection.get('empId'),
            settings = TS.app.settings,
            baseView = Ext.first('app-exp');

        Ext.Msg.confirm("Please Confirm", "<div align=\"center\">Are you sure you want to submit?</div>", function (btn) {
            if (btn === 'yes') {
                if (settings.exReqSubmitSignature) {
                    sheet = Ext.create({
                        xtype: 'exp-submitpin',
                        //Fuse view models
                        viewModel: {
                            parent: me.getViewModel()
                        },
                        attType: 'Employee',
                        associatedRecordId: expReportId,
                        attachmentsList: {
                            modelType: 'EXP',
                            modelId: expId,
                            attachmentType: AttachmentType.Expense
                        }
                    });
                    baseView.add(sheet);
                    sheet.show();
                } else {
                    me.onSubmitExp(bt);
                }
            }
        });
    },

    onCloseSheet: function (bt) {
        bt.up('sheet').hide();
    },

    expSubmitPinClick: function (bt) {
        var me = this,
            settings = TS.app.settings,
            pin = me.lookup('expSubmitPinField').getValue(),
            view = me.getView(),
            button = me.lookup('saveSignatureButton');

        // if (!view.lookup('expSubmitPinField').getValue()) {
        //     Ext.Msg.alert('Warning', '<div align="center">PIN and Signature are both required</div>');
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
        //         me.lookup('expSubmitPinField').setValue('');
        //         me.getView().setLoading(false);
        //     }
        // }, me, {
        //     autoHandle: true
        // });
    },

    doSaveSignature: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            selection = vm.get('selectedExpReport'),
            expReportId = selection.get('expReportId'),
            vw = me.getView(),
            draw = vw.down('ts-draw'),
            imageData = draw.toDataURL(), //get image data
            file = new Blob([imageData], {
                type: 'image/png'
            }),
            data;

        data = {
            type: 'EXP',
            location: settings.imageStorageLoc,
            associatedId: expReportId,
            attachmentType: 'E',
            fileExt: 'png',
            fileName: 'signature_' + Ext.data.identifier.Uuid.Global.generate(), // TODO - How should this be autogenerated?
            description: 'Expense Report Approval Signature',
            file: file
        };

        me.convertFileToByteData(data.file, Ext.bind(function (byteData) {
            var attachmentRecord = Ext.create('TS.model.shared.Attachment', {
                owningModelType: data.type,
                owningModelId: data.associatedId + '||' + settings.empId,
                dateAttached: data.date || new Date(),
                attachmentType: data.attachmentType,
                location: data.location,
                extension: data.fileExt,
                filename: data.fileName,
                description: data.description,
                attachmentItem: byteData
            });

            me.onSubmitExp(bt, attachmentRecord);
        }, me));

        me.onCloseSheet(bt);
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

    onSaveExpense: function () {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedEXP'),
            reportDate = vm.get('reportDate'),
            category = vw.lookup('categoryField'),
            wbs1 = vw.lookup('wbs1combo'),
            wbs2 = vw.lookup('wbs2combo'),
            wbs3 = vw.lookup('wbs3combo'),
            wbs2Value = wbs2.getValue(),
            wbs3Value = wbs3.getValue(),
            wbs2Required = false,
            wbs3Required = false;

        if(!settings.deletedExpense){
            if (!category.getValue()) {
                Ext.Msg.alert('Warning', 'Category is a required field.');
                return;
            }
            if (!wbs1.getValue()) {
                Ext.Msg.alert('Warning', settings.wbs1Label + '# is a required field.');
                return;
            }
            if (wbs1.getValue()) {
                wbs2Required = wbs1.getSelection().get('wbs2Required');
            }
            if (wbs2.getValue()) {
                wbs3Required = wbs2.getSelection().get('wbs3Required');
            }
//vm.get('selectedEXP').get('expDate')
            if (!reportDate.value) {
                Ext.Msg.alert('Warning', 'Expense Date is a required field.');
                return;
            }
            if (wbs2Required && !wbs2Value) {
                Ext.Msg.alert('Warning', settings.wbs2Label + ' # is a required field.');
                return;
            } else if (wbs3Required && !wbs3Value) {
                Ext.Msg.alert('Warning', settings.wbs3Label + ' # is a required field.');
                return;
            }
        }
        me.onSaveExpReport();
        vw.setActiveItem(1);
        //Ext.Msg.alert('FYI', 'New expense items must be saved or submitted.')
        //vw.lookup('expenseList').deselectAll();

    },

    doCopyExpReport: function (bt) {
        var me = this,
            grid = Ext.first('exp-report-list'),
            vw = me.getView(),
            vm = me.getViewModel(),
            record = grid.getSelection(),
            settings = TS.app.settings,
            store = vm.get('expreportlist'),
            expReportId,
            newExpenseRpt;

        if (record && record.get('expReportId')) {
            newExpenseRpt = record.copy(null);
            newExpenseRpt.set('id', Ext.data.identifier.Uuid.Global.generate());
            newExpenseRpt.set('oldRptId', record.get('expReportId'));
            newExpenseRpt.set('reportName', '');
            newExpenseRpt.set('reportDate', new Date());
            newExpenseRpt.set('expReportId', '');
            newExpenseRpt.set('signature', null);
            newExpenseRpt.set('statusText', Ext.getStore('FwaStatus').findRecord('value', record.get('status')).get('description'));

            settings.expenseReportCopy = true;
            store.add(newExpenseRpt);
            grid.setSelection(newExpenseRpt);
            vw.setActiveItem(1);
        } else {
            Ext.Msg.alert('Error', '<div style="text-align:center;">No expense report selected</div>');
        }

        bt.up('exprpt-editmenu').hide();
    },

    doCopyExpItem: function (bt) {
        var me = this,
            vw = me.getView(),
            grid = vw.lookup('expenseList'),
            vm = me.getViewModel(),
            record = grid.getSelection(),
            settings = TS.app.settings,
            store = vm.get('explist'),
            expReport = vm.get('selectedExpReport'),
            newExpense;

        if (record) {
            newExpense = record.copy(null);
            newExpense.set('id', Ext.data.identifier.Uuid.Global.generate());
            newExpense.set('expId', Ext.data.identifier.Uuid.Global.generate());
            newExpense.set('amount', '');
            newExpense.set('expDate', new Date());
            store.add(newExpense);
            grid.setSelection(newExpense);
            vw.setActiveItem(2);
        } else {
            Ext.Msg.alert('Error', '<div style="text-align: center;">No expense selected</div>');
        }

        bt.up('explist-editmenu').hide();
    },

    removeExpReport: function (bt) {
        var me = this,
            grid = Ext.first('exp-report-list'),
            vw = me.getView(),
            vm = me.getViewModel(),
            record = grid.getSelection(),
            store = vm.get('expreportlist'),
            settings = TS.app.settings,
            expReportId,
            rowIndex;

        if (!record || (record && !record.get('expReportId'))) {
            Ext.Msg.alert('Error', '<div style="text-align: center;">No expense report selected</div>');
            bt.up('exprpt-editmenu').hide();
            return;
        }

        expReportId = record.get('expReportId');
        Ext.each(store.getRange(), function (item, idx) {
            if (item.get('expReportId') == expReportId) {
                rowIndex = idx;
            }
        });

        Ext.Msg.confirm("Please Confirm", "<div style=\"text-align: center;\">Are you sure you want to delete this expense report?</div>", function (btn) {
            if (btn == 'yes') {
                if (expReportId) {
                    Exp.DeleteExpenseReport(null, settings.username, expReportId, function (response, operation, success) {
                        if (response && response.success) {
                            store.removeAt(rowIndex);
                        } else if (response) {
                            Ext.GlobalEvents.fireEvent('Error', response);
                        }
                    }.bind(this));
                } else {
                    store.removeAt(rowIndex);
                }
            }
            bt.up('exprpt-editmenu').hide();
        });
    },


    onEditReportMenuTap: function () {
        var me = this,
            vw = me.getView(),
            menu = Ext.first('app-exp').add({xtype: 'exprpt-editmenu'});
        menu.show();
    },

    onEditListMenuTap: function () {
        var me = this,
            vw = me.getView(),
            menu = Ext.first('app-exp').add({xtype: 'explist-editmenu'});
        menu.show();
    },

    removeExpListItem: function (bt) {
        var me = this,
            vw = me.getView(),
            list = vw.lookup('expenseList'),
            vm = me.getViewModel(),
            record = list.getSelection(),
            store = vm.get('explist'),
            rowIndex,
            id;

        if (!record) {
            Ext.Msg.alert('Error', '<div style="text-align: center;">No expense selected</div>');
            bt.up('explist-editmenu').hide();
            return;
        }

        id = record.get('id');
        Ext.each(store.getRange(), function (item, idx) {
            if (item.get('id') == id) {
                rowIndex = idx;
            }
        });

        Ext.Msg.confirm("Please Confirm", "<div style=\"text-align: center;\">Are you sure you want to delete this expense?</div>", function (bttn) {
            if (bttn == 'yes') {
                store.removeAt(rowIndex);
            }
            bt.up('explist-editmenu').hide();
        });
    },

    /**
     * @param {Ext.field.Select} component
     * @param {Ext.data.Model} newValue
     * @param {Ext.data.Model} oldValue
     */
    onReportDateChange: function (component, newValue, oldValue) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedExpReport');

    },

    /**
     * @param {Ext.dataview.DataView} component
     * @param {Number} index
     * @param {Ext.Element/Ext.dataview.component.DataItem} target
     * @param {Ext.data.Model} record
     * @param {Ext.event.Event} e
     */
    onEditExpenseDoubleTap: function (component, index, target, record, e) {
        return false;
    },

    /**
     * @param {Ext.field.Text} component
     * @param {Ext.event.Event} e
     */
    setMileageAmount: function (component, e) {
        var me = this,
            vw = me.getView(),
            milesField = vw.lookup('milesField'),
            mileageRate = vw.lookup('amountPerMileField'),
            amountField = vw.lookup('amountField');

        amountField.setValue(Math.round((milesField.getValue() * (mileageRate.getValue())) * 100) / 100);
    },

    /**
     * @param {Ext.field.Select} component
     * @param {Ext.data.Model} newValue
     * @param {Ext.data.Model} oldValue
     */
    setAccount: function (component, newValue, oldValue) {
        var me = this,
            settings = TS.app.settings,
            categoryField = me.lookup('categoryField'),
            categoryStore = categoryField.getStore(),
            categoryRecord = categoryStore.findRecord('category', categoryField.getValue()),
            wbs1Field = me.lookup('wbs1combo'),
            wbs1Store = wbs1Field.getStore(),
            accountField = me.lookup('accountField'),
            accountStore = accountField.getStore(),
            billableField = me.lookup('billableCheckBoxField'),
            chargeType,
            billByDefault;

        if (wbs1Field.getValue() && categoryRecord) {
            chargeType = wbs1Store.findRecord('id', wbs1Field.getValue()).get('chargeType');
            accountStore.clearFilter();
            if (chargeType == 'R') {
                //accountStore.filter('useOnRegularProjects', true);
                if (billableField.getValue()) {
                    accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                } else {
                    accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                }
                billableField.setHidden(!settings.exDisplayBillable);
            } else {
                //accountStore.filter('useOnRegularProjects', false);
                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
                billableField.setValue(false);
                billableField.setHidden(true);
            }
        } else if (categoryRecord) {
            billByDefault = categoryRecord.get('billByDefault');
            billableField.setValue(billByDefault);
            if (billByDefault) {
                //accountStore.filter('useOnRegularProjects', true);
                accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
            } else {
                //accountStore.filter('useOnRegularProjects', false);
                accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
            }
        }
    },

    showFwa: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            expense = vm.get('selectedEXP'),
            baseView = Ext.first('app-exp'),
            fwaId = expense.get('fwaId'),
            settings = TS.app.settings,
            store = vm.getStore('viewfwa'),
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
            id: fwaId
        });

        store.load({
            callback: me.loadFwaViewSheet,
            scope: me
        });

        Ext.Viewport.add(sheet);
        sheet.down('titlebar[docked=top]').setTitle(settings.fwaAbbrevLabel + ' for Expense');
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
        vm.set('selectedFWA', results[0]);
        vm.set('attachments', attachments);
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
            //show-hide view all, size segmented button
            //client approval
            Ext.first('#viewAllClientSignatureButton').setHidden(true);//clientSignatureCount <= 1
            //chief approval
            Ext.first('#viewAllChiefSignatureButton').setHidden(true);//chiefSignatureCount <= 1

            if (Ext.Date.format(vm.get('selectedFWA').get('udf_d1'), DATE_FORMAT) < '01/01/2002')
                vm.get('selectedFWA').set('udf_d1', '');
            if (Ext.Date.format(vm.get('selectedFWA').get('udf_d2'), DATE_FORMAT) < '01/01/2002')
                vm.get('selectedFWA').set('udf_d2', '');
            if (Ext.Date.format(vm.get('selectedFWA').get('udf_d3'), DATE_FORMAT) < '01/01/2002')
                vm.get('selectedFWA').set('udf_d3', '');

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

    /**
     * @param {Ext.field.Checkbox} component
     * @param {Boolean} newValue
     * @param {Boolean} oldValue
     */
    onBillableChange: function (component, newValue, oldValue) {
        var me = this,
            settings = TS.app.settings,
            categoryField = me.lookup('categoryField'),
            categoryStore = categoryField.getStore(),
            categoryRecord = categoryStore.findRecord('category', categoryField.getValue()),
            wbs1Field = me.lookup('wbs1combo'),
            wbs1Store = wbs1Field.getStore(),
            accountField = me.lookup('accountField'),
            accountStore = accountField.getStore(),
            billableField = me.lookup('billableCheckBoxField'),
            chargeType,
            billByDefault;

        accountStore.clearFilter();
        if (categoryRecord)
            //if (wbs1Store.getRange().length == 0) return;
            if (!wbs1Field.getValue()) {
                //accountStore.filter('useOnRegularProjects', false);
                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
                component.setValue(false);
                component.setDisabled(true);
            } else {
                chargeType = wbs1Store.findRecord('id', wbs1Field.getValue()).get('chargeType');
                if (chargeType == 'R') {
                    if (component.getValue()) {
                        //accountStore.filter('useOnRegularProjects', true);
                        accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                    } else {
                        //accountStore.filter('useOnRegularProjects', false);
                        accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                    }
                    component.setHidden(!settings.exDisplayBillable);
                } else {
                    //accountStore.filter('useOnRegularProjects', false);
                    accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
                    component.setValue(false);
                    component.setDisabled(true);
                }
            }
    }


});