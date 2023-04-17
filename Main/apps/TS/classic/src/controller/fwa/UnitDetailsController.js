/**
 * Created by steve.tess on 11/29/2016.
 */
Ext.define('TS.controller.fwa.UnitDetailsController', {
    extend: 'TS.common.grid.BaseGridController',
    alias: 'controller.grid-unitdetails',

    init: function () {
        var me = this,
            vm = me.getViewModel(),
            vw = me.getView();
        vm.set('readOnly', vw.config.readOnly);
        //show - hide based on parent value
        vw.lookup('detailsAdd').setHidden(vm.get('readOnly'));
        vw.lookup('detailsDelete').setHidden(vm.get('readOnly'));
        vw.lookup('detailsSave').setHidden(vm.get('readOnly'));
    },

    addUnitDetails: function () {
        var me = this,
            grid = Ext.first('#unitdetails'),
            store = grid.getStore(),
            model = store.model,
            settings = TS.app.settings,
            item = new model({
                dtDate: new Date()
            });

        store.getSorters().removeAll();
        store.add(item);
    },

    deleteUnitDetails: function () {
        var me = this,
            grid = Ext.first('#unitdetails'),
            settings = TS.app.settings,
            store = grid.getStore(),
            selectedRow = grid.getSelection();

        store.remove(selectedRow[0]);
    },

    cancelUnitDetails: function () {
        var me = this,
            grid = Ext.first('#unitdetails'),
            store = grid.getStore(),
            win = me.getView();
        store.rejectChanges();
        win.close();
    },

    saveUnitDetails: function () {
        var me = this,
            win = me.getView(),
            grid = Ext.first('grid-unitdetails'),
            store = grid.getStore(),
            data = store.getRange(),
            unitDetailData = [],
            ttlMiles = 0;

        Ext.each(data, function (obj) {
            unitDetailData.push({
                dtDate: obj.get('dtDate'),
                lValue1: obj.get('lValue1'),
                lValue2: obj.get('lValue2'),
                lValue3: obj.get('lValue2') - obj.get('lValue1'),
                sValue1: obj.get('sValue1'),
                from: obj.get('from'),
                to: obj.get('to')
            });
            ttlMiles += obj.get('lValue2') - obj.get('lValue1');
        });

        win.unitRecord.set('details', unitDetailData);
        win.unitRecord.set('quantity', ttlMiles);
        win.close();
    },

    onUnitDetailsBeforeClose: function (win, e, d) {
        var me = this,
            grid = Ext.first('#unitdetails'),
            store = grid.getStore(),
            records = store.getRange(),
            isDirty = false;

        Ext.each(records, function (rec) {
            if (rec.dirty) {
                isDirty = true;
            }
        });

        // user has already answered yes
        if (win.closeMe) {
            win.closeMe = false;
            return true;
        }

        if (isDirty) {
            // ask user if really close
            Ext.Msg.show({
                title: 'Warning'
                , msg: 'Changes have been made. Do you want to continue without saving?'
                , buttons: Ext.Msg.YESNO
                , callback: function (btn) {
                    if ('yes' === btn) {
                        store.rejectChanges();
                        // save the user answer
                        win.closeMe = true;
                        // call close once again
                        win.close();
                    }
                }
            });
        } else {
            store.rejectChanges();
            // save the user answer
            win.closeMe = true;
            // call close once again
            win.close();
        }

        // Always cancel closing if we get here
        return false;
    }
});