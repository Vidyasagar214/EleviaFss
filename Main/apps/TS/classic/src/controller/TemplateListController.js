/**
 * Created by steve.tess on 2/21/2018.
 */
Ext.define('TS.controller.TemplateListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.templatelist',


    init: function () {
        var me = this,
            vw = me.getView(),
            infoText = vw.infoText,
            infoTextLabel = me.lookup('emailInfoText'),
            grid = me.lookup('templateListGrid'),
            settings = TS.app.settings,
            store = grid.getStore(),
            wasDirty = Ext.first('#fwaForm').getRecord().dirty;

        vw.setTitle(infoText);
        store.getProxy().setExtraParams({
            modelType: vw.appType,
            modelId: vw.fwaId
        });

        store.load({
            callback: function (rec) {
                Ext.each(rec, function (template) {
                    var fwa = Ext.first('#fwaForm').getRecord(),
                        filename = template.get('filename'),
                        wbs1 = fwa.get('wbs1'),
                        wbs2 = fwa.get('wbs2'),
                        wbs3 = fwa.get('wbs3'),
                        fwaNum = fwa.get('fwaNum');
                    if (filename.toUpperCase().indexOf('LEM') !== -1) {
                        var dt = Ext.Date.format(new Date(), 'm-d-Y');
                        filename = 'LHB_LEM ';
                        if (wbs1) filename += ' ' + wbs1;
                        // if (wbs2) filename += '-' + wbs2;
                        // if (wbs3) filename += '-' + wbs3;
                        filename += ' ' + dt + ' FWA ' + fwaNum;
                    }

                    template.set('filename', filename);
                });

                if(!wasDirty)
                    Ext.first('#fwaForm').getRecord().dirty = false;
            }
        });

        store.filterBy(function (record) {
            return (record.get('templateApp') === vw.appType);
        }, this);

    },

    onTemplateCheckChange: function (obj, rowIndex, checked, record, e, eOpts) {
        var me = this,
            vw = me.getView(),
            grid = vw.lookup('templateListGrid'),
            attachButton = vw.lookup('attachTemplateBtn'),
            ct = 0;

        grid.getStore().each(function (record) {
            if (record.get('select') == true) {
                ct++;
            }
        });

        attachButton.setDisabled(ct == 0);
    },

    closeTemplate: function (component, e) {
        this.getView().close();
    },

    attachTemplate: function (btn) {
        var me = this,
            vw = me.getView(),
            form = Ext.first('#fwaForm'),
            fwa = form.getRecord(),
            fwaId = fwa.get('fwaId'),
            cloneFwa = fwa.clone(),
            settings = TS.app.settings,
            location = settings.documentStorageLoc,
            grid = vw.lookup('templateListGrid'),
            offset = new Date().getTimezoneOffset() / 60,
            selectCt = 0,
            dt = Ext.Date.format(new Date(), 'Y-m-d'),
            ret = true,
            fwaUnitGrid = Ext.first('grid-unit'),
            fwaData,
            saveFirst = false, //form.getForm().dirty,
            fwaForm = Ext.first('#fwaForm').getForm(),
            formDirty = fwaForm.dirty,
            items = fwaForm.getFields().items,
            data,
            ct;

        Ext.each(items, function (i) {
            if (i.dirty && (i.originalValue && i.originalValue != i.value)) {
                saveFirst = true;
            }
        });

        saveFirst = (saveFirst || formDirty);

        btn.focus();
        grid.getStore().each(function (record) {
            if (record.get('select') == true) {
                selectCt++;
            }
        });
        //check for blank entries
        grid.getStore().each(function (record) {
            if (record.get('select') == true) {
                if (!record.get('filename') || !record.get('description')) {
                    ret = false;
                    Ext.Msg.alert('FYI', 'Both Filename & Description are required fields');
                }
            }
        });
        //if any required fields blank - return
        if (!ret) return;
        ct = 0;
        grid.getStore().each(function (record) {
            var tType = record.get('templateType');
            if (record.get('select') == true) {
                ct++;
                cloneFwa.set('schedStartDate', Ext.first('#schedStartDateField').getValue());
                cloneFwa.set('schedEndDate', Ext.first('#schedEndDateField').getValue());
                // fwaData = TS.Util.checkFwaForValidDates(fwa.data);
                fwaData = TS.Util.checkFwaGridObjects(cloneFwa.data, fwaUnitGrid);
                fwaData.attachments = [];
                Document.GetUnsavedFwaDocument(null, settings.username, settings.empId, record.get('templateId'), record.get('templateApp'), fwaId, fwaData, tType, 'Y', offset, saveFirst, function (response, operation, success) {
                    if (success && response.data) {
                        if (saveFirst) {
                            fwa.set('attachmentsToAdd', []);
                            fwa.dirty = false;
                        }
                        data = {
                            associatedId: fwaId,
                            attachedByEmpId: settings.empId,
                            attachmentType: 'D',
                            location: location,
                            fileExt: tType == 'H' ? 'html' : tType == 'X' ? 'xlsx' : tType == 'D' ? 'docx' : 'txt',
                            fileName: record.get('filename'),
                            description: record.get('description'),
                            file: response.data,
                            type: 'FWA'
                        };
                        me.performRecordUpload(data, vw, ct === selectCt);
                    } else {
                        if (success && !response.data) {
                            Ext.Msg.alert('Warning', 'No data returned for selected template.')
                        } else {
                            Ext.Msg.alert('Warning', 'No data returned for selected template.')
                        }
                    }
                }, me, {
                    autoHandle: true
                });
            }
        });
        this.getView().close();
    },

    checkDailyTtlHours: function (empHours) {
        var empList = [],
            dayList = [],
            ttlHrs = 0,
            tempValue,
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

    performRecordUpload: function (data, view, closeWindow) {
        var me = this,
            dataRecord,
            settings = TS.app.settings,
            attachmentRecord = Ext.create('TS.model.shared.Attachment', {
                owningModelType: data.type,
                owningModelId: data.associatedId,
                dateAttached: Ext.Date.format(data.date || new Date(), DATE_FORMAT + ' g:i A'),
                attachedByEmpId: data.attachedByEmpId,
                attachmentType: data.attachmentType,
                location: data.location,
                extension: data.fileExt,
                filename: data.fileName,
                description: data.description
            }),
            fwa = Ext.first('#fwaForm'),
            form = fwa.getForm(),
            record = fwa.getRecord(),
            attachmentsToAdd = record.get('attachmentsToAdd') || [];

        view.setLoading(true);
        dataRecord = Ext.create('TS.model.shared.AttachmentData', {
            attachmentItem: data.file
        });
        attachmentRecord.set('attachmentItem', dataRecord.get('attachmentItem'));
        attachmentRecord.set('base64String', dataRecord.get('attachmentItem'));
        attachmentsToAdd.push(attachmentRecord.getData());
        record.set('attachmentsToAdd', attachmentsToAdd);
        view.setLoading(false);

        form.dirty = true;
        if (closeWindow) {
            view.close();
            //only reset counts if NOT a work code
            if (data.associatedId.indexOf('||') === -1) {
                // Ext.GlobalEvents.fireEvent('ResetAttachmentCounts', data.attachmentType);
                me.onResetAttachmentCounts(data.attachmentType);
            }
        }
    },

    onResetAttachmentCounts: function (attachmentType, isDelete) {
        var me = this,
            form = Ext.first('#fwaForm'),
            fwa = form.getRecord(),//me.getView().getRecord(),
            recordId = fwa.get('fwaId'),
            settings = TS.app.settings,
            docBtn = null,
            docCt = fwa.get('attachmentCtDoc'),
            picBtn = null,
            picCt = fwa.get('attachmentCtPhoto'),
            attachText = me.getAttachmentText(fwa);
        if (attachmentType == AttachmentType.Photo) {
            picBtn = form.lookup('showAttachPhotoButton');
            if (isDelete) {
                picBtn.setText(attachText + ' Photo (' + (picCt - 1) + ')');
                fwa.set('attachmentCtPhoto', (picCt - 1));
            } else {
                picBtn.setText(attachText + ' Photo (' + (picCt + 1) + ')');
                fwa.set('attachmentCtPhoto', (picCt + 1));
            }
        } else if (attachmentType == AttachmentType.Document) {
            docBtn = form.lookup('showAttachDocButton');
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
        var settings = TS.app.settings;
        return settings.fwaCreateNew || settings.fwaCanModify == 'A' || (fwa.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwa.get('fwaApproversCanModify')) ? 'Attach' : 'View';
    }
});