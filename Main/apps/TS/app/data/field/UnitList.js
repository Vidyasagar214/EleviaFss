/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.data.field.UnitList', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.unitlist',

    requires: [
        'TS.model.fwa.Unit'
    ],

    sortType: 'none',

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.fwa.Unit'
        });

        if (v) {
            store.loadData(v);
        }

        return store;
    },

    serialize: function (v) {
        return Ext.Array.pluck(v.getRange(), 'data')
    },

    getType: function () {
        return 'unitlist';
    }
});