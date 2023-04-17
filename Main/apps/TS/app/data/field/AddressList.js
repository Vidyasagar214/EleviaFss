Ext.define('TS.data.field.AddressList', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.addresslist',

    sortType: 'none',

    convert: function (v) {
        return v;
    },

    getType: function () {
        return 'addresslist';
    }
});
