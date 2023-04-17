/**
 * Created by steve.tess on 11/28/2016.
 */
Ext.define('TS.data.field.UnitDetailList', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.unitdetaillist',

    requires: [
        'TS.model.fwa.UnitDetail'
    ],

    sortType: 'none',

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.fwa.UnitDetail'
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
        return 'unitdetaillist';
    }
});