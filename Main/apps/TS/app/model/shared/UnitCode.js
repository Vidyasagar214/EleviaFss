/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.model.shared.UnitCode', {
    extend: 'Ext.data.Model',

    idProperty: 'unitCodeId',
    identifier: 'uuid',

    fields:[
        {name: 'unitCodeId', type: 'string'},
        {name: 'unitCodeAbbrev', type: 'string'},
        {name: 'unitCodeName', type: 'string'},
        {name: 'status', type: 'string'},
        {name: 'equipSelection', type: 'bool'},
        {name: 'equipSource', type: 'string'},
        {name: 'requireDetail', type: 'string'},
        {
            name: 'unitCodeCombo',
            mapping: function (data) {
                return data.unitCodeAbbrev + ' : ' + data.unitCodeName
            }
        }
    ]
});