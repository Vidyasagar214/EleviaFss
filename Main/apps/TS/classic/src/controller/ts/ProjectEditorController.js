Ext.define('TS.controller.ts.ProjectEditorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.window-projecteditor',

    init: function () {
        //TODO : Don't work on read only FIELDS! -> getGroupRecords()

        // Check if this is the editor for a phantom group, if so modal it
        var me = this,
            records = me.getView().getGroupRecords();
        me.clearProjectDetails();
        if (records && records.length > 0) {
            var nonPhantom = records.findBy(function (record) {
                return !record.phantom;
            });

            if (!nonPhantom) {
                // If all records are phantoms, force the window
                me.getView().modal = true;
                me.getView().show(); // Force refresh
            }
        } else {
            // TODO - Throw error and destroy the view
            Ext.GlobalEvents.fireEvent('Error', 'Error grouping records for Project Editor, destroying view');
        }

        // Load the initial details into the form
        me.setProjectDetails(me.getView().getProjectData());
    },

    onWbs1ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel(),
            wbs1 = me.lookup('fwawbs1id'),
            wbs2 = me.lookup('fwawbs2id'),
            wbs3 = me.lookup('fwawbs3id'),
            wbs2Store = wbs2.getStore(),
            wbs3Store = wbs3.getStore(),
            record = me.getView().getGroupRecords();
        // Clear the other WBS field stores
        // wbs2.clearValue();
        // wbs3.clearValue();
        if (field.getValue()) {
            wbs2Store.getProxy().extraParams['wbs1'] = field.getValue();
            wbs2Store.getProxy().extraParams['app'] = 'TS';

            if (!TS.app.settings.isNewTsProject) {
                wbs2.clearValue();
                wbs3.clearValue();
                wbs2Store.load({
                    callback: function (records, operation, success) {
                        // do something after the load finishes
                        wbs2.setValue(record.items[0].get('wbs2') || vm.get('wbs2id'));
                    },
                    scope: this
                });
            } else {
                wbs2Store.load();
            }
            wbs3Store.load();
        } else {
            wbs2Store.getProxy().extraParams['wbs1'] = '';
            wbs2Store.getProxy().extraParams['app'] = 'TS';
            wbs2Store.load();
            wbs3Store.getProxy().extraParams['wbs1'] ='';
            wbs3Store.getProxy().extraParams['wbs2'] = '';
            wbs3Store.getProxy().extraParams['app'] = 'TS';
            wbs3Store.load();
        }

    },

    onWbs2ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel(),
            wbs1 = me.lookup('fwawbs1id'),
            wbs2 = me.lookup('fwawbs2id'),
            wbs3 = me.lookup('fwawbs3id'),
            wbs3Store = wbs3.getStore(),
            record = me.getView().getGroupRecords();

        //wbs3.clearValue();
        if (field.getValue()) {
            wbs3Store.getProxy().extraParams['wbs1'] = wbs1.getValue();
            wbs3Store.getProxy().extraParams['wbs2'] = field.getValue();
            wbs3Store.getProxy().extraParams['app'] = 'TS';
            //call store load and populate
            wbs3Store.load({
                callback: function (records, operation, success) {
                    // do something after the load finishes
                    wbs3.setValue(record.items[0].get('wbs3') || vm.get('wbs3id'));
                },
                scope: this
            });
        } else {
            // wbs3Store.getProxy().extraParams['wbs1'] ='';
            // wbs3Store.getProxy().extraParams['wbs2'] = '';
            // wbs3Store.getProxy().extraParams['app'] = 'TS';
            // wbs3Store.load();
            wbs3Store.removeAll();
        }
    },

    //commented out for now
    onWbs3ComboChange: function (field, newValue, oldValue, event) {
        var me = this,
            vm = me.getViewModel(),
            record = me.getView().getGroupRecords();
        if (!field.getValue()) {
            field.setValue(record.items[0].get('wbs3') || vm.get('wbs3id'));
        }
    },

    /*
    //  * Bound to each of the WBS combobox fields, and used to change the readOnly box below each
    //  */
    // onWbsComboChange: function (field) {
    //     var me = this,
    //         vm = me.getViewModel(),
    //         wbs2Store = me.lookup('fwawbs2id').getStore(),
    //         wbs3Store = me.lookup('fwawbs3id').getStore(),
    //         wbs1 = me.lookup('fwawbs1id'),
    //         record = me.getView().getGroupRecords();
    //     // Set the value of WBS1 onto WBS2/3
    //     if (field.getName() == 'wbs1') {
    //         wbs2Store.removeAll();
    //         wbs3Store.removeAll();
    //
    //         wbs2Store.getProxy().extraParams['wbs1'] = field.getValue();
    //         wbs2Store.getProxy().extraParams['app'] = 'TS';
    //         wbs3Store.getProxy().extraParams['wbs1'] = field.getValue(); //TODO Shouldn't it be wbs2 as param ?
    //
    //         wbs2Store.load();
    //         wbs3Store.load();
    //     }
    //     // Set the value of WBS2 onto WBS3
    //     else if (field.getName() == 'wbs2') {
    //         wbs3Store.getProxy().extraParams['wbs1'] = wbs1.getValue();
    //         wbs3Store.getProxy().extraParams['wbs2'] = field.getValue();
    //         wbs3Store.load();
    //     } else {
    //         if (!field.getValue()) {
    //             field.setValue(vm.get('wbs3id'));
    //         }
    //     }
    // },

    setProjectDetails: function (data) {
        var settings = TS.app.settings;

        this.lookup("projectEditorForm").getForm().setValues({
            laborCode: data["laborCode"] || settings.tsDefLaborCode,
            billCategory: data["billCategory"] || settings.tsDefBillCat,
            wbs1: data["wbs1"],
            wbs2: data["wbs2"],
            wbs3: data["wbs3"]
        });
    },

    clearProjectDetails: function () {
        var me = this,
            vm = me.getViewModel(),
            wbs1 = me.lookup('fwawbs1id'),
            wbs2 = me.lookup('fwawbs2id'),
            wbs3 = me.lookup('fwawbs3id'),
            wbs1Store = wbs1.getStore(),
            wbs2Store = wbs2.getStore(),
            wbs3Store = wbs3.getStore();
        me.onWbs1ComboChange(wbs1, '', '', null);
        wbs1Store.removeAll();
        wbs2Store.removeAll();
        wbs3Store.removeAll();
        this.lookup("projectEditorForm").getForm().setValues({
            laborCode: '',
            billCategory: '',
            wbs1: '',
            wbs2: '',
            wbs3: ''
        });
    },

    saveProjectDetails: function () {
        var me = this,
            editorWindow = me.getView(),
            tsRow = editorWindow.getParentView(),
            settings = TS.app.settings,
            store = tsRow.getStore(),
            grouperCfg = store.getGrouper().getConfig(),
            groupRecords = store.getGroups().getByKey(editorWindow.getGroup()),
            editorValues = me.lookup('projectEditorForm').getValues(),
            fwawbs1id = me.lookup('fwawbs1id'), //.getSelectedRecord(),
            fwawbs2id = me.lookup('fwawbs2id'), //.getSelectedRecord(),
            fwawbs3id = me.lookup('fwawbs3id'), //.getSelectedRecord(),
            fwalaborcode = me.lookup('fwalaborcode').value,
            fwabillcatid = me.lookup('fwabillcatid').getSelectedRecord();
        TS.app.settings.isNewTsProject = false;
        if (fwawbs1id.getValue()) {
            editorValues.wbs1Name = fwawbs1id.getSelectedRecord().get('name');
            editorValues.clientId = fwawbs1id.getSelectedRecord().get('clientId');
            editorValues.clientName = fwawbs1id.getSelectedRecord().get('clientName');
        } else {
            Ext.Msg.alert('FYI', settings.wbs1Label + ' selection required.');
            return;
        }

        if (fwawbs2id && fwawbs2id.getStore().getData().length > 0) {
            if (fwawbs2id.getSelectedRecord()) {
                editorValues.wbs2Name = fwawbs2id.getSelectedRecord().get('name');
                if (fwawbs3id && fwawbs3id.getStore().getData().length > 0) {
                    if (fwawbs3id.getSelectedRecord()) {
                        editorValues.wbs3Name = fwawbs3id.getSelectedRecord().get('name');
                    } else {
                        Ext.Msg.alert('Warning', 'Please select a ' + settings.wbs3Label + '#');
                        return;
                    }
                }
            } else {
                Ext.Msg.alert('Warning', 'Please select a ' + settings.wbs2Label + '#');
                return;
            }
        }

        //TODO This is blowing up the removal of record!
        //Figure out where it's related (bad binding?)

        if (fwalaborcode) {
            editorValues.laborCode = fwalaborcode;
        }

        if (fwabillcatid) {
            editorValues.billCategory = fwabillcatid.get('category');
        }

        groupRecords.each(function (record) {
            var rec = store.getById(record.getId()).data;
            //store.getById(record.getId()).set(editorValues);
            rec.billCategory = editorValues.billCategory;
            rec.clientId = editorValues.clientId;
            rec.clientName = editorValues.clientName;
            rec.laborCode = editorValues.laborCode;
            rec.wbs1 = editorValues.wbs1;
            rec.wbs1Name = editorValues.wbs1Name;
            rec.wbs2 = editorValues.wbs2;
            rec.wbs2Name = editorValues.wbs2Name;
            rec.wbs3 = editorValues.wbs3;
            rec.wbs3Name = editorValues.wbs3Name;
        });

        //Regroup the store (Workaround)

        store.setRemoteSort(false);
        store.clearGrouping();

        store.group(grouperCfg);
        store.setRemoteSort(true);

        editorWindow.destroy();
    },

    cancelProjectEditing: function () {
        var me = this,
            editorWindow = me.getView(),
            tsRow = editorWindow.getParentView(),
            records = me.getView().getGroupRecords(),
            store = tsRow.getStore(),
            fwawbs1id = me.lookup('fwawbs1id'), //.getSelectedRecord(),
            fwawbs2id = me.lookup('fwawbs2id'), //.getSelectedRecord(),
            fwawbs3id = me.lookup('fwawbs3id'), //.getSelectedRecord(),
            phantom;

        if (fwawbs1id)
            fwawbs1id.getStore().removeAll();
        if (fwawbs2id)
            fwawbs2id.getStore().removeAll();
        if (fwawbs3id)
            fwawbs3id.getStore().removeAll();

        TS.app.settings.isNewTsProject = false;
        if (records && records.length > 0) {
            phantom = records.findBy(function (record) {
                return record.phantom;
            });
            if (phantom) {
                store.remove(phantom);
            }
        }
        editorWindow.destroy();
    },

    showProjectLookupWindow: function (e) {
        var me = this,
            projectLookupWindow;

        if (me.projectLookupWindow) {
            me.projectLookupWindow.close(); // Close editor if it already exists
        }
        me.projectLookupWindow = Ext.create('TS.common.window.ProjectLookup', {
            callingPage: 'PL',
            app: e.app
        }).show();
    },

    showLaborCodeLookupWindow: function () {
        var me = this,
            vm = me.getViewModel(),
            laborCode = me.getView().lookup('fwalaborcode').getValue(),
            settings = TS.app.settings,
            start,
            end,
            gridContainer,
            grid1,
            grid2,
            grid3,
            grid4,
            grid5,
            store1,
            store2,
            store3,
            store4,
            store5,
            lValue1,
            lValue2,
            lValue3,
            lValue4,
            lValue5,
            laborCodeLookup;
        if (me.laborCodeLookup) {
            me.laborCodeLookup.close(); // Close editor if it already exists
        }

        me.laborCodeLookup = Ext.create('TS.view.ts.LaborCodeLookup', {
            callingPage: 'PL'
        }).show();

        gridContainer = me.laborCodeLookup.lookup('laborCodeGridsContainer');
        for (var level = 0; level < settings.tsLcLevels; level++) {
            switch (level + 1) {
                case 1:
                    start = settings.tsLc1Start - 1;
                    end = settings.tsLc1Len;
                    lValue1 = Ext.util.Format.substr(laborCode, start, end);
                    grid1 = gridContainer.items.items[level];
                    store1 = grid1.getStore();
                    store1.load(function () {
                        grid1.getSelectionModel().select(store1.find('lcCode', lValue1), true);
                    });
                    break;
                case 2:
                    start = settings.tsLc2Start - 1;
                    end = settings.tsLc2Len;
                    lValue2 = Ext.util.Format.substr(laborCode, start, end);
                    grid2 = gridContainer.items.items[level];
                    store2 = grid2.getStore();
                    store2.load(function () {
                        grid2.getSelectionModel().select(store2.find('lcCode', lValue2), true);
                    });
                    break;
                case 3:
                    start = settings.tsLc3Start - 1;
                    end = settings.tsLc3Len;
                    lValue3 = Ext.util.Format.substr(laborCode, start, end);
                    grid3 = gridContainer.items.items[level];
                    store3 = grid3.getStore();
                    store3.load(function () {
                        grid3.getSelectionModel().select(store3.find('lcCode', lValue3), true);
                    });
                    break;
                case 4:
                    start = settings.tsLc4Start - 1;
                    end = settings.tsLc4Len;
                    lValue4 = Ext.util.Format.substr(laborCode, start, end);
                    grid4 = gridContainer.items.items[level];
                    store4 = grid4.getStore();
                    store4.load(function () {
                        grid4.getSelectionModel().select(store4.find('lcCode', lValue4), true);
                    });
                    break;
                case 5:
                    start = settings.tsLc5Start - 1;
                    end = settings.tsLc5Len;
                    lValue5 = Ext.util.Format.substr(laborCode, start, end);
                    grid5 = gridContainer.items.items[level];
                    store5 = grid5.getStore();
                    store5.load(function () {
                        grid5.getSelectionModel().select(store5.find('lcCode', lValue5), true);
                    });
                    break;
            }
        }
    },

    setProjectValues: function (wbs1, wbs2, wbs3) {
        var me = this,
            vm = me.getViewModel();
        // // Set values of wbs' dropdowns and let event onWbsComboChange do the work
        Ext.first('#fwawbs1id').setValue(null);
        Ext.first('#fwawbs2id').setValue(null);
        Ext.first('#fwawbs3id').setValue(null);
        TS.app.settings.isNewTsProject = true;
        if (wbs3) {
            vm.set('wbs3id', wbs3.get('id'));
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
            Ext.first('#fwawbs2id').setValue(wbs2.get('id'));
            Ext.first('#fwawbs3id').setValue(wbs3.get('id'));
        } else if (wbs2) {
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
            Ext.first('#fwawbs2id').setValue(wbs2.get('id'));
        } else if (wbs1) {
            Ext.first('#fwawbs1id').setValue(wbs1.get('id'));
        }
    },

    setLaborCode: function (laborCode) {
        // Set value of labor code field
        if (laborCode) {
            this.lookup('fwalaborcode').setValue(laborCode);
        }
    }

});