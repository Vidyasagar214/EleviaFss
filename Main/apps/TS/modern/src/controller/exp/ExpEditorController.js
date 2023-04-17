/**
 * Created by steve.tess on 7/24/2018.
 */
Ext.define('TS.controller.exp.ExpEditorController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.exp-editor',

    // control: {
    //     'button[action=navigation-back]': {
    //         tap: 'navigateToGrid'
    //     },
    //     'button[action=navigation-back-expList]': {
    //         tap: 'navigateToExpList'
    //     }
    // },

    init: function () {

    },

    onSelectProject: function (bt) {
        var me = this,
            vw = me.getView(),
            parentVM = me.getViewModel().get('selectedEXP'),
            projectTree = vw.lookup('project-treelist'),
            selection = projectTree.getViewModel().getData().treelist.selection,
            settings = TS.app.settings,
            wbsArray;

        if (!selection) {
            Ext.Msg.alert('FYI', 'Please select ' + settings.wbs1Label + ' from list');
            return;
        }

        //set new data in model
        wbsArray = selection.getId().split('^');//array of wbs id's (1,2,3)

        parentVM.set('wbs1', wbsArray[0]);
        parentVM.set('wbs2', wbsArray[1] || '');
        parentVM.set('wbs3', wbsArray[2] || '');

        bt.up('sheet').hide();
    },

    closeSheet: function (bt) {
        bt.up('sheet').hide();
    },

    doCopyExp: function (bt) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            rec = vm.get('selectedEXP'),
            clone = rec.clone(),
            store = vm.get('explist'),
            expReportId = rec.get('expReportId');

        clone.set('id', Ext.data.identifier.Uuid.Global.generate());
        clone.set('amount', '');
        clone.set('expDate', new Date());
        clone.set('miles', '');
        clone.set('reason', '');
        clone.set('other', '');

        store.add(clone);
        vm.set('selectedEXP', clone);
        bt.up('exp-editmenu').hide();
    },

    onAttachExpDoc: function (bt) {
        var me = this,
            expenseItem = me.getViewModel().get('selectedEXP'),
            reportId = expenseItem.get('expReportId'),
            expId = expenseItem.get('expId'),
            settings = TS.app.settings,
            fwa = expenseItem.get('fwaId'),
            associatedRecordId,
            sheet;

        if (!reportId) {
            Ext.Msg.alert('Warning', 'Please save new expense first.');
            return;
        }
        sheet = Ext.create({
            xtype: 'exp-window-document',
            //Fuse view models
            viewModel: {
                parent: me.getViewModel()
            },
            attType: 'Document',
            location: settings.documentStorageLoc,
            associatedRecordId: expId,
            attachmentsList: {
                modelType: 'EXP',
                modelId: expId,
                includeItem: true,
                attachmentType: AttachmentType.Expense
            }
        });

        sheet.lookup('attachmentList').add(
            {
                xtype: 'attachments',
                attachmentParams: sheet.attachmentsList
            }
        );

        Ext.Viewport.add(sheet);
        sheet.show();
        bt.up('exp-editmenu').hide();
    },

    removeExpForm: function (btn) {
        var me = this,
            vm = me.getViewModel(),
            rec = vm.get('selectedEXP'),
            store = vm.get('explist'),
            expReportId = rec.get('expReportId'),
            id = rec.get('id'),
            settings = TS.app.settings,
            rowIndex;

        Ext.each(store.getRange(), function (item, idx) {
            if (item.get('id') == id) {
                rowIndex = idx;
            }
        });

        Ext.Msg.confirm("Please Confirm", "Are you sure you want to delete this expense? This cannot be undone.", function (bttn) {
            if (bttn == 'yes') {
                //store.removeAt(rowIndex);
                rec.set('modified', 'D');
                store.addFilter({
                    filterFn: function (record) {
                        return record.get('modified') !== 'D';
                    }
                });
                btn.up('exp-editmenu').hide();
                Ext.first('app-exp').setActiveItem(2);
                //Ext.Msg.alert('FYI', 'Expense must be "Saved" to reflect deletion');
                settings.deletedExpense = true;
                var saveBtn = Ext.first('#updateExpButton');
                if(saveBtn){
                    saveBtn.doTap(saveBtn);
                }
            }
        });
    },

    doCreateExp: function () {

    },

    onSaveExp: function () {

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

    onFileUploadChange: function (obj, newValue, oldValue) {
        var me = this,
            ext = me.reverseStringReturnExtention(newValue),
            descriptionField = me.lookup('descriptionField'),
            filenameField = me.lookup('filenameField'),
            dt = Ext.Date.format(new Date(), 'Y-m-d'),
            fileObject = obj.el.down('input[type=file]').dom.files[0],
            dateStamp = Math.floor(Date.now() / 1000),
            dsString = dateStamp.toString().substring(6),
            file,
            fileName,
            fileNameOnly,
            txtField,
            captureType,
            promise,
            uploadField;

        if (obj.initialConfig.iconCls == 'x-fa fa-file-text' && (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'zip')) {
            Ext.Msg.alert('Warning', 'Not an acceptable document type.');
            return;
        }

        //chrome and others
        fileName = newValue.replace(/C:\\fakepath\\/g, '');
        //add timestamp
        fileName = fileName.split('.')[0] + '_' + dsString + '.' + fileName.split('.')[1];
        //IE & Edge
        file = fileName.split('\\');
        fileName = file[file.length - 1];
        fileNameOnly = fileName.replace('.' + ext, '');

        txtField = me.getView().lookup('filePathField');
        uploadField = me.getView().lookup('fileUploadField');
        txtField.setValue(fileName);

        filenameField.setValue(fileNameOnly);//dt + ' ' +
        descriptionField.setValue(fileNameOnly);

        if (obj.initialConfig.iconCls == 'x-fa fa-camera')
            me.setImagePreview(fileObject);

        Ext.first('#loadDoc').enable();
    },

    setImagePreview: function (file) {
        var me = this,
            fileField = me.lookup('fileUploadField'),
            settings = TS.app.settings,
            imageView,
            reader;

        imageView = me.lookup('imagePreview');
        if (file && file.type.match('image.*')) {
            reader = new FileReader();
            reader.onload = function (e) {
                imageView.setSrc(e.target.result);
                settings.myImage = '<img src="' + imageView.getSrc() + '" />';
            };
            reader.readAsDataURL(file);
            reader.onloadend = function (evt) {
                var img = new Image();
                img.src = evt.target.result;
                settings.myImage = img;
            };
            imageView.setHidden(false);
        }
    },

    loadExpDoc: function (btn) {
        var me = this,
            settings = TS.app.settings,
            vw = me.getView(),
            vm = me.getViewModel(),
            fileAttributes = vw.lookup('filePathField').getValue().split('.'),
            fileName = vw.lookup('filePathField').getValue(),
            extension = fileAttributes[fileAttributes.length - 1],
            description = me.lookup('descriptionField').getValue(),
            filename = me.lookup('filenameField'),
            exp = vm.get('selectedEXP'),
            //fwa = vm.get('selectedFWA'),
            attachmentsToAdd = exp.get('attachmentsToAdd') || [],
            // fwaAttachmentsToAdd = fwa.get('attachmentsToAdd') || [],
            filefield = Ext.ComponentQuery.query('filefield')[0],
            file = filefield.el.down('input[type=file]').dom.files[0],
            attachment,
            attachmentData,
            dataRecord,
            base64String;
        //do in case file name has multiple . in it
        //  if (fileAttributes.indexOf('.') > -1) {
        //      for (var i = 0; i < fileAttributes.length - 1; i++) {
        //          fileName += fileAttributes[i] + '.';
        //      }
        //      //strip last .
        //      fileName = fileName.substring(0, fileName.length - 1);
        //  }
        //strip last .
        //fileName = fileName.substring(0, fileName.length - 1);
        me.getView().setLoading(true, 'Saving Document...');

        if (!description || !filename) {
            Ext.Msg.alert('FYI', 'Both Filename and Description are required fields');
            me.getView().setLoading(false);
            return;
        }

        attachment = Ext.create('TS.model.shared.Attachment', {
            attachmentType: AttachmentType.Expense,
            attachedByEmpId: settings.empId,
            dateAttached: new Date(),
            description: description,
            extension: extension,
            filename: fileName,
            owningModelId: vw.associatedRecordId,
            location: settings.documentStorageLoc,
            owningModelType: 'EXP'
        });
        me.convertFileToByteData(file, Ext.bind(function (byteData) {
            dataRecord = Ext.create('TS.model.shared.AttachmentData', {
                attachmentItem: byteData
            });
            attachment.set('attachmentItem', dataRecord.get('attachmentItem'));
            attachmentsToAdd.push(attachment.getData());
            exp.set('attachmentsToAdd', attachmentsToAdd);
            // if (vw.fromFwa)
            // {
            //     fwaAttachmentsToAdd.push(attachment.getData());
            //     fwa.set('attachmentsToAdd', fwaAttachmentsToAdd);
            // }
            // else
            // {
            //     attachmentsToAdd.push(attachment.getData());
            //     exp.set('attachmentsToAdd', attachmentsToAdd);
            // }

            vw.setLoading(false);
        }, me));

        btn.up('sheet').hide();
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

    onSearchButtonClick: function (field) {
        var tree = field.up('tree-list'),
            vm = tree.getViewModel(),
            store = vm.getStore('navItems'),
            newVal = Ext.first('#searchField').getValue() ? Ext.first('#searchField').getValue() : '';

        if (newVal === '') {
            store.clearFilter();
        } else {
            store.clearFilter();
            store.filterBy(function (rec) {
                if (rec.get('model') == 'Wbs2' || rec.get('model') == 'Wbs3') return true;
                if (rec.get('text').toLowerCase().match(newVal.toLowerCase()) || rec.get('id').toLowerCase().match(newVal.toLowerCase())) {
                    return true;
                }
            })
        }
    }
});