/**
 * Created by steve.tess on 7/11/2018.
 */
Ext.define('TS.data.field.ExpensesList', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.explines',

    requires: [
        'TS.model.exp.Expense'
    ],

    sortType: 'none',

    /*
     Converts server data to model data.
     */

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.exp.Expense'
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
        return 'explines';
    }
});

