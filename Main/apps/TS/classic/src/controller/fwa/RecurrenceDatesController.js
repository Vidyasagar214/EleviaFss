/**
 * Created by steve.tess on 4/21/2017.
 */
Ext.define('TS.controller.fwa.RecurrenceDatesController', {
    extend: 'TS.view.main.MainController',

    alias: 'controller.recurrencedates',
    config: {},

    init: function () {
        var me = this,
            vw = me.getView(),
            exceptGrid = Ext.first('#exceptDatesGrid'),
            exceptGridStore,
            addlGrid = Ext.first('#addlDatesGrid'),
            addlGridStore,
            model,
            record = vw.fwa.get('recurrenceConfig'),
            utcDate;

        exceptGridStore = exceptGrid.getStore();
        addlGridStore = addlGrid.getStore();
        model = addlGridStore.model;
        if (record) {
            Ext.each(record.addlDates, function (dt) {
                utcDate = new Date(Ext.Date.format(new Date(dt), DATE_FORMAT));// Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                addlGridStore.add(new model({
                    myDate: utcDate
                }));
            });
            Ext.each(record.exceptDates, function (dt) {
                utcDate = new Date(Ext.Date.format(new Date(dt)), DATE_FORMAT);//Ext.Date.format(new Date(new Date(dt).getUTCMonth() + 1 + '/' + new Date(dt).getUTCDate() + '/' + new Date(dt).getUTCFullYear()), DATE_FORMAT);
                exceptGridStore.add(new model({
                    myDate: utcDate
                }));
            });
        } else {

        }
    },

    onUpdateRecurrenceDates: function (t) {
        //force focus in case user jumped to button
        t.focus();
        var me = this,
            vw = me.getView(),
            exceptGrid = Ext.first('#exceptDatesGrid'),
            addlGrid = Ext.first('#addlDatesGrid'),
            record = vw.fwa.get('recurrenceConfig'),
            addlArray = [],
            exceptArray = [];
        //eliminate any duplicates with collect
        record.addlDates = addlGrid.getStore().collect('myDate');
        Ext.each(record.addlDates, function(dt){
            addlArray.push(Ext.Date.format(dt, 'Ymd'));
        });
        record.exceptDates = exceptGrid.getStore().collect('myDate');
        Ext.each(record.exceptDates, function(dt){
            exceptArray.push(Ext.Date.format(dt, 'Ymd'));
        });
        Ext.first('window-recurrencedates').close();
    },

    onCancelRecurrenceDates: function () {
        Ext.first('window-recurrencedates').close();
    },

    onExceptDates: function () {
        var me = this,
            grid = Ext.first('#exceptDatesGrid'),
            store = grid.getStore(),
            model = store.model,
            utcDate = Ext.Date.format(new Date(new Date().getUTCMonth() + 1 + '/' + new Date().getUTCDate() + '/' + new Date().getUTCFullYear()), DATE_FORMAT);

        store.setRemoteSort(false);
        store.add(new model({
            myDate: utcDate
        }));
        store.commitChanges();
        store.setRemoteSort(true);
    },

    onAddlDates: function () {
        var me = this,
            grid = Ext.first('#addlDatesGrid'),
            store = grid.getStore(),
            model = store.model,
            utcDate = Ext.Date.format(new Date(new Date().getUTCMonth() + 1 + '/' + new Date().getUTCDate() + '/' + new Date().getUTCFullYear()), DATE_FORMAT);

        store.setRemoteSort(false);
        store.add(new model({
            myDate: utcDate
        }));
        store.commitChanges();
        store.setRemoteSort(true);
    },

    deleteDate: function (grid, rowIndex) {
        grid.getStore().getAt(rowIndex).drop();
    }
});