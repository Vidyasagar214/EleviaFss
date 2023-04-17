/**
 * Created by steve.tess on 4/21/2017.
 */
Ext.define('TS.model.shared.Dates', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'myDate', type: 'date'}
    ]

});