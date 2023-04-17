//TODO Remove, once classic has correct model 
Ext.define('TS.data.field.NotesList', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.noteslist',

    requires: [
        'TS.model.fwa.FwaNote'
    ],

    sortType: 'none',

    /*
     Converts server data to model data.
     */

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.fwa.FwaNote'
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
        return 'noteslist';
    }
});
