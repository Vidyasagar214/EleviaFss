/**
 * Created by steve.tess on 3/20/2017.
 */
Ext.define('TS.model.shared.Hours', {
    extend: 'Ext.data.Model',

    model: '',
    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'value', type: 'date'},
        {name: 'description', type: 'date'}
    ]

});