Ext.define('TS.controller.fwa.AttachmentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-attachment',

    mobileFile: null,
    isMobile: false,

    config: {
        listen: {
            global: {
                'ReloadAttachmentList': 'closeAndReload',
                'ResetAttachmentCounts': 'onResetAttachmentCounts'
            }
        }
    },

    init: function () {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView();
        me.updateUploadType();
        if (me.getView().getAttachmentsList()) {
            me.addAttachmentsList();
        }
        vw.lookup('includeTemplates').setHidden(vw.hideTemplateButton);

        if (settings.fwaCanModify == 'N') {
            vw.lookup('includeTemplates').setDisabled(true);
            vw.lookup('fileUploadButton').setDisabled(true);
        }
    },

    /*
     * Methods to add optional components to the window
     */
    closeAndReload: function (type, owningModelId) {
        var me = this,
            ref = me.getView().reference,
            refHolder = me.getView().lookupReferenceHolder(),
            id = (typeof owningModelId) == 'string' ? owningModelId : me.getView().getRecord().getId();

        if (refHolder) delete refHolder.getView().refs[ref];

        if (type == AttachmentType.Document) {
            Ext.GlobalEvents.fireEvent('ReloadDocumentAttachments', id)
        } else if (type == AttachmentType.Photo) {
            Ext.GlobalEvents.fireEvent('ReloadImageAttachments', id)
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
    },

    addImagePreview: function () {
        this.lookup('attachmentForm').add({
            xtype: 'fieldset',
            title: 'Preview',
            scrollable: true,
            style: 'padding:10 10 10 0;',
            width: '95%',
            height: 200,
            items: [{
                xtype: 'image',
                src: '',
                mode: 'image',
                reference: 'imagePreview',
                width: 300,
                style: 'padding:10 10 10 0;'
            }]
        });
        Ext.first('window-attachment').setHeight(null);
    },

    addAttachmentsList: function () {
        this.lookup('attachmentForm').add({
            xtype: 'panel',
            title: 'Attachments',
            collapsible: true,
            scrollable: true,
            layout: 'fit',
            width: '95%',
            height: 200,
            items: [{
                xtype: 'dataview-attachments',
                reference: 'attachmentDataView',
                attachmentParams: this.getView().getAttachmentsList()
            }]
        })
    },

    /*
     * Sets the proper upload type, called on init
     */

    updateUploadType: function () {
        var me = this,
            vm = me.getViewModel(),
            fwaForm = Ext.first('#fwaForm'),
            record,
            title = me.getView().getAttType(),
            fileField = me.lookup('fileUploadField'),
            uploadButton = me.lookup('fileUploadButton'),
            templateButton = me.lookup('includeTemplates'),
            settings = TS.app.settings;

        if (fwaForm) {
            record = fwaForm.getRecord();
        }

        //Set the correct titles according to the 'title' sent by the controller that opens the upload window
        me.getView().setTitle("Attach " + title);
        fileField.setFieldLabel(title);
        uploadButton.setText("Upload " + title);

        if (record) {
            if (settings.fwaCreateNew) {
                Ext.first('#attachFormFrame').setHidden(false);
                if (title == "Photo") {
                    fileField.regex = /^.*\.(png|PNG|BMP|JPG|jpg|JPEG)$/;
                    fileField.regexText = 'Only Image files allowed';
                    me.getView().height = 250; //Add space for the preview area
                    me.addImagePreview(); //If the upload type is Photo, add a preview area
                }
            } else if (vm.get('isScheduler') && settings.fwaCanModify == 'A' ||
                (record.get('fwaApprovers').indexOf(settings.empId) !== -1 && record.get('fwaApproversCanModify'))) {
                Ext.first('#attachFormFrame').setHidden(false);
                if (title == "Photo") {
                    fileField.regex = /^.*\.(png|PNG|BMP|JPG|jpg|JPEG)$/;
                    fileField.regexText = 'Only Image files allowed';
                    me.getView().height = 250; //Add space for the preview area
                    me.addImagePreview(); //If the upload type is Photo, add a preview area
                }
            } else if (settings.fwaCanModify == 'A' ||
                (settings.fwaCanModify == 'M' && record.get('scheduledCrewChiefId') == settings.empId) ||
                (record.get('fwaApprovers').indexOf(settings.empId) !== -1 && record.get('fwaApproversCanModify'))) {
                Ext.first('#attachFormFrame').setHidden(false);
                if (title == "Photo") {
                    fileField.regex = /^.*\.(png|PNG|BMP|JPG|jpg|JPEG)$/;
                    fileField.regexText = 'Only Image files allowed';
                    me.getView().height = 250; //Add space for the preview area
                    me.addImagePreview(); //If the upload type is Photo, add a preview area
                }
            } else {
                Ext.first('#attachFormFrame').setHidden(true);
                me.getView().setTitle("View " + title);
                uploadButton.setHidden(true);
                templateButton.setHidden(true);
            }
        } else {
            templateButton.setHidden(true);
        }

    },
    /*
     * Helper Methods
     */
    convertFileToByteData: function (file, callback) {
        var reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                // Convert to plain array for sending through to Ext.Direct
                //console.log(e.target.result);
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

    getRawFile: function () {
        if (this.isMobile) {
            return this.mobileFile || false;
        } else {
            return this.lookup('fileUploadField').fileInputEl.dom.files[0] || false;
        }
    },

    /*
     * Listener Methods
     */

    //onWindowClose: function(){
    //    var ref = this.getView().reference,
    //        refHolder = this.getView().lookupReferenceHolder();
    //    this.getView().close();
    //    if (refHolder) delete refHolder.getView().refs[ref];
    //},

    convertToDegrees: function (val) {
        var d0 = val[0].numerator,
            d1 = val[0].denominator,
            d = d0 / d1,

            m0 = val[1].numerator,
            m1 = val[1].denominator,
            m = m0 / m1,

            s0 = val[2].numerator,
            s1 = val[2].denominator,
            s = s0 / s1;

        return d + (m / 60.0) + (s / 3600.0);
    },

    onFileUpload: function () {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            attType = vw.getAttType(),
            settings = TS.app.settings,
            location = vw.getLocation(),
            associatedId = vw.getAssociatedRecordId(),
            file = me.getRawFile(),
            attachList = vw.getAttachmentsList(),
            description = me.lookup('descfield'),
            filename = me.lookup('fileNameField'),
            //includeTemplates = me.lookup('includeTemplates').getValue(),
            fwaRecord = vw.fwaListRecord,
            nameArray,
            len,
            data,
            refHolder,
            arr,
            ref,
            ext;

        if (attType == 'Document') {
            arr = vw.lookup('fileUploadField').getValue().split('.');
            len = arr.length;
            ext = arr[len - 1];
        } else { //this is an image load
            ext = file.name.split('.')[1]; //file.type.split('/')[1];
        }

        if ((ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'zip' || ext == 'gif') && attType == 'Document') {
            Ext.Msg.alert('Warning', 'Not an acceptable document type.');
            return;
        }

        if (!file) {
            // TODO -- Apply localization to this language
            Ext.Msg.alert(attType + ' Upload', 'Please choose a ' + attType + ' to upload.');
            return;
        }

        if (!description.getValue() || !filename.getValue()) {
            Ext.Msg.alert('FYI', 'Both File Name & Description are required fields');
            me.getView().setLoading(false);
            return;
        }

        data = {
            isExpenseGrid: settings.isExpenseGrid,
            record: vw.config.record,
            associatedId: associatedId,
            attachedByEmpId: settings.empId,
            attachmentType: attachList.attachmentType,
            location: location,
            fileExt: ext,
            fileName: filename.getValue(),
            description: description.getValue(),
            file: file,
            type: attachList.modelType,
            fromFwaList: attachList.isFromFwaList,

        };

        settings.myImage = null;
        settings.isExpenseGrid = null;
        me.performRecordUpload(data, fwaRecord, vm.get('isScheduler'), true);
        ref = me.getView().reference;
        refHolder = me.getView().lookupReferenceHolder();

        if (refHolder) {
            delete refHolder.getView().refs[ref];
        }
        //Ext.first('#fwaForm').getController().updateFwaForm(Ext.first('#showAttachDocButton'), null);
    },

    reverseStringReturnExtention: function (s) {
        var sArray = s.split(''),
            rString = sArray.reverse(),
            jArray = rString.join(''),
            rExt = jArray.split('.')[0];

        sArray = rExt.split('');
        rString = sArray.reverse();
        return rString.join('');
    },

    onFileUploadChange: function (e, newValue) {
        //strip off C:\fakepath\
        var me = this,
            vw = me.getView(),
            record = vw.record,
            sArray = newValue.split(''),
            rString = sArray.reverse(),
            ext = me.reverseStringReturnExtention(newValue),
            descriptionfield = me.lookup('descfield'),
            filenamefield = me.lookup('fileNameField'),
            dt = Ext.Date.format(new Date(), 'Y-m-d'),
            fileName,
            txtField,
            captureType,
            fileNameOnly,
            file;
        //chrome and others
        fileName = newValue.replace(/C:\\fakepath\\/g, '');
        //IE & Edge
        file = fileName.split('\\');
        fileName = file[file.length - 1];
        fileNameOnly = fileName.replace('.' + ext, '');

        txtField = me.getView().lookup('fileUploadField');
        txtField.setRawValue(fileName);

        descriptionfield.setValue(fileNameOnly);//dt + ' ' +
        filenamefield.setValue(fileNameOnly);
        me.setImagePreview();
    },

    setImagePreview: function () {
        var me = this,
            fileField = me.lookup('fileUploadField'),
            settings = TS.app.settings,
            file,
            imageView,
            reader,
            img;

        if (fileField.getFieldLabel() != "Photo") return; // TODO - Only display preview if it's an image upload, Need a better way to do this?
        file = me.getRawFile();
        imageView = me.lookup('imagePreview');
        if (file && file.type.match('image.*')) {
            reader = new FileReader();
            reader.onload = function (e) {
                imageView.setSrc(e.target.result);
                settings.myImage = '<img src="' + imageView.getSrc() + '" />';
            };
            reader.readAsDataURL(file);
            reader.onloadend = function (evt) {
                img = new Image();
                img.src = evt.target.result;
                settings.myImage = img;
            };
        }
    },

    /*
     * Peforms the actual API save, used by extended VCs
     */
    performRecordUpload: function (data, fwaRecord, isScheduler, successCallback) {

        var me = this,
            vw = me.getView(),
            saveType,
            dataRecord,
            file,
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
                // includeEmail: data.includeEmail,
                // emailAddress: data.emailAddress
            }),
            fwa,
            record,
            attachmentsToAdd,
            isExpense;

        if (!data.isExpenseGrid) {
            //Ext.first('fwalist') selected Item
            fwa = Ext.first('#fwaForm') || Ext.first('#expListGrid') || vw.fwaListRecord;
            record = fwa.getRecord() || fwa.getForm() || vw.fwaListRecord;

            if (fwa.getRecord()) {
                attachmentsToAdd = record.get('attachmentsToAdd') || [];
            } else if (fwa.getForm()) {
                isExpense = true;
                attachmentsToAdd = record.attachmentsToAdd || [];
            }
        } else {
            record = data.record;
            isExpense = true;
            attachmentsToAdd = record.attachmentsToAdd || [];
        }

        me.getView().setLoading(true);
        saveType = (data.attachmentType.charAt(0) == AttachmentType.Document || data.attachmentType.charAt(0) == AttachmentType.Expense) ? 'Document' : (data.attachmentType.charAt(0) == AttachmentType.Photo) ? 'Photo' : 'Signature';

        me.convertFileToByteData(data.file, Ext.bind(function (byteData) {
            if (saveType == 'Signature')
                dataRecord = Ext.create('TS.model.shared.AttachmentData', {
                    attachmentItem: data.bytesArray
                });
            else
                dataRecord = Ext.create('TS.model.shared.AttachmentData', {
                    attachmentItem: me.arrayToBase64String(byteData) //byteData
                });
            attachmentRecord.set('attachmentItem', dataRecord.get('attachmentItem'));
            attachmentsToAdd.push(attachmentRecord.getData());

            record.set('attachmentsToAdd', attachmentsToAdd);

            me.getView().setLoading(false);
            me.getView().close();
            //only reset counts if NOT a work code
            if (data.associatedId.indexOf('||') === -1) {
                // Ext.GlobalEvents.fireEvent('ResetAttachmentCounts', data.attachmentType);
                me.onResetAttachmentCounts(data.attachmentType);
            }

            if (successCallback) {
                if (data.fromFwaList) {
                    var attachmentItem = Ext.create('TS.model.shared.AttachmentData', {
                        attachmentId: 0,
                        attachmentItem: dataRecord.get('attachmentItem')
                    });

                    AttachmentData.SaveAttachment(null, settings.username, attachmentRecord.data, attachmentItem.data, function (response) {
                        if (response && response.success) {
                            Ext.GlobalEvents.fireEvent('ChangeViewport', 'Scheduler');
                            setTimeout(function () {
                                Ext.GlobalEvents.fireEvent('UpdateFwaGridFromScheduler');
                            }, 500);

                        } else {
                            Ext.GlobalEvents.fireEvent('Error', response);
                        }
                    });
                } else {
                    Ext.first('#fwaForm').getController().updateFwaForm(Ext.first('#showAttachDocButton'), null);
                }
            }
            //end new
        }, me));
    },

    arrayToBase64String: function (byteData) {
        var base64s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            encOut = "",
            bits,
            i = 0;

        while (byteData.length >= i + 3) {
            bits = (byteData[i++] & 0xff) << 16 | (byteData[i++] & 0xff) << 8 | byteData[i++] & 0xff;
            encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + base64s.charAt((bits & 0x00000fc0) >> 6) + base64s.charAt((bits & 0x0000003f));
        }
        if (byteData.length - i > 0 && byteData.length - i < 3) {
            var dual = Boolean(byteData.length - i - 1);
            bits = ((byteData[i++] & 0xff) << 16) | (dual ? (byteData[i] & 0xff) << 8 : 0);
            encOut += base64s.charAt((bits & 0x00fc0000) >> 18) + base64s.charAt((bits & 0x0003f000) >> 12) + (dual ? base64s.charAt((bits & 0x00000fc0) >> 6) : '=') + '=';
        }
        return encOut;
    },

    onCancelAttachment: function (component, e) {
        this.getView().close();
    },

    openTemplateList: function () {
        var me = this,
            form = Ext.first('#fwaForm'),
            fwa = form.getRecord(),//me.getView().getRecord(),
            fwaId = fwa.get('fwaId'),
            fwaNum = fwa.get('fwaNum'),
            fwaName = fwa.get('fwaName'),
            templateListWindow;

        if (me.templateListWindow) {
            me.templateListWindow.close();
        }

        me.templateListWindow = Ext.create('TS.view.fwa.TemplateList', {
            appType: 'FWA',
            modal: true,
            fwaId: fwaId,
            infoText: ' Available Templates'
        }).show();

        me.getView().close();
    },

    /**
     * @param {Ext.panel.Panel} panel
     */

    catchWindowClose: function (panel) {
        var fwa = Ext.first('#fwaForm'),
            record = fwa.getRecord() || fwa.getForm();

        if (fwa.getRecord())
            record.set('attachments', []);
        else if (fwa.getForm())
            record.setValues({
                attachments: []
            });
    }
});
