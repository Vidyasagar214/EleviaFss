/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.controller.fwa.UnitsController', {
    extend: 'TS.common.grid.BaseGridController',

    alias: 'controller.grid-units',

    requires: [
        'TS.Messages'
    ],

    config: {},
    /**
     * Called when the view is created
     */
    init: function () {
    },

    newUnit: function () {
        /*uncomment (lines 22-62) to use popup, comment out (lines 64-112) to use row add*/
        var me = this,
            grid = me.getView(),
            store = grid.store,
            model = store.model,
            page = Ext.first('#fwaForm'),
            unitCodeStore = Ext.getStore('UnitCode'),
            wbs1 = page.lookup('fwawbs1id').getValue(),
            wbs2 = page.lookup('fwawbs2id').getValue(),
            wbs3 = page.lookup('fwawbs3id').getValue(),
            settings = TS.app.settings,
            nextDate = Ext.Date.format(new Date(Ext.first('#unitDateHeader').getValue()), DATE_FORMAT),
            addUnitWindow;

        if (me.addUnitWindow) {
            me.addUnitWindow.close();
        }

        if (!wbs1) {
            Ext.Msg.alert('Warning', 'A ' + settings.wbs1Label + '# selection is required.');
            return;
        }
        unitCodeStore.getProxy().setExtraParams({
            wbs1: wbs1 ? wbs1 : '^',
            wbs2: wbs2 ? wbs2 : '^',
            wbs3: wbs3 ? wbs3 : '^',
            includeInactive: false
        });
        unitCodeStore.load();
        unitCodeStore.filterBy(function (row) {
            return row.get('status') == 'A';
        });
        //check if any units available, stop if none
        if (unitCodeStore.getRange().length == 0) {
            Ext.Msg.alert('FYI', 'No units available for current ' + settings.wbs1Label + '#: ' + wbs1 + '.');
            return;
        }
        //create & show defaults
        addUnitWindow = Ext.create('TS.view.fwa.AddUnits', {});
        addUnitWindow.lookup('newUnitDate').setValue(new Date(nextDate));
        addUnitWindow.lookup('newUnitCodeQty').setValue(0);
        addUnitWindow.show();
    },

    deleteUnit: function (grid, rowIndex) {
        var fwa = this.getView().up('form').getRecord(),
            form = Ext.first('#fwaForm').getForm(),
            store = grid.store,
            settings = TS.app.settings,
            record = store.getAt(rowIndex),
            fwaStatus = form.getRecord().get('fwaStatusId'),
            isScheduler = this.getView().isScheduler;

        if (( fwaStatus != FwaStatus.Approved && isScheduler) || (fwaStatus == FwaStatus.Approved && (settings.fwaIsApprover && settings.fwaCanModify != 'N') )) {
            if (record.get('readOnly') && (record.get('readOnlyReason').includes('is approved') || record.get('readOnlyReason').includes('have been approved'))) {

            } else {
                if (record.get('readOnly')) {
                    TS.Messages.getReadOnlyMessage(record.get('readOnlyReason'));
                    return false;
                }
            }
        }
        else {
            if (record.get('readOnly')) {
                TS.Messages.getReadOnlyMessage(record.get('readOnlyReason'));
                return false;
            }
        }

        form.dirty = true;
        store.clearFilter(true);
        store.remove(record);
        grid.setStore(store);
        store.filterBy(function (rec) {
            return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(Ext.first('#unitDateHeader').getValue()), DATE_FORMAT);
        });
    },

    calculateUnitMileage: function (grid, rowIndex) {
        var me = this,
            fwa = this.getView().up('form').getRecord(),
            form = Ext.first('#fwaForm').getForm(),
            settings = TS.app.settings,
            store = grid.getStore(),
            record = store.getAt(rowIndex),
            detailGrid,
            detailstore,
            unitDetailsWindow;

        if (record.get('unitCodeId') == '') return;

        if (me.unitDetailsWindow) {
            me.unitDetailsWindow.close();
        }

        unitDetailsWindow = Ext.create('TS.view.fwa.UnitDetailsPanel', {
            unitRecord: record,
            unitCodeId: record.get('unitCodeId'),
            readOnly: record.get('readOnly')
        });
        detailGrid = Ext.first('grid-unitdetails');
        detailstore = detailGrid.getStore();

        Ext.each(record.get('details').getRange(), function (unitdetail) {
            detailstore.add(unitdetail);
        });
        detailstore.sort([
            {property: 'dtDate', direction: 'ASC'}
        ]);
        unitDetailsWindow.show();
    },

    checkMileage: function (grid, rowIndex) {
        var unitCode,
            record,
            required,
            details,
            ttlMiles = 0;
        if (rowIndex.field == 'quantity') {
            record = rowIndex.record;
            unitCode = Ext.getStore('UnitCode').getById(record.get('unitCodeId'));
            required = unitCode.get('requireDetail') == 'M';
            details = Ext.Array.pluck(record.get('details').getRange(), 'data');

            if (required && details.length > 0) {
                Ext.each(details, function (d) {
                    ttlMiles += d.lValue3;
                });
                if (ttlMiles != rowIndex.value) {
                    Ext.Msg.alert('FYI', 'Mileage quantity does not match the calculated mileage total in details.')
                }
            }
        }
    },

    unitChanged: function () {
        var me = this,
            form = Ext.first('#fwaForm').getForm();
        form.dirty = true;
    },
    /*methods below for use when popup window for adding a unit is used*/
    saveNewUnit: function (component, e) {
        var me = this,
            vw = me.getView(),
            grid = Ext.first('grid-unit'),
            form = Ext.first('#fwaForm').getForm(),
            store = grid.store,
            model = store.model;
        //turn off sort so row stays when added and does not sort
        store.setRemoteSort(false);
        store.getSorters().removeAll();
        store.add(new model({
            unitCodeId: vw.lookup('newUnitCode').getValue(),
            unitSeq: store.getRange() && store.getRange().length > 0 ? store.getRange().length + 1 : 1,
            unitDate: vw.lookup('newUnitDate').getValue(),
            equipmentId: vw.lookup('newUnitCodeEquipment').getValue(),
            equipmentName: vw.lookup('newUnitCodeEquipment').getRawValue(),
            comments: vw.lookup('newUnitCodeComments').getValue(),
            quantity: vw.lookup('newUnitCodeQty').getValue()
        }));
        //turn sort back on
        store.setRemoteSort(true);
        form.dirty = true;
        vw.close();
    },

    cancelNewUnit: function (component, e) {
        this.getView().close();
    },

    newUnitChanged: function (component, newValue, oldValue) {
        var me = this,
            vw = me.getView(),
            equipStore = Ext.getStore('EquipmentList'),
            unitCode = Ext.getStore('UnitCode').getById(newValue);
        vw.lookup('newUnitCodeName').setValue(unitCode ? unitCode.get('unitCodeName') : '');

        equipStore.getProxy().setExtraParams({
            unitCodeId: newValue
        });
        equipStore.load();
        if(newValue){
            vw.lookup('saveNewUnitBtn').setDisabled(false);
        } else {
            vw.lookup('saveNewUnitBtn').setDisabled(true);
        }
    },

    checkReadOnly: function (editor, context, e) {
        var settings = TS.app.settings,
            form = Ext.first('#fwaForm').getForm(),
            record = form.getRecord(),
            fwaStatus = record.get('fwaStatusId'),
            isScheduler = this.getView().isScheduler;

        if (( fwaStatus != FwaStatus.Approved && isScheduler) || (fwaStatus == FwaStatus.Approved && (settings.fwaIsApprover && settings.fwaCanModify != 'N') )) {
            if (context.record.get('readOnly') && (context.record.get('readOnlyReason').includes('is approved') || context.record.get('readOnlyReason').includes('have been approved'))) {
                return true;
            } else {
                if (context.record.get('readOnly')) {
                    TS.Messages.getReadOnlyMessage(context.record.get('readOnlyReason'));
                    return false;
                }
            }
        }
        else {
            if (context.record.get('readOnly')) {
                TS.Messages.getReadOnlyMessage(context.record.get('readOnlyReason'));
                return false;
            }
        }
        return true;
    },

    saveNewUnitDate: function () {
        var me = this,
            vw = me.getView(),
            form = Ext.first('#fwaForm').getForm(),
            rec = form.getRecord(),
            grid,
            store,
            model,
            datesInRange = rec.get('unitDatesInRange'), //rec.get('recurrenceDatesInRange'),
            hasNewDate = false,
            utcDate,
            currentIndex = 0,
            unitDate = Ext.Date.format(new Date(Ext.first('#addUnitDateField').getValue()), 'Y-m-d'),
            nextDate = Ext.Date.format(new Date(Ext.first('#addWorkDateField').getValue()), 'm/d/Y');

        grid.setStore(rec.get('units'));
        store = grid.getStore();
        model = store.model;

        if (!datesInRange) datesInRange = [];
        Ext.each(datesInRange, function (dt) {
            //currentIndex++;
            if (dt == unitDate + 'T00:00:00') {
                hasNewDate = true;
                return false;
            }
        });
        //if does not exists - add to dateRange
        if (!hasNewDate) {
            datesInRange.push(unitDate + 'T00:00:00');
        }

        store.setRemoteSort(false);
        store.getSorters().removeAll();
        store.each(function(rec){
            store.add(new model({
                unitCodeId: rec.get('unitCodeId'),
                unitSeq: store.getRange() && store.getRange().length > 0 ? store.getRange().length + 1 : 1,
                unitDate: new Date(Ext.first('#addUnitDateField').getValue()),
                equipmentId: rec.get('equipmentId'),
                equipmentName: rec.get('equipmentName')
            }));
        });
        store.commitChanges();
        store.filterBy(function (rec) {
            return Ext.Date.format(new Date(rec.get('unitDate')), DATE_FORMAT) === Ext.Date.format(new Date(unitDate), DATE_FORMAT);
        });
        //turn sort back on
        store.setRemoteSort(true);

        // form.dirty = true;
        // grid.getPlugins()[0].startEditByPosition({row: store.data.length - 1, column: 3});
        //
        // store.clearFilter(true);
        // store.setRemoteFilter(false);

        //console.log(store);
        Ext.first('#fwaForm').lookup('unitDateHeader').setValue(Ext.Date.format(new Date(unitDate), DATE_FORMAT));
        //turn arrows on/off
        currentIndex = 0;

        if (datesInRange && datesInRange.length > 0) {
            if (datesInRange.length == 1) {
                Ext.first('#fwaForm').lookup('lastUnitDate').setDisabled(true);
                Ext.first('#fwaForm').lookup('nextUnitDate').setDisabled(true);
            } else {
                datesInRange = datesInRange.sort(function (a, b) {
                    return new Date(a) - new Date(b);
                });

                Ext.each(datesInRange, function (dt) {
                    currentIndex++;
                    utcDate = Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                    var matches = (utcDate == Ext.Date.format(Ext.first('#addUnitDateField').getValue(), 'm/d/Y'));
                    if (matches && currentIndex == 1) {
                        Ext.first('#fwaForm').lookup('lastUnitDate').setDisabled(true);
                        Ext.first('#fwaForm').lookup('nextUnitDate').setDisabled(false);
                        return false;
                    } else if (matches && currentIndex == rec.get('unitDatesInRange').length) {
                        Ext.first('#fwaForm').lookup('lastUnitDate').setDisabled(false);
                        Ext.first('#fwaForm').lookup('nextUnitDate').setDisabled(true);
                        return false;
                    }
                });
            }
        } else {
            Ext.first('#fwaForm').lookup('lastUnitDate').setDisabled(true);
            Ext.first('#fwaForm').lookup('nextUnitDate').setDisabled(true);
        }
        vw.close();
    },

    cancelNewUnitDate: function () {
        this.getView().close();
    }
});

