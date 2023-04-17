/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.model.fwa.Unit', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    requires: [
        'TS.data.field.UnitDetailList',
        'TS.model.fwa.UnitDetail'
    ],

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'unitCodeId', type: 'string'},
        {name: 'unitSeq', type: 'string'},
        {name: 'quantity', type: 'float'},
        {name: 'equipmentId', type: 'string'},
        {name: 'equipmentName', type: 'string'},
        {name: 'comments', type: 'string'},
        {name: 'unitDate', type: 'date'},
        {name: 'details', type: 'unitdetaillist'},
        {name: 'readOnly', type: 'bool'},
        {name: 'readOnlyReason', type: 'string'}
    ]

});