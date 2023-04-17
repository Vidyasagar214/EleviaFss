Ext.define('TS.data.field.Address', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.address',

    sortType: 'none',

    convert: function (v) {

        if (Ext.isObject(v)) {
            return Ext.create('CrewDesk.model.Address', v);
        }
        else {
            return Ext.create('CrewDesk.model.Address');
        }

    },

    getType: function () {
        return 'address';
    }

});
