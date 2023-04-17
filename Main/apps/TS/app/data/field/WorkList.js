Ext.define('TS.data.field.WorkList', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.worklist',

    requires: [
        'TS.model.fwa.Work'
    ],

    sortType: 'none',

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.fwa.Work'
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
        return 'worklist';
    }
});
