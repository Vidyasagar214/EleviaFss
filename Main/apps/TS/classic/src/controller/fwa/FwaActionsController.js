/**
 * Created by steve.tess on 9/13/2016.
 */
Ext.define('TS.controller.fwa.FwaActionsController', {
    extend: 'TS.common.grid.BaseGridController',
    alias: 'controller.grid-fwaactions',

    init: function () {

    },

    savePrePostActions: function (t, e) {
        var me = this,
            win = me.getView(),
            grid = Ext.first('grid-fwaactions'),
            settings = TS.app.settings,
            store = grid.getStore(),
            data = store.getRange(),
            view = me.getView(),
            regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            aCount = 0,
            aComplete = 0,
            match,
            record,
            actionList,
            descr,
            obj,
            actionData = [],
            actionTemp = '';

        Ext.each(data, function (item) {
            match = regex.exec(item.getId());
            aCount++;
            if (item.get('actionDateCompleted')) {
                aComplete++;
            }

            item.set('actionItemDescr', item.get('actionItemId'));
            item.set('actionItemId', item.get('actionItemId'));

        });

        Ext.each(data, function (obj) {
            if ((obj.get('actionDateCompleted') && !obj.get('tempDateCompleted')) ||
                (obj.get('actionDateCompleted') && obj.get('tempDateCompleted') && obj.get('actionDateCompleted') != obj.get('tempDateCompleted'))) {
                actionTemp = 'Completed';
            } else if ((obj.get('actionOwnerId') && !obj.get('tempOwnerId')) ||
                (obj.get('actionOwnerId') && obj.get('tempOwnerId') && obj.get('actionOwnerId') != obj.get('tempOwnerId'))) {
                actionTemp = 'Owner'
            } else {
                actionTemp = obj.get('actionTempSaveData');
            }

            actionData.push({
                actionItemId: obj.get('actionItemId'),
                actionItemDescr: obj.get('actionItemDescr'),
                actionTypeId: obj.get('actionTypeId'),
                actionOwnerId: obj.get('actionOwnerId'),
                actionDateCompleted: obj.get('actionDateCompleted'),
                actionNotes: obj.get('actionNotes'),
                fwaId: obj.get('fwaId'),
                actionTempSaveData: actionTemp
            });
        });

        actionList = {
            fwaId: win.fwaId,
            nonFieldActions: actionData // Ext.Array.pluck(data, 'data')
        };

        if (win.isGrid) {
            Fwa.SaveFwaActions(null, settings.username, win.fwaId, actionList, function (response) {
                if (response && response.success) {
                    win.fwaRecord.set('nonFieldActions', response.data);
                    win.fwaRecord.set('nonFieldActionCt', aCount);
                    win.fwaRecord.set('nonFieldActionCompleteCt', aComplete);
                    Ext.GlobalEvents.fireEvent('UpdateFwaGrid', win);
                } else if (response && !response.success) {
                    Ext.GlobalEvents.fireEvent('Error', response);
                }
            }, this, {
                autoHandle: true
            });

        } else {
            //add to current fwa record
            record = Ext.first('#fwaForm').getForm().getRecord();
            record.set('nonFieldActions', actionData);
        }
        //reset because onbeforeclose is called
        Ext.each(data, function (obj) {
            obj.dirty = false;
        });
        Ext.first('window-fwaactions').close();
    },

    generateUUID: function () {
        var d = new Date().getTime(),
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        return uuid;
    },

    deleteFwaAction: function () {
        var me = this,
            win = me.getView(),
            record = Ext.first('#fwaForm').getForm().getRecord(),
            grid = Ext.first('grid-fwaactions'),
            settings = TS.app.settings,
            store = grid.getStore(),
            data,
            fwaGridRecord,
            selectedRow = grid.getSelection();

        store.remove(selectedRow[0]);
        data = store.getRange();
    },

    addFwaAction: function () {
        var me = this,
            win = me.getView(),
            grid = Ext.first('#fwaactions'),
            record = Ext.first('#fwaForm').getForm().getRecord(),
            actionTypeId = Ext.getStore('ActionType').first().get('actionTypeId'),
            store = grid.getStore(),
            model = store.model,
            settings = TS.app.settings,
            item = new model({
                actionItemDescr: '(Specify action)',
                actionItemId: '',
                fwaId: record.get('fwaId'),
                actionTypeId: actionTypeId,
                actionTempSaveData: 'New',
                actionOwnerId: settings.empId
            });
        store.setRemoteSort(false);
        store.add(item);
        store.setRemoteSort(true);
    },

    assignedToChange: function (obj, nValue, oValue) {
        //Owner
    },

    onDateChange: function (obj, nValue, oValue, d) {
        //Completed
    },

    cancelPrePostActions: function () {
        var me = this,
            grid = Ext.first('#fwaactions'),
            store = grid.getStore(),
            win = me.getView();
        store.rejectChanges();
        win.close();
    },

    onActionItemsClose: function () {
        var grid = Ext.first('#fwaactions'),
            store = grid.getStore();
        store.rejectChanges();
    },

    onActionItemsBeforeClose: function (win, e, d) {
        var me = this,
            grid = Ext.first('#fwaactions'),
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
    },

    clearCompleteDate: function (grid, rowIndex) {
        var store = grid.store,
            settings = TS.app.settings,
            record = store.getAt(rowIndex);
        record.set('actionDateCompleted', '');
    }

});