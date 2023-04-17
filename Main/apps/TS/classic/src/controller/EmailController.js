Ext.define('TS.controller.EmailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-email',

    requires: [
        'TS.model.shared.Email',
        'TS.model.shared.PrintTemplate'
    ],

    init: function (component) {
        var me = this,
            vw = me.getView(),
            infoText = vw.infoText,
            infoTextLabel = me.lookup('emailInfoText'),
            grid = me.lookup('emailAttachmentGrid'),
            settings = TS.app.settings,
            employee = Ext.getStore('Employees').getById(settings.empId),
            store;
        infoTextLabel.setBoxLabel(infoText);
        //load attachment grid
        if (vw.appType == 'FWA') {
            store = grid.getStore();
            store.getProxy().setExtraParams({
                modelType: 'FWA',
                modelId: vw.modelId,
                includeItem: false,
                attachmentType: 'X'
            });
            store.load({
                callback: this.loadUnSaved,
                scope: this
            });
            store.filterBy(function (obj) {
                return obj.get('attachmentType') != AttachmentType.ClientSignature && obj.get('attachmentType') != AttachmentType.EmpSignature;
            });
            grid.setHidden(false);
        }
        vw.lookup('ccEmailField').setValue(employee.get('emailAddress'));
    },

    loadUnSaved: function () {
        var me = this,
            vw = me.getView(),
            grid = me.lookup('emailAttachmentGrid'),
            store = grid.getStore(),
            form = Ext.first('#fwaForm').getForm(),
            attachmentsToAdd = form.getRecord().get('attachmentsToAdd') ? form.getRecord().get('attachmentsToAdd') : [];
        Ext.each(attachmentsToAdd, function (item) {
            store.add(item);
        });
    },

    sendEmail: function () {

        Ext.GlobalEvents.fireEvent('Loadmask', this.getView(), 'Sending email...'); // TODO - Localization
        var me = this,
            form = me.lookup('emailForm').getForm(),
            vw = me.getView(),
            record = form.getRecord(),
            emailData = me.lookup('emailForm').getValues(),
            offset = new Date().getTimezoneOffset() / 60,
            settings = TS.app.settings, saveFirst = vw.saveFirst ? vw.saveFirst : false,
            saveFirst = vw.saveFirst ? vw.saveFirst : false,
            fwa = Ext.first('#fwaForm') == null ? null : Ext.first('#fwaForm').getForm(),
            fwaData = vw.fwa,
            grid,
            store,
            items,
            attachList = [];

        if (vw.appType == 'Timesheet') {
            vw.appType = "TS";
        }

        if (vw.appType == 'FWA') {
            grid = Ext.first('#emailAttachmentGrid');
            store = grid.getStore();
            if (store.data.length > 0) {
                items = me.lookup('emailAttachmentGrid').getStore().getRange();
                Ext.each(items, function (item) {
                    if (item.data.select) {
                        attachList.push(item.data);
                    }
                })
            }
        }

        // Extra email params
        emailData.app = vw.appType;
        emailData.empId = settings.empId;
        emailData.modelId = vw.modelId;
        emailData.attachments = attachList;
        emailData.keepAfterSent = false; //TODO set this up to read from user config
        emailData.attachForm = emailData.attachFwa == '1' ? true : false;
        // Perform any validation
        if (form.isValid()) {
            if (fwaData) {
                Email.SendEmailWithUnsaved(null, settings.username, settings.empId, emailData, fwaData, offset, saveFirst, function (response, operation, success) {
                    if (saveFirst) {
                        fwa.getRecord().set('attachmentsToAdd', []);
                        fwa.dirty = false;
                    }
                    me.closeView();
                    Ext.Msg.alert('Success', settings.fwaAbbrevLabel + ' has been saved and email sent.');
                }, this, {
                    autoHandle: true,
                    failure: function () {
                        me.getView().setLoading(false);
                    }.bind(me)
                });
            } else {
                Email.SendEmail(null, settings.username, emailData, offset, function (response, operation, success) {
                    me.closeView();
                    Ext.GlobalEvents.fireEvent('Message:Code', 'sendEmailSuccess');
                }, this, {
                    autoHandle: true,
                    failure: function () {
                        me.getView().setLoading(false);
                    }.bind(me)
                });
            }
        } else {
            Ext.GlobalEvents.fireEvent('Message:Code', 'sendEmailMissingFields');
            me.getView().setLoading(false);
        }

    },

    closeEmail: function (component, e) {
        this.getView().close();
    }
});