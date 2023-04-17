/**
 * Created by steve.tess on 8/15/2018.
 */
Ext.define('TS.controller.exa.MainController', {
    extend: 'TS.view.main.MainController',
    alias: 'controller.exa-main',

    /**
     * Called when the view is created
     */
    control: {
        'button[action=tssign]': {
            tap: 'expSubmitPinClick'
        },
        'button[action=close]': {
            tap: 'onCloseSheet'
        }
    },

    onBackToFSS: function () {
        Ext.GlobalEvents.fireEvent('ChangeViewport', 'FSS');
        Ext.Viewport.setActiveItem('app-fss');
    },

    openAboutFss: function () {
        Ext.create('TS.view.crew.window.AboutFSS').show();
    },

    editSelectedExpDate: function (component, index, target, record, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = vm.getStore('expapprovallist'),
            selection = vm.get('selectedExpDate');

        vm.set('isExpApproval', true);

        vm.set('formattedDate', Ext.Date.format(new Date(selection.get('value')), DATE_FORMAT));
        store.getProxy().setExtraParams({
            expDate: selection.get('value')
        });

        store.load();

        vw.setActiveItem(1);
    },

    navigateBackToDateGrid: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel();
        vm.set('selectedExpReport', null);
        vw.setActiveItem(0);
    },

    navigateToGrid: function () {
        var me = this,
            vw = me.getView();
        vw.setActiveItem(1);

    },

    onExpensesSelectionTap: function (component, records) {
        var me = this,
            vw = me.getView(),
            rejectBtn = Ext.first('#rejectButton'),
            approveBtn = Ext.first('#approveButton');

        rejectBtn.setHidden(records[0].get('ttlRptExpenses') === 0 || (records[0].get('status') == TsStatus.Approved && records[0].get('visionStatus') == 'U'));
        approveBtn.setHidden(records[0].get('ttlRptExpenses') === 0 || (records[0].get('status') == TsStatus.Approved && records[0].get('visionStatus') == 'U'));

        // rejectBtn.setDisabled(false);
        // approveBtn.setDisabled((false))
    },

    /**
     * @param {Ext.dataview.List} component
     * @param {Ext.data.Model} record
     * @param {HTMLElement} target
     * @param {Number} index
     * @param {Ext.EventObject} e
     */
    onEditSelectedExpenses: function (component, index, target, record, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            settings = TS.app.settings,
            store = vm.getStore('explist'),
            selection = vm.get('selectedExpReport'),
            rptNameText = vw.lookup('reportNameText'),
            rptStatus = vw.lookup('reportStatusText'),
            status;

        if (record.get('expReportId')) {
            status = Ext.getStore('FwaStatus').findRecord('value', record.get('status')).get('description');
        } else {
            status = FwaStatus.InProgress;
        }
        store.getProxy().setExtraParams({
            expReportId: record.get('expReportId')
        });
        store.load({
            scope: me
            // callback: function () {
            //     me.afterExpenseLoad(store, record.get('oldRptId'));
            // }
        });

        if (record.get('reportName') != '') {
            rptNameText.setValue(record.get('reportName'));
            rptNameText.setReadOnly(true);
        } else {
            rptNameText.setValue('');
            //store.removeAll();
            rptNameText.setPlaceHolder('Enter Report Name');
            rptNameText.setReadOnly(false);
        }
        selection.dirty = false;
        rptStatus.setValue(status);
        vm.set('hasExpEditRights', settings.exApproverCanModify);
        vw.setActiveItem(2);
    },

    create_UUID: function () {
        // var dt = new Date().getTime();
        // var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //     var r = (dt + Math.random() * 16) % 16 | 0;
        //     dt = Math.floor(dt / 16);
        //     return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        // });
        return Ext.data.identifier.Uuid.Global.generate().replace(/-/g, '');  //uuid;
    },

    onSaveExpReport: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            store = vm.getStore('explist'),
            expReportStore = vm.get('expapprovallist'),
            settings = TS.app.settings,
            expenseList = Ext.Array.pluck(store.getRange(), 'data'),
            expReport = vm.get('selectedExpReport');

        expReport.set('reportName', vw.lookup('reportNameText').getValue());
        expReport.set('reportDate', new Date(vw.lookup('reportDateField').getHtml()));
        expReport.set('expReportId', expReport.get('expReportId') || me.create_UUID());

        expReport.set('submittedBy', '');
        expReport.set('submittedDate', new Date(2001, 1, 1));
        expReport.set('apprRejDate', new Date(2001, 1, 1));
        expReport.set('status', FwaStatus.InProgress);

        expReport = expReport.data;
        expReport.expLines = expenseList;

        // expReport.reportDate = TS.common.Util.getOutUTCDate(expReport.reportDate);
        // Ext.each(expReport.expLines, function(exp){
        //     exp.expDate = TS.common.Util.getOutUTCDate(exp.expDate);
        //     exp.reportDate = TS.common.Util.getOutUTCDate(exp.reportDate);
        // });

        Exp.SaveExpReport(null, settings.username, expReport, function (response) {
            if (response && response.success) {
                TS.Messages.getSimpleAlertMessage('expenseSaveSuccess');
                //expReportStore.rejectChanges();
                expReportStore.reload();
            } else if (response && !response.success) {
                Ext.GlobalEvents.fireEvent('Error', response);
            }
        }, this, {
            autoHandle: true
        });

        vw.setActiveItem(1);
    },

    doSubmitExpenseReport: function (bt) {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedExpReport'),
            expReportId = selection.get('expReportId'),
            empId = selection.get('empId'),
            settings = TS.app.settings,
            baseView = Ext.first('app-exp');

        Ext.Msg.confirm("Please Confirm", "<div style:'align:center;'>Are you sure you want to submit?</div>", function (btn) {
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
                            modelId: expReportId,
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

        Ext.each(expReport.expLines, function (exp) {
            exp.status = FwaStatus.Submitted;
        });

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
        vw.setActiveItem(1);
    },

    approveSelectedExpReport: function () {
        var me = this,
            vm = me.getViewModel(),
            selection = vm.get('selectedExpReport'),
            status = selection.get('status');

        if (status === 'I') {
            Ext.Msg.confirm('Confirmation', 'Please confirm that you would like to approve this expense that is still IN-PROGRESS?', function (btn) {
                if (btn === 'yes') {
                    me.onApproveExpense();
                } else if (btn === 'no') {

                }
            });
        } else {
            me.onApproveExpense();
        }
    },

    onApproveExpense: function () {
        var me = this,
            vm = me.getViewModel(),
            settings = TS.app.settings,
            selectedExpReport = vm.get('selectedExpReport'),
            expReportId = selectedExpReport.get('expReportId'),
            baseView = Ext.first('app-exa'),
            sheet,
            title;

        if (settings.exReqApprovalSignature) {
            sheet = Ext.create({
                xtype: 'ts-submitpin',
                //Fuse view models
                viewModel: {
                    parent: me.getViewModel()
                },
                attType: 'Employee',
                associatedRecordId: expReportId,
                attachmentsList: {
                    modelType: 'EXA',
                    modelId: expReportId,
                    attachmentType: 'E'
                }
            });
            title = Ext.first('#signatureTitleBar');
            title.setTitle('Expense Approval');
            baseView.add(sheet);
            sheet.show();

        } else {
            me.continueAfterApprovalSignature();
        }
    },

    continueAfterApprovalSignature: function (btn, attachment) {
        var me = this,
            vm = me.getViewModel(),
            //settings = TS.app.settings,
            //selectedExpReport = vm.get('selectedExpReport'),
            //expReportId = selectedExpReport.get('expReportId'),
            baseView = Ext.first('app-exa'),
            sheet;

        sheet = Ext.create({
            xtype: 'exp-approvereject',
            viewModel: {
                parent: me.getViewModel()
            },
            approvalType: 'Approval',
            attachment: attachment
        });
        Ext.first('#approveRejectTitleText').setTitle('Approval Comment');
        Ext.first('#approveRejectCommentText').setHtml('Please provide a comment for your approval.');
        if (btn) {
            btn.up('sheet').hide();
        }
        baseView.add(sheet);
        sheet.show();
    },

    rejectSelectedExpReport: function () {
        var me = this,
            baseView = Ext.first('app-exa'),
            sheet = Ext.create({
                xtype: 'exp-approvereject',
                viewModel: {
                    parent: me.getViewModel()
                },
                approvalType: 'Rejection'
            });

        Ext.first('#approveRejectTitleText').setTitle('Rejection Comment');
        Ext.first('#approveRejectCommentText').setHtml('Please provide a comment for your rejection.');
        baseView.add(sheet);
        sheet.show();
    },

    sendApproveReject: function (bt) {
        var me = this,
            settings = TS.app.settings,
            vm = me.getViewModel(),
            selectedExpReport = vm.get('selectedExpReport'),
            expReportId = selectedExpReport.get('expReportId'),
            isApproval = Ext.first('exp-approvereject').approvalType === 'Approval',
            attachment = Ext.first('exp-approvereject').attachment,
            comments = Ext.first('#approveRejectComment').getValue(),
            store = vm.getStore('expapprovallist'),
            signatureAttachment = attachment != null ? attachment.getData() : null;

        if (!isApproval && (!comments || comments == '')) {
            Ext.Msg.alert('Missing Comment', 'Expense comments are required when rejecting.');
            return;
        }

        Exp.ApproveRejectExpense(null, settings.username, expReportId, isApproval, comments, signatureAttachment, function (response, operation, success) {
            store.reload();
        }, me, {
            autoHandle: true
        });

        Ext.first('#approveButton').setDisabled(true);
        Ext.first('#rejectButton').setDisabled(true);
        bt.up('sheet').hide();
    },

    onCloseSheet: function (bt) {
        bt.up('sheet').hide();
    },

    expSubmitPinClick: function (bt) {
        var me = this,
            settings = TS.app.settings,
            pin = me.lookup('tsSubmitPinField').getValue(),
            view = me.getView(),
            button = me.lookup('saveSignatureButton');

        // if (!view.lookup('tsSubmitPinField').getValue()) {
        //     Ext.Msg.alert('Warning', 'PIN and Signature are both required');
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
        //         me.lookup('tsSubmitPinField').setValue('');
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
            type: 'EXA',
            location: settings.imageStorageLoc,
            associatedId: expReportId,
            attachmentType: 'E',
            fileExt: 'png',
            fileName: 'signature_' + Ext.data.identifier.Uuid.Global.generate(), // TODO - How should this be autogenerated?
            description: 'Expense Approval Signature',
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

            me.continueAfterApprovalSignature(bt, attachmentRecord);
        }, me));
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

    editSelectedExpense: function (component, index, target, record, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            selection = vm.get('selectedEXP'),
            settings = TS.app.settings;

        if (selection.get('amountPerMile') == 0)
            selection.set('amountPerMile', settings.exMileageRate);
        // clone in case we cancel edit
        vm.set('originalValues', selection.clone());

        if (!settings.exCanModifyFwaExp && selection.get('fwaId')) {
            vm.set('hasExpEditRights', false);
        } else {
            vm.set('hasExpEditRights', settings.exApproverCanModify);
        }

        vw.lookup('updateExpButton').setDisabled(!vm.get('hasExpEditRights'));

        vw.lookup('showFwaButton').setHidden(!selection.get('fwaId'));
        vw.lookup('fwaNumberField').setHidden(!selection.get('fwaId'));
        vw.lookup('fwaNameField').setHidden(!selection.get('fwaId'));

        vw.lookup('expenseEditMenuButton').setHidden(true);
        vw.setActiveItem(3);
    },

    onCategoryChange: function (component, nValue, oValue) {
        var me = this,
            vw = me.getView(),
            reasonField = vw.lookup('reasonField'),
            otherField = vw.lookup('otherField'),
            milesField = vw.lookup('milesField'),
            amountPerMileField = vw.lookup('amountPerMileField'),
            billableField = vw.lookup('billableCheckBoxField'),
            detailType,
            record;

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
            chargeType;

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
    },

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

    onWbs1Change: function (rec, newValue, oldValue, eOpts) {
        this.setAccount(null, null, null);
    },

    onWbsChange: function (rec, newValue, oldValue, eOpts) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            selectedExp = vm.get('selectedExpReport'),
            selection = vm.get('selectedEXP'),
            wbs1 = selection && selection.get('wbs1') ? selection.get('wbs1') : vw.lookup('wbs1combo') && vw.lookup('wbs1combo').getSelection() ? vw.lookup('wbs1combo').getSelection().get('id') : '',
            wbs2 = selection && selection.get('wbs2') ? selection.get('wbs2') : vw.lookup('wbs2combo') && vw.lookup('wbs2combo').getSelection() ? vw.lookup('wbs2combo').getSelection().get('id') : '',
            wbs3 = selection ? selection.get('wbs3') : '',
            models = [],
            locModel = [];

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
        vm.set('selectedEXP', expense);
        Ext.first('#showFwaButton').hide();
        Ext.first('#fwaNameField').setValue('');
        vw.lookup('fwaNumberField').setHidden(true);
        vw.lookup('fwaNameField').setHidden(true);
        vw.setActiveItem(2);
        //bt.up('explist-editmenu').hide();
    },

    onEditMenuTap: function () {
        var me = this,
            vw = me.getView(),
            menu = Ext.first('app-exa').add({xtype: 'exp-editmenu'});

        menu.show();
    },

    onCancelExp: function () {
        var me = this,
            vm = me.getViewModel(),
            // selected = vm.get('selectedEXP'),
            // original = vm.get('originalValues'),
            listStore = vm.getStore('explist');
            // record = listStore.getById(selected.id);
        //removes changed record
        //listStore.remove(record);
        //add back original values
        //listStore.add(original);
        listStore.reload();
        listStore.sort([
            {
                property: 'sortOrder',
                direction: 'ASC'
            }
        ]);
        //reset originalValues
        vm.set('originalValues', null);
        Ext.first('app-exa').setActiveItem(2);
        //vm.set('hasExpEditRights', true);
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

        if (!reportDate.value ) {
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
        me.onSaveExpReport();
        vw.setActiveItem(2);
        //Ext.Msg.alert('FYI', 'New or updated expense items must be saved or submitted.')
        vw.lookup('expenseList').deselectAll();
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
            store = vm.get('expapprovallist'),
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
            menu = Ext.first('app-exa').add({xtype: 'explist-editmenu'});
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
        //if (wbs1Store.getRange().length == 0) return;
        if (categoryRecord)
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
    }


});