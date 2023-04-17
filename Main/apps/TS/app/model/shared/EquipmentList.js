/**
 * Created by steve.tess on 11/23/2016.
 */
Ext.define('TS.model.shared.EquipmentList', {
    extend: 'Ext.data.Model',

    idProperty: 'equipmentId',
    identifier: 'uuid',

    fields:[
        {name: 'equipmentId', type: 'string'},
        {name: 'equipmentName', type: 'string'},
        {name: 'status', type: 'string'}
    ]
});