/**
 * Created by steve.tess on 3/14/2017.
 */
Ext.define('TS.data.field.RecurrenceDatesInRange', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.recurrenceDates',

    requires: [
        'TS.model.fwa.DateList'
    ],

    sortType: 'none',

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.fwa.DateList'
        });

        if (v) {
            store.loadData(v);
        }

        return store;
    },

    serialize: function (v) {
        if (v) {
            return Ext.Array.pluck(v.getRange(), 'data');
        }
        return v;
    },

    getType: function () {
        return 'recurrenceDates';
    }

});