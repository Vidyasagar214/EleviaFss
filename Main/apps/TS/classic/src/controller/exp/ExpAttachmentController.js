/**
 * Created by steve.tess on 7/14/2018.
 */
Ext.define('TS.controller.exp.ExpAttachmentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.expattachment',

    requires: [
        'TS.view.exp.Attachments'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        var me = this;
        me.updateUploadType();
        if (me.getView().getAttachmentsList()) {
            me.addAttachmentsList();
        }
    },

    updateUploadType: function () {
        var me = this,
            title = me.getView().getAttType(),
            expForm = Ext.first('#expenseEditorForm'),
            fileField = me.lookup('fileUploadField'),
            uploadButton = me.lookup('fileUploadButton'),
            record = me.getView().getRecord();

        if (expForm && !record) {
            record = expForm.getForm().getValues();
        }
        //Set the correct titles according to the 'title' sent by the controller that opens the upload window
        me.getView().setTitle("Attach " + title);
        fileField.setFieldLabel(title);
        uploadButton.setText("Upload " + title);
        //
        // Ext.first('#attachFormFrame').setHidden(true);
        // me.getView().setTitle("View " + title);
        // uploadButton.setHidden(true);
    },

    addAttachmentsList: function () {
        var me = this;
        me.lookup('attachmentForm').add({
            xtype: 'panel',
            title: 'Attachments',
            collapsible: true,
            scrollable: true,
            layout: 'fit',
            width: '95%',
            height: 200,
            items: [{
                xtype: 'exp-attachments',
                reference: 'attachmentDataView',
                attachmentParams: me.getView().getAttachmentsList()
            }]
        })
    },

    /**
     * @param {Ext.button.Button} component
     * @param {Event} e
     */
        onFileUpload: function (component, e) {
        var me = this,
            vw = me.getView(),
            attType = vw.getAttType(),
            settings = TS.app.settings,
            location = vw.getLocation(),
            record = vw.getRecord() || vw.getAttachmentsList().record,
            associatedId = vw.getAssociatedRecordId(),
            file = me.getRawFile(),
            attachList = vw.getAttachmentsList(),
            description = me.lookup('descfield'),
            filename = me.lookup('fileNameField'),
            //includeTemplates = me.lookup('includeTemplates').getValue(),
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
            ext = file.type.split('/')[1];
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
            associatedId: associatedId,
            attachedByEmpId: settings.empId,
            attachmentType: AttachmentType.Expense,
            location: location,
            record: record,
            fileExt: ext,
            fileName: filename.getValue(),
            description: description.getValue(),
            file: file,
            type: attachList.modelType
        };

        me.performRecordUpload(data, true);

        ref = me.getView().reference;
        refHolder = me.getView().lookupReferenceHolder();

        if (refHolder) {
            delete refHolder.getView().refs[ref];
        }
    },

    getRawFile: function () {
        var me = this;
        if (me.isMobile) {
            return me.mobileFile || false;
        } else {
            return me.lookup('fileUploadField').fileInputEl.dom.files[0] || false;
        }
    },

    performRecordUpload: function (data, successCallback) {
        var me = this,
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
            }),
            fwa = Ext.first('#expListGrid'),
            record = data.record,
            attachmentsToAdd,
            isExpense = false;

        if (record) {
            attachmentsToAdd = record.get('attachmentsToAdd') || [];
            record.set('modified', 'M')
        }

        me.getView().setLoading(true);
        saveType = (data.attachmentType.charAt(0) == AttachmentType.Document) ? 'Document' : (data.attachmentType.charAt(0) == AttachmentType.Photo) ? 'Photo' : 'Signature';
        me.convertFileToByteData(data.file, Ext.bind(function (byteData) {
            dataRecord = Ext.create('TS.model.shared.AttachmentData', {
                attachmentItem: byteData
            });

            attachmentRecord.set('attachmentItem', dataRecord.get('attachmentItem'));
            attachmentsToAdd.push(attachmentRecord.getData());
            record.set('attachmentsToAdd', attachmentsToAdd);

            me.getView().setLoading(false);
            me.getView().close();


            if (successCallback) {
                //successCallback();
                Ext.first('#onSaveExpenseButton').click();

            }
            //end new
        }, me));
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
        filenamefield.setValue(fileNameOnly); //dt + ' ' +
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

    onCancelAttachment: function (component, e) {
        this.getView().close();
    }
});