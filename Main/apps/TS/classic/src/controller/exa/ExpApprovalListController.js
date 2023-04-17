/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.controller.exa.ExpApprovalListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.expapprovallist',

    listen: {
        global: {
            'resetRejectPopup': 'sendApproveReject',
            'ApproveRejectExpAfterPinCheck': 'continueExpenseApproval'
        }
    },

    init: function () {
        //Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    },

    acceptApproval: function (grid, rowIndex, colIndex) {
        var me = this,
            row = grid.getStore().getAt(rowIndex),
            settings = TS.app.settings,
            status = row.get('status');
        if (status == 'I') {
            Ext.Msg.show({
                title: 'Confirmation',
                message: 'Please confirm that you would like to approve this expense that is still IN-PROGRESS?',
                buttonText: {
                    yes: 'Confirm',
                    no: 'Cancel'
                },
                icon: Ext.Msg.QUESTION,
                fn: function (btn) {
                    if (btn === 'yes') {
                        me.sendApproveReject(grid, row, true);
                    } else if (btn === 'no') {
                        return;
                    }
                }
            });
        } else {
            me.sendApproveReject(grid, row, true);
        }
    },

    rejectApproval: function (grid, rowIndex, colIndex) {
        this.sendApproveReject(grid, grid.getStore().getAt(rowIndex), false);
    },

    sendApproveReject: function (grid, record, flag) {
        var me = this,
            settings = TS.app.settings,
            expReportId = record.get('expReportId');

        if (settings.exReqApprovalSignature) {
            Ext.create('TS.view.exa.ExpApprovalSubmitPin', {
                reference: 'expApprovalSubmitPinPanel',
                attType: 'Employee',
                title: !flag ? 'Reject Expense' : 'Approve Expense',
                modal: true,
                associatedRecordId: record.get('expReportId'),
                grid: grid,
                record: record,
                flag: flag,
                attachmentsList: {
                    modelType: 'EXP',
                    expReportId: record.get('expReportId'),
                    attachmentType: AttachmentType.Expense
                }
            }).show();
        }
        else {
            me.continueExpenseApproval(grid, record, flag)
        }
    },

    continueExpenseApproval: function (grid, record, flag, attachment) {
        var me = this,
            settings = TS.app.settings,
            signatureAttachment = attachment != null ? attachment.getData() : null;

        Ext.Msg.prompt((flag ? 'Approval' : 'Rejection') + ' Comment', 'Please provide a comment for your ' + (flag ? 'approval' : 'rejection') + '.', function (btn, comment) {
            if (btn == 'ok') {
                if (!flag && comment == '') {
                    Ext.Msg.show({
                        title: 'Missing Comment',
                        message: 'Comments are required when rejecting an expense. Would you like to continue?',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.WARNING,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                Ext.GlobalEvents.fireEvent('resetRejectPopup', grid, record, flag);
                            }
                        }
                    });
                } else {
                    if (comment == '') {
                        comment = 'NA';
                    }
                    Exp.ApproveRejectExpense(null, settings.username, record.get('expReportId'), flag, comment, signatureAttachment, function (response, operation, success) {
                        //Ext.GlobalEvents.fireEvent('Message:Code', (flag ? 'expenseApproveSuccess' : 'expenseRejectSuccess'));
                        //refresh grid
                        grid.getStore().reload();
                    }, me, {
                        autoHandle: true
                    });
                }
            }
        });
    },

    /**
     * @param {Ext.view.Table} component
     * @param {HTMLElement} td
     * @param {Number} cellIndex
     * @param {Ext.data.Model} record
     * @param {HTMLElement} tr
     * @param {Number} rowIndex
     * @param {Ext.event.Event} e
     */
    openExpenseReportEditor: function (gridView, htmlElement, columnIndex, dataRecord) {

        if (columnIndex == 2 || columnIndex == 3) {
            var me = this,
                settings = TS.app.settings,
                w = window,
                d = document,
                e = d.documentElement,
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight || e.clientHeight || g.clientHeight,
                currentApproverCanModify = settings.exApproverCanModify,
                selectedExpense = dataRecord,
                empRecord = Ext.getStore('AllEmployees').getById(dataRecord.get('empId')),
                empName = empRecord.get('lname') + ', ' + empRecord.get('fname'),
                grid,
                gridStore,
                win;

            if (me.win)
                me.win.close();

            win = Ext.create('TS.view.exa.ExpApprovalExpenseList', {
                title: empName,
                modal: true,
                isPopup: true,
                employeeExpense: dataRecord,
                // expReportId: selectedExpense.get('expReportId'),
                width: x * .90,
                height: y * .90
            });

            grid = Ext.first('explist');
            gridStore = grid.getViewModel().getStore('explist');
            gridStore.removeAll();
            gridStore.getProxy().setExtraParams({
                expReportId: dataRecord.get('expReportId')
            });
            gridStore.load();

            //grid.setDisabled(!settings.exApproverCanModify);

            Ext.first('#expReportIdField').setValue(dataRecord.get('expReportId'));
            Ext.first('#expReportNameField').setValue(dataRecord.get('reportName'));
            Ext.first('#expReportDateField').setValue(Ext.Date.format(new Date(dataRecord.get('reportDate')),DATE_FORMAT));
            Ext.first('#expReportStatusField').setValue(dataRecord.get('status'));

            Ext.first('#saveExpenseButton').setDisabled(!settings.exApproverCanModify);
            Ext.first('#submitExpenseButton').setDisabled(!settings.exApproverCanModify);

            win.show();
        }
    }

});