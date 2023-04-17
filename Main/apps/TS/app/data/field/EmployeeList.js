Ext.define('TS.data.field.EmployeeList', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.employeelist',

    sortType: 'none',

    /*
     Converts server data to model data.
     */

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.shared.Employee'
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
        return 'employeelist';
    }
});
