/**
 * Created by steve.tess on 1/31/2018.
 */
Ext.define('TS.model.fwa.CrewChief', {
    extend: 'TS.model.Base',

    idProperty: 'id',
    identifier: 'uuid',

    fields: [
        {name: 'id', type: 'auto'},
        {name: 'crewChiefEmpId', type: 'string'},
        {name: 'crewChiefEmpName', type: 'string'}
    ]
});