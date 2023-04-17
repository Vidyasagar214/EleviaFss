/**
 * Created by steve.tess on 7/10/2018.
 */
Ext.define('TS.controller.exp.MainController', {
    extend: 'TS.view.main.MainController',

    alias: 'controller.exp-main',

    listen: {
        global: {
            'SelectExpenseReport': 'selectExpense',
            'SubmitExpAfterPinCheck': 'continueSubmitExpenseReport',
            'ReloadExpenseReport': 'reloadExpenses'
        }
    },

    init: function () {
        Ext.create('TS.view.exp.ExpenseSelect', {
            buttons: [
                {
                    text: 'Open',
                    handler: 'selectExpense',
                    itemId: 'selectExpenseButton',
                    disabled: true
                },
                {
                    text: 'Cancel',
                    align: 'right',
                    handler: 'onCloseSelectExpense'

                }
            ]
        }).show();

    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    startNewExpenseRow: function (rowIndex, recordCopy) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            rptId = vw.lookup('expReportIdField').getValue(),
            rptDate = vw.lookup('expReportDateField').getValue(),
            win;

        if(!rptId){
            Ext.Msg.alert('FYI', 'No Report Date has been selected. Please click "Open" and select a date.' );
            return;
        }
        settings.nsExpenseEntry = true;
        win = Ext.create({
            xtype: 'window-expenseeditor',
            parentView: me.getView(),
            modal: true
        });

        //default to logged in user
        win.lookup('expId').setValue(Ext.data.identifier.Uuid.Global.generate().replace(/-/g, ''));
        win.lookup('empid').setValue(settings.empId);
        win.lookup('expReportId').setValue(rptId);
        win.lookup('expReportDateField').setValue(rptDate);
        win.lookup('expDate').setValue(Ext.Date.format(new Date(rptDate), DATE_FORMAT));
        win.lookup('amountPerMileField').setValue(settings.exMileageRate);
        win.lookup('eKGroupField').setValue(settings.empEkGroup);
        win.lookup('reportNameField').setValue(' ');
        win.lookup('fwaButton').setHidden(true);
        win.lookup('fwaNumField').setHidden(true);
        win.lookup('fwaNameField').setHidden(true);

    },

    showProjectEditor: function (view, record) {
        var data = record.data,
            settings = TS.app.settings,
            win;

        win = Ext.create({
            xtype: 'window-expenseeditor',
            projectData: data,
            parentView: view,
            modal: true
        });
    },

    create_UUID: function () {
        // var dt = new Date().getTime();
        // var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //     var r = (dt + Math.random() * 16) % 16 | 0;
        //     dt = Math.floor(dt / 16);
        //     return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        // });
        // return uuid;
        return Ext.data.identifier.Uuid.Global.generate().replace(/-/g, '');
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    onSaveExpenses: function (component, e) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = Ext.first('explist').getStore();

        store.clearFilter();
        var expenseList = Ext.Array.pluck(store.getRange(), 'data'),
            rptId = vw.lookup('expReportIdField').getValue(),
            rptName = vw.lookup('expReportNameField').getValue(),
            rptDate = new Date(vw.lookup('expReportDateField').getValue()),
            expReport = {
                expReportId: rptId || me.create_UUID(),
                empId: settings.empId,
                reportDate: rptDate || null,
                reportName: rptName || null,
                status: FwaStatus.InProgress,
                submittedBy: settings.empId,
                submittedDate: new Date(),
                expLines: expenseList || [],
                signature: null
            };

        if (!rptName || !rptDate) {
            Ext.Msg.alert('Error', 'Both Report Name & Report Date are required fields');
            return;
        }
        if (expenseList.length == 0) {
            Ext.Msg.alert('Warning', 'No entries have been entered for Expense Report: ' + rptName);
            return;
        }

        Exp.SaveExpReport(null, settings.username, expReport, function (response) {
            if (response && response.success) {
                if (response.data || expReport.empId + Ext.Date.format(new Date(expReport.reportDate), 'Ymd')) {
                    store.getProxy().setExtraParams(
                        {
                            expReportId: response.data || expReport.empId + Ext.Date.format(new Date(expReport.reportDate), 'Ymd')
                        }
                    );
                    store.load();
                } else {
                    me.openExpReportList();
                }
                if(settings.isExpenseCopy){
                    Ext.Msg.show({
                        title: 'FYI',
                        message: 'Expense has been copied',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                    settings.isExpenseCopy = false;
                } else {
                    TS.Messages.getSimpleAlertMessage('expenseSaveSuccess');
                }

            } else if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        });
    },

    reloadExpenses: function (rptId) {
        var me = this,
            settings = TS.app.settings,
            store = Ext.first('explist').getStore();
        store.removeAll();
        store.getProxy().setExtraParams({
            expReportId: rptId
        });
        store.load({
            callback: this.afterExpenseLoad,
            scope: this
        });
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    selectExpense: function () {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            grid = Ext.first('#expReportListGrid'),
            record = grid ? grid.getSelection()[0] : '',
            store,
            expListGrid,
            expListStore,
            newReportId = Ext.data.identifier.Uuid.Global.generate().replace(/-/g, ''),
            newExpReport;

        if (record) {
            expListGrid = Ext.first('explist');
            settings.nsExpenseEntry = false;
            store = Ext.first('explist').getStore();
            store.removeAll();
            store.getProxy().setExtraParams({
                expReportId: record.get('expReportId') || record.get('oldRptId')
            });
            store.load({
                callback: this.afterExpenseLoad,
                scope: this
            });
            if (!record.get('reportName')) {
                record.set('reportName', 'FSS ' + Ext.Date.format(record.get('reportDate'), 'Y-m-d') + '-' + record.get('empId'));
            }
            vw.lookup('expReportIdField').setValue(record.get('expReportId') || newReportId);
            vw.lookup('expReportNameField').setValue(record.get('reportName'));
            vw.lookup('expReportDateField').setValue(Ext.Date.format(new Date(record.get('reportDate')), DATE_FORMAT));
            vw.lookup('expReportStatusField').setValue(record.get('status') || FwaStatus.InProgress);
            grid.up('window').close();
        } else {
            expListGrid = Ext.first('explist');
            expListStore = expListGrid.getStore();
            store = grid.getStore();
            store.removeAll();
            newExpReport = Ext.create('TS.model.exp.ExpenseReport', {
                expReportId: Ext.data.identifier.Uuid.Global.generate(),
                reportDate: record.get('reportDate'),
                reportName: 'FSS ' + Ext.Date.format(record.get('reportDate'), 'Y-m-d') + '-' + settings.empId,
                createDate: new Date(),
                createUser: settings.empId,
                empId: settings.empId,
                status: 'I',
                expLines: []
            });
            //remove any lingering expenses
            expListStore.removeAll();
            //add new expense report
            store.add(newExpReport);
            settings.isNewExpReport = true;

            me.selectExpense(newExpReport);
        }
    },

    afterExpenseLoad: function (results, operation, success) {
        if (success) {
            var settings = TS.app.settings,
                showToast = false,
                store = Ext.first('explist').getStore();

            if (settings.expenseReportCopy) {
                Ext.each(store.getRange(), function (exp) {
                    exp.set('id', Ext.data.identifier.Uuid.Global.generate());
                    exp.set('expReportId', Ext.data.identifier.Uuid.Global.generate().replace(/-/g, ''));
                    exp.set('expDate', new Date());
                    exp.set('amount', null);
                });
                settings.expenseReportCopy = false;
            }

            if (results.length == 0) {
                Ext.toast({
                    html: 'Please add an expense by clicking "New Entry".',
                    title: 'Add Expense',
                    align: 'tl',
                    autoClose: true
                });
            }
        }
    },

    onCloseSelectExpense: function (component, e) {
        component.up('window').close();
    },

    openExpReportList: function (component, e) {
        Ext.create('TS.view.exp.ExpenseSelect', {
            buttons: [
                {
                    text: 'Open',
                    handler: 'selectExpense',
                    itemId: 'selectExpenseButton',
                    disabled: true
                }, {
                    text: 'Cancel',
                    align: 'right',
                    handler: 'onCloseSelectExpense'
                }
            ]
        }).show();
    },
    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
    copyExpenseItem: function (grid, rowIndex) {
        var settings = TS.app.settings,
            store = grid.getStore(),
            lastEntry = store.getAt(rowIndex),
            newExpense;

        if (lastEntry) {
            newExpense = lastEntry.copy(null);
            newExpense.set('id', Ext.data.identifier.Uuid.Global.generate());
            newExpense.set('expId', '');
            newExpense.set('amount', null);
            store.add(newExpense);
        }
    },

    createNewExpReport: function (component, e) {
        var settings = TS.app.settings,
            grid = Ext.first('expreportlist'),
            expListGrid = Ext.first('explist'),
            expListStore = expListGrid.getStore(),
            store = grid.getStore(),
            newExpReport = Ext.create('TS.model.exp.ExpenseReport', {
                expReportId: '',
                //reportDate: new Date(),
                createDate: new Date(),
                createUser: settings.empId,
                empId: settings.empId,
                status: 'I',
                expLines: []
            });
        //remove any lingering expenses
        expListStore.removeAll();
        //add new expense report
        store.add(newExpReport);
        settings.isNewExpReport = true;

        this.selectExpense(newExpReport);
    },

    checkExpenseRequiredValues: function () {

    },

    onSubmitExpenses: function (button, event) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = Ext.first('#expListGrid').getStore(),
            expenseList = Ext.Array.pluck(store.getRange(), 'data'),
            rptName = vw.lookup('expReportNameField').getValue(),
            badData = false;

        if (expenseList.length == 0) {
            Ext.Msg.alert('Warning', 'No entries have been entered for Expense Report: ' + rptName);
            return;
        }

        // if (!vw.lookup('expReportNameField').getValue() || !vw.lookup('expReportDateField').getValue()) {
        //     Ext.Msg.alert('Error', 'Both Report Name & Report Date are all required fields');
        //     badData = true;
        //     return;
        // }

        // Ext.each(expenseList, function (exp) {
        //     if (!exp.expDate || !exp.category || !exp.wbs1) {
        //         Ext.Msg.alert('Error', 'Expense Date, Category, & ' + settings.wbs1Label + ' are required fields.');
        //         badData = true;
        //         return;
        //     }
        // });

        if (!badData) {
            if (settings.exReqSubmitSignature) {
                Ext.create('TS.view.exp.ExpSubmitPin', {
                    reference: 'expSubmitPinPanel',
                    attType: 'Employee',
                    button: button,
                    event: event,
                    modal: true,
                    associatedRecordId: expenseList[0].expReportId,
                    attachmentsList: {
                        modelType: 'EXP',
                        expReportId: expenseList[0].expReportId,
                        attachmentType: AttachmentType.Expense
                    }
                }).show();
            } else {
                me.continueSubmitExpenseReport(button, event);
            }
        }
    },

    continueSubmitExpenseReport: function (button, event, attachment) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            store = Ext.first('#expListGrid').getStore(),
            expenseList = Ext.Array.pluck(store.getRange(), 'data'),
            signatureAttachment = attachment != null ? attachment.getData() : null,
            expReport = {
                expReportId: expenseList[0].expReportId,
                empId: expenseList[0].empId,
                reportDate: expenseList[0].reportDate,
                status: FwaStatus.Submitted,
                submittedBy: settings.empId,
                submittedDate: new Date(),
                signature: signatureAttachment,
                expLines: expenseList //[]
            };

        // expReport.reportDate = TS.common.Util.getOutUTCDate(expReport.reportDate);
        Ext.each(expReport.expLines, function (exp) {
            // exp.expDate = TS.common.Util.getOutUTCDate(exp.expDate);
            // exp.reportDate = TS.common.Util.getOutUTCDate(exp.reportDate);
            Ext.each(expReport.expLines, function (exp) {
                exp.status = FwaStatus.Submitted;
            });
        });

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to submit?", function (btn) {
            if (btn === 'yes') {
                Exp.SubmitExpReport(null, settings.username, expReport, signatureAttachment, function (response, operation, success) {
                    if (response && response.success) {
                        store.reload();
                        me.openExpReportList();
                        TS.Messages.getSimpleAlertMessage('expenseSubmitSuccess');
                        Ext.first('expreportlist').getStore().reload();
                    } else if (response) { // TODO -- Use Autohandle
                        Ext.GlobalEvents.fireEvent('Error', Ext.JSON.encode(response)); // Message attribute is a list of TS.model.shared.Error
                    }
                });
            }
        });
    }

});