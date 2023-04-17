/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.model.fwa.Equipment', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',
    fields: [
        {name: 'id', type: 'auto'},
        {name: 'equipmentId', type: 'string'},
        {name: 'equipmentName', type: 'string'},
        {name: 'status', type: 'string'}
    ]

});