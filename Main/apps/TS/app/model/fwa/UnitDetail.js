/**
 * Created by steve.tess on 11/28/2016.
 */
Ext.define('TS.model.fwa.UnitDetail', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'dtDate', type: 'date', dateFormat: 'c'},
        {name: 'lValue1', type: 'float'},
        {name: 'lValue2', type: 'float'},
        {name: 'lValue3', type: 'float'},
        {name: 'sValue1', type: 'string'},
        {name: 'from', type: 'string'},
        {name: 'to', type: 'string'}
    ]

});