/**
 * Created by steve.tess on 9/6/2016.
 */
Ext.define('TS.data.field.FwaActionList', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.actionlist',

    requires: [
        'TS.model.fwa.FwaAction'
    ],

    convert: function (v) {

        var store = Ext.create('Ext.data.Store', {
            model: 'TS.model.fwa.FwaAction',
            sorters:[
                {
                    property: 'actionTypeId',
                    direction: 'Desc'
                }
            ]
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
        return 'actionlist';
    }
});