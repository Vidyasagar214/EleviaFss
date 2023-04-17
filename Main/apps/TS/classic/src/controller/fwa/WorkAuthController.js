Ext.define('TS.controller.fwa.WorkAuthController', {
    extend: 'TS.common.grid.BaseGridController',

    alias: 'controller.grid-workauth',

    newWorkItem: function () {
        /* uncomment below (lines 8-17)and comment out (lines 19-36) to use popup window */
        var me = this,
            settings = TS.app.settings,
            addWorkCodeWindow;

        if (me.addWorkCodeWindow) {
            me.addWorkCodeWindow.close();
        }

        addWorkCodeWindow = Ext.create('TS.view.fwa.AddWorkAuth', {});
        addWorkCodeWindow.show();

        // var grid = this.getView(),
        //     store = grid.store,
        //     model = store.model,
        //     form = Ext.first('#fwaForm').getForm(),
        //     fwa = this.getView().up('form').getRecord();
        //
        // //turn off sort so row stays when added and does not sort
        // store.setRemoteSort(false);
        //
        // store.add(new model({
        //     fwaId: (fwa ? fwa.getId() : null)
        // }));
        // //turn sort back on
        // store.setRemoteSort(true);
        // form.dirty = true;
        // //set focus so combo box will pop open as listener is set in field-workcode
        // grid.getPlugins()[0].startEditByPosition({row: store.data.length - 1, column: 1});
        // //Ext.first('#fwaForm').scrollTo(0, 300);
    },

    deleteWorkItem: function (grid, rowIndex) {
        var me = this,
            vm = me.getViewModel(),
            fwa = this.getView().up('form').getRecord(),
            form = Ext.first('#fwaForm').getForm(),
            hours = fwa.get('hours'),
            entries = hours.getRange(),
            store = grid.store,
            settings = TS.app.settings,
            ttlHours = 0,
            record = store.getAt(rowIndex),
            hoursStore = Ext.first('grid-employeehours').getStore(),
            recordsToRemove = [];
        //check if currently any hours entered
        Ext.each(entries, function (hrs) {
            if (hrs.get('workCodeId') === record.get('workCodeId')) {
                ttlHours += hrs.get('regHrs') + hrs.get('ovtHrs') + hrs.get('ovt2Hrs');
            }
        });
        if (ttlHours > 0) {
            if (vm.get('newFwa')) {
                Ext.Msg.confirm("Please Confirm", "<div align=\"center\">Employee Hours have been entered and will be deleted if the " + settings.workCodeLabel + ' ' + record.get('workCodeAbbrev') + " is deleted. Do you wish to continue?</div>", function (btn) {
                    if (btn === 'yes') {
                        form.dirty = true;
                        store.remove(record);
                        Ext.each(entries, function (empHrs) {
                            //TODO need to check hours yet
                            if (empHrs.get('workCodeId') == record.get('workCodeId')) {
                                recordsToRemove.push(empHrs);
                            }
                        });
                        hours.remove(recordsToRemove);
                    } else {

                    }
                });
            } else {
                Ext.Msg.alert('Warning', settings.fwaAbbrevLabel + ' Hours have been entered for ' + settings.workCodeLabel + ' ' + record.get('workCodeAbbrev') + ' and cannot be deleted.');
            }
        } else {
            form.dirty = true;
            store.remove(record);
            Ext.each(entries, function (empHrs) {
                //TODO need to check hours yet
                if (empHrs.get('workCodeId') == record.get('workCodeId')) {
                    recordsToRemove.push(empHrs);
                }
            });
            hours.remove(recordsToRemove);
        }
    },

    attachPhoto: function (grid, rowIndex) {
        var me = this,
            windowAttachment,
            settings = TS.app.settings,
            workcode = grid.getStore().getAt(rowIndex),
            fwa = this.getView().up('form').getRecord();

        if (me.windowAttachment) {
            me.windowAttachment.close();
        }

        me.windowAttachment = Ext.create('TS.view.fwa.Attachment', {
            attType: 'Photo',
            location: settings.imageStorageLoc,
            isWorkCode: true,
            autoShow: true,
            associatedRecordId: fwa.getId() + '||' + workcode.get('workCodeId'),
            hideTemplateButton: true,
            attachmentsList: {
                modelType: 'FWA',
                modelId: fwa.getId() + '||' + workcode.get('workCodeId'),
                attachmentType: 'P'
            }
        });
        //hide from template
        me.windowAttachment.lookup('includeTemplates').setHidden(true);
    },

    attachDocument: function (grid, rowIndex) {
        var me = this,
            settings = TS.app.settings,
            windowAttachment,
            workcode = grid.getStore().getAt(rowIndex),
            fwa = me.getView().up('form').getRecord();

        if (me.windowAttachment) {
            me.windowAttachment.close();
        }

        me.windowAttachment = Ext.create('TS.view.fwa.Attachment', {
            attType: 'Document',
            location: settings.documentStorageLoc,
            associatedRecordId: fwa.getId() + '||' + workcode.get('workCodeId'),
            hideTemplateButton: true,
            attachmentsList: {
                modelType: 'FWA',
                modelId: fwa.getId() + '||' + workcode.get('workCodeId'),
                attachmentType: 'D'
            },
            autoShow: true
        });
        //hide from template
        me.windowAttachment.lookup('includeTemplates').setHidden(true);
    },

    onWorkCodeEdit: function (grid, rowIndex) {
        var me = this,
            vw = me.getView(),
            settings = TS.app.settings,
            wcStore = Ext.getStore('WorkCodes'),
            store = grid.grid.getStore(),
            idx = rowIndex.rowIdx,
            form = Ext.first('#fwaForm').getForm(),
            ct = 0,
            wcId;

        if (rowIndex.field == 'comments') {
            if (rowIndex.originalValue != rowIndex.value) {
                form.dirty = true;
            }
        }

        wcStore.clearFilter(true);
        wcStore.filterBy(function (rec) {
            if (rec.get('workCodeAbbrev').match(rowIndex.value)) {
                wcId = rec.get('workCodeId');
                return true;
            }
        });
        if (rowIndex.field == 'workCodeAbbrev') {
            Ext.Array.each(store.data.items, function (row) {
                if (!row.get('workCodeId') || ct == idx) {
                    row.set('workCodeId', wcId);
                }
                ct++;
            }, me);
        }
    },

    // wcBeforeSelect: function (combo, record, index) {
    //     var hours = Ext.first('form-fwa').getRecord().get('hours').getRange(),
    //         ttl = 0,
    //         comboValue = combo.value;
    //
    //     Ext.each(hours, function (hr) {
    //         if (comboValue == hr.get('workCodeAbbrev'))
    //             ttl += hr.get('regHrs') + hr.get('ovtHrs') + hr.get('ovt2Hrs') + hr.get('travelHrs');
    //     })
    //
    //     if (ttl > 0) {
    //         Ext.Msg.confirm('Warning', 'Hours have been entered against this work code. Do you wish to continue?', function (btn) {
    //             if (btn == 'yes') {
    //
    //             } else {
    //                 return false;
    //             }
    //         });
    //     }
    // },

    workCodeChanged: function (obj, nValue, oValue) {
        var form = Ext.first('form-fwa'),
            hours = form.getRecord().get('hours').getRange(),
            ttl = 0,
            comboValue = oValue;

        Ext.each(hours, function (hr) {
            if (comboValue == hr.get('workCodeAbbrev'))
                ttl += hr.get('regHrs') + hr.get('ovtHrs') + hr.get('ovt2Hrs') + hr.get('travelHrs');
        });

        if (ttl > 0) {
            Ext.Msg.alert('Warning', 'Hours have been entered against ' + TS.app.settings.workCodeLabel + ' ' + comboValue);
        }

        form.dirty = true;
    },

    saveNewWorkCode: function (component, e) {
        var me = this,
            vw = me.getView(),
            vm = me.getViewModel(),
            hoursStore = Ext.first('grid-employeehours').getStore(),
            crewNameField = Ext.first('#crewNameDisplay'),
            grid = Ext.first('grid-workauth'),
            store = grid.store,
            model = store.model,
            form = Ext.first('#fwaForm').getForm(),
            fwa = form.getRecord(),
            wcAbbrev = vw.lookup('addWorkCodeField').getValue(),
            workCode = Ext.getStore('WorkCodes').findRecord('workCodeAbbrev', wcAbbrev);

        //turn off sort so row stays when added and does not sort
        store.setRemoteSort(false);
        //add new work code
        store.add(new model({
            fwaId: (fwa ? fwa.getId() : null),
            workCodeAbbrev: vw.lookup('addWorkCodeField').getValue(),
            workCodeId: workCode.get('workCodeId'),
            scheduledHours: vw.lookup('addScheduledField').getValue(),
            actualHours: vw.lookup('addActualField').getValue(),
            comments: vw.lookup('addCommentsField').getValue(),
            picRequired: vw.lookup('addPhotoReqField').getValue()
        }));
        //turn sort back on
        store.setRemoteSort(true);
        form.dirty = true;
        vw.close();
        if (vm.get('newFwa') && crewNameField.getValue() != '') {
            var crew = Ext.getStore('AllCrews').findRecord('crewName', crewNameField.getValue()),
                crewMembers = crew.get('crewMembers');
            Ext.each(crewMembers.getRange(), function (cm) {
                var emp = Ext.getStore('AllEmployees').findRecord('empId', cm.get('empId'));
                hoursStore.add(Ext.create('TS.model.fwa.FwaHours', {
                    workDate: new Date(Ext.Date.format(new Date(), DATE_FORMAT)),
                    empId: cm.get('empId'),
                    empGroupId: '',
                    modified: 'A',
                    workCodeId: workCode.get('workCodeId'),
                    workCodeAbbrev: wcAbbrev,
                    //laborCode: emp.get('tsDefLaborCode'),
                    crewRoleId: cm.get('crewMemberRoleId')
                }));
            });
        }
    },

    cancelNewWorkCode: function (component, e) {
        this.getView().close();
    },

    addWorkCodeChanged: function (component, isDirty) {
        Ext.getStore('WorkCodes').clearFilter(true);
        var me = this,
            vw = me.getView(),
            workCode = Ext.getStore('WorkCodes').findRecord('workCodeAbbrev', component.getValue());
        vw.lookup('addDescriptionField').setValue(workCode ? workCode.get('workCodeDescr') : '');
        if (workCode) {
            Ext.first('#saveWorkCode').setDisabled(false);
        } else {
            Ext.first('#saveWorkCode').setDisabled(true);
        }
    }
});