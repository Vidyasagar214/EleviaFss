/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.controller.exa.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.exa-main',

    listen: {
        global: {
            'SelectExpApprovalDate': 'selectExpByApprovalDate',
            'SubmitExpAfterPinCheck': 'continueSubmitExpenseReport'
        }
    },
    init: function () {
        this.showExpApprovalDateSelect();
    },

    showExpApprovalDateSelect: function () {
        Ext.create('TS.view.exa.ExpApprovalDateSelect', {}).show();
    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
    },

    selectExpByApprovalDate: function (record) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            grid = Ext.first('#expApprovalListGrid'),
            store,
            expListGrid,
            expListStore,
            newExpReport;


    },

    onExpApprovalDateClick: function () {
        Ext.first('#selectExpApprovalDateButton').setDisabled(false);
    },

    onSaveExpenses: function (component, e) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            store = Ext.first('explist').getStore(),
            expenseList = Ext.Array.pluck(store.getRange(), 'data'),
            rptId = Ext.first('#expReportIdField').getValue(),
            rptName = Ext.first('#expReportNameField').getValue(),
            rptDate = Ext.first('#expReportDateField').getValue(),
            expReport = {
                expReportId: rptId || '',
                empId: settings.empId,
                reportDate: rptDate || null,
                reportName: rptName || null,
                status: FwaStatus.InProgress,
                submittedBy: settings.empId,
                submittedDate: new Date(),
                expLines: expenseList || [],
                signature: null
            };

        if (!settings.exApproverCanModify) {
            return;
        }
        // if (!rptName || !rptDate) {
        //     Ext.Msg.alert('Error', 'Both Report Name & Report Date are required fields');
        //     return;
        // }

        Exp.SaveExpReport(null, settings.username, expReport, function (response) {
            if (response && response.success) {
                TS.Messages.getSimpleAlertMessage('expenseSaveSuccess');
            } else if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, this, {
            autoHandle: true
        });
    },

    onSubmitExpenses: function (button, event) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = Ext.first('explist').getStore(),
            expenseList = Ext.Array.pluck(store.getRange(), 'data'),
            badData = false;

        // if (!vw.lookup('expReportNameField').getValue() || !vw.lookup('expReportDateField').getValue()) {
        //     Ext.Msg.alert('Error', 'Both Report Name & Report Date are all required fields');
        //     badData = true;
        //     return;
        // }

        Ext.each(expenseList, function (exp) {
            if (!exp.expDate || !exp.category || !exp.wbs1) {
                Ext.Msg.alert('Error', 'Expense Date, Category, & ' + settings.wbs1Label + ' are required fields.');
                badData = true;
                return;
            }
            exp.status = FwaStatus.Submitted;
        });

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
            vw = me.getView(),
            grid = vw.lookup('expListGrid'),
            store = grid.getStore(),
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

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to submit?", function (btn) {
            if (btn === 'yes') {
                Exp.SaveExpReport(null, settings.username, expReport, function (response, operation, success) {
                    if (response && response.success) {
                        TS.Messages.getSimpleAlertMessage('expenseSubmitSuccess');
                        store.reload();
                    } else if (response) { // TODO -- Use Autohandle
                        Ext.GlobalEvents.fireEvent('Error', Ext.JSON.encode(response)); // Message attribute is a list of TS.model.shared.Error
                    }
                });
            }
        });
    },


    onClickClose: function (component, e) {
        component.up('window').close();
    }
});